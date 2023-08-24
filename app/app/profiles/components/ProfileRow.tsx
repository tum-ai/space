import Icon from "@components/Icon";
import ProtectedItem from "@components/ProtectedItem";
import SelectMultiple from "@components/SelectMultiple";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import Image from "next/image";
import Link from "next/link";
import DepartmentMembershipEditor from "./DepartmentMembershipEditor";

const ProfileRow = observer(({ profile }) => {
  const { rolesModel, meModel, uiModel } = useStores();
  const user = meModel.user;
  const user_profile = user?.profile;
  const roleHolderships = rolesModel.roleHolderships[profile?.id] || [];

  return (
    <div className="flex justify-between space-x-10 rounded-xl bg-white p-4 shadow dark:bg-gray-700">
      <div className="grid w-full grid-cols-2 gap-2">
        {/* profile picture */}
        {profile?.profile_picture ? (
          <Image
            className="h-14 w-14 rounded-full border object-cover"
            src={profile.profile_picture}
            width={100}
            height={100}
            alt=""
          />
        ) : (
          <div className="flex h-14 w-14 rounded-full bg-gray-300 text-center drop-shadow-lg dark:bg-gray-800">
            <Icon name={"FaUser"} className="m-auto text-xl text-white" />
          </div>
        )}
        <div className="flex flex-col gap-y-1">
          <ProtectedItem roles={["admin"]}>
            <div className="flex w-auto items-center justify-end">
              <button
                onClick={() => {
                  uiModel.updateModalContent(
                    <DepartmentMembershipEditor profile_id={profile?.id} />,
                  );
                  uiModel.toggleModal();
                  meModel.editorProfile = { ...user_profile };
                }}
              >
                <Icon
                  name={"FaEdit"}
                  className="rounded bg-gray-100 p-2 hover:scale-105 dark:bg-black"
                />
              </button>
            </div>
          </ProtectedItem>
          <div className="flex w-auto items-center justify-end">
            <Link href={"/profiles/" + profile?.id}>
              <Icon
                name={"FaExternalLinkAlt"}
                className="rounded bg-gray-100 p-2 hover:scale-105 dark:bg-black"
              />
            </Link>
          </div>
        </div>
        {/* profile name and department */}
        <div className="col-span-2 flex flex-col">
          <div className="font-bold">
            {profile?.first_name + " " + profile?.last_name}
          </div>
        </div>
        <ProtectedItem roles={["admin"]}>
          <div className="col-span-2">
            <SelectMultiple
              className="bg-white dark:bg-gray-700"
              placeholder={"Roles"}
              data={
                rolesModel.roles?.map((role) => ({
                  key: (
                    <div>
                      <b>{role.handle}: </b>
                      {role.description}
                    </div>
                  ),
                  value: role.handle as string,
                })) || []
              }
              selectedItems={roleHolderships.map((role) => ({
                key: role,
                value: role,
              }))}
              setSelectedItems={async (items) => {
                items = items.map((item) => item["value"]);
                const newRoles = items.filter(
                  (item) => !roleHolderships.includes(item),
                );
                const deletedRoles = roleHolderships.filter(
                  (role) => !items.includes(role),
                );
                const method = newRoles.length ? "create" : "delete";
                let data = newRoles.length ? newRoles : deletedRoles;
                data = data.map((item) => ({
                  profile_id: profile?.id,
                  role_handle: item,
                  method: method,
                }));
                await rolesModel.updateRoles(data);
                rolesModel.setProfileRoles(profile?.id, items);
              }}
            ></SelectMultiple>
          </div>
        </ProtectedItem>
      </div>
    </div>
  );
});

export default ProfileRow;
