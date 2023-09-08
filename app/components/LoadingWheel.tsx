import { cva } from "class-variance-authority";
import React from "react";

const loadingWheelVariants = cva(
  "m-auto animate-spin rounded-full border-l-2",
  {
    variants: {
      variant: {
        default: "h-12 w-12 border-black dark:border-white",
        small: "h-8 w-8",
        inverted: "border-white dark:border-black",
        invertedSmall: "h-8 w-8 border-white dark:border-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);
export interface loadingWheelProps {
  variant?: "small" | "inverted" | "invertedSmall";
}

const LoadingWheel = React.forwardRef<HTMLButtonElement, loadingWheelProps>(
  ({ variant }, ref) => {
    return <div className={loadingWheelVariants({ variant })} />;
  },
);

export { LoadingWheel, loadingWheelVariants };
