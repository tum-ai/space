import db from "server/db";
import ProfileOverview from "../components/ProfileOverview";
import { User } from "@prisma/client";

export default async function ProfilePage({
  params,
}: {
  params: { profile_id: string };
}) {
  const user = await db.user.findUnique({
    where: { id: params.profile_id },
    include: { profile: true },
  });

  if (!user) {
    return <div>Profile not found</div>;
  }

  return (
    <section>
      <ProfileOverview user={user} />
    </section>
  );
}
