import { tv, VariantProps } from 'tailwind-variants';
import { ClassNames } from '../types';

export const menu = tv({
  slots: {
    menu: 'min-w-[190px] bg-muted-2 border border-muted-4 rounded py-2 outline-none [--arrowFill:theme(colors.muted-9)]',
    item: 'px-2 py-[6px] mx-2 cursor-pointer text-sm select-none flex text-muted-11 outline-none data-[disabled=true]:cursor-default data-[disabled=true]:disabled data-[focused=true]:bg-muted-3 rounded relative overflow-hidden',
    itemIcon:
      'h-5 w-5 mr-2 overflow-hidden flex items-center justify-center text-base dynamic-icon',
    itemContent: 'grow flex items-center',
    label:
      'px-4 py-[6px] text-xs font-semibold text-muted-10 first-letter:uppercase',
    group: '',
    separator: 'h-px bg-muted-6 my-1',
  },
  variants: {
    shadow: {
      none: { menu: 'shadow-none' },
      sm: { menu: 'shadow-lg' },
      md: { menu: 'shadow-xl' },
      lg: { menu: 'shadow-2xl' },
    },
  },
});

export type MenuVariantProps = VariantProps<typeof menu>;
export type MenuClassNames = ClassNames<typeof menu.slots>;