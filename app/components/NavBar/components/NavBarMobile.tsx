"use client";
import Icon from "@components/Icon";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import Links from "./Links";
import Logo from "./Logo";
import User from "./User";

function NavBarMobile() {
  const { uiModel } = useStores();
  return (
    <div className="sticky top-0 z-20 flex w-full flex-col items-center bg-white p-4 shadow-lg dark:shadow-purple-900/60 mb-4 dark:bg-black lg:hidden lg:p-6">
      <div className="flex w-full justify-between">
        <Logo />
        <button
          onClick={() => {
            uiModel.setNavBarActive(!uiModel.navBarActive);
          }}
        >
          <Icon
          size={30}
            name={"FaBars"}
            className="rounded-lg bg-gray-100 hover:scale-105 dark:bg-black"
          />
        </button>
      </div>
      {uiModel.navBarActive && (
        <div className="slide-down absolute z-0 flex w-full flex-col items-center justify-between space-y-4 rounded-b-lg bg-white bg-gradient-to-b p-4 pt-20 shadow-lg dark:bg-black">
          <Links />
          <div className="flex space-x-4">
            <User />
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(NavBarMobile);
