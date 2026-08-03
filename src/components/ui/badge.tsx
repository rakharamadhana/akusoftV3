import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Status pills per DESIGN.md §Status Pills: high-chroma text on pastel bg, full-rounded.
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-[10px] font-label-md font-bold',
  {
    variants: {
      variant: {
        paid: 'bg-pill-mint-bg text-secondary', // LUNAS
        overdue: 'bg-pill-rose-bg text-alert-coral', // JATUH TEMPO
        pending: 'bg-pill-amber-bg text-[#D97706]', // PENDING
        info: 'bg-pill-indigo-bg text-tertiary', // neutral/info
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
