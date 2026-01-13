import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fetch all pedidos
export function usePedidos() {
  return useQuery({
    queryKey: ['pedidos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          id,
          created_at,
          total,
          status,
          customers ( nome )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

// Fetch a single pedido by id
export function usePedido(id: string) {
  return useQuery({
    queryKey: ['pedido', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          id,
          status,
          total,
          created_at,
          customer:customers ( nome, email, telefone ),
          pedido_items (
            id,
            quantity,
            reference,
            unit_price,
            product:products(id, nome, codigo_barras),
            supplier:suppliers(id, nome_fantasia)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id, // Only run query if id is available
  });
}

// Create a new pedido
export function useCreatePedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pedidoData: { customer_id: string; total: number; status: string; pedido_items: any[] }) => {
      // 1. Insert into pedidos table
      const { data: pedido, error: pedidoError } = await supabase
        .from('pedidos')
        .insert({
          customer_id: pedidoData.customer_id,
          total: pedidoData.total,
          status: pedidoData.status,
        })
        .select('id')
        .single();

      if (pedidoError) {
        throw new Error(pedidoError.message);
      }

      // 2. Prepare and insert into pedido_items table
      const pedidoItemsData = pedidoData.pedido_items.map(item => ({
        pedido_id: pedido.id,
        product_id: item.product_id,
        supplier_id: item.supplier_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        reference: item.reference,
      }));

      const { error: itemsError } = await supabase.from('pedido_items').insert(pedidoItemsData);

      if (itemsError) {
        // If items insertion fails, delete the just-created pedido to keep data consistent.
        await supabase.from('pedidos').delete().eq('id', pedido.id);
        throw new Error(`Erro ao salvar itens do pedido: ${itemsError.message}`);
      }

      return { ...pedido, ...pedidoData }; // Return the full object for cache update
    },
    onSuccess: (data) => {
      // When a new order is created, we invalidate the 'pedidos' query to refetch the list.
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      // We can also warm up the cache for the new pedido detail view
      queryClient.setQueryData(['pedido', data.id], data);
    },
  });
}
