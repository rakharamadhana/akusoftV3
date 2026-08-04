'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { SupabaseAuthProvider } from './supabase-auth-provider';
import { IonicProvider } from './ionic-provider';

/** App-wide client providers (TanStack Query v5 + Supabase Auth). See CLAUDE.md §4. */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <IonicProvider>
        <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
      </IonicProvider>
    </QueryClientProvider>
  );
}
