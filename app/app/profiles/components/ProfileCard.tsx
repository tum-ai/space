import { Avatar } from "@components/Avatar";
import { Checkbox } from "@components/Checkbox";
import { Popover } from "@components/Popover";
import ProtectedItem from "@components/ProtectedItem";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import Link from "next/link";
import DepartmentMembershipEditor from "./DepartmentMembershipEditor";

const ProfileCard = observer(({ profile }) => {
  const { rolesModel } = useStores();
  const roleHolderships = rolesModel.roleHolderships[profile?.id] || [];

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-700">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex w-full justify-between gap-2">
          <div className="flex flex-col overflow-hidden">
            <p className="overflow-hidden text-ellipsis whitespace-nowrap font-bold">
              {profile?.first_name + " " + profile?.last_name} 
            </p>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap">
              {profile.email}
            </p>
          </div>
          <Avatar
            variant={"circle"}
            profilePicture={profile?.image}
            initials={(
              "" +
              profile.first_name[0] +
              profile.last_name[0]
            ).toUpperCase()}
          />
        </div>
      </div>
      <div className="grid grid-flow-col divide-x border-t dark:divide-gray-600 dark:border-gray-600">
        <button className="px-4 py-2 duration-200 hover:bg-gray-500/90">
          <Link href={"/profile?id=" + profile?.id}>View</Link>
        </button>
        <ProtectedItem roles={["admin"]}>
          <DepartmentMembershipEditor
            trigger={
              <button className="px-4 py-2 duration-200 hover:bg-gray-500/90">
                Edit membership
              </button>
            }
            profile_id={profile?.id}
          />
          <Popover
            trigger={
              <button className="px-4 py-2 duration-200 hover:bg-gray-500/90">
                Roles{" "}
                {roleHolderships.length ? `(${roleHolderships.length})` : ""}
              </button>
            }
          >
            <div className="space-y-4">
              {rolesModel.roles.map((role) => (
                <div key={role.handle} className="flex items-center gap-2">
                  <div>
                    <Checkbox
                      checked={roleHolderships.includes(role.handle)}
                      onCheckedChange={async (value) => {
                        const newRoleHoldership = role.handle;
                        const method = value ? "create" : "delete";

                        const data = [
                          {
                            profile_id: profile?.id,
                            role_handle: newRoleHoldership,
                            method: method,
                          },
                        ];
                        await rolesModel.updateRoles(data);
                        await rolesModel.getRoleHolderships();
                      }}
                    />
                  </div>

                  <div>
                    <p>
                      <b>{role.handle}</b>: {role.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Popover>
        </ProtectedItem>
      </div>
    </div>
  );
});

export default ProfileCard;
