import { useEffect, useState } from 'react';
import {
  ArrowRightIcon,
  BoltIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  SignalIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { ApiResponse, IntegrationStatus } from '../types';

const heroImage =
  'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?auto=format&fit=crop&w=1200&q=80';
const stationImage =
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80';
const driverImage =
  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80';
const ownerImage =
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80';
const appImage =
  'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=900&q=80';

const services = [
  {
    title: 'Smart booking for drivers',
    description: 'Reserve the right charger faster with live availability, route-aware timing, and simple payments.',
    image: driverImage,
    icon: SparklesIcon
  },
  {
    title: 'Operational tools for owners',
    description: 'Manage station utilization, performance, and charging demand from one cleaner workflow.',
    image: ownerImage,
    icon: BuildingOffice2Icon
  },
  {
    title: 'Connected energy network',
    description: 'Blend charging convenience with solar-backed efficiency to make every station feel future-ready.',
    image: stationImage,
    icon: BoltIcon
  }
];

const trustItems = [
  { label: 'Stations live', value: '500+' },
  { label: 'Monthly sessions', value: '32k' },
  { label: 'Average uptime', value: '99.2%' }
];

const totalRecords = (status: IntegrationStatus | null) => {
  if (!status) {
    return 0;
  }

  return Object.values(status.database.collections).reduce((sum, value) => sum + value, 0);
};

export const LandingPage = () => {
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus | null>(null);
  const [integrationError, setIntegrationError] = useState('');

  useEffect(() => {
    let active = true;

    apiClient
      .get<ApiResponse<IntegrationStatus>>('/system/status')
      .then((response) => {
        if (!active) {
          return;
        }

        setIntegrationStatus(response.data.data);
        setIntegrationError('');
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setIntegrationError('Backend status is not reachable right now.');
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="landing-shell landing-light min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="landing-nav">
          <div className="flex items-center gap-3">
            <div className="brand-mark">
              <BoltIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">GreenVolt Nexus</p>
              <p className="text-sm font-medium text-slate-800">EV charging network</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 lg:flex">
            <a href="#stations" className="hover:text-slate-900">
              Stations
            </a>
            <a href="#services" className="hover:text-slate-900">
              Services
            </a>
            <a href="#app" className="hover:text-slate-900">
              App
            </a>
          </nav>
          <div className="flex gap-3">
            <Link to="/login" className="btn-secondary">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary">
              Start Charging
            </Link>
          </div>
        </header>

        <section className="hero-minimal">
          <div className="section-fade">
            <p className="section-kicker">Eco-friendly EV charging network</p>
            <h1 className="hero-title">Powering the Future of EV Charging</h1>
            <p className="hero-copy">
              GreenVolt Nexus helps drivers find, book, and optimize charging sessions while giving station owners a
              simpler way to run modern energy infrastructure.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary gap-2">
                Start Charging
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a href="#stations" className="btn-secondary">
                Explore Stations
              </a>
            </div>
          </div>

          <div className="section-fade">
            <div
              className="editorial-image editorial-hero"
              style={{ backgroundImage: `linear-gradient(rgba(18, 24, 38, 0.06), rgba(18, 24, 38, 0.08)), url(${heroImage})` }}
            />
          </div>
        </section>

        <section className="trust-minimal section-fade">
          {trustItems.map((item) => (
            <div key={item.label} className="trust-item">
              <p className="trust-value">{item.value}</p>
              <p className="trust-label">{item.label}</p>
            </div>
          ))}
        </section>

        <section id="stations" className="station-section">
          <div className="section-fade">
            <p className="section-kicker">Charging station locations</p>
            <h2 className="section-title">Find convenient solar-powered charging stations across the city.</h2>
            <p className="section-copy">
              A quieter interface, clearer map cues, and better spacing make the platform feel more premium and easier
              to trust instantly.
            </p>
            <div
              className="editorial-image station-image mt-8"
              style={{ backgroundImage: `linear-gradient(rgba(27, 37, 54, 0.08), rgba(27, 37, 54, 0.1)), url(${stationImage})` }}
            />
          </div>

          <div className="section-fade compact-map-card">
            <div className="mini-map-shell">
              <div className="mini-map">
                <div className="map-road map-road-a" />
                <div className="map-road map-road-b" />
                <div className="map-road map-road-c" />
                <div className="map-pin map-pin-main" />
                <div className="map-pin map-pin-secondary" />
                <div className="map-pin map-pin-third" />
              </div>
              <div className="map-overlay-card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Nexus Prime Hub</p>
                    <p className="mt-1 text-sm text-slate-500">Jaipur, Rajasthan</p>
                  </div>
                  <MapPinIcon className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">Fast charge</span>
                  <span>2.4 km away</span>
                </div>
              </div>
            </div>

            <div className="status-stack">
              <div className="status-card-light">
                <SignalIcon className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{integrationStatus?.api.status ?? 'waiting'}</p>
                  <p className="text-sm text-slate-500">API status</p>
                </div>
              </div>
              <div className="status-card-light">
                <BoltIcon className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{integrationStatus?.database.state ?? 'unknown'}</p>
                  <p className="text-sm text-slate-500">Database state</p>
                </div>
              </div>
              <div className="status-card-light">
                <SparklesIcon className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{totalRecords(integrationStatus)}</p>
                  <p className="text-sm text-slate-500">Records tracked</p>
                </div>
              </div>
            </div>

            {integrationError ? <p className="mt-4 text-sm text-amber-700">{integrationError}</p> : null}
          </div>
        </section>

        <section id="services" className="services-section">
          <div className="section-heading-center section-fade">
            <p className="section-kicker text-emerald-700">Our services</p>
            <h2 className="section-title">Sustainable energy solutions</h2>
          </div>

          <div className="services-grid">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <article key={service.title} className={`service-card section-fade delay-${(index % 3) + 1}`}>
                  <div
                    className="service-image"
                    style={{
                      backgroundImage: `linear-gradient(rgba(24, 32, 48, 0.06), rgba(24, 32, 48, 0.1)), url(${service.image})`
                    }}
                  />
                  <div className="service-body">
                    <div className="service-icon">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-copy">{service.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="app" className="app-section">
          <div className="section-fade">
            <p className="section-kicker">Mobile app preview</p>
            <h2 className="section-title">A cleaner charging journey on mobile.</h2>
            <p className="section-copy">
              The app surface is intentionally quiet, with simple booking actions, calmer information density, and more
              breathing room around every key decision.
            </p>
            <div className="mt-8 space-y-4">
              <div className="soft-row">Smart slot booking with live station visibility</div>
              <div className="soft-row">Simple payments and charging session history</div>
              <div className="soft-row">Energy-aware recommendations for better utilization</div>
            </div>
          </div>

          <div className="section-fade app-preview-light">
            <div className="app-frame-light">
              <div
                className="app-preview-image"
                style={{ backgroundImage: `linear-gradient(rgba(24, 32, 48, 0.1), rgba(24, 32, 48, 0.08)), url(${appImage})` }}
              />
              <div className="app-preview-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">GreenVolt App</p>
                    <p className="text-sm text-slate-500">Next slot at 6:30 PM</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Live
                  </span>
                </div>
                <div className="mt-5 rounded-[20px] bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Recommended station</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">Civil Lines Solar Hub</p>
                  <p className="mt-1 text-sm text-slate-500">12 min away • 4 ports available</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
