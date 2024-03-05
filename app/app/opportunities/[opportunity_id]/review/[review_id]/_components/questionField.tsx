"use client";

import { Question } from "@lib/types/question";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@components/ui/checkbox";

interface QuestionFieldProps {
  index: number;
  question: Question;
}

export const QuestionField = ({ index, question }: QuestionFieldProps) => {
  const form = useFormContext<Question[]>();
  form.register(`${index}.key`);

  switch (question.type) {
    case "INPUT_TEXT": {
      return (
        <FormField
          key={question.key}
          control={form.control}
          name={`${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{question.label}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    case "DROPDOWN": {
      return (
        <FormField
          key={question.key}
          control={form.control}
          name={`${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{question.label}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {question.options.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    case "CHECKBOXES": {
      return (
        <FormItem>
          <FormLabel>{question.label}</FormLabel>
          {question.options.map((item) => (
            <FormField
              key={item.id}
              control={form.control}
              name={`${index}.value`}
              render={({ field }) => {
                return (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...(field.value ?? []), item.id])
                            : field.onChange(
                                (field.value as string[])?.filter(
                                  (value) => value !== item.id,
                                ),
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{item.text}</FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      );
    }
  }
};
