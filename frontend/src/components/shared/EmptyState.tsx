import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="panel-muted flex min-h-48 flex-col items-center justify-center p-8 text-center">
    <p className="text-lg font-semibold text-slate-800">{title}</p>
    <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);
