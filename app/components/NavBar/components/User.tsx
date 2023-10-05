"use client";
import { Avatar } from "@components/Avatar";
import { useStores } from "@providers/StoreProvider";
import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react";
import Link from "next/link";

function User() {
  const { meModel } = useStores();
  const user = meModel.user;

  return (
    <div className="flex space-x-4">
      {user && (
        <>
          <Link
            href="/me"
            className={
              "flex items-center space-x-4 rounded-full hover:text-black dark:bg-gray-700 dark:hover:text-white sm:bg-gray-100 sm:p-2 sm:px-4"
            }
          >
            <Avatar
              variant="circle"
              profilePicture={user.profile.profile_picture}
              initials={`${user.profile.first_name[0]}${user.profile.last_name[0]}`}
            />
            <p className="hidden sm:flex">
              {user.profile.first_name} {user.profile.last_name}
            </p>
          </Link>
          <button
            onClick={() => meModel.logout()}
            className="flex items-center gap-2"
          >
            <ExitIcon />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </>
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
