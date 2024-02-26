import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { Badge } from "@components/ui/badge";
import {
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "@components/ui/button";
import { PopoverClose } from "@radix-ui/react-popover";
import { Separator } from "@components/ui/separator";
import { z } from "zod";
import { FullFormSchema, PhaseSchema } from "../schema";
import { Card } from "@components/ui/card";

interface Props {
  index: number;
  phase: z.infer<typeof PhaseSchema>;
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<z.infer<typeof FullFormSchema>, "defineSteps">;
}

export default function Phase({ index, phase, remove }: Props) {
  const form = useFormContext<z.infer<typeof FullFormSchema>>();
  const { fields: questionaires } = useFieldArray({
    control: form.control,
    name: `defineSteps.${index}.forms`,
  });

  return (
    <div className="flex min-h-[250px] flex-col items-start">
      <div className="flex h-14 w-5/6 items-center justify-between">
        <div className="flex items-center space-x-1.5 text-sm font-medium">
          <Badge variant="secondary">{index + 1}</Badge>
          <h4>{phase.name}</h4>
        </div>
        <Button onClick={() => remove(index)} size="icon" variant="ghost">
          <TrashIcon width={18} height={18} />
        </Button>
      </div>
      <Separator className="mb-4 mt-1 h-[2px]" />
      <div className="flex h-full w-4/5 flex-col items-center justify-center gap-2">
        {questionaires.map((form, index) => (
          <Card
            key={form.id + index}
            className="flex w-full items-center justify-between py-2 pl-3 text-sm font-light hover:bg-gray-100"
          >
            <Button className="mr-3 text-gray-300 transition-colors duration-100 ease-in-out hover:text-gray-800">
              <TrashIcon width={18} height={18} />
            </Button>
          </Card>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
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
              <PopoverClose asChild>
                <Button variant="secondary">Add</Button>
              </PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
