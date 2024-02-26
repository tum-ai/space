import * as React from "react";

import { cn } from "@lib/utils";

export type InputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Input = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Textarea";

export { Input };
