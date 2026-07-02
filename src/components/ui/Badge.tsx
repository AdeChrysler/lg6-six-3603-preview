import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.18em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[var(--line-strong)] bg-[rgba(214,253,58,0.08)] text-[var(--accent)]',
        success: 'border-[var(--line-strong)] bg-[rgba(214,253,58,0.08)] text-[var(--accent)]',
        warning: 'border-[var(--line)] bg-[rgba(255,255,255,0.03)] text-[var(--paper)]',
        outline: 'border-[var(--line)] bg-transparent text-[var(--muted)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge: React.FC<BadgeProps> = ({ className, variant, children, ...props }) => (
  <div className={cn(badgeVariants({ variant }), className)} {...props}>
    {children}
  </div>
);

export { Badge };
