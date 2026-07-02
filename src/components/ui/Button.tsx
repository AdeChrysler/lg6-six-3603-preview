import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]',
  {
    variants: {
      variant: {
        primary:
          'border border-transparent bg-gradient-to-r from-gold-500 to-gold-600 text-black shadow-lg shadow-gold-900/20 hover:from-gold-600 hover:to-gold-700',
        outline:
          'border border-gold-600/30 bg-transparent text-gold-300 hover:bg-gold-600/10 hover:text-gold-200',
        ghost: 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white',
        white: 'border border-black/10 bg-white text-black hover:bg-gray-100',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-9 px-3 text-sm',
        lg: 'h-12 px-8 text-base',
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
