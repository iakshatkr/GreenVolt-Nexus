import { BoltIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useToast } from '../components/shared/ToastProvider';
import { useAuthStore } from '../store/authStore';
import type { ApiResponse, AuthUser } from '../types';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '', city: 'Jaipur', phone: '', role: 'user' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await apiClient.post<ApiResponse<{ user: AuthUser }>>('/auth/register', form);
      setAuth(response.data.data);
      showToast('Account created successfully.', 'success');
      navigate(form.role === 'station_owner' ? '/app/owner' : '/app/user', { replace: true });
    } catch {
      setError('Unable to create account right now.');
      showToast('Registration failed. Please retry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[1fr_1.05fr]">
        <aside className="bg-[linear-gradient(145deg,#0f172a,#0f766e)] p-8 text-white sm:p-10">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><BoltIcon className="h-5 w-5" /></div><p className="font-display text-2xl font-semibold">GreenVolt Nexus</p></div>
          <h1 className="mt-8 font-display text-4xl font-semibold">Build the future of EV charging.</h1>
          <p className="mt-4 text-emerald-100">Create your account as a user or station owner and access a premium operations experience.</p>
          <div className="mt-8 space-y-3 text-sm text-emerald-100">
            <p className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4" />Role-based onboarding</p>
            <p className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4" />Fast booking and payments</p>
            <p className="flex items-center gap-2"><CheckCircleIcon className="h-4 w-4" />Owner analytics and station tools</p>
          </div>
        </aside>

        <form className="p-8 sm:p-10" onSubmit={submit}>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Get started</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-slate-900">Create your account</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} required />
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))} required />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))} required />
            <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm((c) => ({ ...c, city: e.target.value }))} required />
            <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))} />
            <select className="input" value={form.role} onChange={(e) => setForm((c) => ({ ...c, role: e.target.value }))}>
              <option value="user">User</option>
              <option value="station_owner">Station Owner</option>
            </select>
          </div>

          {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p> : null}

          <button type="submit" className="btn-primary mt-6 w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>

          <p className="mt-5 text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-slate-900">Sign in</Link></p>
        </form>
      </div>
    </div>
  );
};
