"use client";

import { AcademicCapIcon, PencilIcon } from "@heroicons/react/24/outline";
import { User as UserIcon, Contact as ContactIcon } from "lucide-react";
import { type Prisma } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ContactType } from "@prisma/client";
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
import { ComboBox } from "./comboBox";
import { Textarea } from "@components/ui/textarea";
import { Input } from "@components/ui/input";
import { ProfileSchema } from "@lib/schemas/profile";
import { UserSchema } from "@lib/schemas/user";
import {
  type ContactSchema,
  type ContactSchemaWithProfileId,
} from "@lib/schemas/contact";
import { api } from "trpc/react";
import { toast } from "sonner";
import Breadcrumbs from "@components/ui/breadcrumbs";

interface ProfileOverviewProps {
  user: Prisma.UserGetPayload<{ include: { profile: true } }>;
  contacts: Prisma.ContactGetPayload<object>[];
}

const ContactInputSchema = z.object({
  linkedIn: z.string().url().optional().or(z.literal("")),
  gitHub: z.string().url().optional().or(z.literal("")),
  instagram: z.string().optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^\+?[0-9]+$/)
    .optional()
    .or(z.literal("")),
});

export function ProfileOverview({ user, contacts }: ProfileOverviewProps) {
  const profile = user.profile.at(0);

  const linkedInContact = contacts.find(
    (contact) => contact.type === ContactType.LINKEDIN,
  );
  const gitHubContact = contacts.find(
    (contact) => contact.type === ContactType.GITHUB,
  );
  const instagramContact = contacts.find(
    (contact) => contact.type === ContactType.INSTAGRAM,
  );
  const phoneContact = contacts.find(
    (contact) => contact.type === ContactType.PHONE,
  );

  const userForm = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    values: {
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      image: user.image ?? "",
    },
  });

  const contactFrom = useForm<z.infer<typeof ContactInputSchema>>({
    resolver: zodResolver(ContactInputSchema),
    defaultValues: {
      linkedIn: contacts.find((c) => c.type === ContactType.LINKEDIN)?.username,
      gitHub: contacts.find((c) => c.type === ContactType.GITHUB)?.username,
      instagram: contacts.find((c) => c.type === ContactType.INSTAGRAM)
        ?.username,
      phone: contacts.find((c) => c.type === ContactType.PHONE)?.username,
    },
  });

  const profileForm = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
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
  const createContactMutation = api.contact.create.useMutation();
  const updateContactMutation = api.contact.update.useMutation();
  const updateUserMutation = api.user.update.useMutation();
  const createProfileMutation = api.profile.create.useMutation();

  async function onSubmitProfile(values: z.infer<typeof ProfileSchema>) {
    const id = toast.loading("updating profile");
    try {
      await updateProfileMutation.mutateAsync(values);
      toast.success("Successfully updated profile", { id });
    } catch (err) {
      toast.error("Failed to update profile", { id });
    }
  }

  async function createNewProfile(userId: string) {
    const id = toast.loading("creating profile");
    try {
      await createProfileMutation.mutateAsync({ userId });
      toast.success("Successfully created profile", { id });
    } catch (err) {
      toast.error("Failed to create profile", { id });
    }
  }

  async function onSubmitUpdateContact(
    values: z.infer<typeof ContactInputSchema>,
  ) {
    const id = toast.loading("updating contact");
    try {
      async function createOrUpdateContact(
        existingContact: z.infer<typeof ContactSchema> | undefined,
        newContact: z.infer<typeof ContactSchemaWithProfileId>,
      ) {
        if (!existingContact) {
          await createContactMutation.mutateAsync(newContact);
        } else {
          await updateContactMutation.mutateAsync({
            id: existingContact.id,
            ...newContact,
          });
        }
      }

      const newLinkedInContact: z.infer<typeof ContactSchemaWithProfileId> = {
        profileId: profile?.id ?? 0,
        username: values.linkedIn ?? "",
        type: ContactType.LINKEDIN as ContactType,
      };
      const newGitHubContact: z.infer<typeof ContactSchemaWithProfileId> = {
        profileId: profile?.id ?? 0,
        username: values.gitHub ?? "",
        type: ContactType.GITHUB,
      };
      const newInstagramContact: z.infer<typeof ContactSchemaWithProfileId> = {
        profileId: profile?.id ?? 0,
        username: values.instagram ?? "",
        type: ContactType.INSTAGRAM,
      };
      const newPhoneContact: z.infer<typeof ContactSchemaWithProfileId> = {
        profileId: profile?.id ?? 0,
        username: values.phone ?? "",
        type: ContactType.PHONE,
      };

      await createOrUpdateContact(linkedInContact, newLinkedInContact);
      await createOrUpdateContact(gitHubContact, newGitHubContact);
      await createOrUpdateContact(instagramContact, newInstagramContact);
      await createOrUpdateContact(phoneContact, newPhoneContact);

      toast.success("Successfully updated contact", { id });
    } catch (err) {
      toast.error("Failed to update contact", { id });
    }
  }

  async function onSumbmitUser(values: z.infer<typeof UserSchema>) {
    const id = toast.loading("updating user");
    try {
      await updateUserMutation.mutateAsync(values);
      toast.success("Successfully updated user", { id });
    } catch (err) {
      toast.error("Failed to update user", { id });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center">
        <div className="flex w-1/2 min-w-[280px] flex-col gap-8">
          <Breadcrumbs title="Me" />
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
          {profile ? (
            <div className="flex flex-col gap-12">
              <Form {...profileForm}>
                <form
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="felx flex-col items-start gap-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-bold">Details</h2>
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
                                <BirthDatePicker
                                  {...field}
                                  value={
                                    field.value instanceof Date
                                      ? field.value
                                      : field.value
                                        ? new Date(field.value)
                                        : undefined
                                  }
                                />
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
                          <h2 className="text-lg font-bold">Education</h2>
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
                                <ComboBox
                                  className="w-full"
                                  placeholder="e.g. Technical University of Munich"
                                  options={[
                                    {
                                      label: "Technical University of Munich",
                                      value: "tum",
                                    },
                                    {
                                      label: "Ludwig Maximilian University",
                                      value: "lmu",
                                    },
                                    {
                                      label: "Friedrich-Alexander University",
                                      value: "fau",
                                    },
                                    { label: "Other", value: "other" },
                                  ]}
                                  {...field}
                                />
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
                                <Input
                                  placeholder="e.g. computer science"
                                  {...field}
                                />
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
                                <ComboBox
                                  className="w-full"
                                  placeholder="Select degree level"
                                  options={[
                                    { label: "Bachelor", value: "bachelor" },
                                    { label: "Master", value: "master" },
                                    { label: "PhD", value: "phd" },
                                    { label: "Other", value: "other" },
                                  ]}
                                  {...field}
                                />
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

              <Form {...contactFrom}>
                <form
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onSubmit={contactFrom.handleSubmit(onSubmitUpdateContact)}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-2">
                    <div className="felx flex-col items-start gap-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Contacts</h2>
                        <ContactIcon className="w-5" />
                      </div>
                      <Divider className="m-1" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <FormField
                        control={contactFrom.control}
                        name="linkedIn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://www.linkedin.com/in/yourname"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactFrom.control}
                        name="gitHub"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GitHub</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://github.com/yourname"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactFrom.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://www.instagram.com/yourname"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactFrom.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. +49 199 8877665"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onSubmit={userForm.handleSubmit(onSumbmitUser)}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="felx flex-col items-start gap-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-bold">Account</h2>
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
                              // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
          ) : (
            <div className="flex flex-col items-center justify-stretch gap-4">
              <p>No profile found. Do you want to create a new Profile?</p>
              <Button
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => createNewProfile(user.id)}
              >
                Create Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
