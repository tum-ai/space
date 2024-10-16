"use client";

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
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@lib/utils";
import { format } from "date-fns";
import { Calendar } from "@components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { type GeneralInformationSchema } from "@lib/schemas/opportunity";
import { type z } from "zod";
import { AvatarStack } from "../../../components/user/users-stack";

export function GeneralInformation() {
  const form = useFormContext<z.infer<typeof GeneralInformationSchema>>();

  const {
    fields: admins,
    append: appendAdmin,
    remove: removeAdmin,
  } = useFieldArray({
    keyName: `fieldId`,
    control: form.control,
    name: `admins`,
  });

  return (
    <div className="grid grid-cols-2 gap-3">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Title*</FormLabel>
            <FormControl>
              <Input placeholder="Venture campaign WS2023" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="start"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Begin*</FormLabel>
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
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="end"
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
                  disabled={(date) => date < new Date(form.getValues("start"))}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="col-span-2">
        <FormField
          control={form.control}
          name="description"
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

      <FormItem className="col-span-2">
        <FormLabel>Admins</FormLabel>
        <FormControl>
          <AvatarStack
            users={admins}
            append={appendAdmin}
            remove={removeAdmin}
            size={"default"}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}
