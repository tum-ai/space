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

export default function DefinePhases({ phases, changeForm, form }) {
  const [currentPhases, setCurrentPhases] = useState([]);
  const [currentPhaseName, setCurrentPhaseName] = useState("");
  const [currentFormName, setCurrentFormName] = useState("");

  const {
    fields: phaseFields,
    append: appendPhase,
    remove: removePhase,
  } = useFieldArray({
    control: form.control,
    name: "defineSteps.phases",
  });

  function addNewPhase(title: string, initialFormName: string) {
    const newPhase = {
      phaseName: title,
      forms: [{ formName: initialFormName, questions: [] }],
    };
    const updatedPhases = [...currentPhases, newPhase];
    setCurrentPhases(updatedPhases);
    form.setValue("defineSteps.phases", updatedPhases);
  }

  function addFormToPhase(phaseIndex, newFormName) {
    const newForm = { formName: newFormName, questions: [] };
    const updatedPhases = currentPhases.map((phase, index) => {
      if (index === phaseIndex) {
        return { ...phase, forms: [...phase.forms, newForm] };
      }
      return phase;
    });
    setCurrentPhases(updatedPhases);
    form.setValue("defineSteps.phases", updatedPhases);
  }

  function getPhaseError() {
    const phaseErrors = form.formState.errors.defineSteps?.phases;
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
            title={phase.phaseName}
            forms={phase.forms}
            index={index}
            handler={changeForm}
            onAddForm={addFormToPhase}
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
                        addNewPhase(currentPhaseName, currentFormName)
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

function Phase({ title, forms, index, handler, onAddForm }) {
  const [currentFormName, setCurrentFormName] = useState("");

  return (
    <div className="flex min-h-[250px] flex-col items-start">
      <div className="flex h-14 w-5/6 items-center justify-between">
        <div className="flex items-center space-x-1.5 text-sm font-medium">
          <Badge variant="secondary">{index + 1}</Badge>
          <h4>{title}</h4>
        </div>
      </div>
      <Separator className="mb-4 mt-1 h-[2px]" />
      <div className="flex h-full w-4/5 flex-col items-center justify-center gap-2">
        {forms.map((form) => (
          <Button
            className="w-full px-4 py-2 text-sm font-light"
            variant="outline"
            value={form}
            onClick={() => handler(form)}
          >
            {form}
          </Button>
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
                    onClick={onAddForm(index, currentFormName)}
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
