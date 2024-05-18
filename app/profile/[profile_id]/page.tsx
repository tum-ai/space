import db from "server/db";
import { ProfileOverview } from "../components/ProfileOverview";
import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui/button";
import { getServerAuthSession } from "server/auth";

export default async function ProfilePage({
  params,
}: {
  params: { profile_id: string };
}) {
  const user = await db.user.findUnique({
    where: { id: params.profile_id },
    include: { profile: true },
  });
  const session = await getServerAuthSession();

  if (!session?.user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  if (!user || session.user.id !== user.id) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <div className="flex flex-col items-center text-muted-foreground">
          <Search className="mb-8 h-16 w-16" />
          <p>User not found</p>
        </div>

        <Button variant="link">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  const profileId = user?.profile.at(0)?.id;

  const contacts = await db.contact.findMany({
    where: { profileId: profileId },
  });

  return <ProfileOverview user={user} contacts={contacts} />;
}
