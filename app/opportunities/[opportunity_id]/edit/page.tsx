import { getServerAuthSession } from "server/auth";
import { EditGeneral } from "./_components/general";
import { EditPhases } from "./_components/phases";
import { redirect } from "next/navigation";
import { PageHeading } from "@components/ui/page-heading";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@lib/utils";
import { Separator } from "@components/ui/separator";

interface Props {
  params: {
    opportunity_id: string;
  };
}

export default async function OpportunityEdit({ params }: Props) {
  const session = await getServerAuthSession();
  if (!session?.user.id) redirect("/auth");

  const opportunityId = params.opportunity_id;

  const headerList = headers();
  const breadcrumbs = mapPathnameToBreadcrumbs(headerList);

  return (
    <div className="space-y-8 py-8">
      <PageHeading
        title="Edit Opportunity"
        breadcrumbs={breadcrumbs}
        description="Configure a opportunity and how it is reviewed"
      />
      <EditGeneral opportunityId={opportunityId} />
      <Separator />
      <EditPhases opportunityId={opportunityId} />
    </div>
  );
}
