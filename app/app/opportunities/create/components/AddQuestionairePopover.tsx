import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { SubmitHandler, UseFieldArrayAppend, useForm } from "react-hook-form";
import { FormSchema, FullFormSchema, PhaseSchema } from "../schema";
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

interface AddQuestionairePopoverProps {
  append: UseFieldArrayAppend<
    z.infer<typeof FullFormSchema>,
    `defineSteps.${number}.forms`
  >;
}

export const AddQuestionairePopover = ({
  append,
}: AddQuestionairePopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", questions: [] },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = (data) => {
    append({ name: data.name, questions: [] });
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
          + Add Questionaire
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Add Questionaire
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
