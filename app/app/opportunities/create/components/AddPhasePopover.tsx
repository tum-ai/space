import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { SubmitHandler, UseFieldArrayAppend, useForm } from "react-hook-form";
import { FullFormSchema, PhaseSchema } from "../schema";
import { z } from "zod";
import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AddPhasePopoverProps {
  append: UseFieldArrayAppend<z.infer<typeof FullFormSchema>, "defineSteps">;
}

export const AddPhasePopover = ({ append }: AddPhasePopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const form = useForm<z.infer<typeof PhaseSchema>>({
    resolver: zodResolver(PhaseSchema),
    defaultValues: { name: "", forms: [] },
  });

  const onSubmit: SubmitHandler<z.infer<typeof PhaseSchema>> = (data) => {
    append({ name: data.name, forms: [] });
    form.reset();
    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={(open) => setPopoverOpen(open)}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="w-full text-sm font-medium text-gray-300 dark:text-gray-600"
        >
          + Add phase
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Add Phase
        </h4>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Screening" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            // TODO: Fix handle submit not validating
            onSubmit(form.getValues());
          }}
        >
          Add
        </Button>
      </PopoverContent>
    </Popover>
  );
};
