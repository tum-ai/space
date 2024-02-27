import React from "react";
import { Button } from "@components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { FullFormSchema } from "../schema";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import Tag from "@components/Tag";
import { Card } from "@components/ui/card";
import Image from "next/image";
import { api } from "trpc/react";
import { Member } from "./general";

interface MemberBarProps {
  member: Member;
  children?: React.ReactNode;
}

export const MemberBar = ({ member, children }: MemberBarProps) => {
  return (
    <Card className="flex items-center justify-between px-4 py-3 shadow">
      <div className="flex items-center gap-6">
        {member.image && (
          <Image
            src={member.image}
            alt={`Image of ${member.name}`}
            width={40}
            height={40}
            className="rounded-md"
          />
        )}
        <div className="flex items-center gap-2 truncate">
          <h2 className="text-md">{member.name}</h2>
          {member.tags?.map((tag) => {
            return <Tag key={tag.text} text={tag.text} color={tag.color} />;
          })}
        </div>
      </div>
      {children}
    </Card>
  );
};

export const MemberSection = () => {
  const form = useFormContext<z.infer<typeof FullFormSchema>>();

  const {
    fields: admins,
    remove: removeAdmin,
    append: appendAdmin,
  } = useFieldArray({
    control: form.control,
    name: "generalInformation.admins",
  });
  const {
    fields: screeners,
    remove: removeScreener,
    append: appendScreener,
  } = useFieldArray({
    control: form.control,
    name: "generalInformation.screeners",
  });
  const { data, isLoading } = api.user.getAll.useQuery();

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <h3 className="mb-3 scroll-m-20 text-2xl font-semibold tracking-tight">
          Admins
        </h3>
        <div className="flex flex-col gap-2">
          {admins.map((member, index) => (
            <MemberBar key={member.id} member={member}>
              <Button
                size="icon"
                onClick={() => removeAdmin(index)}
                variant="ghost"
              >
                <X />
              </Button>
            </MemberBar>
          ))}
          <Dialog>
            <Button variant="outline" asChild>
              <DialogTrigger>+ Add Admin</DialogTrigger>
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add admin</DialogTitle>
                <DialogDescription>
                  Admins can configure and manage opportunities
                </DialogDescription>
              </DialogHeader>

              <div className="mb-6 space-y-4">
                {isLoading && <p>Loading...</p>}
                {data?.map((user) => {
                  const member = {
                    ...user,
                    name: user.name ?? undefined,
                    image: user.image ?? undefined,
                  };

                  return (
                    <MemberBar key={user.id} member={member}>
                      <Button
                        size="icon"
                        onClick={() => appendAdmin(member)}
                        variant="ghost"
                      >
                        <Plus />
                      </Button>
                    </MemberBar>
                  );
                })}
              </div>

              <Button asChild>
                <DialogClose>Done</DialogClose>
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <h3 className="mb-3 scroll-m-20 text-2xl font-semibold tracking-tight">
          Screeners
        </h3>
        <div className="flex flex-col gap-2">
          {screeners.map((member, index) => (
            <MemberBar key={member.id} member={member}>
              <Button
                size="icon"
                onClick={() => removeScreener(index)}
                variant="ghost"
              >
                <X />
              </Button>
            </MemberBar>
          ))}
          <Dialog>
            <Button variant="outline" asChild>
              <DialogTrigger>+ Add screener</DialogTrigger>
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add screener</DialogTitle>
                <DialogDescription>
                  Screeners can review applications
                </DialogDescription>
              </DialogHeader>

              <div className="mb-6 space-y-4">
                {isLoading && <p>Loading...</p>}
                {data?.map((user) => {
                  const member = {
                    ...user,
                    name: user.name ?? undefined,
                    image: user.image ?? undefined,
                  };

                  return (
                    <MemberBar key={user.id} member={member}>
                      <Button
                        size="icon"
                        onClick={() => appendScreener(member)}
                        variant="ghost"
                      >
                        <Plus />
                      </Button>
                    </MemberBar>
                  );
                })}
              </div>

              <Button asChild>
                <DialogClose>Done</DialogClose>
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
