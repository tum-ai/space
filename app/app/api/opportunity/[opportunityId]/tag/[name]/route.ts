import { NextRequest, NextResponse } from "next/server";
import { checkOpportunityExistence } from "../../review/route";
import { validateReviewTagRequest } from "../../review/[reviewId]/reviewTag/route";
import { Tag } from "@prisma/client";
import { isValid } from "date-fns";

/**
 * GET opportunity/[opportunityId]/tag/[name]
 *
 * Gets a specific tag from an opportunity
 *
 * @param NextRequest request
 * @param number opportunityId
 * @returns NextResponse
 */
export const GET = async (request: NextRequest, { params: { opportunityId, name } }): Promise<NextResponse> => {
  try {
    const isOpportunityExistent = await checkOpportunityExistence(parseInt(opportunityId));
    if (!isOpportunityExistent) {
      return NextResponse.json({ Error: "Opportunity does not exist." }, { status: 404 });
    }

    const tag = await prisma.tag.findUnique({
      where: {
        opportunityId_name: {
          name,
          opportunityId: parseInt(opportunityId),
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ Error: "Tag not found." }, { status: 404 });
    }

    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ Error: "Internal Server Error" }, { status: 500 });
  }
};


/**
 * PUT opportunity/[opportunityId]/tag/[name]
 *
 * Updates a specific tag for an opportunity
 *
 * @param NextRequest request
 * @param number opportunityId
 * @async @param json newTag - the new name you want to give this tag
 * @returns NextResponse
 */
export const PUT = async (request: NextRequest, { params: { opportunityId, name } }): Promise<NextResponse> => {
  try {
    const isOpportunityExistent = await checkOpportunityExistence(parseInt(opportunityId));
    if (!isOpportunityExistent) {
      return NextResponse.json({ Error: "Opportunity does not exist." }, { status: 404 });
    }

    const { newTag } = await request.json();
    if (!newTag) {
      return NextResponse.json({ Error: "New tag name is required." }, { status: 400 });
    }

    const updatedTag = await prisma.tag.update({
      where: {
        opportunityId_name: {
          name,
          opportunityId: parseInt(opportunityId),
        },
      },
      data: {
        name: newTag,
      },
    });

    return NextResponse.json(updatedTag, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ Error: "Internal Server Error" }, { status: 500 });
  }
};

/**
 * DELETE opportunity/[opportunityId]/tag/[name]
 * 
 * Deletes a particular tag from an opportunity
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number name
 * @returns NextResponse
 */
export const DELETE = async (request: NextRequest, { params: { opportunityId, name } }): Promise<NextResponse> => {
  try {
    const opportunityExists = await checkOpportunityExistence(parseInt(opportunityId));
    if (!opportunityExists) {
      return NextResponse.json({ Error: "Opportunity does not exist." }, { status: 404 });
    }

    await prisma.tag.delete({
      where: {
        opportunityId_name: {
          name,
          opportunityId: parseInt(opportunityId),
        },
      },
    });

    return NextResponse.json({ Message: "Tag deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return NextResponse.json({ Error: "Tag not found." }, { status: 404 });
    }
    return NextResponse.json({ Error: "Internal Server Error" }, { status: 500 });
  }
};


