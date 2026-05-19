import { BoltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useToast } from '../components/shared/ToastProvider';
import { useAuthStore } from '../store/authStore';
import type { ApiResponse, AuthUser } from '../types';

const nextPath = (role: AuthUser['role']) => {
  if (role === 'station_owner') return '/app/owner';
  if (role === 'admin') return '/app/admin';
  return '/app/user';
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await apiClient.post<ApiResponse<{ user: AuthUser }>>('/auth/login', form);
      setAuth(response.data.data);
      showToast('Welcome back. Session restored.', 'success');
      const destination = (location.state as { from?: string } | null)?.from;
      navigate(destination ?? nextPath(response.data.data.user.role), { replace: true });
    } catch {
      setError('Invalid credentials. Please check email and password.');
      showToast('Login failed. Try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[1fr_1.05fr]">
        <aside className="relative overflow-hidden bg-[linear-gradient(145deg,#052e2b,#0f766e)] p-8 text-white sm:p-10">
          <div className="absolute -left-16 top-24 h-56 w-56 rounded-full bg-emerald-300/30 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><BoltIcon className="h-5 w-5" /></div>
              <p className="font-display text-2xl font-semibold">GreenVolt Nexus</p>
            </div>
            <h1 className="mt-8 font-display text-4xl font-semibold">Enterprise EV charging, simplified.</h1>
            <p className="mt-4 text-emerald-100">Sign in to monitor bookings, stations, and energy operations from one secure workspace.</p>
            <div className="mt-8 space-y-3 text-sm text-emerald-100">
              <p className="flex items-center gap-2"><ShieldCheckIcon className="h-4 w-4" /> Session-based secure authentication</p>
              <p className="flex items-center gap-2"><ShieldCheckIcon className="h-4 w-4" /> Role-aware dashboard access</p>
              <p className="flex items-center gap-2"><ShieldCheckIcon className="h-4 w-4" /> Production-style UI workflows</p>
            </div>
          </div>
        </aside>

        <form className="p-8 sm:p-10" onSubmit={submit}>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Welcome back</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900">Sign in to continue</h2>
          <p className="mt-2 text-sm text-slate-500">Use your GreenVolt account credentials.</p>

          <div className="mt-8 space-y-5">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
            </div>
          </div>

          {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}

          <button type="submit" className="btn-primary mt-8 w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="mt-5 text-sm text-slate-500">
            New here? <Link to="/register" className="font-semibold text-slate-900">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
