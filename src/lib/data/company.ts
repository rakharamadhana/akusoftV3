'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, useCompanyId, type ActiveCompany } from '@/store/auth';
import type { TablesUpdate } from '@/lib/supabase/database.types';

/** Load every company the current user belongs to (oldest first). */
export async function loadUserCompanies(): Promise<ActiveCompany[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_companies')
    .select('companies(*)')
    .order('created_at', { ascending: true });
  if (error) throw error;
  const out: ActiveCompany[] = [];
  for (const row of data ?? []) {
    const c = (row as { companies: ActiveCompany | ActiveCompany[] | null }).companies;
    const one = Array.isArray(c) ? c[0] : c;
    if (one) out.push(one);
  }
  return out;
}

/** Update the active company's profile (Pengaturan → Umum / Mata Uang, onboarding). */
export function useUpdateCompany() {
  const companyId = useCompanyId();
  const upsertCompany = useAuthStore((s) => s.upsertCompany);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patch: TablesUpdate<'companies'>) => {
      if (!companyId) throw new Error('No active company');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('companies')
        .update(patch)
        .eq('id', companyId)
        .select('*')
        .single();
      if (error) throw error;
      return data as ActiveCompany;
    },
    onSuccess: (data) => {
      upsertCompany(data);
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

/** Create a new company (with seeded defaults) and switch to it. Max 3 companies per user. */
export function useCreateCompany() {
  const setCompanies = useAuthStore((s) => s.setCompanies);
  const setActiveCompanyId = useAuthStore((s) => s.setActiveCompanyId);

  return useMutation({
    mutationFn: async (input: { name: string; email?: string; tax_number?: string }) => {
      const existing = await loadUserCompanies();
      if (existing.length >= 3) {
        throw new Error('Batas maksimal 3 perusahaan telah tercapai (3/3).');
      }
      const supabase = createClient();
      const { data, error } = await supabase.rpc('create_company_with_defaults', {
        p_name: input.name,
        p_email: input.email || undefined,
        p_tax_number: input.tax_number || undefined,
      });
      if (error) throw error;
      const companies = await loadUserCompanies();
      setCompanies(companies);
      setActiveCompanyId(data as string);
      return data as string;
    },
  });
}

/** Delete a company and all associated data permanently. */
export function useDeleteCompany() {
  const setCompanies = useAuthStore((s) => s.setCompanies);
  const setActiveCompanyId = useAuthStore((s) => s.setActiveCompanyId);
  const activeCompanyId = useAuthStore((s) => s.activeCompanyId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetCompanyId: string) => {
      const supabase = createClient();

      // 1. Delete child records first to satisfy foreign key constraints
      await supabase.from('transactions').delete().eq('company_id', targetCompanyId);
      await supabase.from('items').delete().eq('company_id', targetCompanyId);
      await supabase.from('categories').delete().eq('company_id', targetCompanyId);
      await supabase.from('payment_methods').delete().eq('company_id', targetCompanyId);
      await supabase.from('accounts').delete().eq('company_id', targetCompanyId);

      // 2. Delete company row while user_companies permission is still intact
      const { error: companyErr } = await supabase.from('companies').delete().eq('id', targetCompanyId);
      if (companyErr) {
        console.error('Failed to delete company:', companyErr);
        throw new Error(companyErr.message || 'Gagal menghapus perusahaan.');
      }

      // 3. Clean up user_companies junction table
      await supabase.from('user_companies').delete().eq('company_id', targetCompanyId);

      // 4. Refresh store & active company state
      const remainingCompanies = await loadUserCompanies();
      setCompanies(remainingCompanies);

      if (activeCompanyId === targetCompanyId) {
        if (remainingCompanies.length > 0) {
          setActiveCompanyId(remainingCompanies[0].id);
        } else {
          setActiveCompanyId('');
        }
      }
      return targetCompanyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}
