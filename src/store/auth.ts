'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/lib/supabase/database.types';

/**
 * Session state backed by Supabase Auth. Supabase persists the JWT itself; this
 * store mirrors the resolved user + the companies they belong to for the UI.
 * A user can belong to many companies (CLAUDE.md §5 multi-tenant); the active
 * one is persisted so it survives reloads. RLS is the real security boundary.
 */

const ACTIVE_KEY = 'akusoft-active-company';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export type ActiveCompany = Tables<'companies'>;

interface AuthState {
  hydrated: boolean;
  user: SessionUser | null;
  companies: ActiveCompany[];
  activeCompanyId: string | null;
  setUser: (user: SessionUser | null) => void;
  setCompanies: (companies: ActiveCompany[]) => void;
  setActiveCompanyId: (id: string | null) => void;
  upsertCompany: (company: ActiveCompany) => void;
  setHydrated: (v: boolean) => void;
  reset: () => void;
  signOut: () => Promise<void>;
}

const clearActive = () => {
  if (typeof window !== 'undefined') localStorage.removeItem(ACTIVE_KEY);
};

export const useAuthStore = create<AuthState>()((set) => ({
  hydrated: false,
  user: null,
  companies: [],
  activeCompanyId: null,
  setUser: (user) => set({ user }),
  setCompanies: (companies) => set({ companies }),
  setActiveCompanyId: (id) => {
    if (typeof window !== 'undefined' && id) localStorage.setItem(ACTIVE_KEY, id);
    set({ activeCompanyId: id });
  },
  upsertCompany: (company) =>
    set((s) => ({ companies: s.companies.map((c) => (c.id === company.id ? company : c)) })),
  setHydrated: (v) => set({ hydrated: v }),
  reset: () => {
    clearActive();
    set({ user: null, companies: [], activeCompanyId: null });
  },
  signOut: async () => {
    await createClient().auth.signOut();
    clearActive();
    set({ user: null, companies: [], activeCompanyId: null });
  },
}));

/** The stored active-company id (used to restore selection on load). */
export function readStoredActiveCompanyId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_KEY);
}

/** The active company object (or null before it resolves). */
export function useActiveCompany(): ActiveCompany | null {
  return useAuthStore((s) => s.companies.find((c) => c.id === s.activeCompanyId) ?? null);
}

/** The active company id (or null before it resolves). */
export function useCompanyId(): string | null {
  return useAuthStore((s) => s.activeCompanyId);
}
