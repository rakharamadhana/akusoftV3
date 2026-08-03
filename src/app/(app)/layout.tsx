import { AuthGuard } from '@/components/auth-guard';
import { AppShell } from '@/components/shell/app-shell';

/** Authenticated area: everything here sits behind the guard and inside the shell. */
export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
