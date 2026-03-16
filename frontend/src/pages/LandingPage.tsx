import {
  ArrowRightIcon,
  BoltIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon
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

const proofStrip = [
  { label: 'Fast reservation flow', value: '2 taps' },
  { label: 'Solar-backed delivery', value: '72%' },
  { label: 'Role-aware operations', value: '3 portals' },
  { label: 'Booking conflict engine', value: '0 overlaps' }
];

const workflow = [
  {
    title: 'Discover the right station',
    description: 'Drivers search by city, compare live station cards, and scan mapped charging points instantly.',
    icon: MapPinIcon
  },
  {
    title: 'Reserve with confidence',
    description: 'Booking logic protects each charging port from double-booking before a payment ever goes through.',
    icon: ClockIcon
  },
  {
    title: 'Run the network with data',
    description: 'Owners and admins monitor solar output, payments, approvals, and station performance in one place.',
    icon: ShieldCheckIcon
  }
];

const highlights = [
  'Live map-based station discovery',
  'Slot booking with conflict prevention',
  'Mock Stripe checkout and invoice trail',
  'Station-owner analytics and approvals'
];

export const LandingPage = () => (
  <div className="landing-shell min-h-screen bg-hero-glow">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="panel relative flex flex-col gap-4 overflow-hidden px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="landing-orb absolute -left-10 top-1/2 h-28 w-28 -translate-y-1/2 opacity-40" />
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

      <section className="grid gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-16">
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-700 shadow-sm">
            <SparklesIcon className="h-4 w-4" />
            Production-grade MERN platform for solar EV infrastructure
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-slate-500">From discovery to energy intelligence</p>
          <h2 className="mt-4 max-w-4xl font-display text-5xl font-extrabold leading-[1.02] text-night md:text-6xl">
            Turn every charging stop into a premium solar-powered experience.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            GreenVolt Nexus helps EV drivers find high-quality charging stations, lets owners manage
            operations with confidence, and gives admins a clear operational pulse across the whole network.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register" className="btn-primary gap-2">
              Enter the platform
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link to="/login" className="btn-secondary">
              Explore demo
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-center gap-3 rounded-2xl bg-white/75 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-100"
              >
                <CheckBadgeIcon className="h-5 w-5 text-brand-600" />
                {highlight}
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="panel p-5">
              <p className="text-sm text-slate-500">Admin demo</p>
              <p className="mt-2 font-semibold text-night">admin@greenvoltnexus.com</p>
            </div>
            <div className="panel p-5">
              <p className="text-sm text-slate-500">Owner demo</p>
              <p className="mt-2 font-semibold text-night">owner@greenvoltnexus.com</p>
            </div>
            <div className="panel p-5">
              <p className="text-sm text-slate-500">User demo</p>
              <p className="mt-2 font-semibold text-night">user@greenvoltnexus.com</p>
            </div>
          </div>
        </div>

        <div className="panel landing-panel-glow overflow-hidden p-3">
          <div className="relative rounded-[28px] bg-[linear-gradient(150deg,#082032,#115037_55%,#1a7d59)] p-8 text-white">
            <div className="absolute right-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-brand-100">
              Live operations
            </div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-200">Platform snapshot</p>
            <div className="mt-8 grid gap-4">
              <div className="grid gap-4 md:grid-cols-[1fr_0.82fr]">
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm text-slate-200">Station discovery</p>
                  <p className="mt-2 font-display text-4xl font-bold">48 nearby</p>
                  <p className="mt-3 text-sm leading-6 text-slate-200">
                    Search by city, scan map markers, compare pricing, and move straight into booking.
                  </p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5">
                  <p className="text-sm text-slate-200">Solar utilization</p>
                  <p className="mt-2 font-display text-4xl font-bold">72%</p>
                  <p className="mt-3 text-sm text-slate-200">Live energy mix visibility across owned stations.</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-night/60 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-300">Today&apos;s booking funnel</p>
                    <p className="mt-2 font-display text-3xl font-bold">312 sessions</p>
                  </div>
                  <div className="rounded-2xl bg-brand-400/20 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.25em] text-brand-100">Approval queue</p>
                    <p className="mt-1 text-2xl font-bold">9 pending</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
                      <span>Discovery to booking</span>
                      <span>84%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[84%] rounded-full bg-brand-300" />
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-slate-200">
                      <span>Booking to payment</span>
                      <span>67%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[67%] rounded-full bg-sun" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {proofStrip.map((item) => (
                  <div key={item.label} className="rounded-3xl bg-white/10 p-5">
                    <p className="text-sm text-slate-200">{item.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 pb-8 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="panel p-6 transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="inline-flex rounded-2xl bg-brand-100 p-3 text-brand-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-night">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 py-8 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="panel overflow-hidden bg-night p-8 text-white">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-200">Why it stands out</p>
          <h3 className="mt-4 font-display text-4xl font-bold">
            Built to feel like a premium mobility network, not a generic admin dashboard.
          </h3>
          <p className="mt-4 text-slate-300">
            The experience is designed to speak to three audiences at once: drivers who need fast access,
            station owners who need operational clarity, and admins who need trust and control.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-brand-100">Driver promise</p>
              <p className="mt-2 text-2xl font-bold">Search. Reserve. Charge.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-brand-100">Operator promise</p>
              <p className="mt-2 text-2xl font-bold">Track every unit of power.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {workflow.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="panel group flex gap-5 p-6 transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Step 0{index + 1}</p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-night">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="pb-14 pt-6">
        <div className="panel overflow-hidden bg-[linear-gradient(120deg,#f3faf6,#ffffff_45%,#fff7ea)] p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-600">Ready to launch</p>
              <h3 className="mt-3 font-display text-4xl font-bold text-night">
                Put your EV charging experience on a sharper, cleaner grid.
              </h3>
              <p className="mt-4 max-w-2xl text-lg text-slate-600">
                Start with the demo accounts, explore every role, and turn the platform into your own deployable product.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary gap-2">
                Start building
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link to="/login" className="btn-secondary">
                Open demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);
