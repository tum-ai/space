"use client";

import { Button } from "@components/ui/button";
import { Save, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { ApplicationField } from "@components/application/applicationField";
import { SubmitHandler, useForm } from "react-hook-form";
import { Question, QuestionSchema } from "@lib/schemas/question";
import { Form } from "@components/ui/form";
import { api } from "trpc/react";
import { toast } from "sonner";
import { Application, Review } from "@prisma/client";
import { Tally } from "@lib/types/tally";
import { useRouter } from "next/navigation";
import { DeleteAlertDialog } from "../components/review-altert-dialog";
import Breadcrumbs from "@components/ui/breadcrumbs";
import { QuestionField } from "./_components/questionField";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";

interface ReviewFormProps {
  application: Application;
  review: Review;
  questions: Question[];
  opportunityTitle: string | undefined;
}

export const ReviewForm = ({
  application,
  questions,
  review,
  opportunityTitle,
}: ReviewFormProps) => {
  const applicationFields = (application.content as Tally).data.fields;

  const defaultValues = (review.content as Question[]).reduce(
    (acc, question, index) => {
      acc[`${index}`] = question.value;
      return acc;
    },
    {} as Record<string, Question["value"]>,
  );

  const form = useForm<Record<string, Question["value"]>>({
    defaultValues,
  });

  const router = useRouter();

  const updateMutation = api.review.update.useMutation();

  const onSubmit: SubmitHandler<Record<string, Question["value"]>> = (data) => {
    const content = QuestionSchema.array().parse(
      questions.map((question, index) => ({
        ...question,
        value: data[`${index}`],
      })),
    );

    toast.promise(
      updateMutation
        .mutateAsync({
          id: review.id,
          content,
          status: "DONE",
        })
        .then(() => {
          router.push(`/opportunities/${application.opportunityId}/review`);
        }),
      {
        loading: "Saving review",
        success: "Review saved",
        error: (e) => {
          console.error(e);
          return "Failed to save review";
        },
      },
    );
  };

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <div className="space-y-8 p-8">
        <div className="flex justify-between">
          <div className="flex flex-col gap-3">
            <Breadcrumbs
              title={`Application: ${application.opportunityId}`}
              opportunityTitle={opportunityTitle}
            />
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Review application
            </h1>
            <p className="text-muted-foreground">Review a candidate</p>
          </div>

          <div className="flex gap-2">
            <div>
              <DeleteAlertDialog
                inputReviewId={review.id}
                inputOpportunityId={application.opportunityId}
              >
                <Button type="button" variant="destructive">
                  <Trash className="mr-2" />
                  Delete
                </Button>
              </DeleteAlertDialog>
            </div>

            <Button
              variant="default"
              onClick={form.handleSubmit(onSubmit, (err) => console.error(err))}
            >
              <Save className="mr-2" />
              Save
            </Button>
          </div>
        </div>

        <ResizablePanelGroup direction="horizontal" className="gap-4">
          <ResizablePanel defaultSize={50}>
            <Card>
              <CardHeader>
                <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Application
                </CardTitle>
              </CardHeader>
              <CardContent className="flex h-[70vh] flex-col gap-8 overflow-y-auto">
                {applicationFields
                  .filter((field) => !!field.value)
                  .map((field, index) => (
                    <ApplicationField
                      className="w-full"
                      key={field.key}
                      field={field}
                      index={index + 1}
                    />
                  ))}
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50}>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Review
                </CardTitle>
              </CardHeader>
              <CardContent className="flex h-[70vh] flex-col gap-8 overflow-y-auto">
                {questions.map((question, index) => (
                  <QuestionField
                    question={question}
                    index={index}
                    key={question.key}
                  />
                ))}
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </Form>
  );
};
