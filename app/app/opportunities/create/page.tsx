"use client";

import { GeneralInformation } from "./components/GeneralInformation";
import { DefineSteps } from "./components/DefineSteps";
import { Tabs, TabsTrigger, TabsContent, TabsList } from "@components/ui/tabs";
import { Form } from "@components/ui/form";
import { UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { FullFormSchema } from "./schema";
import { ArrowRightIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateOpportunityHeaderProps {
  form: UseFormReturn<z.infer<typeof FullFormSchema>>;
}
function CreateOpportunityHeader({ form }: CreateOpportunityHeaderProps) {
  const isFormSubmitted = form.formState.isSubmitted;
  const hasNoGeneralInformationErrors =
    !form.formState.errors.generalInformation && isFormSubmitted;

  return (
    <div className="mb-12 flex flex-col space-y-6">
      <div className="flex flex-col gap-3">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create new opportunity
        </h1>

        <p className="text-muted-foreground">Configure a new opportunity</p>
      </div>
      <TabsList className="self-center">
        <TabsTrigger value="general">
          <div className="flex flex-row items-center space-x-1">
            {hasNoGeneralInformationErrors ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <Cross2Icon className="h-4 w-4 text-red-500" />
            )}
            <p>General information</p>
          </div>
        </TabsTrigger>
        <ArrowRightIcon className="mx-2 h-5 w-5" />
        <TabsTrigger value="steps">Define steps</TabsTrigger>
      </TabsList>
    </div>
  );
}

export default function CreateOpportunity() {
  const form = useForm<z.infer<typeof FullFormSchema>>({
    mode: "all",
    resolver: zodResolver(FullFormSchema),
    defaultValues: {
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
        <CreateOpportunityHeader form={form} />
        <Form {...form}>
          <form onSubmit={void form.handleSubmit(onSubmit)}>
            <TabsContent value="general">
              <GeneralInformation form={form} />
            </TabsContent>
            <TabsContent value="steps">
              <DefineSteps form={form} />
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
