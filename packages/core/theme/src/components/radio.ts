import { tv, VariantProps } from 'tailwind-variants';
import { groupDataFocusVisible } from '../classes';
import { ClassNames } from '../types';

export const radio = tv({
  slots: {
    base: 'inline-flex group',
    radio: [
      'rounded-full relative inline-flex items-center justify-center overflow-hidden transition-colors text-muted-11 [--rippleBg:theme(colors.muted-11/20%)] group-data-[hovered=true]:bg-muted-4',
      ...groupDataFocusVisible,
    ],
    nativeInput:
      'outline-none w-full h-full border-test opacity-0 absolute inset-0 cursor-pointer',
    label: 'cursor-pointer select-none',
  },
  variants: {
    color: {
      primary: {
        radio:
          'group-data-[selected=true]:text-primary-11 group-data-[selected=true]:[--rippleBg:theme(colors.primary-11/20%)] group-data-[selected=true]:group-data-[hovered=true]:bg-primary-4',
      },
      secondary: {
        radio:
          'group-data-[selected=true]:text-secondary-11 group-data-[selected=true]:[--rippleBg:theme(colors.secondary-11/20%)] group-data-[selected=true]:group-data-[hovered=true]:bg-secondary-4',
      },
      success: {
        radio:
          'group-data-[selected=true]:text-success-11 group-data-[selected=true]:[--rippleBg:theme(colors.success-11/20%)] group-data-[selected=true]:group-data-[hovered=true]:bg-success-4',
      },
      info: {
        radio:
          'group-data-[selected=true]:text-info-11 group-data-[selected=true]:[--rippleBg:theme(colors.info-11/20%)] group-data-[selected=true]:group-data-[hovered=true]:bg-info-4',
      },
      warning: {
        radio:
          'group-data-[selected=true]:text-warning-11 group-data-[selected=true]:[--rippleBg:theme(colors.warning-11/20%)] group-data-[selected=true]:group-data-[hovered=true]:bg-warning-4',
      },
      danger: {
        radio:
          'group-data-[selected=true]:text-danger-11 group-data-[selected=true]:[--rippleBg:theme(colors.danger-11/20%)] group-data-[selected=true]:group-data-[hovered=true]:bg-danger-4',
      },
    },
    size: {
      sm: { radio: 'min-w-[32px] min-h-[32px] w-8 h-8' },
      md: { radio: 'min-w-[40px] min-h-[40px] w-10 h-10' },
      lg: { radio: 'min-w-[48px] min-h-[48px] w-12 h-12' },
    },
    isDisabled: {
      true: {
        radio: 'disabled',
      },
    },
    labelPlacement: {
      top: { base: 'flex-col items-center', label: '-order-1' },
      bottom: { base: 'flex-col items-center', label: 'order-1' },
      left: { base: 'items-center', label: '-order-1' },
      right: { base: 'items-center', label: 'order-1' },
    },
  },
});

export type RadioVariantProps = VariantProps<typeof radio>;
export type RadioClassNames = ClassNames<typeof radio.slots>;
