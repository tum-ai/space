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
import { OpportunitySchema, PhaseSchema } from "@lib/schemas/opportunity";
import { GripVertical, Plus, X } from "lucide-react";
import { QuestionnaireDialog } from "../questionnaire/questionnaireDialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  index: number;
  phase: z.infer<typeof PhaseSchema>;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<z.infer<typeof OpportunitySchema>, "phases">;
}

export default function Phase({ index, phase, remove: removePhase }: Props) {
  const form = useFormContext<z.infer<typeof OpportunitySchema>>();
  const {
    fields: questionaires,
    append,
    remove,
    update,
  } = useFieldArray({
    control: form.control,
    name: `phases.${index}.questionnaires`,
  });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id:
        phase.id ??
        (() => {
          // phase id can theoretically be optional
          console.warn("No phase id found");
          return "placeholder_id";
        })(),
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
  };

  return (
    <div className="grid min-h-[250px] grid-rows-[3rem,_1fr]" style={style}>
      <div className="flex w-4/5 items-center justify-between">
        <div className="flex items-center space-x-1.5 text-sm font-medium">
          <Badge variant="secondary">{index + 1}</Badge>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {phase.name}
          </h4>
        </div>
        <div className="flex items-center">
          <Button
            onClick={() => removePhase(index)}
            size="icon"
            variant="ghost"
          >
            <X color="gray" />
          </Button>
          {/* Div required for typescript */}
          <div ref={setNodeRef}>
            <GripVertical
              {...attributes}
              {...listeners}
              color="gray"
            ></GripVertical>
          </div>
        </div>
      </div>
      <div>
        <Separator />
        <div className="justify-top flex h-full w-4/5 flex-col items-center gap-2 pt-2">
          {questionaires.map((questionnaire, index) => (
            <QuestionnaireDialog
              key={questionnaire.id}
              defaultValues={questionnaire}
              onSave={(data) => update(index, data)}
              onRemove={() => remove(index)}
            >
              <Button variant="outline" className="w-full">
                {questionnaire.name}
              </Button>
            </QuestionnaireDialog>
          ))}

          <QuestionnaireDialog onSave={(data) => append(data)}>
            <Button variant="secondary" className="w-full">
              <Plus className="mr-2" />
              Add questionaire
            </Button>
          </QuestionnaireDialog>
        </div>
      </div>
    </div>
  );
}
