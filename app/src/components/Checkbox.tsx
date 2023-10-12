import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { cx } from "class-variance-authority";

interface Props {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Checkbox = ({ checked, onCheckedChange }: Props) => {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cx(
        "flex h-6 w-6 items-center rounded",
        "radix-state-checked:bg-purple-600 radix-state-unchecked:bg-gray-100 dark:radix-state-unchecked:bg-gray-900",
        "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
      )}
    >
      <CheckboxPrimitive.Indicator>
        <CheckIcon className="h-6 w-6 self-center text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};
