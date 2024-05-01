import { tv, VariantProps } from 'tailwind-variants';
import { ClassNames } from '../types';

export const alertDialog = tv({
  slots: {
    content:
      'fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50 flex flex-col max-w-xs w-full outline-none rounded p-4 bg-paper shadow-modal',
    title: 'text-lg font-semibold text-muted-11',
    description: 'mt-2 text-muted-11 text-sm',
    actions: 'flex gap-2 items-center justify-end mt-3',
  },
});

export type AlertDialogVariantProps = VariantProps<typeof alertDialog>;
export type AlertDialogClassNames = ClassNames<typeof alertDialog.slots>;
