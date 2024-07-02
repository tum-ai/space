import db from "server/db";
import { getServerAuthSession } from "server/auth";
import { redirect } from "next/navigation";
import { DataTable } from "@components/ui/data-table";
import { columns } from "./columns";
import { Rabbit } from "lucide-react";
import { Button } from "@components/ui/button";
import Link from "next/link";
import { ExportButton } from "./_components/exportButton";
import { AssignQuestionnaireButton } from "./_components/assignQuestionnaireButton";
import PageTemplate from "@components/PageTemplate";

interface ApplicationsOverviewPageProps {
  params: {
    opportunity_id: string;
  };
}

export default async function OpportunityOverviewPage({
  params,
}: ApplicationsOverviewPageProps) {
  const opportunity = await db.opportunity.findUnique({
    where: { id: Number(params.opportunity_id) },
  });

  const applications = await db.application.findMany({
    where: {
      opportunityId: Number(params.opportunity_id),
    },
    include: { _count: { select: { reviews: true } } },
  });

  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth");

  if (!applications.length)
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <div className="flex flex-col items-center text-muted-foreground">
          <Rabbit className="mb-8 h-16 w-16" />
          <p>No applications submitted yet.</p>
        </div>

        <Button variant="link">
          <Link href="/opportunities">Back to opportunities</Link>
        </Button>
      </div>
    );

  if (applications.length) {
    return (
      <PageTemplate
        breadcrumbsTitle="Applications"
        opportunityTitle={opportunity?.title}
        pageTitle={`Applications for ${opportunity?.title}`}
        pageDescription="Configure an existing opportunity."
        buttons={[
          <ExportButton
            opportunityId={Number(params.opportunity_id)}
            opportunityTitle={
              opportunity?.title ??
              `TUM.ai Opportunity ${params.opportunity_id}`
            }
          />,
          <AssignQuestionnaireButton
            opportunityId={Number(params.opportunity_id)}
          />,
        ]}
      >
        <DataTable columns={columns} data={applications} />
      </PageTemplate>
    );
  }
}
