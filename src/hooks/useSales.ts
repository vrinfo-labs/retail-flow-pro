import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Sale } from "@/integrations/supabase/types";

// Tipos para inserção e atualização de vendas, alinhados com a função do banco de dados
export type SaleItemInsert = {
  product_id: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
  subtotal: number;
};

export type SaleDataInsert = {
  customer_id?: string;
  operator_id: string;
  subtotal: number;
  desconto: number;
  total: number;
  forma_pagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'crediario';
  status: 'pendente' | 'parcial' | 'quitado' | 'atrasado';
  observacoes?: string;
};

export type SaleInsert = {
  sale_data: SaleDataInsert;
  sale_items: SaleItemInsert[];
};

// Hook para buscar vendas com paginação, filtro e busca
export function useSales(
  { page, perPage, searchTerm, dateRange, status }: 
  { page: number, perPage: number, searchTerm: string, dateRange?: { from: Date; to: Date }, status: string }
) {
  return useQuery({
    queryKey: ["sales", { page, perPage, searchTerm, dateRange, status }],
    queryFn: async () => {
      let query = supabase
        .from("sales")
        .select(
          `
          id,
          created_at,
          status,
          total,
          canceled_at,
          customers (nome, telefone),
          profiles (nome)
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1);

      if (status !== "all") {
        query = query.eq("status", status);
      }
      if (dateRange?.from) {
        query = query.gte("created_at", dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte("created_at", dateRange.to.toISOString());
      }
      if (searchTerm) {
        query = query.ilike("customers.nome", `%${searchTerm}%`);
      }

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);

      // Mapear dados para um formato mais plano e fácil de usar na UI
      const sales = data.map((sale: any) => ({
        ...sale,
        customer_name: sale.customers?.nome ?? 'N/A',
        operator_name: sale.profiles?.nome ?? 'N/A',
      }));

      return { data: sales, count };
    },
  });
}

// Hook para criar uma nova venda
export function useCreateSale() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ sale_data, sale_items }: SaleInsert) => {
      const { error } = await supabase.rpc("create_sale_with_items", {
        sale_data,
        sale_items,
      });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast({
        title: "Venda Criada!",
        description: "A nova venda foi registrada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar venda",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook para cancelar uma venda
export function useCancelSale() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("cancel_sale", { p_sale_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast({ title: "Venda cancelada", description: "A venda foi cancelada e o estoque atualizado." });
    },
    onError: (error) => {
      toast({ title: "Erro ao cancelar", description: error.message, variant: "destructive" });
    },
  });
}

// Hook para notificações (simulação com WhatsApp)
export function useNotifyClient() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ phone, message }: { phone: string; message: string }) => {
      const sanitizedPhone = phone.replace(/\D/g, "");
      const whatsappUrl = `https://api.whatsapp.com/send?phone=55${sanitizedPhone}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    },
    onSuccess: () => {
      toast({
        title: "Notificação Enviada",
        description: "A mensagem para o cliente foi aberta no WhatsApp.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao Notificar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
