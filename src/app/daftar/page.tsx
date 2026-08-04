'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IonPage, IonContent, IonInput, IonButton, IonSpinner } from '@ionic/react';
import { Landmark, Info, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const t = useTranslation();
  const router = useRouter();

  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [npwp, setNpwp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(t.auth.passwordMismatch);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { name: fullName, company_name: companyName, tax_number: npwp || null },
        emailRedirectTo: redirectTo,
      },
    });

    if (signUpError) {
      setError(`${t.auth.registerFailed} ${signUpError.message}`);
      setLoading(false);
      return;
    }
    if (data.session) {
      const { error: rpcError } = await supabase.rpc('create_company_with_defaults', {
        p_name: companyName,
        p_email: email.trim(),
        p_tax_number: npwp || undefined,
      });
      if (rpcError) {
        setError(`${t.auth.registerFailed} ${rpcError.message}`);
        setLoading(false);
        return;
      }
      router.replace('/mulai');
      return;
    }
    setCheckEmail(true);
    setLoading(false);
  };

  return (
    <IonPage>
      <IonContent style={{ '--background': 'transparent' } as React.CSSProperties} className="ion-padding">
        {/* Dimmed Background Image Layer */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg.jpeg')" }}
          />
          {/* Dimming & Blur Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative flex min-h-full flex-col items-center justify-center py-4 sm:py-8">
          <main className="w-full max-w-[480px]">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-white shadow-lg ring-4 ring-white/20">
                <Landmark className="h-8 w-8" />
              </div>
              <h1 className="text-headline-md font-bold tracking-tight text-white drop-shadow-md">Akusoft 3.0</h1>
              <p className="mt-1 text-body-md font-medium text-slate-200 drop-shadow-sm">{t.auth.registerSubtitle}</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:p-8">
              {checkEmail ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <CheckCircle2 className="h-12 w-12 text-secondary" />
                  <p className="text-body-md font-medium text-slate-heading">{t.auth.registerCheckEmail}</p>
                  <Link href="/login" className="mt-2 font-bold text-primary-container hover:underline">{t.auth.backToLogin}</Link>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-start gap-3 rounded-xl border border-primary-container/20 bg-pill-indigo-bg/60 p-4">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-container" />
                    <p className="text-body-sm text-slate-body">{t.auth.registerDisabledNote}</p>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-4">
                    <IonInput fill="outline" labelPlacement="stacked" label={t.auth.fullName} value={fullName} onIonInput={(e) => setFullName(e.detail.value ?? '')} placeholder="Budi Santoso" required />
                    <IonInput fill="outline" labelPlacement="stacked" label={t.auth.email} type="email" value={email} onIonInput={(e) => setEmail(e.detail.value ?? '')} placeholder={t.auth.emailPlaceholder} required />
                    <IonInput fill="outline" labelPlacement="stacked" label={t.auth.companyName} value={companyName} onIonInput={(e) => setCompanyName(e.detail.value ?? '')} placeholder={t.auth.companyNamePlaceholder} required />
                    <IonInput fill="outline" labelPlacement="stacked" label={t.auth.password} type="password" value={password} onIonInput={(e) => setPassword(e.detail.value ?? '')} placeholder="••••••••" required />
                    <IonInput fill="outline" labelPlacement="stacked" label={t.auth.confirmPassword} type="password" value={confirm} onIonInput={(e) => setConfirm(e.detail.value ?? '')} placeholder="••••••••" required />
                    <IonInput fill="outline" labelPlacement="stacked" label={t.auth.npwp} value={npwp} onIonInput={(e) => setNpwp(e.detail.value ?? '')} placeholder="01.234.567.8-012.000" />

                    {error && <p className="text-body-sm font-semibold text-alert-coral">{error}</p>}

                    <IonButton expand="block" type="submit" disabled={loading} className="h-11 font-semibold">
                      {loading ? <IonSpinner name="crescent" /> : t.auth.createAccount}
                    </IonButton>
                  </form>
                </>
              )}
            </div>

            <p className="mt-6 text-center text-body-md font-medium text-slate-200 drop-shadow-sm">
              {t.auth.alreadyHaveAccount}{' '}
              <Link href="/login" className="font-bold text-white underline-offset-4 hover:underline">{t.auth.backToLogin}</Link>
            </p>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
