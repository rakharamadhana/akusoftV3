'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IonPage, IonContent, IonInput, IonButton, IonSpinner } from '@ionic/react';
import { Landmark, Lock } from 'lucide-react';
import { DEMO_ACCOUNT } from '@/store/auth';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/i18n/use-translation';

export default function LoginPage() {
  const t = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setError(true);
      setLoading(false);
      return;
    }
    router.replace('/');
  };

  const fillDemo = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setError(false);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="relative flex min-h-full flex-col items-center justify-center py-2 sm:py-6">
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -right-[5%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary-container/5 blur-[120px]" />
            <div className="absolute -bottom-[10%] -left-[5%] h-[35%] w-[35%] rounded-full bg-secondary/5 blur-[100px]" />
          </div>

          <main className="w-full max-w-[440px]">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-white shadow-micro">
                <Landmark className="h-7 w-7" />
              </div>
              <h1 className="text-headline-md font-headline-md text-slate-heading">Akusoft 3.0</h1>
              <p className="mt-1 text-body-md font-body-md text-slate-body">{t.auth.tagline}</p>
            </div>

            <div className="rounded-xl border border-border-light bg-white p-6 shadow-micro">
              <div className="mb-4">
                <h2 className="text-headline-sm font-headline-sm text-slate-heading">{t.auth.welcomeBack}</h2>
                <p className="text-body-sm font-body-sm text-slate-body">{t.auth.enterCredentials}</p>
              </div>

              <div className="mb-4 rounded-lg border border-primary-container/20 bg-pill-indigo-bg/60 p-4">
                <p className="mb-1 text-label-md font-label-md text-primary-container">{t.auth.demoTitle}</p>
                <p className="text-body-sm text-slate-body">{t.auth.demoHint}</p>
                <div className="mt-2 flex flex-col gap-0.5 font-mono text-[12px] text-slate-heading">
                  <span>{DEMO_ACCOUNT.email}</span>
                  <span>{DEMO_ACCOUNT.password}</span>
                </div>
                <IonButton fill="clear" size="small" className="mt-1 normal-case" onClick={fillDemo}>
                  {t.auth.useDemo}
                </IonButton>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <IonInput
                  type="email"
                  label={t.auth.email}
                  labelPlacement="stacked"
                  fill="outline"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? '')}
                  placeholder={t.auth.emailPlaceholder}
                  required
                />
                <IonInput
                  type="password"
                  label={t.auth.password}
                  labelPlacement="stacked"
                  fill="outline"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value ?? '')}
                  placeholder="••••••••"
                  required
                />

                {error && (
                  <p className="text-body-sm font-semibold text-alert-coral">{t.auth.invalidCredentials}</p>
                )}

                <IonButton expand="block" type="submit" disabled={loading}>
                  {loading ? <IonSpinner name="crescent" /> : t.auth.signIn}
                </IonButton>
              </form>
            </div>

            <p className="mt-6 text-center text-body-md font-body-md text-slate-body">
              {t.auth.newToAkusoft}{' '}
              <Link href="/daftar" className="font-bold text-primary-container hover:underline">
                {t.auth.registerCompany}
              </Link>
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 text-slate-body opacity-40">
              <Lock className="h-4 w-4" />
              <span className="text-[10px] font-label-md uppercase tracking-widest">{t.auth.secureSsl}</span>
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}
