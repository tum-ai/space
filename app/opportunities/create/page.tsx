import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import CreateOpportunityForm from "./createOpportunityForm";
import { type GeneralInformationSchema } from "@lib/schemas/opportunity";
import { type z } from "zod";
import db from "server/db";
import { PageHeading } from "@components/ui/page-heading";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@lib/utils";

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

  const headerList = headers();
  const breadcrumbs = mapPathnameToBreadcrumbs(headerList);

  return (
    <div className="space-y-8 py-8">
      <PageHeading title="Create Opportunity" breadcrumbs={breadcrumbs} />
      <CreateOpportunityForm session={session} create={create} />
    </div>
  );
}
