import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { columns } from "./columns";
import { DataTable } from "@components/ui/data-table";
import { Button } from "@components/ui/button";
import { FileCheck } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@components/ui/breadcrumbs";
import PageTemplate from "@components/PageTemplate";

interface ReviewPageProps {
  params: { opportunity_id: string };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth");

  const opportunity = await db.opportunity.findUnique({
    where: { id: Number(params.opportunity_id) },
  });

  const reviews = await db.review.findMany({
    where: {
      user: { id: session?.user.id },
      application: { opportunityId: Number(params.opportunity_id) },
    },
    include: {
      application: true,
      questionnaire: { include: { phase: true } },
    },
  });

  return (
    <PageTemplate
      breadcrumbsTitle={`Reviews:  ${opportunity?.title}`}
      pageTitle="Your reviews"
      pageDescription="See and edit your reviews."
      buttons={[
        <Button asChild>
          <Link href="review/new">
            <FileCheck className="mr-2" />
            Start new review
          </Link>
        </Button>,
      ]}
    >
      <DataTable columns={columns} data={reviews} />
    </PageTemplate>
  );
}
