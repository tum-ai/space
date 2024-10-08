import {
  type SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { type z } from "zod";
import { Button } from "@components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@components/ui/input";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  type ArrayOptionsSchema,
  QuestionSchema,
  isArrayOptions,
} from "@lib/schemas/question";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@components/ui/card";

export interface QuestionFormProps {
  onSave: (data: z.infer<typeof QuestionSchema>) => void;
  toggleEdit: () => void;
  onRemove?: () => void;
  defaultValues?: z.infer<typeof QuestionSchema>;
}

export const QuestionForm = ({
  onSave,
  toggleEdit,
  onRemove,
  defaultValues,
}: QuestionFormProps) => {
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: defaultValues ?? { key: uuidv4() },
  });

  const onSubmit: SubmitHandler<z.infer<typeof QuestionSchema>> = (data) => {
    onSave(data);

    if (!defaultValues) {
      // reset form for new question
      form.reset();
      form.setValue("key", uuidv4());
    }

    toggleEdit();
  };

  const type = form.watch("type");

  return (
    <Form {...form}>
      <Card className="space-y-2 p-2">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a question type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INPUT_TEXT">Input text</SelectItem>
                    <SelectItem value="DROPDOWN">Dropdown</SelectItem>
                    <SelectItem value="CHECKBOXES">Checkboxes</SelectItem>
                    <SelectItem value="NUMERIC">Numeric</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {type === "DROPDOWN" && <ChoiceOptions />}
          {type === "CHECKBOXES" && <ChoiceOptions />}
          {type === "NUMERIC" && <MinMaxOption />}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            type="button"
            variant="ghost"
            onClick={() => {
              toggleEdit();
            }}
          >
            Cancel
          </Button>

          {onRemove && (
            <Button
              size="sm"
              type="button"
              variant="destructive"
              onClick={onRemove}
            >
              Remove
            </Button>
          )}

          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={form.handleSubmit(onSubmit, console.error)}
          >
            {defaultValues ? "Update" : "Create"}
          </Button>
        </div>
      </Card>
    </Form>
  );
};

const ChoiceOptions = () => {
  // Helper type to assert typescript, that the question has array options
  type QuestionWithArrayOptions = z.infer<typeof QuestionSchema> & {
    options: z.infer<typeof ArrayOptionsSchema>;
  };

  const questionForm = useFormContext<QuestionWithArrayOptions>();

  const {
    fields: options,
    append,
    remove,
  } = useFieldArray({
    keyName: `fieldId`,
    control: questionForm.control,
    name: "options",
  });

  const [optionName, setOptionName] = useState("");

  if (!isArrayOptions(options)) {
    console.error("Question doesn't contain array options");
    return null;
  }

  return (
    <div className="space-y-2">
      <FormLabel>Options</FormLabel>
      {!!options.length && (
        <div className="divide-y rounded border">
          {options.map((option, index) => (
            <div key={option.id} className="flex justify-between px-2 py-1">
              <p className="flex items-center">{option.text}</p>
              <Button
                size="icon"
                className="px-2"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <X />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Input
          value={optionName}
          onChange={(event) => setOptionName(event.target.value)}
        />

        <Button
          size="icon"
          variant="outline"
          className="px-2"
          onClick={() => {
            if (!optionName.length) {
              toast.error("Option name is required");
              return;
            }

            append({ id: uuidv4(), text: optionName });
            setOptionName("");
          }}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};

const MinMaxOption = () => {
  const questionForm = useFormContext<z.infer<typeof QuestionSchema>>();

  return (
    <div className="space-y-2">
      <FormField
        control={questionForm.control}
        name="options.min"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Min</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={questionForm.control}
        name="options.max"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Max</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                value={field.value}
                onChange={(e) =>
                  field.onChange(
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};
