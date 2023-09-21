import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import clsx from "clsx";
import { Button } from "./Button";

interface Props {
  setSelectedItem: (item: string) => void;
  /**
   * @deprecated use value instead
   */
  selectedItem?: {
    key: any;
    value: string;
  };
  value?: string;
  placeholder: string;
  disabled?: boolean;
  label?: string;
  options: { [key: string]: any }[];
}

function Select({
  setSelectedItem,
  selectedItem,
  value,
  placeholder,
  disabled = false,
  label,
  options,
}: Props) {
  return (
    <SelectPrimitive.Root
      disabled={disabled}
      value={value || selectedItem?.value}
      onValueChange={setSelectedItem}
    >
      <div className="flex flex-col gap-2">
        {label && <label className="text-sm">{label}</label>}
        <SelectPrimitive.Trigger asChild aria-label="Food">
          <Button>
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon className="ml-2">
              <ChevronDownIcon />
            </SelectPrimitive.Icon>
          </Button>
        </SelectPrimitive.Trigger>
      </div>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content position="popper" className="z-50">
          <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800">
            <SelectPrimitive.Group>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={`${option["key"]}`}
                  value={option["value"]}
                  className={clsx(
                    "relative flex items-center rounded-md px-8 py-2 text-sm font-medium text-gray-700 focus:bg-gray-100 dark:text-gray-300 dark:focus:bg-gray-900",
                    "radix-disabled:opacity-50",
                    "select-none focus:outline-none",
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {option["key"]}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <CheckIcon />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
            <ChevronDownIcon />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
export default Select;
