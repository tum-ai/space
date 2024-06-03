import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { columns } from "./columns";
import { DataTable } from "./components/DataTable";
import { RowType } from "./components/DataTableTypes";
import { Button } from "@components/ui/button";
import { FileCheck } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@components/ui/breadcrumbs";

interface ReviewPageProps {
  params: { opportunity_id: string };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const session = await getServerAuthSession();
  if (!session?.user?.id) redirect("/auth");

  const opportunity = await db.opportunity.findUnique({
    where: { id: Number(params.opportunity_id) },
    include: { admins: true },
  });

  if (opportunity?.admins?.every((admin) => admin.id !== session.user.id)) {
    redirect("/404");
  }

  const reviews = await db.review.findMany({
    where: {
      application: { opportunityId: Number(params.opportunity_id) },
    },
    include: {
      application: true,
      user: { select: { name: true } },
      questionnaire: { include: { phase: true } },
    },
  });

  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between">
        <div>
          <Breadcrumbs title={`Reviews: ${opportunity?.title}`} />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Reviews
          </h1>
          <p className="text-muted-foreground">See and edit the reviews</p>
        </div>

        <Button asChild>
          <Link href="review/new">
            <FileCheck className="mr-2" />
            Start new review
          </Link>
        </Button>
      </div>

      <DataTable<RowType>
        rowData={reviews}
        columnData={columns}
        columnDefs={{}}
      />
    </div>
  );
}
