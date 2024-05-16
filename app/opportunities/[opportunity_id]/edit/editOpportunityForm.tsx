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
import Breadcrumbs from "@components/ui/breadcrumbs";
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
        <Tabs defaultValue="general" className="p-8">
          <div className="mb-12 flex flex-col space-y-6">
            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <Breadcrumbs
                  title={"Edit: " + form.getValues().generalInformation.title}
                />
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Edit opportunity
                </h1>
                <p className="text-muted-foreground">
                  Configure an existing opportunity
                </p>
              </div>

              <div className="flex gap-2">
                <DeleteButton
                  id={form.watch("id")!}
                  title={form.watch("generalInformation.title")}
                />
                <Button type="submit">
                  <Save className="mr-2" />
                  Save
                </Button>
              </div>
            </div>

            <TabsList className="self-center">
              <TabsTrigger value="general">General</TabsTrigger>
              <ArrowRightIcon className="mx-2 h-5 w-5" />
              <TabsTrigger value="steps">Phases</TabsTrigger>
              <ArrowRightIcon className="mx-2 h-5 w-5" />
              <TabsTrigger value="tally">Tally</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="general">
            <GeneralInformation />
          </TabsContent>

          <TabsContent value="tally">
            <TallyForm />
          </TabsContent>

          <TabsContent value="steps">
            <Phases />
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};
