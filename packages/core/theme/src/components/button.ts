import { VariantProps, tv } from 'tailwind-variants';
import { dataFocusVisible } from '../classes';

export const button = tv({
  base: [
    'z-0 group relative inline-flex items-center justify-center box-border rounded appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent transition-colors outline-none',
    ...dataFocusVisible,
  ],
  variants: {
    variant: {
      solid: '',
      flat: '',
      shadow: 'shadow-lg',
      border: 'border bg-transparent',
      text: 'bg-transparent',
    },
    color: {
      neutral: '',
      primary: '',
      secondary: '',
      success: '',
      info: '',
      warning: '',
      danger: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    fullWidth: {
      true: 'w-full',
    },
    isDisabled: {
      true: 'disabled',
    },
    isIconOnly: {
      true: '[&>svg]:pointer-events-none rounded-full',
    },
  },
  compoundVariants: [
    {
      isIconOnly: false,
      size: 'sm',
      className: 'px-3 h-8 min-w-[64px] text-sm gap-2',
    },
    {
      isIconOnly: false,
      size: 'md',
      className: 'px-4 h-10 min-w-[80px] gap-2',
    },
    {
      isIconOnly: false,
      size: 'lg',
      className: 'px-6 h-12 min-w-[96px] text-lg gap-3',
    },

    // isIconOnly
    {
      isIconOnly: true,
      size: 'sm',
      class: 'w-8 h-8',
    },
    {
      isIconOnly: true,
      size: 'md',
      class: 'w-10 h-10',
    },
    {
      isIconOnly: true,
      size: 'lg',
      class: 'w-12 h-12',
    },

    // color / solid
    {
      variant: 'solid',
      color: 'neutral',
      class:
        'bg-neutral text-neutral-foreground [--rippleBg:theme(colors.neutral-foreground/30%)]',
    },
    {
      variant: 'solid',
      color: 'primary',
      class:
        'bg-primary text-primary-foreground [--rippleBg:theme(colors.primary-foreground/30%)]',
    },
    {
      variant: 'solid',
      color: 'secondary',
      class:
        'bg-secondary text-secondary-foreground [--rippleBg:theme(colors.secondary-foreground/30%)]',
    },
    {
      variant: 'solid',
      color: 'success',
      class:
        'bg-success text-success-foreground [--rippleBg:theme(colors.success-foreground/30%)]',
    },
    {
      variant: 'solid',
      color: 'info',
      class:
        'bg-info text-info-foreground [--rippleBg:theme(colors.info-foreground/30%)]',
    },
    {
      variant: 'solid',
      color: 'warning',
      class:
        'bg-warning text-warning-foreground [--rippleBg:theme(colors.warning-foreground/30%)]',
    },
    {
      variant: 'solid',
      color: 'danger',
      class:
        'bg-danger text-danger-foreground [--rippleBg:theme(colors.danger-foreground/40%)]',
    },

    // color / shadow
    {
      variant: 'shadow',
      color: 'neutral',
      class:
        'bg-neutral text-neutral-foreground [--rippleBg:theme(colors.neutral-foreground/30%)] shadow-neutral-400/80',
    },
    {
      variant: 'shadow',
      color: 'primary',
      class:
        'bg-primary text-primary-foreground [--rippleBg:theme(colors.primary-foreground/30%)] shadow-primary-400/80',
    },
    {
      variant: 'shadow',
      color: 'secondary',
      class:
        'bg-secondary text-secondary-foreground [--rippleBg:theme(colors.secondary-foreground/30%)] shadow-secondary-400/80',
    },
    {
      variant: 'shadow',
      color: 'success',
      class:
        'bg-success text-success-foreground [--rippleBg:theme(colors.success-foreground/30%)] shadow-success-400/80',
    },
    {
      variant: 'shadow',
      color: 'info',
      class:
        'bg-info text-info-foreground [--rippleBg:theme(colors.info-foreground/30%)] shadow-info-400/80',
    },
    {
      variant: 'shadow',
      color: 'warning',
      class:
        'bg-warning text-warning-foreground [--rippleBg:theme(colors.warning-foreground/30%)] shadow-warning-400/80',
    },
    {
      variant: 'shadow',
      color: 'danger',
      class:
        'bg-danger text-danger-foreground [--rippleBg:theme(colors.danger-foreground/40%)] shadow-danger-400/80',
    },

    // color / flat
    {
      variant: 'flat',
      color: 'neutral',
      class:
        'bg-neutral-100 text-neutral-800 [--rippleBg:theme(colors.neutral-800/20%)]',
    },
    {
      variant: 'flat',
      color: 'primary',
      class:
        'bg-primary-100 text-primary-800 [--rippleBg:theme(colors.primary-800/20%)]',
    },
    {
      variant: 'flat',
      color: 'secondary',
      class:
        'bg-secondary-100 text-secondary-800 [--rippleBg:theme(colors.secondary-800/20%)]',
    },
    {
      variant: 'flat',
      color: 'success',
      class:
        'bg-success-100 text-success-800 [--rippleBg:theme(colors.success-800/20%)]',
    },
    {
      variant: 'flat',
      color: 'info',
      class:
        'bg-info-100 text-info-800 [--rippleBg:theme(colors.info-800/20%)]',
    },
    {
      variant: 'flat',
      color: 'warning',
      class:
        'bg-warning-100 text-warning-800 [--rippleBg:theme(colors.warning-800/20%)]',
    },
    {
      variant: 'flat',
      color: 'danger',
      class:
        'bg-danger-100 text-danger-800 [--rippleBg:theme(colors.danger-800/20%)]',
    },

    // color / text
    {
      variant: 'text',
      color: 'neutral',
      class:
        'data-[hovered=true]:bg-neutral-100 text-neutral-700 [--rippleBg:theme(colors.neutral-700/20%)]',
    },
    {
      variant: 'text',
      color: 'primary',
      class:
        'data-[hovered=true]:bg-primary-100 text-primary-700 [--rippleBg:theme(colors.primary-700/20%)]',
    },
    {
      variant: 'text',
      color: 'secondary',
      class:
        'data-[hovered=true]:bg-secondary-100 text-secondary-700 [--rippleBg:theme(colors.secondary-700/20%)]',
    },
    {
      variant: 'text',
      color: 'success',
      class:
        'data-[hovered=true]:bg-success-100 text-success-700 [--rippleBg:theme(colors.success-700/20%)]',
    },
    {
      variant: 'text',
      color: 'info',
      class:
        'data-[hovered=true]:bg-info-100 text-info-700 [--rippleBg:theme(colors.info-700/20%)]',
    },
    {
      variant: 'text',
      color: 'warning',
      class:
        'data-[hovered=true]:bg-warning-100 text-warning-700 [--rippleBg:theme(colors.warning-700/20%)]',
    },
    {
      variant: 'text',
      color: 'danger',
      class:
        'data-[hovered=true]:bg-danger-100 text-danger-700 [--rippleBg:theme(colors.danger-700/20%)]',
    },

    // color / border
    {
      variant: 'border',
      color: 'neutral',
      class:
        'border-neutral-700 text-neutral-800 [--rippleBg:theme(colors.neutral-800/20%)]',
    },
    {
      variant: 'border',
      color: 'primary',
      class:
        'border-primary-700 text-primary-800 [--rippleBg:theme(colors.primary-800/20%)]',
    },
    {
      variant: 'border',
      color: 'secondary',
      class:
        'border-secondary-700 text-secondary-800 [--rippleBg:theme(colors.secondary-800/20%)]',
    },
    {
      variant: 'border',
      color: 'success',
      class:
        'border-success-700 text-success-800 [--rippleBg:theme(colors.success-800/20%)]',
    },
    {
      variant: 'border',
      color: 'info',
      class:
        'border-info-700 text-info-800 [--rippleBg:theme(colors.info-800/20%)]',
    },
    {
      variant: 'border',
      color: 'warning',
      class:
        'border-warning-700 text-warning-800 [--rippleBg:theme(colors.warning-800/20%)]',
    },
    {
      variant: 'border',
      color: 'danger',
      class:
        'border-danger-700 text-danger-800 [--rippleBg:theme(colors.danger-800/20%)]',
    },
  ],
});

export type ButtonVariantProps = VariantProps<typeof button>;

export const buttonStyles = [
  './node_modules/@gist-ui/theme/src/components/button.ts',
  './node_modules/@gist-ui/theme/src/classes.ts',
];
