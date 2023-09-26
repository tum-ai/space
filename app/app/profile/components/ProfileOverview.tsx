"use client";
import React from "react";
import { Button } from "@components/Button";
import Icon from "@components/Icon";
import { MeModel } from "@models/me";
import { JobHistory, Profile, SocialNetwork } from "@models/profile";
import ProfileEditor from "../../me/components/ProfileEditor";
import { observer } from "mobx-react";
import Image from "next/image";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface Props {
  profile: Profile;
  meModel?: MeModel;
  publicView?: boolean;
}

const ProfilePicture: React.FC<{ src?: string }> = ({ src }) => {
  if (src) {
    return (
      <Image
        className="m-auto h-28 w-28 rounded-full border object-cover drop-shadow-lg"
        src={src}
        width={100}
        height={100}
        alt="Your profile picture"
      />
    );
  }
  return (
    <div className="m-auto flex h-28 w-28 rounded-full bg-gray-300 text-center drop-shadow-lg dark:bg-gray-800">
      <Icon name="FaUser" className="m-auto text-4xl text-white" />
    </div>
  );
};

const SocialNetworks: React.FC<{
  networks?: SocialNetwork[];
}> = ({ networks }) => {
  return (
    <>
      {networks?.map((network) => (
        <Link key={network.link} href={network.link}>
          <Icon
            name={
              (network.type === "Other"
                ? "FaGlobe"
                : `Fa${network.type}`) as any
            }
            className="rounded-full p-2 hover:scale-105"
          />
        </Link>
      ))}
    </>
  );
};

const formatKey = (key: string): string => {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const JobHistory: React.FC<{
  jobs?: JobHistory[];
}> = ({ jobs = [] }) => {
  const sortedJobs = jobs.sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.end_date).getTime(),
  );

  return (
    <div className="mt-6 space-y-8">
      <h1 className="text-4xl font-thin">Job History</h1>
      {sortedJobs.map((job) => (
        <div
          key={job.position}
          className="grid-cols-2 gap-4 rounded-2xl p-4 shadow-md dark:ring-1 dark:ring-gray-600 sm:grid lg:grid-cols-4"
        >
          {Object.entries(job).map(([key, value]) => (
            <div key={key} className="space-y-3">
              <h3 className="text-sm font-light">{formatKey(key)}</h3>
              <p className="font-semibold">{value}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const ProfileDetailItem: React.FC<{ title: string; detail: string }> = ({
  title,
  detail,
}) => {
  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="font-medium">{title}</dt>
      <dd>{detail}</dd>
    </div>
  );
};

const ProfileOverview: React.FC<Props> = ({ profile, meModel, publicView }) => {
  return (
    <div className="relative m-auto max-w-3xl">
      {meModel && (
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
      )}
      <ProfilePicture src={profile.profile_picture} />
      <div className="mt-6 space-y-12">
        <div className="max-w-90 flex flex-col items-center space-y-3 xl:col-span-2">
          <h1 className="w-full text-center text-6xl font-thin">
            {profile.first_name + " " + profile.last_name}
          </h1>
          <Link
            className="mx-auto text-lg hover:text-blue-800"
            href={`mailto:${profile.email}`}
          >
            {profile.email}
          </Link>
          <SocialNetworks networks={profile.socialNetworks} />
        </div>
        <dl className="divide-y divide-gray-600">
          <ProfileDetailItem
            title="Degree"
            detail={`${profile.degree_level} ${profile.degree_name}`}
          />
          <ProfileDetailItem
            title="Semester"
            detail={profile.degree_semester}
          />
          <ProfileDetailItem title="University" detail={profile.university} />
          <ProfileDetailItem title="Description" detail={profile.description} />
          {!publicView && (
            <ProfileDetailItem
              title="Nationality"
              detail={profile.nationality}
            />
          )}
        </dl>
        <JobHistory jobs={profile.job_history || []} />
        {/* Adding a default value here */}
      </div>
    </div>
  );
};

export default observer(ProfileOverview);
