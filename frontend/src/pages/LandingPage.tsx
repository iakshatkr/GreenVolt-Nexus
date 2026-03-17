import { useEffect, useState } from 'react';
import { ArrowRightIcon, BoltIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { ApiResponse, IntegrationStatus } from '../types';

const featureCards = [
  {
    title: 'Driver booking',
    description: 'Users can find stations, reserve slots, and track payments.'
  },
  {
    title: 'Owner operations',
    description: 'Station owners can manage listings, bookings, and performance.'
  },
  {
    title: 'Admin control',
    description: 'Admins can review stations, users, and platform activity.'
  }
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
    <div className="landing-shell min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="panel flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500 text-black">
              <BoltIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">GreenVolt Nexus</p>
              <h1 className="font-display text-xl font-semibold text-white">Simple dark theme</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/login" className="btn-secondary">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary">
              Get started
            </Link>
          </div>
        </header>

        <section className="grid gap-6 py-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="eyebrow">Minimal product view</p>
            <h2 className="mt-6 max-w-3xl font-display text-4xl font-semibold text-white sm:text-5xl">
              Solar EV charging management in a clean, dark interface.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              This version removes the heavy blue glow and decorative effects, and keeps the product presentation simple, dark, and easier to scan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary gap-2">
                Open platform
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link to="/login" className="btn-secondary">
                Demo login
              </Link>
            </div>
          </div>

          <div className="panel p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">System status</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="panel-muted p-4">
                <p className="text-sm text-slate-400">API</p>
                <p className="mt-2 text-3xl font-semibold text-white">{integrationStatus?.api.status ?? 'waiting'}</p>
              </div>
              <div className="panel-muted p-4">
                <p className="text-sm text-slate-400">Database</p>
                <p className="mt-2 text-3xl font-semibold capitalize text-white">
                  {integrationStatus?.database.state ?? 'unknown'}
                </p>
              </div>
              <div className="panel-muted p-4">
                <p className="text-sm text-slate-400">Mode</p>
                <p className="mt-2 text-3xl font-semibold text-white">{integrationStatus?.database.mode ?? 'n/a'}</p>
              </div>
              <div className="panel-muted p-4">
                <p className="text-sm text-slate-400">Records</p>
                <p className="mt-2 text-3xl font-semibold text-white">{totalRecords(integrationStatus)}</p>
              </div>
            </div>
            {integrationError ? <p className="mt-4 text-sm text-amber-300">{integrationError}</p> : null}
          </div>
        </section>

        <section className="grid gap-4 pb-8 md:grid-cols-3">
          {featureCards.map((feature) => (
            <article key={feature.title} className="panel p-6">
              <h3 className="font-display text-2xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};
