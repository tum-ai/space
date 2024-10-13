"use client";

import Phase from "./phases/phase";
import { type z } from "zod";
import { PhasePopover } from "./phases/phasePopover";
import { type PhasesSchema } from "@lib/schemas/opportunity";
import { Button } from "@components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { usePhasesContext } from "./usePhasesStore";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  restrictToHorizontalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

interface Props {
  update: (input: z.infer<typeof PhasesSchema>) => Promise<void>;
}

export function EditPhasesForm({ update }: Props) {
  const phases = usePhasesContext((s) => s.phases);
  const setPhases = usePhasesContext((s) => s.setPhases);
  const appendPhase = usePhasesContext((s) => s.appendPhase);

  async function onSubmit() {
    const id = toast.loading("Updating phases");
    try {
      await update({ phases });
      toast.success("Successfully updated phases", { id });
    } catch (err) {
      toast.error("Failed to update phases", { id });
    }
  }

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <section className="flex flex-col gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Phases
          </h3>
          <p className="text-muted-foreground">
            Configure the different phases applicants will go through
          </p>
        </div>

        <ScrollArea className="w-full">
          <div className="group/phases flex min-h-80 gap-4">
            <DndContext
              modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event;

                if (active.id !== over?.id) {
                  const oldIndex = phases.findIndex((p) => p.id === active.id);
                  const newIndex = phases.findIndex((p) => p.id === over?.id);
                  const newPhases = arrayMove(phases, oldIndex, newIndex).map(
                    (phase, i) => ({
                      ...phase,
                      order: i,
                    }),
                  );
                  setPhases(newPhases);
                }
              }}
            >
              <SortableContext items={phases}>
                {phases.map((phase, index) => (
                  <Phase
                    key={phase.id}
                    index={index}
                    className="min-w-0 shrink-0"
                  />
                ))}
              </SortableContext>
            </DndContext>

            <PhasePopover
              onSave={(data) => appendPhase({ ...data, order: phases.length })}
              className="flex w-max opacity-0 transition-opacity group-hover/phases:opacity-100"
            />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="flex justify-end gap-2">
          <Button type="button" onClick={onSubmit}>
            <Save className="mr-2" />
            Save
          </Button>
        </div>
      </div>
    </section>
  );
}
