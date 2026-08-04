'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useCompanyId } from '@/store/auth';
import type { Tables } from '@/lib/supabase/database.types';

export type PaymentMethod = Tables<'payment_methods'>;

export function usePaymentMethods() {
  const companyId = useCompanyId();
  return useQuery({
    queryKey: ['payment_methods', companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('company_id', companyId!)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as PaymentMethod[];
    },
  });
}

export function useCreatePaymentMethod() {
  const companyId = useCompanyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; details?: string }) => {
      if (!companyId) throw new Error('No active company');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({ company_id: companyId, ...input })
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment_methods'] }),
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from('payment_methods').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment_methods'] }),
  });
}
