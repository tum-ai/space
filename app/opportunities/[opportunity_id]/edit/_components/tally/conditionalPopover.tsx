import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@components/ui/hover-card";
import { QuestionView } from "../questionnaire/questionView";
import { Badge } from "@components/ui/badge";
import { ArrowRight, Minus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Button } from "@components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { OpportunitySchema } from "@lib/schemas/opportunity";
import { TallyField } from "@lib/types/tally";
import { Plus } from "lucide-react";
import { Form, useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormField, FormItem, FormLabel } from "@components/ui/form";
import { useEffect, useState } from "react";
import { Questionnaire } from "@lib/types/questionnaire";

interface ConditionPopoverProps {
  field: Extract<TallyField, { type: "DROPDOWN" }>;
}

interface ConditionConfiguration {
  questionnaireIndex: string; // Serialized array tuple [number, number]  - [phase index, questionnaire index]
  key: string;
  value: string;
}

export const ConditionPopover = ({
  field: tallyField,
}: ConditionPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const opportunityForm = useFormContext<z.infer<typeof OpportunitySchema>>();
  const form = useForm<ConditionConfiguration>();

  const [assignedQuestionnaire, setAssignedQuestionnaire] = useState<
    Questionnaire[]
  >([]);

  useEffect(() => {
    const newQuestionnaires = new Set<Questionnaire>();
    for (const phase of opportunityForm.getValues().phases) {
      for (const questionnaire of phase.questionnaires) {
        if (
          questionnaire.conditions?.some(
            (condition) => condition.key === tallyField.key,
          )
        ) {
          newQuestionnaires.add(questionnaire);
        }
      }
    }

    setAssignedQuestionnaire([...newQuestionnaires]);
  }, [opportunityForm, tallyField.key]);

  return (
    <Form {...form}>
      <div className="relative">
        <div className="absolute right-0 mr-20 flex gap-2">
          {assignedQuestionnaire.map((questionnaire) => {
            const condition = tallyField.options.find(
              (option) =>
                option.id ===
                questionnaire.conditions.find(
                  (condition) => condition.key === tallyField.key,
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
                            if (questionnaires[j]!.id === questionnaire.id) {
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
                          (c) => c.key !== tallyField.key,
                        ),
                      );
                    }}
                  >
                    <Badge>
                      <Minus />
                      {questionnaire.name}
                    </Badge>
                  </button>
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
          })}
        </div>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <Button size="icon" type="button" variant="outline">
              <Plus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="space-y-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Add condition
            </h3>
            <FormField
              control={form.control}
              name="questionnaireIndex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign following questionnaire</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={JSON.stringify(field.value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {opportunityForm.watch(`phases`).map((phase, i) => (
                        <SelectGroup key={phase.id}>
                          <SelectLabel>{phase.name}</SelectLabel>
                          {phase.questionnaires.map((questionnaire, j) => (
                            <SelectItem
                              key={questionnaire.id}
                              value={JSON.stringify([i, j])}
                            >
                              {questionnaire.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {tallyField.type === "DROPDOWN" && (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>if this field is</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {tallyField.options.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.text}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
            <Button
              variant="secondary"
              className="w-full"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={form.handleSubmit((data) => {
                const [i, j] = JSON.parse(data.questionnaireIndex) as [
                  number,
                  number,
                ];

                const questionnaire = opportunityForm
                  .getValues()
                  .phases.at(i)
                  ?.questionnaires.at(j);

                if (!questionnaire) return;

                opportunityForm.setValue(
                  `phases.${i}.questionnaires.${j}.conditions`,
                  [
                    ...(questionnaire.conditions ?? []),
                    { key: tallyField.key, value: data.value },
                  ],
                );

                setPopoverOpen(false);
              }, console.error)}
            >
              Add
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </Form>
  );
};
