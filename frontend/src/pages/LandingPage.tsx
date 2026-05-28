import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRightIcon,
  BoltIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  CpuChipIcon,
  MapPinIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { ApiResponse, IntegrationStatus } from '../types';

const stats = [
  { label: 'Charging Stations', value: 50, suffix: '+' },
  { label: 'Bookings', value: 1000, suffix: '+' },
  { label: 'Uptime', value: 95, suffix: '%' },
  { label: 'Monitoring', value: 24, suffix: '/7' }
];

const features = [
  {
    icon: MapPinIcon,
    title: 'Station discovery',
    description: 'Locate nearby EV stations with real-time availability and route-aware access.'
  },
  {
    icon: CalendarDaysIcon,
    title: 'Smart booking',
    description: 'Reserve precise charging windows with conflict prevention and optimized slots.'
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics dashboard',
    description: 'Track bookings, utilization, revenue, and energy trends in one command view.'
  },
  {
    icon: CpuChipIcon,
    title: 'Energy monitoring',
    description: 'Measure delivered power, solar output, and operational efficiency continuously.'
  }
];

const ownerPoints = [
  'Booking lifecycle management',
  'Revenue and utilization analytics',
  'Operational visibility across stations',
  'Energy and performance insights'
];

const section = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65 }
  }
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const CinematicEVHero3D = lazy(() =>
  import('../components/landing/CinematicEVHero3D').then((module) => ({ default: module.CinematicEVHero3D }))
);

const AnimatedCount = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const step = Math.max(1, Math.floor(value / 28));
    const id = window.setInterval(() => {
      setCount((current) => {
        if (current + step >= value) {
          window.clearInterval(id);
          return value;
        }
        return current + step;
      });
    }, 35);

    return () => window.clearInterval(id);
  }, [value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export const LandingPage = () => {
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus | null>(null);
  const [typedTitle, setTypedTitle] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [heroDisperse, setHeroDisperse] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const heroTitle = 'GREENVOLT NEXUS';
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const smoothDisperse = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.3
  });

  useEffect(() => {
    apiClient
      .get<ApiResponse<IntegrationStatus>>('/system/status')
      .then((response) => setIntegrationStatus(response.data.data))
      .catch(() => setIntegrationStatus(null));
  }, []);

  useEffect(() => {
    const unsubscribe = smoothDisperse.on('change', (value) => {
      setHeroDisperse(Math.max(0, Math.min(1, value)));
    });

    return () => unsubscribe();
  }, [smoothDisperse]);

  useEffect(() => {
    let index = 0;
    let subtitleTimer: number | null = null;
    setTypedTitle('');
    setShowSubtitle(false);

    const id = window.setInterval(() => {
      index += 1;
      setTypedTitle(heroTitle.slice(0, index));
      if (index >= heroTitle.length) {
        window.clearInterval(id);
        subtitleTimer = window.setTimeout(() => setShowSubtitle(true), 140);
      }
    }, 85);

    return () => {
      window.clearInterval(id);
      if (subtitleTimer) {
        window.clearTimeout(subtitleTimer);
      }
    };
  }, []);

  const liveStatus = useMemo(() => integrationStatus?.api.status ?? 'standby', [integrationStatus]);

  return (
    <div className="min-h-screen">
      <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-[#04070d]">
                <div className="h-20 w-20 rounded-full border border-emerald-500/35 bg-emerald-400/10" />
              </div>
            }
          >
            <CinematicEVHero3D progress={heroDisperse} />
          </Suspense>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16),transparent_56%)]" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-center justify-between px-6 pb-10 pt-12 text-center sm:pb-14 sm:pt-16"
        >
          <div className="w-full">
            <h1 className="font-display text-[2rem] font-semibold tracking-[0.2em] text-emerald-200 sm:text-[2.8rem] lg:text-[3.8rem]">
              {typedTitle}
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="ml-1 inline-block text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.25)]"
              >
                |
              </motion.span>
            </h1>
          </div>

          <div className="h-[36vh] w-full sm:h-[40vh] lg:h-[44vh]" />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={showSubtitle ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.55 }}
            className="w-full"
          >
            <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
              smart EV charging infrastructure with clean energy intelligence, built for a calm and premium mobility future.
            </p>
            <div className="pointer-events-auto mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#metrics" className="btn-secondary min-w-[180px]">
                Explore Stations
              </a>
              <Link to="/register" className="btn-primary min-w-[180px] gap-2">
                Get Started
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">

        <motion.header
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={section}
          className="panel mb-8 px-6 py-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="brand-mark">
                <BoltIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">GreenVolt Nexus</p>
                <p className="text-sm text-slate-500">Premium EV charging SaaS</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-secondary">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </motion.header>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={section}
          className="panel relative overflow-hidden px-6 py-14 sm:px-10"
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.p variants={section} className="section-kicker">
                Enterprise EV orchestration
              </motion.p>
              <motion.h1 variants={section} className="mt-4 font-display text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
                Smart EV Charging Management Platform
              </motion.h1>
              <motion.p variants={section} className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
                Futuristic control for charging operations with seamless booking, fleet-grade monitoring, and elegant product experiences.
              </motion.p>
              <motion.div variants={section} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href="#metrics" className="btn-secondary">
                  Explore Stations
                </a>
                <Link to="/register" className="btn-primary gap-2">
                  Get Started
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={section} className="panel-muted relative p-5">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-600">Live command center</p>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    {liveStatus}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="panel-muted p-3"><p className="text-xs text-slate-500">Bookings today</p><p className="mt-1 text-xl font-semibold text-slate-900">148</p></div>
                  <div className="panel-muted p-3"><p className="text-xs text-slate-500">Active stations</p><p className="mt-1 text-xl font-semibold text-slate-900">42</p></div>
                  <div className="panel-muted p-3"><p className="text-xs text-slate-500">Energy delivered</p><p className="mt-1 text-xl font-semibold text-slate-900">2.8 MWh</p></div>
                  <div className="panel-muted p-3"><p className="text-xs text-slate-500">Queue latency</p><p className="mt-1 text-xl font-semibold text-slate-900">28 ms</p></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="metrics"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((item) => (
            <motion.article key={item.label} variants={section} whileHover={{ y: -4 }} className="panel p-5 transition">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
              <p className="mt-3 font-display text-4xl font-semibold text-slate-900">
                <AnimatedCount value={item.value} suffix={item.suffix} />
              </p>
            </motion.article>
          ))}
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={section}
          className="mt-14"
        >
          <p className="section-kicker">Features</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-slate-900">Modern EV intelligence for every workflow.</h2>
          <motion.div variants={stagger} className="mt-6 grid gap-4 md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  variants={section}
                  whileHover={{ y: -5 }}
                  className="panel group p-6 transition"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300 transition group-hover:bg-emerald-500/25">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-slate-500">{feature.description}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
          className="mt-14"
        >
          <p className="section-kicker">How it works</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {['Find station', 'Book slot', 'Start charging'].map((step, index) => (
              <motion.article key={step} variants={section} className="panel relative p-5">
                <div className="absolute right-4 top-4 text-xs text-slate-500">0{index + 1}</div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Step {index + 1}</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">{step}</h3>
                <p className="mt-2 text-slate-500">A clean, intuitive charging journey with minimal friction.</p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <motion.article variants={section} className="panel p-7">
            <p className="section-kicker">For Station Owners</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-slate-900">Scale your charging network with operational clarity.</h2>
            <ul className="mt-5 space-y-2 text-slate-500">
              {ownerPoints.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <SparklesIcon className="h-4 w-4 text-emerald-300" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article variants={section} className="panel p-7">
            <p className="section-kicker">Pricing</p>
            <div className="mt-4 space-y-4">
              <motion.div whileHover={{ y: -3 }} className="panel-muted p-4">
                <p className="text-sm text-slate-500">Free</p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">$0/mo</p>
                <p className="mt-1 text-sm text-slate-500">Basic station discovery and booking workflows.</p>
              </motion.div>
              <motion.div whileHover={{ y: -3 }} className="panel-muted border-emerald-500/30 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-300">Pro</p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">$29/mo</p>
                <p className="mt-1 text-sm text-slate-500">Analytics suite, operations insights, and advanced controls.</p>
              </motion.div>
            </div>
          </motion.article>
        </motion.section>

        <motion.footer
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={section}
          className="mt-14 border-t border-slate-200 py-8"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-slate-500">
              <SparklesIcon className="h-4 w-4" /> GreenVolt Nexus
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <a href="#metrics">Metrics</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
              <a href="#">Support</a>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};
