"use client";
import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import Icon from "@components/Icon";
import Input from "@components/Input";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import Select from "@components/Select";
import Tabs from "@components/Tabs";
import Textarea from "@components/Textarea";
import Tooltip from "@components/Tooltip";
import { useStores } from "@providers/StoreProvider";
import { ErrorMessage, Field, Form, Formik, FormikValues } from "formik";
import { observer } from "mobx-react";
import Link from "next/link";
import { useState } from "react";
import * as Yup from "yup";
import { ViewReview } from "./_components/viewReview";
import { ApplicationOverview } from "./_components/applicationOverview";

const ReviewTool = observer(() => {
  const { reviewToolModel } = useStores();

  return (
    <ProtectedItem showNotFound roles={["submit_reviews"]}>
      <Section className="flex items-center justify-between">
        <h1 className="text-6xl font-thin">Review Tool</h1>
        <Link href={"/review/myreviews"}>
          <Button>My reviews</Button>
        </Link>
      </Section>
      <Section>
        <Tabs
          tabs={{
            Applications: <Applications />,
            Review: <Review />,
          }}
          value={reviewToolModel.openTab}
          onValueChange={(tab) => {
            reviewToolModel.setOpenTab(tab);
          }}
        />
      </Section>
    </ProtectedItem>
  );
});

const Applications = observer(() => {
  const { reviewToolModel } = useStores();
  return (
    <div className="flex flex-col space-y-4 overflow-auto pt-4">
      <div className="flex items-center justify-end">
        <div className="flex w-full space-x-4 rounded-lg bg-gray-200 p-2 dark:bg-gray-700 md:w-fit">
          <Icon name={"FaSearch"} className="rounded-lg p-2" />
          <input
            value={reviewToolModel.search}
            onChange={(e) => {
              reviewToolModel.setSearch(e.target.value);
            }}
            placeholder="search.."
            className="w-full bg-transparent outline-none"
          />
          {reviewToolModel.search && (
            <button
              onClick={(e) => {
                reviewToolModel.setSearch("");
              }}
            >
              clear
            </button>
          )}
        </div>
      </div>
      <table className="mx-auto w-full min-w-[800px] table-auto text-center">
        <thead>
          <tr className="border-b border-b-gray-400 dark:border-b-white">
            <th className="p-4">ID</th>
            <th className="p-4">Form Name</th>
            <th className="p-4">Reviewers</th>
            <th className="p-4">Avg. Final Score</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviewToolModel.filteredApplications?.map((application) => (
            <Application key={application.id} application={application} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

function Application({ application }) {
  const { reviewToolModel } = useStores();
  const finalScoreSum = application.reviews?.reduce((finalscore, review) => {
    return finalscore + review.finalscore;
  }, 0);
  return (
    <tr className="border-b dark:border-gray-500 " key={application.id}>
      <td>{application.id}</td>
      <td>{application.submission?.data?.formName}</td>
      <td className="flex items-center justify-center p-4">
        {application.reviews?.map((review, i) => {
          const profile = review.reviewer;
          return (
            <ViewReview
              applicationToView={application}
              viewReview={review}
              key={i}
              trigger={
                <span>
                  <Tooltip
                    trigger={
                      <div className="cursor-pointer">
                        <Avatar
                          variant={"circle"}
                          src={profile.profile_picture}
                          initials={(
                            "" +
                            profile.first_name[0] +
                            profile.last_name[0]
                          ).toUpperCase()}
                        />
                      </div>
                    }
                  >
                    <div>
                      {profile.first_name +
                        " " +
                        profile.last_name +
                        " - final score: " +
                        review.finalscore}
                    </div>
                  </Tooltip>
                </span>
              }
            />
          );
        })}
      </td>
      <td>
        {Math.round((finalScoreSum * 100) / application.reviews?.length) /
          100 || "-"}
      </td>
      <td className="space-x-2 p-4">
        <Button
          className="flex items-center space-x-2"
          onClick={() => {
            reviewToolModel.reviewApplication(application.id);
          }}
        >
          review
        </Button>
      </td>
    </tr>
  );
}

function Review() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ReviewForm />
      <ApplicationToReview />
    </div>
  );
}

const ApplicationToReview = observer(() => {
  const { reviewToolModel } = useStores();
  const applicationOnReview = reviewToolModel.applicationOnReview;

  if (!applicationOnReview) {
    return <p>No application selected</p>;
  }

  return <ApplicationOverview data={applicationOnReview} />;
});

class ReviewForms {
  MEMBERSHIP: {
    displayName: string;
    form: {
      motivation: number;
      skill: number;
      fit: number;
      in_tumai: number;
      comment_fit_tumai: string;
      timecommit: string;
      dept1_score: string;
      dept2_score: string;
      dept3_score: string;
      maybegoodfit: string;
      furthercomments: string;
    };
  };
  VENTURE: {
    displayName: "Venture";
    form: {
      motivation: number;
      business_skills: number;
    };
  };
}

function ReviewForm() {
  const [formType, setFormType] = useState("MEMBERSHIP");

  let reviewFormComponent = <p>No form type selected.</p>;
  if (formType == "MEMBERSHIP") {
    reviewFormComponent = <MembershipReviewForm />;
  }
  if (formType == "VENTURE") {
    reviewFormComponent = <VentureReviewForm />;
  }

  return (
    <div className="flex flex-col gap-2">
      <Select
        label="Choose review type"
        placeholder="From Type"
        data={[
          {
            key: "Membership review",
            value: "MEMBERSHIP",
          },
          {
            key: "Venture review",
            value: "VENTURE",
          },
        ]}
        value={formType}
        setSelectedItem={(item) => {
          setFormType(item);
        }}
      />
      {reviewFormComponent}
    </div>
  );
}

const VentureReviewForm = observer(() => {
  const { reviewToolModel } = useStores();

  const initialValues = {
    relevance_ai: null,
    skills: null,
    profile_category: null,
    motivation: null,
    vision: null,
    personality: null,
    like_to_see: null,
    doubts: null,
    furthercomments: null,
  };

  const schema = Yup.object().shape({
    relevance_ai: Yup.number().required(),
    skills: Yup.number().required(),
    profile_category: Yup.string().required(),
    motivation: Yup.number().required(),
    vision: Yup.number().required(),
    personality: Yup.number().required(),
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
      onSubmit={(values: FormikValues) => {
        reviewToolModel.submitReview(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="top-0 z-0 grid h-fit gap-4 rounded-lg bg-gray-200 p-8 dark:bg-gray-600 md:sticky md:grid-cols-2">
          <h2 className="text-2xl lg:col-span-2">Submit Review</h2>
          <div>
            <Field
              as={Input}
              label="Relevance to AI or tech-related fields"
              type="number"
              name="relevance_ai"
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
            />
            <ErrorMessage
              component="p"
              className="text-red-500"
              name="skills"
            />
          </div>
          <div className="flex flex-col">
            <Field
              label={"Profile category"}
              name={`profile_category`}
              as={Select}
              placeholder={"Profile category"}
              data={Object.entries(profileCategories).map(([key, value]) => ({
                key: key,
                value: value,
              }))}
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
            />
            <ErrorMessage
              component="p"
              className="text-red-500"
              name="personality"
            />
          </div>
          <div className="flex flex-col">
            <Field
              label={"Would you like to see this person at AI E-Lab?"}
              name={`like_to_see`}
              as={Select}
              placeholder={"select"}
              data={Object.entries(likeToSee).map(([key, value]) => ({
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
});

const MembershipReviewForm = observer(() => {
  const { reviewToolModel } = useStores();

  const initialValues = {
    motivation: null,
  };

  const schema = Yup.object().shape({
    motivation: Yup.number().required(),
    skill: Yup.number().required(),
    fit: Yup.number().required(),
    in_tumai: Yup.number().required("fit in tumai is required"),
    comment_fit_tumai: Yup.string(),
    timecommit: Yup.string().required(),
    dept1_score: Yup.number().required("Add a score for department 1"),
    dept2_score: Yup.number().required("Add a score for department 2"),
    dept3_score: Yup.number().required("Add a score for department 3"),
    maybegoodfit: Yup.string().required(
      "Comment on whether the applicant might be a good fit",
    ),
    furthercomments: Yup.string(),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values: FormikValues) => {
        reviewToolModel.submitReview(values);
      }}
    >
      <Form className="top-0 grid h-fit gap-4 rounded-lg bg-gray-200 p-8 dark:bg-gray-600 md:sticky md:grid-cols-2">
        <h2 className="text-2xl lg:col-span-2">Submit Review</h2>
        <div>
          <Field
            as={Input}
            label="Motivation"
            type="number"
            name="motivation"
          />
          <ErrorMessage
            component="p"
            className="text-red-500"
            name="motivation"
          />
        </div>

        <div>
          <Field as={Input} label="Skill" type="number" name="skill" />
          <ErrorMessage component="p" className="text-red-500" name="skill" />
        </div>

        <div>
          <Field as={Input} label="Overall fit" type="number" name="fit" />
          <ErrorMessage component="p" className="text-red-500" name="fit" />
        </div>

        <div>
          <Field
            as={Input}
            label="Fit in Tum.ai"
            type="number"
            name="in_tumai"
          />
          <ErrorMessage
            component="p"
            className="text-red-500"
            name="in_tumai"
          />
        </div>

        <div className="md:col-span-2">
          <Field
            as={Input}
            label="Tum.ai fit comment"
            type="text"
            name="comment_fit_tumai"
          />
          <ErrorMessage
            component="p"
            className="text-red-500"
            name="comment_fit_tumai"
          />
        </div>

        <div>
          <Field
            as={Input}
            label="Time commitment"
            type="text"
            name="timecommit"
          />
          <ErrorMessage
            component="p"
            className="text-red-500"
            name="timecommit"
          />
        </div>

        <div>
          <Field
            as={Input}
            label="Department 1 score"
            type="number"
            name="dept1_score"
          />
          <ErrorMessage
            component="p"
            className="text-red-500"
            name="dept1_score"
          />
        </div>

        <div>
          <Field
            as={Input}
            label="Department 2 score"
            type="number"
            name="dept2_score"
          />
          <ErrorMessage
            component="p"
            className="text-red-500"
            name="dept2_score"
          />
        </div>

        <div>
          <Field
            as={Input}
            label="Department 3 score"
            type="number"
            name="dept3_score"
          />
          <ErrorMessage
            component="p"
            className="text-red-500"
            name="dept3_score"
          />
        </div>

        <div className="md:col-span-2">
          <Field as={Input} label="Good fit?" type="text" name="maybegoodfit" />
          <ErrorMessage
            component="p"
            className="text-red-500"
            name="maybegoodfit"
          />
        </div>

        <div className="md:col-span-2">
          <Field
            as={Input}
            label="Further comments"
            type="text"
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
    </Formik>
  );
});

export default ReviewTool;
