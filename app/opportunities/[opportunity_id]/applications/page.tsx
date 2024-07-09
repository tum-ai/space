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
import Breadcrumbs from "@components/ui/breadcrumbs";

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
      <div className="space-y-8 p-8">
        <div className="flex justify-between">
          <div className="flex w-full flex-row items-center justify-between">
            <div>
              <Breadcrumbs title={`Applications`} opportunityTitle={opportunity?.title} />
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Applications for {opportunity?.title}
              </h1>
            </div>
            <div className="flex gap-2">
              <ExportButton
                opportunityId={Number(params.opportunity_id)}
                opportunityTitle={
                  opportunity?.title ??
                  `TUM.ai Opportunity ${params.opportunity_id}`
                }
              />
            </div>
          </div>
        </div>

        <DataTable columns={columns} data={applications} />
      </div>
    );
  }
}
