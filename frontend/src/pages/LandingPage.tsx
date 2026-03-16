import {
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Live station discovery',
    description: 'Find solar-powered EV chargers by city, map location, connector type, and port capacity.',
    icon: MapPinIcon
  },
  {
    title: 'Booking + digital payments',
    description: 'Reserve charging slots, prevent double-booking conflicts, and complete payments with a Stripe-style mock flow.',
    icon: BoltIcon
  },
  {
    title: 'Energy intelligence',
    description: 'Track solar generation, delivered power, booking throughput, and carbon savings station by station.',
    icon: ChartBarIcon
  }
];

export const LandingPage = () => (
  <div className="min-h-screen bg-hero-glow">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="panel flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-600">GreenVolt Nexus</p>
          <h1 className="font-display text-2xl font-bold text-night">Solar-first EV charging management</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/login" className="btn-secondary">
            Sign in
          </Link>
          <Link to="/register" className="btn-primary">
            Launch platform
          </Link>
        </div>
      </header>

      <section className="grid gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full bg-brand-100 px-4 py-2 text-sm font-semibold text-brand-700">
            Production-grade MERN starter for solar EV infrastructure
          </p>
          <h2 className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-tight text-night">
            Discover, book, pay, and optimize every watt across your EV charging network.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            GreenVolt Nexus gives drivers a smooth booking experience, empowers station owners with analytics,
            and gives admins visibility into approvals, transactions, and energy performance.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="btn-primary gap-2">
              Create account
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link to="/login" className="btn-secondary">
              Explore demo
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="panel p-5">
              <p className="text-sm text-slate-500">Demo login</p>
              <p className="mt-2 font-semibold text-night">`admin@greenvoltnexus.com`</p>
            </div>
            <div className="panel p-5">
              <p className="text-sm text-slate-500">Owner login</p>
              <p className="mt-2 font-semibold text-night">`owner@greenvoltnexus.com`</p>
            </div>
            <div className="panel p-5">
              <p className="text-sm text-slate-500">User login</p>
              <p className="mt-2 font-semibold text-night">`user@greenvoltnexus.com`</p>
            </div>
          </div>
        </div>

        <div className="panel overflow-hidden p-3">
          <div className="rounded-[28px] bg-[linear-gradient(135deg,#082032,#115037)] p-8 text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-200">Platform snapshot</p>
            <div className="mt-8 grid gap-4">
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm text-slate-200">Stations ready for dispatch</p>
                <p className="mt-2 font-display text-4xl font-bold">24/7</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm text-slate-200">Solar utilization view</p>
                <p className="mt-2 font-display text-4xl font-bold">72%</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <p className="text-sm text-slate-200">Role-aware access control</p>
                <p className="mt-2 font-display text-4xl font-bold">3 Roles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 pb-12 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="panel p-6">
              <div className="inline-flex rounded-2xl bg-brand-100 p-3 text-brand-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-night">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  </div>
);

