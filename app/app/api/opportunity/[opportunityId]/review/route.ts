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
 * Gets all reviews for a particular opportunity
 *
 * @param NextRequest request
 * @param number opportunityId
 * @returns NextResponse
 */
export const GET = async (
  request: NextRequest,
  { params: { opportunityId } },
): Promise<NextResponse> => {
  try {
    const opportunityIdNum = parseInt(opportunityId);
    if (isNaN(opportunityIdNum)) {
      return NextResponse.json({ Error: "Invalid opportunity ID." }, { status: 400 });
    }

    const isOpportunityExistent = await checkOpportunityExistence(opportunityIdNum);
    if (!isOpportunityExistent) {
      return NextResponse.json({ Error: "Opportunity does not exist." }, { status: 404 });
    }

    const reviews = await prisma.review.findMany({
      where: {
        opportunityId: opportunityIdNum,
      },
    });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ Error: "Internal Server Error" }, { status: 500 });
  }
};

/**
 * POST opportunity/[opportunityId]/review
 *
 * Adds a review to a particular opportunity
 * 
 * @param NextRequest request
 * @param number opportunityId
 * @param @async application - The application encoded in a JSON
 * @returns NextResponse
 */
export const POST = async (
  request: NextRequest,
  { params: { opportunityId } },
): Promise<NextResponse> => {
  try {
    const opportunityIdNum = parseInt(opportunityId);
    if (isNaN(opportunityIdNum)) {
      return NextResponse.json({ Error: "Invalid opportunity ID." }, { status: 400 });
    }

    const isOpportunityExistent = await checkOpportunityExistence(opportunityIdNum);
    if (!isOpportunityExistent) {
      return NextResponse.json({ Error: "Opportunity does not exist." }, { status: 404 });
    }

    const { application } = await request.json();
    if (application === undefined) {
      return NextResponse.json({ Error: "Application data is required." }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        opportunityId: opportunityIdNum,
        application,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("There was an error creating the review:", error.message);
    return NextResponse.json({ Error: "Internal Server Error" }, { status: 500 });
  }
};
