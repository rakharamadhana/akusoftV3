'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useCompanyId } from '@/store/auth';
import type { Tables } from '@/lib/supabase/database.types';

export type Transaction = Tables<'transactions'> & {
  accounts: { name: string } | null;
  transaction_items: Tables<'transaction_items'>[];
};

export type TxTypeFilter = 'all' | 'income' | 'expense';

export function useTransactions(filter: TxTypeFilter = 'all') {
  const companyId = useCompanyId();
  return useQuery({
    queryKey: ['transactions', companyId, filter],
    enabled: !!companyId,
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from('transactions')
        .select('*, accounts(name), transaction_items(*)')
        .eq('company_id', companyId!)
        .order('paid_at', { ascending: false });
      if (filter !== 'all') query = query.eq('type', filter);
      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as Transaction[];
    },
  });
}

export function useTransaction(id?: string) {
  const companyId = useCompanyId();
  return useQuery({
    queryKey: ['transaction', companyId, id],
    enabled: !!companyId && !!id,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('transactions')
        .select('*, accounts(name), transaction_items(*)')
        .eq('company_id', companyId!)
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data as unknown as Transaction;
    },
  });
}

export interface IncomeLine {
  item_id?: string | null;
  name: string;
  quantity: number;
  price: number;
}

export interface NewIncomeInput {
  paid_at: string; // ISO date
  amount: number;
  account_id: string | null;
  customer?: string;
  income_type?: string;
  category?: string;
  description?: string;
  basis?: 'cash' | 'credit';
  lines?: IncomeLine[];
}

export function useCreateIncome() {
  const companyId = useCompanyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewIncomeInput) => {
      if (!companyId) throw new Error('No active company');
      const supabase = createClient();
      const { lines = [], ...header } = input;
      const { data: tx, error } = await supabase
        .from('transactions')
        .insert({ ...header, company_id: companyId, type: 'income' })
        .select('id')
        .single();
      if (error) throw error;

      const validLines = lines.filter((l) => l.name.trim() !== '');
      if (validLines.length > 0) {
        const { error: liError } = await supabase.from('transaction_items').insert(
          validLines.map((l) => ({
            transaction_id: tx.id,
            company_id: companyId,
            item_id: l.item_id ?? null,
            name: l.name,
            quantity: l.quantity,
            price: l.price,
            total: l.quantity * l.price,
          })),
        );
        if (liError) throw liError;
      }
      return tx;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export interface UpdateIncomeInput extends NewIncomeInput {
  id: string;
}

export function useUpdateIncome() {
  const companyId = useCompanyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateIncomeInput) => {
      if (!companyId) throw new Error('No active company');
      const supabase = createClient();
      const { id, lines = [], ...header } = input;
      const { error } = await supabase
        .from('transactions')
        .update(header)
        .eq('id', id)
        .eq('company_id', companyId);
      if (error) throw error;

      const { error: delError } = await supabase
        .from('transaction_items')
        .delete()
        .eq('transaction_id', id)
        .eq('company_id', companyId);
      if (delError) throw delError;

      const validLines = lines.filter((l) => l.name.trim() !== '');
      if (validLines.length > 0) {
        const { error: liError } = await supabase.from('transaction_items').insert(
          validLines.map((l) => ({
            transaction_id: id,
            company_id: companyId,
            item_id: l.item_id ?? null,
            name: l.name,
            quantity: l.quantity,
            price: l.price,
            total: l.quantity * l.price,
          })),
        );
        if (liError) throw liError;
      }
      return { id };
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['transaction', companyId, variables.id] });
      qc.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export interface NewExpenseInput {
  paid_at: string;
  amount: number;
  account_id: string | null;
  expense_type?: 'merchandise' | 'non_merchandise';
  category?: string;
  description?: string;
  payment_method?: string;
}

export function useCreateExpense() {
  const companyId = useCompanyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewExpenseInput) => {
      if (!companyId) throw new Error('No active company');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...input, company_id: companyId, type: 'expense' })
        .select('id')
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export interface UpdateExpenseInput extends NewExpenseInput {
  id: string;
}

export function useUpdateExpense() {
  const companyId = useCompanyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateExpenseInput) => {
      if (!companyId) throw new Error('No active company');
      const supabase = createClient();
      const { id, ...data } = input;
      const { error } = await supabase
        .from('transactions')
        .update(data)
        .eq('id', id)
        .eq('company_id', companyId);
      if (error) throw error;
      return { id };
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['transaction', companyId, variables.id] });
      qc.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDeleteTransaction() {
  const companyId = useCompanyId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!companyId) throw new Error('No active company');
      const supabase = createClient();
      await supabase.from('transaction_items').delete().eq('transaction_id', id).eq('company_id', companyId);
      const { error } = await supabase.from('transactions').delete().eq('id', id).eq('company_id', companyId);
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
