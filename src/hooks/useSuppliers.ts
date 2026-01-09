import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Interfaces
export interface Supplier {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  cnpj: string | null;
  ativo: boolean;
}

export interface SupplierInsert {
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cnpj?: string;
}

export interface SupplierFilters {
  searchTerm?: string;
}

// Hooks
export function useSuppliers(filters: SupplierFilters = {}) {
  const { searchTerm } = filters;

  return useQuery({
    queryKey: ["suppliers", filters],
    queryFn: async () => {
      let query = supabase
        .from("suppliers")
        .select("*")
        .eq("ativo", true);

      if (searchTerm) {
        query = query.or(`nome.ilike.%${searchTerm}%,cnpj.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order("nome");

      if (error) throw error;
      return data as Supplier[];
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (supplier: SupplierInsert) => {
      const { data, error } = await supabase
        .from("suppliers")
        .insert(supplier)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Invalidate products to refresh supplier info
      toast({ title: "Fornecedor cadastrado", description: "O fornecedor foi criado com sucesso." });
    },
    onError: (error) => {
      toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (supplier: Partial<SupplierInsert> & { id: string }) => {
      const { data, error } = await supabase
        .from("suppliers")
        .update(supplier)
        .eq('id', supplier.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Fornecedor atualizado", description: "As informações foram salvas." });
    },
    onError: (error) => {
      toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("suppliers")
        .update({ ativo: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Fornecedor excluído", description: "O fornecedor foi movido para a lixeira." });
    },
    onError: (error) => {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    },
  });
}
