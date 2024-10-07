"use client";

import { useFieldArray, useForm } from "react-hook-form";
import Phase from "./phases/phase";
import { type z } from "zod";
import { Separator } from "@components/ui/separator";
import { AddPhasePopover } from "./phases/addPhasePopover";
import { PhasesSchema } from "@lib/schemas/opportunity";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import { Save } from "lucide-react";
import { Form } from "@components/ui/form";
import { toast } from "sonner";
import { TallyForm } from "./tally/tallyForm";

interface Props {
  update: (input: z.infer<typeof PhasesSchema>) => Promise<void>;
  defaultValues: z.infer<typeof PhasesSchema>;
}

export function EditPhasesForm({ defaultValues, update }: Props) {
  const form = useForm<z.infer<typeof PhasesSchema>>({
    resolver: zodResolver(PhasesSchema),
    defaultValues,
  });

  const {
    fields: phases,
    append: appendPhases,
    remove: removePhases,
    update: updatePhases,
  } = useFieldArray({
    keyName: "fieldId",
    control: form.control,
    name: "phases",
  });

  async function onSubmit(values: z.infer<typeof PhasesSchema>) {
    const id = toast.loading("Updating phases");
    try {
      await update(values);
      toast.success("Successfully updated phases", { id });
    } catch (err) {
      toast.error("Failed to update phases", { id });
    }
  }

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}
        className="flex flex-col space-y-12 p-8"
      >
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between">
            <div className="flex flex-col gap-3">
              <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Review Process
              </h2>
            </div>

            <Button type="submit">
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
            <div className="flex min-h-80 gap-4">
              {phases.map((phase, index) => (
                <Phase
                  key={phase.name}
                  index={index}
                  phase={phase}
                  remove={removePhases}
                  update={updatePhases}
                />
              ))}

              <AddPhasePopover append={appendPhases} />
            </div>
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
            <TallyForm />
          </div>
        </div>
      </form>
    </Form>
  );
}
