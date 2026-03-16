interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
}

export const MetricCard = ({ label, value, hint }: MetricCardProps) => (
  <div className="panel p-5">
    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
    <p className="mt-4 font-display text-3xl font-bold text-night">{value}</p>
    <p className="mt-2 text-sm text-slate-500">{hint}</p>
  </div>
);

