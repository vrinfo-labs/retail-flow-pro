import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Caixa {
  id: string;
  identificacao: string;
  localizacao?: string;
  impressora_termica?: string;
  status: 'ativo' | 'inativo';
}

export interface CaixaInsert {
  identificacao: string;
  localizacao?: string;
  impressora_termica?: string;
  status: 'ativo' | 'inativo';
}

// Hook to fetch all caixas
export function useCaixas() {
  return useQuery<Caixa[], Error>({
    queryKey: ['caixas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('caixas').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
  });
}

// Hook to create a new caixa
export function useCreateCaixa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (caixa: CaixaInsert) => {
      const { data, error } = await supabase.from('caixas').insert([caixa]).select();
      if (error) throw new Error(error.message);
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caixas'] });
    },
  });
}

// Hook to update a caixa
export function useUpdateCaixa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (caixa: Partial<Caixa> & { id: string }) => {
      const { data, error } = await supabase.from('caixas').update(caixa).eq('id', caixa.id).select();
      if (error) throw new Error(error.message);
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caixas'] });
    },
  });
}
