"use client";
import { Avatar } from "@/components/Avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { Moon, Sun, User as UserIcon } from "lucide-react";
import { observer } from "mobx-react";
import { useTheme } from "next-themes";
import { useUser } from "@auth0/nextjs-auth0/client";

import Link from "next/link";
import { Profile } from "@/models/profile";

const LoggedInUser = ({ auth0_user }: {auth0_user: Profile}) => {
  const { setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={"flex items-center space-x-4 rounded-full hover:text-black dark:bg-gray-700 dark:hover:text-white sm:bg-gray-100 sm:p-2 sm:px-4"}
      >
        <Avatar
          variant="circle"
          profilePicture={auth0_user.profile}
          initials={`${auth0_user.name[0]}`} />
        <p className="hidden sm:flex">
          {auth0_user.name}
        </p>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>
          My Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/me">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DropdownMenuItem>
                <Sun className="mr-2 h-4 w-4 flex: dark:hidden" />
                <Moon className="mr-2 h-4 w-4 hidden dark:flex" />
                Toggle Theme
              </DropdownMenuItem>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenuItem>
            <Link
              href={"/api/auth/logout"}
              className="flex items-center gap-2 rounded-lg bg-white p-2 dark:bg-gray-700"
            >
              <ExitIcon /> Logout
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function User() {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <p>⏳</p>;
  if (error) return <p>🚫 Auth Error</p>;
  return (
    <div className="flex space-x-4">
      {user && (
        <LoggedInUser auth0_user={user} />
      )}

      {!user && (
        <Link
          href={"/api/auth/login"}
          className="flex items-center gap-2 rounded-lg bg-white p-2 dark:bg-gray-700"
        >
          <EnterIcon /> Login
        </Link>
      )}
    </div>
  );
}

export default observer(User);

