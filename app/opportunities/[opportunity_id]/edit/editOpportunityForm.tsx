"use client";

import { GeneralInformation } from "./_components/general";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Form } from "@components/ui/form";
import { UseFormProps, useForm } from "react-hook-form";
import { z } from "zod";
import { OpportunitySchema } from "@lib/schemas/opportunity";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phases } from "./_components/phases";
import { TallyForm } from "./_components/tally/tallyForm";
import { ArrowRightIcon, Save } from "lucide-react";
import { api } from "trpc/react";
import { toast } from "sonner";
import { Button } from "@components/ui/button";
import { DeleteButton } from "./_components/deleteButton";
import PageTemplate from "@components/PageTemplate";
export interface EditOpportunityFormProps {
  initialValues: UseFormProps<
    z.infer<typeof OpportunitySchema>
  >["defaultValues"];
}

export const EditOpportunityForm = ({
  initialValues,
}: EditOpportunityFormProps) => {
  const form = useForm<z.infer<typeof OpportunitySchema>>({
    resolver: zodResolver(OpportunitySchema),
    defaultValues: initialValues,
  });

  const updateMutation = api.opportunity.update.useMutation();

  async function onSubmit(values: z.infer<typeof OpportunitySchema>) {
    const id = toast.loading("Updating opportunity");
    try {
      await updateMutation.mutateAsync(values);
      toast.success("Successfully updated opportunity", { id });
    } catch (err) {
      toast.error("Failed to update opportunity", { id });
    }
  }

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}
      >
        <Tabs defaultValue="general">
          <PageTemplate
            breadcrumbsTitle="Edit"
            opportunityTitle={form.getValues().generalInformation.title}
            pageTitle="Edit opportunity"
            pageDescription="Configure an existing opportunity."
            buttons={[
              <DeleteButton //Different delete icon compared to reviewFrom
                id={form.watch("id")!}
                title={form.watch("generalInformation.title")}
              />,
              <Button type="submit">
                <Save className="mr-2" />
                Save
              </Button>,
            ]}
          >
            <TabsList className="mt-2 self-center">
              <TabsTrigger value="general">General</TabsTrigger>
              <ArrowRightIcon className="mx-2 h-5 w-5" />
              <TabsTrigger value="steps">Phases</TabsTrigger>
              <ArrowRightIcon className="mx-2 h-5 w-5" />
              <TabsTrigger value="tally">Tally</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <GeneralInformation />
            </TabsContent>
            <TabsContent value="steps">
              <Phases />
            </TabsContent>
            <TabsContent value="tally">
              <TallyForm />
            </TabsContent>
          </PageTemplate>
        </Tabs>
      </form>
    </Form>
  );
};
