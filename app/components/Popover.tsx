import { Cross1Icon } from "@radix-ui/react-icons";
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
          "z-50 max-h-64 w-72 overflow-auto rounded-lg p-4 shadow-md md:w-56",
          "bg-white dark:bg-gray-800",
          "pt-12",
        )}
      >
        <PopoverPrimitive.Arrow className="fill-current text-white dark:text-gray-800" />
        {children}
        <PopoverPrimitive.Close
          className={clsx(
            "absolute right-3.5 top-3.5 inline-flex items-center justify-center rounded-full p-1",
            "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
          )}
        >
          <Cross1Icon className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400" />
        </PopoverPrimitive.Close>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
};

export { Popover };
