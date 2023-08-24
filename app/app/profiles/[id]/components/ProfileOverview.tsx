"use client";
import Icon from "@components/Icon";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProfileOverview() {
  const { profileModel } = useStores();
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (id) {
      profileModel.getProfile(typeof id === "string" ? id : id[0]);
    }
  }, [profileModel, id]);
  const profile = profileModel.profile;

  if (profileModel.loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="m-auto max-w-3xl bg-white dark:bg-gray-700">
      <div className="grid grid-cols-1 gap-10 rounded-xl p-8 px-4 lg:px-10 xl:grid-cols-2">
        {/* name + image */}
        <div className=" max-w-90 flex flex-col items-start space-y-6 xl:col-span-2">
          {profile.profile_picture ? (
            <Image
              className="m-auto h-28 w-28 rounded-full border object-cover drop-shadow-lg"
              src={profile.profile_picture}
              width={100}
              height={100}
              alt=""
            />
          ) : (
            <div className="m-auto flex h-28 w-28 rounded-full bg-gray-300 text-center drop-shadow-lg dark:bg-gray-800">
              <Icon name={"FaUser"} className="m-auto text-4xl text-white" />
            </div>
          )}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-end lg:space-x-4 lg:space-y-0">
            <div className="text-6xl font-thin">
              {profile.first_name + " " + profile.last_name}
            </div>
            {profile.socialNetworks &&
              profile.socialNetworks.map((sn) => (
                <a key={sn.link} href={sn.link}>
                  {sn.type == "Other" ? (
                    <Icon
                      name={"FaGlobe"}
                      className="rounded-full p-2 hover:scale-105"
                    />
                  ) : (
                    <Icon
                      name={("Fa" + sn.type) as any}
                      className="rounded-full p-2 hover:scale-105"
                    />
                  )}
                </a>
              ))}
          </div>
        </div>
        {/* department */}
        <div className="flex flex-col">
          <div className="text-base font-light text-gray-400">DEPARTMENT</div>
          <div className="text-base font-light">
            {profile.department || "-"}
          </div>
        </div>
        {/* degree */}
        <div className="flex flex-col">
          <div className="text-base font-light text-gray-400">DEGREE</div>
          <div className="text-base font-light">
            {profile.degree_level + " "} {profile.degree_name}
          </div>
        </div>
        {/* semester */}
        <div className="flex flex-col">
          <div className="text-base font-light text-gray-400">SEMESTER</div>
          <div className="text-base font-light">
            {profile.degree_semester || "-"}
          </div>
        </div>
        {/* university */}
        <div className="flex flex-col">
          <div className="text-base font-light text-gray-400">UNIVERSITY</div>
          <div className="text-base font-light">{profile.university}</div>
        </div>
        {/* description  */}
        <div className="flex flex-col">
          <div className="text-base font-light text-gray-400">DESCRIPTION</div>
          <div className="text-base font-light">
            {profile.description || "-"}
          </div>
        </div>
        {/* previous departments  */}
        <div className="flex flex-col">
          <div className="text-base font-light text-gray-400">
            PREVIOUS DEPARTMENTS
          </div>
          <div className="text-base font-light">
            {(profile.previousDepartments?.length &&
              profile.previousDepartments.join(", ")) ||
              "-"}
          </div>
        </div>
        {/* current job */}
        <div className="flex flex-col">
          <div className="text-base font-light text-gray-400">CURRENT JOB</div>
          <div className="text-base font-light">
            {profile.currentJob || "-"}
          </div>
        </div>
        {/* nationality */}
        <div className="flex flex-col">
          <div className="text-base font-light text-gray-400">NATIONALITY</div>
          <div className="text-base font-light">
            {profile.nationality || "-"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(ProfileOverview);
