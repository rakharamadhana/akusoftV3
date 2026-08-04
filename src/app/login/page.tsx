'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IonPage, IonContent, IonInput, IonButton, IonSpinner } from '@ionic/react';
import { Landmark, Lock } from 'lucide-react';
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

  return (
    <IonPage>
      <IonContent style={{ '--background': 'transparent' } as React.CSSProperties} className="ion-padding">
        {/* Dimmed Background Image Layer */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/bg.jpeg')" }}
          />
          {/* Dimming & Blur Overlay for high-contrast login card readability */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative flex min-h-full flex-col items-center justify-center py-4 sm:py-8">
          <main className="w-full max-w-[440px]">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container text-white shadow-lg ring-4 ring-white/20">
                <Landmark className="h-8 w-8" />
              </div>
              <h1 className="text-headline-md font-bold tracking-tight text-white drop-shadow-md">Akusoft 3.0</h1>
              <p className="mt-1 text-body-md font-medium text-slate-200 drop-shadow-sm">{t.auth.tagline}</p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md sm:p-8">
              <div className="mb-5">
                <h2 className="text-headline-sm font-bold text-slate-heading">{t.auth.welcomeBack}</h2>
                <p className="text-body-sm font-medium text-slate-body">{t.auth.enterCredentials}</p>
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

                <IonButton expand="block" type="submit" disabled={loading} className="h-11 font-semibold">
                  {loading ? <IonSpinner name="crescent" /> : t.auth.signIn}
                </IonButton>
              </form>
            </div>

            <p className="mt-6 text-center text-body-md font-medium text-slate-200 drop-shadow-sm">
              {t.auth.newToAkusoft}{' '}
              <Link href="/daftar" className="font-bold text-white underline-offset-4 hover:underline">
                {t.auth.registerCompany}
              </Link>
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-slate-300 opacity-80">
              <Lock className="h-4 w-4" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">{t.auth.secureSsl}</span>
            </div>
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
}

