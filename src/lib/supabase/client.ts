'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser Supabase client. Akusoft v2.0 is a static export wrapped by Capacitor
 * (CLAUDE.md §6/§7), so auth is client-side (session persisted in the WebView).
 * Server logic that needs elevated access lives in Supabase Edge Functions.
 *
 * All tenant data is isolated by company_id via RLS (CLAUDE.md §5) — the client
 * never needs to filter by company_id manually for security, only for UX.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase env vars missing. Copy .env.local.example to .env.local and fill in NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }

  return createBrowserClient(url, anonKey);
}
