import { NextRequest, NextResponse } from "next/server";
import prisma from "database/db";

/**
 * Checks if the opportunity exists.
 *
 * @param NextRequest request
 * @param number opportunityId
 * @returns boolean opportunityExistence
 */
export const checkOpportunityExistence = async (
  opportunityId: number,
): Promise<boolean> => {
  const opportunity = await prisma.opportunity
    .findUnique({
      where: {
        id: opportunityId,
      },
    })
    .catch((error) => {
      console.log("Unable to find an opportunity with this id: ", error);
    });

  return opportunity !== null;
};

/**
 * GET opportunityParticipation/[opportunityId]/review
 *
 * @param NextRequest request
 * @param number opportunityId
 * @returns review[] reviews
 */
export const GET = async (
  request: NextRequest,
  { params: { opportunityId } },
): Promise<NextResponse> => {
  try {
    const isOpportunityExistent = await checkOpportunityExistence(
      parseInt(opportunityId),
    );

    const getReviews = await prisma.review.findMany({
      where: {
        opportunityId: parseInt(opportunityId),
      },
    });

    const responseBody =
      getReviews === null || !isOpportunityExistent
        ? {
            Error: "Bad request. The review with this id does not exist.",
          }
        : getReviews;
    const status = getReviews === null || !isOpportunityExistent ? 400 : 200;

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
 * POST opportunity/[opportunityId]/review
 *
 * @param NextRequest request
 * @param number opportunityId
 * @returns review review
 */
export const POST = async (
  request: NextRequest,
  { params: { opportunityId } },
): Promise<NextResponse> => {
  try {
    const isOpportunityExistent = await checkOpportunityExistence(
      parseInt(opportunityId),
    );
    const { application } = await request.json();

    const createReview = await prisma.review.create({
      data: {
        opportunityId: parseInt(opportunityId),
        application: application,
      },
    });

    const responseBody =
      createReview === null ||
      !isOpportunityExistent ||
      application === undefined
        ? {
            Error: "Bad request. The review with this id does not exist.",
          }
        : createReview;
    const status =
      createReview === null ||
      !isOpportunityExistent ||
      application === undefined
        ? 400
        : 200;

    return NextResponse.json(responseBody, { status });
  } catch (error) {
    console.log("There was an error creating the review:", error.message);
    return NextResponse.json(
      { Error: "Internal server error." },
      { status: 500 },
    );
  }
};
