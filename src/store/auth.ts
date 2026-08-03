'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Client-side auth for the demo/static build. This is NOT real security — it
 * gates the UI so the app is testable without a live Supabase project. When
 * Supabase Auth is wired (CLAUDE.md §5), replace `login` with a real call and
 * keep RLS as the actual data boundary.
 */

// Dummy account for local testing / `ionic serve`.
export const DEMO_ACCOUNT = {
  email: 'demo@akusoft.id',
  password: 'akusoft123',
  name: 'Budi Santoso',
  company: 'PT Akusoft Nusantara',
} as const;

export interface AuthUser {
  email: string;
  name: string;
  company: string;
}

interface AuthState {
  user: AuthUser | null;
  hasHydrated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      login: (email, password) => {
        const ok =
          email.trim().toLowerCase() === DEMO_ACCOUNT.email &&
          password === DEMO_ACCOUNT.password;
        if (ok) {
          set({
            user: {
              email: DEMO_ACCOUNT.email,
              name: DEMO_ACCOUNT.name,
              company: DEMO_ACCOUNT.company,
            },
          });
        }
        return ok;
      },
      logout: () => set({ user: null }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: 'akusoft-auth',
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
