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
import { FullFormSchema } from "../../../../../../lib/schemas/opportunity";
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
  update: UseFieldArrayUpdate<
    z.infer<typeof FullFormSchema>,
    `defineSteps.${number}.forms.${number}.questions`
  >;
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
                      <SelectItem value="select">Select</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="slider">Slider</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question"
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
                onClick={form.handleSubmit((data) => update(index, data))}
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
    case "text":
      return (
        <div className="m-8 flex gap-4">
          <Type />
          <div className="flex items-center">
            <p>{form.watch("question")}</p>
          </div>
        </div>
      );
    case "slider":
      return (
        <div className="m-8 flex gap-4">
          <Type />
          <div className="flex items-center">
            <p>{form.watch("question")}</p>
          </div>
        </div>
      );
    case "select":
      return (
        <div className="m-8 flex gap-4">
          <Type />
          <div className="flex items-center">
            <p>{form.watch("question")}</p>
          </div>
        </div>
      );
  }
};

const TypeSpecificOptions = () => {
  const form = useFormContext<z.infer<typeof QuestionSchema>>();
  const type = form.watch("type");

  switch (type) {
    case "text":
      return <></>;
    case "slider":
      return (
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="range.0"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="range.1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    case "select":
      return <>Choices</>;
  }
};
