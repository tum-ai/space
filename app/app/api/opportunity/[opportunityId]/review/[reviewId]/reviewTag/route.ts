import { NextRequest, NextResponse } from "next/server";
import { validateReviewPhaseRequest } from "../reviewPhase/route";
import { useRouter } from "next/navigation";

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
 * Checks if the opportunity and reviewId are existent. If not, error is thrown.
 *
 * @param opportunityId
 *
 * @param reviewId
 * @returns
 */
export const validateReviewTagRequest = async (
  opportunityId: number,
  reviewId: number,
): Promise<boolean> => {
  return validateReviewPhaseRequest(opportunityId, reviewId);
};

/**
 * GET opportunity/[opportunityId]/review/[reviewId]/reviewTag
 * 
 * Gets all ReviewTags for this Review
 *
 * @param NextRequest request
 * @param number reviewId
 * @param number opportunityId
 * @returns ReviewTag[] reviewTag
 */
export const GET = async (
  request: NextRequest,
  { params: { opportunityId, reviewId } },
): Promise<NextResponse> => {
  try {
    const opportunityIdNum = parseInt(opportunityId);
    const reviewIdNum = parseInt(reviewId);

    const isValidReviewTagRequest = await validateReviewTagRequest(opportunityIdNum, reviewIdNum);
    if (!isValidReviewTagRequest) {
      return NextResponse.json({ Error: "Invalid review or opportunity ID." }, { status: 400 });
    }

    const reviewTags = await prisma.reviewTag.findMany({
      where: {
        reviewId: reviewIdNum,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(reviewTags, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ Error: "Internal Server Error" }, { status: 500 });
  }
};

/**
 * POST opportunity/[opportunityId]/review/[reviewId]/reviewTag
 * 
 * Creates a new ReviewTag
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @param @async tag - The tag that this ReviewTag points to 
 * @returns ReviewTag reviewTag
 */
export const POST = async (
  request: NextRequest,
  { params: { opportunityId, reviewId } },
): Promise<NextResponse> => {
  try {
    const opportunityIdNum = parseInt(opportunityId);
    const reviewIdNum = parseInt(reviewId);
    const { tag } = await request.json();

    if (!tag) {
      return NextResponse.json({ Error: "Tag is required." }, { status: 400 });
    }

    const isValidReviewTagRequest = await validateReviewTagRequest(opportunityIdNum, reviewIdNum);
    if (!isValidReviewTagRequest) {
      return NextResponse.json({ Error: "Invalid review or opportunity ID." }, { status: 400 });
    }

    const tagRecord = await prisma.tag.findFirst({
      where: {
        opportunityId: opportunityIdNum,
        name: tag,
      },
      select: {
        id: true,
      },
    });

    if (!tagRecord) {
      return NextResponse.json({ Error: "Tag not found." }, { status: 404 });
    }

    const createReviewTag = await prisma.reviewTag.create({
      data: {
        tagId: tagRecord.id,
        reviewId: reviewIdNum,
      },
    });

    return NextResponse.json(createReviewTag, { status: 201 }); // Use 201 for creation
  } catch (error) {
    console.error(error);
    return NextResponse.json({ Error: "Internal Server Error" }, { status: 500 });
  }
};

