import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/integrations/supabase/types";

export type OrderInsert = Omit<Order, "id" | "created_at" | "items" | "total"> & {
  items: {
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
  }[];
};

export type OrderUpdate = Partial<OrderInsert>;

export function useOrders(
  { page, perPage, searchTerm, dateRange, status }: 
  { page: number, perPage: number, searchTerm: string, dateRange: { from: Date; to: Date } | undefined, status: string }
) {
  return useQuery({
    queryKey: ["orders", { page, perPage, searchTerm, dateRange, status }],
    queryFn: async () => {
      let query = supabase
        .from("sales")
        .select(
          `
          id,
          created_at,
          status,
          total,
          customers (
            nome,
            telefone
          )
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

      return {
        data: data.map((order: any) => ({
          ...order,
          cliente_nome: order.customers.nome,
          cliente_telefone: order.customers.telefone,
        })),
        count,
      };
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (order: OrderInsert) => {
      const { error } = await supabase.rpc("create_order_with_items", {
        p_customer_id: order.customer_id,
        p_status: order.status,
        p_items: order.items,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Pedido Criado!",
        description: "O novo pedido foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar pedido",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc("cancel_order", { p_order_id: id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Pedido cancelado", description: "O pedido foi cancelado e o estoque atualizado." });
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
      // Remove non-numeric characters from the phone number
      const sanitizedPhone = phone.replace(/\D/g, "");
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${sanitizedPhone}&text=${encodeURIComponent(
        message
      )}`;
      
      // In a real app, you might use a backend service to send the message.
      // For this simulation, we'll just open the WhatsApp link in a new tab.
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
