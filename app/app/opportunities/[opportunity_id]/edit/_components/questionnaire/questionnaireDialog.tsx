import {
  SubmitHandler,
  UseFormProps,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { QuestionnaireSchema } from "@lib/schemas/opportunity";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@components/ui/button";
import { QuestionDialog } from "./questionDialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileMinus, FilePlus2, Save, UserMinus } from "lucide-react";
import { AddReviewerPopup } from "../phases/addReviewerPopup";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { QuestionView } from "./questionView";

interface QuestionnaireProps {
  onSave: (data: z.infer<typeof QuestionnaireSchema>) => void;
  onRemove?: () => void;
  defaultValues?: UseFormProps<
    z.infer<typeof QuestionnaireSchema>
  >["defaultValues"];
  children: React.ReactNode;
}

export const QuestionnaireDialog = ({
  onSave,
  onRemove,
  defaultValues,
  children,
}: QuestionnaireProps) => {
  const form = useForm<z.infer<typeof QuestionnaireSchema>>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: defaultValues ?? {
      id: uuidv4(),
      name: "",
      questions: [],
      reviewers: [],
      conditions: [],
      requiredReviews: 1,
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const onSubmit: SubmitHandler<z.infer<typeof QuestionnaireSchema>> = (
    data,
  ) => {
    onSave(data);

    if (!defaultValues) {
      form.reset();
    }

    setDialogOpen(false);
  };

  const {
    fields: questions,
    append: appendQuestion,
    update: updateQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: `questions`,
  });

  const {
    fields: reviewers,
    append: appendReviewer,
    remove: removeReviewer,
  } = useFieldArray({
    control: form.control,
    name: `reviewers`,
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[42rem] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit" : "Add"} questionaire
          </DialogTitle>
          <DialogDescription>
            Configure questions and reviewer for {form.watch("name")}
          </DialogDescription>
        </DialogHeader>

        <FormField
          control={form.control}
          name={`name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder="General" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-8">
          <h3 className="mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
            Questions
          </h3>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <QuestionDialog
                key={question.key}
                defaultValues={question}
                onSave={(data) => {
                  updateQuestion(index, data);
                  form.handleSubmit(onSave, console.error);
                }}
                onRemove={() => removeQuestion(index)}
              >
                <Button
                  className="h-max w-full justify-between"
                  variant="outline"
                  type="button"
                >
                  <QuestionView question={question} />
                </Button>
              </QuestionDialog>
            ))}

            <QuestionDialog
              onSave={(data) => {
                appendQuestion(data);
                form.handleSubmit(onSave, console.error);
              }}
            >
              <Button className="w-full" variant="secondary" type="button">
                <FilePlus2 className="mr-2" />
                Add question
              </Button>
            </QuestionDialog>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
            Reviewer
          </h3>
          <div className="space-y-4">
            {reviewers.map((reviewer, index) => (
              <div
                className="flex w-full justify-between rounded-md border border-input p-4"
                key={reviewer.id}
              >
                <div className="flex w-full items-center gap-6">
                  <Avatar>
                    <AvatarImage src={reviewer.image} />
                    <AvatarFallback>{reviewer.name}</AvatarFallback>
                  </Avatar>

                  <h3>{reviewer.name}</h3>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    removeReviewer(index);
                  }}
                >
                  <UserMinus className="mx-2" />
                </Button>
              </div>
            ))}

            <AddReviewerPopup append={appendReviewer} />
          </div>
        </div>

        <DialogFooter>
          {onRemove && (
            <Button type="button" variant="destructive" onClick={onRemove}>
              <FileMinus className="mr-2" />
              Remove
            </Button>
          )}
          <Button
            type="button"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={form.handleSubmit(onSubmit, console.error)}
          >
            <Save className="mr-2" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
