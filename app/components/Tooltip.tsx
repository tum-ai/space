import * as TooltipRadix from "@radix-ui/react-tooltip";

/**
 * @deprecated: use https://ui.shadcn.com/docs/components/tooltip
 **/
export default function Tooltip({ trigger, children }) {
  return (
    <TooltipRadix.Provider delayDuration={0}>
      <TooltipRadix.Root>
        <TooltipRadix.Trigger asChild>{trigger}</TooltipRadix.Trigger>
        <TooltipRadix.Portal>
          <TooltipRadix.Content
            className="text-md rounded-lg bg-white px-4 py-2 shadow"
            sideOffset={5}
          >
            {children}
          </TooltipRadix.Content>
        </TooltipRadix.Portal>
      </TooltipRadix.Root>
    </TooltipRadix.Provider>
  );
}
