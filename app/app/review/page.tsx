"use client";
import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import Dialog from "@components/Dialog";
import Icon from "@components/Icon";
import Input from "@components/Input";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import Tabs from "@components/Tabs";
import Tooltip from "@components/Tooltip";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";

const ReviewTool = observer(() => {
  const { reviewToolModel } = useStores();

  return (
    <ProtectedItem showNotFound roles={["submit_reviews"]}>
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
    <div className="flex flex-col space-y-4 pt-4">
      <div className="m-auto flex w-full space-x-4 rounded bg-white p-2 dark:bg-gray-700 lg:mr-0 lg:w-[400px]">
        <Icon name={"FaSearch"} className="rounded p-2" />
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
      <div className="grid grid-cols-3 px-6 md:grid-cols-5">
        <div>ID</div>
        <div>Form Name</div>
        <div>Reviewed By</div>
        <div>Avg. Final Score</div>
      </div>
      {reviewToolModel.filteredApplications?.map((application) => (
        <Application key={application.id} data={application} />
      ))}
    </div>
  );
});

function Application({ data }) {
  const { reviewToolModel, uiModel } = useStores();
  const finalScoreSum = data.reviews?.reduce((finalscore, review) => {
    return finalscore + review.finalscore;
  }, 0);
  return (
    <div className="grid grid-cols-3 items-center rounded bg-white p-6 shadow dark:bg-gray-700 md:grid-cols-5">
      <div>{data.id}</div>
      <div>{data.submission?.data?.formName}</div>
      <div className="flex">
        {data.reviews?.map((review, i) => {
          const profile = review.reviewer;
          return (
                <Dialog
                  key={i} 
                  trigger={
                    <span>
                    <Tooltip
                      trigger={
                          <div className="cursor-pointer" onClick={() => {
                          reviewToolModel.setViewReview(review);
                          reviewToolModel.setViewApplication(data);
                        }}>
                          <Avatar variant={Avatar.variant.Circle} src={profile.profile_picture} initials={("" + profile.first_name[0] + profile.last_name[0]).toUpperCase()} />
                        </div>
                      }>
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
                >
                  <ViewReview />
                </Dialog>
            
          );
        })}
      </div>
      <div>{Math.round(finalScoreSum / data.reviews?.length) || "-"}</div>
      <div className="flex w-full justify-end">
        <button
          className="flex items-center space-x-2"
          onClick={() => {
            reviewToolModel.reviewApplication(data.id);
          }}
        >
          <p>review</p>
          <Icon name="FaExternalLinkAlt" />
        </button>
      </div>
    </div>
  );
}

const ViewReview = observer(() => {
  const { reviewToolModel } = useStores();
  const applicationToView = reviewToolModel.viewApplication;
  const viewReview = reviewToolModel.viewReview;

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2">
      <ReviewOverview review={viewReview} />
      <ApplicationOverview data={applicationToView} />
    </div>
  );
});

function Review() {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-2">
      <ReviewForm />
      <ApplicationToReview />
    </div>
  );
}

function ApplicationOverview({ data }) {
  return (
    <div className="space-y-4 overflow-scroll">
      <div className="col-span-2 text-2xl">Application</div>
      <hr className="border-2" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <span className="font-thin">ID: </span>
          {data.id}
        </div>
        <div>
          <span className="font-thin">From: </span>
          {data.submission?.data?.formName}
        </div>
        <div>
          <span className="font-thin">Created at: </span>
          {data.submission?.data?.createdAt &&
            new Date(data.submission?.data?.createdAt).toDateString()}
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {data.submission?.data?.fields?.map((field) => {
          return (
            <div key={field.label}>
              <div className="font-thin">{field.label}</div>
              <div>{JSON.stringify(field.value)}</div>
            </div>
          );
        })}
      </div>
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

function ReviewOverview({ review }) {
  return (
    <div className="grid grid-cols-2 gap-4 overflow-scroll">
      <div className="col-span-2 text-2xl">
        <span>Reviewer: </span>
        {review.reviewer?.first_name + " " + review.reviewer?.last_name}
      </div>
      <hr className="border-2 col-span-2" />
      {Object.entries(review)
        .filter(([_, value]) => {
          return typeof value == "string" || typeof value == "number";
        })
        .map(([key, value]: any, i) => {
          return (
            <div key={key}>
              <div className="font-thin">{key}</div>
              <div>{value}</div>
            </div>
          );
        })}
    </div>
  );
}

const ReviewForm = observer(() => {
  const { reviewToolModel } = useStores();
  const editorReview = reviewToolModel.editorReview;

  function handleChange(e) {
    reviewToolModel.updateEditorReview({
      [e.target.name]: e.target.value,
    });
  }

  return (
    <form
      className="sticky top-24 grid gap-4 lg:grid-cols-2"
      onSubmit={async (e) => {
        e.preventDefault();
        await reviewToolModel.submitReview();
      }}
    >
      <Input
        label="Motivation"
        type="number"
        id="motivation"
        name="motivation"
        value={editorReview?.motivation}
        onChange={handleChange}
        required={true}
      />
      <Input
        label="Skill"
        type="number"
        id="skill"
        name="skill"
        value={editorReview?.skill}
        onChange={handleChange}
        required={true}
      />
      <Input
        label="Overall fit"
        type="number"
        id="fit"
        name="fit"
        value={editorReview?.fit}
        onChange={handleChange}
        required={true}
      />
      <Input
        label="Fit in Tum.ai"
        type="number"
        id="in_tumai"
        name="in_tumai"
        value={editorReview?.in_tumai}
        onChange={handleChange}
        required={true}
      />
      <Input
        label="Tum.ai fit comment"
        type="text"
        id="comment_fit_tumai"
        name="comment_fit_tumai"
        value={editorReview?.comment_fit_tumai}
        onChange={handleChange}
        required={false}
      />
      <Input
        label="Time commitment"
        type="text"
        id="timecommit"
        name="timecommit"
        value={editorReview?.timecommit}
        onChange={handleChange}
        required={false}
      />
      <Input
        label="Department 1 score"
        type="number"
        id="dept1_score"
        name="dept1_score"
        value={editorReview?.dept1_score}
        onChange={handleChange}
        required={true}
      />
      <Input
        label="Department 2 score"
        type="number"
        id="dept2_score"
        name="dept2_score"
        value={editorReview?.dept2_score}
        onChange={handleChange}
        required={true}
      />
      <Input
        label="Department 3 score"
        type="number"
        id="dept3_score"
        name="dept3_score"
        value={editorReview?.dept3_score}
        onChange={handleChange}
        required={true}
      />
      <Input
        label="Good fit?"
        type="text"
        id="maybegoodfit"
        name="maybegoodfit"
        value={editorReview?.maybegoodfit}
        onChange={handleChange}
        required={false}
      />
      <Input
        label="Further comments"
        type="text"
        id="furthercomments"
        name="furthercomments"
        value={editorReview?.furthercomments}
        onChange={handleChange}
        required={false}
      />
      <Button className="row-start-1 col-span-2"
        type="submit"
      >
        Submit review
      </Button>
      <button
        type="button"
        onClick={() => {
          reviewToolModel.updateEditorReview({
            motivation: 4,
            skill: 7,
            fit: 6,
            in_tumai: 2,
            comment_fit_tumai: "The fit seems good",
            timecommit: "10 hours per week",
            dept1_score: 8,
            dept2_score: 5,
            dept3_score: 7,
            maybegoodfit: "Yes, potentially",
            furthercomments: "Should keep an eye on progress",
          });
        }}
      >
        test
      </button>
    </form>
  );
});

export default ReviewTool;
