import { VariantProps, tv } from "tailwind-variants";

const numberInput = tv({
  slots: {
    buttonsWrapper: "h-full flex items-center",
  },
  variants: {
    showOnHover: {
      true: {
        buttonsWrapper:
          "invisible group-data-[hovered=true]:visible group-data-[focused=true]:visible group-data-[focus-visible=true]:visible",
      },
    },
  },
  defaultVariants: {
    showOnHover: true,
  },
});

export type NumberInputVariantProps = VariantProps<typeof numberInput>;

export { numberInput };