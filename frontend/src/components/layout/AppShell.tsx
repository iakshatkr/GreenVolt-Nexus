import {
  ArrowLeftOnRectangleIcon,
  BoltIcon,
  BuildingStorefrontIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useToast } from '../shared/ToastProvider';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

const linksByRole = {
  user: [{ to: '/app/user', label: 'User Dashboard', icon: HomeIcon }],
  station_owner: [{ to: '/app/owner', label: 'Owner Studio', icon: BuildingStorefrontIcon }],
  admin: [
    { to: '/app/user', label: 'User View', icon: HomeIcon },
    { to: '/app/owner', label: 'Owner View', icon: BuildingStorefrontIcon },
    { to: '/app/admin', label: 'Admin Panel', icon: ShieldCheckIcon }
  ]
};

export const AppShell = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const { showToast } = useToast();
  const location = useLocation();

  if (!user) {
    return null;
  }

  const signOut = async () => {
    try {
      await apiClient.post('/auth/logout');
      showToast('Signed out successfully.', 'success');
    } catch {
      showToast('Signed out locally.', 'info');
    } finally {
      logout();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
            <div className="brand-mark">
              <BoltIcon className="h-4 w-4" />
            </div>
            <p className="font-display text-lg font-semibold text-slate-900">GreenVolt Nexus</p>
          </div>
          <button className="btn-secondary !px-3 !py-2" type="button" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_1fr] lg:items-start">
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className={cn('panel lg:sticky lg:top-4', menuOpen ? 'block' : 'hidden lg:block')}
          >
            <div className="border-b border-white/8 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500 text-black">
                  <BoltIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-slate-900">GreenVolt Nexus</p>
                  <p className="text-sm text-slate-500">Dashboard</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="panel-muted px-4 py-4 text-slate-900">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{user.role.replace('_', ' ')}</p>
                <p className="mt-2 text-lg font-semibold">{user.name}</p>
                <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                <p className="mt-1 text-sm text-slate-500">{user.city}</p>
              </div>

              <nav className="mt-5 flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
                {linksByRole[user.role].map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'flex min-w-max items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition lg:min-w-0',
                          'hover:scale-[1.01] active:scale-[0.99]',
                          isActive
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50'
                        )
                      }
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <button type="button" className="btn-secondary mt-5 w-full gap-2" onClick={() => void signOut()}>
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                Sign out
              </button>
            </div>
          </motion.aside>

          <main className="min-w-0">
            <header className="panel mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className="input pl-9" placeholder="Search stations, bookings, users..." />
              </div>
              <div className="flex items-center gap-3">
                <button className="btn-secondary !px-3 !py-2" type="button" aria-label="Notifications">
                  <BellIcon className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                    {user.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-800">{user.name}</p>
                  </div>
                </div>
              </div>
            </header>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};
