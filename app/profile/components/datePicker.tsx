"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import { Calendar } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";

interface BirthDatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange: (date: Date) => void;
}

export function BirthDatePicker({
  value,
  defaultValue,
  onChange,
  ...props
}: BirthDatePickerProps & React.ComponentProps<typeof Button>) {
  const [date, setDate] = React.useState<Date>();

  React.useEffect(() => {
    if (value) {
      setDate(value);
    } else if (defaultValue) {
      setDate(defaultValue);
    }
  }, [value, defaultValue]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            if (newDate) {
              onChange(newDate);
            }
          }}
          captionLayout="dropdown-buttons"
          defaultMonth={date ?? new Date(new Date().getFullYear() - 18, 0)}
          fromYear={new Date().getFullYear() - 80}
          toYear={new Date().getFullYear() - 16}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
