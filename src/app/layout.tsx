import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Akusoft UKM — Akuntansi Cerdas untuk Bisnis Indonesia',
  description:
    'Akusoft v3.0 — aplikasi akuntansi multi-perusahaan untuk UKM Indonesia. Faktur, PPN 11%, PPh Final 0.5%, QRIS, dan laporan keuangan.',
  applicationName: 'Akusoft UKM',
};

export const viewport: Viewport = {
  themeColor: '#F8FAFC',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Default locale is Bahasa Indonesia (CLAUDE.md §3).
  return (
    // Ionic writes platform classes (plt-*, mode) onto <html>/<body> on the client;
    // suppressHydrationWarning keeps that from being flagged as a mismatch.
    <html lang="id" className={`${jakarta.variable} light`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
