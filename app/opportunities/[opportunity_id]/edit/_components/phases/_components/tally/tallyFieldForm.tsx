import { ApplicationField } from "@components/application/applicationField";
import { TallyField } from "@lib/types/tally";
import { ConditionPopover } from "./conditionalPopover";
import { Questionnaire } from "@lib/types/questionnaire";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@components/ui/hover-card";
import { QuestionView } from "../questionnaire/questionView";
import { Badge } from "@components/ui/badge";
import { ArrowRight, Minus } from "lucide-react";
import { PhasesSchema } from "@lib/schemas/opportunity";

interface Props {
  field: TallyField;
}

export const TallyFieldForm = ({ field }: Props) => {
  const opportunityForm = useFormContext<z.infer<typeof PhasesSchema>>();
  const [assignedQuestionnaire, setAssignedQuestionnaire] = useState<
    Questionnaire[]
  >([]);

  useEffect(() => {
    const newQuestionnaires = new Set<Questionnaire>();
    for (const phase of opportunityForm.getValues().phases) {
      for (const questionnaire of phase.questionnaires) {
        if (
          questionnaire.conditions?.some(
            (condition) => condition.key === field.key,
          )
        ) {
          newQuestionnaires.add(questionnaire);
        }
      }
    }

    setAssignedQuestionnaire([...newQuestionnaires]);
  }, [opportunityForm, field.key]);

  return (
    <div key={field.key} className="grid w-full grid-cols-[2.5rem,_1fr] gap-6">
      <div>
        {field.type === "DROPDOWN" && <ConditionPopover field={field} />}
      </div>

      <div className="flex min-w-0 max-w-full flex-col gap-3">
        <ApplicationField field={field} className="w-full" />

        <div className="w-full overflow-x-auto">
          <div className="flex gap-2">
            {field.type === "DROPDOWN" &&
              assignedQuestionnaire.map((questionnaire) => {
                const condition = field.options.find(
                  (option) =>
                    option.id ===
                    questionnaire.conditions.find(
                      (condition) => condition.key === field.key,
                    )?.value,
                );

                return (
                  <HoverCard key={questionnaire.id}>
                    <HoverCardTrigger>
                      <button
                        type="button"
                        onClick={() => {
                          const findIndexes = (): [number, number] => {
                            const phases = opportunityForm.getValues().phases;
                            for (let i = 0; i < phases.length; i++) {
                              const questionnaires = phases[i]!.questionnaires;

                              for (let j = 0; j < questionnaires.length; j++) {
                                if (
                                  questionnaires[j]!.id === questionnaire.id
                                ) {
                                  return [i, j];
                                }
                              }
                            }
                            // Cannot happen
                            return [0, 0];
                          };

                          const [i, j] = findIndexes();

                          opportunityForm.setValue(
                            `phases.${i}.questionnaires.${j}.conditions`,

                            questionnaire.conditions.filter(
                              (c) => c.key !== field.key,
                            ),
                          );
                        }}
                      >
                        <Badge className="w-max">
                          <Minus />
                          {questionnaire.name}
                        </Badge>
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-max">
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
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
