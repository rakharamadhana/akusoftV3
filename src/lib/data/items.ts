'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useCompanyId } from '@/store/auth';
import type { Tables, TablesInsert } from '@/lib/supabase/database.types';

export type Item = Tables<'items'>;

export function useItems() {
  const companyId = useCompanyId();
  return useQuery({
    queryKey: ['items', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('company_id', companyId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Item[];
    },
  });
}

export type NewItemInput = Omit<TablesInsert<'items'>, 'company_id'>;

export function useCreateItem() {
  const companyId = useCompanyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewItemInput) => {
      if (!companyId) throw new Error('No active company');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('items')
        .insert({ ...input, company_id: companyId })
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from('items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  });
}
