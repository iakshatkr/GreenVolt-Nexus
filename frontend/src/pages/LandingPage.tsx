import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRightIcon,
  BoltIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CommandLineIcon,
  MapPinIcon,
  SignalIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { ApiResponse, IntegrationStatus } from '../types';

const counters = [
  { label: 'Charging Stations', value: 50, suffix: '+' },
  { label: 'Bookings', value: 1000, suffix: '+' },
  { label: 'System Uptime', value: 95, suffix: '%' },
  { label: 'Smart Monitoring', value: 24, suffix: '/7' }
];

const features = [
  { icon: MapPinIcon, title: 'Real-time station discovery', copy: 'Locate available EV stations instantly with live location intelligence.' },
  { icon: CalendarDaysIcon, title: 'Slot booking', copy: 'Reserve charging windows with conflict-free scheduling.' },
  { icon: ChartBarIcon, title: 'Energy analytics', copy: 'Track charging trends, utilization, and sustainability impact.' },
  { icon: CommandLineIcon, title: 'Smart management dashboard', copy: 'Control owners, users, stations, and operations from one panel.' }
];

const AnimatedCount = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const step = Math.max(1, Math.floor(value / 24));
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c + step >= value) {
          window.clearInterval(id);
          return value;
        }
        return c + step;
      });
    }, 35);
    return () => window.clearInterval(id);
  }, [value]);
  return <span>{count}{suffix}</span>;
};

export const LandingPage = () => {
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus | null>(null);

  useEffect(() => {
    apiClient
      .get<ApiResponse<IntegrationStatus>>('/system/status')
      .then((response) => setIntegrationStatus(response.data.data))
      .catch(() => setIntegrationStatus(null));
  }, []);

  const statusText = useMemo(() => integrationStatus?.api.status ?? 'standby', [integrationStatus]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="panel mb-6 px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="brand-mark"><BoltIcon className="h-4 w-4" /></div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">GreenVolt Nexus</p>
                <p className="text-sm font-medium text-slate-800">Premium EV charging operations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-secondary">Sign in</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
          </div>
        </header>

        <section className="panel relative overflow-hidden px-6 py-12 sm:px-10">
          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-blue-200/50 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <p className="section-kicker">Enterprise EV orchestration</p>
              <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">Smart EV Charging Management Platform</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Run charging operations with real-time station visibility, booking intelligence, and analytics crafted for modern energy teams.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#metrics" className="btn-secondary">Explore Stations</a>
                <Link to="/register" className="btn-primary gap-2">Get Started <ArrowRightIcon className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="panel-muted p-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">Live Control Center</p>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{statusText}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="panel-muted p-3"><p className="text-xs text-slate-500">Bookings today</p><p className="mt-1 text-xl font-semibold text-slate-900">148</p></div>
                  <div className="panel-muted p-3"><p className="text-xs text-slate-500">Active stations</p><p className="mt-1 text-xl font-semibold text-slate-900">42</p></div>
                  <div className="panel-muted p-3"><p className="text-xs text-slate-500">Energy delivered</p><p className="mt-1 text-xl font-semibold text-slate-900">2.8 MWh</p></div>
                  <div className="panel-muted p-3"><p className="text-xs text-slate-500">Queue latency</p><p className="mt-1 text-xl font-semibold text-slate-900">28 ms</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="metrics" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {counters.map((item) => (
            <div key={item.label} className="panel p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
              <p className="mt-3 font-display text-4xl font-bold text-slate-900"><AnimatedCount value={item.value} suffix={item.suffix} /></p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <div className="mb-5">
            <p className="section-kicker">Core features</p>
            <h2 className="section-title">Built for drivers, operators, and energy teams.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="panel group p-6 transition hover:-translate-y-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-slate-600">{feature.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 grid gap-4 lg:grid-cols-3">
          {['Find station', 'Book slot', 'Start charging'].map((step, index) => (
            <div key={step} className="panel p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Step {index + 1}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{step}</p>
              <p className="mt-2 text-slate-600">Fast, intuitive flow optimized for repeat usage.</p>
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel p-7">
            <p className="section-kicker">For station owners</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-slate-900">Operate charging business with confidence.</h2>
            <ul className="mt-5 space-y-2 text-slate-600">
              <li>Booking management and queue visibility</li>
              <li>Revenue and utilization analytics</li>
              <li>Energy insights and operational monitoring</li>
              <li>Approval workflows and role controls</li>
            </ul>
          </div>
          <div className="panel p-7">
            <p className="section-kicker">Pricing</p>
            <div className="mt-4 space-y-4">
              <div className="panel-muted p-4"><p className="text-sm text-slate-500">Free</p><p className="mt-1 text-2xl font-semibold text-slate-900">$0/mo</p><p className="mt-1 text-sm text-slate-600">Basic station discovery and booking</p></div>
              <div className="panel-muted border-emerald-200 bg-emerald-50/60 p-4"><p className="text-sm text-emerald-700">Pro</p><p className="mt-1 text-2xl font-semibold text-slate-900">$29/mo</p><p className="mt-1 text-sm text-slate-600">Advanced analytics and operations suite</p></div>
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-slate-600"><SparklesIcon className="h-4 w-4" /> GreenVolt Nexus</div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a href="#metrics">Metrics</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
              <a href="#">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
