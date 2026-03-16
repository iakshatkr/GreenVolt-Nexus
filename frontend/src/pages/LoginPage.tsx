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
      const response = await apiClient.post<
        ApiResponse<{ user: AuthUser; token: string }>
      >('/auth/login', form);
      setAuth(response.data.data);
      const destination = (location.state as { from?: string } | null)?.from;
      navigate(destination ?? nextPath(response.data.data.user.role), { replace: true });
    } catch (err) {
      setError('Unable to sign in. Check your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-glow px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        <div className="panel bg-[linear-gradient(135deg,#082032,#115037)] p-8 text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-200">Secure access</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Step into the energy command center.</h1>
          <p className="mt-4 text-slate-200">
            Log in as a driver, station owner, or admin to explore bookings, approvals, payments, and live solar metrics.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <p>User: `user@greenvoltnexus.com` / `User@123`</p>
            <p>Owner: `owner@greenvoltnexus.com` / `Owner@123`</p>
            <p>Admin: `admin@greenvoltnexus.com` / `Admin@123`</p>
          </div>
        </div>

        <form className="panel p-8" onSubmit={submit}>
          <h2 className="font-display text-3xl font-bold text-night">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Use your GreenVolt Nexus account to continue.</p>

          <div className="mt-6 space-y-5">
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

          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

          <button type="submit" className="btn-primary mt-8 w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="mt-6 text-sm text-slate-500">
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-brand-700">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

