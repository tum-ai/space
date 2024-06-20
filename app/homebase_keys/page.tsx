import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { KeyCard } from "./_components/key-card";
import { redirect } from "next/navigation";
import { CreateKeyButton } from "./_components/create-key-button";
import Breadcrumbs from "@components/ui/breadcrumbs";

export default async function HomebaseKeys() {
  const session = await getServerAuthSession();
  const keys = await db.key.findMany({ include: { user: true } });
  const users = await db.user.findMany();

  if (!session?.user.id) redirect("/auth");

  return (
    <section className="p-8">
      <div className="mb-12 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <Breadcrumbs title="Keys" />
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Homebase key tracking
            </h1>
            <p className="text-muted-foreground">Manage homebase keys</p>
          </div>

          {session.user.roles.includes("ADMIN") && <CreateKeyButton />}
        </div>
      </div>

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
    </section>
  );
}
