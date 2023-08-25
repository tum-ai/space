"use client";
import Icon from "@components/Icon";
import Select from "@components/Select";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import ProtectedItem from "../../../components/ProtectedItem";
import ProfileRow from "./ProfileRow";

function ProfilesList() {
  const { profilesModel, rolesModel } = useStores();
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col justify-end space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mt-2 font-light text-gray-500">
            Total {profilesModel.filteredProfiles.length} members
          </div>
          <div className="flex flex-col items-start space-y-2 lg:flex-row lg:items-end lg:space-x-4">
          <div className="flex items-center">
            <div className="space-x-2">
              <span className="font-thin">filters: </span>
              {Object.keys(profilesModel.filter).length > 0 && (
                <button onClick={() => profilesModel.resetFilters()}>
                  reset
                </button>
              )}
            </div>
            <ProtectedItem roles={["admin"]}>
              <Select
                className="bg-white dark:bg-gray-700"
                placeholder={"Role"}
                data={[
                  { key: "all", value: null },
                  ...(rolesModel.roles?.map((role) => ({
                    key: role["handle"],
                    value: role["handle"],
                  })) || []),
                ]}
                selectedItem={{
                  key: profilesModel.filter.role,
                  value: profilesModel.filter.role,
                }}
                setSelectedItem={(item) => {
                  profilesModel.setFilter("role", item ? item.value : "");
                }}
              />
            </ProtectedItem>
              <Select
                className="bg-white dark:bg-gray-700"
                placeholder={"Sort by"}
                data={[
                  { key: "none", value: null },
                  { key: "name", value: "first_name" },
                ]}
                selectedItem={{
                  key: profilesModel.sortBy,
                  value: profilesModel.sortBy,
                }}
                setSelectedItem={(item) => {
                  profilesModel.setSortBy(item?.value || "");
                }}
              />
            </div>
            <div className="flex space-x-4 rounded-lg bg-gray-200 p-2 dark:bg-gray-700 w-full md:w-fit">
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
                  <button
                    onClick={(e) => {
                      profilesModel.setSearch("");
                    }}
                  >
                    clear
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {profilesModel.filteredProfiles.map((profile, i) => (
          <ProfileRow key={i} profile={profile} />
        ))}
      </div>
    </div>
  );
}

export default observer(ProfilesList);
