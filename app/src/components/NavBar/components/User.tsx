"use client";
import { Avatar } from "@/components/Avatar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react";
import Link from "next/link";

function User() {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <p>TODO Loading</p>;
  if (error) return <p>Error: {error.message}</p>;

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
              profilePicture={user.picture ?? ""}
              initials={`${(user.name ?? "?")[0]}`}
            />
            <p className="hidden text-black sm:flex">
              {user.name}
            </p>
          </Link>
          <Link
            href={"/api/auth/logout"}
            className="flex items-center gap-2 rounded-lg bg-white p-2 dark:bg-gray-700"
          >
            <ExitIcon /> Logout
          </Link>
        </>
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
