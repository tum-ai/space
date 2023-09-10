import { Slot } from "@radix-ui/react-slot";
import { cx, cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
  cx(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 px-4 min-h-[2.75rem]",
  ),
  {
    variants: {
      variant: {
        default:
          "bg-black dark:bg-white hover:bg-black/90 dark:hover:bg-white/90 text-white dark:text-black",
        secondary:
          "bg-gray-300 dark:bg-gray-400 hover:bg-gray-300/90 dark:hover:bg-gray-400/90 text-black dark:text-black",
        link: "text-gray-500 hover:text-primary hover:bg-gray-100/90 dark:hover:bg-gray-900/90",
      },
      loading: {
        true: "animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
      loading: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={buttonVariants({ variant, className })}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
