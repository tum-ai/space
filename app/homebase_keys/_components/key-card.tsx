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
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
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
import { api } from "trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  realKey: Prisma.KeyGetPayload<{ include: { user: true } }>;
  session: Session;
  users: User[];
}

export const KeyCard = ({ realKey: key, session, users }: Props) => {
  const deleteMutation = api.key.deleteById.useMutation();
  const router = useRouter();

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
          <div className="flex gap-2">
            {session.user.roles.includes("ADMIN") && (
              <Button
                variant="destructive"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => {
                  const toastId = toast.loading("Creating key...)");
                  try {
                    await deleteMutation.mutateAsync({
                      keyId: key.id,
                    });
                    toast.success("Created new key", { id: toastId });
                    router.refresh();
                  } catch (err) {
                    toast.error("Failed to create new key", { id: toastId });
                  }
                }}
              >
                <Trash className="mr-2" />
                Delete
              </Button>
            )}
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
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
