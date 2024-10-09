import { getServerAuthSession } from "server/auth";
import { redirect } from "next/navigation";
import db from "server/db";
import EditGeneralForm from "./generalEditForm";
import { type z } from "zod";
import { type GeneralInformationSchema } from "@lib/schemas/opportunity";

export async function EditGeneral({
  opportunityId: opportunity_id,
}: {
  opportunityId: string;
}) {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) redirect("/auth");

  const opportunity = await db.opportunity.findUnique({
    where: {
      id: Number(opportunity_id),
      admins: { some: { id: userId } },
    },
    include: {
      admins: true,
    },
  });

  if (!opportunity) redirect("/opportunities");

  const defaultValues = {
    opportunityId: opportunity.id,
    admins: opportunity.admins.map((admin) => ({
      id: admin.id,
      name: admin.name ?? undefined,
      image: admin.image ?? undefined,
    })),
    title: opportunity?.title,
    description: opportunity?.description ?? "",
    start: opportunity?.start,
    end: opportunity?.end ?? undefined,
  };

  async function update(input: z.infer<typeof GeneralInformationSchema>) {
    "use server";

    return await db.opportunity.update({
      where: {
        id: input.opportunityId,
        admins: { some: { id: userId } },
      },
      data: {
        title: input.title,
        description: input.description,
        start: input.start,
        end: input.end,
        admins: {
          set: input.admins.map((admin) => ({
            id: admin.id,
          })),
        },
      },
    });
  }

  return <EditGeneralForm defaultValues={defaultValues} update={update} />;
}
