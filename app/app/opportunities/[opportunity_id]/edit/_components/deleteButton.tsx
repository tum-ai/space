"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { api } from "trpc/react";
import { toast } from "sonner";
import { Button } from "@components/ui/button";
import { DialogClose, DialogHeader } from "@components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  title: string;
  id: number;
}

export const DeleteButton = ({ title, id }: DeleteButtonProps) => {
  const form = useForm({
    resolver: zodResolver(z.object({ confirm: z.literal(title) })),
    defaultValues: undefined,
  });

  const router = useRouter();
  const deleteMutation = api.opportunity.deleteById.useMutation();

  return (
    <Form {...form}>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" variant="destructive">
            <Trash className="mr-2" />
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              opportunity and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          <FormField
            control={form.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm</FormLabel>
                <FormControl>
                  <Input placeholder="My cool opportunity" {...field} />
                </FormControl>
                <FormDescription>
                  <p>Confirm the title of the opportunity to proceed.</p>
                  <p>{`Your opportunity is called "${title}"`}</p>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline">
              <DialogClose>Cancel</DialogClose>
            </Button>
            <Button
              variant="destructive"
              onClick={(event) =>
                void form.handleSubmit(
                  async () => {
                    const toastId = toast.loading("Deleting opportunity");
                    try {
                      await deleteMutation.mutateAsync({ id });
                      toast.success(
                        `Successfully deleted opportunity: ${title}`,
                        {
                          id: toastId,
                        },
                      );
                      router.push("/opportunities");
                    } catch (err) {
                      toast.error("Failed to delete opportunity", {
                        id: toastId,
                      });
                    }
                  },
                  (err) => console.error(err),
                )(event)
              }
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
};
