import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary-400 text-white hover:bg-primary-300/80',
        secondary:
          'border-transparent bg-primary-400/20 text-white hover:bg-primary-300/30',
        destructive:
          'border-transparent bg-destructive text-red-500 hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={clsxm(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
