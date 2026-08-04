'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, useCompanyId, type ActiveCompany } from '@/store/auth';

const CASH_ACCOUNTS = ['Kas', 'Bank'];
const INVENTORY_ACCOUNT = 'Persediaan Barang Dagang';

// ---------- Laba Rugi (coded, quarterly) ----------
export interface PLRow {
  code: string | null;
  name: string;
  quarters: number[]; // [Jan-Mar, Apr-Jun, Jul-Sep, Okt-Des]
  total: number;
}

export interface ProfitLoss {
  years: number[];
  income: PLRow[];
  expense: PLRow[];
  incomeTotals: number[];
  incomeTotal: number;
  expenseTotals: number[];
  expenseTotal: number;
  netByQuarter: number[];
  net: number;
}

/**
 * Laba Rugi itemized by coded income/expense category, split into the four
 * quarters of the selected year plus a Total column (matches the real app P&L).
 */
export function useProfitLoss(year: number) {
  const companyId = useCompanyId();
  return useQuery({
    queryKey: ['reports', 'pl', companyId, year],
    enabled: !!companyId,
    queryFn: async (): Promise<ProfitLoss> => {
      const supabase = createClient();
      const [catRes, txRes] = await Promise.all([
        supabase.from('categories').select('type,name,code').eq('company_id', companyId!),
        supabase.from('transactions').select('type,amount,category,paid_at').eq('company_id', companyId!),
      ]);
      if (catRes.error) throw catRes.error;
      if (txRes.error) throw txRes.error;
      const categories = catRes.data ?? [];
      const txns = txRes.data ?? [];

      const years = Array.from(new Set(txns.map((t) => new Date(t.paid_at).getFullYear())));
      if (!years.includes(year)) years.push(year);
      years.sort((a, b) => b - a);

      const inYear = txns.filter((t) => new Date(t.paid_at).getFullYear() === year);
      const quarterOf = (d: string) => Math.floor(new Date(d).getMonth() / 3);

      const build = (type: 'income' | 'expense'): PLRow[] => {
        const rows: PLRow[] = categories
          .filter((c) => c.type === type)
          .sort((a, b) => (a.code ?? '').localeCompare(b.code ?? ''))
          .map((c) => ({ code: c.code, name: c.name, quarters: [0, 0, 0, 0], total: 0 }));
        const byName = new Map(rows.map((r) => [r.name, r]));
        const uncategorized: PLRow = { code: null, name: '(Tanpa Kategori)', quarters: [0, 0, 0, 0], total: 0 };

        for (const t of inYear.filter((x) => x.type === type)) {
          const row = (t.category && byName.get(t.category)) || uncategorized;
          const amt = Number(t.amount);
          row.quarters[quarterOf(t.paid_at)] += amt;
          row.total += amt;
        }
        if (uncategorized.total > 0) rows.push(uncategorized);
        return rows;
      };

      const income = build('income');
      const expense = build('expense');
      const sumCols = (rows: PLRow[]) => {
        const cols = [0, 0, 0, 0];
        let total = 0;
        for (const r of rows) {
          for (let i = 0; i < 4; i++) cols[i] += r.quarters[i];
          total += r.total;
        }
        return { cols, total };
      };
      const inc = sumCols(income);
      const exp = sumCols(expense);

      return {
        years,
        income,
        expense,
        incomeTotals: inc.cols,
        incomeTotal: inc.total,
        expenseTotals: exp.cols,
        expenseTotal: exp.total,
        netByQuarter: inc.cols.map((v, i) => v - exp.cols[i]),
        net: inc.total - exp.total,
      };
    },
  });
}

export interface ReportData {
  // Laba Rugi (computed from transactions)
  totalIncome: number;
  hpp: number;
  totalExpense: number;
  grossProfit: number;
  netProfit: number;
  // Neraca (from chart-of-accounts balances + posted retained earnings)
  totalAssets: number;
  cash: number;
  inventory: number;
  otherAssets: number;
  totalLiabilities: number;
  modal: number;
  retained: number;
}

/**
 * Laba Rugi is derived live from transactions: income minus merchandise-purchase
 * COGS (HPP) minus operating expenses. Neraca reads the manually-kept account
 * balances (single-entry, flow §9); net profit only appears there once posted to
 * retained_earnings via usePostRetainedEarnings ("Update Laporan Laba Rugi").
 */
export function useReportData() {
  const companyId = useCompanyId();
  return useQuery({
    queryKey: ['reports', companyId],
    enabled: !!companyId,
    queryFn: async (): Promise<ReportData> => {
      const supabase = createClient();
      const [accountsRes, txnsRes, companyRes] = await Promise.all([
        supabase.from('accounts').select('name,category,balance').eq('company_id', companyId!),
        supabase.from('transactions').select('type,amount,expense_type').eq('company_id', companyId!),
        supabase.from('companies').select('retained_earnings').eq('id', companyId!).maybeSingle(),
      ]);
      if (accountsRes.error) throw accountsRes.error;
      if (txnsRes.error) throw txnsRes.error;
      if (companyRes.error) throw companyRes.error;

      const accounts = accountsRes.data ?? [];
      const txns = txnsRes.data ?? [];

      const totalIncome = txns
        .filter((t) => t.type === 'income')
        .reduce((s, t) => s + Number(t.amount), 0);
      const hpp = txns
        .filter((t) => t.type === 'expense' && t.expense_type === 'merchandise')
        .reduce((s, t) => s + Number(t.amount), 0);
      const totalExpense = txns
        .filter((t) => t.type === 'expense' && t.expense_type !== 'merchandise')
        .reduce((s, t) => s + Number(t.amount), 0);
      const grossProfit = totalIncome - hpp;
      const netProfit = grossProfit - totalExpense;

      const sumCat = (cat: string) =>
        accounts.filter((a) => a.category === cat).reduce((s, a) => s + Number(a.balance), 0);
      const sumNamed = (names: string[]) =>
        accounts
          .filter((a) => a.category === 'asset' && names.includes(a.name))
          .reduce((s, a) => s + Number(a.balance), 0);

      const totalAssets = sumCat('asset');
      const cash = sumNamed(CASH_ACCOUNTS);
      const inventory = sumNamed([INVENTORY_ACCOUNT]);
      const otherAssets = totalAssets - cash - inventory;

      return {
        totalIncome,
        hpp,
        totalExpense,
        grossProfit,
        netProfit,
        totalAssets,
        cash,
        inventory,
        otherAssets,
        totalLiabilities: sumCat('liability'),
        modal: sumCat('equity'),
        retained: Number(companyRes.data?.retained_earnings ?? 0),
      };
    },
  });
}

/** "Update Laporan Laba Rugi" — roll net profit into the balance sheet (flow §9). */
export function usePostRetainedEarnings() {
  const companyId = useCompanyId();
  const upsertCompany = useAuthStore((s) => s.upsertCompany);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (netProfit: number) => {
      if (!companyId) throw new Error('No active company');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('companies')
        .update({ retained_earnings: netProfit })
        .eq('id', companyId)
        .select('*')
        .single();
      if (error) throw error;
      return data as ActiveCompany;
    },
    onSuccess: (data) => {
      upsertCompany(data);
      qc.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
