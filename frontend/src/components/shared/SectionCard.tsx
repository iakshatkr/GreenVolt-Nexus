import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const SectionCard = ({ title, subtitle, action, children }: SectionCardProps) => (
  <section className="panel p-5 sm:p-6">
    <div className="mb-5 flex flex-col gap-3 border-b border-white/8 pb-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </section>
);
