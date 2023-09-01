"use client";
import Icon from "@components/Icon";
import { Profile } from "@models/profile";
import { observer } from "mobx-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  profile: Profile;
}
function ProfileOverview({ profile }: Props) {
  return (
    <div className="m-auto max-w-3xl">
      {profile.profile_picture && (
        <Image
          className="m-auto h-28 w-28 rounded-full border object-cover drop-shadow-lg"
          src={profile.profile_picture}
          width={100}
          height={100}
          alt="Your profile picture"
        />
      )}
      {!profile.profile_picture && (
        <div className="m-auto flex h-28 w-28 rounded-full bg-gray-300 text-center drop-shadow-lg dark:bg-gray-800">
          <Icon name={"FaUser"} className="m-auto text-4xl text-white" />
        </div>
      )}

      <div className="mt-12">
        <div className="max-w-90 flex flex-col items-start space-y-6 xl:col-span-2">
          <h1 className="w-full text-center text-6xl font-thin">
            {profile.first_name + " " + profile.last_name}
          </h1>

          {profile.socialNetworks &&
            profile.socialNetworks.map((socialNetwork) => (
              <Link key={socialNetwork.link} href={socialNetwork.link}>
                <Icon
                  name={
                    socialNetwork.type === "Other"
                      ? "FaGlobe"
                      : (("Fa" + socialNetwork.type) as any)
                  }
                  className="rounded-full p-2 hover:scale-105"
                />
              </Link>
            ))}
        </div>

        <dl className="divide-y divide-gray-600">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium">Department</dt>
            <dd>{profile.department}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium">Degree</dt>
            <dd>
              {profile.degree_level} {profile.degree_name}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium">Semester</dt>
            <dd>{profile.degree_semester}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium">University</dt>
            <dd>{profile.university}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium">Description</dt>
            <dd>{profile.description}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium">Previous Departments</dt>
            <dd>
              {profile.previousDepartments?.length &&
                profile.previousDepartments.join(", ")}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium">Current Job</dt>
            <dd>{profile.currentJob}</dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="font-medium">Nationality</dt>
            <dd>{profile.nationality}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default observer(ProfileOverview);
