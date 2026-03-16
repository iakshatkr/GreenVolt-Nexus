import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-hero-glow px-4">
    <div className="panel max-w-lg p-10 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-brand-600">404</p>
      <h1 className="mt-4 font-display text-4xl font-bold text-night">Page not found</h1>
      <p className="mt-3 text-slate-500">The route you requested does not exist in GreenVolt Nexus.</p>
      <Link to="/" className="btn-primary mt-8">
        Return home
      </Link>
    </div>
  </div>
);
