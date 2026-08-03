'use client';

import Link from 'next/link';
import { PlusCircle, Search, Filter, Eye, MessageCircle, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shell/page-header';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR, formatDateID } from '@/lib/format';

const INVOICES = [
  { no: '#INV/2023/1024', customer: 'Digital Nusantara Corp', date: '2023-10-24', amount: 12_500_000, status: 'paid' as const },
  { no: '#INV/2023/1025', customer: 'Maju Bersama Studio', date: '2023-10-22', amount: 8_200_000, status: 'overdue' as const },
  { no: '#INV/2023/1026', customer: 'Cahaya Abadi PT', date: '2023-10-20', amount: 45_000_000, status: 'paid' as const },
  { no: '#INV/2023/1027', customer: 'Sinar Jaya Retail', date: '2023-10-19', amount: 1_450_000, status: 'pending' as const },
  { no: '#INV/2023/1028', customer: 'PT Teknologi Nusantara', date: '2023-10-18', amount: 30_525_000, status: 'sent' as const },
];

export default function InvoicesPage() {
  const t = useTranslation();

  return (
    <>
      <PageHeader title={t.invoices.title} subtitle={t.invoices.subtitle}>
        <Button variant="secondary">
          <Filter className="h-5 w-5" />
          {t.common.filter}
        </Button>
        <Link href="/faktur/baru">
          <Button variant="primary">
            <PlusCircle className="h-5 w-5" />
            {t.invoices.newInvoice}
          </Button>
        </Link>
      </PageHeader>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard icon={<FileText className="text-alert-coral" />} bg="bg-pill-rose-bg" label={t.invoices.totalOutstanding} value={formatIDR(18_500_000)} />
        <StatCard icon={<CheckCircle2 className="text-secondary" />} bg="bg-pill-mint-bg" label={t.invoices.paidThisMonth} value={formatIDR(57_500_000)} />
        <StatCard icon={<AlertCircle className="text-[#D97706]" />} bg="bg-pill-amber-bg" label={t.invoices.overdue} value={formatIDR(8_200_000)} />
      </section>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-light p-6">
          <h4 className="text-headline-sm font-headline-sm text-slate-heading">{t.invoices.all}</h4>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder={t.invoices.searchPlaceholder}
              className="w-72 rounded-lg border border-border-light py-2 pl-10 pr-4 text-body-sm outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light bg-slate-50">
                {[t.table.invoiceNo, t.table.customer, t.table.date, t.table.amount, t.table.status].map((h) => (
                  <th key={h} className="px-6 py-4 text-label-md font-label-md text-slate-heading">{h}</th>
                ))}
                <th className="px-6 py-4 text-right text-label-md font-label-md text-slate-heading">{t.table.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {INVOICES.map((inv) => (
                <tr key={inv.no} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-body-md font-semibold text-primary-container">{inv.no}</td>
                  <td className="px-6 py-4 text-body-md text-slate-heading">{inv.customer}</td>
                  <td className="px-6 py-4 text-body-md text-slate-body">{formatDateID(inv.date)}</td>
                  <td className="px-6 py-4 text-body-md font-bold text-slate-heading">{formatIDR(inv.amount)}</td>
                  <td className="px-6 py-4"><Badge variant={badgeFor(inv.status)}>{t.status[inv.status]}</Badge></td>
                  <td className="px-6 py-4 text-right">
                    {inv.status === 'overdue' ? (
                      <Button variant="whatsapp" size="sm"><MessageCircle className="h-4 w-4" />{t.common.shareWhatsApp}</Button>
                    ) : (
                      <button className="p-2 text-slate-body transition-colors hover:text-primary-container"><Eye className="h-4 w-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function badgeFor(status: 'paid' | 'overdue' | 'pending' | 'sent') {
  if (status === 'paid') return 'paid' as const;
  if (status === 'overdue') return 'overdue' as const;
  if (status === 'pending') return 'pending' as const;
  return 'info' as const;
}

function StatCard({ icon, bg, label, value }: { icon: React.ReactNode; bg: string; label: string; value: string }) {
  return (
    <Card className="bento-card p-6">
      <div className={`mb-4 w-fit rounded-lg p-2 ${bg}`}>{icon}</div>
      <p className="mb-1 text-label-md font-label-md uppercase tracking-wider text-slate-body">{label}</p>
      <h3 className="text-metric-display font-metric-display text-slate-heading">{value}</h3>
    </Card>
  );
}
