import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import { Checkbox } from "@components/Checkbox";
import { Popover } from "@components/Popover";
import ProtectedItem from "@components/ProtectedItem";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import Link from "next/link";
import DepartmentMembershipEditor from "./DepartmentMembershipEditor";

const ProfileRow = observer(({ profile }) => {
  const { rolesModel } = useStores();
  const roleHolderships = rolesModel.roleHolderships[profile?.id] || [];

  return (
    <div className="flex justify-between space-x-10 rounded-xl bg-white p-4 shadow dark:bg-gray-700">
      <div className="grid w-full grid-cols-2 gap-2">
        {/* profile name and picture */}
        <div className="flex items-center gap-2">
          <Avatar
            variant={"circle"}
            src={profile.profile_picture}
            initials={(
              "" +
              profile.first_name[0] +
              profile.last_name[0]
            ).toUpperCase()}
          />
          <div className="flex flex-col">
            <p className="font-bold">
              {profile?.first_name + " " + profile?.last_name}
            </p>
            <p>{profile.email}</p>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Link href={"/profile?id=" + profile?.id}>
            <Button variant={"secondary"}>view</Button>
          </Link>
        </div>
        <ProtectedItem roles={["admin"]}>
          <DepartmentMembershipEditor
            trigger={<Button>edit membership</Button>}
            profile_id={profile?.id}
          />
          <Popover
            trigger={
              <Button>
                roles{" "}
                {roleHolderships.length ? `(${roleHolderships.length})` : ""}
              </Button>
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

export default ProfileRow;
