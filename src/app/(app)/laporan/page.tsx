'use client';

import { FileSpreadsheet, FileDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shell/page-header';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR, calcPPhFinal } from '@/lib/format';

const REVENUE = 245_850_000;
const EXPENSE = 163_450_000;
const NET = REVENUE - EXPENSE;

export default function ReportsPage() {
  const t = useTranslation();

  return (
    <>
      <PageHeader title={t.reports.title} subtitle={t.reports.subtitle}>
        <Button variant="secondary">
          <FileSpreadsheet className="h-5 w-5" />
          {t.reports.exportExcel}
        </Button>
        <Button variant="primary">
          <FileDown className="h-5 w-5" />
          {t.reports.exportPdf}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* P&L */}
        <Card className="p-6 lg:col-span-2">
          <h4 className="mb-6 text-headline-sm font-headline-sm text-slate-heading">{t.reports.profitLoss}</h4>
          <div className="divide-y divide-border-light">
            <PnlRow label={t.reports.revenue} value={formatIDR(REVENUE)} />
            <PnlRow label={t.reports.expense} value={`- ${formatIDR(EXPENSE)}`} muted />
            <div className="flex items-center justify-between py-4">
              <span className="text-body-lg font-bold text-slate-heading">{t.reports.netProfit}</span>
              <span className="text-metric-display font-metric-display text-secondary">{formatIDR(NET)}</span>
            </div>
          </div>
        </Card>

        {/* Tax summary */}
        <Card className="p-6">
          <h4 className="mb-6 text-headline-sm font-headline-sm text-slate-heading">{t.reports.taxSummary}</h4>
          <div className="space-y-4">
            <div className="rounded-xl bg-pill-indigo-bg/50 p-4">
              <p className="text-label-md font-label-md text-slate-body">PPN 11% (Terkumpul)</p>
              <p className="text-headline-sm font-headline-sm text-slate-heading">{formatIDR(27_043_500)}</p>
            </div>
            <div className="rounded-xl bg-pill-mint-bg/50 p-4">
              <p className="text-label-md font-label-md text-slate-body">PPh Final 0.5% (UMKM)</p>
              <p className="text-headline-sm font-headline-sm text-slate-heading">{formatIDR(calcPPhFinal(REVENUE))}</p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function PnlRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="text-body-md text-slate-body">{label}</span>
      <span className={`text-body-lg font-semibold ${muted ? 'text-alert-coral' : 'text-slate-heading'}`}>{value}</span>
    </div>
  );
}
