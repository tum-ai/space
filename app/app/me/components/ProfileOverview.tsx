"use client";
import { Button } from "@components/ui/button";
import Icon from "@components/Icon";
import Image from "next/image";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import ProfileEditor from "../../me/components/ProfileEditor";
import Tag from "@components/Tag";
import { useMemo } from "react";
import { Card, CardContent, CardTitle } from "@components/ui/card";

function formatKey(key) {
  return key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

function ProfileOverview({ profile }) {
  const grid = profile.grid;

  const gridEntries = useMemo(() => {
    return Object.entries(grid).filter(([key]) => key !== "description");
  }, [grid]);

  return (
    <div className="space-y-8">
      <ProfileHeader profile={profile} />
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        {gridEntries.map(([oKey, oVal]) => (
          <Card className="p-5">
            <CardTitle className="mb-4 text-3xl font-thin">{oKey}</CardTitle>
            <div className="flex flex-col gap-12 p-3">
              {Object.entries(oVal).map(([iKey, iVal]) => (
                <div className="flex flex-row justify-between">
                  <p className="text-gray-500">{formatKey(iKey)}</p>
                  <p>
                    {iVal instanceof Date ? iVal.toLocaleDateString() : iVal}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ))}
        {grid.description && (
          <Card className="col-span-2 p-5 lg:col-span-1">
            <CardTitle className="mb-3 text-3xl font-thin">
              description
            </CardTitle>
            <div className="p-3">{grid.description}</div>
          </Card>
        )}
      </div>
    </div>
  );
}

function ProfilePicture({ image }) {
  return (
    <>
      {image ? (
        <Image
          className="h-36 w-36 rounded-full object-cover"
          src={image}
          width={150}
          height={150}
          alt="Your profile picture"
        />
      ) : (
        <div className="flex h-36 w-36 rounded-full bg-gray-300 text-center drop-shadow-lg dark:bg-gray-800">
          <Icon name={"FaUser"} className="m-auto text-4xl text-white" />
        </div>
      )}
    </>
  );
}

function ProfileHeader({ profile }) {
  const { general, grid } = profile;

  return (
    <div className="grid w-full grid-cols-3">
      <div className="flex flex-col items-start">
        <ProfilePicture image={general.image} />
        <div className="mt-4">
          <h1 className="text-2xl font-light">
            {grid.personal.first_name + " " + grid.personal.last_name}
          </h1>
          <div className="flex flex-row gap-6">
            <p>ID: {general.id}</p>
            <Link
              className="hover:text-blue-800 dark:hover:text-blue-200"
              href={`mailto:${general.email}`}
            >
              {general.email}
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 justify-center items-end">
        <Tag
          text={
            general.current_department +
            " " +
            general.current_department_position
          }
          color="indigo"
        />
        <Tag text={general.activity_status} color="green" />
      </div>
      <div className="flex items-end justify-end">
        <ProfileEditor
          trigger={
            <Button>
              <PencilSquareIcon className="mr-2 w-5" />
              Edit
            </Button>
          }
          profile={profile}
        />
      </div>
    </div>
  );
}

export default ProfileOverview;
