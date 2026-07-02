import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(214,253,58,0.14)] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]',
  {
    variants: {
      variant: {
        primary:
          'border border-transparent bg-[var(--accent)] text-[var(--ink)] shadow-[0_18px_50px_rgba(214,253,58,0.16)] hover:-translate-y-px hover:bg-[#e2ff72]',
        secondary:
          'border border-[var(--line)] bg-[rgba(255,255,255,0.03)] text-[var(--paper)] hover:bg-[rgba(255,255,255,0.07)]',
        dark:
          'border border-[rgba(17,17,17,0.1)] bg-[var(--ink)] text-[var(--paper)] shadow-[0_18px_40px_rgba(17,17,17,0.18)] hover:bg-black',
        ghost: 'bg-transparent text-[var(--muted)] hover:bg-white/5 hover:text-[var(--paper)]',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-12 px-6 text-sm',
        xl: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button };
