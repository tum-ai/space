import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@components/ui/hover-card";
import { QuestionView } from "../questionnaire/questionView";
import { Badge } from "@components/ui/badge";
import { Questionnaire } from "@lib/types/questionnaire";
import { ArrowRight, Minus } from "lucide-react";
import { TallyField } from "@lib/types/tally";

interface Props {
  questionnaire: Questionnaire;
  field: Extract<TallyField, { type: "DROPDOWN" }>;
}

export const AssignedQuestionnaireBadge = ({ questionnaire, field }: Props) => {
  const condition = field.options.find(
    (option) =>
      option.id ===
      questionnaire.conditions.find((condition) => condition.key === field.key)
        ?.value,
  );

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Badge className="cursor-pointer">
          <Minus />
          {questionnaire.name}
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="flex items-center gap-2 font-semibold tracking-tight">
          <p>{condition?.text}</p>
          <ArrowRight className="text-2xl" />
          <p>{questionnaire.name}</p>
        </p>
        {questionnaire.questions?.map((question) => (
          <QuestionView key={question.key} question={question} />
        ))}
      </HoverCardContent>
    </HoverCard>
  );
};
