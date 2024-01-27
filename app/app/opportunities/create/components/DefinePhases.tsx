import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import Input from "@components/Input";
import { Popover, PopoverContent } from "@components/ui/popover";
import { Separator } from "@components/ui/separator";
import { PopoverClose, PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { FormMessage } from "@components/ui/form";
import { TrashIcon } from "@radix-ui/react-icons";
import { ButtonIcon } from "@components/IconButton";

export default function DefinePhases({ phases, changeForm, form }) {
  const [currentPhaseName, setCurrentPhaseName] = useState("");
  const [currentFormName, setCurrentFormName] = useState("");

  const {
    fields: phaseFields,
    append: appendPhase,
    remove: removePhase,
    update: updatePhase,
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
                  {/* TODO: validate the input */}
                  <PopoverClose asChild>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        appendPhase({
                          phaseName: currentPhaseName,
                          forms: [{ formName: currentFormName, questions: [] }],
                        })
                      }
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

function Phase({ title, phaseIndex, handler, control, removePhase }) {
  const {
    fields: formFields,
    append: appendForm,
    remove: removeForm,
  } = useFieldArray({
    control,
    name: `defineSteps[${phaseIndex}].forms`,
  });
  const [currentFormName, setCurrentFormName] = useState("");

  return (
    <div className="flex min-h-[250px] flex-col items-start">
      <div className="flex h-14 w-5/6 items-center justify-between">
        <div className="flex items-center space-x-1.5 text-sm font-medium">
          <Badge variant="secondary">{phaseIndex + 1}</Badge>
          <h4>{title}</h4>
        </div>
        <ButtonIcon
          icon={<TrashIcon width={18} height={18} />}
          onClick={() => removePhase(phaseIndex)}
          className="text-gray-300 mr-1.5"
        ></ButtonIcon>
      </div>
      <Separator className="mb-4 mt-1 h-[2px]" />
      <div className="flex h-full w-4/5 flex-col items-center justify-center gap-2">
        {formFields.map((form, index) => (
          <Form
            formIndex={index}
            formName={form.formName}
            questions={form.questions}
            handler={handler}
          />
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full text-gray-300 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300"
            >
              + add form
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Forms</h4>
                <p className="text-sm text-muted-foreground">
                  Add spcialized forms to phases.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <p>Name</p>
                  <Input
                    id="phaseName"
                    placeholder="Screening"
                    className="col-span-2 h-8"
                    value={currentFormName}
                    onChange={(c) => setCurrentFormName(c.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end">
                {/* TODO: validate the input */}
                <PopoverClose asChild>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      appendForm({ formName: currentFormName, questions: [] })
                    }
                  >
                    Add
                  </Button>
                </PopoverClose>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function Form({ formName, questions, handler, formIndex }) {
  return (
    <Button
      className="w-full px-4 py-2 text-sm font-light"
      variant="outline"
      value={formName}
      onClick={() => handler(formName)}
    >
      {formName}
    </Button>
  );
}
