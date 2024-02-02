import { NextRequest, NextResponse } from "next/server";
import prisma from "database/db";

/**
 * GET opportunity/[opportunityId]/review/[reviewId]/reviewPhase/[phase]
 *
 * Gets a specific ReviewPhase for a review
 * 
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @param string phase
 * @returns NextResponse
 */
export const GET = async (
  request: NextRequest,
  { params: { opportunityId, reviewId, phase } },
): Promise<NextResponse> => {
  try {
    const reviewIdNum = parseInt(reviewId);
    if (isNaN(reviewIdNum)) {
      return NextResponse.json({ Error: "Invalid review ID." }, { status: 400 });
    }

    const reviewPhase = await prisma.phaseReview.findUnique({
      where: {
        id: {
          reviewId: reviewIdNum,
          phase: phase,
        },
      },
    });

    if (!reviewPhase) {
      return NextResponse.json({ Error: "Review phase does not exist." }, { status: 404 });
    }

    return NextResponse.json(reviewPhase, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ Error: "Internal Server Error" }, { status: 500 });
  }
};

/**
 * UPDATE opportunity/[opportunityId]/review/[reviewId]/reviewPhase/[phase]
 *
 * Update a ReviewPhase of a review
 * 
 * @param NextRequest request
 * @param number opportunityId
 * @param number reviewId
 * @param string phase
 * @param @async newPhaseName  - the new name of the phase
 * @param @async assigneeId - the new reviewerId of this phase (refers to User ID)
 * @returns NextResponse
 */
export const PUT = async (
  request: NextRequest,
  { params: { opportunityId, reviewId, phase } },
): Promise<NextResponse> => {
  try {
    const reviewIdNum = parseInt(reviewId);
    const { newPhaseName, assigneeId } = await request.json();

    if (!newPhaseName || !assigneeId) {
      return NextResponse.json({ Error: "New phase name and valid assignee ID are required." }, { status: 400 });
    }

    const assigneeExists = await prisma.user.findUnique({
      where: {
        id: assigneeId
      },
    });

    if (!assigneeExists) {
      return NextResponse.json({ Error: "Assignee does not exist." }, { status: 404 });
    }

    const existingPhaseReview = await prisma.phaseReview.findUnique({
      where: {
        id: {
          reviewId: reviewIdNum,
          phase: phase,
        },
      },
    });

    if (!existingPhaseReview) {
      return NextResponse.json({ Error: "Review phase not found." }, { status: 404 });
    }

    const updatedReviewPhase = await prisma.phaseReview.update({
      where: {
        id: { 
          phase,
          reviewId: reviewIdNum,
        },
      },
      data: {
        phase: newPhaseName,
        assigneeId: assigneeId,
      },
    });

    return NextResponse.json(updatedReviewPhase, { status: 200 });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return NextResponse.json({ Error: "Review phase not found." }, { status: 404 });
    } else if (error.code === "P2002") {
      return NextResponse.json({ Error: "Data constraint violation." }, { status: 400 });
    }

    return NextResponse.json({ Error: "Internal Server Error" }, { status: 500 });
  }
};



/**
 * DELETE opportunity/[opportunityId]/review/[reviewId]/reviewPhase/[phase]
 *
 * Remove a ReviewPhase for a review
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
    const reviewIdNum = parseInt(reviewId);

    await prisma.phaseReview.delete({
      where: {
        id: {
          reviewId: reviewIdNum,
          phase: phase,
        },
      },
    });

    return NextResponse.json({ Message: "Review phase deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return NextResponse.json({ Error: "Review phase not found." }, { status: 404 });
    }
    return NextResponse.json({ Error: "Internal Server Error" }, { status: 500 });
  }
};

