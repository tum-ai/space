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
      <div className="flex justify-between px-4 py-4">
        <div className="flex items-center">
          <Navigation />
        </div>
        <div className="flex items-start">
          {session?.user ? (
            <UserComponent user={session.user} />
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
