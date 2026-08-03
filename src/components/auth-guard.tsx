'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Landmark } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

/** Gates the authenticated app. Redirects to /login when no demo session. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.replace('/login');
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-primary-container text-white">
            <Landmark className="h-6 w-6" />
          </div>
          <p className="text-body-sm text-slate-body">Memuat Akusoft…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
