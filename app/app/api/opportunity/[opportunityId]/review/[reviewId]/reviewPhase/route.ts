import { NextRequest, NextResponse } from "next/server";
import { checkOpportunityExistence } from "../../route";

/**
 * Checks if the review exists.
 *
 * @param number reviewId
 * @returns boolean opportunityExistence
 */
export const checkReviewExistence = async (
  reviewId: number,
): Promise<boolean> => {
  const review = await prisma.review
    .findUnique({
      where: {
        id: reviewId,
      },
    })
    .catch((error) => {
      console.log("Unable to find an review with this id: ", error);
    });

  return review !== null;
};

/**
 * Ensures that the opportunity and review ids exist.
 *
 * @param opportunityId
 *
 * @param reviewId
 * @returns
 */
export const validateReviewPhaseRequest = async (
  opportunityId: number,
  reviewId: number,
): Promise<boolean> => {
  try {
    return (
      (await checkOpportunityExistence(opportunityId)) &&
      (await checkReviewExistence(reviewId))
    );
  } catch (error) {
    console.log(
      "Unable to validate review request. Does the review/opportunity exist?",
    );
    return false;
  }
};

/**
 * GET opportunity/[opportunityId]/review/[reviewId]/reviewPhase
 *
 * Gets all phases for a review
 *
 * @param NextRequest request
 * @param number reviewId
 * @param number opportunityId
 * @returns ReviewPhase[] ReviewPhase
 */
export const GET = async (
  request: NextRequest,
  { params: { opportunityId, reviewId } },
): Promise<NextResponse> => {
  try {
    const reviewIdNum = parseInt(reviewId);
    if (isNaN(reviewIdNum)) {
      return NextResponse.json(
        { Error: "Invalid review ID." },
        { status: 400 },
      );
    }

    const isValidReviewPhaseRequest = await validateReviewPhaseRequest(
      parseInt(opportunityId),
      reviewIdNum,
    );
    if (!isValidReviewPhaseRequest) {
      return NextResponse.json(
        { Error: "Opportunity or Review does not exist." },
        { status: 404 },
      );
    }

    const reviewPhases = await prisma.phaseReview.findMany({
      where: {
        reviewId: reviewIdNum,
      },
    });

    return NextResponse.json(reviewPhases, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

/**
 * POST opportunity/[opportunityId]/review/[reviewId]/reviewPhase
 *
 * Adds a reviewPhase to a particular review
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @param @async phase - the name of the phase
 * @param @async assigneeId - the reviewer profile for this phase
 * @param @async content - the reviewer notes
 * @returns ReviewPhase reviewPhase
 */
export const POST = async (
  request: NextRequest,
  { params: { opportunityId, reviewId } },
): Promise<NextResponse> => {
  try {
    const { phase, assigneeId, content } = await request.json();

    if (!phase || !assigneeId || !content) {
      return NextResponse.json(
        { Error: "Phase, assigneeId, and content are required." },
        { status: 400 },
      );
    }

    const reviewIdNum = parseInt(reviewId);
    if (isNaN(reviewIdNum)) {
      return NextResponse.json(
        { Error: "Invalid review ID or assignee ID." },
        { status: 400 },
      );
    }

    const isValidReviewPhaseRequest = await validateReviewPhaseRequest(
      parseInt(opportunityId),
      reviewIdNum,
    );
    if (!isValidReviewPhaseRequest) {
      return NextResponse.json(
        { Error: "Opportunity or Review does not exist." },
        { status: 404 },
      );
    }

    const createReviewPhase = await prisma.phaseReview.create({
      data: {
        phase,
        reviewId: reviewIdNum,
        assigneeId: assigneeId,
        content,
      },
    });

    return NextResponse.json(createReviewPhase, { status: 201 }); // Use 201 for created resources
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
