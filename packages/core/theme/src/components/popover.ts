import { tv, VariantProps } from 'tailwind-variants';
import { ClassNames } from '../types';

export const popover = tv({
  slots: {
    content:
      'border border-muted-6 bg-muted-2 max-w-sm w-full rounded p-4 [--arrowFill:theme(colors.muted-9)]',
    title: 'text-lg font-semibold text-muted-11',
    description: 'mt-2 text-normal text-muted-11',
  },
  variants: {
    shadow: {
      none: { content: 'shadow-none' },
      sm: { content: 'shadow-sm' },
      md: { content: 'shadow-md' },
      lg: { content: 'shadow-lg' },
    },
  },
  defaultVariants: {
    shadow: 'md',
  },
});

export type PopoverVariantProps = VariantProps<typeof popover>;
export type PopoverClassNames = ClassNames<typeof popover.slots>;
