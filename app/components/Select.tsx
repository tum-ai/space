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
  selectedItem: {
    key: any;
    value: string | number;
  };
  placeholder: string;
  disabled?: boolean;
  label?: string;
  data: {
    key: any;
    value: string | number;
  };
}

function Select({
  setSelectedItem,
  selectedItem,
  placeholder,
  disabled = false,
  label,
  data,
}) {
  return (
    <SelectPrimitive.Root
      disabled={disabled}
      value={selectedItem.value}
      onValueChange={setSelectedItem}
    >
      {label && <label className="mb-2 text-sm font-thin">{label}</label>}
      <SelectPrimitive.Trigger asChild aria-label="Food">
        <Button>
          {selectedItem.value ? <SelectPrimitive.Value /> : placeholder}
          <SelectPrimitive.Icon className="ml-2">
            <ChevronDownIcon />
          </SelectPrimitive.Icon>
        </Button>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content>
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
          <ChevronUpIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800">
          <SelectPrimitive.Group>
            {data.map((f, i) => (
              <SelectPrimitive.Item
                key={`${f["key"]}`}
                value={f["value"]}
                className={clsx(
                  "relative flex items-center rounded-md px-8 py-2 text-sm font-medium text-gray-700 focus:bg-gray-100 dark:text-gray-300 dark:focus:bg-gray-900",
                  "radix-disabled:opacity-50",
                  "select-none focus:outline-none",
                )}
              >
                <SelectPrimitive.ItemText>{f["key"]}</SelectPrimitive.ItemText>
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
    </SelectPrimitive.Root>
  );
}
export default Select;
