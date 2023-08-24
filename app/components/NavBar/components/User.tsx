"use client";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

function User() {
  const { uiModel, meModel } = useStores();
  const user = meModel.user;

  return (
    <div
      onClick={() => {
        uiModel.setNavBarActive(false);
      }}
      className="flex space-x-4"
    >
      {user ? (
        <>
          <Link
            href="/me"
            className={
              "flex items-center space-x-4 rounded-full bg-gray-200 p-2 px-4 hover:text-black dark:bg-gray-700 dark:hover:text-white"
            }
          >
            {user.profile.profile_picture ? (
              <Image
                className="h-8 w-8 rounded-full object-cover"
                src={user.profile.profile_picture}
                width={100}
                height={100}
                alt=""
              />
            ) : (
              <div className="flex h-8 w-8 rounded-full bg-gray-300 text-center drop-shadow-lg dark:bg-gray-800">
                <FaUser name={"FaUser"} className="m-auto text-xl text-white" />
              </div>
            )}
            <div>
              {user.profile.first_name} {user.profile.last_name}
            </div>
          </Link>
          <button
            onClick={() => {
              meModel.logout();
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            href={"/auth"}
            className="rounded bg-white p-2 dark:bg-gray-700"
          >
            Login
          </Link>
        </>
      )}
    </div>
  );
}

export default observer(User);
