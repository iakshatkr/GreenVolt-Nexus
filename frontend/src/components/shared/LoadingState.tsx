export const LoadingState = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-hero-glow px-4">
    <div className="panel w-full max-w-md p-8 text-center">
      <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-full bg-brand-100" />
      <p className="font-display text-2xl font-bold text-night">GreenVolt Nexus</p>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
  </div>
);

