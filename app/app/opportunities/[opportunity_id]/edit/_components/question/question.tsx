import {
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
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
import { QuestionnaireSchema } from "@lib/schemas/opportunity";
import { z } from "zod";
import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { QuestionSchema } from "@lib/schemas/question";
import { Type } from "lucide-react";

interface QuestionFormProps {
  question: z.infer<typeof QuestionSchema>;
  index: number;
  update: UseFieldArrayUpdate<z.infer<typeof QuestionnaireSchema>, `questions`>;
  remove: UseFieldArrayRemove;
}

export const QuestionForm = ({
  question,
  index,
  update,
  remove,
}: QuestionFormProps) => {
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: question,
  });

  return (
    <Form {...form}>
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex w-full justify-between rounded-md border border-input bg-background">
            <TypeSpecificView />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit question</DialogTitle>
            <DialogDescription>
              Edit question that will be asked screeners regarding applicants
            </DialogDescription>

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
                    <Input placeholder="Is this applicant good?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TypeSpecificOptions />

            <div className="grid w-full grid-cols-2 gap-2 pt-8">
              <Button variant="destructive" onClick={() => remove(index)}>
                Remove
              </Button>
              <Button
                variant="secondary"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={form.handleSubmit(
                  (data) => update(index, data),
                  (err) => console.error(err),
                )}
              >
                Save
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

const TypeSpecificView = () => {
  const form = useFormContext<z.infer<typeof QuestionSchema>>();
  const type = form.watch("type");

  switch (type) {
    case "INPUT_TEXT":
      return (
        <div className="m-8 flex gap-4">
          <Type />
          <div className="flex items-center">
            <p>{form.watch("label")}</p>
          </div>
        </div>
      );
    case "DROPDOWN":
      return (
        <div className="m-8 flex gap-4">
          <Type />
          <div className="flex items-center">
            <p>{form.watch("label")}</p>
          </div>
        </div>
      );
    case "CHECKBOXES":
      return (
        <div className="m-8 flex gap-4">
          <Type />
          <div className="flex items-center">
            <p>{form.watch("label")}</p>
          </div>
        </div>
      );
  }
};

const TypeSpecificOptions = () => {
  const form = useFormContext<z.infer<typeof QuestionSchema>>();
  const type = form.watch("type");

  switch (type) {
    case "INPUT_TEXT":
      return <></>;

    case "DROPDOWN":
      return <></>;

    case "CHECKBOXES":
      return <></>;
  }
};
