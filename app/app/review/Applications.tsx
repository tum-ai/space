"use client";
import { Button } from "@components/Button";
import Icon from "@components/Icon";
import Select from "@components/Select";
import { observer } from "mobx-react";
import { Application as ApplicationRow } from "./Application";
import { useReviewTool } from "./useReviewTool";

export const Applications = observer(() => {
  const reviewToolModel = useReviewTool();
  return (
    <>
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div className="mt-2 font-light text-gray-500">
          {`Total ${reviewToolModel.filteredApplications.length} applications `}
          {`| ${reviewToolModel.filteredApplications
            .map((application) => application.reviews.length)
            .reduce((prev, current) => prev + current, 0)} reviews `}
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <div className="space-x-2">
              <span className="font-thin">filters: </span>
              {Object.keys(reviewToolModel.filters).length > 0 && (
                <button onClick={() => reviewToolModel.setFilters({})}>
                  reset
                </button>
              )}
            </div>
            <Select
              placeholder={"Form"}
              options={[
                { key: "all", value: null },
                ...(reviewToolModel.getFormNames()?.map((formName) => ({
                  key: formName,
                  value: formName,
                })) || []),
              ]}
              value={reviewToolModel.filters?.formName.name}
              setSelectedItem={(item) => {
                reviewToolModel.setFilters((old) => ({
                  ...old,
                  formName: {
                    name: item,
                    predicate: (application) =>
                      application.submission.data.formName === item,
                  },
                }));
              }}
            />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(
                  reviewToolModel.filteredApplications
                    .map((application) => `${application.id}`)
                    .join("\n"),
                );
              }}
            >
              Copy IDs
            </Button>
          </div>
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
              <button onClick={() => reviewToolModel.setSearch("")}>
                clear
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 overflow-auto pt-4">
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
              <ApplicationRow key={application.id} application={application} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
});