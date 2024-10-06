import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import CreateOpportunityForm from "./createOpportunityForm";
import { GeneralInformationSchema } from "@lib/schemas/opportunity";
import { z } from "zod";
import db from "server/db";

export default async function CreateOpportunity() {
  const session = await getServerAuthSession();
  if (!session?.user.id) redirect("/auth");

  async function create(input: z.infer<typeof GeneralInformationSchema>) {
    "use server";

    const opportunity = await db.opportunity.create({
      data: {
        title: input.title,
        description: input.description,
        start: input.start,
        end: input.end,
        admins: {
          connect: input.admins.map((admin) => ({
            id: admin.id,
          })),
        },
      },
    });

    return opportunity;
  }

  return <CreateOpportunityForm session={session} create={create} />;
}
