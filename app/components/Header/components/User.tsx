import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { LogOut, User as UserIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export const User = async () => {
  const { user } = await getServerSession(authOptions);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          "flex items-center space-x-4 rounded-full hover:text-black dark:bg-gray-700 dark:hover:text-white sm:bg-gray-100 sm:p-2 sm:px-4"
        }
      >
        <Avatar>
          <AvatarImage src={user.image} />
          <AvatarFallback>
            {`${user.firstName[0]}${user.lastName[0]}`}
          </AvatarFallback>
        </Avatar>
        <p className="hidden sm:flex">
          {user.firstName} {user.lastName}
        </p>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/auth/signout">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
