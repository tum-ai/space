import { QuestionSchema } from "@lib/schemas/question";
import { QuestionField } from "app/opportunities/[opportunity_id]/review/[review_id]/_components/questionField";
import { ChevronDownSquare, ListTodo, Type } from "lucide-react";
import { z } from "zod";

interface QuestionViewProps {
  question: z.infer<typeof QuestionSchema>;
}
export const QuestionView = ({ question }: QuestionViewProps) => {
  switch (question.type) {
    case "INPUT_TEXT":
      return (
        <div className="flex w-full gap-4">
          <Type />
          <div className="w-full">
            <QuestionField index={0} question={question} />
          </div>
        </div>
      );
    case "DROPDOWN":
      return (
        <div className="flex w-full gap-4">
          <ChevronDownSquare />
          <div className="w-full">
            <QuestionField index={0} question={question} />
          </div>
        </div>
      );
    case "CHECKBOXES":
      return (
        <div>
          <div className="flex w-full gap-4">
            <ListTodo />
            <div className="w-full">
              <QuestionField index={0} question={question} />
            </div>
          </div>
        </div>
      );
  }
};
