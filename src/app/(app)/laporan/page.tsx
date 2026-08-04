'use client';

import { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { FileDown, Printer, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR } from '@/lib/format';
import { useReportData, useProfitLoss, usePostRetainedEarnings, type PLRow } from '@/lib/data/reports';
import { useActiveCompany } from '@/store/auth';

const QUARTERS = ['Jan–Mar', 'Apr–Jun', 'Jul–Sep', 'Okt–Des'];

export default function ReportsPage() {
  const t = useTranslation();
  const company = useActiveCompany();
  const [tab, setTab] = useState<'labaRugi' | 'neraca'>('labaRugi');
  const [year, setYear] = useState(new Date().getFullYear());
  const [isExporting, setIsExporting] = useState(false);
  const pl = useProfitLoss(year);
  const { data: neraca } = useReportData();
  const post = usePostRetainedEarnings();
  const yearOptions = pl.data?.years ?? [year];

  const handlePrint = () => {
    const originalTitle = document.title;
    const reportType = tab === 'labaRugi' ? `Laba_Rugi_${year}` : 'Neraca';
    document.title = `Laporan_Keuangan_${reportType}`;
    window.print();
    document.title = originalTitle;
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { downloadReportPDF } = await import('@/lib/pdf-export');
      await downloadReportPDF({
        type: tab,
        year,
        companyName: company?.name ?? 'Akusoft 3.0',
        plData: pl.data,
        neracaData: neraca,
        quarters: QUARTERS,
        formatIDR,
      });
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-slate-heading">{t.reports.title}</h2>
          <p className="text-body-md font-body-md text-slate-body">{t.reports.subtitle}</p>
        </div>
        <div className="flex gap-2 no-print">
          <IonButton fill="outline" onClick={handlePrint}>
            <Printer className="mr-1 h-5 w-5" />
            {t.common.print}
          </IonButton>
          <IonButton onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? <IonSpinner name="crescent" className="mr-1" /> : <FileDown className="mr-1 h-5 w-5" />}
            {t.reports.exportPdf}
          </IonButton>
        </div>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <IonSegment className="max-w-xs" value={tab} onIonChange={(e) => setTab((e.detail.value as 'labaRugi' | 'neraca') ?? 'labaRugi')}>
          <IonSegmentButton value="labaRugi"><IonLabel>{t.reports.labaRugi}</IonLabel></IonSegmentButton>
          <IonSegmentButton value="neraca"><IonLabel>{t.reports.neraca}</IonLabel></IonSegmentButton>
        </IonSegment>
        {tab === 'labaRugi' && (
          <IonSelect fill="outline" label={t.reports.year} labelPlacement="start" className="max-w-[200px]" value={year} onIonChange={(e) => setYear(Number(e.detail.value))}>
            {yearOptions.map((y) => (
              <IonSelectOption key={y} value={y}>{y}</IonSelectOption>
            ))}
          </IonSelect>
        )}
      </div>

      {tab === 'labaRugi' ? (
        pl.isLoading || !pl.data ? (
          <IonCard className="m-0"><IonCardContent className="text-center text-slate-body">{t.common.loading}</IonCardContent></IonCard>
        ) : (
          <>
            <IonCard className="m-0 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="px-4 py-4 text-label-md font-label-md text-slate-heading">&nbsp;</th>
                    {QUARTERS.map((q) => (
                      <th key={q} className="px-4 py-4 text-right text-label-md font-label-md text-slate-body">{q}</th>
                    ))}
                    <th className="px-4 py-4 text-right text-label-md font-bold text-slate-heading">{t.reports.totalColumn}</th>
                  </tr>
                </thead>
                <tbody>
                  <SectionHeader label={t.reports.pemasukanSection} />
                  {pl.data.income.map((r) => <PLDataRow key={`${r.code}-${r.name}`} row={r} />)}
                  <TotalRow label={t.reports.totalIncome} cols={pl.data.incomeTotals} total={pl.data.incomeTotal} />
                  <SectionHeader label={t.reports.pengeluaranSection} />
                  {pl.data.expense.map((r) => <PLDataRow key={`${r.code}-${r.name}`} row={r} />)}
                  <TotalRow label={t.reports.totalExpense} cols={pl.data.expenseTotals} total={pl.data.expenseTotal} />
                  <tr className="border-t-2 border-slate-heading/20 bg-surface-container-low/40">
                    <td className="px-4 py-4 text-body-lg font-bold text-slate-heading">{t.reports.netProfit}</td>
                    {pl.data.netByQuarter.map((v, i) => (
                      <td key={i} className="px-4 py-4 text-right text-body-md font-bold text-slate-heading">{formatIDR(v)}</td>
                    ))}
                    <td className="px-4 py-4 text-right text-headline-sm font-headline-sm text-secondary">{formatIDR(pl.data.net)}</td>
                  </tr>
                </tbody>
              </table>
            </IonCard>

            <IonCard className="m-0">
              <IonCardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-headline-sm font-headline-sm text-slate-heading">{t.reports.updateLabaRugi}</h4>
                  <p className="text-body-sm text-slate-body opacity-70">{t.reports.updateHint}</p>
                </div>
                <IonButton onClick={() => post.mutate(pl.data!.net)} disabled={post.isPending}>
                  {post.isPending ? <IonSpinner name="crescent" className="mr-1" /> : <RefreshCw className="mr-1 h-5 w-5" />}
                  {t.reports.updateLabaRugi}
                </IonButton>
              </IonCardContent>
            </IonCard>
          </>
        )
      ) : !neraca ? (
        <IonCard className="m-0"><IonCardContent className="text-center text-slate-body">{t.common.loading}</IonCardContent></IonCard>
      ) : (
        <NeracaView data={neraca} />
      )}
    </>
  );
}

function NeracaView({ data }: { data: NonNullable<ReturnType<typeof useReportData>['data']> }) {
  const t = useTranslation();
  const totalLiabEquity = data.totalLiabilities + data.modal + data.retained;
  const balanced = Math.abs(data.totalAssets - totalLiabEquity) < 1;
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <IonCard className="m-0">
        <IonCardContent>
          <h4 className="mb-4 text-headline-sm font-headline-sm text-slate-heading">{t.reports.assets}</h4>
          <StatementRow label={t.reports.cashAsset} value={formatIDR(data.cash)} />
          <StatementRow label={t.reports.inventory} value={formatIDR(data.inventory)} />
          <StatementRow label={t.reports.otherAssets} value={formatIDR(data.otherAssets)} />
          <StatementRow label={t.reports.totalAssets} value={formatIDR(data.totalAssets)} strong />
        </IonCardContent>
      </IonCard>
      <IonCard className="m-0">
        <IonCardContent>
          <h4 className="mb-4 text-headline-sm font-headline-sm text-slate-heading">{t.reports.liabilities} + {t.reports.capital}</h4>
          <StatementRow label={t.reports.liabilities} value={formatIDR(data.totalLiabilities)} />
          <StatementRow label={t.reports.capital} value={formatIDR(data.modal)} />
          <StatementRow label={t.reports.retainedProfit} value={formatIDR(data.retained)} muted={data.retained === 0} />
          <StatementRow label={t.reports.totalLiabEquity} value={formatIDR(totalLiabEquity)} strong />
          <div className={`mt-4 flex items-center gap-2 rounded-lg p-3 text-label-md font-label-md ${balanced ? 'bg-pill-mint-bg/50 text-secondary' : 'bg-pill-amber-bg/60 text-[#D97706]'}`}>
            {balanced ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {balanced ? t.reports.balanced : t.reports.updateHint}
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <tr>
      <td colSpan={6} className="px-4 pb-2 pt-6 text-label-md font-bold uppercase tracking-wider text-slate-heading">{label}</td>
    </tr>
  );
}
function PLDataRow({ row }: { row: PLRow }) {
  return (
    <tr className="border-t border-border-light/60">
      <td className="px-4 py-3 text-body-md text-slate-heading">
        {row.code && <span className="mr-2 font-mono text-slate-body">{row.code}</span>}
        {row.name}
      </td>
      {row.quarters.map((v, i) => (
        <td key={i} className="px-4 py-3 text-right text-body-md text-slate-body">{formatIDR(v)}</td>
      ))}
      <td className="px-4 py-3 text-right text-body-md font-semibold text-slate-heading">{formatIDR(row.total)}</td>
    </tr>
  );
}
function TotalRow({ label, cols, total }: { label: string; cols: number[]; total: number }) {
  return (
    <tr className="bg-surface-container-low/30">
      <td className="px-4 py-3 text-body-md font-bold text-slate-heading">{label}</td>
      {cols.map((v, i) => (
        <td key={i} className="px-4 py-3 text-right text-body-md font-bold text-slate-heading">{formatIDR(v)}</td>
      ))}
      <td className="px-4 py-3 text-right text-body-md font-bold text-slate-heading">{formatIDR(total)}</td>
    </tr>
  );
}
function StatementRow({ label, value, muted, strong }: { label: string; value: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border-light py-3 last:border-0">
      <span className={`text-body-md ${strong ? 'font-bold text-slate-heading' : 'text-slate-body'}`}>{label}</span>
      <span className={`font-semibold ${strong ? 'text-headline-sm text-slate-heading' : muted ? 'text-alert-coral' : 'text-slate-heading'}`}>{value}</span>
    </div>
  );
}
