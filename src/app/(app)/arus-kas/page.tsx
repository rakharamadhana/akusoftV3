'use client';

import { ArrowDownLeft, ArrowUpRight, Scale, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shell/page-header';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR } from '@/lib/format';

export default function CashflowPage() {
  const t = useTranslation();

  return (
    <>
      <PageHeader title={t.cashflow.title} subtitle={t.cashflow.subtitle}>
        <Button variant="secondary">
          <Download className="h-5 w-5" />
          {t.common.downloadPdf}
        </Button>
      </PageHeader>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard icon={<ArrowDownLeft className="text-secondary" />} bg="bg-pill-mint-bg" label={t.cashflow.inflow} value={formatIDR(245_850_000)} />
        <StatCard icon={<ArrowUpRight className="text-alert-coral" />} bg="bg-pill-rose-bg" label={t.cashflow.outflow} value={formatIDR(163_450_000)} />
        <StatCard icon={<Scale className="text-primary-container" />} bg="bg-pill-indigo-bg" label={t.cashflow.net} value={formatIDR(82_400_000)} />
      </section>

      <Card className="p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h4 className="text-headline-sm font-headline-sm text-slate-heading">{t.dashboard.cashflowChart}</h4>
            <p className="text-body-md text-slate-body">{t.dashboard.cashflowChartSub}</p>
          </div>
          <div className="flex items-center gap-4">
            <Legend color="bg-secondary" label={t.dashboard.income} />
            <Legend color="bg-tertiary/60" label={t.dashboard.expense} />
          </div>
        </div>
        <div className="flex h-72 w-full items-end rounded-lg bg-gradient-to-t from-slate-50 to-transparent">
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 240">
            <defs>
              <linearGradient id="cf" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#D1FAE5" stopOpacity="1" />
                <stop offset="100%" stopColor="#D1FAE5" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,210 Q100,190 200,205 T400,175 T600,195 T800,165" fill="none" opacity="0.4" stroke="#3e3fcc" strokeDasharray="4" strokeWidth="2" />
            <path d="M0,240 L0,175 Q100,150 200,165 T400,135 T600,150 T800,120 L800,240 Z" fill="url(#cf)" />
            <path d="M0,175 Q100,150 200,165 T400,135 T600,150 T800,120" fill="none" stroke="#059669" strokeWidth="3" />
          </svg>
        </div>
      </Card>
    </>
  );
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
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-label-md font-label-md">{label}</span>
    </div>
  );
}
