"use client";

import { Button } from "@components/ui/button";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { ApplicationField } from "@components/application/applicationField";
import { SubmitHandler, useForm } from "react-hook-form";
import { Question } from "@lib/schemas/question";
import { QuestionField } from "./_components/questionField";
import { Form } from "@components/ui/form";
import { api } from "trpc/react";
import { toast } from "sonner";
import { Application, Review } from "@prisma/client";
import { Tally } from "@lib/types/tally";

interface ReviewFormProps {
  application: Application;
  review: Review;
  questions: Question[];
}
export const ReviewForm = ({
  application,
  questions,
  review,
}: ReviewFormProps) => {
  const applicationFields = (application.content as Tally).data.fields;
  const form = useForm<Question[]>({ defaultValues: questions });

  const updateMutation = api.review.update.useMutation();

  const onSubmit: SubmitHandler<Question[]> = (data) => {
    const content = Object.entries(data).map(([key, obj]) => ({
        key,
        value: obj.value
    })) as (Required<Pick<Question, "value">> & Pick<Question, "key">)[];

    toast.promise(
      updateMutation.mutateAsync({
        id: review.id,
        content,
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
        <div className="space-y-8 p-8">
          <div className="flex justify-between">
            <div>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Review application
              </h1>
              <p className="text-muted-foreground">Review a candidate</p>
            </div>

            <Button variant="default" type="submit">
              <Save className="mr-2" />
              Save
            </Button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Application
                  </h3>
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
                <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Review
                </h3>
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
        </div>
      </form>
    </Form>
  );
};
