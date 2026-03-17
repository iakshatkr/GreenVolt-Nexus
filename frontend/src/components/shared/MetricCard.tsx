interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
}

export const MetricCard = ({ label, value, hint }: MetricCardProps) => (
  <div className="panel relative overflow-hidden p-5">
    <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(26,226,142,0.65),transparent)]" />
    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
    <p className="mt-4 font-display text-3xl font-bold text-white">{value}</p>
    <p className="mt-2 text-sm text-slate-400">{hint}</p>
  </div>
);
