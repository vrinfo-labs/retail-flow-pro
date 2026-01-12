import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export function useSale(id: string | undefined) {
  return useQuery({
    queryKey: ['sale', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          customers (*),
          profiles (*),
          sale_items (*, products (*))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id, // Only run the query if an ID is provided
  });
}
