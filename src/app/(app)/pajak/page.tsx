'use client';

import {
  BarChart3,
  Wallet,
  BellRing,
  Calendar,
  RefreshCw,
  Receipt,
  Download,
  CloudUpload,
  ArrowRight,
  Info,
  TrendingUp,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shell/page-header';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR } from '@/lib/format';

const HISTORY = [
  { period: 'Mei 2024', type: 'PPh 21', id: '82024050123991', amount: 12_450_000, reported: true },
  { period: 'Mei 2024', type: 'PPN Dalam Negeri', id: '82024050228812', amount: 35_200_000, reported: false },
  { period: 'April 2024', type: 'PPh Final UMKM', id: '82024040111234', amount: 3_800_000, reported: true },
  { period: 'April 2024', type: 'PPh 23', id: '82024040155621', amount: 1_150_000, reported: true },
];

export default function TaxPage() {
  const t = useTranslation();

  return (
    <>
      <PageHeader title={t.tax.title}>
        <Button variant="secondary">
          <Calendar className="h-5 w-5" />
          {t.tax.taxYear}
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button variant="primary">
          <RefreshCw className="h-5 w-5" />
          {t.tax.syncDjp}
        </Button>
      </PageHeader>

      <div className="-mt-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-secondary" />
        <p className="text-body-md font-semibold text-secondary">{t.tax.complianceSafe}</p>
      </div>

      {/* Tax bento cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="bento-card flex flex-col justify-between p-4">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pill-indigo-bg text-primary-container">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="rounded bg-surface-container-low px-2 py-1 text-[10px] font-bold uppercase text-slate-body opacity-60">{t.tax.estimate}</span>
          </div>
          <div>
            <h3 className="mb-1 text-label-md font-label-md text-slate-body">{t.tax.pphFinal}</h3>
            <p className="text-metric-display font-metric-display text-slate-heading">{formatIDR(4_250_000)}</p>
            <p className="mt-2 flex items-center gap-1 text-body-sm text-slate-body">
              <TrendingUp className="h-4 w-4 text-secondary" />
              <span className="font-semibold text-secondary">+12%</span> {t.tax.fromLastMonth}
            </p>
          </div>
        </Card>

        <Card className="bento-card flex flex-col justify-between p-4">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pill-mint-bg text-secondary">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="rounded bg-pill-mint-bg px-2 py-1 text-[10px] font-bold uppercase text-on-secondary-container">{t.tax.payable}</span>
          </div>
          <div>
            <h3 className="mb-1 text-label-md font-label-md text-slate-body">{t.tax.ppnPayable}</h3>
            <p className="text-metric-display font-metric-display text-slate-heading">{formatIDR(12_840_500)}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border-light pt-3">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-body opacity-50">{t.tax.output}</p>
                <p className="text-label-md font-label-md text-slate-heading">Rp 25,1 Jt</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-body opacity-50">{t.tax.input}</p>
                <p className="text-label-md font-label-md text-slate-heading">Rp 12,3 Jt</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative flex flex-col justify-between overflow-hidden border-alert-coral/20 bg-pill-rose-bg p-4">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-alert-coral/5 blur-2xl" />
          <div className="relative z-10 mb-4 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-alert-coral shadow-sm">
              <BellRing className="h-5 w-5" />
            </div>
            <span className="rounded bg-white/50 px-2 py-1 text-[10px] font-bold uppercase text-alert-coral">{t.tax.urgent}</span>
          </div>
          <div className="relative z-10">
            <h3 className="mb-1 text-label-md font-label-md text-slate-heading">{t.tax.deadlineAlert}</h3>
            <p className="text-headline-sm font-headline-sm leading-tight text-alert-coral">{t.tax.deadlineText}</p>
            <a href="#" className="mt-3 inline-flex items-center gap-1 text-body-sm font-bold text-alert-coral hover:underline">
              {t.tax.reportNow} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* history table */}
        <Card className="flex flex-col overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border-light p-4">
            <h2 className="text-headline-sm font-headline-sm text-slate-heading">{t.tax.reportHistory}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-border-light bg-surface-container-low">
                <tr>
                  {[t.tax.taxPeriod, t.tax.taxType, t.tax.billingId, t.tax.amount, t.tax.reported].map((h) => (
                    <th key={h} className="px-4 py-3 text-label-md font-label-md text-slate-body opacity-70">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {HISTORY.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-surface-container-low/30">
                    <td className="px-4 py-4 text-body-md text-slate-heading">{r.period}</td>
                    <td className="px-4 py-4 text-body-md">{r.type}</td>
                    <td className="px-4 py-4 font-mono text-xs">{r.id}</td>
                    <td className="px-4 py-4 text-body-md text-slate-heading">{formatIDR(r.amount)}</td>
                    <td className="px-4 py-4">
                      <Badge variant={r.reported ? 'paid' : 'pending'}>
                        {r.reported ? t.tax.reported : t.tax.notReported}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-auto flex justify-center border-t border-border-light bg-surface-container-low p-4">
            <button className="text-body-sm font-bold text-primary-container hover:underline">{t.tax.viewFullHistory}</button>
          </div>
        </Card>

        {/* quick actions */}
        <section className="flex flex-col gap-6">
          <Card className="p-4">
            <h3 className="mb-4 text-headline-sm font-headline-sm text-slate-heading">{t.tax.quickActions}</h3>
            <div className="space-y-3">
              <ActionButton primary icon={<Receipt className="h-5 w-5" />} label={t.tax.generateBilling} />
              <ActionButton icon={<Download className="h-5 w-5 text-primary-container" />} label={t.tax.downloadReport} />
              <ActionButton icon={<CloudUpload className="h-5 w-5 text-secondary" />} label={t.tax.syncDjpOnline} />
            </div>
            <div className="mt-8 rounded-xl border border-primary-container/10 bg-pill-indigo-bg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 shrink-0 text-primary-container" />
                <div>
                  <p className="text-label-md font-label-md leading-tight text-primary-container">Butuh bantuan konsultasi pajak?</p>
                  <p className="mt-1 text-body-sm text-slate-body">Hubungi Tax Advisor kami untuk tinjauan kepatuhan menyeluruh.</p>
                  <button className="mt-3 flex items-center gap-1 text-body-sm font-bold text-primary-container hover:underline">
                    Mulai Chat <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}

function ActionButton({ primary, icon, label }: { primary?: boolean; icon: React.ReactNode; label: string }) {
  return (
    <button
      className={`group flex w-full items-center justify-between rounded-xl p-4 transition-all ${
        primary
          ? 'bg-primary-container text-white hover:bg-primary'
          : 'border border-border-light bg-white text-slate-heading hover:bg-surface-container-low'
      }`}
    >
      <span className="flex items-center gap-3">
        {icon}
        <span className="text-label-md font-label-md">{label}</span>
      </span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
