'use client';

import { useRouter } from 'next/navigation';
import { IonCard, IonCardContent, IonList, IonItem, IonLabel, IonBadge, IonButton, IonSpinner } from '@ionic/react';
import { TrendingUp, Landmark, FileWarning, Wallet, ArrowRight, ArrowDownLeft, ArrowUpRight, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useTranslation } from '@/i18n/use-translation';
import { useAuthStore } from '@/store/auth';
import { formatIDR, formatDateID } from '@/lib/format';
import { useReportData } from '@/lib/data/reports';
import { useAccounts } from '@/lib/data/accounts';
import { useTransactions } from '@/lib/data/transactions';

export default function DashboardPage() {
  const t = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: report } = useReportData();
  const { data: accounts = [] } = useAccounts();
  const { data: transactions = [], isLoading } = useTransactions('all');

  const balanceOf = (names: string[]) =>
    accounts.filter((a) => names.includes(a.name)).reduce((s, a) => s + Number(a.balance), 0);
  const totalCash = balanceOf(['Kas', 'Bank']);
  const receivables = balanceOf(['Piutang Usaha']);
  const recent = transactions.slice(0, 6);

  return (
    <>
      <div>
        <h2 className="text-headline-lg font-headline-lg text-slate-heading">{t.dashboard.title}</h2>
        <p className="text-body-lg font-body-lg text-slate-body">
          {user?.name ? `${t.dashboard.subtitle} · ${user.name}` : t.dashboard.subtitle}
        </p>
      </div>

      {/* Primary actions: side-by-side (left and right) */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4">
        <BigAction href="/pemasukan/baru" icon={<ArrowDownCircle className="h-6 w-6 sm:h-7 sm:w-7" />} title={t.dashboard.pendapatan} subtitle={t.dashboard.pendapatanSub} tone="income" onClick={() => router.push('/pemasukan/baru')} />
        <BigAction href="/pengeluaran/baru" icon={<ArrowUpCircle className="h-6 w-6 sm:h-7 sm:w-7" />} title={t.dashboard.pembayaran} subtitle={t.dashboard.pembayaranSub} tone="expense" onClick={() => router.push('/pengeluaran/baru')} />
      </section>

      {/* Metrics: swipeable carousel on mobile, bento grid on desktop (DESIGN.md §Layout). */}
      <section className="metric-scroller -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
        {[
          <StatCard key="rev" icon={<TrendingUp className="text-secondary" />} iconBg="bg-pill-mint-bg" label={t.dashboard.grossRevenue} value={formatIDR(report?.totalIncome ?? 0)} />,
          <StatCard key="net" icon={<Landmark className="text-tertiary" />} iconBg="bg-pill-indigo-bg" label={t.dashboard.netProfit} value={formatIDR(report?.netProfit ?? 0)} />,
          <StatCard key="ar" icon={<FileWarning className="text-alert-coral" />} iconBg="bg-pill-rose-bg" label={t.dashboard.receivables} value={formatIDR(receivables)} />,
          <StatCard key="cash" icon={<Wallet className="text-slate-heading" />} iconBg="bg-surface-container-low" label={t.dashboard.totalCash} value={formatIDR(totalCash)} />,
        ].map((card, i) => (
          <div key={i} className="min-w-[72%] shrink-0 snap-start sm:min-w-[46%] md:min-w-0 md:shrink">
            {card}
          </div>
        ))}
      </section>

      <IonCard className="m-0">
        <IonCardContent>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-headline-sm font-headline-sm text-slate-heading">{t.dashboard.transactionHistory}</h4>
            </div>
            <IonButton fill="clear" size="small" onClick={() => router.push('/transaksi')}>
              {t.common.viewAll}
              <ArrowRight className="ml-1 h-4 w-4" />
            </IonButton>
          </div>
          <IonList>
            {isLoading ? (
              <IonItem lines="none"><IonSpinner name="crescent" /></IonItem>
            ) : recent.length === 0 ? (
              <IonItem lines="none"><IonLabel className="text-slate-body">{t.common.empty}</IonLabel></IonItem>
            ) : (
              recent.map((tx) => {
                const isIn = tx.type === 'income';
                return (
                  <IonItem key={tx.id}>
                    <span slot="start" className={isIn ? 'text-secondary' : 'text-alert-coral'}>
                      {isIn ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                    </span>
                    <IonLabel>
                      <h3 className="text-slate-heading">{tx.description ?? tx.customer ?? '—'}</h3>
                      <p className="text-slate-body">{formatDateID(tx.paid_at)} · {tx.accounts?.name ?? '—'}</p>
                    </IonLabel>
                    <div slot="end" className="flex items-center gap-2">
                      <IonBadge color={isIn ? 'success' : 'danger'}>{isIn ? t.transactions.inFlow : t.transactions.outFlow}</IonBadge>
                      <span className={`font-bold ${isIn ? 'text-secondary' : 'text-slate-heading'}`}>{formatIDR(Number(tx.amount))}</span>
                    </div>
                  </IonItem>
                );
              })
            )}
          </IonList>
        </IonCardContent>
      </IonCard>
    </>
  );
}

function BigAction({
  icon,
  title,
  subtitle,
  tone,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone: 'income' | 'expense';
  onClick: () => void;
}) {
  const isIncome = tone === 'income';
  const iconBg = isIncome
    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-4 ring-emerald-500/10'
    : 'bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-4 ring-blue-600/10';
  const bg = isIncome
    ? 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(255,255,255,1) 100%)'
    : 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(255,255,255,1) 100%)';

  return (
    <IonCard
      className="card-button m-0 h-full min-h-[145px] sm:min-h-[165px] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
      button
      onClick={onClick}
      style={{ background: bg }}
    >
      <IonCardContent className="p-4 sm:p-6 flex flex-col justify-between h-full space-y-3">
        <div className="flex items-center justify-between w-full">
          <div className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
            {icon}
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100/90 text-slate-500">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-heading leading-tight">{title}</h3>
          <p className="text-xs sm:text-body-sm font-medium text-slate-body opacity-80 leading-snug">{subtitle}</p>
        </div>
      </IonCardContent>
    </IonCard>
  );
}
