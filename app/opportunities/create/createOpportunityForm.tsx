"use client";

import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OpportunitySchema } from "@lib/schemas/opportunity";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "trpc/react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";
import { GeneralInformation } from "../[opportunity_id]/edit/_components/general";
import { Session } from "next-auth";
import PageTemplate from "@components/PageTemplate";

interface Props {
  session: Session;
}
const CreateOpportunityForm = ({ session }: Props) => {
  const user = session.user;

  const router = useRouter();
  const form = useForm<z.infer<typeof OpportunitySchema>>({
    resolver: zodResolver(OpportunitySchema),
    defaultValues: {
      generalInformation: {
        admins: [
          {
            id: user.id,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
          },
        ],
        title: "",
        start: undefined,
        end: undefined,
        description: "",
      },
      phases: [],
    },
  });
  const createMutation = api.opportunity.create.useMutation();

  async function onSubmit(values: z.infer<typeof OpportunitySchema>) {
    const id = toast.loading("Creating opportunity");
    try {
      const opportunity = await createMutation.mutateAsync(
        values.generalInformation,
      );
      toast.success("Successfully created opportunity", { id });
      router.push(`/opportunities/${opportunity.id}/edit`);
    } catch (err) {
      toast.error("Failed to create opportunity", { id });
    }
  }

  return (
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit, (err) => console.error(err))}
      >
        <PageTemplate
          breadcrumbsTitle="Create opportunity"
          pageTitle="Create new opportunity"
          pageDescription="Configure a new opportunity"
          buttons={[
            <Button type="submit">
              <Save className="mr-2" />
              Create
            </Button>,
          ]}
        >
          <GeneralInformation />
        </PageTemplate>
      </form>
    </Form>
  );
};

export default CreateOpportunityForm;
