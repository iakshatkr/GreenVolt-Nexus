import { cn } from '../../lib/utils';

const toneMap: Record<string, string> = {
  approved: 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  pending: 'border border-amber-400/20 bg-amber-400/10 text-amber-200',
  rejected: 'border border-rose-400/20 bg-rose-400/10 text-rose-200',
  succeeded: 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  active: 'border border-sky-400/20 bg-sky-400/10 text-sky-200',
  completed: 'border border-slate-400/20 bg-slate-400/10 text-slate-200',
  cancelled: 'border border-rose-400/20 bg-rose-400/10 text-rose-200'
};

export const StatusBadge = ({ value }: { value: string }) => (
  <span
    className={cn(
      'inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize',
      toneMap[value] ?? 'border border-white/10 bg-white/[0.05] text-slate-300'
    )}
  >
    {value.replace('_', ' ')}
  </span>
);
