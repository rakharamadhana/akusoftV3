'use client';

import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Browser Supabase client. Akusoft is a static export wrapped by Capacitor
 * (CLAUDE.md §6/§7), so there is no SSR: auth is fully client-side and the
 * session is persisted in localStorage / the Capacitor WebView. We use the
 * plain supabase-js client (not @supabase/ssr, which targets cookie-based SSR).
 *
 * All tenant data is isolated by company_id via RLS (CLAUDE.md §5) — the client
 * never needs to filter by company_id manually for security, only for UX.
 */
let browserClient: SupabaseClient<Database> | undefined;

export function createClient(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase env vars missing. Copy .env.local.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  // Reuse a single client so the auth session listener isn't re-registered.
  if (!browserClient) {
    browserClient = createSupabaseClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return browserClient;
}
