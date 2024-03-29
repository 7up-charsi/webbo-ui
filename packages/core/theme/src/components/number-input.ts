import { VariantProps, tv } from 'tailwind-variants';
import { ClassNames } from '../types';

export const numberInput = tv({
  slots: {
    base: 'h-7 w-6 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 group-data-[focused=true]:opacity-100 group-focus-visible:opacity-100 transition-opacity',
    button: 'min-w-0 min-h-0 px-0 w-full grow cursor-pointer',
    icon: 'text-xs',
  },
});

export type NumberInputVariantProps = VariantProps<typeof numberInput>;
export type NumberInputClassNames = ClassNames<typeof numberInput.slots>;
