import { NextRequest, NextResponse } from "next/server";
import { checkOpportunityExistence } from "../route";

/**
 * GET opportunity/[opportunityId]/review/[reviewId]
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @returns review review
 */
export const GET = async (
  request: NextRequest,
  { params: { opportunityId, reviewId } },
): Promise<NextResponse> => {
  try {
    const opportunityExists = await checkOpportunityExistence(
      parseInt(opportunityId),
    );

    const readReviewById = await prisma.review.findUnique({
      where: {
        id: parseInt(reviewId),
        opportunityId: parseInt(opportunityId),
      },
    });

    const responseBody =
      readReviewById === null || !opportunityExists
        ? {
            Error: "Bad request. The review with this id does not exist.",
          }
        : readReviewById;
    const status = readReviewById === null || !opportunityExists ? 400 : 200;

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
 * UPDATE opportunity/[opportunityId]/review/[reviewId]
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @returns review review
 */
export const PUT = async (
  request: NextRequest,
  { params: { opportunityId, reviewId } },
): Promise<NextResponse> => {
  try {
    const opportunityExists = await checkOpportunityExistence(
      parseInt(opportunityId),
    );

    const { application } = await request.json();

    const updateReviewById = await prisma.review.update({
      where: {
        id: parseInt(reviewId),
        opportunityId: parseInt(opportunityId),
      },
      data: {
        application: application,
      },
    });

    const responseBody =
      updateReviewById === null ||
      application === undefined ||
      !opportunityExists
        ? {
            Error: "Bad request. The review with this id does not exist.",
          }
        : updateReviewById;
    const status =
      updateReviewById === null ||
      application === undefined ||
      !opportunityExists
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
 * DELETE opportunity/[opportunityId]/review/[reviewId]
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @returns review review
 */
export const DELETE = async (
  request: NextRequest,
  { params: { opportunityId, reviewId } },
): Promise<NextResponse> => {
  try {
    const opportunityExists = await checkOpportunityExistence(
      parseInt(opportunityId),
    );

    const deleteReview = await prisma.review.delete({
      where: {
        id: parseInt(reviewId),
        opportunityId: parseInt(opportunityId),
      },
    });

    const responseBody =
      deleteReview === null || !opportunityExists
        ? {
            Error: "Bad request. The review with this id does not exist.",
          }
        : deleteReview;
    const status = deleteReview === null || !opportunityExists ? 400 : 200;

    return NextResponse.json(responseBody, { status });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
