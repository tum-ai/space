import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@components/ui/button";
import { FullFormSchema } from "../schema";
import Phase from "./Phase";
import { z } from "zod";
import { AddPhasePopover } from "./AddPhasePopover";
import { Separator } from "@components/ui/separator";
import { useState } from "react";
import { Questionnaires } from "./Questionnaires";

export function Phases() {
  const form = useFormContext<z.infer<typeof FullFormSchema>>();
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "defineSteps",
  });

  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<
    [number, number] | undefined
  >(undefined);

  return (
    <div className="space-y-14">
      <div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {fields.map((phase, index) => (
            <Phase
              key={phase.name}
              index={index}
              phase={phase}
              remove={remove}
              update={update}
              setSelectedQuestionnaire={setSelectedQuestionnaire}
            />
          ))}

          <div className="flex min-h-[250px] flex-col items-start">
            <AddPhasePopover append={append} />

            <Separator className="mb-4 mt-1 h-[2px]" />

            <div className="w-full p-2 text-center text-sm font-light text-gray-300 dark:text-gray-600">
              Add phases to define questionnaires
            </div>
          </div>
        </div>
      </div>

      {selectedQuestionnaire && (
        <Questionnaires
          key={`questionnaire-${selectedQuestionnaire[0]}-${selectedQuestionnaire[1]}`}
          selected={selectedQuestionnaire}
        />
      )}

      <div className="flex justify-end">
        <Button type="submit">Create Opportunity</Button>
      </div>
    </div>
  );
}
