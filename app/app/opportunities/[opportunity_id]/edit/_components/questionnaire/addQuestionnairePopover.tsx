import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { SubmitHandler, UseFieldArrayAppend, useForm } from "react-hook-form";
import {
  OpportunitySchema,
  QuestionnaireSchema,
} from "@lib/schemas/opportunity";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
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

interface AddQuestionairePopoverProps {
  append: UseFieldArrayAppend<
    z.infer<typeof OpportunitySchema>,
    `phases.${number}.questionnaires`
  >;
}

export const AddQuestionnairePopover = ({
  append,
}: AddQuestionairePopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const form = useForm<z.infer<typeof QuestionnaireSchema>>({
    resolver: zodResolver(QuestionnaireSchema),
    defaultValues: {
      id: uuidv4(),
      name: "",
      questions: [],
      reviewers: [],
      requiredReviews: 1,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof QuestionnaireSchema>> = (
    data,
  ) => {
    append(data);
    form.reset();
    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={(open) => setPopoverOpen(open)}>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="w-full">
          <Plus className="mr-2" />
          Add questionaire
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4">
        <Form {...form}>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Add Questionaire
          </h4>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input placeholder="General" {...field} />
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
