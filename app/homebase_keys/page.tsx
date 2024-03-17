import { getServerAuthSession } from "server/auth";
import db from "server/db";
import { KeyCard } from "./_components/key-card";
import { redirect } from "next/navigation";

export default async function HomebaseKeys() {
  const session = await getServerAuthSession();
  const keys = await db.key.findMany({ include: { user: true } });
  const users = await db.user.findMany();

  if (!session) redirect("/auth");

  return (
    <section className="grid gap-8 p-8 xl:grid-cols-2">
      {keys.map((key) => (
        <KeyCard
          key={`key-${key.id}`}
          realKey={key}
          session={session}
          users={users.filter((user) => user.id !== session.user.id)}
        />
      ))}
    </section>
  );
}
