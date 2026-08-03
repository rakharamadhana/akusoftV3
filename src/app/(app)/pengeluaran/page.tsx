'use client';

import {
  Wallet,
  Clock,
  Tag,
  Filter,
  PlusCircle,
  Search,
  Fuel,
  Zap,
  UtensilsCrossed,
  Package,
  UploadCloud,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shell/page-header';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR, formatNumberID, formatDateID } from '@/lib/format';

const ROWS = [
  { date: '2023-10-12', cat: 'Fuel & Transport', vendor: 'Pertamina Pusat', amount: 1_250_000, status: 'paid' as const, icon: Fuel, tint: 'bg-orange-50 text-orange-500' },
  { date: '2023-10-10', cat: 'Utilitas', vendor: 'PLN Distribusi', amount: 4_820_000, status: 'pending' as const, icon: Zap, tint: 'bg-blue-50 text-blue-500' },
  { date: '2023-10-08', cat: 'Makan & Konsumsi', vendor: 'Catering Ibu Budi', amount: 850_000, status: 'paid' as const, icon: UtensilsCrossed, tint: 'bg-green-50 text-green-600' },
  { date: '2023-10-05', cat: 'Perlengkapan Kantor', vendor: 'Gramedia Office', amount: 2_100_000, status: 'paid' as const, icon: Package, tint: 'bg-purple-50 text-purple-500' },
];

const CATEGORIES = [
  { label: 'Operasional', pct: 45, color: '#2563EB' },
  { label: 'Transport', pct: 25, color: '#60A5FA' },
  { label: 'Lain-lain', pct: 30, color: '#93C5FD' },
];

export default function ExpensesPage() {
  const t = useTranslation();

  return (
    <>
      <PageHeader title={t.expenses.title} subtitle={t.expenses.subtitle}>
        <Button variant="secondary">
          <Filter className="h-5 w-5" />
          {t.common.filter}
        </Button>
        <Button variant="primary">
          <PlusCircle className="h-5 w-5" />
          {t.common.recordExpense}
        </Button>
      </PageHeader>

      {/* Summary row */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard
          icon={<Wallet className="text-primary-container" />}
          iconBg="bg-pill-indigo-bg"
          label={t.expenses.totalThisMonth}
          value={formatIDR(42_850_000)}
          note={<span className="flex items-center gap-1 text-secondary"><TrendingUp className="h-3.5 w-3.5" /> +12.5%</span>}
        />
        <SummaryCard
          icon={<Clock className="text-alert-coral" />}
          iconBg="bg-pill-rose-bg"
          label={t.expenses.unpaid}
          value={formatIDR(12_420_500)}
          note={<span className="text-alert-coral">5 {t.expenses.bills}</span>}
        />
        <SummaryCard
          icon={<Tag className="text-secondary" />}
          iconBg="bg-pill-mint-bg"
          label={t.expenses.topCategory}
          value="Biaya Sewa & Listrik"
          note={<span className="text-slate-body opacity-60">Operasional</span>}
          small
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Table */}
        <Card className="flex flex-col overflow-hidden xl:col-span-8">
          <div className="flex items-center justify-between border-b border-border-light px-6 py-5">
            <h4 className="text-headline-sm font-headline-sm text-slate-heading">
              {t.expenses.recentList}
            </h4>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder={t.expenses.searchPlaceholder}
                className="w-64 rounded-lg border border-border-light py-2 pl-10 pr-4 text-body-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/50">
                <tr>
                  {[t.expenses.date, t.expenses.category, t.expenses.vendor].map((h) => (
                    <th key={h} className="px-6 py-4 text-label-md font-label-md uppercase tracking-wider text-slate-body opacity-60">{h}</th>
                  ))}
                  <th className="px-6 py-4 text-right text-label-md font-label-md uppercase tracking-wider text-slate-body opacity-60">{t.expenses.amountIdr}</th>
                  <th className="px-6 py-4 text-center text-label-md font-label-md uppercase tracking-wider text-slate-body opacity-60">{t.expenses.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {ROWS.map((r) => (
                  <tr key={r.vendor} className="transition-colors hover:bg-surface-container-lowest">
                    <td className="px-6 py-4 text-body-md text-slate-body">{formatDateID(r.date)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${r.tint}`}>
                          <r.icon className="h-4 w-4" />
                        </div>
                        <span className="text-body-md text-slate-heading">{r.cat}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body-md text-slate-body">{r.vendor}</td>
                    <td className="px-6 py-4 text-right text-body-md font-semibold text-slate-heading">{formatNumberID(r.amount)}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={r.status}>{t.status[r.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-auto flex items-center justify-between border-t border-border-light bg-surface-container-low/30 p-4">
            <span className="text-body-sm text-slate-body opacity-60">Menampilkan 4 dari 48 transaksi</span>
          </div>
        </Card>

        {/* Side analytics */}
        <aside className="space-y-6 xl:col-span-4">
          <Card className="p-6">
            <h4 className="mb-6 text-headline-sm font-headline-sm text-slate-heading">
              {t.expenses.categoryDistribution}
            </h4>
            <div className="relative flex items-center justify-center py-4">
              <Donut categories={CATEGORIES} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-headline-md font-headline-md text-slate-heading">100%</span>
                <span className="text-body-sm text-slate-body opacity-60">{t.expenses.tracked}</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {CATEGORIES.map((c) => (
                <div key={c.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-body-md text-slate-body">{c.label}</span>
                  </div>
                  <span className="text-label-md font-label-md text-slate-heading">{c.pct}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="text-headline-sm font-headline-sm text-slate-heading">{t.expenses.recentReceipts}</h4>
              <a href="#" className="text-label-md font-label-md text-primary-container hover:underline">{t.common.viewAll}</a>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-light py-6 text-label-md font-label-md text-slate-body transition-all hover:border-primary-container/40 hover:bg-surface-container-low">
              <UploadCloud className="h-5 w-5" />
              {t.expenses.uploadReceipt}
            </button>
          </Card>
        </aside>
      </div>
    </>
  );
}

function SummaryCard({
  icon, iconBg, label, value, note, small,
}: {
  icon: React.ReactNode; iconBg: string; label: string; value: string; note: React.ReactNode; small?: boolean;
}) {
  return (
    <Card className="bento-card p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-xl p-2.5 ${iconBg}`}>{icon}</div>
        <span className="text-xs font-semibold">{note}</span>
      </div>
      <p className="mb-1 text-label-md font-label-md text-slate-body opacity-70">{label}</p>
      <h3 className={small ? 'text-headline-md font-headline-md text-slate-heading' : 'text-metric-display font-metric-display text-slate-heading'}>{value}</h3>
    </Card>
  );
}

function Donut({ categories }: { categories: { pct: number; color: string }[] }) {
  const r = 80;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg className="h-48 w-48 -rotate-90">
      <circle cx="96" cy="96" r={r} fill="transparent" stroke="#f1f5f9" strokeWidth="24" />
      {categories.map((cat, i) => {
        const len = (cat.pct / 100) * c;
        const el = (
          <circle
            key={i}
            cx="96"
            cy="96"
            r={r}
            fill="transparent"
            stroke={cat.color}
            strokeWidth="24"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}
