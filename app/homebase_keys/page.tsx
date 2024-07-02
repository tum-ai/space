import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { KeyCard } from "./_components/key-card";
import { redirect } from "next/navigation";
import { CreateKeyButton } from "./_components/create-key-button";
import PageTemplate from "@components/PageTemplate";

export default async function HomebaseKeys() {
  const session = await getServerAuthSession();
  const keys = await db.key.findMany({ include: { user: true } });
  const users = await db.user.findMany();

  if (!session?.user.id) redirect("/auth");

  const adminButtons = [
    session.user.roles.includes("ADMIN") && <CreateKeyButton />,
  ];

  return (
    <PageTemplate
      breadcrumbsTitle="Keys"
      pageTitle="Homebase key tracking"
      pageDescription="Manage homebase keys"
      buttons={[...adminButtons]}
    >
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {keys.map((key) => (
          <KeyCard
            key={`key-${key.id}`}
            realKey={key}
            session={session}
            users={users.filter((user) => user.id !== session.user.id)}
          />
        ))}
      </div>
    </PageTemplate>
  );
}
