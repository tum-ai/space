"use client";

import {
  AcademicCapIcon,
  PencilIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { User as UserIcon } from "lucide-react";
import { Prisma } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Divider } from "@tremor/react";
import { Button } from "@components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@components/ui/avatar";
import { BirthDatePicker } from "./datePicker";
import { Textarea } from "@components/ui/textarea";
import { Input } from "@components/ui/input";
import { ProfileSchema } from "@lib/schemas/profile";
import { UserSchema } from "@lib/schemas/user";
import { api } from "trpc/react";
import { toast } from "sonner";

interface ProfileOverviewProps {
  user: Prisma.UserGetPayload<{ include: { profile: true } }>;
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
  const profile = user.profile.at(0);

  const userForm = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    values: {
      id: user.id ?? "",
      name: user.name ?? "",
      email: user.email ?? "",
      image: user.image ?? "",
    },
  });

  const profileForm = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    values: {
      userId: user.id ?? "",
      description: profile?.description ?? undefined,
      birthday: profile?.birthday ?? undefined,
      nationality: profile?.nationality ?? undefined,
      university: profile?.university ?? undefined,
      degreeName: profile?.degreeName ?? undefined,
      degreeLevel: profile?.degreeLevel ?? undefined,
      degreeSemester: profile?.degreeSemester ?? undefined,
    },
  });

  const updateProfileMutation = api.profile.update.useMutation();
  const updateUserMutation = api.user.update.useMutation();

  async function onSubmitProfile(values: z.infer<typeof ProfileSchema>) {
    const id = toast.loading("updating profile");
    try {
      await updateProfileMutation.mutateAsync(values);
      toast.success("Successfully updated profile", { id });
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update profile", { id });
    }
  }

  async function onSumbmitUser(values: z.infer<typeof UserSchema>) {
    const id = toast.loading("updating user");
    try {
      await updateUserMutation.mutateAsync(values);
      toast.success("Successfully updated user", { id });
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update user", { id });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center">
        <div className="flex w-1/2 min-w-[280px] flex-col gap-8">
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-28 w-28">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>
                  <UserIcon />
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
          </div>
          {profile && (
            <div className="flex flex-col gap-12">
              <Form {...userForm}>
                <form
                  onSubmit={userForm.handleSubmit(onSubmitProfile)}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="felx flex-col items-start gap-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-bold ">Details</h2>
                          <PencilIcon className="w-5" />
                        </div>
                        <Divider className="m-1" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={profileForm.control}
                          name="nationality"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nationality</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. german" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about yourself"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="birthday"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Birthday</FormLabel>
                              <FormControl>
                                <BirthDatePicker {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="felx flex-col items-start gap-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-bold ">Education</h2>
                          <AcademicCapIcon className="w-5" />
                        </div>
                        <Divider className="m-1" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={profileForm.control}
                          name="university"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>University</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. tum" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="degreeName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. master" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="degreeLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree Level</FormLabel>
                              <FormControl>
                                <Input placeholder="?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="degreeSemester"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree Semester</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="1-10"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        ? parseInt(e.target.value, 10)
                                        : null,
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row justify-end">
                      <Button className="w-[160px]" type="submit">
                        Change Profile
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
              <Form {...userForm}>
                <form
                  onSubmit={userForm.handleSubmit(onSumbmitUser)}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="felx flex-col items-start gap-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-bold ">Account</h2>
                          <UserIcon className="w-5" />
                        </div>
                        <Divider className="m-1" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <FormField
                          control={userForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={userForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. tum@excellency.de"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={userForm.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. https://example.com/image.jpg"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row justify-end">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button type="button" className="w-[160px]">
                            Change Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently change your account
                              information and sometimes lead to errors. We
                              strongly encourage you to think twice before.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={userForm.handleSubmit(onSumbmitUser)}
                            >
                              Change Account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
