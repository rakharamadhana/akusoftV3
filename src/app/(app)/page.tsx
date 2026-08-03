'use client';

import {
  TrendingUp,
  Landmark,
  FileWarning,
  Wallet,
  PlusCircle,
  ReceiptText,
  MessageCircle,
  ArrowRight,
  Download,
  Calendar,
  Eye,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR, formatDateID } from '@/lib/format';

// Mock data — replaced by Supabase queries (scoped by company_id via RLS) later.
const METRICS = {
  grossRevenue: 245_850_000,
  netProfit: 82_400_000,
  receivables: 18_500_000,
  totalCash: 134_200_000,
};

const TRANSACTIONS = [
  { no: '#INV/2023/1024', customer: 'Digital Nusantara Corp', date: '2023-10-24', amount: 12_500_000, status: 'paid' as const },
  { no: '#INV/2023/1025', customer: 'Maju Bersama Studio', date: '2023-10-22', amount: 8_200_000, status: 'overdue' as const },
  { no: '#INV/2023/1026', customer: 'Cahaya Abadi PT', date: '2023-10-20', amount: 45_000_000, status: 'paid' as const },
  { no: '#INV/2023/1027', customer: 'Sinar Jaya Retail', date: '2023-10-19', amount: 1_450_000, status: 'pending' as const },
];

export default function DashboardPage() {
  const t = useTranslation();

  return (
    <>
      {/* Welcome header */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-slate-heading">
            {t.dashboard.title}
          </h2>
          <p className="text-body-lg font-body-lg text-slate-body">{t.dashboard.subtitle}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Calendar className="h-5 w-5" />
            {t.common.lastNDays}
          </Button>
          <Button variant="primary">
            <Download className="h-5 w-5" />
            {t.common.downloadPdf}
          </Button>
        </div>
      </section>

      {/* Bento metric cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<TrendingUp className="text-secondary" />}
          iconBg="bg-pill-mint-bg"
          label={t.dashboard.grossRevenue}
          value={formatIDR(METRICS.grossRevenue)}
          pill={<Badge variant="paid">+14.2%</Badge>}
        />
        <MetricCard
          icon={<Landmark className="text-tertiary" />}
          iconBg="bg-pill-indigo-bg"
          label={t.dashboard.netProfit}
          value={formatIDR(METRICS.netProfit)}
          pill={<Badge variant="info">{t.dashboard.margin} 33.5%</Badge>}
        />
        <MetricCard
          icon={<FileWarning className="text-alert-coral" />}
          iconBg="bg-pill-rose-bg"
          label={t.dashboard.receivables}
          value={formatIDR(METRICS.receivables)}
          pill={<Badge variant="overdue">4 {t.dashboard.overdueInvoices}</Badge>}
        />
        <MetricCard
          icon={<Wallet className="text-slate-heading" />}
          iconBg="bg-surface-container-low"
          label={t.dashboard.totalCash}
          value={formatIDR(METRICS.totalCash)}
          pill={
            <div className="flex flex-wrap gap-1">
              {['BCA', 'Mandiri', 'Kas Utama'].map((b) => (
                <span
                  key={b}
                  className="rounded-md border border-border-light bg-surface-container px-2 py-0.5 text-[10px] font-label-md text-slate-heading"
                >
                  {b}
                </span>
              ))}
            </div>
          }
        />
      </section>

      {/* Chart + quick actions */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="relative overflow-hidden p-6 lg:col-span-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h4 className="text-headline-sm font-headline-sm text-slate-heading">
                {t.dashboard.cashflowChart}
              </h4>
              <p className="text-body-md font-body-md text-slate-body">
                {t.dashboard.cashflowChartSub}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Legend color="bg-secondary" label={t.dashboard.income} />
              <Legend color="bg-tertiary/60" label={t.dashboard.expense} />
            </div>
          </div>
          <div className="flex h-64 w-full items-end rounded-lg bg-gradient-to-t from-slate-50 to-transparent">
            <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="income" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#D1FAE5" stopOpacity="1" />
                  <stop offset="100%" stopColor="#D1FAE5" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,180 Q100,160 200,175 T400,150 T600,165 T800,140" fill="none" opacity="0.4" stroke="#3e3fcc" strokeDasharray="4" strokeWidth="2" />
              <path d="M0,200 L0,150 Q100,130 200,145 T400,120 T600,135 T800,110 L800,200 Z" fill="url(#income)" />
              <path d="M0,150 Q100,130 200,145 T400,120 T600,135 T800,110" fill="none" stroke="#059669" strokeWidth="3" />
            </svg>
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-4">
          <Card className="p-6">
            <h4 className="mb-6 text-headline-sm font-headline-sm text-slate-heading">
              {t.dashboard.quickActions}
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="primary" className="h-auto w-full justify-between p-4">
                <span className="flex items-center gap-3">
                  <PlusCircle className="h-5 w-5" />
                  {t.common.createInvoice}
                </span>
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="secondary" className="h-auto w-full justify-between p-4">
                <span className="flex items-center gap-3">
                  <ReceiptText className="h-5 w-5 text-slate-body" />
                  {t.common.recordExpense}
                </span>
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="whatsapp" className="h-auto w-full justify-between p-4">
                <span className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Shortcut
                </span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Transactions table */}
      <section className="overflow-hidden rounded-xl border border-border-light bg-white shadow-micro">
        <div className="border-b border-border-light p-6">
          <h4 className="text-headline-sm font-headline-sm text-slate-heading">
            {t.dashboard.transactionHistory}
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-light bg-slate-50">
                <Th>{t.table.invoiceNo}</Th>
                <Th>{t.table.customer}</Th>
                <Th>{t.table.date}</Th>
                <Th>{t.table.amount}</Th>
                <Th>{t.table.status}</Th>
                <Th className="text-right">{t.table.action}</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.no} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-body-md font-semibold text-primary-container">{tx.no}</td>
                  <td className="px-6 py-4 text-body-md text-slate-heading">{tx.customer}</td>
                  <td className="px-6 py-4 text-body-md text-slate-body">{formatDateID(tx.date)}</td>
                  <td className="px-6 py-4 text-body-md font-bold text-slate-heading">{formatIDR(tx.amount)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={tx.status}>{t.status[tx.status]}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {tx.status === 'overdue' ? (
                      <Button variant="whatsapp" size="sm">
                        <MessageCircle className="h-4 w-4" />
                        {t.common.shareWhatsApp}
                      </Button>
                    ) : (
                      <button className="p-2 text-slate-body transition-colors hover:text-primary-container">
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function MetricCard({
  icon,
  iconBg,
  label,
  value,
  pill,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  pill: React.ReactNode;
}) {
  return (
    <Card className="bento-card p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-lg p-2 ${iconBg}`}>{icon}</div>
        {pill}
      </div>
      <p className="mb-1 text-label-md font-label-md uppercase tracking-wider text-slate-body">
        {label}
      </p>
      <h3 className="text-metric-display font-metric-display text-slate-heading">{value}</h3>
    </Card>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-label-md font-label-md">{label}</span>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-6 py-4 text-label-md font-label-md text-slate-heading ${className}`}>
      {children}
    </th>
  );
}
