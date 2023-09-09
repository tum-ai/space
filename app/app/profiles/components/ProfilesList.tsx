"use client";
import Icon from "@components/Icon";
import Select from "@components/Select";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import ProfileRow from "./ProfileRow";
import { Profile } from "@models/profile";
import LoadingWheel from "@components/LoadingWheel";
import { useProfiles } from "./useProfiles";

function ProfilesList() {
  const { rolesModel } = useStores();
  const profilesModel = useProfiles();

  if (profilesModel.isLoading) {
    return <LoadingWheel />;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col justify-end space-y-10">
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <div className="mt-2 font-light text-gray-500">
            Total {profilesModel.profiles?.length} members
          </div>
          <div className="flex flex-col items-start space-y-2 lg:flex-row lg:items-end lg:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="space-x-2">
                <span className="font-thin">filters: </span>
                {profilesModel.hasFilters && (
                  <button onClick={() => profilesModel.setFilters({})}>
                    reset
                  </button>
                )}
              </div>
              <Select
                placeholder={"Role"}
                data={[
                  { key: "all", value: "all" },
                  ...rolesModel.roles?.map((role) => ({
                    key: role["handle"],
                    value: role["handle"],
                  })),
                ]}
                value={profilesModel.filters?.role?.name}
                setSelectedItem={(item) => {
                  const roleFilter =
                    item === "all"
                      ? { name: "all", predicate: () => true }
                      : {
                          name: item,
                          predicate: (profile: Profile) =>
                            rolesModel.roleHolderships[profile.id]?.includes(
                              item,
                            ),
                        };

                  profilesModel.setFilters((filters) => ({
                    ...filters,
                    role: roleFilter,
                  }));
                }}
              />
            </div>
            <div className="flex w-full space-x-4 rounded-lg bg-gray-200 p-2 dark:bg-gray-700 md:w-fit">
              <Icon name={"FaSearch"} className="rounded-lg p-2" />
              <input
                value={profilesModel.search}
                onChange={(e) => {
                  profilesModel.setSearch(e.target.value);
                }}
                placeholder="search.."
                className="w-full bg-transparent outline-none"
              />
              {profilesModel.search && (
                <button onClick={() => profilesModel.setSearch("")}>
                  clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {profilesModel.profiles.map((profile, i) => (
          <ProfileRow key={i} profile={profile} />
        ))}
      </div>
    </div>
  );
}

export default observer(ProfilesList);
