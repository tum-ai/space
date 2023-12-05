import * as DialogRadix from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { useState } from "react";

interface Props {
  trigger: React.ReactNode;
  isOpenOutside?: boolean;
  setIsOpenOutside?: (isOpen: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ trigger, isOpenOutside, setIsOpenOutside, children }: Props) {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <DialogRadix.Root
      open={isOpenOutside || isOpen}
      onOpenChange={setIsOpenOutside ?? setIsOpen}
    >
      <DialogRadix.Trigger asChild>{trigger}</DialogRadix.Trigger>
      <DialogRadix.Portal>
        <DialogRadix.Overlay className="fixed inset-0 z-20 bg-black/50" />
        <DialogRadix.Content
          className={clsx(
            "fixed z-50 overflow-auto",
            "w-[95vw] max-w-[600px] rounded-lg p-8 md:w-full",
            "max-h-[90%]",
            "left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]",
            "bg-gray-200 dark:bg-gray-800",
            "outline-none",
          )}
        >
          {children}
        </DialogRadix.Content>
      </DialogRadix.Portal>
    </DialogRadix.Root>
  );
}

export default Dialog;
