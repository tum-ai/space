"use client";
import { useStores } from "@providers/StoreProvider";
import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react";
import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

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
              "flex items-center space-x-4 rounded-full bg-gray-200 p-2 px-4 hover:text-black dark:bg-gray-700 dark:hover:text-white"
            }
          >
            {user.profile.profile_picture && (
              <Image
                className="h-8 w-8 rounded-full object-cover"
                src={user.profile.profile_picture}
                width={100}
                height={100}
                alt=""
              />
            )}
            {!user.profile.profile_picture && (
              <div className="flex h-8 w-8 rounded-full bg-gray-300 text-center drop-shadow-lg dark:bg-gray-800">
                <FaUser name={"FaUser"} className="m-auto text-xl text-white" />
              </div>
            )}
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
