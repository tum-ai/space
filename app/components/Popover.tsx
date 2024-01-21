import * as PopoverPrimitive from "@radix-ui/react-popover";
import { clsx } from "clsx";

const Popover = ({ trigger, children }) => {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content
        align="center"
        sideOffset={4}
        className={clsx(
          "radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
          "z-50 w-72 overflow-auto rounded-lg p-4 shadow-md",
          "bg-white dark:bg-gray-800",
          "h-full",
        )}
      >
        <PopoverPrimitive.Arrow className="fill-current text-white dark:text-gray-800" />
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
};

export { Popover };
