import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.18em] transition-colors',
  {
    variants: {
      variant: {
        default: 'border-gold-500/20 bg-gold-500/10 text-gold-300',
        success: 'border-green-500/20 bg-green-500/10 text-green-300',
        warning: 'border-red-500/20 bg-red-500/10 text-red-300',
        outline: 'border-gray-700 bg-transparent text-gray-400',
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
