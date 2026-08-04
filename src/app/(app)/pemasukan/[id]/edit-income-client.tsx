'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  DollarSign,
  User,
  Tag,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR, formatNumberID } from '@/lib/format';
import { useAccounts } from '@/lib/data/accounts';
import { useItems } from '@/lib/data/items';
import { useCategories } from '@/lib/data/categories';
import {
  useTransaction,
  useUpdateIncome,
  useDeleteTransaction,
  type IncomeLine,
} from '@/lib/data/transactions';

interface LineRow extends IncomeLine {
  key: number;
}

const today = () => new Date().toISOString().slice(0, 10);

export default function EditIncomeClient() {
  const t = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: tx, isLoading: isTxLoading, error: txError } = useTransaction(id);
  const { data: accounts = [] } = useAccounts();
  const { data: items = [] } = useItems();
  const { data: categories = [] } = useCategories();
  const updateIncome = useUpdateIncome();
  const deleteTransaction = useDeleteTransaction();

  const incomeCategories = categories.filter((c) => c.type === 'income');

  const [paidAt, setPaidAt] = useState(today());
  const [accountId, setAccountId] = useState('');
  const [customer, setCustomer] = useState('');
  const [incomeType, setIncomeType] = useState('Penjualan Barang');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [basis, setBasis] = useState<'cash' | 'credit'>('cash');
  const [lines, setLines] = useState<LineRow[]>([{ key: 1, name: '', quantity: 1, price: 0 }]);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mobile wizard step state (1..4)
  const [mobileStep, setMobileStep] = useState<number>(1);

  // Populate data when loaded
  useEffect(() => {
    if (tx) {
      if (tx.paid_at) setPaidAt(new Date(tx.paid_at).toISOString().slice(0, 10));
      if (tx.account_id) setAccountId(tx.account_id);
      if (tx.customer) setCustomer(tx.customer);
      if (tx.income_type) setIncomeType(tx.income_type);
      if (tx.category) setCategory(tx.category);
      if (tx.description) setDescription(tx.description);
      if (tx.basis) setBasis(tx.basis as 'cash' | 'credit');
      if (tx.amount) setAmount(Number(tx.amount));

      if (tx.transaction_items && tx.transaction_items.length > 0) {
        setLines(
          tx.transaction_items.map((ti, idx) => ({
            key: idx + 1,
            item_id: ti.item_id,
            name: ti.name,
            quantity: Number(ti.quantity),
            price: Number(ti.price),
          }))
        );
      }
    }
  }, [tx]);

  const linesTotal = useMemo(() => lines.reduce((s, l) => s + l.quantity * l.price, 0), [lines]);
  const effectiveAmount = amount > 0 ? amount : linesTotal;

  const addLine = () => setLines((p) => [...p, { key: Date.now(), name: '', quantity: 1, price: 0 }]);
  const removeLine = (key: number) => setLines((p) => p.filter((l) => l.key !== key));
  const updateLine = (key: number, patch: Partial<LineRow>) =>
    setLines((p) => p.map((l) => (l.key === key ? { ...l, ...patch } : l)));

  const onPickItem = (key: number, itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (item) updateLine(key, { item_id: item.id, name: item.name, price: Number(item.sale_price) });
    else updateLine(key, { item_id: null });
  };

  const submitForm = async () => {
    setError(null);
    try {
      await updateIncome.mutateAsync({
        id,
        paid_at: new Date(paidAt).toISOString(),
        amount: effectiveAmount,
        account_id: accountId || null,
        customer: customer || undefined,
        income_type: incomeType || undefined,
        category: category || undefined,
        description: description || undefined,
        basis,
        lines: lines.map(({ item_id, name, quantity, price }) => ({ item_id, name, quantity, price })),
      });
      router.push('/pemasukan');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.saveFailed);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus pendapatan ini?')) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteTransaction.mutateAsync(id);
      router.push('/pemasukan');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus transaksi.');
      setIsDeleting(false);
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

  if (isTxLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <IonSpinner name="crescent" />
        <span className="ml-3 text-slate-body">{t.common.loading}</span>
      </div>
    );
  }

  if (txError || !tx) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-alert-coral font-semibold">Transaksi tidak ditemukan.</p>
        <IonButton fill="outline" onClick={() => router.push('/pemasukan')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali ke Pemasukan
        </IonButton>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/pemasukan')}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-light bg-white text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-headline-lg font-headline-lg text-slate-heading">Sunting Pendapatan</h2>
          <p className="text-body-md font-body-md text-slate-body">Ubah detail transaksi pendapatan ini.</p>
        </div>
      </div>

      {/* DESKTOP VERSION */}
      <form onSubmit={onSubmitDesktop} className="hidden md:grid md:grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <IonInput
              fill="outline"
              labelPlacement="stacked"
              label={t.income.transactionDate}
              type="date"
              value={paidAt}
              onIonInput={(e) => setPaidAt(e.detail.value ?? today())}
            />
            <IonInput
              fill="outline"
              labelPlacement="stacked"
              label={`${t.income.amountReceived} (Rp)`}
              type="number"
              min={0}
              value={amount || undefined}
              placeholder={formatNumberID(linesTotal)}
              onIonInput={(e) => setAmount(Number(e.detail.value))}
            />
            <IonSelect
              fill="outline"
              labelPlacement="stacked"
              label={t.income.relatedAccount}
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
            <IonInput
              fill="outline"
              labelPlacement="stacked"
              label={t.income.customer}
              value={customer}
              onIonInput={(e) => setCustomer(e.detail.value ?? '')}
              placeholder="mis. Toko Sejahtera"
            />
            <IonSelect
              fill="outline"
              labelPlacement="stacked"
              label={t.income.incomeType}
              value={incomeType}
              onIonChange={(e) => setIncomeType(e.detail.value)}
            >
              <IonSelectOption value="Penjualan Barang">Penjualan Barang</IonSelectOption>
              <IonSelectOption value="Jasa">Jasa</IonSelectOption>
              <IonSelectOption value="Lain-lain">Lain-lain</IonSelectOption>
            </IonSelect>
            <IonSelect
              fill="outline"
              labelPlacement="stacked"
              label={t.income.incomeCategory}
              value={category}
              onIonChange={(e) => setCategory(e.detail.value)}
              placeholder="—"
            >
              {incomeCategories.map((c) => (
                <IonSelectOption key={c.id} value={c.name}>
                  {c.code ? `${c.code} · ${c.name}` : c.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>

          <IonTextarea
            fill="outline"
            labelPlacement="stacked"
            label={t.income.description}
            value={description}
            onIonInput={(e) => setDescription(e.detail.value ?? '')}
            autoGrow
            rows={3}
            placeholder="Keterangan transaksi..."
          />

          <div>
            <p className="mb-1 text-label-md font-label-md text-slate-heading">{t.income.paymentBasis}</p>
            <IonSegment value={basis} onIonChange={(e) => setBasis((e.detail.value as 'cash' | 'credit') ?? 'cash')}>
              <IonSegmentButton value="cash">
                <IonLabel>{t.income.cash}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="credit">
                <IonLabel>{t.income.credit}</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>

          {error && <p className="text-body-sm font-semibold text-alert-coral">{error}</p>}
        </div>

        <IonCard className="m-0 flex flex-col xl:col-span-5">
          <div className="flex items-center justify-between border-b border-border-light p-4">
            <h3 className="text-body-lg font-bold text-slate-heading">{t.income.itemsSold}</h3>
            <IonButton size="small" fill="clear" onClick={addLine}>
              <span slot="start" className="mr-1">
                <PlusCircle className="h-4 w-4" />
              </span>
              {t.income.addLineItem}
            </IonButton>
          </div>
          <IonCardContent className="space-y-4">
            {lines.map((l) => (
              <div key={l.key} className="space-y-2 border-b border-border-light pb-3 last:border-0">
                <IonSelect
                  fill="outline"
                  labelPlacement="stacked"
                  label="Item"
                  value={l.item_id ?? ''}
                  onIonChange={(e) => onPickItem(l.key, e.detail.value)}
                  placeholder="— pilih item —"
                >
                  <IonSelectOption value="">— pilih item —</IonSelectOption>
                  {items.map((it) => (
                    <IonSelectOption key={it.id} value={it.id}>
                      {it.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
                <IonInput
                  fill="outline"
                  value={l.name}
                  onIonInput={(e) => updateLine(l.key, { name: e.detail.value ?? '' })}
                  placeholder="Nama item"
                />
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-4">
                    <IonInput
                      fill="outline"
                      type="number"
                      min={0}
                      value={l.quantity}
                      onIonInput={(e) => updateLine(l.key, { quantity: Number(e.detail.value) })}
                      aria-label={t.income.qty}
                    />
                  </div>
                  <div className="col-span-6">
                    <IonInput
                      fill="outline"
                      type="number"
                      min={0}
                      value={l.price}
                      onIonInput={(e) => updateLine(l.key, { price: Number(e.detail.value) })}
                      aria-label="Harga"
                    />
                  </div>
                  <button type="button" onClick={() => removeLine(l.key)} className="col-span-2 flex justify-center text-slate-body">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-right text-body-sm font-semibold text-slate-heading">
                  {formatNumberID(l.quantity * l.price)}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border-light pt-3">
              <span className="text-label-md font-bold uppercase tracking-wider text-slate-body">{t.income.amount}</span>
              <span className="text-headline-md font-headline-md text-secondary">{formatIDR(effectiveAmount)}</span>
            </div>
          </IonCardContent>
        </IonCard>

        <div className="flex items-center justify-between xl:col-span-12 pt-2">
          <div className="flex gap-3">
            <IonButton type="submit" disabled={updateIncome.isPending}>
              {updateIncome.isPending && <IonSpinner name="crescent" slot="start" />}
              {t.common.save}
            </IonButton>
            <IonButton type="button" fill="outline" onClick={() => router.push('/pemasukan')}>
              {t.common.cancel}
            </IonButton>
          </div>
          <IonButton type="button" color="danger" fill="outline" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <IonSpinner name="crescent" slot="start" /> : <Trash2 className="h-4 w-4 mr-1" />}
            Hapus Pendapatan
          </IonButton>
        </div>
      </form>

      {/* MOBILE VERSION */}
      <div className="block md:hidden space-y-4 pb-20">
        <div className="bg-white rounded-xl p-4 border border-border-light shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="text-primary-container uppercase tracking-wider">
              Langkah {mobileStep} dari 4
            </span>
            <span>{Math.round((mobileStep / 4) * 100)}% Selesai</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${(mobileStep / 4) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-1 text-center pt-1 text-[11px] font-semibold text-slate-600">
            <span className={mobileStep === 1 ? 'text-emerald-600 font-bold' : ''}>1. Nominal</span>
            <span className={mobileStep === 2 ? 'text-emerald-600 font-bold' : ''}>2. Klasifikasi</span>
            <span className={mobileStep === 3 ? 'text-emerald-600 font-bold' : ''}>3. Pelanggan</span>
            <span className={mobileStep === 4 ? 'text-emerald-600 font-bold' : ''}>4. Item & Total</span>
          </div>
        </div>

        {mobileStep === 1 && (
          <IonCard className="m-0 border border-border-light shadow-sm">
            <IonCardContent className="space-y-4 p-4">
              <div className="flex items-center gap-2 border-b border-border-light pb-3">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                <h3 className="text-title-md font-bold text-slate-heading">Langkah 1: Tanggal & Nominal</h3>
              </div>

              <div className="space-y-4">
                <IonInput
                  fill="outline"
                  labelPlacement="stacked"
                  label={t.income.transactionDate}
                  type="date"
                  value={paidAt}
                  onIonInput={(e) => setPaidAt(e.detail.value ?? today())}
                />

                <div>
                  <IonInput
                    fill="outline"
                    labelPlacement="stacked"
                    label={`${t.income.amountReceived} (Rp)`}
                    type="number"
                    min={0}
                    value={amount || undefined}
                    placeholder={formatNumberID(linesTotal)}
                    onIonInput={(e) => setAmount(Number(e.detail.value))}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    *Kosongkan jika ingin dihitung otomatis dari total item di langkah 4.
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-label-md font-label-md text-slate-heading">{t.income.paymentBasis}</p>
                  <IonSegment
                    value={basis}
                    onIonChange={(e) => setBasis((e.detail.value as 'cash' | 'credit') ?? 'cash')}
                  >
                    <IonSegmentButton value="cash">
                      <IonLabel>{t.income.cash}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="credit">
                      <IonLabel>{t.income.credit}</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {mobileStep === 2 && (
          <IonCard className="m-0 border border-border-light shadow-sm">
            <IonCardContent className="space-y-4 p-4">
              <div className="flex items-center gap-2 border-b border-border-light pb-3">
                <Tag className="h-5 w-5 text-emerald-600" />
                <h3 className="text-title-md font-bold text-slate-heading">Langkah 2: Akun & Kategori</h3>
              </div>

              <div className="space-y-4">
                <IonSelect
                  fill="outline"
                  labelPlacement="stacked"
                  label={t.income.relatedAccount}
                  value={accountId}
                  onIonChange={(e) => setAccountId(e.detail.value)}
                  placeholder="— Pilih Akun Terkait —"
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
                  label={t.income.incomeType}
                  value={incomeType}
                  onIonChange={(e) => setIncomeType(e.detail.value)}
                >
                  <IonSelectOption value="Penjualan Barang">Penjualan Barang</IonSelectOption>
                  <IonSelectOption value="Jasa">Jasa</IonSelectOption>
                  <IonSelectOption value="Lain-lain">Lain-lain</IonSelectOption>
                </IonSelect>

                <IonSelect
                  fill="outline"
                  labelPlacement="stacked"
                  label={t.income.incomeCategory}
                  value={category}
                  onIonChange={(e) => setCategory(e.detail.value)}
                  placeholder="— Pilih Kategori Pendapatan —"
                >
                  {incomeCategories.map((c) => (
                    <IonSelectOption key={c.id} value={c.name}>
                      {c.code ? `${c.code} · ${c.name}` : c.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {mobileStep === 3 && (
          <IonCard className="m-0 border border-border-light shadow-sm">
            <IonCardContent className="space-y-4 p-4">
              <div className="flex items-center gap-2 border-b border-border-light pb-3">
                <User className="h-5 w-5 text-emerald-600" />
                <h3 className="text-title-md font-bold text-slate-heading">Langkah 3: Pelanggan & Catatan</h3>
              </div>

              <div className="space-y-4">
                <IonInput
                  fill="outline"
                  labelPlacement="stacked"
                  label={t.income.customer}
                  value={customer}
                  onIonInput={(e) => setCustomer(e.detail.value ?? '')}
                  placeholder="mis. Toko Sejahtera"
                />

                <IonTextarea
                  fill="outline"
                  labelPlacement="stacked"
                  label={t.income.description}
                  value={description}
                  onIonInput={(e) => setDescription(e.detail.value ?? '')}
                  autoGrow
                  rows={4}
                  placeholder="Keterangan transaksi..."
                />
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {mobileStep === 4 && (
          <div className="space-y-4">
            <IonCard className="m-0 border border-border-light shadow-sm">
              <IonCardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between border-b border-border-light pb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-emerald-600" />
                    <h3 className="text-title-md font-bold text-slate-heading">{t.income.itemsSold}</h3>
                  </div>
                  <IonButton size="small" fill="clear" onClick={addLine}>
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Tambah
                  </IonButton>
                </div>

                <div className="space-y-4">
                  {lines.map((l) => (
                    <div key={l.key} className="p-3 rounded-lg border border-border-light bg-slate-50 space-y-2">
                      <IonSelect
                        fill="outline"
                        labelPlacement="stacked"
                        label="Item"
                        value={l.item_id ?? ''}
                        onIonChange={(e) => onPickItem(l.key, e.detail.value)}
                        placeholder="— pilih item —"
                      >
                        <IonSelectOption value="">— pilih item —</IonSelectOption>
                        {items.map((it) => (
                          <IonSelectOption key={it.id} value={it.id}>
                            {it.name}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                      <IonInput
                        fill="outline"
                        value={l.name}
                        onIonInput={(e) => updateLine(l.key, { name: e.detail.value ?? '' })}
                        placeholder="Nama item"
                      />
                      <div className="grid grid-cols-12 items-center gap-2">
                        <div className="col-span-4">
                          <IonInput
                            fill="outline"
                            type="number"
                            min={0}
                            value={l.quantity}
                            onIonInput={(e) => updateLine(l.key, { quantity: Number(e.detail.value) })}
                            aria-label={t.income.qty}
                          />
                        </div>
                        <div className="col-span-6">
                          <IonInput
                            fill="outline"
                            type="number"
                            min={0}
                            value={l.price}
                            onIonInput={(e) => updateLine(l.key, { price: Number(e.detail.value) })}
                            aria-label="Harga"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeLine(l.key)}
                          className="col-span-2 flex justify-center text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-right text-body-sm font-semibold text-slate-heading">
                        Subtotal: {formatNumberID(l.quantity * l.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Ringkasan Pendapatan
              </h4>
              <div className="text-xs space-y-1 text-slate-700">
                <div className="flex justify-between">
                  <span>Tanggal:</span>
                  <span className="font-semibold">{paidAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Akun Terkait:</span>
                  <span className="font-semibold">{selectedAccountName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-semibold">{customer || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tipe / Kategori:</span>
                  <span className="font-semibold">{incomeType} / {category || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dasar:</span>
                  <span className="font-semibold uppercase">{basis}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200 pt-2 text-sm">
                  <span className="font-bold text-slate-800">Total Diterima:</span>
                  <span className="font-bold text-emerald-700">{formatIDR(effectiveAmount)}</span>
                </div>
              </div>
            </div>

            {error && <p className="text-body-sm font-semibold text-alert-coral">{error}</p>}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          {mobileStep > 1 ? (
            <IonButton fill="outline" className="flex-1" onClick={() => setMobileStep((s) => s - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t.common.back}
            </IonButton>
          ) : (
            <IonButton fill="outline" className="flex-1" onClick={() => router.push('/pemasukan')}>
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
              color="success"
              onClick={submitForm}
              disabled={updateIncome.isPending}
            >
              {updateIncome.isPending ? (
                <IonSpinner name="crescent" slot="start" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-1" />
              )}
              {t.common.save}
            </IonButton>
          )}
        </div>

        <div className="pt-3">
          <IonButton fill="clear" color="danger" className="w-full" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <IonSpinner name="crescent" slot="start" /> : <Trash2 className="h-4 w-4 mr-1" />}
            Hapus Transaksi Pendapatan Ini
          </IonButton>
        </div>
      </div>
    </>
  );
}
