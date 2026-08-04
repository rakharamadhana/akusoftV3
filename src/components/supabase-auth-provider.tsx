'use client';

import { useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, readStoredActiveCompanyId } from '@/store/auth';
import { loadUserCompanies } from '@/lib/data/company';

/**
 * Bridges Supabase Auth into the app: mirrors the session user + active company
 * into the auth store, and self-heals a missing company for freshly-confirmed
 * sign-ups by calling create_company_with_defaults() from the metadata captured
 * at registration. Mounted once, high in the tree.
 */
export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setCompanies = useAuthStore((s) => s.setCompanies);
  const setActiveCompanyId = useAuthStore((s) => s.setActiveCompanyId);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function resolve(session: Session | null) {
      if (!session?.user) {
        if (!active) return;
        setUser(null);
        setCompanies([]);
        setActiveCompanyId(null);
        setHydrated(true);
        return;
      }

      const u = session.user;
      const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
      setUser({
        id: u.id,
        email: u.email ?? '',
        name: (meta.name as string) || u.email?.split('@')[0] || 'Pengguna',
      });

      try {
        let companies = await loadUserCompanies();
        // First confirmed login after registration: no company yet — create it
        // from the name captured at sign-up.
        if (companies.length === 0 && meta.company_name) {
          await supabase.rpc('create_company_with_defaults', {
            p_name: String(meta.company_name),
            p_email: u.email ?? undefined,
            p_tax_number: (meta.tax_number as string) || undefined,
          });
          companies = await loadUserCompanies();
        }
        if (!active) return;
        setCompanies(companies);
        // Restore the previously-selected company if it's still available.
        const stored = readStoredActiveCompanyId();
        const chosen = companies.find((c) => c.id === stored) ?? companies[0] ?? null;
        setActiveCompanyId(chosen?.id ?? null);
      } catch {
        if (active) {
          setCompanies([]);
          setActiveCompanyId(null);
        }
      } finally {
        if (active) setHydrated(true);
      }
    }

    supabase.auth.getSession().then(({ data }) => resolve(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      resolve(session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [setUser, setCompanies, setActiveCompanyId, setHydrated]);

  return <>{children}</>;
}
