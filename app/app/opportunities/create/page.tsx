"use client";

import { GeneralInformation } from "../[opportunity_id]/edit/_components/general";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FullFormSchema } from "@lib/schemas/opportunity";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "trpc/react";
import { ArrowRightIcon, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";

export const CreateOpportunityForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof FullFormSchema>>({
    resolver: zodResolver(FullFormSchema),
    defaultValues: {
      generalInformation: {
        title: "",
        start: undefined,
        end: undefined,
        description: "",
      },
      defineSteps: [],
    },
  });
  const createMutation = api.opportunity.create.useMutation();

  async function onSubmit(values: z.infer<typeof FullFormSchema>) {
    const id = toast.loading("Creating opportunity");
    try {
      const opportunityId = await createMutation.mutateAsync(
        values.generalInformation,
      );
      toast.success("Successfully created opportunity", { id });
      router.push(`/opportunities/${opportunityId}/edit`);
    } catch (err) {
      toast.error("Failed to create opportunity", { id });
    }
  }

  return (
    <Tabs defaultValue="general" className="p-8">
      <div className="mb-12 flex flex-col space-y-6">
        <div className="flex flex-col gap-3">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Create new opportunity
          </h1>

          <p className="text-muted-foreground">Configure a new opportunity</p>
        </div>
        <TabsList className="self-center">
          <TabsTrigger value="general">General information</TabsTrigger>
          <ArrowRightIcon className="mx-2 h-5 w-5" />
          <TabsTrigger disabled value="tally">
            Tally Form
          </TabsTrigger>
          <ArrowRightIcon className="mx-2 h-5 w-5" />
          <TabsTrigger disabled value="steps">
            Define steps
          </TabsTrigger>
        </TabsList>
      </div>
      <Form {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}
        >
          <TabsContent value="general">
            <GeneralInformation />
          </TabsContent>
          <div className="mt-16 flex justify-end">
            <Button type="submit">
              <Save className="mr-2" />
              Create
            </Button>
          </div>
        </form>
      </Form>
    </Tabs>
  );
};

export default CreateOpportunityForm;
