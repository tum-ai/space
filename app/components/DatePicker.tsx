"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";

import { cn } from "@lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./Calendar";
import { Popover } from "./Popover";
import { labelStyles } from "./Input";

interface DatePickerProps {
  label: string;
  placeholder: string;
  setValue: (value: Date) => void;
  value: Date | undefined;
  state?: "default" | "error";
  fullWidth?: boolean;
  error?: string;
}

export function DatePicker(props: DatePickerProps) {
  const date = props.value;
  const setDate = props.setValue;

  return (
    <div className="flex flex-col gap-2">
      <label className={labelStyles({ state: props.state })}>
        {props.label}
      </label>
      <Popover
        trigger={
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              props.fullWidth && "w-full",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>{props.placeholder}</span>}
            {date && (
              <X
                className="ml-auto h-4 w-4"
                onClick={(event) => {
                  event.preventDefault();
                  setDate(undefined);
                }}
              />
            )}
          </Button>
        }
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="w-auto p-0"
        />
      </Popover>
    </div>
  );
}
