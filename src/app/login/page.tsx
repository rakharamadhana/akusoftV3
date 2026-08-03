'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Landmark, Lock, Loader2 } from 'lucide-react';
import { useAuthStore, DEMO_ACCOUNT } from '@/store/auth';
import { useTranslation } from '@/i18n/use-translation';

export default function LoginPage() {
  const t = useTranslation();
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);
    // Simulate a short auth round-trip for realistic feedback.
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        router.replace('/');
      } else {
        setError(true);
        setLoading(false);
      }
    }, 400);
  };

  const fillDemo = () => {
    setEmail(DEMO_ACCOUNT.email);
    setPassword(DEMO_ACCOUNT.password);
    setError(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-gutter">
      {/* Atmospheric background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-[5%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary-container/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] h-[35%] w-[35%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <main className="w-full max-w-[440px] duration-700 animate-in fade-in slide-in-from-bottom-4">
        {/* Brand */}
        <div className="mb-stack-lg flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-white shadow-micro">
            <Landmark className="h-7 w-7" />
          </div>
          <h1 className="text-headline-md font-headline-md text-slate-heading">Akusoft v3.0</h1>
          <p className="mt-1 text-body-md font-body-md text-slate-body">{t.auth.tagline}</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border-light bg-white p-8 shadow-micro">
          <div className="mb-stack-lg">
            <h2 className="text-headline-sm font-headline-sm text-slate-heading">
              {t.auth.welcomeBack}
            </h2>
            <p className="text-body-sm font-body-sm text-slate-body">{t.auth.enterCredentials}</p>
          </div>

          {/* Demo hint */}
          <div className="mb-stack-md rounded-lg border border-primary-container/20 bg-pill-indigo-bg/60 p-4">
            <p className="mb-1 text-label-md font-label-md text-primary-container">
              {t.auth.demoTitle}
            </p>
            <p className="text-body-sm text-slate-body">{t.auth.demoHint}</p>
            <div className="mt-2 flex flex-col gap-0.5 font-mono text-[12px] text-slate-heading">
              <span>{DEMO_ACCOUNT.email}</span>
              <span>{DEMO_ACCOUNT.password}</span>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="mt-3 text-label-md font-label-md text-primary-container hover:underline"
            >
              {t.auth.useDemo}
            </button>
          </div>

          <form className="space-y-stack-md" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-label-md font-label-md text-slate-heading">
                {t.auth.email}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.emailPlaceholder}
                className="w-full rounded-lg border border-border-light bg-white px-4 py-3 text-body-md text-slate-heading outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-label-md font-label-md text-slate-heading"
                >
                  {t.auth.password}
                </label>
                <a href="#" className="text-label-md font-label-md text-primary-container hover:underline">
                  {t.auth.forgotPassword}
                </a>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-border-light bg-white px-4 py-3 text-body-md text-slate-heading outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
              />
            </div>

            {error && (
              <p className="text-body-sm font-semibold text-alert-coral">{t.auth.invalidCredentials}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container py-3.5 text-[14px] font-label-md text-white shadow-micro transition-all hover:bg-primary active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.auth.signingIn}
                </>
              ) : (
                t.auth.signIn
              )}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border-light" />
              <span className="mx-4 flex-shrink text-label-md font-label-md text-slate-body">
                {t.auth.orContinueWith}
              </span>
              <div className="flex-grow border-t border-border-light" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border-light bg-white py-3.5 text-[14px] font-label-md text-slate-heading transition-all hover:bg-surface-container-low active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t.auth.signInGoogle}
            </button>
          </form>
        </div>

        <p className="mt-stack-lg text-center text-body-md font-body-md text-slate-body">
          {t.auth.newToAkusoft}{' '}
          <Link href="/daftar" className="font-bold text-primary-container hover:underline">
            {t.auth.registerCompany}
          </Link>
        </p>

        <div className="mt-10 flex items-center justify-center gap-2 text-slate-body opacity-40">
          <Lock className="h-4 w-4" />
          <span className="text-[10px] font-label-md uppercase tracking-widest">
            {t.auth.secureSsl}
          </span>
        </div>
      </main>
    </div>
  );
}
