'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IonCard,
  IonCardContent,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  DollarSign,
  CreditCard,
  Tag,
  FileText,
} from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR } from '@/lib/format';
import { useAccounts } from '@/lib/data/accounts';
import { useCategories } from '@/lib/data/categories';
import { usePaymentMethods } from '@/lib/data/payment-methods';
import { useCreateExpense } from '@/lib/data/transactions';

const today = () => new Date().toISOString().slice(0, 10);

export default function NewExpensePage() {
  const t = useTranslation();
  const router = useRouter();
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const { data: methods = [] } = usePaymentMethods();
  const createExpense = useCreateExpense();

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const [paidAt, setPaidAt] = useState(today());
  const [amount, setAmount] = useState(0);
  const [accountId, setAccountId] = useState('');
  const [type, setType] = useState<'merchandise' | 'non_merchandise'>('merchandise');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Mobile step state (1..4)
  const [mobileStep, setMobileStep] = useState<number>(1);

  const submitForm = async () => {
    setError(null);
    try {
      await createExpense.mutateAsync({
        paid_at: new Date(paidAt).toISOString(),
        amount,
        account_id: accountId || null,
        expense_type: type,
        category: category || undefined,
        description: description || undefined,
        payment_method: paymentMethod || undefined,
      });
      router.push('/pengeluaran');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.saveFailed);
    }
  };

  const onSubmitDesktop = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  const selectedAccountName = useMemo(() => {
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return 'Belum dipilih';
    return acc.code ? `${acc.name} (${acc.code})` : acc.name;
  }, [accounts, accountId]);

  return (
    <>
      <div>
        <h2 className="text-headline-lg font-headline-lg text-slate-heading">{t.expenses.formTitle}</h2>
        <p className="text-body-md font-body-md text-slate-body">{t.expenses.subtitle}</p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP VERSION (screen >= md) - Retain existing layout       */}
      {/* ------------------------------------------------------------- */}
      <form onSubmit={onSubmitDesktop} className="hidden md:block mx-auto w-full max-w-3xl">
        <IonCard className="m-0">
          <IonCardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <IonInput
                fill="outline"
                labelPlacement="stacked"
                label={t.expenses.transactionDate}
                type="date"
                value={paidAt}
                onIonInput={(e) => setPaidAt(e.detail.value ?? today())}
              />
              <IonInput
                fill="outline"
                labelPlacement="stacked"
                label={`${t.expenses.amountLabel} (Rp)`}
                type="number"
                min={0}
                value={amount}
                onIonInput={(e) => setAmount(Number(e.detail.value))}
              />
              <IonSelect
                fill="outline"
                labelPlacement="stacked"
                label={t.expenses.sourceAccount}
                value={accountId}
                onIonChange={(e) => setAccountId(e.detail.value)}
                placeholder="—"
              >
                {accounts.map((a) => (
                  <IonSelectOption key={a.id} value={a.id}>
                    {a.code ? `${a.name} (${a.code})` : a.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
              <IonSelect
                fill="outline"
                labelPlacement="stacked"
                label={t.expenses.paymentMethod}
                value={paymentMethod}
                onIonChange={(e) => setPaymentMethod(e.detail.value)}
                placeholder="—"
              >
                {methods.map((m) => (
                  <IonSelectOption key={m.id} value={m.name}>
                    {m.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>

            <div>
              <p className="mb-1 text-label-md font-label-md text-slate-heading">{t.expenses.paymentType}</p>
              <IonSegment
                value={type}
                onIonChange={(e) => setType((e.detail.value as 'merchandise' | 'non_merchandise') ?? 'merchandise')}
              >
                <IonSegmentButton value="merchandise">
                  <IonLabel>{t.expenses.typeMerchandise}</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="non_merchandise">
                  <IonLabel>{t.expenses.typeNonMerchandise}</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>

            <IonSelect
              fill="outline"
              labelPlacement="stacked"
              label={t.expenses.category}
              value={category}
              onIonChange={(e) => setCategory(e.detail.value)}
              placeholder="—"
            >
              {expenseCategories.map((c) => (
                <IonSelectOption key={c.id} value={c.name}>
                  {c.code ? `${c.code} · ${c.name}` : c.name}
                </IonSelectOption>
              ))}
            </IonSelect>

            <IonTextarea
              fill="outline"
              labelPlacement="stacked"
              label={t.expenses.descriptionLabel}
              value={description}
              onIonInput={(e) => setDescription(e.detail.value ?? '')}
              autoGrow
              rows={3}
              placeholder="Keterangan pengeluaran..."
            />

            {error && <p className="text-body-sm font-semibold text-alert-coral">{error}</p>}

            <div className="flex gap-3 pt-2">
              <IonButton type="submit" disabled={createExpense.isPending}>
                {createExpense.isPending && <IonSpinner name="crescent" slot="start" />}
                {t.common.save}
              </IonButton>
              <IonButton type="button" fill="outline" onClick={() => router.push('/pengeluaran')}>
                {t.common.cancel}
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </form>

      {/* ------------------------------------------------------------- */}
      {/* MOBILE VERSION (screen < md) - Guided Step-by-Step Wizard      */}
      {/* ------------------------------------------------------------- */}
      <div className="block md:hidden space-y-4 pb-20">
        {/* Step Progress Bar */}
        <div className="bg-white rounded-xl p-4 border border-border-light shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="text-rose-600 uppercase tracking-wider">
              Langkah {mobileStep} dari 4
            </span>
            <span>{Math.round((mobileStep / 4) * 100)}% Selesai</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-rose-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${(mobileStep / 4) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-1 text-center pt-1 text-[11px] font-semibold text-slate-600">
            <span className={mobileStep === 1 ? 'text-rose-600 font-bold' : ''}>1. Nominal</span>
            <span className={mobileStep === 2 ? 'text-rose-600 font-bold' : ''}>2. Akun & Metode</span>
            <span className={mobileStep === 3 ? 'text-rose-600 font-bold' : ''}>3. Kategori</span>
            <span className={mobileStep === 4 ? 'text-rose-600 font-bold' : ''}>4. Ringkasan</span>
          </div>
        </div>

        {/* STEP 1: Nominal & Tanggal */}
        {mobileStep === 1 && (
          <IonCard className="m-0 border border-border-light shadow-sm">
            <IonCardContent className="space-y-4 p-4">
              <div className="flex items-center gap-2 border-b border-border-light pb-3">
                <DollarSign className="h-5 w-5 text-rose-500" />
                <h3 className="text-title-md font-bold text-slate-heading">Langkah 1: Tanggal & Nominal</h3>
              </div>

              <div className="space-y-4">
                <IonInput
                  fill="outline"
                  labelPlacement="stacked"
                  label={t.expenses.transactionDate}
                  type="date"
                  value={paidAt}
                  onIonInput={(e) => setPaidAt(e.detail.value ?? today())}
                />

                <IonInput
                  fill="outline"
                  labelPlacement="stacked"
                  label={`${t.expenses.amountLabel} (Rp)`}
                  type="number"
                  min={0}
                  value={amount}
                  onIonInput={(e) => setAmount(Number(e.detail.value))}
                />
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* STEP 2: Akun & Metode Pembayaran */}
        {mobileStep === 2 && (
          <IonCard className="m-0 border border-border-light shadow-sm">
            <IonCardContent className="space-y-4 p-4">
              <div className="flex items-center gap-2 border-b border-border-light pb-3">
                <CreditCard className="h-5 w-5 text-rose-500" />
                <h3 className="text-title-md font-bold text-slate-heading">Langkah 2: Sumber Akun & Metode</h3>
              </div>

              <div className="space-y-4">
                <IonSelect
                  fill="outline"
                  labelPlacement="stacked"
                  label={t.expenses.sourceAccount}
                  value={accountId}
                  onIonChange={(e) => setAccountId(e.detail.value)}
                  placeholder="— Pilih Akun Sumber Dana —"
                >
                  {accounts.map((a) => (
                    <IonSelectOption key={a.id} value={a.id}>
                      {a.code ? `${a.name} (${a.code})` : a.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>

                <IonSelect
                  fill="outline"
                  labelPlacement="stacked"
                  label={t.expenses.paymentMethod}
                  value={paymentMethod}
                  onIonChange={(e) => setPaymentMethod(e.detail.value)}
                  placeholder="— Pilih Metode Pembayaran —"
                >
                  {methods.map((m) => (
                    <IonSelectOption key={m.id} value={m.name}>
                      {m.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* STEP 3: Jenis & Kategori */}
        {mobileStep === 3 && (
          <IonCard className="m-0 border border-border-light shadow-sm">
            <IonCardContent className="space-y-4 p-4">
              <div className="flex items-center gap-2 border-b border-border-light pb-3">
                <Tag className="h-5 w-5 text-rose-500" />
                <h3 className="text-title-md font-bold text-slate-heading">Langkah 3: Jenis & Kategori</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-label-md font-label-md text-slate-heading">{t.expenses.paymentType}</p>
                  <IonSegment
                    value={type}
                    onIonChange={(e) => setType((e.detail.value as 'merchandise' | 'non_merchandise') ?? 'merchandise')}
                  >
                    <IonSegmentButton value="merchandise">
                      <IonLabel>{t.expenses.typeMerchandise}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="non_merchandise">
                      <IonLabel>{t.expenses.typeNonMerchandise}</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </div>

                <IonSelect
                  fill="outline"
                  labelPlacement="stacked"
                  label={t.expenses.category}
                  value={category}
                  onIonChange={(e) => setCategory(e.detail.value)}
                  placeholder="— Pilih Kategori Pengeluaran —"
                >
                  {expenseCategories.map((c) => (
                    <IonSelectOption key={c.id} value={c.name}>
                      {c.code ? `${c.code} · ${c.name}` : c.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* STEP 4: Catatan & Konfirmasi */}
        {mobileStep === 4 && (
          <div className="space-y-4">
            <IonCard className="m-0 border border-border-light shadow-sm">
              <IonCardContent className="space-y-4 p-4">
                <div className="flex items-center gap-2 border-b border-border-light pb-3">
                  <FileText className="h-5 w-5 text-rose-500" />
                  <h3 className="text-title-md font-bold text-slate-heading">Langkah 4: Catatan Pengeluaran</h3>
                </div>

                <IonTextarea
                  fill="outline"
                  labelPlacement="stacked"
                  label={t.expenses.descriptionLabel}
                  value={description}
                  onIonInput={(e) => setDescription(e.detail.value ?? '')}
                  autoGrow
                  rows={4}
                  placeholder="Keterangan pengeluaran..."
                />
              </IonCardContent>
            </IonCard>

            {/* Summary Review Card */}
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Ringkasan Pembayaran
              </h4>
              <div className="text-xs space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Tanggal:</span>
                  <span className="font-semibold">{paidAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sumber Akun:</span>
                  <span className="font-semibold">{selectedAccountName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Metode Pembayaran:</span>
                  <span className="font-semibold">{paymentMethod || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jenis Pembayaran:</span>
                  <span className="font-semibold">
                    {type === 'merchandise' ? t.expenses.typeMerchandise : t.expenses.typeNonMerchandise}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Kategori:</span>
                  <span className="font-semibold">{category || '—'}</span>
                </div>
                <div className="flex justify-between border-t border-rose-200 pt-2 text-sm">
                  <span className="font-bold text-slate-800">Total Pengeluaran:</span>
                  <span className="font-bold text-rose-700">{formatIDR(amount)}</span>
                </div>
              </div>
            </div>

            {error && <p className="text-body-sm font-semibold text-alert-coral">{error}</p>}
          </div>
        )}

        {/* Mobile Navigation Buttons */}
        <div className="flex items-center gap-3 pt-2">
          {mobileStep > 1 ? (
            <IonButton fill="outline" className="flex-1" onClick={() => setMobileStep((s) => s - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t.common.back}
            </IonButton>
          ) : (
            <IonButton fill="outline" className="flex-1" onClick={() => router.push('/pengeluaran')}>
              {t.common.cancel}
            </IonButton>
          )}

          {mobileStep < 4 ? (
            <IonButton className="flex-1" onClick={() => setMobileStep((s) => s + 1)}>
              Lanjut
              <ChevronRight className="h-4 w-4 ml-1" />
            </IonButton>
          ) : (
            <IonButton
              className="flex-1"
              color="danger"
              onClick={submitForm}
              disabled={createExpense.isPending}
            >
              {createExpense.isPending ? (
                <IonSpinner name="crescent" slot="start" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-1" />
              )}
              {t.common.save}
            </IonButton>
          )}
        </div>
      </div>
    </>
  );
}
