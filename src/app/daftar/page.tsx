'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Landmark, Info } from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';

export default function RegisterPage() {
  const t = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center px-gutter py-10">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-[5%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary-container/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[5%] h-[35%] w-[35%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <main className="w-full max-w-[480px] duration-700 animate-in fade-in slide-in-from-bottom-4">
        <div className="mb-stack-lg flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-white shadow-micro">
            <Landmark className="h-7 w-7" />
          </div>
          <h1 className="text-headline-md font-headline-md text-slate-heading">{t.auth.registerTitle}</h1>
          <p className="mt-1 text-body-md font-body-md text-slate-body">{t.auth.registerSubtitle}</p>
        </div>

        <div className="rounded-xl border border-border-light bg-white p-8 shadow-micro">
          <div className="mb-stack-md flex items-start gap-3 rounded-lg border border-primary-container/20 bg-pill-indigo-bg/60 p-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-container" />
            <p className="text-body-sm text-slate-body">{t.auth.registerDisabledNote}</p>
          </div>

          <form
            className="space-y-stack-md"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <Field label={t.auth.companyName} placeholder={t.auth.companyNamePlaceholder} />
            <Field label={t.auth.fullName} placeholder="Budi Santoso" />
            <Field label={t.auth.email} type="email" placeholder={t.auth.emailPlaceholder} />
            <Field label={t.auth.npwp} placeholder="01.234.567.8-012.000" />
            <Field label={t.auth.password} type="password" placeholder="••••••••" />

            {submitted && (
              <p className="text-body-sm font-semibold text-primary-container">
                {t.auth.registerDisabledNote}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-primary-container py-3.5 text-[14px] font-label-md text-white shadow-micro transition-all hover:bg-primary active:scale-[0.98]"
            >
              {t.auth.createAccount}
            </button>
          </form>
        </div>

        <p className="mt-stack-lg text-center text-body-md font-body-md text-slate-body">
          {t.auth.alreadyHaveAccount}{' '}
          <Link href="/login" className="font-bold text-primary-container hover:underline">
            {t.auth.backToLogin}
          </Link>
        </p>
      </main>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = 'text',
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-label-md font-label-md text-slate-heading">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border-light bg-white px-4 py-3 text-body-md text-slate-heading outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
      />
    </div>
  );
}
