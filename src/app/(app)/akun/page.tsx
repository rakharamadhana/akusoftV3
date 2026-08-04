'use client';

import { useState } from 'react';
import {
  IonCard,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonBadge,
  IonSpinner,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonListHeader,
} from '@ionic/react';
import { Wallet, Scale, PiggyBank, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { useTranslation } from '@/i18n/use-translation';
import { formatIDR } from '@/lib/format';
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
  type Account,
  type AccountCategory,
} from '@/lib/data/accounts';

export default function AccountsPage() {
  const t = useTranslation();
  const { data: accounts = [], isLoading } = useAccounts();
  const deleteAccount = useDeleteAccount();
  const [editing, setEditing] = useState<Account | null>(null);
  const [creating, setCreating] = useState(false);

  const sumBy = (cat: AccountCategory) =>
    accounts.filter((a) => a.category === cat).reduce((s, a) => s + Number(a.balance), 0);

  const catLabel: Record<string, string> = {
    asset: t.accounts.catAsset,
    liability: t.accounts.catLiability,
    equity: t.accounts.catEquity,
  };
  const catColor: Record<string, string> = { asset: 'primary', liability: 'danger', equity: 'success' };

  return (
    <>
      <section className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-headline-lg font-headline-lg text-slate-heading">{t.accounts.title}</h2>
          <p className="text-body-md font-body-md text-slate-body">{t.accounts.subtitle}</p>
        </div>
        <IonButton onClick={() => setCreating(true)}>
          <span slot="start" className="mr-1"><PlusCircle className="h-5 w-5" /></span>
          {t.accounts.addAccount}
        </IonButton>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon={<Wallet className="text-primary-container" />} iconBg="bg-pill-indigo-bg" label={t.accounts.totalAssets} value={formatIDR(sumBy('asset'))} />
        <StatCard icon={<Scale className="text-alert-coral" />} iconBg="bg-pill-rose-bg" label={t.accounts.totalLiabilities} value={formatIDR(sumBy('liability'))} />
        <StatCard icon={<PiggyBank className="text-secondary" />} iconBg="bg-pill-mint-bg" label={t.accounts.totalEquity} value={formatIDR(sumBy('equity'))} />
      </section>

      <IonCard className="m-0 overflow-hidden">
        <IonList>
          <IonListHeader>
            <IonLabel className="text-headline-sm font-headline-sm">{t.accounts.title}</IonLabel>
          </IonListHeader>
          {isLoading ? (
            <IonItem lines="none"><IonSpinner name="crescent" /> <IonLabel className="ml-2">{t.common.loading}</IonLabel></IonItem>
          ) : accounts.length === 0 ? (
            <IonItem lines="none"><IonLabel className="text-slate-body">{t.common.empty}</IonLabel></IonItem>
          ) : (
            accounts.map((a) => (
              <IonItem key={a.id}>
                <IonLabel>
                  <h3 className="font-semibold text-slate-heading">{a.name}</h3>
                  <p className="text-slate-body">
                    <span className="font-mono">{a.code ?? '—'}</span>
                    <IonBadge color={catColor[a.category]} className="ml-2 align-middle">{catLabel[a.category]}</IonBadge>
                  </p>
                </IonLabel>
                <div slot="end" className="flex items-center gap-2">
                  <span className="font-semibold text-slate-heading">{formatIDR(Number(a.balance))}</span>
                  <IonButton fill="clear" size="small" onClick={() => setEditing(a)} aria-label={t.common.edit}>
                    <Pencil className="h-4 w-4" />
                  </IonButton>
                  <IonButton
                    fill="clear"
                    size="small"
                    color="danger"
                    aria-label={t.common.delete}
                    onClick={() => {
                      if (confirm(`${t.common.delete} "${a.name}"?`)) deleteAccount.mutate(a.id);
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

      <AccountModal
        open={creating || !!editing}
        account={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      />
    </>
  );
}

function AccountModal({ open, account, onClose }: { open: boolean; account: Account | null; onClose: () => void }) {
  const t = useTranslation();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<AccountCategory>('asset');
  const [balance, setBalance] = useState(0);
  const pending = createAccount.isPending || updateAccount.isPending;

  const submit = async () => {
    if (account) {
      await updateAccount.mutateAsync({ id: account.id, name, code, category, balance });
    } else {
      await createAccount.mutateAsync({ name, code, category, balance });
    }
    onClose();
  };

  return (
    <IonModal
      isOpen={open}
      onWillPresent={() => {
        setName(account?.name ?? '');
        setCode(account?.code ?? '');
        setCategory((account?.category as AccountCategory) ?? 'asset');
        setBalance(Number(account?.balance ?? 0));
      }}
      onDidDismiss={onClose}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>{account ? t.common.edit : t.accounts.addAccount}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>{t.common.cancel}</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="space-y-4">
          <IonInput fill="outline" labelPlacement="stacked" label={t.accounts.name} value={name} onIonInput={(e) => setName(e.detail.value ?? '')} />
          <IonInput fill="outline" labelPlacement="stacked" label={t.accounts.code} value={code} onIonInput={(e) => setCode(e.detail.value ?? '')} placeholder="110" />
          <IonSelect fill="outline" labelPlacement="stacked" label={t.accounts.category} value={category} onIonChange={(e) => setCategory(e.detail.value)}>
            <IonSelectOption value="asset">{t.accounts.catAsset}</IonSelectOption>
            <IonSelectOption value="liability">{t.accounts.catLiability}</IonSelectOption>
            <IonSelectOption value="equity">{t.accounts.catEquity}</IonSelectOption>
          </IonSelect>
          <IonInput fill="outline" labelPlacement="stacked" label={`${t.accounts.balance} (Rp)`} type="number" value={balance} onIonInput={(e) => setBalance(Number(e.detail.value))} />
          <IonButton expand="block" onClick={submit} disabled={pending}>
            {pending && <IonSpinner name="crescent" slot="start" />}
            {t.common.save}
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}
