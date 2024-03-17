"use client";

import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "trpc/react";

export const CreateKeyButton = () => {
  const mutation = api.key.create.useMutation();
  const router = useRouter();

  return (
    <Button
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => {
        const toastId = toast.loading("Creating key...)");
        try {
          await mutation.mutateAsync(),
            toast.success("Created new key", { id: toastId });
          router.refresh();
        } catch (err) {
          toast.error("Failed to create new key", { id: toastId });
        }
      }}
    >
      <Plus className="mr-2" />
      Add new key
    </Button>
  );
};
