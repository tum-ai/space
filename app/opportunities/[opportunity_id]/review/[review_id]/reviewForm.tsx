"use client";

import { Button } from "@components/ui/button";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { ApplicationField } from "@components/application/applicationField";
import { SubmitHandler, useForm } from "react-hook-form";
import { Question, QuestionSchema } from "@lib/schemas/question";
import { QuestionField } from "./_components/questionField";
import { Form } from "@components/ui/form";
import { api } from "trpc/react";
import { toast } from "sonner";
import { Application, Review } from "@prisma/client";
import { Tally } from "@lib/types/tally";
import { useRouter } from "next/navigation";
import { DeleteAlertDialog } from "../components/review-altert-dialog";
import PageTemplate from "@components/PageTemplate";

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

  const form = useForm<Question["value"][]>();
  const defaultValues = (review.content as Question[]).map((question) => {
    return question.value;
  });
  // Workaround to set default values
  defaultValues.forEach((value, index) => {
    form.setValue(`${index}`, value);
  });

  const router = useRouter();

  const updateMutation = api.review.update.useMutation();

  const onSubmit: SubmitHandler<Question["value"][]> = (data) => {
    const content = QuestionSchema.array().parse(
      questions.map((question, index) => ({
        ...question,
        value: data[index],
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
        error: "Failed to save review",
      },
    );
  };

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}>
        <PageTemplate
          breadcrumbsTitle={`Application: ${application.opportunityId}`}
          pageTitle="Review application"
          pageDescription="Review a candidate."
          buttons={[
            <Button variant="default" type="submit">
              <Save className="mr-2" />
              Save
            </Button>,
            <Button size="icon" asChild>
              <div>
                <DeleteAlertDialog
                  inputReviewId={review.id}
                  inputOpportunityId={application.opportunityId}
                />
              </div>
            </Button>,
          ]}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Application
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[80vh] overflow-y-auto">
                <div className="flex flex-col gap-12">
                  {applicationFields
                    .filter((field) => !!field.value)
                    .map((field) => (
                      <ApplicationField key={field.key} field={field} />
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Review
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[80vh] overflow-y-auto">
                <div className="flex flex-col gap-12">
                  {questions.map((question, index) => (
                    <QuestionField
                      question={question}
                      index={index}
                      key={question.key}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </PageTemplate>
      </form>
    </Form>
  );
};
