import { NextRequest, NextResponse } from "next/server";
import { checkOpportunityExistence } from "../review/route";

/**
 * GET opportunity/[opportunityId]/tag
 *
 * Fetches all tags for a specific opportunity
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
    const isOpportunityExistent = await checkOpportunityExistence(
      parseInt(opportunityId),
    );
    if (!isOpportunityExistent) {
      return NextResponse.json(
        { Error: "Opportunity does not exist." },
        { status: 404 },
      );
    }

    const tags = await prisma.tag.findMany({
      where: {
        opportunityId: parseInt(opportunityId),
      },
    });

    return NextResponse.json(tags, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
/**
 * POST opportunity/[opportunityId]/tag
 *
 * Adds a tag to an opportunity
 *
 * @param NextRequest request
 * @param number opportunityId
 * @async @param json name
 * @async @param json tallyLabel
 * @returns NextResponse
 */
export const POST = async (
  request: NextRequest,
  { params: { opportunityId } },
): Promise<NextResponse> => {
  try {
    const { name, tallyLabel } = await request.json();

    if (name === undefined || tallyLabel === undefined) {
      return NextResponse.json(
        { Error: "Missing tag name or tally label." },
        { status: 400 },
      );
    }

    const isOpportunityExistent = await checkOpportunityExistence(
      parseInt(opportunityId),
    );
    if (!isOpportunityExistent) {
      return NextResponse.json(
        { Error: "Opportunity does not exist." },
        { status: 404 },
      );
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        tallyLabel,
        opportunityId: parseInt(opportunityId),
      },
    });

    return NextResponse.json(tag, { status: 200 });
  } catch (error) {
    console.error(error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { Error: "Tag already exists." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { Error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
