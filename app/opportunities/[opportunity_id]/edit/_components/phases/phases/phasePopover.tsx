import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import {
  type SubmitHandler,
  useForm,
  type UseFormProps,
} from "react-hook-form";
import { PhaseSchema } from "@lib/schemas/opportunity";
import { type z } from "zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { type Phase as PhaseType } from "@lib/types/opportunity";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@lib/utils";
import { Checkbox } from "@components/ui/checkbox";

type Props = {
  onSave: (phase: PhaseType) => void;
  children?: React.ReactNode;
  defaultValues?: UseFormProps<z.infer<typeof PhaseSchema>>["defaultValues"];
  className?: string;
  align?: "center" | "start" | "end";
};

export const PhasePopover = ({
  onSave,
  children,
  defaultValues: initialDefaultValues,
  className,
  align = "center",
}: Props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const defaultValues = {
    id: uuidv4(),
    name: "",
    questionnaires: [],
    isInterview: false,
  };

  const form = useForm<z.infer<typeof PhaseSchema>>({
    resolver: zodResolver(PhaseSchema.omit({ order: true })),
    defaultValues: initialDefaultValues ?? defaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof PhaseSchema>> = (data) => {
    onSave(data);

    if (!initialDefaultValues) {
      form.reset(defaultValues);
    }

    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        {!!children ? (
          children
        ) : (
          <Button variant="outline" size="sm" className={cn(className)}>
            <Plus className="mr-2" />
            {initialDefaultValues ? "Edit" : "Add"} Phase
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent align={align}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSave, console.error)}
            className="space-y-4"
          >
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              {initialDefaultValues ? "Edit" : "Add"} Phase
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

            <FormField
              control={form.control}
              name="isInterview"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is Interview</FormLabel>
                    <FormDescription>
                      Applications for interviews can be manually picked
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button
              variant="secondary"
              className="w-full"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={form.handleSubmit(onSubmit, (err) => console.error(err))}
            >
              <Save className="mr-2" />
              Save
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
