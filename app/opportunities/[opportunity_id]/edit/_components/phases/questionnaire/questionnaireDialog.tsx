import {
  type SubmitHandler,
  type UseFormProps,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { type z } from "zod";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileMinus, FilePlus2, Save } from "lucide-react";
import { QuestionView } from "./questionView";
import { Card } from "@components/ui/card";
import { QuestionForm, type QuestionFormProps } from "./question";
import type { Question } from "@lib/types/question";
import { UsersStack } from "../../usersStack";
import { useSession } from "next-auth/react";

const QuestionEdit = ({
  question,
  ...props
}: { question: Question } & Omit<QuestionFormProps, "toggleEdit">) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <>
      {!isEdit && (
        <Card className="p-2" onClick={() => setIsEdit(true)}>
          <QuestionView question={question} />
        </Card>
      )}
      {!!isEdit && (
        <QuestionForm
          {...props}
          toggleEdit={() => setIsEdit(false)}
          defaultValues={question}
        />
      )}
    </>
  );
};

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
      // reset form for new questionnaire
      form.reset();
      form.setValue("id", uuidv4());
    }

    setDialogOpen(false);
  };

  const [addQuestionOpen, setAddQuestionOpen] = useState(false);

  const {
    fields: questions,
    append: appendQuestion,
    update: updateQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    keyName: `fieldId`,
    control: form.control,
    name: `questions`,
  });

  const {
    fields: reviewers,
    append: appendReviewer,
    remove: removeReviewer,
  } = useFieldArray({
    keyName: `fieldId`,
    control: form.control,
    name: `reviewers`,
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[42rem] space-y-4 overflow-y-auto">
        <Form {...form}>
          <DialogHeader>
            <DialogTitle>
              {defaultValues ? "Edit" : "Add"} questionaire
            </DialogTitle>
            <DialogDescription>
              Configure questions and reviewer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Information
            </h4>
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

            <FormItem>
              <FormLabel>Required reviews*</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="General"
                  {...form.register("requiredReviews", { valueAsNumber: true })}
                />
              </FormControl>
              <FormDescription>
                Required amount of unique reviews for this questionnaire per
                application.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </div>

          <div className="space-y-2">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Questions
            </h4>
            <div className="space-y-2">
              {questions.map((question, i) => (
                <QuestionEdit
                  key={`question-edit-${question.fieldId}`}
                  question={question}
                  onSave={(data) => updateQuestion(i, data)}
                  onRemove={() => removeQuestion(i)}
                />
              ))}

              {addQuestionOpen && (
                <QuestionForm
                  toggleEdit={() => setAddQuestionOpen(false)}
                  onSave={appendQuestion}
                />
              )}

              <Button
                className="w-full"
                variant="secondary"
                type="button"
                onClick={() => setAddQuestionOpen(true)}
              >
                <FilePlus2 className="mr-2" />
                Add question
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Reviewer
            </h4>
            <UsersStack
              key={`questionnaire-${form.watch("id")}-`}
              users={reviewers}
              append={appendReviewer}
              remove={removeReviewer}
            />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
