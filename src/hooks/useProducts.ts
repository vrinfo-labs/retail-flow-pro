import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ... (interfaces Product, ProductInsert, etc. permanecem as mesmas)

export function useProducts(filters: ProductFilters = {}) {
  const { searchTerm, category, stockStatus } = filters;

  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_products', {
        p_search_term: searchTerm,
        p_category_id: category,
        p_stock_status: stockStatus,
      }).select('*, categories(nome)');

      if (error) throw error;
      return data as Product[];
    },
  });
}

// ... (useProduct, useProductHistory, useCategories permanecem os mesmos)

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

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (product: Partial<ProductInsert> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq('id', product.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      toast({
        title: "Produto atualizado",
        description: "As informações do produto foram salvas.",
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

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .update({ ativo: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ 
        title: "Produto excluído", 
        description: "O produto foi movido para a lixeira.",
        variant: "success"
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
