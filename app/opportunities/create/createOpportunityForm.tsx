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
import Breadcrumbs from "@components/ui/breadcrumbs";
import { revalidate } from "@lib/revalidate";

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
      revalidate('/opportunities');
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
        <div className="p-8">
          <div className="mb-12 flex flex-col space-y-6">
            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <Breadcrumbs title={`Create opportunity`} />
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  Create new opportunity
                </h1>
                <p className="text-muted-foreground">
                  Configure a new opportunity
                </p>
              </div>

              <Button type="submit">
                <Save className="mr-2" />
                Create
              </Button>
            </div>
          </div>
          <GeneralInformation />
        </div>
      </form>
    </Form>
  );
};

export default CreateOpportunityForm;
