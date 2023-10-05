"use client";
import { Avatar } from "@components/Avatar";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { useStores } from "@providers/StoreProvider";
import { EnterIcon } from "@radix-ui/react-icons";
import { LogOut, Moon, Sun, User as UserIcon } from "lucide-react";
import { observer } from "mobx-react";
import { useTheme } from "next-themes";
import Link from "next/link";

const LoggedInUser = ({ user, meModel }) => {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={"flex items-center space-x-4 rounded-full hover:text-black dark:bg-gray-700 dark:hover:text-white sm:bg-gray-100 sm:p-2 sm:px-4"}
      >
        <Avatar
          variant="circle"
          profilePicture={user.profile.profile_picture}
          initials={`${user.profile.first_name[0]}${user.profile.last_name[0]}`} />
        <p className="hidden sm:flex">
          {user.profile.first_name} {user.profile.last_name}
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
          <DropdownMenuItem
            onClick={() => meModel.logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function User() {
  const { meModel } = useStores();
  const user = meModel.user;

  return (
    <div className="flex space-x-4">
      {user && (
        <LoggedInUser user={user} meModel={meModel} />
      )}

      {!user && (
        <Link
          href={"/auth"}
          className="flex items-center gap-2 rounded-lg bg-white p-2 dark:bg-gray-700"
        >
          <EnterIcon /> Login
        </Link>
      )}
    </div>
  );
}

export default observer(User);

