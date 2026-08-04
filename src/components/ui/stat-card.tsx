'use client';

import { IonCard, IonCardContent } from '@ionic/react';
import type { ReactNode } from 'react';

/** Ionic summary/metric card used across the module list pages. */
export function StatCard({
  icon,
  iconBg,
  label,
  value,
  note,
}: {
  icon: ReactNode;
  iconBg: string;
  label: string;
  value: string;
  note?: ReactNode;
}) {
  return (
    <IonCard className="m-0 h-full">
      <IonCardContent>
        <div className="mb-4 flex items-start justify-between">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
          {note}
        </div>
        <p className="mb-1 text-[11px] font-label-md uppercase tracking-wider text-slate-body opacity-70">{label}</p>
        <h3 className="text-metric-display font-metric-display text-slate-heading">{value}</h3>
      </IonCardContent>
    </IonCard>
  );
}
