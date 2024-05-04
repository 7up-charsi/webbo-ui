import { tv, VariantProps } from 'tailwind-variants';
import { ClassNames } from '../types';

export const drawer = tv({
  slots: {
    content:
      'fixed z-50 w-[300px] bg-paper outline-none overflow-hidden shadow-modal',
    title: 'text-lg font-semibold text-muted-11 mb-2',
    description: 'text-normal text-muted-11',
  },
  variants: {
    placement: {
      left: { content: 'top-0 left-0 h-full' },
      right: { content: 'top-0 right-0 h-full' },
      top: { content: 'top-0 left-0 w-full' },
      bottom: { content: 'bottom-0 left-0 w-full' },
    },
  },
});

export type DrawerVariantProps = VariantProps<typeof drawer>;
export type DrawerClassNames = ClassNames<typeof drawer.slots>;