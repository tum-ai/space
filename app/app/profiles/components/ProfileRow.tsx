import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import Dialog from "@components/Dialog";
import ProtectedItem from "@components/ProtectedItem";
import SelectMultiple from "@components/SelectMultiple";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
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
        <Avatar
          variant={Avatar.variant.Circle}
          src={profile.profile_picture}
          initials={(
            "" +
            profile.first_name[0] +
            profile.last_name[0]
          ).toUpperCase()}
        />
        <div className="w-full justify-end space-x-2">
          <ProtectedItem roles={["admin"]}>
            <Dialog trigger={<Button>edit membership</Button>}>
              <DepartmentMembershipEditor profile_id={profile?.id} />
            </Dialog>
          </ProtectedItem>
          <Link href={"/profile?id=" + profile?.id}>
            <Button variant={"secondary"}>view</Button>
          </Link>
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
