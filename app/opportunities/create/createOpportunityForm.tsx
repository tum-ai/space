"use client";

import { type z } from "zod";
import { GeneralInformationSchema } from "@lib/schemas/opportunity";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@components/ui/button";
import { useRouter } from "next/navigation";
import { GeneralInformation } from "../_components/generalForm";
import { type Session } from "next-auth";
import { Form } from "@components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Opportunity } from "@prisma/client";

interface Props {
  session: Session;
  create: (
    input: z.infer<typeof GeneralInformationSchema>,
  ) => Promise<Opportunity>;
}
const CreateOpportunityForm = ({ session, create }: Props) => {
  const user = session.user;

  const router = useRouter();
  const form = useForm<z.infer<typeof GeneralInformationSchema>>({
    resolver: zodResolver(GeneralInformationSchema),
    defaultValues: {
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
  });

  async function onSubmit(values: z.infer<typeof GeneralInformationSchema>) {
    const id = toast.loading("Creating opportunity");
    try {
      const opportunity = await create(values);
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
        className="space-y-4"
      >
        <GeneralInformation />

        <div className="flex justify-end">
          <Button type="submit">
            <Save className="mr-2" />
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateOpportunityForm;
