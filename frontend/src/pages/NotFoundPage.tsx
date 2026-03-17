import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-hero-glow px-4">
    <div className="panel w-full max-w-xl p-10 text-center">
      <p className="text-xs uppercase tracking-[0.34em] text-brand-200">404</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 text-slate-400">The route you requested does not exist in GreenVolt Nexus.</p>
      <Link to="/" className="btn-primary mt-8">
        Return home
      </Link>
    </div>
  </div>
);
