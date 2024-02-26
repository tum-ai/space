"use client";

import React from "react";
import { Input } from "@components/ui/input";
import { MemberBar, AddMemberBar } from "./MemberBar";
import { Button } from "@components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { cn } from "@lib/utils";
import { format } from "date-fns";
import { Calendar } from "@components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { FullFormSchema } from "../schema";
import { z } from "zod";

import { User } from "@prisma/client";

interface Tag {
  text: string;
  color: string;
}

export type Member = Pick<User, "id" | "name" | "image"> & { tags: Tag[] };

interface Props {
  form: UseFormReturn<z.infer<typeof FullFormSchema>>;
}

export function GeneralInformation({ form }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="generalInformation.tallyID"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tally Id</FormLabel>
            <FormControl>
              <Input placeholder="venture-campaign-ws-2023" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="generalInformation.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Opportunity title</FormLabel>
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
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
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
                    date < new Date() || date < new Date("1900-01-01")
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

      <MemberSection form={form} />
    </div>
  );
}

interface MemberSectionProps {
  form: Props["form"];
}
const MemberSection = ({ form }: MemberSectionProps) => {
  const { fields: admins, remove: removeAdmins } = useFieldArray({
    control: form.control,
    name: "generalInformation.admins",
  });

  return (
    <div>
      <div className="col-span-2 flex flex-1 flex-col lg:col-span-1">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-2xl">Admins</h2>
        </div>
        <div className="flex flex-col gap-2">
          {admins.map((member, index) => (
            <MemberBar
              key={member.id}
              member={member}
              onDelete={() => removeAdmins(index)}
            />
          ))}
          <AddMemberBar text={`+ Add Admin`} />
        </div>
      </div>
    </div>
  );
};
