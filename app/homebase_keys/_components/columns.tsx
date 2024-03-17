import { Button } from "@components/ui/button";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Hand, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { DataTableColumnHeader } from "@components/ui/data-table-column-header";
import { LogEntry } from "@lib/types/key";
import { api } from "trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export const logEntryColumns: ColumnDef<LogEntry>[] = [
  {
    id: "image",
    header: "image",
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.original.user.image ?? undefined} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return <p>{format(row.original.date, "HH:mm - dd.LL.yyyy")}</p>;
    },
  },
];

interface GiveAwayButtonProps {
  keyId: number;
  recipientId: string;
}

const GiveAwayButton = ({ keyId, recipientId }: GiveAwayButtonProps) => {
  const mutation = api.key.giveAway.useMutation();
  const router = useRouter();
  return (
    <Button
      size="icon"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => {
        const toastId = toast.loading("Giving away key...");
        try {
          await mutation.mutateAsync({
            keyId,
            recipientId,
          }),
            toast.success("Given away!", { id: toastId });
          router.refresh();
        } catch (err) {
          toast.error("Failed to give away key", { id: toastId });
        }
      }}
    >
      <Hand />
    </Button>
  );
};

export const userColumns: ColumnDef<User & { keyId: number }>[] = [
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <Avatar>
          <AvatarImage src={row.original.image ?? undefined} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    id: "give",
    header: "Give",
    cell: ({ row }) => {
      return (
        <GiveAwayButton
          keyId={row.original.keyId}
          recipientId={row.original.id}
        />
      );
    },
  },
];
