import Dialog from "../../components/Dialog";

export function ViewReview({ trigger, viewReview, applicationToView }) {
  return (
    <Dialog trigger={trigger}>
      <div className="grid gap-4 md:grid-cols-2">
        <ReviewOverview review={viewReview} />
        <ApplicationOverview data={applicationToView} />
      </div>
    </Dialog>
  );
}

export function ReviewOverview({ review }) {
  return (
    <div className="top-0 grid h-fit grid-cols-1 gap-4 overflow-scroll md:sticky md:grid-cols-2">
      <div className="text-2xl md:col-span-2">
        <span>Reviewer: </span>
        {review.reviewer?.first_name + " " + review.reviewer?.last_name}
      </div>
      <hr className="border-2 border-black dark:border-white md:col-span-2" />
      {Object.entries(review)
        .filter(([_, value]) => {
          return typeof value == "string" || typeof value == "number";
        })
        .map(([key, value]: any, i) => {
          return (
            <div key={key} className="border-b pb-2">
              <div className="font-thin">{key}</div>
              <div>{value}</div>
            </div>
          );
        })}
      {Object.entries(review.form)
        .filter(([_, value]) => {
          return typeof value == "string" || typeof value == "number";
        })
        .map(([key, value]: any, i) => {
          return (
            <div key={key} className="border-b pb-2">
              <div className="font-thin">{key}</div>
              <div>{value}</div>
            </div>
          );
        })}
    </div>
  );
}

export function ApplicationOverview({ data }) {
  return (
    <div className="space-y-4 overflow-scroll">
      <div className="col-span-2 text-2xl">Application</div>
      <hr className="border-2 border-black dark:border-white" />
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
