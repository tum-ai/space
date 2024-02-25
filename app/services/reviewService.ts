import axios from "axios";

/**
 * Get the counts of applicants for given review numbers
 * @param opportunityIds Id
 * @returns
 */
export async function getReviewCounts(
  opportunityIds: number[],
): Promise<{ opportunityId: number; count: number }[]> {
  if (!opportunityIds) {
    return [];
  }

  const res = await axios.post(
    `/api/reviews/counts`,
    JSON.stringify(opportunityIds),
  );

  return res.data;
}
