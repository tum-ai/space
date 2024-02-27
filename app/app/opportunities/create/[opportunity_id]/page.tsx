"use client";

import { GeneralInformation } from "./_components/general";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@components/ui/tabs";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FullFormSchema } from "./schema";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Phases } from "./_components/phases";
import { TallyForm } from "./_components/tallyForm";

export default function CreateOpportunity({
  params,
}: {
  params: { opportunity_id: string };
}) {
  const form = useForm<z.infer<typeof FullFormSchema>>({
    resolver: zodResolver(FullFormSchema),
    defaultValues: {
      id: params.opportunity_id,
      generalInformation: {
        tallyID: "",
        title: "",
        start: undefined,
        end: undefined,
        description: "",
        admins: [],
        screeners: [],
      },
      defineSteps: [],
    },
  });

  function onSubmit(values: z.infer<typeof FullFormSchema>) {
    console.log(values);
  }

  return (
    <div className="h-full p-8">
      <Tabs defaultValue="general">
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
            <TabsTrigger value="tally">Tally Form</TabsTrigger>
            <ArrowRightIcon className="mx-2 h-5 w-5" />
            <TabsTrigger value="steps">Define steps</TabsTrigger>
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

            <TabsContent value="tally">
              <TallyForm />
            </TabsContent>

            <TabsContent value="steps">
              <Phases />
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}