import {
  SubmitHandler,
  UseFieldArrayAppend,
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
import {
  OpportunitySchema,
  QuestionnaireSchema,
} from "@lib/schemas/opportunity";
import { Button } from "@components/ui/button";
import { QuestionForm } from "../question";
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
import { FileMinus, FilePlus2, Save } from "lucide-react";
import { AddReviewerPopup } from "./addReviewerPopup";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

interface QuestionnaireProps {
  append: UseFieldArrayAppend<
    z.infer<typeof OpportunitySchema>,
    `phases.${number}.questionnaires`
  >;
  onRemove: () => void;
  defaultValues: UseFormProps<
    z.infer<typeof QuestionnaireSchema>
  >["defaultValues"];
}

export const Questionnaire = ({
  append,
  onRemove: removeQuestionnaire,
  defaultValues,
}: QuestionnaireProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof QuestionnaireSchema>>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof QuestionnaireSchema>> = (
    data,
  ) => {
    append(data);
    setDialogOpen(false);
  };

  const {
    fields: questions,
    append: appendQuestion,
    remove: removeQuestion,
    update: updateQuestion,
  } = useFieldArray({
    control: form.control,
    name: `questions`,
  });

  const {
    fields: reviewers,
    append: appendReviewer,
    remove: removeReviewer,
    update: updateReviewer,
  } = useFieldArray({
    control: form.control,
    name: `reviewers`,
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Button asChild variant="outline" className="w-full">
        <DialogTrigger>{form.watch("name")}</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit questionaire</DialogTitle>
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
              <QuestionForm
                key={question.id + index}
                question={question}
                index={index}
                update={updateQuestion}
                remove={removeQuestion}
              />
            ))}

            <Button
              className="w-full"
              variant="secondary"
              type="button"
              onClick={() => appendQuestion({ type: "text", question: "" })}
            >
              <FilePlus2 className="mr-2" />
              Add question
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
            Reviewer
          </h3>
          <div className="space-y-4">
            {reviewers.map((reviewer) => (
              <div
                className="flex w-full justify-between rounded-md border border-input"
                key={reviewer.id}
              >
                <div className="flex w-full items-center gap-6 p-4">
                  <Avatar>
                    <AvatarImage src={reviewer.image} />
                    <AvatarFallback>{reviewer.name}</AvatarFallback>
                  </Avatar>
                  <h3>{reviewer.name}</h3>
                </div>
              </div>
            ))}
            <AddReviewerPopup append={appendReviewer} />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            onClick={removeQuestionnaire}
          >
            <FileMinus className="mr-2" />
            Remove
          </Button>
          <Button
            type="button"
            onClick={(event) => {
              void form.handleSubmit(onSubmit, console.error)(event);
            }}
          >
            <Save className="mr-2" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
