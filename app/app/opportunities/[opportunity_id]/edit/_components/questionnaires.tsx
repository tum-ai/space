"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import { OpportunitySchema } from "@lib/schemas/opportunity";
import { CardDescription, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { QuestionForm } from "./question";

interface Props {
  selected: [number, number]; // index of selected phase and questionnaire
}
export const Questionnaires = ({ selected }: Props) => {
  const form = useFormContext<z.infer<typeof OpportunitySchema>>();
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: `defineSteps.${selected[0]}.forms.${selected[1]}.questions`,
  });

  const questionnaire = form.watch(
    `defineSteps.${selected[0]}.forms.${selected[1]}`,
  );

  if (!questionnaire) return <></>;

  return (
    <div>
      <div className="mb-4">
        <CardTitle>Edit Questionnaire</CardTitle>
        <CardDescription>{questionnaire.name}</CardDescription>
      </div>
      <div className="space-y-4">
        {fields.map((question, index) => (
          <QuestionForm
            key={question.id + index}
            question={question}
            index={index}
            update={update}
            remove={remove}
          />
        ))}

        <Button
          className="w-full"
          variant="secondary"
          type="button"
          onClick={() => append({ type: "text", question: "" })}
        >
          Add Question
        </Button>
      </div>
    </div>
  );
};
