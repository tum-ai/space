import * as TooltipRadix from "@radix-ui/react-Tooltip";

export default function Tooltip({ trigger, children, ...props }) {
  return (
    <TooltipRadix.Provider delayDuration={0}>
      <TooltipRadix.Root>
        <TooltipRadix.Trigger asChild>{trigger}</TooltipRadix.Trigger>
        <TooltipRadix.Portal>
          <TooltipRadix.Content
            className="rounded-lg bg-gray-300 p-4 dark:bg-gray-900"
            sideOffset={5}
          >
            {children}
          </TooltipRadix.Content>
        </TooltipRadix.Portal>
      </TooltipRadix.Root>
    </TooltipRadix.Provider>
  );
}
