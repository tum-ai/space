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
import { Form, useForm } from "react-hook-form";
import { Question } from "@lib/schemas/question";
import { Tally } from "@lib/types/tally";

interface ReviewFormProps {
  applicationContent: Tally;
  questions: Question[];
}
export const ReviewForm = ({
  applicationContent,
  questions,
}: ReviewFormProps) => {
  const applicationFields = applicationContent.data.fields;
  const form = useForm<Question[]>();

  return (
    <Form {...form}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
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

          <div className="h-[80vh]">
            <ResizablePanelGroup direction="horizontal" className="flex gap-4">
              <ResizablePanel>
                <Card className="sticky max-h-full overflow-y-auto">
                  <CardHeader>
                    <CardTitle>
                      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                        Application
                      </h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="sticky grid gap-12">
                      {applicationFields
                        .filter((field) => !!field.value)
                        .map((field) => (
                          <ApplicationField key={field.key} field={field} />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel>
                <Card className="sticky max-h-full overflow-y-auto">
                  <CardHeader>
                    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                      Review
                    </h3>
                  </CardHeader>
                  <CardContent>
                    {questions.map((question) => question.label)}
                  </CardContent>
                </Card>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </form>
    </Form>
  );
};
