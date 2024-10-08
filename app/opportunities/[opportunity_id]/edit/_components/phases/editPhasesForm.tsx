"use client";

import Phase from "./phases/phase";
import { type z } from "zod";
import { AddPhasePopover } from "./phases/addPhasePopover";
import { type PhasesSchema } from "@lib/schemas/opportunity";
import { Button } from "@components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { TallyForm } from "./tally/tallyForm";
import { createPhasesStore, PhasesContext } from "./usePhasesStore";
import { useRef } from "react";
import { useStore } from "zustand";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";

interface Props {
  update: (input: z.infer<typeof PhasesSchema>) => Promise<void>;
  defaultValues: z.infer<typeof PhasesSchema>;
}

export function EditPhasesForm({ defaultValues, update }: Props) {
  const store = useRef(createPhasesStore(defaultValues)).current;
  const phases = useStore(store, (s) => s.phases);
  const appendPhase = useStore(store, (s) => s.appendPhase);

  async function onSubmit() {
    const id = toast.loading("Updating phases");
    try {
      await update({ ...defaultValues, phases });
      toast.success("Successfully updated phases", { id });
    } catch (err) {
      toast.error("Failed to update phases", { id });
    }
  }
  return (
    <PhasesContext.Provider value={store}>
      <section className="flex flex-col space-y-12 p-8">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between">
            <div className="flex flex-col gap-3">
              <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Review Process
              </h2>
            </div>

            <Button type="button" onClick={onSubmit}>
              <Save className="mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="space-y-12">
          <div className="space-y-6">
            <div>
              <h3 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Phases
              </h3>
              <p className="text-muted-foreground">
                Configure the different phases applicants will go through
              </p>
            </div>

            {/* TODO: Fix horizontal overflow */}
            <ScrollArea className="w-full">
              <div className="group/phases flex min-h-80 gap-4">
                {phases.map((phase, index) => (
                  <Phase
                    key={phase.id}
                    index={index}
                    className="min-w-0 shrink-0"
                  />
                ))}

                <AddPhasePopover
                  onSave={(data) => appendPhase(data)}
                  className="flex w-max opacity-0 transition-opacity group-hover/phases:opacity-100"
                />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Tally form
              </h3>
              <p className="text-muted-foreground">
                Configure your Tally form for the review process
              </p>
            </div>
            <TallyForm opportunityId={defaultValues.opportunityId!} />
          </div>
        </div>
      </section>
    </PhasesContext.Provider>
  );
}
