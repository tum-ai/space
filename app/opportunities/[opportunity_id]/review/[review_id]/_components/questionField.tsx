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
  FormDescription,
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
  const form = useFormContext<Record<string, Question["value"]>>();

  switch (question.type) {
    case "INPUT_TEXT": {
      return (
        <FormField
          key={question.key}
          control={form.control}
          name={`${index}`}
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
          name={`${index}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{question.label}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value as string}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
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
              name={`${index}`}
              render={({ field }) => {
                // Since we are in the checkbox context, we can assert that the value is a string array
                const fieldValue = field.value as string[];
                return (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={fieldValue?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...(fieldValue ?? []), item.id])
                            : field.onChange(
                                fieldValue?.filter(
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

    case "NUMERIC": {
      return (
        <FormField
          key={question.key}
          control={form.control}
          name={`${index}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{question.label}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={question.options.min}
                  max={question.options.max}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const inputValue =
                      e.target.value === ""
                        ? question.options.min
                        : Number(e.target.value);
                    const clampedValue = Math.max(
                      question.options.min,
                      Math.min(inputValue, question.options.max),
                    );
                    field.onChange(clampedValue);
                  }}
                  onWheel={(e) => {
                    (e.target as HTMLInputElement).blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                Min: {question.options.min} Max: {question.options.max}
              </FormDescription>
            </FormItem>
          )}
        />
      );
    }
  }
};
