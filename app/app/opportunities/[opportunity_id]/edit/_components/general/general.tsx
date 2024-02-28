import React from "react";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import { useFormContext } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@lib/utils";
import { format } from "date-fns";
import { Calendar } from "@components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  OpportunitySchema,
  GeneralInformationSchema,
} from "@lib/schemas/opportunity";
import { PersonSchema } from "@lib/schemas/person";
import { z } from "zod";

export type Member = z.infer<typeof PersonSchema>;

export function GeneralInformation() {
  const form = useFormContext<
    z.infer<typeof OpportunitySchema> | z.infer<typeof GeneralInformationSchema>
  >();

  return (
    <div>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        General information
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="generalInformation.title"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Venture campaign WS2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="generalInformation.start"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Begin</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="generalInformation.end"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date <
                      new Date(form.getValues("generalInformation.start"))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2 mb-8">
          <FormField
            control={form.control}
            name="generalInformation.description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the opportunity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
