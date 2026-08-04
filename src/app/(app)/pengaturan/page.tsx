'use client';

import { useEffect, useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { PlusCircle, X, Trash2 } from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';
import { useActiveCompany } from '@/store/auth';
import { useUpdateCompany, useDeleteCompany } from '@/lib/data/company';
import { ImageUpload } from '@/components/forms/image-upload';
import { useCategories, useCreateCategory, useDeleteCategory, type CategoryType } from '@/lib/data/categories';
import { usePaymentMethods, useCreatePaymentMethod, useDeletePaymentMethod } from '@/lib/data/payment-methods';
import { IonAlert } from '@ionic/react';

type TabKey = 'general' | 'categories' | 'currency' | 'offline';

export default function SettingsPage() {
  const t = useTranslation();
  const [tab, setTab] = useState<TabKey>('general');

  return (
    <>
      <div>
        <h2 className="text-headline-lg font-headline-lg text-slate-heading">{t.settings.title}</h2>
        <p className="text-body-md font-body-md text-slate-body">{t.settings.subtitle}</p>
      </div>

      <IonSegment scrollable value={tab} onIonChange={(e) => setTab((e.detail.value as TabKey) ?? 'general')}>
        <IonSegmentButton value="general"><IonLabel>{t.settings.tabGeneral}</IonLabel></IonSegmentButton>
        <IonSegmentButton value="categories"><IonLabel>{t.settings.tabCategories}</IonLabel></IonSegmentButton>
        <IonSegmentButton value="currency"><IonLabel>{t.settings.tabCurrency}</IonLabel></IonSegmentButton>
        <IonSegmentButton value="offline"><IonLabel>{t.settings.tabOfflinePayment}</IonLabel></IonSegmentButton>
      </IonSegment>

      {tab === 'general' && <GeneralPanel />}
      {tab === 'categories' && <CategoriesPanel />}
      {tab === 'currency' && <CurrencyPanel />}
      {tab === 'offline' && <OfflinePanel />}
    </>
  );
}

function GeneralPanel() {
  const t = useTranslation();
  const company = useActiveCompany();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saved, setSaved] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    if (company) {
      setName(company.name ?? '');
      setEmail(company.email ?? '');
      setTaxNumber(company.tax_number ?? '');
      setPhone(company.phone ?? '');
      setAddress(company.address ?? '');
    }
  }, [company]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    await updateCompany.mutateAsync({ name, email, tax_number: taxNumber, phone, address });
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <IonCard className="m-0">
        <IonCardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="flex items-center gap-4">
              <ImageUpload
                bucket="logos"
                variant="logo"
                value={company?.logo_path ?? null}
                onChange={(path) => updateCompany.mutate({ logo_path: path })}
              />
              <div>
                <p className="text-label-md font-label-md text-slate-heading">{t.settings.logo}</p>
                <p className="text-body-sm text-slate-body opacity-70">{t.settings.uploadLogo}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <IonInput fill="outline" labelPlacement="stacked" label={t.settings.businessName} value={name} onIonInput={(e) => setName(e.detail.value ?? '')} />
              <IonInput fill="outline" labelPlacement="stacked" label={t.settings.email} type="email" value={email} onIonInput={(e) => setEmail(e.detail.value ?? '')} />
              <IonInput fill="outline" labelPlacement="stacked" label={t.settings.npwp} value={taxNumber} onIonInput={(e) => setTaxNumber(e.detail.value ?? '')} placeholder="00.000.000.0-000.000" />
              <IonInput fill="outline" labelPlacement="stacked" label={t.settings.phone} value={phone} onIonInput={(e) => setPhone(e.detail.value ?? '')} placeholder="+62 812 3456 7890" />
              <div className="md:col-span-2">
                <IonTextarea fill="outline" labelPlacement="stacked" label={t.settings.address} value={address} onIonInput={(e) => setAddress(e.detail.value ?? '')} autoGrow rows={2} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IonButton type="submit" disabled={updateCompany.isPending}>
                {updateCompany.isPending && <IonSpinner name="crescent" slot="start" />}
                {t.common.save}
              </IonButton>
              {saved && <span className="text-label-md font-label-md text-secondary">✓</span>}
            </div>
          </form>
        </IonCardContent>
      </IonCard>

      {/* Danger Zone */}
      {company && (
        <IonCard className="m-0 border border-rose-200 bg-rose-50/30">
          <IonCardContent className="space-y-3">
            <div>
              <h4 className="text-headline-sm font-bold text-rose-700">Zona Bahaya: Hapus Perusahaan Ini</h4>
              <p className="text-body-sm text-slate-body opacity-80 mt-1">
                Menghapus <span className="font-bold text-slate-heading">{company.name}</span> akan memusnahkan seluruh transaksi, item, akun, dan laporan keuangan terkait secara permanen dari sistem.
              </p>
            </div>
            <IonButton color="danger" onClick={() => setShowDeleteAlert(true)}>
              <Trash2 className="mr-1.5 h-4 w-4" />
              Hapus Perusahaan Ini
            </IonButton>

            <IonAlert
              isOpen={showDeleteAlert}
              header={`Hapus "${company.name}"?`}
              subHeader="PERINGATAN BAHAYA"
              message={`Tindakan ini TIDAK DAPAT DIBATALKAN. Seluruh data transaksi, pelanggan, item, akun, dan laporan keuangan yang terhubung dengan perusahaan "${company.name}" akan dihapus secara permanen.`}
              buttons={[
                {
                  text: 'Batal',
                  role: 'cancel',
                  handler: () => setShowDeleteAlert(false),
                },
                {
                  text: 'Hapus Permanen',
                  role: 'destructive',
                  cssClass: 'alert-button-danger',
                  handler: async () => {
                    try {
                      await deleteCompany.mutateAsync(company.id);
                    } catch (err) {
                      console.error('Delete company error:', err);
                      alert(err instanceof Error ? err.message : 'Gagal menghapus perusahaan');
                    }
                    setShowDeleteAlert(false);
                  },
                },
              ]}
              onDidDismiss={() => setShowDeleteAlert(false)}
            />
          </IonCardContent>
        </IonCard>
      )}
    </div>
  );
}

function CategoriesPanel() {
  const t = useTranslation();
  const { data: categories = [] } = useCategories();
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <CategoryCard title={t.settings.incomeCategories} type="income" items={categories.filter((c) => c.type === 'income')} />
      <CategoryCard title={t.settings.expenseCategories} type="expense" items={categories.filter((c) => c.type === 'expense')} />
    </div>
  );
}

function CategoryCard({ title, type, items }: { title: string; type: CategoryType; items: { id: string; name: string; code: string | null }[] }) {
  const t = useTranslation();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const [name, setName] = useState('');

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createCategory.mutateAsync({ type, name: name.trim() });
    setName('');
  };

  return (
    <IonCard className="m-0">
      <IonCardContent>
        <h4 className="mb-2 text-headline-sm font-headline-sm text-slate-heading">{title}</h4>
        <IonList>
          {items.map((c) => (
            <IonItem key={c.id}>
              <IonLabel>
                {c.code && <span className="mr-2 font-mono text-slate-body">{c.code}</span>}
                {c.name}
              </IonLabel>
              <IonButton slot="end" fill="clear" size="small" color="danger" onClick={() => deleteCategory.mutate(c.id)}>
                <X className="h-4 w-4" />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
        <form onSubmit={add} className="mt-3 flex gap-2">
          <IonInput fill="outline" value={name} onIonInput={(e) => setName(e.detail.value ?? '')} placeholder={t.settings.addCategory} />
          <IonButton type="submit" fill="outline" disabled={createCategory.isPending}><PlusCircle className="h-4 w-4" /></IonButton>
        </form>
      </IonCardContent>
    </IonCard>
  );
}

function CurrencyPanel() {
  const t = useTranslation();
  const company = useActiveCompany();
  const updateCompany = useUpdateCompany();
  const [currency, setCurrency] = useState('IDR');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (company?.currency) setCurrency(company.currency);
  }, [company]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    await updateCompany.mutateAsync({ currency });
    setSaved(true);
  };

  return (
    <IonCard className="m-0">
      <IonCardContent>
        <form onSubmit={save} className="space-y-4">
          <IonSelect fill="outline" labelPlacement="stacked" label={t.settings.currencyLabel} value={currency} onIonChange={(e) => setCurrency(e.detail.value)}>
            <IonSelectOption value="IDR">IDR — Rupiah (Rp)</IonSelectOption>
            <IonSelectOption value="USD">USD — US Dollar ($)</IonSelectOption>
            <IonSelectOption value="SGD">SGD — Singapore Dollar (S$)</IonSelectOption>
          </IonSelect>
          <p className="text-body-sm text-slate-body opacity-70">{t.settings.currencyHint}</p>
          <div className="flex items-center gap-3">
            <IonButton type="submit" disabled={updateCompany.isPending}>
              {updateCompany.isPending && <IonSpinner name="crescent" slot="start" />}
              {t.common.save}
            </IonButton>
            {saved && <span className="text-label-md font-label-md text-secondary">✓</span>}
          </div>
        </form>
      </IonCardContent>
    </IonCard>
  );
}

function OfflinePanel() {
  const t = useTranslation();
  const { data: methods = [] } = usePaymentMethods();
  const createMethod = useCreatePaymentMethod();
  const deleteMethod = useDeletePaymentMethod();
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createMethod.mutateAsync({ name: name.trim(), details: details.trim() || undefined });
    setName('');
    setDetails('');
  };

  return (
    <IonCard className="m-0">
      <IonCardContent>
        <p className="mb-3 text-body-sm text-slate-body opacity-70">{t.settings.offlinePaymentHint}</p>
        <IonList>
          {methods.map((m) => (
            <IonItem key={m.id}>
              <IonLabel>
                <h3 className="font-semibold text-slate-heading">{m.name}</h3>
                <p className="text-slate-body">{m.details ?? '—'}</p>
              </IonLabel>
              <IonButton slot="end" fill="clear" size="small" color="danger" onClick={() => deleteMethod.mutate(m.id)}>
                <X className="h-4 w-4" />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
        <form onSubmit={add} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <IonInput fill="outline" value={name} onIonInput={(e) => setName(e.detail.value ?? '')} placeholder={t.settings.method} />
          <IonInput fill="outline" value={details} onIonInput={(e) => setDetails(e.detail.value ?? '')} placeholder={t.settings.details} />
          <IonButton type="submit" fill="outline" disabled={createMethod.isPending}>
            <PlusCircle className="mr-1 h-4 w-4" />{t.settings.addMethod}
          </IonButton>
        </form>
      </IonCardContent>
    </IonCard>
  );
}
