import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  codigo: string | null;
  codigo_barras: string | null;
  nome: string;
  descricao: string | null;
  categoria_id: string | null;
  supplier_id: string | null;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  estoque_minimo: number;
  unidade: string | null;
  ativo: boolean | null;
  imagem_url: string | null;
  categories?: { nome: string } | null;
  suppliers?: { nome: string } | null;
}

export interface ProductInsert {
  codigo?: string;
  codigo_barras?: string;
  nome: string;
  descricao?: string;
  categoria_id?: string;
  supplier_id?: string;
  preco_custo: number;
  preco_venda: number;
  estoque?: number;
  estoque_minimo?: number;
  unidade?: string;
}

export type StockStatus = 'all' | 'normal' | 'low' | 'critical';

export interface ProductFilters {
  searchTerm?: string;
  category?: string;
  stockStatus?: StockStatus;
}

export interface ProductHistory {
  id: string;
  created_at: string;
  tipo: 'venda' | 'compra' | 'ajuste_entrada' | 'ajuste_saida' | 'devolucao';
  quantidade: number;
  saldo_anterior: number;
  saldo_novo: number;
  observacao: string | null;
  users: { nome: string } | null;
}

export function useProducts(filters: ProductFilters = {}) {
  const { searchTerm, category, stockStatus } = filters;

  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_products', {
        p_search_term: searchTerm,
        p_category_id: category,
        p_stock_status: stockStatus,
      }).select('*, categories(nome), suppliers(nome)');

      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(nome), suppliers(nome)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });
}

export function useProductHistory(productId: string) {
  return useQuery({
    queryKey: ['productHistory', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('estoque_movimento')
        .select('*, users(nome)')
        .eq('produto_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProductHistory[];
    },
    enabled: !!productId,
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

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
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
