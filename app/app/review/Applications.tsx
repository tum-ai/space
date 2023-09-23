"use client";
import { Button } from "@components/Button";
import Icon from "@components/Icon";
import Select from "@components/Select";
import { ApplicationRow } from "./ApplicationRow";
import { useReviewTool } from "./useReviewTool";
import LoadingWheel from "@components/LoadingWheel";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CopyIcon,
  DownloadIcon,
} from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import axios from "axios";
import download from "downloadjs";

export const Applications = () => {
  const {
    applications,
    filters,
    setFilters,
    search,
    setSearch,
    handleSearch,
    isLoading,
    error,
    formNames,
    page,
    increasePage,
    decreasePage,
  } = useReviewTool(50);

  if (isLoading) {
    return <LoadingWheel />;
  }

  if (error) {
    return (
      <div>
        <h1>Failed to load applications</h1>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div className="mt-2 font-light text-gray-500">
          {`Total ${applications?.length} applications `}
          {`| ${applications
            ?.map((application) => application.reviews?.length)
            .reduce((prev, current) => prev + current, 0)} reviews `}
        </div>
        <div className="flex flex-col items-end gap-2 lg:flex-row">
          <div className="flex max-w-full items-center gap-2 overflow-x-auto">
            <Select
              placeholder={"Form"}
              options={[
                ...(formNames.map((formName) => ({
                  key: formName,
                  value: formName,
                })) || []),
              ]}
              value={filters?.formName?.name}
              setSelectedItem={(item) => setFilters("formName", item)}
            />

            <Button
              className="flex w-max items-center gap-2"
              onClick={() => {
                navigator.clipboard.writeText(
                  applications
                    ?.map((application) => `${application.id}`)
                    .join("\n"),
                );
              }}
            >
              <CopyIcon />
              Copy IDs
            </Button>

            <Button
              className="flex w-max items-center gap-2"
              onClick={async () => {
                const formType = filters?.formName?.name;
                const response = await toast.promise(
                  axios.get("/applications", {
                    params: {
                      form_type: formType,
                    },
                  }),
                  {
                    loading: `Loading reviews for ${formType}`,
                    success: "Reviews loaded successfully",
                    error: "Failed to load reviews",
                  },
                );
                const fileName = `applications-${
                  formType
                    ? formType?.toLowerCase()?.replace(/ /g, "_") + ".json"
                    : "all-forms"
                }`;

                download(
                  response.data,
                  fileName,
                  response.headers["content-type"],
                );
              }}
            >
              <DownloadIcon /> Export Reviews
            </Button>
          </div>

          <form
            className="flex w-full space-x-4 rounded-lg bg-gray-200 p-2 dark:bg-gray-700 md:w-fit"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <Icon name={"FaSearch"} className="rounded-lg p-2" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="search.."
              className="w-full bg-transparent outline-none"
            />
          </form>
        </div>
      </div>
      <div className="flex flex-col space-y-4 overflow-auto pt-4">
        <table className="mx-auto w-full min-w-[800px] table-auto text-center">
          <thead>
            <tr className="border-b border-b-gray-400 dark:border-b-white">
              <th className="p-4">ID</th>
              <th className="p-4">Reviews</th>
              <th className="p-4">Avg. Final Score</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications?.map((application) => (
              <ApplicationRow key={application.id} application={application} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex w-full items-center justify-between py-8">
        <Button
          variant="link"
          onClick={() => decreasePage()}
          disabled={page === 1}
        >
          <ArrowLeftIcon className="h-8 w-8" />
        </Button>
        <span className="text-lg">{page}</span>
        <Button variant="link" onClick={() => increasePage()}>
          <ArrowRightIcon className="h-8 w-8" />
        </Button>
      </div>
    </>
  );
};
