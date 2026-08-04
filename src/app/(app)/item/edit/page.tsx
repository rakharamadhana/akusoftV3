'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Trash2, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';
import { useItem, useUpdateItem, useDeleteItem } from '@/lib/data/items';
import { ImageUpload } from '@/components/forms/image-upload';

export default function EditItemPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-12"><IonSpinner name="crescent" /></div>}>
      <EditItemContent />
    </Suspense>
  );
}

function EditItemContent() {
  const t = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';

  const { data: item, isLoading, error: itemError } = useItem(id);
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [salePrice, setSalePrice] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [taxable, setTaxable] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (item) {
      if (item.name) setName(item.name);
      if (item.sku) setSku(item.sku);
      if (item.category) setCategory(item.category);
      if (item.description) setDescription(item.description);
      if (item.sale_price) setSalePrice(Number(item.sale_price));
      if (item.purchase_price) setPurchasePrice(Number(item.purchase_price));
      if (item.quantity) setQuantity(Number(item.quantity));
      if (item.taxable !== null) setTaxable(!!item.taxable);
      if (item.enabled !== null) setEnabled(!!item.enabled);
      setImagePath(item.image_path ?? null);
    }
  }, [item]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await updateItem.mutateAsync({
        id,
        name,
        sku: sku || null,
        category: category || null,
        description: description || null,
        sale_price: salePrice,
        purchase_price: purchasePrice,
        quantity,
        taxable,
        enabled,
        image_path: imagePath,
      });
      router.push('/item');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.saveFailed);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus item "${name}"?`)) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteItem.mutateAsync(id);
      router.push('/item');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus item.');
      setIsDeleting(false);
    }
  };

  if (!id) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-alert-coral font-semibold">ID Item tidak valid.</p>
        <IonButton fill="outline" onClick={() => router.push('/item')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali ke Produk
        </IonButton>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <IonSpinner name="crescent" />
        <span className="ml-3 text-slate-body">{t.common.loading}</span>
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-alert-coral font-semibold">Item tidak ditemukan.</p>
        <IonButton fill="outline" onClick={() => router.push('/item')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali ke Produk
        </IonButton>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/item')}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-light bg-white text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-headline-lg font-headline-lg text-slate-heading">Sunting Produk / Item</h2>
          <p className="text-body-md font-body-md text-slate-body">Ubah informasi stok, harga, dan rincian produk.</p>
        </div>
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
              <ImageUpload bucket="items" variant="product" value={imagePath} onChange={setImagePath} />
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

        <div className="flex items-center justify-between xl:col-span-8">
          <div className="flex gap-3">
            <IonButton type="submit" disabled={updateItem.isPending}>
              {updateItem.isPending && <IonSpinner name="crescent" slot="start" />}
              {t.common.save}
            </IonButton>
            <IonButton type="button" fill="outline" onClick={() => router.push('/item')}>
              {t.common.cancel}
            </IonButton>
          </div>
          <IonButton type="button" color="danger" fill="outline" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <IonSpinner name="crescent" slot="start" /> : <Trash2 className="h-4 w-4 mr-1" />}
            Hapus Item
          </IonButton>
        </div>
      </form>
    </>
  );
}
