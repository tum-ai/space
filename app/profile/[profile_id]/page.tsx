import db from "server/db";
import { ProfileOverview } from "../components/ProfileOverview";
import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@components/ui/button";

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

  return <ProfileOverview user={user} />;
}
