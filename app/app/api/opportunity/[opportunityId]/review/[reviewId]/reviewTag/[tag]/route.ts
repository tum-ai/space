import { NextRequest, NextResponse } from "next/server";
import { validateReviewTagRequest } from "../route";

/**
 * Validates the existence of an opportunity and a review, then fetches the ID of a given tag.
 *
 * @param {number} opportunityId - The ID of the opportunity to validate.
 * @param {number} reviewId - The ID of the review to validate.
 * @param {string} tagName - The name of the tag to fetch the ID for.
 * @returns {Promise<number>} The ID of the tag.
 * @throws {Error} If the opportunity, review, or tag does not exist.
 */
async function validateAndFetchTagId(opportunityId, reviewId, tagName) {
  const isValid = await validateReviewTagRequest(
    parseInt(opportunityId),
    parseInt(reviewId),
  );
  if (!isValid) {
    throw new Error("Invalid opportunity ID or review ID.");
  }

  const tag = await prisma.tag.findFirst({
    where: {
      opportunityId: parseInt(opportunityId),
      name: tagName,
    },
    select: {
      id: true,
    },
  });

  if (!tag) {
    throw new Error(
      `Tag with name '${tagName}' not found for opportunity ID ${opportunityId}.`,
    );
  }

  return tag.id;
}

/**
 * GET opportunity/[opportunityId]/review/[reviewId]/ReviewTag/[tag]
 *
 * Get a ReviewTag for a specific review
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @param string tag - this is the tag that is assigned to the reviewTag
 * @returns NextResponse
 */
export const GET = async (
  request: NextRequest,
  { params: { opportunityId, reviewId, tag } },
): Promise<NextResponse> => {
  try {
    const tagId = await validateAndFetchTagId(opportunityId, reviewId, tag);

    const reviewTag = await prisma.reviewTag.findFirst({
      where: {
        tagId: tagId,
        reviewId: parseInt(reviewId),
      },
      include: {
        tag: true,
      },
    });

    if (!reviewTag) {
      return NextResponse.json(
        { Error: "Review tag not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(reviewTag, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ Error: error.message }, { status: 500 });
  }
};

/**
 * UPDATE opportunity/[opportunityId]/review/[reviewId]/ReviewTag/[tag]
 *
 * Update the tag of a ReviewTag for a specific review
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @param string tag
 * @param json newTag
 * @returns NextResponse
 */
export const PUT = async (
  request: NextRequest,
  { params: { opportunityId, reviewId, tag } },
): Promise<NextResponse> => {
  try {
    const tagId = await validateAndFetchTagId(opportunityId, reviewId, tag);
    const { newTagId, newReviewId } = await request.json();

    if (!newTagId || !newReviewId) {
      return NextResponse.json(
        { Error: "New tag ID and review ID are required." },
        { status: 400 },
      );
    }

    const updateResult = await prisma.reviewTag.updateMany({
      where: {
        tagId: tagId,
        reviewId: parseInt(reviewId),
      },
      data: {
        tagId: newTagId,
        reviewId: newReviewId,
      },
    });

    if (updateResult.count === 0) {
      return NextResponse.json(
        { Error: "No review tag was updated, check your IDs." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { Message: "Review tag updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ Error: error.message }, { status: 500 });
  }
};

/**
 * DELETE opportunity/[opportunityId]/review/[reviewId]/ReviewTag/[tag]
 *
 * Removes the ReviewTag for a specific Review
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @param string tag
 * @returns NextResponse
 */
export const DELETE = async (
  request: NextRequest,
  { params: { opportunityId, reviewId, tag } },
): Promise<NextResponse> => {
  try {
    const tagId = await validateAndFetchTagId(opportunityId, reviewId, tag);

    await prisma.reviewTag.delete({
      where: {
        tagId_reviewId: {
          tagId: tagId,
          reviewId: parseInt(reviewId),
        },
      },
    });

    return NextResponse.json(
      { Message: "Review tag deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { Error: error.message },
      { status: error.message.includes("not found") ? 404 : 500 },
    );
  }
};
