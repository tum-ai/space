import { ButtonIcon } from "@components/IconButton";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import Input from "@components/Input";
import { Popover, PopoverContent } from "@components/ui/popover";
import { Separator } from "@components/ui/separator";
import { Cross1Icon, TrashIcon } from "@radix-ui/react-icons";
import { PopoverClose, PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";
import Dialog from "@components/Dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";

interface PhaseProps {
  title: string;
  forms: string[];
  index: number;
}

export default function DefinePhases({ phases, changeForm }) {
  const [currentPhases, setCurrentPhases] = useState(phases);
  const [currentPhaseName, setCurrentPhaseName] = useState("");
  const [currentFormName, setCurrentFormName] = useState("");

  function addNewPhase(title: string, initialFormName: string) {
    const newPhases = {
      ...currentPhases,
      [title]: [initialFormName],
    };

    setCurrentPhases(newPhases);
  }

  function addFormToPhase(phaseName: string, newForm: string) {
    const updatedPhases = {
      ...currentPhases,
      [phaseName]: [...currentPhases[phaseName], newForm],
    };
    setCurrentPhases(updatedPhases);
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Object.entries(currentPhases).map(
        ([phase, forms]: [string, string[]], index: number) => (
          <Phase
            key={phase}
            title={phase}
            forms={forms}
            index={index}
            handler={changeForm}
          />
        ),
      )}
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
                <div className="grid grid-cols-3 items-center gap-4">
                  <p>Name</p>
                  <Input
                    id="phaseName"
                    placeholder="Interview"
                    className="col-span-2 h-8"
                    value={currentPhaseName}
                    onChange={(c) => setCurrentPhaseName(c.target.value)}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <p>Form</p>
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
  );
}

function Phase({ title, forms, index, handler }) {
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

        <Dialog
          trigger={
            <Button
              variant="outline"
              className="w-full text-gray-300 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-300"
            >
              + add form
            </Button>
          }
        >
          <DialogClose className="float-right">
            <Cross1Icon className="h-5 w-5 text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-400" />
          </DialogClose>
          <DialogBody className="flex flex-col gap-4">
            <Input
              label="Form name"
              placeholder="add form name here"
              fullWidth
            ></Input>
            <Button>Add form</Button>
          </DialogBody>
        </Dialog>
      </div>
    </div>
  );
}
