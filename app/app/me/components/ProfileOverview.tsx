"use client";
import { Button } from "@components/ui/button";
import Icon from "@components/Icon";
import Image from "next/image";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import ProfileEditor from "../../me/components/ProfileEditor";
import Label from "@components/Label";
import Tag from "@components/Tag";
import { useMemo } from "react";
import { Card, CardContent, CardTitle } from "@components/ui/card";

function formatKey(key) {
  return key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

function ProfileOverview({ profile }) {
  const { general, grid } = profile;

  const gridEntries = useMemo(() => {
    return Object.entries(grid).filter(([key]) => key !== "description");
  }, [grid]);

  return (
    <div className="space-y-6">
      <div className="flex w-full flex-row items-center space-x-8 mb-16">
        <ProfilePicture image={general.image} />
        <div className="w-full space-y-3">
          <div className="flex w-full flex-row items-center justify-between">
            <h1 className="mb-2 text-6xl font-thin">
              {grid.personal.first_name + " " + grid.personal.last_name}
            </h1>
            <div className="py-4">
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
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row gap-6">
              <p>ID: {general.id}</p>
              <Link
                className="hover:text-blue-800 dark:hover:text-blue-200"
                href={`mailto:${general.email}`}
              >
                {general.email}
              </Link>
              <Tag text={general.current_department} color="blue" />
              <Tag text={general.current_department_position} color="purple" />
              <Tag text={general.activity_status} color="green" />
            </div>
            <div className="flex flex-row gap-2">
             {/* <Tag text={general.current_department} color="blue" />
              <Tag text={general.current_department_position} color="purple" />
              <Tag text={general.activity_status} color="green" /> */}
            </div>
          </div>
        </div>
      </div>
      {gridEntries.map(([oKey, oVal]) => (
        <div className="py-4">
          <CardTitle className="mb-3 text-3xl font-thin">{oKey}</CardTitle>
          <div className="grid grid-cols-4 gap-10">
            {Object.entries(oVal).map(([iKey, iVal]) => (
              <Label
                key={iKey}
                text={iVal instanceof Date ? iVal.toLocaleDateString() : iVal}
                heading={formatKey(iKey)}
                fullWidth
              />
            ))}
          </div>
        </div>
      ))}
      {grid.description && (
        <div className="col-span-2 py-4">
          <CardTitle className="mb-3 text-3xl font-thin">description</CardTitle>
          <p>{grid.description}</p>
        </div>
      )}
    </div>
  );
}

function ProfilePicture({ image }) {
  return (
    <>
      {image ? (
        <Image
          className="h-28 w-28 rounded-full border object-cover"
          src={image}
          width={100}
          height={100}
          alt="Your profile picture"
        />
      ) : (
        <div className="flex h-28 w-28 rounded-full bg-gray-300 text-center drop-shadow-lg dark:bg-gray-800">
          <Icon name={"FaUser"} className="m-auto text-4xl text-white" />
        </div>
      )}
    </>
  );
}

export default ProfileOverview;
