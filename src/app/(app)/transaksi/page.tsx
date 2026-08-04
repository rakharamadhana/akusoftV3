'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IonCard,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR, formatDateID } from '@/lib/format';
import { useTransactions, type TxTypeFilter } from '@/lib/data/transactions';

export default function TransactionsPage() {
  const t = useTranslation();
  const router = useRouter();
  const [filter, setFilter] = useState<TxTypeFilter>('all');
  const { data: rows = [], isLoading } = useTransactions(filter);
  const { data: all = [] } = useTransactions('all');

  const totalIn = all.filter((x) => x.type === 'income').reduce((s, x) => s + Number(x.amount), 0);
  const totalOut = all.filter((x) => x.type === 'expense').reduce((s, x) => s + Number(x.amount), 0);

  return (
    <>
      <div>
        <h2 className="text-headline-lg font-headline-lg text-slate-heading">{t.transactions.title}</h2>
        <p className="text-body-md font-body-md text-slate-body">{t.transactions.subtitle}</p>
      </div>

      <section className="metric-scroller -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
        {[
          <StatCard key="in" icon={<ArrowDownLeft className="text-secondary" />} iconBg="bg-pill-mint-bg" label={t.transactions.totalIn} value={formatIDR(totalIn)} />,
          <StatCard key="out" icon={<ArrowUpRight className="text-alert-coral" />} iconBg="bg-pill-rose-bg" label={t.transactions.totalOut} value={formatIDR(totalOut)} />,
          <StatCard key="net" icon={<ArrowDownLeft className="text-primary-container" />} iconBg="bg-pill-indigo-bg" label={t.transactions.net} value={formatIDR(totalIn - totalOut)} />,
        ].map((card, i) => (
          <div key={i} className="min-w-[75%] shrink-0 snap-start sm:min-w-[46%] md:min-w-0 md:shrink">
            {card}
          </div>
        ))}
      </section>

      <IonSegment value={filter} onIonChange={(e) => setFilter((e.detail.value as TxTypeFilter) ?? 'all')}>
        <IonSegmentButton value="all"><IonLabel>{t.transactions.all}</IonLabel></IonSegmentButton>
        <IonSegmentButton value="income"><IonLabel>{t.transactions.incomeOnly}</IonLabel></IonSegmentButton>
        <IonSegmentButton value="expense"><IonLabel>{t.transactions.expenseOnly}</IonLabel></IonSegmentButton>
      </IonSegment>

      <IonCard className="m-0 overflow-hidden">
        <IonList>
          {isLoading ? (
            <IonItem lines="none"><IonSpinner name="crescent" /> <IonLabel className="ml-2">{t.common.loading}</IonLabel></IonItem>
          ) : rows.length === 0 ? (
            <IonItem lines="none"><IonLabel className="text-slate-body">{t.common.empty}</IonLabel></IonItem>
          ) : (
            rows.map((x) => {
              const isIn = x.type === 'income';
              const targetUrl = isIn ? `/pemasukan/edit?id=${x.id}` : `/pengeluaran/edit?id=${x.id}`;
              return (
                <IonItem
                  key={x.id}
                  button
                  detail={false}
                  onClick={() => router.push(targetUrl)}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span slot="start" className={isIn ? 'text-secondary' : 'text-alert-coral'}>
                    {isIn ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                  </span>
                  <IonLabel>
                    <h3 className="font-medium text-slate-heading">{x.description ?? x.customer ?? x.category ?? '—'}</h3>
                    <p className="text-slate-body">{formatDateID(x.paid_at)} · {x.accounts?.name ?? '—'}</p>
                  </IonLabel>
                  <div slot="end" className="flex items-center gap-3">
                    <span className={`font-bold ${isIn ? 'text-secondary' : 'text-slate-heading'}`}>
                      {isIn ? '+' : '−'} {formatIDR(Number(x.amount))}
                    </span>
                    <span className="text-slate-400 text-xs font-semibold hover:text-primary-container">Sunting</span>
                  </div>
                </IonItem>
              );
            })
          )}
        </IonList>
      </IonCard>
    </>
  );
}
