import Breadcrumbs from "@components/ui/breadcrumbs";
import { Button } from "@components/ui/button";
import ApplicationForm from "app/opportunities/_components/ApplicationForm";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import db from "server/db";

export default async function ApplicationOverview({
  params,
}: {
  params: { application_id: string };
}) {
  const application = await db.application.findUnique({
    where: {
      id: Number(params.application_id),
    },
  });

  const opportunityTitle = db.opportunity
    .findUnique({
      where: {
        id: application?.opportunityId,
      },
    })
    .then((opportunity) => opportunity?.title);

  // TODO: Better handling
  if (!application) redirect("/");

  return (
    <div className="flex h-screen flex-col space-y-8 p-8">
      <div className="flex justify-between">
        <div className="flex flex-col gap-3">
          <Breadcrumbs
            title={`Application: ${application.id}`}
            opportunityTitle={await opportunityTitle}
          />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Application of ID: {application.id}
          </h1>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href={`${application.id - 1}`}>
              <ChevronLeft />
              Prev
            </Link>
          </Button>

          <Button asChild variant="secondary">
            <Link href={`${application.id + 1}`}>
              Next
              <ChevronRight />
            </Link>
          </Button>
        </div>
      </div>
      <ApplicationForm application={application}></ApplicationForm>
    </div>
  );
}
