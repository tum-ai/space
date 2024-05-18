"use client";

import { FC } from "react";
import { UseControllerProps, useController } from "react-hook-form";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandInput,
} from "@components/ui/command";
import { cn } from "@lib/utils";

interface Option {
  label: string;
  value: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormValues = Record<string, any>;

interface ComboBoxProps extends UseControllerProps<FormValues> {
  options: Option[];
  className?: string;
  placeholder?: string;
}

export const ComboBox: FC<ComboBoxProps> = ({
  name,
  placeholder,
  control,
  options,
  className,
}) => {
  const { field } = useController({ name, control });

  if (!options) {
    throw new Error("No options provided to Combobox");
  }

  return (
    <div className={cn("block", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !field.value && "text-muted-foreground",
              className,
            )}
          >
            {field.value
              ? options.find((option) => option.value === field.value)?.label
              : "Select option"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-[200px] p-0", className)}>
          <Command>
            <CommandInput placeholder={placeholder} />
            {/* TODO: Implement a `strict` parameter for the ComboBox component. 
              - Purpose: When `strict` is set to false, the component should allow users to enter any text and use it as a selectable option, effectively enabling freeform text input alongside predefined options.
              - Implementation Suggestion: Modify the component to include a state that captures user input and dynamically creates an option based on this input if it does not match existing options. This should only be active when `strict` is set to false.
              - I dont wanna do this right now, so I'll just add a message that says "Nothing found. Do Other if not included"
            */}
            <CommandEmpty>Nothing found</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => field.onChange(option.value)}
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      option.value === field.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
