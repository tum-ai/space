"use client";
import { Button } from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Textarea from "@/components/Textarea";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import * as Yup from "yup";
import { FormProps } from "./ReviewForm";
import axios from "axios";
import toast from "react-hot-toast";

export const VentureReviewForm = ({ application }: FormProps) => {
  const initialValues = {
    relevance_ai: null,
    skills: null,
    profile_category: null,
    motivation: null,
    vision: null,
    personality: null,
    like_to_see: null,
    doubts: "",
    furthercomments: "",
  };

  const schema = Yup.object().shape({
    relevance_ai: Yup.number().min(1).max(10).required(),
    skills: Yup.number().min(1).max(10).required(),
    profile_category: Yup.string().required(),
    motivation: Yup.number().min(1).max(10).required(),
    vision: Yup.number().min(1).max(10).required(),
    personality: Yup.number().min(1).max(10).required(),
    like_to_see: Yup.string().required(),
    doubts: Yup.string(),
    furthercomments: Yup.string(),
  });

  const profileCategories = {
    "The Technologist": "TECHNOLOGIST",
    "The Business Mind": "BUSINESSMIND",
    "The Domain Expert": "DOMAINEXPERT",
    "The Creative Thinker": "CREATIVETHINKER",
  };

  const likeToSee = {
    Yes: "YES",
    Maybe: "MAYBE",
    No: "NO",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values: FormikValues) =>
        toast.promise(
          axios.post("/review_tool/application_review", {
            data: {
              form: values,
              review_type: "VENTURE",
              reviewee_id: application?.id,
            },
          }),
          {
            loading: "Submitting review",
            success: "Successfully submitted review",
            error: "Failed to submit review",
          },
        )
      }
    >
      {({ values, setFieldValue }) => (
        <Form className="z-0 grid h-fit gap-4 rounded-lg bg-gray-200 p-8 dark:bg-gray-600 md:grid-cols-2">
          <h2 className="text-2xl lg:col-span-2">Submit Review</h2>
          <div>
            <Field
              as={Input}
              label="Relevance to AI or tech-related fields"
              type="number"
              name="relevance_ai"
              fullWidth
            />
            <ErrorMessage
              component="p"
              className="text-red-500"
              name="relevance_ai"
            />
          </div>
          <div>
            <Field
              as={Input}
              label="Skills & notable experiences"
              type="number"
              name="skills"
              fullWidth
            />
            <ErrorMessage
              component="p"
              className="text-red-500"
              name="skills"
            />
          </div>
          <div>
            <Field
              label={"Profile category"}
              name={`profile_category`}
              as={Select}
              placeholder={"Profile category"}
              options={Object.entries(profileCategories).map(
                ([key, value]) => ({
                  key: key,
                  value: value,
                }),
              )}
              selectedItem={{
                key: profileCategories[values["profile_category"]],
                value: values["profile_category"],
              }}
              setSelectedItem={(value) => {
                setFieldValue(`profile_category`, value);
              }}
            />
            <ErrorMessage
              component="p"
              className="text-red-500"
              name={`profile_category`}
            />
          </div>
          <div>
            <Field
              as={Input}
              label="Motivation"
              type="number"
              name="motivation"
              fullWidth
            />
            <ErrorMessage
              component="p"
              className="text-red-500"
              name="motivation"
            />
          </div>
          <div>
            <Field
              as={Input}
              label="Vision & Entrepreneurial Spirit"
              type="number"
              name="vision"
              fullWidth
            />
            <ErrorMessage
              component="p"
              className="text-red-500"
              name="vision"
            />
          </div>
          <div>
            <Field
              as={Input}
              label="Personality"
              type="number"
              name="personality"
              fullWidth
            />
            <ErrorMessage
              component="p"
              className="text-red-500"
              name="personality"
            />
          </div>
          <div>
            <Field
              label={"Would you like to see this person at AI E-Lab?"}
              name={`like_to_see`}
              as={Select}
              placeholder={"select"}
              options={Object.entries(likeToSee).map(([key, value]) => ({
                key: key,
                value: value,
              }))}
              selectedItem={{
                key: likeToSee[values["like_to_see"]],
                value: values["like_to_see"],
              }}
              setSelectedItem={(value) => {
                setFieldValue(`like_to_see`, value);
              }}
            />
            <ErrorMessage
              component="p"
              className="text-red-500"
              name={`like_to_see`}
            />
          </div>
          <div className="col-start-1 md:col-span-2">
            <Field
              as={Textarea}
              label="Do you have any doubts about this person’s commitment to AI E-Lab?"
              type="number"
              name="doubts"
            />
            <ErrorMessage
              component="p"
              className="text-red-500"
              name="doubts"
            />
          </div>
          <div className="col-start-1 md:col-span-2">
            <Field
              as={Textarea}
              label="Comments for interviewing"
              type="number"
              name="furthercomments"
            />
            <ErrorMessage
              component="p"
              className="text-red-500"
              name="furthercomments"
            />
          </div>

          <Button className="lg:col-span-2" type="submit">
            Submit review
          </Button>
        </Form>
      )}
    </Formik>
  );
};
