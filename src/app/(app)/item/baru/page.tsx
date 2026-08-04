'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IonCard,
  IonCardContent,
  IonInput,
  IonTextarea,
  IonToggle,
  IonButton,
  IonSpinner,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { ImagePlus } from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';
import { useCreateItem } from '@/lib/data/items';

export default function NewItemPage() {
  const t = useTranslation();
  const router = useRouter();
  const createItem = useCreateItem();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [salePrice, setSalePrice] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [taxable, setTaxable] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createItem.mutateAsync({
        name,
        sku: sku || null,
        category: category || null,
        description: description || null,
        sale_price: salePrice,
        purchase_price: purchasePrice,
        quantity,
        taxable,
        enabled,
      });
      router.push('/item');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.saveFailed);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-headline-lg font-headline-lg text-slate-heading">{t.items.formTitle}</h2>
        <p className="text-body-md font-body-md text-slate-body">{t.items.subtitle}</p>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <IonInput
            fill="outline"
            labelPlacement="stacked"
            label={t.items.name}
            value={name}
            onIonInput={(e) => setName(e.detail.value ?? '')}
            placeholder={t.items.namePlaceholder}
            required
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <IonInput fill="outline" labelPlacement="stacked" label={t.items.sku} value={sku} onIonInput={(e) => setSku(e.detail.value ?? '')} placeholder={t.items.skuPlaceholder} />
            <IonInput fill="outline" labelPlacement="stacked" label={t.items.category} value={category} onIonInput={(e) => setCategory(e.detail.value ?? '')} placeholder={t.items.categoryPlaceholder} />
          </div>
          <IonTextarea
            fill="outline"
            labelPlacement="stacked"
            label={t.items.description}
            value={description}
            onIonInput={(e) => setDescription(e.detail.value ?? '')}
            autoGrow
            rows={3}
            placeholder={t.items.descPlaceholder}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <IonInput fill="outline" labelPlacement="stacked" label={`${t.items.sellPrice} (Rp)`} type="number" min={0} value={salePrice} onIonInput={(e) => setSalePrice(Number(e.detail.value))} />
            <IonInput fill="outline" labelPlacement="stacked" label={`${t.items.costPrice} (Rp)`} type="number" min={0} value={purchasePrice} onIonInput={(e) => setPurchasePrice(Number(e.detail.value))} />
            <IonInput fill="outline" labelPlacement="stacked" label={t.items.stock} type="number" min={0} value={quantity} onIonInput={(e) => setQuantity(Number(e.detail.value))} />
          </div>
          <IonItem lines="none" className="rounded-lg" style={{ '--background': '#fff', '--border-radius': '8px', border: '1px solid var(--ion-border-color)' } as React.CSSProperties}>
            <IonLabel>
              {t.items.tax}
              <p className="text-body-sm text-slate-body">PPN 11%</p>
            </IonLabel>
            <IonToggle slot="end" checked={taxable} onIonChange={(e) => setTaxable(e.detail.checked)} />
          </IonItem>
          {error && <p className="text-body-sm font-semibold text-alert-coral">{error}</p>}
        </div>

        <aside className="space-y-4 xl:col-span-4">
          <IonCard className="m-0">
            <IonCardContent>
              <p className="mb-3 text-label-md font-label-md text-slate-heading">{t.items.productImage}</p>
              <button type="button" className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-light text-label-md font-label-md text-slate-body">
                <ImagePlus className="h-8 w-8" />
                {t.items.uploadImage}
              </button>
            </IonCardContent>
          </IonCard>
          <IonCard className="m-0">
            <IonItem lines="none">
              <IonLabel>
                {t.items.status}
                <p className="text-body-sm text-slate-body">{t.items.enabled}</p>
              </IonLabel>
              <IonToggle slot="end" checked={enabled} onIonChange={(e) => setEnabled(e.detail.checked)} />
            </IonItem>
          </IonCard>
        </aside>

        <div className="flex gap-3 xl:col-span-8">
          <IonButton type="submit" disabled={createItem.isPending}>
            {createItem.isPending && <IonSpinner name="crescent" slot="start" />}
            {t.common.save}
          </IonButton>
          <IonButton type="button" fill="outline" onClick={() => router.push('/item')}>
            {t.common.cancel}
          </IonButton>
        </div>
      </form>
    </>
  );
}
