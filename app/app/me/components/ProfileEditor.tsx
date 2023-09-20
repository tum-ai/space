"use client";
import { Button } from "@components/Button";
import ErrorMessage from "@components/ErrorMessage";
import Dialog from "@components/Dialog";
import Input from "@components/Input";
import Select from "@components/Select";
import { useStores } from "@providers/StoreProvider";
import { useQueryClient } from "@tanstack/react-query";
import { Field, FieldArray, Form, Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import * as DialogRadix from "@radix-ui/react-dialog";
import Image from "next/image";

const NEW_JOB_EXPERIENCE = {
  employer: "",
  position: "",
  date_from: "",
  date_to: "",
};

const SOCIAL_NETWORKS_TYPES = [
  "Slack",
  "LinkedIn",
  "GitHub",
  "Phone",
  "Instagram",
  "Telegram",
  "Discord",
  "Other",
].map((type) => ({ key: type, value: type }));

type JobHistoryType = {
  employer?: string | null;
  position?: string | null;
  date_from?: Date | string | null;
  date_to?: Date | string | null;
};

type SocialNetworkType = {
  type?: string | null;
  link?: string | null;
};

type ProfileFormData = {
  profile_picture?: string | null;
  first_name: string;
  last_name: string;
  nationality?: string | null;
  university?: string | null;
  degree_level?: string | null;
  degree_name?: string | null;
  degree_semester?: number | null;
  currentJob?: string | null;
  description?: string | null;
  job_history: JobHistoryType[];
  social_networks: SocialNetworkType[];
};

const validationSchema = Yup.object().shape({
  profile_picture: Yup.mixed()
    .test("fileSize", "File is too big! Max size is 200 KB.", (value) => {
      if (value instanceof FileList) {
        return value[0]?.size <= 0.2 * 1048576;
      }
      return true; // not a file input
    })
    .nullable(),
  first_name: Yup.string().required("First name is required."),
  last_name: Yup.string().required("Last name is required."),
  nationality: Yup.string().nullable(),
  university: Yup.string().nullable(),
  degree_level: Yup.string().nullable(),
  degree_name: Yup.string().nullable(),
  degree_semester: Yup.number()
    .min(1, "Semester must be at least 1.")
    .integer("Semester must be an integer.")
    .nullable(),
  currentJob: Yup.string().nullable(),
  description: Yup.string().nullable(),
  job_history: Yup.array().of(
    Yup.object().shape({
      employer: Yup.string().required("Employer is required."),
      position: Yup.string().required("Position is required."),
      date_from: Yup.date().required("Start date is required."),
      date_to: Yup.date()
        .min(Yup.ref("date_from"), "End date must be after the start date.")
        .required("End date is required."),
    }),
  ),
  social_networks: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().nullable(),
      link: Yup.string()
        .url("Invalid URL format")
        .required("Link is required."),
    }),
  ),
});

function ProfileEditor({ trigger }) {
  const { meModel } = useStores();
  const editorProfile = meModel.editorProfile;
  const queryClient = useQueryClient();

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Dialog trigger={trigger || <Button>edit</Button>}>
      <Formik
        initialValues={editorProfile}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          if (values.profile_picture) {
            values.profile_picture = await convertImageToBase64(
              values.profile_picture,
            );
          }
          await meModel.updateEditorProfile(values);
          await meModel.editProfile();
          await queryClient.invalidateQueries({ queryKey: ["me"] });
        }}
      >
        {({ handleChange }) => (
          <ProfileForm
            handleChange={handleChange}
            editorProfile={editorProfile}
          />
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
    <JobExperience />
    <SocialNetworks />
  </Form>
);

const ProfileHeader = () => (
  <div className="flex items-center justify-between">
    <h1 className="text-3xl">Edit Profile</h1>
    <div className="col-span-2 flex space-x-2">
      <Button type="submit">Save</Button>
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
  <div className="grid grid-cols-2 gap-4">
    <FieldComponent
      name="first_name"
      label="First name"
      placeholder="Max"
      type="text"
    />
    <FieldComponent
      name="last_name"
      label="Last name"
      placeholder="Mustermann"
      type="text"
    />
    <FieldComponent
      name="nationality"
      label="Nationality"
      placeholder="German"
      type="text"
    />
    <FieldComponent
      name="university"
      label="University"
      placeholder="TUM"
      type="text"
    />
    <FieldComponent
      name="degree_level"
      label="Degree Level"
      placeholder="B.Sc."
      type="text"
    />
    <FieldComponent
      name="degree_name"
      label="Degree name"
      placeholder="Computer Science"
      type="text"
    />
    <FieldComponent
      name="degree_semester"
      label="Semester"
      placeholder="2"
      type="number"
    />
    <FieldComponent
      name="currentJob"
      label="Current job"
      placeholder="Software Engineer"
      type="text"
    />
  </div>
);

const FieldComponent = ({ name, label, placeholder, type }) => (
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

function SocialNetworks() {
  const { values, setFieldValue } = useFormikContext<ProfileFormData>();

  return (
    <FieldArray name="social_networks">
      {(arrayHelpers) => (
        <div>
          <h2 className="text-xl font-light">Social Networks</h2>
          <p className="font-light">Add relevant social media networks here.</p>
          <div className="col-span-2 mt-3 w-full space-y-4">
            {values.social_networks.map((network, index) => (
              <div
                key={index}
                className="space-y-3 rounded-2xl border-2 border-gray-100 p-4"
              >
                <Field
                  as={Select}
                  name={`social_networks[${index}].type`}
                  selectedItem={{ key: network.type, value: network.type }}
                  placeholder="Select a type"
                  options={SOCIAL_NETWORKS_TYPES}
                  disabled={false}
                  setSelectedItem={(itemValue: string) => {
                    setFieldValue(`social_networks[${index}].type`, itemValue);
                  }}
                />
                <FieldComponent
                  name={`social_networks[${index}].link`}
                  label="Link"
                  placeholder="https://www.linkedin.com/in/maxmustermann/"
                  type="text"
                />
                <Button onClick={() => arrayHelpers.remove(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button
              onClick={() =>
                arrayHelpers.push({
                  handle: "tum_ai",
                  type: "github",
                  link: "",
                })
              }
            >
              Add Social Network
            </Button>
          </div>
        </div>
      )}
    </FieldArray>
  );
}

function JobExperience() {
  const { values, setFieldValue } = useFormikContext<ProfileFormData>();

  return (
    <FieldArray
      name="job_history"
      render={(arrayHelpers) => (
        <div>
          <h2 className="text-xl font-light">Job History</h2>
          <p className="font-light">Update your job history here.</p>
          <div className="mt-3 space-y-4">
            {values.job_history.map((job, index) => (
              <div
                key={index}
                className="grid-cols-2 gap-3 rounded-2xl border-2 border-white p-4 sm:grid xl:grid-cols-4"
              >
                <FieldComponent
                  name={`job_history[${index}].employer`}
                  label="Employer"
                  placeholder="TUM"
                  type="text"
                />
                <FieldComponent
                  name={`job_history[${index}].position`}
                  label="Position"
                  placeholder="Software Engineer"
                  type="text"
                />
                <FieldComponent
                  name={`job_history[${index}].date_from`}
                  label="Start date"
                  placeholder="2020-01-01"
                  type="date"
                />
                <FieldComponent
                  name={`job_history[${index}].date_to`}
                  label="End date"
                  placeholder="2020-01-01"
                  type="date"
                />
                <Button
                  className="mt-2"
                  onClick={() => arrayHelpers.remove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={() => arrayHelpers.push(NEW_JOB_EXPERIENCE)}>
              Add Work Experience
            </Button>
          </div>
        </div>
      )}
    />
  );
}

export default ProfileEditor;
