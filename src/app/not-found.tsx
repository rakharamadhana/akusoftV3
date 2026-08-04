import Link from 'next/link';
import { Landmark } from 'lucide-react';

/**
 * App Router 404. Required so `output: 'export'` (CLAUDE.md §6) emits /404.html
 * from the App Router instead of falling back to the Pages-Router _document
 * (which throws "<Html> should not be imported outside of pages/_document").
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container text-white">
        <Landmark className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-headline-lg font-headline-lg text-slate-heading">404</h1>
        <p className="text-body-md text-slate-body">Halaman tidak ditemukan.</p>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-primary-container px-4 py-2 text-label-md font-label-md text-white shadow-micro transition-colors hover:bg-primary"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
