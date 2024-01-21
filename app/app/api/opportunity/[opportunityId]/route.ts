import { Opportunity } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/opportunity/[opportunityId]
export async function GET(
  req: NextRequest,
  { params }: { params: { opportunityId: string } },
) {
  try {
    const { opportunityId } = params;
    let readOpportunity: Opportunity;

    try {
      readOpportunity = await prisma.opportunity.findUnique({
        where: { id: parseInt(opportunityId) },
      });
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(readOpportunity, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// PUT /api/opportunity/[opportunityId]
export async function PUT(
  req: NextRequest,
  { params }: { params: { opportunityId: string } },
) {
  try {
    const { opportunityId } = params;
    const updateFields = await req.json();

    let updateOpportunity: Opportunity;

    try {
      updateOpportunity = await prisma.opportunity.update({
        where: { id: parseInt(opportunityId) },
        data: updateFields,
      });
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(updateOpportunity, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// DELETE /api/opportunity/[opportunityId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { opportunityId: string } },
) {
  try {
    const { opportunityId } = params;
    let deleteOpportunity: Opportunity;

    try {
      deleteOpportunity = await prisma.opportunity.delete({
        where: { id: parseInt(opportunityId) },
      });
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(deleteOpportunity, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
