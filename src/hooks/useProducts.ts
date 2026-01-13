import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  codigo: string | null;
  codigo_barras: string | null;
  nome: string;
  descricao: string | null;
  supplier_id: string;
  categoria_id: string | null;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  estoque_minimo: number;
  unidade: string | null;
  ativo: boolean | null;
  imagem_url: string | null;
  categories?: { nome: string } | null;
  suppliers?: { nome_fantasia: string } | null;
}

export interface ProductInsert {
  codigo?: string;
  codigo_barras?: string;
  nome: string;
  descricao?: string;
  supplier_id: string;
  categoria_id?: string;
  preco_custo: number;
  preco_venda: number;
  estoque?: number;
  estoque_minimo?: number;
  unidade?: string;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(nome), suppliers(nome_fantasia)")
        .eq("ativo", true)
        .order("nome");

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("nome");

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Produto cadastrado",
        description: "O produto foi adicionado com sucesso.",
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
