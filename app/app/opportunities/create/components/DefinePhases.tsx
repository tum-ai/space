import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Popover, PopoverContent } from "@components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";

interface PhaseProps {
  title: string;
  forms: string[];
  index: number;
}

export default function DefinePhases({ phases }) {
  const [currentPhases, setCurrentPhases] = useState(phases);

  return (
    <div className="grid grid-cols-4">
      {Object.entries(phases).map(
        ([phase, forms]: [string, string[]], index: number) => (
          <Phase key={phase} title={phase} forms={forms} index={index} />
        ),
      )}
      <div className="flex min-h-[200px] flex-col items-start">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="text-gray-300">
              + Add phase
            </Button>
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
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <p>Form</p>
                  <Input
                    id="phaseName"
                    placeholder="Screening"
                    className="col-span-2 h-8"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className="my-1 w-full border border-gray-500"></div>
        <div className="flex h-full w-32 flex-col items-center justify-center">
          <Button variant="secondary">+ Add form</Button>
        </div>
      </div>
    </div>
  );
}

function Phase({ title, forms, index }: PhaseProps) {
  return (
    <div className="flex min-h-[250px] flex-col items-start">
      <h3 className="flex h-10 items-center">
        {index + 1} {title}
      </h3>
      <div className="my-2 w-full border border-gray-500"></div>
      <div className="flex h-full w-4/5 flex-col items-center justify-center gap-2">
        {forms.map((form) => (
          <Card className="w-full p-2">{form}</Card>
        ))}
        <Card className="w-full p-2 font-light text-gray-300">+ Add form</Card>
      </div>
    </div>
  );
}
