'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Landmark, Search, Bell, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/use-translation';
import { NAV_ITEMS } from './nav-items';
import type { ReactNode } from 'react';

/**
 * Shared application shell: desktop sidebar + floating topbar + mobile bottom nav.
 * Mirrors the shared components in references/<screen>/code.html (CLAUDE.md §2 layer 4).
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslation();
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-[60] hidden h-full w-64 flex-col border-r border-border-light bg-white p-4 lg:flex">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-white">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-headline-sm font-headline-sm text-slate-heading">
              {t.common.appName}
            </h1>
            <p className="text-label-md font-label-md text-slate-body opacity-70">
              Financial Admin
            </p>
          </div>
        </div>
        <nav className="space-y-1">
          {NAV_ITEMS.map(({ key, label, href, icon: Icon }) => (
            <Link
              key={key}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-label-md font-label-md transition-colors',
                isActive(href)
                  ? 'bg-primary-container font-bold text-white'
                  : 'text-slate-body hover:bg-surface-container',
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-xl bg-surface-container-low p-4">
          <p className="mb-1 text-label-md font-label-md text-slate-heading">Penyimpanan</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-[65%] bg-primary-container" />
          </div>
          <p className="mt-2 text-[10px] text-slate-body">6.5 GB dari 10 GB terpakai</p>
        </div>
      </aside>

      {/* Main column */}
      <main className="min-h-screen pb-20 lg:ml-64 lg:pb-0">
        {/* Floating topbar */}
        <header className="sticky top-4 z-50 mx-auto flex h-16 w-full max-w-container-max items-center justify-between rounded-xl border border-border-light bg-white px-gutter shadow-micro">
          <div className="flex items-center gap-6">
            <span className="text-headline-md font-headline-md font-bold text-primary-container">
              {t.common.appName}
            </span>
            <button className="hidden cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 transition-colors hover:bg-surface-container md:flex">
              <span className="text-label-md font-label-md text-slate-heading">
                PT Akusoft Nusantara
              </span>
              <ChevronDown className="h-4 w-4 text-slate-body" />
            </button>
          </div>
          <div className="hidden max-w-md flex-1 px-8 sm:block">
            <div className="group relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-container" />
              <input
                type="text"
                placeholder={t.common.search}
                className="w-full rounded-xl border border-border-light bg-background py-2 pl-10 pr-4 text-body-md font-body-md outline-none transition-all focus:border-primary-container focus:ring-2 focus:ring-primary-container"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-border-light bg-surface-container-low px-3 py-1.5 md:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
              <span className="text-label-md font-label-md text-slate-heading">
                {t.common.currency}
              </span>
            </div>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container-low">
              <Bell className="h-5 w-5 text-slate-heading" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-alert-coral" />
            </button>
            <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-border-light bg-surface-container transition-transform active:scale-95" />
          </div>
        </header>

        <div className="mx-auto max-w-container-max space-y-8 px-gutter py-8">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] flex h-16 items-center justify-around border-t border-border-light bg-white px-4 shadow-micro lg:hidden">
        {NAV_ITEMS.slice(0, 2).map(({ key, label, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1',
              isActive(href) ? 'text-primary-container' : 'text-slate-body',
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
        <Link
          href="/faktur/baru"
          className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-white shadow-micro transition-transform active:scale-90"
          aria-label={t.common.createInvoice}
        >
          <Plus className="h-6 w-6" />
        </Link>
        {NAV_ITEMS.slice(2, 4).map(({ key, label, href, icon: Icon }) => (
          <Link
            key={key}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1',
              isActive(href) ? 'text-primary-container' : 'text-slate-body',
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px]">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
