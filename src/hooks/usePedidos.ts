import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function usePedido(id: string) {
  return useQuery({
    queryKey: ['pedido', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          pedido_items (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });
}
