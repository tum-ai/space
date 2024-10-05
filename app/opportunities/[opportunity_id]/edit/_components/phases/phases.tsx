import { useFieldArray, useFormContext } from "react-hook-form";
import { OpportunitySchema } from "@lib/schemas/opportunity";
import Phase from "./phase";
import { z } from "zod";
import { Separator } from "@components/ui/separator";
import { AddPhasePopover } from "./addPhasePopover";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

export function Phases() {
  const form = useFormContext<z.infer<typeof OpportunitySchema>>();
  const { fields, append, remove, update, move } = useFieldArray({
    control: form.control,
    name: "phases",
  });

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const positionActivePhase = fields.findIndex(
      (phase) => phase.id === active.id,
    );
    const positionOverPhase = fields.findIndex((phase) => phase.id === over.id);

    return move(positionActivePhase, positionOverPhase);
  }

  return (
    <div>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Phases
      </h2>

      <div className="space-y-14">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <SortableContext items={fields.map((phase) => phase.id)}>
              {fields.map((phase, index) => (
                <Phase
                  key={phase.name}
                  index={index}
                  phase={phase}
                  remove={remove}
                  update={update}
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
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
}
