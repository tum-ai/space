"use client";

import { Button } from "@components/ui/button";
import ErrorMessage from "@components/ErrorMessage";
import Dialog from "@components/Dialog";
import Input from "@components/Input";
import { useStores } from "@providers/StoreProvider";
import { Field, Form, Formik } from "formik";
import * as DialogRadix from "@radix-ui/react-dialog";
import Image from "next/image";
import { UploadIcon, DownloadIcon } from "@radix-ui/react-icons";
import { z } from "zod";

const profileSchema = z.object({
  first_name: z.string().nonempty("First name is required."),
  last_name: z.string().nonempty("Last name is required."),
  birthday: z.date().nullable(),
  nationality: z.string().nullable(),
  university: z.string().nullable(),
  degree_level: z.string().nullable(),
  degree_name: z.string().nullable(),
  degree_semester: z
    .number()
    .min(1, "Semester must be at least 1.")
    .int("Semester must be an integer.")
    .nullable(),
});

function ProfileEditor({ trigger, profile }) {
  return (
    <Dialog trigger={trigger}>
      <Formik
        initialValues={profile}
        validationSchema={profileSchema}
        onSubmit={async (values) => {
          throw Error("TODO: Not implemented - update profile in DB");
        }}
      >
        {({ handleChange }) => (
          <ProfileForm handleChange={handleChange} editorProfile={profile} />
        )}
      </Formik>
    </Dialog>
  );
}

const ProfileForm = ({ handleChange, editorProfile }) => (
  <Form className="flex w-full flex-col space-y-6">
    <ProfileHeader />
    <ProfilePicture handleChange={handleChange} editorProfile={editorProfile} />
    <ProfileDetails />
  </Form>
);

const IconProps = "w-5 h-5 mr-2";

const ProfileHeader = () => (
  <div className="flex items-center justify-between">
    <h1 className="text-3xl">Edit Profile</h1>
    <div className="col-span-2 flex space-x-2">
      <Button type="submit">
        <DownloadIcon className={IconProps} />
        Save
      </Button>
      <DialogRadix.Close>
        <Button variant="secondary">Close</Button>
      </DialogRadix.Close>
    </div>
  </div>
);

const ProfilePicture = ({ handleChange, editorProfile }) => (
  <div className="col-span-2 flex items-center space-x-4">
    {editorProfile.profile_picture ? (
      <ExistingProfilePicture editorProfile={editorProfile} />
    ) : (
      <UploadProfilePicture handleChange={handleChange} />
    )}
  </div>
);

const ExistingProfilePicture = ({ editorProfile }) => {
  const { meModel } = useStores();

  return (
    <div className="flex flex-col items-center">
      <Image
        className="h-28 w-28 rounded-full border object-cover drop-shadow-lg"
        src={editorProfile.profile_picture}
        width={100}
        height={100}
        alt=""
      />
      <button
        onClick={() =>
          meModel.updateEditorProfile({ ["profile_picture"]: null })
        }
      >
        remove
      </button>
    </div>
  );
};

const UploadProfilePicture = ({ handleChange }) => (
  <Button
    type="button"
    onClick={() => document.getElementById("profile_picture").click()}
  >
    <UploadIcon className={IconProps} />
    <Input
      label="Upload picture"
      type="file"
      accept="image/*"
      id="profile_picture"
      name="profile_picture"
      onChange={handleChange}
    />
  </Button>
);

const ProfileDetails = () => (
  <>
    <div className="grid grid-cols-2 gap-4">
      <InputFieldComponent
        name="firstName"
        label="First name"
        placeholder="Max"
        type="text"
      />
      <InputFieldComponent
        name="lastName"
        label="Last name"
        placeholder="Mustermann"
        type="text"
      />
      <InputFieldComponent
        name="nationality"
        label="Nationality"
        placeholder="German"
        type="text"
      />
      <InputFieldComponent
        name="birthday"
        label="Birthday"
        placeholder="01.01.2000"
        type="date"
      />
      <InputFieldComponent
        name="university"
        label="University"
        placeholder="TUM"
        type="text"
      />
      <InputFieldComponent
        name="degree_level"
        label="Degree Level"
        placeholder="B.Sc."
        type="text"
      />
      <InputFieldComponent
        name="degree_name"
        label="Degree name"
        placeholder="Computer Science"
        type="text"
      />
      <InputFieldComponent
        name="degree_semester"
        label="Semester"
        placeholder="2"
        type="number"
      />
    </div>
    <InputFieldComponent
      name="description"
      label="Description"
      placeholder="I am a student at TUM."
      type="text"
    />
  </>
);

const InputFieldComponent = ({ name, label, placeholder, type }) => (
  <div>
    <Field
      as={Input}
      name={name}
      label={label}
      placeholder={placeholder}
      type={type}
      fullWidth
    />
    <ErrorMessage name={name} />
  </div>
);

export default ProfileEditor;
