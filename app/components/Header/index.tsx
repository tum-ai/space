import { authOptions } from "app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Navigation } from "./components/navigation";
import { User } from "./components/user";
import Link from "next/link";

async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="w-full">
      <div className="flex w-full justify-between px-2 py-4">
        <Navigation />
        {session?.user && <User />}
        {!session?.user && <Link href="/auth">Sign in</Link>}
      </div>
    </header>
  );
}

export default Header;
