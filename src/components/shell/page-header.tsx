import type { ReactNode } from 'react';

/** Shared page header: title + subtitle on the left, actions on the right. */
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h2 className="text-headline-lg font-headline-lg text-slate-heading">{title}</h2>
        {subtitle && <p className="text-body-md font-body-md text-slate-body">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </section>
  );
}
