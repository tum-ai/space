import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import {
  type SubmitHandler,
  type UseFieldArrayAppend,
  useForm,
} from "react-hook-form";
import { type PhasesSchema, PhaseSchema } from "@lib/schemas/opportunity";
import { type z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { type Phase as PhaseType } from "@lib/types/opportunity";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@lib/utils";

interface Props {
  onSave: (phase: PhaseType) => void;
  className?: string;
}

export const AddPhasePopover = ({ onSave, className }: Props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const defaultValues = {
    id: uuidv4(),
    name: ``,
    questionnaires: [],
  };

  const form = useForm<z.infer<typeof PhaseSchema>>({
    resolver: zodResolver(PhaseSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof PhaseSchema>> = (data) => {
    onSave(data);
    form.reset(defaultValues);
    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn(className)}>
          <Plus className="mr-2" /> Add Phase
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <Form {...form}>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Add Phase
          </h4>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
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
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={form.handleSubmit(onSubmit, (err) => console.error(err))}
          >
            Add
          </Button>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
