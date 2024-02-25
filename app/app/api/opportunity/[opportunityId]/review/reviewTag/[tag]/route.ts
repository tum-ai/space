import { NextRequest, NextResponse } from "next/server";
import { checkOpportunityExistence } from "../../route";

/**
 * GET opportunity/[opportunityId]/review/reviewTag/[tag]
 *
 * Fetches all reviews with a specific tag for a given opportunity
 *
 * @param NextRequest request
 * @param string opportunityId
 * @param string tag - the name of the tag that you're filtering for
 * @returns NextResponse
 */
export const GET = async (
  request: NextRequest,
  { params: { opportunityId, tag } },
): Promise<NextResponse> => {
  try {
    const opportunityIdNum = parseInt(opportunityId);
    if (isNaN(opportunityIdNum)) {
      return NextResponse.json(
        { Error: "Invalid opportunity ID." },
        { status: 400 },
      );
    }

    const isOpportunityExistent =
      await checkOpportunityExistence(opportunityIdNum);
    if (!isOpportunityExistent) {
      return NextResponse.json(
        { Error: "Opportunity does not exist." },
        { status: 404 },
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        opportunityId: opportunityIdNum,
        reviewTags: {
          some: {
            tag: { name: tag },
          },
        },
      },
      include: {
        reviewTags: true,
      },
    });

    if (reviews.length === 0) {
      return NextResponse.json(
        { Message: "No reviews found with the specified tag." },
        { status: 404 },
      );
    }

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
