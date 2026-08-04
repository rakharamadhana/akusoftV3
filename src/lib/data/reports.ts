'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, useCompanyId, type ActiveCompany } from '@/store/auth';

const CASH_ACCOUNTS = ['Kas', 'Bank'];
const INVENTORY_ACCOUNT = 'Persediaan Barang Dagang';
const RECEIVABLE_ACCOUNT = 'Piutang Usaha';

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
      const [catRes, txRes, itemsRes] = await Promise.all([
        supabase.from('categories').select('type,name,code').eq('company_id', companyId!),
        supabase
          .from('transactions')
          .select('type,amount,category,paid_at,expense_type,transaction_items(item_id,quantity)')
          .eq('company_id', companyId!),
        supabase.from('items').select('id,purchase_price').eq('company_id', companyId!),
      ]);
      if (catRes.error) throw catRes.error;
      if (txRes.error) throw txRes.error;
      if (itemsRes.error) throw itemsRes.error;
      const categories = catRes.data ?? [];
      const txns = txRes.data ?? [];
      const itemCost = new Map((itemsRes.data ?? []).map((i) => [i.id, Number(i.purchase_price)]));

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
          // Merchandise purchases are inventory (Neraca), not a P&L expense — they
          // only hit the income statement as HPP/COGS when the goods are sold.
          if (type === 'expense' && t.expense_type === 'merchandise') continue;
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

      // HPP (COGS) is derived automatically from the cost of goods *sold*: for every
      // sale line item, quantity × the item's Harga Beli, bucketed by quarter.
      const cogs = [0, 0, 0, 0];
      for (const t of inYear) {
        if (t.type !== 'income') continue;
        const q = quarterOf(t.paid_at);
        for (const li of t.transaction_items ?? []) {
          const unitCost = li.item_id ? itemCost.get(li.item_id) ?? 0 : 0;
          cogs[q] += Number(li.quantity) * unitCost;
        }
      }
      const cogsTotal = cogs.reduce((s, v) => s + v, 0);
      if (cogsTotal > 0) {
        // Fold COGS into the existing "Harga Pokok Penjualan (HPP)" row (code 510),
        // or synthesize one at the top of the expense section if it doesn't exist.
        let hppRow = expense.find((r) => r.code === '510' || /hpp|harga pokok/i.test(r.name));
        if (!hppRow) {
          hppRow = { code: '510', name: 'Harga Pokok Penjualan (HPP)', quarters: [0, 0, 0, 0], total: 0 };
          expense.unshift(hppRow);
        }
        for (let i = 0; i < 4; i++) hppRow.quarters[i] += cogs[i];
        hppRow.total += cogsTotal;
      }
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

/** One itemized line on the Neraca (a single chart-of-accounts account). */
export interface NeracaLine {
  code: string | null;
  name: string;
  value: number;
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
  // Neraca — itemized per account (each COA account as its own line)
  assets: NeracaLine[];
  liabilities: NeracaLine[];
  equity: NeracaLine[]; // capital accounts only (e.g. Modal Awal)
  labaDitahan: number; // Laba Ditahan Periode Lalu (posted retained earnings)
  labaBerjalan: number; // Laba Periode Berjalan (current live net profit not yet posted)
  totalEquity: number; // equity accounts + labaDitahan + labaBerjalan
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
      const [accountsRes, txnsRes, itemsRes, companyRes] = await Promise.all([
        supabase.from('accounts').select('name,category,balance,code').eq('company_id', companyId!),
        supabase.from('transactions').select('id,type,amount,expense_type,basis,paid_at,transaction_items(item_id,quantity,price,total)').eq('company_id', companyId!),
        supabase.from('items').select('id,purchase_price,sale_price,quantity').eq('company_id', companyId!),
        supabase.from('companies').select('retained_earnings').eq('id', companyId!).maybeSingle(),
      ]);
      if (accountsRes.error) throw accountsRes.error;
      if (txnsRes.error) throw txnsRes.error;
      if (itemsRes.error) throw itemsRes.error;
      if (companyRes.error) throw companyRes.error;

      const accounts = accountsRes.data ?? [];
      const txns = txnsRes.data ?? [];
      const items = itemsRes.data ?? [];
      const itemsMap = new Map(items.map((i) => [i.id, Number(i.purchase_price)]));

      // Value of stock held in the Items module (qty × Harga Beli). Inventory is
      // bought *from* capital (Kas), so this shifts value from cash into
      // Persediaan — it does NOT add new equity. See opening-cash plug below.
      const itemsInventoryValue = items.reduce(
        (s, i) => s + Number(i.quantity) * Number(i.purchase_price),
        0,
      );
      const sumCat = (cat: string) =>
        accounts.filter((a) => a.category === cat).reduce((s, a) => s + Number(a.balance), 0);

      // Income totals
      const incomeTxns = txns.filter((t) => t.type === 'income');
      const totalIncome = incomeTxns.reduce((s, t) => s + Number(t.amount), 0);

      // Merchandise purchases (Pembelian Barang Dagang)
      const merchandisePurchases = txns
        .filter((t) => t.type === 'expense' && t.expense_type === 'merchandise')
        .reduce((s, t) => s + Number(t.amount), 0);

      // Operating expenses (Pengeluaran Non-Merchandise)
      const totalExpense = txns
        .filter((t) => t.type === 'expense' && t.expense_type !== 'merchandise')
        .reduce((s, t) => s + Number(t.amount), 0);

      // Calculate HPP (Cost of Goods Sold) from item cost prices
      let calculatedHpp = 0;
      for (const t of incomeTxns) {
        if (t.transaction_items && t.transaction_items.length > 0) {
          for (const item of t.transaction_items) {
            const costPrice = item.item_id ? (itemsMap.get(item.item_id) ?? 0) : 0;
            if (costPrice > 0) {
              calculatedHpp += Number(item.quantity) * costPrice;
            }
          }
        }
      }

      // If no item-level cost price was available, fall back to merchandise purchases or proportion
      const hpp = calculatedHpp > 0 ? calculatedHpp : merchandisePurchases;

      const grossProfit = totalIncome - hpp;
      const netProfit = grossProfit - totalExpense;

      const totalLiabilities = sumCat('liability');
      const modal = sumCat('equity');
      const postedRetained = Number(companyRes.data?.retained_earnings ?? 0);

      // Opening inventory = manually-kept Persediaan account balance + the value
      // of stock entered on products.
      const initialInventory =
        accounts
          .filter((a) => a.category === 'asset' && a.name === INVENTORY_ACCOUNT)
          .reduce((s, a) => s + Number(a.balance), 0) + itemsInventoryValue;

      const otherAssetsBase = accounts
        .filter((a) => a.category === 'asset' && !CASH_ACCOUNTS.includes(a.name) && a.name !== INVENTORY_ACCOUNT)
        .reduce((s, a) => s + Number(a.balance), 0);

      // Cash is the balancing figure: whatever capital + liabilities isn't tied up
      // in inventory or other assets is held as cash. So buying product stock from
      // capital *reduces* Kas (asset swap) instead of inflating equity.
      const requiredInitialAssets = modal + totalLiabilities;
      const initialCash = requiredInitialAssets - initialInventory - otherAssetsBase;

      // Dynamic adjustments based on transactions:
      // Cash net flow = Cash Income - Cash Expenses
      const cashIncome = incomeTxns.filter((t) => t.basis !== 'credit').reduce((s, t) => s + Number(t.amount), 0);
      // Credit sales bring in no cash — they raise Accounts Receivable (Piutang Usaha).
      const creditIncome = incomeTxns.filter((t) => t.basis === 'credit').reduce((s, t) => s + Number(t.amount), 0);
      const cashExpenses = txns.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);
      const currentCash = initialCash + cashIncome - cashExpenses;

      // Inventory = Initial Inventory + Merchandise Purchases - HPP
      const currentInventory = Math.max(0, initialInventory + merchandisePurchases - hpp);

      // ----- Itemized Neraca lines (one per chart-of-accounts account) -----
      const byCode = (a: { code: string | null }, b: { code: string | null }) =>
        (a.code ?? '').localeCompare(b.code ?? '');

      const assetAccounts = accounts.filter((a) => a.category === 'asset').sort(byCode);
      // The primary cash account (Kas) absorbs the period's net cash movement;
      // any other cash account (Bank) stays at its book balance.
      const primaryCash =
        assetAccounts.find((a) => a.name === 'Kas') ??
        assetAccounts.find((a) => CASH_ACCOUNTS.includes(a.name));
      const otherCashBase = assetAccounts
        .filter((a) => CASH_ACCOUNTS.includes(a.name) && a.name !== primaryCash?.name)
        .reduce((s, a) => s + Number(a.balance), 0);

      const assets: NeracaLine[] = assetAccounts.map((a) => {
        let value = Number(a.balance);
        if (a.name === INVENTORY_ACCOUNT) value = currentInventory;
        else if (a.name === RECEIVABLE_ACCOUNT) value = Number(a.balance) + creditIncome; // + credit sales
        else if (primaryCash && a.name === primaryCash.name) value = currentCash - otherCashBase;
        return { code: a.code, name: a.name, value };
      });
      if (!primaryCash && currentCash !== 0) {
        assets.unshift({ code: null, name: 'Kas', value: currentCash });
      }
      if (!assetAccounts.some((a) => a.name === RECEIVABLE_ACCOUNT) && creditIncome !== 0) {
        assets.push({ code: '130', name: RECEIVABLE_ACCOUNT, value: creditIncome });
      }
      // Total from the itemized lines so "Total Aset" always equals what's shown.
      const currentTotalAssets = assets.reduce((s, a) => s + a.value, 0);

      const liabilities: NeracaLine[] = accounts
        .filter((a) => a.category === 'liability')
        .sort(byCode)
        .map((a) => ({ code: a.code, name: a.name, value: Number(a.balance) }));

      // Split accumulated profit into prior (posted) vs. current period; together
      // they always equal live net profit, so the sheet balances.
      const labaDitahan = postedRetained;
      const labaBerjalan = netProfit - postedRetained;

      // The chart of accounts already seeds equity accounts for retained/current
      // profit (320/330). Populate those in place rather than appending duplicate
      // rows; only synthesize a row if the account is genuinely absent.
      const isDitahan = (a: { code: string | null; name: string }) =>
        a.code === '320' || /laba\s+ditahan/i.test(a.name);
      const isBerjalan = (a: { code: string | null; name: string }) =>
        a.code === '330' || /laba\s+(periode\s+)?berjalan/i.test(a.name);
      let matchedDitahan = false;
      let matchedBerjalan = false;
      const equity: NeracaLine[] = accounts
        .filter((a) => a.category === 'equity')
        .sort(byCode)
        .map((a) => {
          if (isDitahan(a)) {
            matchedDitahan = true;
            return { code: a.code, name: a.name, value: labaDitahan };
          }
          if (isBerjalan(a)) {
            matchedBerjalan = true;
            return { code: a.code, name: a.name, value: labaBerjalan };
          }
          return { code: a.code, name: a.name, value: Number(a.balance) };
        });
      if (!matchedDitahan) equity.push({ code: '320', name: 'Laba Ditahan Periode Lalu', value: labaDitahan });
      if (!matchedBerjalan) equity.push({ code: '330', name: 'Laba Periode Berjalan', value: labaBerjalan });
      equity.sort(byCode);

      const totalEquity = equity.reduce((s, e) => s + e.value, 0);

      return {
        totalIncome,
        hpp,
        totalExpense,
        grossProfit,
        netProfit,
        totalAssets: currentTotalAssets,
        cash: currentCash,
        inventory: currentInventory,
        otherAssets: otherAssetsBase,
        totalLiabilities,
        modal,
        retained: postedRetained,
        assets,
        liabilities,
        equity,
        labaDitahan,
        labaBerjalan,
        totalEquity,
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
