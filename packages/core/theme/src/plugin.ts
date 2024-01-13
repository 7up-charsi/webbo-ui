import plugin from "tailwindcss/plugin";
import { neutral, primary, secondary, success, info, warning, danger } from "./colors";

export const frontplusui = () => {
  return plugin(
    ({ addUtilities }) => {
      addUtilities({
        ".disabled": {
          opacity: "0.5",
          pointerEvents: "none",
        },
      });
    },
    {
      theme: {
        extend: {
          colors: {
            neutral,
            primary,
            secondary,
            success,
            info,
            warning,
            danger,
          },
          fontSize: {
            tiny: "0.75rem",
            small: "0.875rem",
            medium: "1rem",
            large: "1.125rem",
          },
          lineHeight: {
            tiny: "1rem",
            small: "1.25rem",
            medium: "1.5rem",
            large: "1.75rem",
          },
          borderRadius: {
            small: "8px",
            medium: "12px",
            large: "14px",
          },
        },
      },
    },
  );
};