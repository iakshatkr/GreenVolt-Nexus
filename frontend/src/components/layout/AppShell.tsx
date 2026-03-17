import {
  ArrowLeftOnRectangleIcon,
  BoltIcon,
  BuildingStorefrontIcon,
  HomeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { NavLink, Outlet } from 'react-router-dom';
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-hero-glow">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[280px_1fr] lg:items-start">
          <aside className="panel lg:sticky lg:top-4">
            <div className="border-b border-white/8 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500 text-black">
                  <BoltIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold text-white">GreenVolt Nexus</p>
                  <p className="text-sm text-slate-400">Dashboard</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="panel-muted px-4 py-4 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{user.role.replace('_', ' ')}</p>
                <p className="mt-2 text-lg font-semibold">{user.name}</p>
                <p className="mt-1 text-sm text-slate-400">{user.email}</p>
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
                          isActive
                            ? 'border-white/12 bg-white/10 text-white'
                            : 'border-white/8 bg-transparent text-slate-300 hover:bg-white/5'
                        )
                      }
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <button type="button" className="btn-secondary mt-5 w-full gap-2" onClick={logout}>
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                Sign out
              </button>
            </div>
          </aside>

          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
