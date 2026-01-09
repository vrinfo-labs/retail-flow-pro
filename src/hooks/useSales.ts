import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SaleItemInsert {
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface SaleInsert {
  customer_id: string;
  total_amount: number;
  payment_method: string;
  installments?: number;
  items: SaleItemInsert[];
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sale: SaleInsert) => {
      const { data, error } = await supabase.rpc('create_sale', {
        p_customer_id: sale.customer_id,
        p_total_amount: sale.total_amount,
        p_payment_method: sale.payment_method,
        p_installments: sale.installments,
        p_items: sale.items,
      });

      if (error) {
        console.error("Error creating sale:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast({
        title: "Venda realizada",
        description: "A venda foi registrada com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao registrar venda",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
