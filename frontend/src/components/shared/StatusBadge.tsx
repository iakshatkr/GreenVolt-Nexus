import { cn } from '../../lib/utils';

const toneMap: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  rejected: 'bg-rose-100 text-rose-700',
  succeeded: 'bg-emerald-100 text-emerald-700',
  active: 'bg-sky-100 text-sky-700',
  completed: 'bg-slate-200 text-slate-700',
  cancelled: 'bg-rose-100 text-rose-700'
};

export const StatusBadge = ({ value }: { value: string }) => (
  <span
    className={cn(
      'inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize',
      toneMap[value] ?? 'bg-slate-100 text-slate-700'
    )}
  >
    {value.replace('_', ' ')}
  </span>
);

