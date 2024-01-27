import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import Input from "@components/Input";
import { Popover, PopoverContent } from "@components/ui/popover";
import { Separator } from "@components/ui/separator";
import { PopoverClose, PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { FormMessage } from "@components/ui/form";
import Phase from "./Phase";

export default function DefinePhases({ changeForm, form }) {
  const [currentPhaseName, setCurrentPhaseName] = useState("");
  const [currentFormName, setCurrentFormName] = useState("");

  const {
    fields: phaseFields,
    append: appendPhase,
    remove: removePhase,
  } = useFieldArray({
    control: form.control,
    name: "defineSteps",
  });

  function getPhaseError() {
    const phaseErrors = form.formState.errors.defineSteps;
    if (phaseErrors && phaseErrors.message) {
      return phaseErrors.message;
    }
    return "";
  }

  const phaseErrorMessages = getPhaseError();

  function handleAddPhase() {
    appendPhase({
      phaseName: currentPhaseName,
      forms: [{ formName: currentFormName, questions: [] }],
    });
    setCurrentPhaseName(undefined);
    setCurrentFormName(undefined);
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {phaseFields.map((phase, index) => (
          <Phase
            key={phase.id}
            control={form.control}
            title={phase.phaseName}
            phaseIndex={index}
            handler={changeForm}
            removePhase={removePhase}
          />
        ))}
        <div className="flex min-h-[200px] flex-col items-start">
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex h-14 w-full items-center">
                <Button
                  variant="ghost"
                  className="w-full text-sm font-medium text-gray-300 dark:text-gray-600"
                >
                  + Add phase
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Phases</h4>
                  <p className="text-sm text-muted-foreground">
                    Add phases and initial forms to the opportunity.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <p>Title</p>
                    <Input
                      id="phaseName"
                      placeholder="Screening"
                      className="col-span-2 h-8"
                      value={currentPhaseName}
                      onChange={(c) => setCurrentPhaseName(c.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Form</p>
                    <Input
                      id="phaseName"
                      placeholder="General screening"
                      className="col-span-2 h-8"
                      value={currentFormName}
                      onChange={(c) => setCurrentFormName(c.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <PopoverClose asChild>
                    <Button
                      variant="secondary"
                      onClick={() => handleAddPhase()}
                    >
                      Add
                    </Button>
                  </PopoverClose>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Separator className="mb-4 mt-1 h-[2px]" />
          <div className="flex h-full w-full flex-col items-center justify-center">
            <Card className="w-full p-2 text-center text-sm font-light text-gray-300 dark:text-gray-600">
              Add phases to define forms
            </Card>
          </div>
        </div>
      </div>
      <FormMessage className="mt-2">{phaseErrorMessages}</FormMessage>
    </div>
  );
}
