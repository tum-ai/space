import { Badge } from "@components/ui/badge";
import {
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import { z } from "zod";
import { FullFormSchema, PhaseSchema } from "../schema";
import { AddQuestionairePopover } from "./AddQuestionairePopover";
import { X } from "lucide-react";

interface Props {
  index: number;
  phase: z.infer<typeof PhaseSchema>;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<z.infer<typeof FullFormSchema>, "defineSteps">;
}

export default function Phase({ index, phase, remove: removePhase }: Props) {
  const form = useFormContext<z.infer<typeof FullFormSchema>>();
  const {
    fields: questionaires,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: `defineSteps.${index}.forms`,
  });

  return (
    <div className="flex min-h-[250px] flex-col items-start">
      <div className="flex h-14 w-5/6 items-center justify-between">
        <div className="flex items-center space-x-1.5 text-sm font-medium">
          <Badge variant="secondary">{index + 1}</Badge>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {phase.name}
          </h4>
        </div>
        <Button onClick={() => removePhase(index)} size="icon" variant="ghost">
          <X />
        </Button>
      </div>
      <Separator className="mb-4 mt-1 h-[2px]" />
      <div className="flex h-full w-4/5 flex-col items-center justify-center gap-2">
        {questionaires.map((questionaire, index) => (
          <div
            key={questionaire.id + index}
            className="flex w-full justify-between rounded-md border border-input bg-background"
          >
            <Button
              className="w-full justify-start"
              variant="ghost"
              type="button"
            >
              {questionaire.name}
            </Button>
            <Button variant="ghost" type="button" onClick={() => remove(index)}>
              <X />
            </Button>
          </div>
        ))}
        <AddQuestionairePopover append={append} />
      </div>
    </div>
  );
}
