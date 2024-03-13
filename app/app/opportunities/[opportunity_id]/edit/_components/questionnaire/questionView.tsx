import { QuestionSchema } from "@lib/schemas/question";
import { Type } from "lucide-react";
import { z } from "zod";

interface QuestionViewProps {
  question: z.infer<typeof QuestionSchema>;
}
export const QuestionView = ({ question }: QuestionViewProps) => {
  switch (question.type) {
    case "INPUT_TEXT":
      return (
        <div className="flex gap-4">
          <Type />
          <div className="flex items-center">
            <p>{question.label}</p>
          </div>
        </div>
      );
    case "DROPDOWN":
      return (
        <div className="flex gap-4">
          <Type />
          <div className="flex items-center">
            <p>{question.label}</p>
          </div>
        </div>
      );
    case "CHECKBOXES":
      return (
        <div className="flex gap-4">
          <Type />
          <div className="flex items-center">
            <p>{question.label}</p>
          </div>
        </div>
      );
  }
};
