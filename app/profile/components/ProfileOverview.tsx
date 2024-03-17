"use client";

import {
  AcademicCapIcon,
  PencilIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { User, User as UserIcon } from "lucide-react";
import { Prisma } from "@prisma/client";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";

interface ProfileOverviewProps {
  user: Prisma.UserGetPayload<{ include: { profile: true } }>;
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
  const profile = user.profile.at(0);

  return (
    <div className="space-y-8">
      <div className="mb-12 flex flex-col space-y-6">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-28 w-28">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-3">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {user.name}
              </h1>
              <a
                href={`mailto:${user.email}`}
                className="text-muted-foreground underline"
              >
                {user.email}
              </a>
            </div>
          </div>

          <Button>
            <PencilSquareIcon className="mr-2 w-5" />
            Edit
          </Button>
        </div>
      </div>

      {profile && (
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="flex gap-2 lg:justify-self-end">
            {profile?.activityStatus && <Badge>{profile.activityStatus}</Badge>}
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <div className="mb-2 flex flex-row items-center">
                <PencilIcon className={"mr-2 h-5 w-5"} />
                <h3 className="text-2xl font-medium">Description</h3>
              </div>

              <p className="text-gray-400">{profile?.description}</p>
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
      )}
    </div>
  );
}
