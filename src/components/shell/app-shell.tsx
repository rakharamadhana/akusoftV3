'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IonSplitPane,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonPopover,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonAlert,
} from '@ionic/react';
import {
  Landmark,
  ChevronDown,
  LogOut,
  Check,
  Building2,
  Plus,
  User,
  ListTree,
  Settings,
  LayoutDashboard,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  BarChart3,
  Boxes,
  ChevronRight,
  ArrowLeft,
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useTranslation } from '@/i18n/use-translation';
import { useAuthStore, useActiveCompany, type ActiveCompany } from '@/store/auth';
import { useDeleteCompany } from '@/lib/data/company';
import { NAV_ITEMS } from './nav-items';
import type { ReactNode } from 'react';

/**
 * Responsive Ionic shell (CLAUDE.md §7):
 *  - Desktop (lg+): a persistent/collapsible IonMenu side nav via IonSplitPane.
 *  - Mobile: a native IonTabBar at the bottom (Beranda | Master | + | Transaksi | Laporan).
 * Navigation stays on Next's router.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslation();
  const user = useAuthStore((s) => s.user);
  const company = useActiveCompany();
  const companies = useAuthStore((s) => s.companies);
  const setActiveCompanyId = useAuthStore((s) => s.setActiveCompanyId);
  const signOut = useAuthStore((s) => s.signOut);
  const deleteCompany = useDeleteCompany();

  const [activeMenu, setActiveMenu] = useState<'none' | 'add' | 'master' | 'transaksi'>('none');
  const [profileView, setProfileView] = useState<'main' | 'company'>('main');
  const [companyToDelete, setCompanyToDelete] = useState<ActiveCompany | null>(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('akusoft_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('akusoft_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  const toggleMenu = (menu: 'add' | 'master' | 'transaksi') => {
    setActiveMenu((prev) => (prev === menu ? 'none' : menu));
  };
  const closeMenu = () => setActiveMenu('none');

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const go = (href: string) => router.push(href);
  const switchTo = (id: string) => {
    setActiveCompanyId(id);
    router.replace('/');
  };
  const handleLogout = async () => {
    await signOut();
    router.replace('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userInitials = getInitials(user?.name);

  return (
    <IonSplitPane contentId="main-content" when="lg" className={isSidebarCollapsed ? 'sidebar-collapsed' : undefined}>
      {/* Desktop side navigation (persistent at lg+, disabled below). */}
      <IonMenu contentId="main-content" type="overlay" swipeGesture={false}>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            {!isSidebarCollapsed ? (
              <div className="flex items-center justify-between px-4 w-full">
                <span className="flex items-center gap-2.5 font-bold text-slate-800 text-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-container text-white shadow-sm ring-2 ring-primary-container/20">
                    <Landmark className="h-4.5 w-4.5" />
                  </span>
                  <span className="truncate">{t.common.appName}</span>
                </span>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Ciutkan sidebar"
                >
                  <PanelLeftClose className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 gap-1.5 w-full">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-container text-white shadow-sm ring-2 ring-primary-container/20">
                  <Landmark className="h-5 w-5" />
                </span>
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Perluas sidebar"
                >
                  <PanelLeftOpen className="h-4 w-4" />
                </button>
              </div>
            )}
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList className={isSidebarCollapsed ? 'px-1 py-2' : 'py-2 px-0'}>
            {NAV_ITEMS.map(({ key, label, href, icon: Icon }) =>
              !isSidebarCollapsed ? (
                <IonItem
                  key={key}
                  button
                  detail={false}
                  lines="none"
                  color={isActive(href) ? 'primary' : undefined}
                  onClick={() => go(href)}
                  title={label}
                >
                  <span slot="start"><Icon className="h-5 w-5" /></span>
                  <IonLabel>{label}</IonLabel>
                </IonItem>
              ) : (
                <IonItem
                  key={key}
                  button
                  detail={false}
                  lines="none"
                  onClick={() => go(href)}
                  title={label}
                  className="justify-center text-center"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all mx-auto ${
                      isActive(href)
                        ? 'bg-primary-container text-white shadow-md shadow-primary-container/30 ring-2 ring-primary-container/20'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </IonItem>
              )
            )}
          </IonList>
        </IonContent>
      </IonMenu>

      {/* Main content pane */}
      <IonPage id="main-content">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonTitle>
              {/* Mobile Header App Brand (Hidden on Desktop) */}
              <span className="flex items-center gap-2 font-bold text-slate-heading lg:hidden">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-container text-white">
                  <Landmark className="h-4 w-4" />
                </span>
                {t.common.appName}
              </span>
            </IonTitle>
            <IonButtons slot="end">
              {/* Desktop / Top Right Profile Dropdown */}
              <IonButton id="profile-trigger" fill="clear" className="ml-1">
                <div className="flex items-center gap-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container font-semibold text-white text-xs shadow-sm ring-2 ring-primary-container/20">
                    {userInitials ? userInitials : <User className="h-4 w-4" />}
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-body opacity-70" />
                </div>
              </IonButton>

              <IonPopover
                trigger="profile-trigger"
                dismissOnSelect={false}
                side="bottom"
                alignment="end"
                onDidDismiss={() => setProfileView('main')}
              >
                <IonContent>
                  <IonList className="w-64 py-1">
                    {profileView === 'main' ? (
                      <>
                        {/* User Header */}
                        <IonItem lines="full" className="bg-slate-50/50">
                          <div className="flex items-center gap-3 py-2">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container font-bold text-white text-sm shadow-sm">
                              {userInitials ? userInitials : <User className="h-5 w-5" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-slate-heading">{user?.name ?? 'Akusoft User'}</p>
                              <p className="truncate text-[11px] text-slate-body opacity-80">{user?.email ?? ''}</p>
                            </div>
                          </div>
                        </IonItem>

                        {/* Perusahaan Saya Step Button */}
                        <IonItem button detail={false} lines="full" onClick={() => setProfileView('company')}>
                          <span slot="start"><Building2 className="h-4 w-4 text-primary-container" /></span>
                          <IonLabel>
                            <p className="text-xs font-semibold text-slate-heading">Perusahaan Saya</p>
                            <p className="truncate text-[10px] text-primary-container font-medium">
                              {company?.name ?? 'Pilih Perusahaan'}
                            </p>
                          </IonLabel>
                          <span slot="end"><ChevronRight className="h-4 w-4 text-slate-400" /></span>
                        </IonItem>

                        {/* Profil Pengaturan */}
                        <IonItem button detail={false} lines="full" onClick={() => go('/pengaturan')}>
                          <span slot="start"><Settings className="h-4 w-4 text-slate-600" /></span>
                          <IonLabel className="text-xs font-medium">Profil Pengaturan</IonLabel>
                        </IonItem>

                        {/* Log Out */}
                        <IonItem button detail={false} lines="none" onClick={handleLogout}>
                          <span slot="start"><LogOut className="h-4 w-4 text-alert-coral" /></span>
                          <IonLabel color="danger" className="text-xs font-medium">{t.common.logout}</IonLabel>
                        </IonItem>
                      </>
                    ) : (
                      <>
                        {/* Company Sub-View Header with Back Button */}
                        <IonItem button detail={false} lines="full" className="bg-slate-50/50" onClick={() => setProfileView('main')}>
                          <span slot="start"><ArrowLeft className="h-4 w-4 text-slate-700" /></span>
                          <IonLabel className="text-xs font-bold text-slate-heading">Kembali ke Profil</IonLabel>
                        </IonItem>

                        <IonItem lines="none" className="pt-2">
                          <IonLabel>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              {t.common.switchCompany}
                            </p>
                          </IonLabel>
                        </IonItem>

                        {/* Companies List */}
                        {companies.map((c) => (
                          <IonItem key={c.id} lines="full">
                            <span
                              onClick={() => {
                                switchTo(c.id);
                                setProfileView('main');
                              }}
                              className="flex items-center gap-2 flex-1 cursor-pointer py-1 min-w-0"
                            >
                              <Building2 className="h-4 w-4 text-slate-500 shrink-0" />
                              <span className={`truncate text-xs ${c.id === company?.id ? 'font-semibold text-primary-container' : 'text-slate-700'}`}>
                                {c.name}
                              </span>
                              {c.id === company?.id && (
                                <Check className="h-4 w-4 text-primary-container ml-1 shrink-0" />
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCompanyToDelete(c);
                              }}
                              className="p-1.5 text-slate-400 hover:text-alert-coral transition-colors shrink-0"
                              title="Hapus Perusahaan"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </IonItem>
                        ))}

                        {/* Add Company Link (Max 3) */}
                        {companies.length >= 3 ? (
                          <IonItem lines="none" className="opacity-60 cursor-not-allowed">
                            <span slot="start"><Plus className="h-4 w-4 text-slate-400" /></span>
                            <IonLabel className="text-xs font-medium text-slate-400">
                              {t.common.addCompany} <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">3/3 Maks</span>
                            </IonLabel>
                          </IonItem>
                        ) : (
                          <IonItem button detail={false} lines="none" onClick={() => { setProfileView('main'); go('/perusahaan/baru'); }}>
                            <span slot="start"><Plus className="h-4 w-4 text-primary-container" /></span>
                            <IonLabel color="primary" className="text-xs font-medium">{t.common.addCompany}</IonLabel>
                          </IonItem>
                        )}
                      </>
                    )}
                  </IonList>
                </IonContent>
              </IonPopover>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <div className="mx-auto w-full max-w-container-max space-y-8 py-2">{children}</div>
        </IonContent>

        {/* Mobile bottom navigation + Floating Speed Dials */}
        <div className="relative">
          {/* Backdrop Overlay */}
          <AnimatePresence>
            {activeMenu !== 'none' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMenu}
                className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px]"
              />
            )}
          </AnimatePresence>

          {/* 1. Tambah Floating Speed Dial */}
          <AnimatePresence>
            {activeMenu === 'add' && (
              <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.04 }}
                  onClick={() => {
                    closeMenu();
                    go('/pemasukan/baru');
                  }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ring-1 ring-slate-200/80 group-active:scale-95 transition-transform">
                    Pendapatan
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-4 ring-emerald-500/20 group-active:scale-95 transition-transform">
                    <ArrowDownCircle className="h-6 w-6" />
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => {
                    closeMenu();
                    go('/pengeluaran/baru');
                  }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ring-1 ring-slate-200/80 group-active:scale-95 transition-transform">
                    Pembayaran
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg ring-4 ring-rose-500/20 group-active:scale-95 transition-transform">
                    <ArrowUpCircle className="h-6 w-6" />
                  </div>
                </motion.button>
              </div>
            )}
          </AnimatePresence>

          {/* 2. Master Floating Speed Dial */}
          <AnimatePresence>
            {activeMenu === 'master' && (
              <div className="fixed bottom-20 left-[28%] -translate-x-1/2 z-50 flex flex-col items-start gap-3">
                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.04 }}
                  onClick={() => {
                    closeMenu();
                    go('/item');
                  }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-white shadow-lg ring-4 ring-primary-container/20 group-active:scale-95 transition-transform">
                    <Package className="h-6 w-6" />
                  </div>
                  <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ring-1 ring-slate-200/80 group-active:scale-95 transition-transform">
                    Item / Produk
                  </span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => {
                    closeMenu();
                    go('/akun');
                  }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white shadow-lg ring-4 ring-secondary/20 group-active:scale-95 transition-transform">
                    <ListTree className="h-6 w-6" />
                  </div>
                  <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ring-1 ring-slate-200/80 group-active:scale-95 transition-transform">
                    Akun (CoA)
                  </span>
                </motion.button>
              </div>
            )}
          </AnimatePresence>

          {/* 3. Transaksi Floating Speed Dial */}
          <AnimatePresence>
            {activeMenu === 'transaksi' && (
              <div className="fixed bottom-20 left-[72%] -translate-x-1/2 z-50 flex flex-col items-end gap-3">
                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.08 }}
                  onClick={() => {
                    closeMenu();
                    go('/pemasukan');
                  }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ring-1 ring-slate-200/80 group-active:scale-95 transition-transform">
                    Pemasukan
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-4 ring-emerald-500/20 group-active:scale-95 transition-transform">
                    <ArrowDownCircle className="h-6 w-6" />
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.04 }}
                  onClick={() => {
                    closeMenu();
                    go('/pengeluaran');
                  }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ring-1 ring-slate-200/80 group-active:scale-95 transition-transform">
                    Pengeluaran
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg ring-4 ring-rose-500/20 group-active:scale-95 transition-transform">
                    <ArrowUpCircle className="h-6 w-6" />
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.7 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => {
                    closeMenu();
                    go('/transaksi');
                  }}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ring-1 ring-slate-200/80 group-active:scale-95 transition-transform">
                    Semua Transaksi
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-container text-white shadow-lg ring-4 ring-primary-container/20 group-active:scale-95 transition-transform">
                    <ArrowLeftRight className="h-6 w-6" />
                  </div>
                </motion.button>
              </div>
            )}
          </AnimatePresence>

          <IonTabBar slot="bottom" className="app-tab-bar relative z-30">
            <IonTabButton
              tab="home"
              onClick={() => {
                closeMenu();
                go('/');
              }}
              className={isActive('/') ? 'tab-selected' : undefined}
            >
              <LayoutDashboard className="h-5 w-5" />
              <IonLabel>{t.nav.home}</IonLabel>
            </IonTabButton>

            {/* Master Data Button with Speed Dial */}
            <IonTabButton
              tab="master-data"
              onClick={() => toggleMenu('master')}
              className={isActive('/item') || isActive('/akun') ? 'tab-selected' : undefined}
            >
              <Boxes className="h-5 w-5" />
              <IonLabel>Master</IonLabel>
            </IonTabButton>

            {/* Action + Button (Prominent Floating FAB) */}
            <IonTabButton
              tab="add-action"
              onClick={() => toggleMenu('add')}
              className="overflow-visible"
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                <motion.div
                  animate={{ rotate: activeMenu === 'add' ? 45 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg shadow-primary-container/30 ring-2 ring-white transition-colors ${
                    activeMenu === 'add' ? 'bg-slate-800' : 'bg-primary-container'
                  }`}
                >
                  <Plus className="h-6 w-6" />
                </motion.div>
                <IonLabel className="text-[10px] font-bold text-primary-container mt-0.5">Tambah</IonLabel>
              </div>
            </IonTabButton>

            {/* Transaksi Button with Speed Dial */}
            <IonTabButton
              tab="transactions"
              onClick={() => toggleMenu('transaksi')}
              className={isActive('/transaksi') || isActive('/pemasukan') || isActive('/pengeluaran') ? 'tab-selected' : undefined}
            >
              <ArrowLeftRight className="h-5 w-5" />
              <IonLabel>{t.nav.transactions}</IonLabel>
            </IonTabButton>

            <IonTabButton
              tab="reports"
              onClick={() => {
                closeMenu();
                go('/laporan');
              }}
              className={isActive('/laporan') ? 'tab-selected' : undefined}
            >
              <BarChart3 className="h-5 w-5" />
              <IonLabel>{t.nav.reports}</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </div>
      </IonPage>

      {/* Danger Confirmation Alert for Company Deletion */}
      <IonAlert
        isOpen={!!companyToDelete}
        header={`Hapus "${companyToDelete?.name}"?`}
        subHeader="PERINGATAN BAHAYA"
        message={`Tindakan ini TIDAK DAPAT DIBATALKAN. Seluruh data transaksi, pelanggan, item, akun, dan laporan keuangan yang terhubung dengan perusahaan "${companyToDelete?.name}" akan dihapus secara permanen.`}
        buttons={[
          {
            text: 'Batal',
            role: 'cancel',
            handler: () => setCompanyToDelete(null),
          },
          {
            text: 'Hapus Permanen',
            role: 'destructive',
            cssClass: 'alert-button-danger',
            handler: async () => {
              if (companyToDelete) {
                try {
                  await deleteCompany.mutateAsync(companyToDelete.id);
                } catch (err) {
                  console.error('Delete company error:', err);
                  alert(err instanceof Error ? err.message : 'Gagal menghapus perusahaan');
                }
                setCompanyToDelete(null);
              }
            },
          },
        ]}
        onDidDismiss={() => setCompanyToDelete(null)}
      />
    </IonSplitPane>
  );
}
