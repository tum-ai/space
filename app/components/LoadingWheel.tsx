import { cva } from "class-variance-authority";
import React from "react";

const loadingWheelVariants = cva(
  "m-auto animate-spin rounded-full border-l-2",
  {
    variants: {
      size: {
        default: "h-12 w-12",
        small: "h-6 w-6",
        tiny: "h-3 w-3",
      },
      color: {
        default: "border-black dark:border-white",
        inverted: "border-white dark:border-black",
      },
    },
    compoundVariants: [
      {
        color: "default",
        size: "default",
      },
    ],
    defaultVariants: {
      size: "default",
      color: "default",
    },
  },
);
export interface loadingWheelProps {
  size?: "small" | "tiny";
  color?: "inverted";
}

const LoadingWheel = React.forwardRef<HTMLButtonElement, loadingWheelProps>(
  ({ size, color }, ref) => {
    return <div className={loadingWheelVariants({ size, color })} />;
  },
);

export { LoadingWheel, loadingWheelVariants };
