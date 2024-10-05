import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import { Calendar } from "components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";

export interface BirthDatePickerProps {
  value?: Date | undefined;
  defaultValue?: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export function BirthDatePicker({
  value,
  defaultValue,
  onChange,
}: BirthDatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ?? defaultValue,
  );

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
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={(newDate: Date | undefined) => {
            if (newDate) {
              setDate(newDate);
              onChange(newDate);
            }
          }}
          defaultMonth={date ?? new Date(new Date().getFullYear() - 18, 0)}
          fromYear={new Date().getFullYear() - 85}
          toYear={new Date().getFullYear() - 16}
        />
      </PopoverContent>
    </Popover>
  );
}
