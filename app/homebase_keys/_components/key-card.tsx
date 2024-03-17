"use client";

import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { DataTable } from "@components/ui/data-table";
import { Hand, Key as KeyIcon } from "lucide-react";
import { Prisma, User } from "@prisma/client";
import { logEntryColumns, userColumns } from "./columns";
import { Session } from "next-auth";
import { LogEntry } from "@lib/types/key";

interface Props {
  realKey: Prisma.KeyGetPayload<{ include: { user: true } }>;
  session: Session;
  users: User[];
}

export const KeyCard = ({ realKey: key, session, users }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <p className="flex items-center gap-4">
            <KeyIcon className="h-10 w-10" /> with id: {key.id}
          </p>
        </CardTitle>
        <CardDescription>{`Owned by ${key.user.name}`}</CardDescription>
      </CardHeader>

      <CardContent>
        <DataTable
          columns={logEntryColumns}
          data={key.log as unknown as LogEntry[]}
          hasPagination
        />
      </CardContent>

      {key.user.id === session?.user.id && (
        <CardFooter className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Hand className="mr-2" />
                Give away
              </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[42rem] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Hand over key to another member</DialogTitle>
              </DialogHeader>

              <DataTable
                columns={userColumns}
                data={users.map((user) => ({
                  ...user,
                  keyId: key.id,
                }))}
                hasPagination
              />

              <DialogFooter></DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
};
