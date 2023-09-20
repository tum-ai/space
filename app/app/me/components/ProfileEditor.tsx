"use client";
import { Button } from "@components/Button";
import Dialog from "@components/Dialog";
import Input from "@components/Input";
import Select from "@components/Select";
import { useStores } from "@providers/StoreProvider";
import { useQueryClient } from "@tanstack/react-query";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikValues,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import * as DialogRadix from "@radix-ui/react-dialog";
import Image from "next/image";

const newJobExperience = {
  employer: "",
  position: "",
  date_from: "",
  date_to: "",
};

const socialNetworksTypes = [
  { key: "Slack", value: "Slack" },
  { key: "LinkedIn", value: "LinkedIn" },
  { key: "GitHub", value: "GitHub" },
  { key: "Phone", value: "Phone" },
  { key: "Instagram", value: "Instagram" },
  { key: "Telegram", value: "Telegram" },
  { key: "Discord", value: "Discord" },
  { key: "Other", value: "Other" },
];

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
  job_history: {
    employer?: string | null;
    position?: string | null;
    date_from?: Date | string | null;
    date_to?: Date | string | null;
  }[];
  social_networks: {
    type?: string | null;
    link?: string | null;
  }[];
};

function ProfileEditor({ trigger }) {
  const { meModel } = useStores();
  const editorProfile = meModel.editorProfile;

  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

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
        employer: Yup.string().nullable(),
        position: Yup.string().nullable(),
        date_from: Yup.date().nullable(),
        date_to: Yup.date()
          .min(Yup.ref("date_from"), "End date must be after the start date.")
          .nullable(),
      }),
    ),
    social_networks: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().nullable(),
        link: Yup.string().url("Invalid URL format").nullable(),
      }),
    ),
  });

  const queryClient = useQueryClient();

  return (
    <Dialog trigger={trigger || <Button>edit</Button>}>
      <Formik
        initialValues={editorProfile}
        validationSchema={validationSchema}
        onSubmit={async (values: FormikValues) => {
          console.log(values);
          if (values.profile_picture) {
            values.profile_picture = await convertImageToBase64(
              values.profile_picture,
            );
          }
          meModel.updateEditorProfile(values);
          console.log("await meModel.editProfile()");
          await meModel.editProfile();
          console.log(
            'await queryClient.invalidateQueries({ queryKey: ["me"] })',
          );
          await queryClient.invalidateQueries({ queryKey: ["me"] });
        }}
      >
        {({ handleChange }) => (
          <Form className="flex w-full flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl">Edit Profile</h1>
              <div className="col-span-2 flex space-x-2">
                <Button type="submit">Save</Button>
                <DialogRadix.Close>
                  <Button variant="secondary">Close</Button>
                </DialogRadix.Close>
              </div>
            </div>
            <div className="col-span-2 flex items-center space-x-4">
              {editorProfile.profile_picture ? (
                <div className="flex flex-col items-center">
                  <Image
                    className="h-28 w-28 rounded-full border object-cover drop-shadow-lg"
                    src={editorProfile.profile_picture}
                    width={100}
                    height={100}
                    alt=""
                  />
                  <button
                    onClick={() => {
                      meModel.updateEditorProfile({
                        ["profile_picture"]: null,
                      });
                    }}
                  >
                    remove
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    document.getElementById("profile_picture").click();
                  }}
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
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Field
                  as={Input}
                  name="first_name"
                  label="First name"
                  placeholder="Max"
                  type="text"
                  fullWidth
                />
                <ErrorMessage name="FIRST NAME" />
              </div>
              <div>
                <Field
                  as={Input}
                  name="last_name"
                  label="Last name"
                  placeholder="Mustermann"
                  type="text"
                  fullWidth
                />
                <ErrorMessage name="LAST NAME" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Nationality"
                  name="nationality"
                  placeholder="German"
                  type="text"
                  fullWidth
                />
                <ErrorMessage name="NATIONALITY" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="University"
                  name="university"
                  placeholder="TUM"
                  type="text"
                  fullWidth
                />
                <ErrorMessage name="UNIVERSITY" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Degree Level"
                  name="degree_level"
                  placeholder="B.Sc."
                  type="text"
                  fullWidth
                />
                <ErrorMessage name="DEGREE LEVEL" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Degree name"
                  name="degree_name"
                  placeholder="Computer Science"
                  type="text"
                  fullWidth
                />
                <ErrorMessage name="DEGREE NAME" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Semester"
                  name="degree_semester"
                  placeholder="2"
                  type="number"
                  fullWidth
                />
                <ErrorMessage name="SEMESTER" />
              </div>
              <div>
                <Field
                  as={Input}
                  label="Current job"
                  name="currentJob"
                  placeholder="Software Engineer"
                  type="text"
                  fullWidth
                />
                <ErrorMessage name="CURRENT JOB" />
              </div>
            </div>
            <div>
              <Field
                as={Input}
                label="Description"
                name="description"
                placeholder="I am a student at TUM and I am interested in..."
                type="text"
                fullWidth
              />
              <ErrorMessage name="DESCRIPTION" />
            </div>
            {/* Job Experience Editor */}
            <JobExperience />
            {/* Social Networks Editor */}
            <SocialNetworks />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}

function SocialNetworks() {
  const { values } = useFormikContext<ProfileFormData>();

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
                  options={socialNetworksTypes}
                  disabled={false}
                />
                <Field
                  as={Input}
                  label="Link"
                  type="text"
                  name={`social_networks[${index}].link`}
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
                <Field
                  as={Input}
                  label="Employer"
                  type="text"
                  name={`job_history[${index}].employer`}
                />
                <Field
                  as={Input}
                  label="Position"
                  type="text"
                  name={`job_history[${index}].position`}
                />
                <Field
                  as={Input}
                  label="Start date"
                  type="date"
                  name={`job_history[${index}].date_from`}
                />
                <Field
                  as={Input}
                  label="End date"
                  type="date"
                  name={`job_history[${index}].date_to`}
                />
                <Button
                  className="mt-2"
                  onClick={() => arrayHelpers.remove(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={() => arrayHelpers.push(newJobExperience)}>
              Add Work Experience
            </Button>
          </div>
        </div>
      )}
    />
  );
}

export default ProfileEditor;
