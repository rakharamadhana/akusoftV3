import {
  LayoutDashboard,
  ListTree,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { id } from '@/i18n/locales/id';

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

// Single source of nav truth, shared by desktop sidebar and mobile bottom nav.
// Mirrors the v2 single-entry menu structure (akusoftv2-flow.md §3). The older
// v3 screens (faktur, kas-bank, pajak, arus-kas) stay reachable by URL but are
// intentionally off the primary nav.
export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: id.nav.home, href: '/', icon: LayoutDashboard },
  { key: 'accounts', label: id.nav.accounts, href: '/akun', icon: ListTree },
  { key: 'items', label: id.nav.items, href: '/item', icon: Package },
  { key: 'income', label: id.nav.income, href: '/pemasukan', icon: ArrowDownCircle },
  { key: 'expenses', label: id.nav.expenses, href: '/pengeluaran', icon: ArrowUpCircle },
  { key: 'transactions', label: id.nav.transactions, href: '/transaksi', icon: ArrowLeftRight },
  { key: 'reports', label: id.nav.reports, href: '/laporan', icon: BarChart3 },
  { key: 'settings', label: id.nav.settings, href: '/pengaturan', icon: Settings },
];
