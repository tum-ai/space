import { useFieldArray, useFormContext } from "react-hook-form";
import { FullFormSchema } from "../schema";
import Phase from "./phase";
import { z } from "zod";
import { AddPhasePopover } from "./addPhasePopover";
import { Separator } from "@components/ui/separator";
import { useState } from "react";
import { Questionnaires } from "./questionnaires";
import { Button } from "@components/ui/button";

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

        <div className="grid min-h-[250px] grid-rows-[3rem,_1fr]">
          <AddPhasePopover append={append} />

          <div>
            <Separator />
            <p className="mt-4 w-full text-center text-sm text-muted-foreground">
              Add phases to define questionnaires
            </p>
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