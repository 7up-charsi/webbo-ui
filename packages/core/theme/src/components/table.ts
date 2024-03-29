import { tv, VariantProps } from 'tailwind-variants';
import { ClassNames } from '../types';

export const table = tv({
  slots: {
    table: '',
    thead: '',
    tbody: '',
    tr: 'h-10',
    th: 'px-3 text-muted-11 font-normal first-letter:uppercase',
    td: 'text-center text-muted-11',
  },
  variants: {
    variant: {
      strip: {
        tr: 'even:bg-muted-3 [thead>&]:bg-muted-3',
      },
      grid: {
        th: 'border border-muted-6',
        td: 'border border-muted-6',
      },
    },
  },
});

export type TableVariantProps = VariantProps<typeof table>;
export type TableClassNames = ClassNames<typeof table.slots>;
