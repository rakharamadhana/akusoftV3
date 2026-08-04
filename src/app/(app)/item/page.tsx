'use client';

import { useRouter } from 'next/navigation';
import {
  IonCard,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonBadge,
  IonSpinner,
  IonListHeader,
} from '@ionic/react';
import { Package, Boxes, AlertTriangle, PlusCircle, Trash2 } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR, formatNumberID } from '@/lib/format';
import { useItems, useDeleteItem } from '@/lib/data/items';

export default function ItemsPage() {
  const t = useTranslation();
  const router = useRouter();
  const { data: items = [], isLoading } = useItems();
  const deleteItem = useDeleteItem();

  const activeCount = items.filter((i) => i.enabled).length;
  const inventoryValue = items.reduce((s, i) => s + Number(i.purchase_price) * i.quantity, 0);
  const lowStock = items.filter((i) => i.quantity > 0 && i.quantity < 10).length;

  return (
    <>
      <section className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-slate-heading">{t.items.title}</h2>
          <p className="text-body-md font-body-md text-slate-body">{t.items.subtitle}</p>
        </div>
        <IonButton onClick={() => router.push('/item/baru')}>
          <span slot="start" className="mr-1"><PlusCircle className="h-5 w-5" /></span>
          {t.items.addItem}
        </IonButton>
      </section>

      <section className="metric-scroller -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
        {[
          <StatCard key="active" icon={<Package className="text-primary-container" />} iconBg="bg-pill-indigo-bg" label={t.items.activeItems} value={`${activeCount}`} />,
          <StatCard key="inventory" icon={<Boxes className="text-secondary" />} iconBg="bg-pill-mint-bg" label={t.items.inventoryValue} value={formatIDR(inventoryValue)} />,
          <StatCard key="low" icon={<AlertTriangle className="text-[#D97706]" />} iconBg="bg-pill-amber-bg" label={t.items.lowStock} value={`${lowStock}`} />,
        ].map((card, i) => (
          <div key={i} className="min-w-[75%] shrink-0 snap-start sm:min-w-[46%] md:min-w-0 md:shrink">
            {card}
          </div>
        ))}
      </section>

      <IonCard className="m-0 overflow-hidden">
        <IonList>
          <IonListHeader><IonLabel className="text-headline-sm font-headline-sm">{t.items.title}</IonLabel></IonListHeader>
          {isLoading ? (
            <IonItem lines="none"><IonSpinner name="crescent" /> <IonLabel className="ml-2">{t.common.loading}</IonLabel></IonItem>
          ) : items.length === 0 ? (
            <IonItem lines="none"><IonLabel className="text-slate-body">{t.common.empty}</IonLabel></IonItem>
          ) : (
            items.map((it) => (
              <IonItem key={it.id}>
                <IonLabel>
                  <h3 className="font-semibold text-slate-heading">{it.name}</h3>
                  <p className="text-slate-body">
                    {it.sku ?? '—'} · {it.category ?? '—'} ·{' '}
                    <span className={it.quantity === 0 ? 'text-alert-coral' : it.quantity < 10 ? 'text-[#D97706]' : ''}>
                      {t.items.stock}: {formatNumberID(it.quantity)}
                    </span>
                  </p>
                </IonLabel>
                <div slot="end" className="flex items-center gap-2">
                  <span className="font-semibold text-slate-heading">{formatIDR(Number(it.sale_price))}</span>
                  <IonBadge color={it.enabled ? 'success' : 'medium'}>{it.enabled ? t.common.active : 'Nonaktif'}</IonBadge>
                  <IonButton
                    fill="clear"
                    size="small"
                    color="danger"
                    aria-label={t.common.delete}
                    onClick={() => {
                      if (confirm(`${t.common.delete} "${it.name}"?`)) deleteItem.mutate(it.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
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
