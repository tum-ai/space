import {
  SubmitHandler,
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
import { z } from "zod";
import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
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
import { QuestionSchema } from "@lib/schemas/question";
import { useState } from "react";
import { Plus, X } from "lucide-react";

interface QuestionFormProps {
  onSave: (data: z.infer<typeof QuestionSchema>) => void;
  question?: z.infer<typeof QuestionSchema>;
  children?: React.ReactNode;
}

export const QuestionPopover = ({
  onSave,
  children,
  question,
}: QuestionFormProps) => {
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: question ?? { key: uuidv4() },
  });
  const [popoverOpen, setPopoverOpen] = useState(false);

  const onSubmit: SubmitHandler<z.infer<typeof QuestionSchema>> = (data) => {
    onSave(data);
    form.reset();
    setPopoverOpen(false);
  };

  return (
    <Form {...form}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-96">
          <h3>{question ? "Edit" : "Add"} question</h3>

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

            <TypeSpecificOptions />

            <div className="grid w-full grid-cols-2 gap-2 pt-8">
              <Button
                variant="secondary"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={form.handleSubmit(onSubmit, (err) =>
                  console.error(err),
                )}
              >
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </Form>
  );
};

const ChoiceOptions = () => {
  const questionForm = useFormContext<z.infer<typeof QuestionSchema>>();
  const {
    fields: options,
    append,
    remove,
  } = useFieldArray({
    control: questionForm.control,
    name: "options",
  });

  const [optionName, setOptionName] = useState("");

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

const TypeSpecificOptions = () => {
  const form = useFormContext<z.infer<typeof QuestionSchema>>();
  const type = form.watch("type");
  switch (type) {
    case "INPUT_TEXT":
      return <></>;

    case "DROPDOWN":
      return <ChoiceOptions />;

    case "CHECKBOXES":
      return <ChoiceOptions />;
  }
};
