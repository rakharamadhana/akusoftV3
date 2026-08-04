'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore, useActiveCompany } from '@/store/auth';

// Paths reachable while a company still needs onboarding (Modal Awal).
const SETUP_PATHS = ['/mulai', '/perusahaan/baru'];

export function AppSkeleton() {
  return (
    <div className="flex min-h-screen bg-slate-50/80">
      {/* Desktop Sidebar Skeleton */}
      <div className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white p-4 space-y-4">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="h-7 w-7 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-5 w-28 animate-pulse rounded-md bg-slate-200" />
        </div>
        <div className="space-y-2 pt-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Skeleton */}
        <div className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded-md bg-slate-200" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
        </div>

        {/* Page Content Skeleton */}
        <div className="p-6 space-y-6 max-w-container-max w-full mx-auto">
          <div className="space-y-2">
            <div className="h-8 w-44 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-64 animate-pulse rounded-md bg-slate-100" />
          </div>

          {/* Stat Cards Row Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white border border-slate-200/80 p-4 space-y-3 shadow-sm">
                <div className="h-8 w-8 rounded-xl bg-slate-100" />
                <div className="h-3 w-24 bg-slate-100 rounded" />
                <div className="h-6 w-36 bg-slate-200 rounded-md" />
              </div>
            ))}
          </div>

          {/* List Card Skeleton */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-4 shadow-sm">
            <div className="h-5 w-36 animate-pulse rounded-md bg-slate-200" />
            <div className="space-y-3 pt-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
                      <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-5 w-20 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const normalizePath = (path: string) => (path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path);

/**
 * Gates the authenticated app:
 *  - no session         → /login
 *  - session, no company → /perusahaan/baru
 *  - company not set up  → /mulai (Modal Awal) until setup_completed
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const companies = useAuthStore((s) => s.companies);
  const company = useActiveCompany();
  const hydrated = useAuthStore((s) => s.hydrated);
  const router = useRouter();
  const rawPathname = usePathname();
  const pathname = normalizePath(rawPathname);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (companies.length === 0) {
      if (pathname !== '/perusahaan/baru') router.replace('/perusahaan/baru');
      return;
    }
    if (company && !company.setup_completed && !SETUP_PATHS.includes(pathname)) {
      router.replace('/mulai');
    }
  }, [hydrated, user, companies, company, pathname, router]);

  const needsOnboarding =
    user && companies.length > 0 && company && !company.setup_completed && !SETUP_PATHS.includes(pathname);
  const needsCompany = user && companies.length === 0 && pathname !== '/perusahaan/baru';

  if (!hydrated || !user || needsOnboarding || needsCompany) {
    return <AppSkeleton />;
  }

  return <>{children}</>;
}
