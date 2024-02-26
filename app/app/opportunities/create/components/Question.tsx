import {
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useForm,
} from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { FullFormSchema, QuestionSchema } from "../schema";
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

interface QuestionProps {
  question: z.infer<typeof QuestionSchema>;
  index: number;
  update: UseFieldArrayUpdate<
    z.infer<typeof FullFormSchema>,
    `defineSteps.${number}.forms.${number}.questions`
  >;
  remove: UseFieldArrayRemove;
}

export const Question = ({
  question,
  index,
  update,
  remove,
}: QuestionProps) => {
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: question,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full justify-between"
          variant="outline"
          size="lg"
          type="button"
        >
          <div className="flex gap-4">
            <p>{question.type}</p>
            <div>
              <p>{question.question}</p>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>Edit question</DialogTitle>
            <DialogDescription>
              This is a question that will be asked screeners
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
                      <SelectItem value="textarea">Textarea</SelectItem>
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
