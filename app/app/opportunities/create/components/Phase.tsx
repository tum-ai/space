import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Badge } from "@components/ui/badge";
import { useFieldArray } from "react-hook-form";
import { useState } from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@components/ui/button";
import Input from "@components/Input";
import { PopoverClose } from "@radix-ui/react-popover";
import { Separator } from "@components/ui/separator";
import Form from "./Form";

export default function Phase({
  title,
  phaseIndex,
  questionHandler,
  form,
  removePhase,
}) {
  const {
    fields: formFields,
    append: appendForm,
    remove: removeForm,
  } = useFieldArray({
    control: form.control,
    name: `defineSteps[${phaseIndex}].forms`,
  });

  const [currentFormName, setCurrentFormName] = useState("");

  function handleAddForm() {
    appendForm({ formName: currentFormName, questions: [] });
    setCurrentFormName(undefined);
  }

  return (
    <div className="flex min-h-[250px] flex-col items-start">
      <div className="flex h-14 w-5/6 items-center justify-between">
        <div className="flex items-center space-x-1.5 text-sm font-medium">
          <Badge variant="secondary">{phaseIndex + 1}</Badge>
          <h4>{title}</h4>
        </div>
        <button
          onClick={() => removePhase(phaseIndex)}
          className="mr-3 text-gray-300 transition-colors duration-100 ease-in-out hover:text-gray-800"
        >
          <TrashIcon width={18} height={18} />
        </button>
      </div>
      <Separator className="mb-4 mt-1 h-[2px]" />
      <div className="flex h-full w-4/5 flex-col items-center justify-center gap-2">
        {formFields.map((form, index) => (
          <Form
            formIndex={index}
            phaseIndex={phaseIndex}
            formName={form.formName}
            questionHandler={questionHandler}
            removeForm={removeForm}
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
                <PopoverClose asChild>
                  <Button variant="secondary" onClick={() => handleAddForm()}>
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
