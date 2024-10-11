import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { KeyCard } from "./_components/key-card";
import { redirect } from "next/navigation";
import { CreateKeyButton } from "./_components/create-key-button";
import { PageHeading } from "@components/ui/page-heading";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@lib/utils";

export default async function HomebaseKeys() {
  const session = await getServerAuthSession();
  const keys = await db.key.findMany({ include: { user: true } });
  const users = await db.user.findMany();

  if (!session?.user.id) redirect("/auth");

  const headerList = headers();
  const breadcrumbs = mapPathnameToBreadcrumbs(headerList);

  return (
    <section className="space-y-8 p-8">
      <PageHeading
        title="Homebase keys"
        description="See who can get you into the homebase"
        breadcrumbs={breadcrumbs}
      >
        {session.user.roles.includes("ADMIN") && <CreateKeyButton />}
      </PageHeading>

      <div className="grid gap-8 xl:grid-cols-2">
        {keys.map((key) => (
          <KeyCard
            key={`key-${key.id}`}
            realKey={key}
            session={session}
            users={users.filter((user) => user.id !== session.user.id)}
          />
        ))}
      </div>
    </section>
  );
}
