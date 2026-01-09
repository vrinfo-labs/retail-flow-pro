import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Tipos para fornecedores
export interface Supplier {
  id: string;
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string | null;
  contato: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  observacoes: string | null;
  deleted_at: string | null; // Adicionado para soft delete
  created_at: string;
}

export type SupplierInsert = Omit<Supplier, 'id' | 'created_at' | 'deleted_at'>;
export type SupplierUpdate = Partial<SupplierInsert>;

// Hook para buscar fornecedores ativos
export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .is('deleted_at', null) // Filtra os não deletados
        .order("razao_social");

      if (error) throw error;
      return data as Supplier[];
    },
  });
}

// Hook para criar um novo fornecedor
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
      toast({
        title: "Fornecedor cadastrado",
        description: "O fornecedor foi adicionado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao cadastrar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook para atualizar um fornecedor
export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...supplier }: { id: string } & SupplierUpdate) => {
      const { data, error } = await supabase
        .from("suppliers")
        .update(supplier)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Fornecedor atualizado",
        description: "Os dados do fornecedor foram atualizados.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook para deletar (soft delete) um fornecedor
export function useSoftDeleteSupplier() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from("suppliers")
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast({
        title: "Fornecedor removido",
        description: "O fornecedor foi movido para a lixeira.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
