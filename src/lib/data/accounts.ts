'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useCompanyId } from '@/store/auth';
import type { Tables } from '@/lib/supabase/database.types';

export type Account = Tables<'accounts'>;
export type AccountCategory = 'asset' | 'liability' | 'equity';

export function useAccounts() {
  const companyId = useCompanyId();
  return useQuery({
    queryKey: ['accounts', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('company_id', companyId!)
        .order('code', { ascending: true, nullsFirst: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as Account[];
    },
  });
}

export function useCreateAccount() {
  const companyId = useCompanyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; category: AccountCategory; balance?: number; code?: string }) => {
      if (!companyId) throw new Error('No active company');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('accounts')
        .insert({ company_id: companyId, sort_order: 100, ...input })
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useUpdateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...patch
    }: {
      id: string;
      name?: string;
      category?: AccountCategory;
      balance?: number;
      code?: string;
    }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('accounts')
        .update(patch)
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from('accounts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
