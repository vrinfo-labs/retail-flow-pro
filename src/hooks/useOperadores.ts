import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface Operador {
  id: string;
  nome: string;
  login: string;
  horario_trabalho?: string;
}

export interface OperadorInsert {
  nome: string;
  login: string;
  senha?: string;
  horario_trabalho?: string;
}

// Hook to fetch all operadores
export function useOperadores() {
  return useQuery<Operador[], Error>({
    queryKey: ['operadores'],
    queryFn: async () => {
      const { data, error } = await supabase.from('operadores').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
  });
}

// Hook to create a new operador
export function useCreateOperador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (operador: OperadorInsert) => {
      const { data, error } = await supabase.from('operadores').insert([operador]).select();
      if (error) throw new Error(error.message);
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operadores'] });
    },
  });
}

// Hook to update an operador
export function useUpdateOperador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (operador: Partial<Operador> & { id: string }) => {
      const { data, error } = await supabase.from('operadores').update(operador).eq('id', operador.id).select();
      if (error) throw new Error(error.message);
      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operadores'] });
    },
  });
}
