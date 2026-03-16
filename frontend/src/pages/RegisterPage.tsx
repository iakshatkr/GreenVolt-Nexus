import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import type { ApiResponse, AuthUser } from '../types';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    city: 'Jaipur',
    phone: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await apiClient.post<
        ApiResponse<{ user: AuthUser; token: string }>
      >('/auth/register', form);
      setAuth(response.data.data);
      navigate(form.role === 'station_owner' ? '/app/owner' : '/app/user', { replace: true });
    } catch {
      setError('Unable to create your account right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-glow px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <form className="panel p-8" onSubmit={submit}>
          <h1 className="font-display text-4xl font-bold text-night">Create your GreenVolt Nexus account</h1>
          <p className="mt-3 text-sm text-slate-500">
            Choose whether you want to join as a driver or a station owner.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className="label">Full name</label>
              <input className="input" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
            </div>
            <div>
              <label className="label">City</label>
              <input className="input" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
                <option value="user">User</option>
                <option value="station_owner">Station Owner</option>
              </select>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

          <button type="submit" className="btn-primary mt-8 w-full" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </button>

          <p className="mt-6 text-sm text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-brand-700">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

