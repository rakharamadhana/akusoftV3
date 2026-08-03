'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Active-tenant store. Multi-tenancy is enforced server-side by RLS on company_id
 * (CLAUDE.md §5); this only tracks which company the UI is currently viewing so
 * queries and headers can scope to it. Instant switching per GIGA_PROMPT §4.
 */
export interface Company {
  id: string;
  name: string;
}

interface CompanyState {
  activeCompany: Company | null;
  companies: Company[];
  setActiveCompany: (company: Company) => void;
  setCompanies: (companies: Company[]) => void;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set) => ({
      activeCompany: null,
      companies: [],
      setActiveCompany: (company) => set({ activeCompany: company }),
      setCompanies: (companies) => set({ companies }),
    }),
    { name: 'akusoft-active-company' },
  ),
);
