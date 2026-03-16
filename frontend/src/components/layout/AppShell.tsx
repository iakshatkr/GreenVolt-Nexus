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
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="panel flex w-full flex-col gap-6 p-6 lg:w-80">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-100 p-3 text-brand-700">
              <BoltIcon className="h-7 w-7" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">GreenVolt Nexus</p>
              <p className="text-sm text-slate-500">Solar EV charging command center</p>
            </div>
          </div>

          <div className="rounded-3xl bg-night px-5 py-4 text-white">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-200">{user.role}</p>
            <p className="mt-2 text-xl font-semibold">{user.name}</p>
            <p className="text-sm text-slate-300">{user.email}</p>
            <p className="mt-1 text-sm text-slate-300">{user.city}</p>
          </div>

          <nav className="space-y-2">
            {linksByRole[user.role].map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                      isActive
                        ? 'bg-brand-600 text-white'
                        : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'
                    )
                  }
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <button type="button" className="btn-secondary mt-auto gap-2" onClick={logout}>
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Sign out
          </button>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

