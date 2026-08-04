'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IonCard, IonCardContent, IonInput, IonButton, IonSpinner } from '@ionic/react';
import { useAuthStore } from '@/store/auth';
import { AlertCircle, Building2 } from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';
import { useCreateCompany } from '@/lib/data/company';

export default function NewCompanyPage() {
  const t = useTranslation();
  const router = useRouter();
  const createCompany = useCreateCompany();
  const companies = useAuthStore((s) => s.companies);
  const isMaxReached = companies.length >= 3;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [npwp, setNpwp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMaxReached) return;
    setError(null);
    try {
      await createCompany.mutateAsync({ name, email, tax_number: npwp });
      router.replace('/mulai');
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.saveFailed);
    }
  };

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-lg items-center">
      <IonCard className="m-0 w-full">
        <IonCardContent>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pill-indigo-bg">
            <Building2 className="h-7 w-7 text-primary-container" />
          </div>
          <h2 className="text-headline-lg font-headline-lg text-slate-heading">{t.company.newTitle}</h2>
          <p className="mb-6 text-body-md text-slate-body">{t.company.newSubtitle}</p>

          {isMaxReached && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
              <div className="space-y-1 text-xs">
                <p className="font-bold">Batas Maksimal Perusahaan Tercapai (3/3)</p>
                <p className="text-amber-800">
                  Anda telah memiliki 3 perusahaan. Akun Anda dibatasi maksimal 3 perusahaan. Silakan gunakan atau kelola perusahaan yang ada.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <IonInput fill="outline" labelPlacement="stacked" label={`${t.company.name} *`} value={name} onIonInput={(e) => setName(e.detail.value ?? '')} placeholder={t.company.namePlaceholder} disabled={isMaxReached} required />
            <IonInput fill="outline" labelPlacement="stacked" label={t.company.email} type="email" value={email} onIonInput={(e) => setEmail(e.detail.value ?? '')} disabled={isMaxReached} />
            <IonInput fill="outline" labelPlacement="stacked" label={t.company.npwp} value={npwp} onIonInput={(e) => setNpwp(e.detail.value ?? '')} placeholder="01.234.567.8-012.000" disabled={isMaxReached} />

            {error && <p className="text-body-sm font-semibold text-alert-coral">{error}</p>}

            <div className="flex gap-3 pt-2">
              <IonButton type="submit" disabled={createCompany.isPending || isMaxReached}>
                {createCompany.isPending && <IonSpinner name="crescent" slot="start" />}
                {t.company.create}
              </IonButton>
              <IonButton type="button" fill="outline" onClick={() => router.back()}>{t.common.cancel}</IonButton>
            </div>
          </form>
        </IonCardContent>
      </IonCard>
    </div>
  );
}
