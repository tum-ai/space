"use client";

import { type z } from "zod";
import { GeneralInformationSchema } from "@lib/schemas/opportunity";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Opportunity } from "@prisma/client";
import { GeneralInformation } from "../../../../_components/generalForm";
import { DeleteButton } from "../deleteButton";

interface Props {
  defaultValues: z.infer<typeof GeneralInformationSchema>;
  update: (
    input: z.infer<typeof GeneralInformationSchema>,
  ) => Promise<Opportunity>;
}
const EditGeneralForm = ({ defaultValues, update }: Props) => {
  const form = useForm<z.infer<typeof GeneralInformationSchema>>({
    resolver: zodResolver(GeneralInformationSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof GeneralInformationSchema>) {
    const id = toast.loading("Saving opportunity");
    try {
      await update(values);
      toast.success("Successfully saved opportunity", { id });
    } catch (err) {
      toast.error("Failed to save opportunity", { id });
    }
  }

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}
        className="flex flex-col gap-4"
      >
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          General Information
        </h3>
        <GeneralInformation />
        <div className="flex justify-end gap-2">
          <DeleteButton
            title={form.getValues().title}
            id={form.getValues().opportunityId!}
          />

          <Button type="submit">
            <Save className="mr-2" />
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditGeneralForm;
