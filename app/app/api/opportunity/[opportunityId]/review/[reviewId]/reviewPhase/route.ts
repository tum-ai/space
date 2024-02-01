import { NextRequest, NextResponse } from "next/server";
import { checkOpportunityExistence } from "../../route";
import { validateLocaleAndSetLanguage } from "typescript";

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

export const validateReviewPhaseRequest = async (
  opportunityId: number,
  reviewId: number,
): Promise<boolean> => {
  try {
    return (
      checkOpportunityExistence(opportunityId) && checkReviewExistence(reviewId)
    );
  } catch (error) {
    console.log("Unable to validate review phase request.");
    return false;
  }
};

/**
 * GET opportunity/[opportunityId]/review/[reviewId]/reviewPhase
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
    const isValidReviewPhaseRequest = await validateReviewPhaseRequest(
      parseInt(opportunityId),
      parseInt(reviewId),
    );

    const reviewPhases = await prisma.phaseReview.findMany({
      where: {
        reviewId: parseInt(reviewId),
      },
    });

    const responseBody =
      reviewPhases === null || !isValidReviewPhaseRequest
        ? {
            Error: "Bad request. The review with this id does not exist.",
          }
        : reviewPhases;
    const status =
      reviewPhases === null || !isValidReviewPhaseRequest ? 400 : 200;

    return NextResponse.json(responseBody, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

/**
 * POST opportunity/[opportunityId]/review/[reviewId]/reviewPhase
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @returns ReviewPhase reviewPhase
 */
export const POST = async (
  request: NextRequest,
  { params: { opportunityId, reviewId } },
): Promise<NextResponse> => {
  try {
    const { phase, assigneeId, content } = await request.json();
    let reviewPhaseUndefined = false;

    if (
      phase === undefined ||
      assigneeId === undefined ||
      content === undefined
    ) {
      console.log("seaseaesasersaeaseasd\n\n\n\n\n");
      reviewPhaseUndefined = true;
    }

    const isValidReviewPhaseRequest = await validateReviewPhaseRequest(
      parseInt(opportunityId),
      parseInt(reviewId),
    );

    const createReviewPhase = await prisma.phaseReview.create({
      data: {
        phase: phase,
        reviewId: parseInt(reviewId),
        assigneeId: assigneeId,
        content: content,
      },
    });

    const responseBody =
      createReviewPhase === null ||
      !isValidReviewPhaseRequest ||
      reviewPhaseUndefined
        ? {
            Error: "Bad request. The review with this id does not exist.",
          }
        : createReviewPhase;
    const status =
      createReviewPhase === null ||
      !isValidReviewPhaseRequest ||
      reviewPhaseUndefined
        ? 400
        : 200;

    return NextResponse.json(responseBody, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
