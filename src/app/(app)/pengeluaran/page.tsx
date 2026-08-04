'use client';

import { useRouter } from 'next/navigation';
import { IonCard, IonList, IonItem, IonLabel, IonButton, IonBadge, IonSpinner, IonListHeader } from '@ionic/react';
import { Wallet, ShoppingCart, Tag, PlusCircle, Pencil } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR, formatDateID } from '@/lib/format';
import { useTransactions, type TransactionWithAccount } from '@/lib/data/transactions';

export default function ExpensesPage() {
  const t = useTranslation();
  const router = useRouter();
  const { data: rows = [], isLoading } = useTransactions('expense');

  const total = rows.reduce((s, r) => s + Number(r.amount), 0);
  const merchandise = rows.filter((r) => r.expense_type === 'merchandise').reduce((s, r) => s + Number(r.amount), 0);
  const nonMerchandise = total - merchandise;

  return (
    <>
      <section className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-slate-heading">{t.expenses.title}</h2>
          <p className="text-body-md font-body-md text-slate-body">{t.expenses.subtitle}</p>
        </div>
        <IonButton onClick={() => router.push('/pengeluaran/baru')}>
          <span slot="start" className="mr-1"><PlusCircle className="h-5 w-5" /></span>
          {t.common.recordExpense}
        </IonButton>
      </section>

      <section className="metric-scroller -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
        {[
          <StatCard key="total" icon={<Wallet className="text-primary-container" />} iconBg="bg-pill-indigo-bg" label={t.expenses.totalThisMonth} value={formatIDR(total)} />,
          <StatCard key="merchandise" icon={<ShoppingCart className="text-alert-coral" />} iconBg="bg-pill-rose-bg" label={t.expenses.typeMerchandise} value={formatIDR(merchandise)} />,
          <StatCard key="nonMerchandise" icon={<Tag className="text-secondary" />} iconBg="bg-pill-mint-bg" label={t.expenses.typeNonMerchandise} value={formatIDR(nonMerchandise)} />,
        ].map((card, i) => (
          <div key={i} className="min-w-[75%] shrink-0 snap-start sm:min-w-[46%] md:min-w-0 md:shrink">
            {card}
          </div>
        ))}
      </section>

      <IonCard className="m-0 overflow-hidden">
        <IonList>
          <IonListHeader><IonLabel className="text-headline-sm font-headline-sm">{t.expenses.recentList}</IonLabel></IonListHeader>
          {isLoading ? (
            <IonItem lines="none"><IonSpinner name="crescent" /> <IonLabel className="ml-2">{t.common.loading}</IonLabel></IonItem>
          ) : rows.length === 0 ? (
            <IonItem lines="none"><IonLabel className="text-slate-body">{t.common.empty}</IonLabel></IonItem>
          ) : (
            rows.map((r: TransactionWithAccount) => (
              <IonItem key={r.id} button detail={false} onClick={() => router.push(`/pengeluaran/edit?id=${r.id}`)} className="cursor-pointer hover:bg-slate-50 transition-colors">
                <IonLabel>
                  <h3 className="font-semibold text-slate-heading">{r.category ?? r.description ?? '—'}</h3>
                  <p className="text-slate-body">
                    {formatDateID(r.paid_at)} · {r.payment_method ?? '—'} · {r.accounts?.name ?? '—'}
                  </p>
                </IonLabel>
                <div slot="end" className="flex items-center gap-2">
                  <IonBadge color={r.expense_type === 'merchandise' ? 'primary' : 'warning'}>
                    {r.expense_type === 'merchandise' ? t.expenses.typeMerchandise : t.expenses.typeNonMerchandise}
                  </IonBadge>
                  <span className="font-bold text-slate-heading">{formatIDR(Number(r.amount))}</span>
                  <IonButton
                    fill="clear"
                    size="small"
                    aria-label={t.common.edit}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/pengeluaran/edit?id=${r.id}`);
                    }}
                  >
                    <Pencil className="h-4 w-4 text-slate-500 hover:text-slate-700" />
                  </IonButton>
                </div>
              </IonItem>
            ))
          )}
        </IonList>
      </IonCard>
    </>
  );
}
