"use client";
import { Button } from "@components/ui/button";
import Icon from "@components/Icon";
import { Profile } from "@models/profile";
import Image from "next/image";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import ProfileEditor from "../../profile/components/ProfileEditor";

interface Props {
  profile: Profile;
}
function ProfileOverview({ profile }: Props) {
  return (
    <div className="relative m-auto max-w-3xl">
      <div className="absolute top-0 flex w-full justify-end p-4">
        <ProfileEditor
          trigger={
            <Button>
              <PencilSquareIcon className="mr-2 w-5" />
              Edit
            </Button>
          }
        />
      </div>

      {profile.image && (
        <Image
          className="m-auto h-28 w-28 rounded-full border object-cover drop-shadow-lg"
          src={profile.image}
          width={100}
          height={100}
          alt="Your profile picture"
        />
      )}
      {!profile.image && (
        <div className="m-auto flex h-28 w-28 rounded-full bg-gray-300 text-center drop-shadow-lg dark:bg-gray-800">
          <Icon name={"FaUser"} className="m-auto text-4xl text-white" />
        </div>
      )}

      <div className="mt-6 space-y-12">
        <div className="max-w-90 flex flex-col items-center space-y-3 xl:col-span-2">
          <h1 className="w-full text-center text-6xl font-thin">
            {profile.firstName + " " + profile.lastName}
          </h1>
          <Link
            className="mx-auto text-lg hover:text-blue-800"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
          </Link>

          {/*
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
                */}
        </div>
        <dl className="divide-y divide-gray-600">
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
            <dt className="font-medium">Nationality</dt>
            <dd>{profile.nationality}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default ProfileOverview;
