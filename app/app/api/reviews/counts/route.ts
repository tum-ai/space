import prisma from "database/db";
import { NextRequest, NextResponse } from "next/server";

// POST /api/reviews/count
export async function POST(req: NextRequest) {
  try {
    const opportunityIds: number[] = await req.json();

    const counts = await prisma.review.groupBy({
      by: ["opportunityId"],
      where: {
        opportunityId: {
          in: opportunityIds,
        },
      },
      _count: true,
    });

    const countsMap = opportunityIds.map((id) => {
      const record = counts.find((count) => count.opportunityId === id)
      const count = record ? record._count : 0
      return { opportunityId: id, count: count }
    })


    return NextResponse.json(countsMap, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
