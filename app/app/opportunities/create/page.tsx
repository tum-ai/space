"use client";

import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Cross1Icon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import Select from "@components/Select";
import { MemberBar, AddMemberBar } from "../components/MemberBar";
import Dialog from "@components/Dialog";
import { useState } from "react";
import Tooltip from "@components/Tooltip";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@lib/utils";
import { Calendar } from "@components/ui/calendar";
import { Separator } from "@components/ui/separator";
import { api } from "trpc/react";
import { toast } from "sonner";

const mockAdmins = [
  {
    id: 1,
    photoUrl: "https://placekitten.com/200/200",
    name: "Simon Huang",
    tags: [
      { text: "Owner", color: "yellow" },
      { text: "Development", color: "blue" },
    ],
  },
  {
    id: 2,
    photoUrl: "https://placekitten.com/201/201",
    name: "Max von Storch",
    tags: [{ text: "RnD", color: "green" }],
  },
];

const mockScreeners = [
  {
    id: 3,
    photoUrl: "https://placekitten.com/202/202",
    name: "Emma Johnson",
    tags: [{ text: "Legal and finance", color: "orange" }],
  },
  {
    id: 4,
    photoUrl: "https://placekitten.com/204/204",
    name: "Oliver Davis",
    tags: [{ text: "Community", color: "red" }],
  },
  {
    id: 5,
    photoUrl: "https://placekitten.com/206/206",
    name: "Sophia Rodriguez",
    tags: [{ text: "Development", color: "purple" }],
  },
];

const mockMembers = [
  {
    key: "Simon Huang",
    value: "1",
  },
  {
    key: "Tim Baum",
    value: "2",
  },
];

enum Roles {
  ADMIN = "Admin",
  SCREENER = "Screener",
}

export default function CreateOpportunity() {
  const formSchema = z
    .object({
      tallyId: z.string(),
      title: z.string(),
      description: z.string(),
      start: z.date(),
      end: z.date(),
    })
    .refine((data) => data.start < data.end, {
      message: "End must be later than begin",
      path: ["end"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tallyId: undefined,
      title: undefined,
      start: undefined,
      end: undefined,
      description: undefined,
    },
  });

  const createOpportunity = api.opportunity.create.useMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const id = toast.loading("Creating opportunity");
    try {
      await createOpportunity.mutateAsync(values);
      toast.success("Opportunity created", { id });
    } catch (error) {
      toast.error("Failed to create opportunity", { id });
    }
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex flex-col gap-3">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create new opportunity
        </h1>

        <p className="text-muted-foreground">Configure a new opportunity</p>
      </div>

      <Form {...form}>
        <form onSubmit={void form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tallyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tally Id</FormLabel>
                  <FormControl>
                    <Input placeholder="venture-campaign-ws-2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opportunity title</FormLabel>
                  <FormControl>
                    <Input placeholder="Venture campaign WS2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Begin</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Venture campaign WS2023" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="col-span-2" />

          <MemberSection />

          <div className="mt-8 flex w-full justify-end">
            <Button type="submit">
              Next
              <ChevronRightIcon className="ml-1" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function MemberSection() {
  const [dialog, setDialog] = useState({ open: false, role: undefined } as {
    open: boolean;
    role: Roles | undefined;
  });

  const [selectedMember, setSelectedMember] = useState(
    undefined as string | undefined,
  );

  function submitAddMember() {
    setDialog({ open: false, role: undefined });
    setSelectedMember(undefined);
    //TODO: Add member to list via API
  }

  const stakeholders = [
    {
      title: "Admins",
      members: mockAdmins,
      role: Roles.ADMIN,
      hint: "Admins can edit opportunities",
    },
    {
      title: "Screeners",
      members: mockScreeners,
      role: Roles.SCREENER,
      hint: "Screeners evaluate incoming applications",
    },
  ];

  return (
    <div className="md :flex-row flex flex-col  gap-8">
      {stakeholders.map((stakeholder) => {
        return (
          <div key={stakeholder.role} className="flex flex-1 flex-col">
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-2xl">{stakeholder.role}s</h1>
              <Tooltip trigger={<QuestionMarkCircledIcon />}>
                {stakeholder.hint}
              </Tooltip>
            </div>
            <div className="flex flex-col gap-2">
              {stakeholder.members.map((member) => {
                return (
                  <MemberBar
                    key={member.id}
                    name={member.name}
                    photoUrl={member.photoUrl}
                    tags={member.tags}
                    onDelete={() => console.log("delete me" + member.id)}
                  />
                );
              })}
              <Dialog
                isOpenOutside={dialog.open}
                setIsOpenOutside={() =>
                  setDialog({ open: true, role: stakeholder.role })
                }
                trigger={
                  <AddMemberBar
                    text={`+ Add ${stakeholder.role.toLowerCase()}`}
                    onClick={() => console.log("add me")}
                  />
                }
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg">
                      Add {dialog.role?.toLowerCase()} to this opportunity
                    </h2>
                    <Cross1Icon
                      className="cursor-pointer text-gray-400"
                      onClick={() =>
                        setDialog({ open: false, role: undefined })
                      }
                    />
                  </div>
                  <Select
                    placeholder="Select a member"
                    options={mockMembers}
                    value={selectedMember}
                    setSelectedItem={(item: string) => {
                      setSelectedMember(item);
                    }}
                  />
                </div>
                <div className="mt-4 grid w-full">
                  <Button
                    disabled={!selectedMember}
                    className="justify-self-end"
                    onClick={submitAddMember}
                  >
                    Add
                  </Button>
                </div>
              </Dialog>
            </div>
          </div>
        );
      })}
    </div>
  );
}
