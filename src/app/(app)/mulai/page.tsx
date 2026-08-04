'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  IonCard,
  IonCardContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonSpinner,
} from '@ionic/react';
import { PiggyBank } from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';
import { useActiveCompany } from '@/store/auth';
import { useAccounts, useUpdateAccount } from '@/lib/data/accounts';
import { useUpdateCompany } from '@/lib/data/company';

export default function ModalAwalSetupPage() {
  const t = useTranslation();
  const router = useRouter();
  const company = useActiveCompany();
  const { data: accounts = [] } = useAccounts();
  const updateAccount = useUpdateAccount();
  const updateCompany = useUpdateCompany();

  const [currency, setCurrency] = useState(company?.currency ?? 'IDR');
  const [amount, setAmount] = useState(0);

  const busy = updateAccount.isPending || updateCompany.isPending;
  const modalAwal = accounts.find((a) => a.code === '310') ?? accounts.find((a) => a.category === 'equity');

  const finish = async (withAmount: boolean) => {
    if (withAmount && modalAwal) {
      await updateAccount.mutateAsync({ id: modalAwal.id, balance: amount });
    }
    await updateCompany.mutateAsync({ currency, setup_completed: true });
    router.replace('/');
  };

  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-2xl items-center">
      <IonCard className="m-0 w-full">
        <IonCardContent>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pill-mint-bg">
            <PiggyBank className="h-7 w-7 text-secondary" />
          </div>
          <h2 className="text-headline-lg font-headline-lg text-slate-heading">{t.modalAwal.title}</h2>
          <p className="mb-1 text-body-md text-slate-body">{t.modalAwal.subtitle}</p>
          {company && <p className="mb-6 text-label-md font-label-md text-primary-container">{company.name}</p>}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              finish(true);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <IonSelect fill="outline" labelPlacement="stacked" label={`${t.modalAwal.currency} *`} value={currency} onIonChange={(e) => setCurrency(e.detail.value)}>
                <IonSelectOption value="IDR">Indonesian Rupiah</IonSelectOption>
                <IonSelectOption value="USD">US Dollar</IonSelectOption>
                <IonSelectOption value="SGD">Singapore Dollar</IonSelectOption>
              </IonSelect>
              <IonInput fill="outline" labelPlacement="stacked" label={`${t.modalAwal.label} (Rp) *`} type="number" min={0} value={amount} onIonInput={(e) => setAmount(Number(e.detail.value))} />
            </div>
            <p className="text-body-sm text-slate-body opacity-70">{t.modalAwal.hint}</p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <IonButton type="submit" disabled={busy}>
                {busy && <IonSpinner name="crescent" slot="start" />}
                {t.modalAwal.continue}
              </IonButton>
              <IonButton type="button" fill="clear" disabled={busy} onClick={() => finish(false)}>
                {t.modalAwal.skip}
              </IonButton>
            </div>
          </form>
        </IonCardContent>
      </IonCard>
    </div>
  );
}
