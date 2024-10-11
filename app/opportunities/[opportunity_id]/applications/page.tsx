import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { ApplicationOverview } from "./_components/applicationOverview";
import { type Phase, type Questionnaire, type User } from "@prisma/client";
import { ExportButton } from "./_components/exportButton";
import { PageHeading } from "@components/ui/page-heading";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@lib/utils";

export const dynamic = "force-dynamic";

export type OpportunityPhase = Phase & {
  questionnaires: (Questionnaire & {
    reviewers: User[];
    applications: {
      id: number;
      name: string | null;
      reviews?: { id: number; user: User }[];
    }[];
  })[];
};

interface Props {
  params: {
    opportunity_id: string;
  };
}

export default async function ApplicationsPage({ params }: Props) {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) redirect("/auth");

  const opportunityId = Number(params.opportunity_id);
  const opportunity = await db.opportunity.findUnique({
    where: {
      id: opportunityId,
    },
    include: {
      admins: {
        select: {
          id: true,
        },
      },
    },
  });

  const isAdmin = !!opportunity?.admins.some((admin) => admin.id === userId);

  const phases = await db.phase.findMany({
    include: {
      questionnaires: {
        include: {
          applications: {
            select: {
              id: true,
              name: true,
              reviews: {
                select: !isAdmin ? { user: true } : undefined,
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          reviewers: true,
        },
        where: !isAdmin ? { reviewers: { some: { id: userId } } } : undefined,
      },
    },
    where: {
      questionnaires: !isAdmin
        ? { some: { reviewers: { some: { id: userId } } } }
        : undefined,
      opportunityId,
    },
    orderBy: {
      order: "desc",
    },
  });

  async function getExportData() {
    "use server";

    return await db.application.findMany({
      where: {
        opportunityId: Number(params.opportunity_id),
      },
      select: {
        content: true,
        name: true,
        reviews: {
          select: {
            content: true,
          },
        },
      },
    });
  }

  const headerList = headers();
  const breadcrumbs = mapPathnameToBreadcrumbs(headerList);

  return (
    <div className="flex h-screen flex-col gap-8 overflow-hidden py-8">
      <PageHeading title={opportunity?.title ?? ""} breadcrumbs={breadcrumbs}>
        <ExportButton getExportData={getExportData} />
      </PageHeading>

      <ApplicationOverview
        opportunityId={opportunityId}
        phases={phases}
        isAdmin={isAdmin}
      />
    </div>
  );
}
