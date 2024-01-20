export function ReviewOverview({ review }) {
  return (
    <div className="top-0 grid h-fit grid-cols-1 gap-4 md:sticky md:grid-cols-2">
      <div className="text-2xl md:col-span-2">
        <span>Reviewer: </span>
        {review.reviewer?.firstName + " " + review.reviewer?.lastName}
      </div>
      <hr className="border-2 border-black dark:border-white md:col-span-2" />
      {Object.entries(review)
        .filter(([_, value]) => {
          return typeof value == "string" || typeof value == "number";
        })
        .map(([key, value]: any, i) => {
          return (
            <div
              key={key}
              className="border-b border-black pb-2 dark:border-white"
            >
              <div className="font-thin">{key}</div>
              <div>{value}</div>
            </div>
          );
        })}
      {Object.entries(review.form)
        .filter(([_, value]) => {
          return typeof value == "string" || typeof value == "number";
        })
        .map(([key, value]: any) => {
          return (
            <div
              key={key}
              className="border-b border-black pb-2 dark:border-white"
            >
              <div className="font-thin">{key}</div>
              <div>{value}</div>
            </div>
          );
        })}
    </div>
  );
}
