import { getServerAuthSession } from "server/auth";
import { Navigation } from "./components/navigation";
import { UserComponent } from "./components/user";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@components/ui/button";

async function Header() {
  const session = await getServerAuthSession();

  return (
    <header className="w-full">
      <div className="flex w-full justify-between px-2 py-4 md:px-8">
        <Navigation />
        {session?.user && <UserComponent user={session.user} />}
        {!session?.user && (
          <Button asChild className="flex gap-2">
            <Link href="/auth">
              <LogIn />
              Sign in
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
