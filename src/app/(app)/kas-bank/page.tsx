'use client';

import {
  Landmark,
  Wallet,
  Banknote,
  MoreHorizontal,
  UploadCloud,
  Plus,
  Sparkles,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  HelpCircle,
  PlusCircle,
  Link2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shell/page-header';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR, formatDateID } from '@/lib/format';

const ACCOUNTS = [
  { name: 'Bank BCA', sub: '**** 8821 — PT Maju Bersama', balance: 95_000_000, icon: Landmark, tint: 'bg-pill-indigo-bg text-primary-container' },
  { name: 'Bank Mandiri', sub: '**** 1024 — Operasional', balance: 35_200_000, icon: Wallet, tint: 'bg-pill-amber-bg text-[#D97706]' },
  { name: 'Kas Utama', sub: 'Petty Cash — Office ID', balance: 8_450_000, icon: Banknote, tint: 'bg-pill-indigo-bg text-primary-container' },
];

type Row = {
  bankLabel: string; date: string; ref: string; amount: number; incoming: boolean;
  confidence: number | null; bookTitle: string; bookSub: string; bookAmount: number | null;
};

const ROWS: Row[] = [
  { bankLabel: 'CR-TRF DARI MANDIRI PT SENTOSA', date: '2023-10-12', ref: '0992318', amount: 12_500_000, incoming: true, confidence: 99, bookTitle: 'Inv #INV-2023-088', bookSub: 'Klien: PT Sentosa Jaya', bookAmount: 12_500_000 },
  { bankLabel: 'DB-PEMBAYARAN LISTRIK PLN', date: '2023-10-11', ref: 'PLN-JKT-1', amount: 2_450_000, incoming: false, confidence: 95, bookTitle: 'Pengeluaran #EXP-044', bookSub: 'Kategori: Utilitas (Listrik)', bookAmount: 2_450_000 },
  { bankLabel: 'DB-BIAYA ADM BANK BCA', date: '2023-10-10', ref: 'ADM-10', amount: 15_000, incoming: false, confidence: null, bookTitle: '', bookSub: '', bookAmount: null },
];

export default function BankPage() {
  const t = useTranslation();

  return (
    <>
      <PageHeader title={t.bank.title} subtitle={t.bank.subtitle}>
        <Button variant="secondary">
          <UploadCloud className="h-5 w-5" />
          {t.bank.importStatement}
        </Button>
        <Button variant="primary">
          <Plus className="h-5 w-5" />
          {t.bank.addAccount}
        </Button>
      </PageHeader>

      {/* Account cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {ACCOUNTS.map((a) => (
          <Card key={a.name} className="bento-card group p-6">
            <div className="mb-6 flex items-start justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${a.tint}`}>
                <a.icon className="h-7 w-7" />
              </div>
              <MoreHorizontal className="h-5 w-5 cursor-pointer text-slate-400 transition-colors group-hover:text-primary-container" />
            </div>
            <h3 className="text-headline-sm font-headline-sm text-slate-heading">{a.name}</h3>
            <p className="mb-4 text-body-sm text-slate-body">{a.sub}</p>
            <div className="text-metric-display font-metric-display text-slate-heading">{formatIDR(a.balance)}</div>
            <div className="mt-6 flex items-center justify-between">
              <span className="flex items-center gap-1 rounded-full bg-pill-mint-bg px-2 py-1 text-label-md font-label-md text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" /> {t.common.active}
              </span>
              <a href="#" className="text-label-md font-label-md text-primary-container hover:underline">{t.common.viewDetail}</a>
            </div>
          </Card>
        ))}
      </section>

      {/* AI matcher */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-headline-sm font-headline-sm text-slate-heading">{t.bank.aiMatcher}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-body-sm italic text-slate-body sm:inline">{t.bank.lastUpdated}</span>
            <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-surface-container">
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        <Card className="overflow-hidden">
          {/* header row */}
          <div className="grid grid-cols-12 gap-4 border-b border-border-light bg-surface-container-low px-6 py-4">
            <div className="col-span-5 text-label-md font-label-md uppercase tracking-wider text-slate-heading">{t.bank.bankMutation}</div>
            <div className="col-span-1 flex items-center justify-center"><Link2 className="h-4 w-4 text-slate-400" /></div>
            <div className="col-span-4 text-label-md font-label-md uppercase tracking-wider text-slate-heading">{t.bank.bookTransaction}</div>
            <div className="col-span-2 text-right text-label-md font-label-md uppercase tracking-wider text-slate-heading">{t.bank.action}</div>
          </div>

          {ROWS.map((r) => (
            <div key={r.ref} className="grid grid-cols-12 items-center gap-4 border-b border-border-light px-6 py-6 transition-colors hover:bg-surface-bright">
              {/* bank side */}
              <div className="col-span-5 flex gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${r.incoming ? 'bg-pill-mint-bg text-secondary' : 'bg-pill-rose-bg text-error'}`}>
                  {r.incoming ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                </div>
                <div>
                  <div className="text-label-md font-label-md text-slate-heading">{r.bankLabel}</div>
                  <div className="text-body-sm text-slate-body">{formatDateID(r.date)} · Ref: {r.ref}</div>
                  <div className={`mt-1 text-body-lg font-bold ${r.incoming ? 'text-secondary' : 'text-error'}`}>{formatIDR(r.amount)}</div>
                </div>
              </div>

              {/* match indicator */}
              <div className="col-span-1 flex flex-col items-center justify-center gap-1">
                {r.confidence !== null ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-secondary" />
                    <span className="rounded bg-pill-mint-bg px-1.5 py-0.5 text-[10px] font-bold uppercase text-secondary">{r.confidence}% {t.bank.match}</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-6 w-6 text-slate-400" />
                    <span className="rounded bg-pill-indigo-bg px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-container">{t.bank.aiSuggest}</span>
                  </>
                )}
              </div>

              {/* book side */}
              <div className="col-span-4">
                {r.confidence !== null ? (
                  <div className="rounded-lg border border-dashed border-secondary/40 bg-pill-mint-bg/20 p-3">
                    <div className="text-label-md font-label-md text-slate-heading">{r.bookTitle}</div>
                    <div className="text-body-sm text-slate-body">{r.bookSub}</div>
                    <div className="mt-1 text-body-md font-bold text-slate-heading">{formatIDR(r.bookAmount!)}</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-primary-container/40 bg-pill-indigo-bg/10 py-4 text-center">
                    <PlusCircle className="h-5 w-5 text-primary-container" />
                    <div className="text-label-md font-label-md text-primary-container">{t.bank.createNewTx}</div>
                    <div className="text-body-sm italic text-slate-body">{t.bank.noMatch}</div>
                  </div>
                )}
              </div>

              {/* action */}
              <div className="col-span-2 text-right">
                {r.confidence !== null ? (
                  <Button variant="primary" size="sm">{t.bank.reconcile}</Button>
                ) : (
                  <Button variant="secondary" size="sm">{t.bank.viewOptions}</Button>
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-center py-6">
            <button className="text-label-md font-label-md text-primary-container hover:underline">{t.bank.showMore}</button>
          </div>
        </Card>
      </section>
    </>
  );
}
