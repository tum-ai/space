"use client";

import Image from "next/image";
import { AcademicCapIcon, PencilIcon } from "@heroicons/react/24/outline";
import { User as UserIcon } from "lucide-react";
import { User } from "@prisma/client";

interface ProfileOverviewProps {
  user: User;
}

function ProfileOverview({ user }: ProfileOverviewProps) {
  return (
    <div className="flex justify-center">
      <div className="max-w-[850px] space-y-10">
        <div className="grid grid-cols-2 items-center gap-4 lg:grid-cols-4">
          <div className="col-span-2 flex items-center gap-4">
            {user.image ? (
              <Image
                className="h-32 w-32 rounded-full object-cover"
                src={user.image}
                width={150}
                height={150}
                alt="Your profile picture"
              />
            ) : (
              <div className="flex h-32 w-32 rounded-full bg-gray-300 text-center drop-shadow-lg dark:bg-gray-800">
                <UserIcon
                  name={"FaUser"}
                  className="m-auto text-4xl text-white"
                />
              </div>
            )}
            <div>
              <h3 className="text-3xl font-medium">{user.name}</h3>
              <a
                href={`mailto:${user.email}`}
                className="text-gray-500 hover:text-blue-500"
              >
                {user.email}
              </a>
            </div>
          </div>
          <div className="flex gap-2 lg:justify-self-end">
            {/* <Tag text={data.current_department} color="blue" />
            <Tag text={data.current_department_position} color="purple" />
            <Tag text={data.activity_status} color="green" /> */}
          </div>
          <div className="justify-self-end">
            {/*
            <ProfileEditor
              trigger={
                <Button>
                  <PencilSquareIcon className="mr-2 w-5" />
                  Edit
                </Button>
              }
              profile={data}
            />
          */}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <div className="mb-2 flex flex-row items-center">
              <PencilIcon className={"mr-2 h-5 w-5"} />
              <h3 className="text-2xl font-medium">Description</h3>
            </div>
            {/* <p className="text-gray-400">{data.description}</p> */}
          </div>
          <div>
            <div className="mb-2 flex flex-row items-center">
              <UserIcon className={"mr-2 h-5 w-5"} />
              <h3 className="text-2xl font-medium">Personal</h3>
            </div>
            {/* <ContentList data={data.personal} /> */}
          </div>
          <div>
            <div className="mb-2 flex flex-row items-center">
              <AcademicCapIcon className={"mr-2 h-5 w-5"} />
              <h3 className="text-2xl font-medium">Academic</h3>
            </div>
            {/* <ContentList data={data.academia} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentList({ data }) {
  return (
    <div className="flex flex-col gap-3">
      {Object.entries(data).map(([iKey, iVal]) => (
        <div className="grid grid-cols-2" key={`${iKey}-${iVal}`}>
          <p className="text-gray-400">{formatKey(iKey)}</p>
          <p>
            {iVal instanceof Date ? iVal.toLocaleDateString() : String(iVal)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ProfileOverview;
