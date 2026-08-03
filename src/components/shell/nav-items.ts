import {
  LayoutDashboard,
  ArrowLeftRight,
  ReceiptText,
  Wallet,
  Landmark,
  FileText,
  BarChart3,
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
export const NAV_ITEMS: NavItem[] = [
  { key: 'overview', label: id.nav.overview, href: '/', icon: LayoutDashboard },
  { key: 'cashflow', label: id.nav.cashflow, href: '/arus-kas', icon: ArrowLeftRight },
  { key: 'invoices', label: id.nav.invoices, href: '/faktur', icon: ReceiptText },
  { key: 'expenses', label: id.nav.expenses, href: '/pengeluaran', icon: Wallet },
  { key: 'bank', label: id.nav.bank, href: '/kas-bank', icon: Landmark },
  { key: 'tax', label: id.nav.tax, href: '/pajak', icon: FileText },
  { key: 'reports', label: id.nav.reports, href: '/laporan', icon: BarChart3 },
];
