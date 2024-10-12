import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { mapPathnameToBreadcrumbs } from "@components/ui/page-breadcrumbs";
import { PageHeading } from "@components/ui/page-heading";
import { cn } from "@lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import db from "server/db";

interface Props {
  params: {
    opportunity_id: string;
  };
}

export default async function OpportunityPage({ params }: Props) {
  const session = await getServerAuthSession();
  if (!session?.user.id) redirect("/auth");

  const opportunityId = Number(params.opportunity_id);
  const opportunity = await db.opportunity.findUnique({
    where: { id: opportunityId },
  });

  if (!opportunity) redirect("/404");

  const headerList = headers();
  const breadcrumbs = await mapPathnameToBreadcrumbs(headerList);

  return (
    <div className="space-y-8 py-8">
      <PageHeading
        title={opportunity.title}
        description={opportunity.description ?? undefined}
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-3 gap-4">
        {[
          { href: "applications", label: "Applications" },
          { href: "applications", label: "Review" },
          { href: "applications", label: "Dashboard" },
        ].map((item) => (
          <Card
            className={cn(
              "flex h-full w-full flex-col justify-between overflow-hidden",
            )}
          >
            <CardHeader className="p-4">
              <CardTitle className="truncate text-lg">{item.label}</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
