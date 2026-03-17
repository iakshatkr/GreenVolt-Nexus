import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import type { ApiResponse, AuthUser } from '../types';

const nextPath = (role: AuthUser['role']) => {
  if (role === 'station_owner') {
    return '/app/owner';
  }

  if (role === 'admin') {
    return '/app/admin';
  }

  return '/app/user';
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await apiClient.post<ApiResponse<{ user: AuthUser; token: string }>>('/auth/login', form);
      setAuth(response.data.data);
      const destination = (location.state as { from?: string } | null)?.from;
      navigate(destination ?? nextPath(response.data.data.user.role), { replace: true });
    } catch {
      setError('Unable to sign in. Check your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-glow px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel p-7 sm:p-9">
          <p className="eyebrow">Demo access</p>
          <h1 className="mt-6 font-display text-4xl font-semibold text-white">Sign in to GreenVolt Nexus.</h1>
          <p className="mt-4 text-base leading-7 text-slate-400">
            A simple dark sign-in screen with the demo accounts you can use right away.
          </p>
          <div className="mt-8 space-y-3">
            {[
              ['Admin', 'admin@greenvoltnexus.com / Admin@123'],
              ['Owner', 'owner@greenvoltnexus.com / Owner@123'],
              ['User', 'user@greenvoltnexus.com / User@123']
            ].map(([label, value]) => (
              <div key={label} className="panel-muted p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <form className="panel p-7 sm:p-9" onSubmit={submit}>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Welcome back</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-white">Sign in</h2>
          <p className="mt-2 text-sm text-slate-400">Use your GreenVolt Nexus account to continue.</p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

          <button type="submit" className="btn-primary mt-8 w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="mt-6 text-sm text-slate-400">
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-white">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
