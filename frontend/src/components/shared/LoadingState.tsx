export const LoadingState = ({ label = 'Loading...' }: { label?: string }) => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="panel w-full max-w-md p-8 text-center">
      <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(15,157,119,0.92),rgba(15,157,119,0.14))]" />
      <p className="font-display text-2xl font-semibold text-slate-900">GreenVolt Nexus</p>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
  </div>
);
