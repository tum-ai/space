"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";
import { Button } from "@components/ui/button";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { ApplicationField } from "@components/application/applicationField";
import { SubmitHandler, useForm } from "react-hook-form";
import { Question } from "@lib/schemas/question";
import { Tally } from "@lib/types/tally";
import { QuestionField } from "./_components/questionField";
import { Form } from "@components/ui/form";

interface ReviewFormProps {
  applicationContent: Tally;
  questions: Question[];
}
export const ReviewForm = ({
  applicationContent,
  questions,
}: ReviewFormProps) => {
  const applicationFields = applicationContent.data.fields;
  const form = useForm<Question[]>({ defaultValues: questions });

  const onSubmit: SubmitHandler<Question[]> = (data) => console.log(data);

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
