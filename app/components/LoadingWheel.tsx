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

export interface Props {
  size?: "small" | "tiny";
  color?: "inverted";
}

const LoadingWheel = ({ size, color }: Props) => {
  return <div className={loadingWheelVariants({ size, color })} />;
};

export default LoadingWheel;
