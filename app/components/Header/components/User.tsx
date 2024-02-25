import { Avatar } from "@components/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { EnterIcon } from "@radix-ui/react-icons";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { LogOut, User as UserIcon } from "lucide-react";
import { Session, getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface LoggedInUserProps {
  user: Session["user"];
}
const LoggedInUser = ({ user }: LoggedInUserProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          "flex items-center space-x-4 rounded-full hover:text-black dark:bg-gray-700 dark:hover:text-white sm:bg-gray-100 sm:p-2 sm:px-4"
        }
      >
        <Avatar
          variant="circle"
          profilePicture={user.image}
          initials={`${user.firstName[0]}${user.lastName[0]}`}
        />
        <p className="hidden sm:flex">
          {user.firstName} {user.lastName}
        </p>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/me">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut({ redirect: false })}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

async function User() {
  return (
    <div className="flex space-x-4">
      {/*
      {session.user && <LoggedInUser user={session.user} />}

      {!session.user && (
        <Link
          href={"/auth"}
          className="flex items-center gap-2 rounded-lg bg-white p-2 dark:bg-gray-700"
        >
          <EnterIcon /> Login
        </Link>
      )}
      */}
    </div>
  );
}

export default User;
