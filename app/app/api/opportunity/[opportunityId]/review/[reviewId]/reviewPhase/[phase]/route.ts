import { NextRequest, NextResponse } from "next/server";
import { validateReviewPhaseRequest } from "../route";
import { updatePhoneNumber } from "firebase/auth";

/**
 * GET opportunity/[opportunityId]/review/[reviewId]/reviewPhase/[phase]
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @param string phase
 * @returns ReviewPhase reviewPhase
 */
export const GET = async (
  request: NextRequest,
  { params: { opportunityId, reviewId, phase } },
): Promise<NextResponse> => {
  try {
    const isReviewPhaseRequestValid = await validateReviewPhaseRequest(
      parseInt(opportunityId),
      parseInt(reviewId),
    );
    const readReviewPhaseByName = await prisma.phaseReview.findUnique({
      where: {
        id: {
          reviewId: parseInt(reviewId),
          phase: phase,
        },
      },
    });

    const responseBody =
      readReviewPhaseByName === null || !isReviewPhaseRequestValid
        ? {
            Error: "Bad request. The review phase with this id does not exist.",
          }
        : readReviewPhaseByName;
    const status =
      readReviewPhaseByName === null || !isReviewPhaseRequestValid ? 400 : 200;

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
 * UPDATE opportunity/[opportunityId]/review/[reviewId]/reviewPhase/[phase]
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @param string phase
 * @returns ReviewPhase reviewPhase
 */
export const PUT = async (
  request: NextRequest,
  { params: { opportunityId, reviewId, phase } },
): Promise<NextResponse> => {
  try {
    const isReviewPhaseRequestValid = await validateReviewPhaseRequest(
      parseInt(opportunityId),
      parseInt(reviewId),
    );

    const { phaseName, assigneeId } = await request.json();

    const updateReviewPhase = await prisma.phaseReview.update({
      where: {
        id: {
          phase: phase,
          reviewId: parseInt(reviewId),
        },
      },
      data: {
        phase: phaseName,
        assigneeId: assigneeId,
      },
    });

    const responseBody =
      updateReviewPhase === null || !isReviewPhaseRequestValid
        ? {
            Error: "Bad request. The review phase with this id does not exist.",
          }
        : updateReviewPhase;
    const status =
      updateReviewPhase === null ||
      !isReviewPhaseRequestValid ||
      (phase === undefined && assigneeId === undefined)
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

/**
 * DELETE opportunity/[opportunityId]/review/[reviewId]/reviewPhase/[phase]
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @param string phase
 * @returns ReviewPhase reviewPhase
 */
export const DELETE = async (
  request: NextRequest,
  { params: { opportunityId, reviewId, phase } },
): Promise<NextResponse> => {
  try {
    const isReviewPhaseRequestValid = await validateReviewPhaseRequest(
      parseInt(opportunityId),
      parseInt(reviewId),
    );

    const deleteReviewPhase = await prisma.phaseReview.delete({
      where: {
        id: {
          phase: phase,
          reviewId: parseInt(reviewId),
        },
      },
    });

    const responseBody =
      deleteReviewPhase === null || isReviewPhaseRequestValid === undefined
        ? {
            Error: "Bad request. The review phase with this id does not exist.",
          }
        : deleteReviewPhase;
    const status =
      deleteReviewPhase === null || isReviewPhaseRequestValid === undefined
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
