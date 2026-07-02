import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hoverEffect = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[1.75rem] border border-[var(--line)] bg-[var(--panel)] text-[var(--paper)] shadow-[0_16px_40px_rgba(0,0,0,0.16)] backdrop-blur-sm',
        hoverEffect &&
          'transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:bg-[rgba(255,255,255,0.06)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

Card.displayName = "Card";

export { Card };
