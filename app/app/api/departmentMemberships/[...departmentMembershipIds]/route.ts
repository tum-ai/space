import prisma from "database/db";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/departmentMemberships/[...departmentMembershipIds]
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const departmentMembershipIds = searchParams
      .getAll("departmentMembershipIds")
      .map((id) => parseInt(id));
    let deleteDepartmentMembershipCount: number;

    try {
      deleteDepartmentMembershipCount = (
        await prisma.departmentMembership.deleteMany({
          where: {
            id: {
              in: departmentMembershipIds,
            },
          },
        })
      ).count;
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(deleteDepartmentMembershipCount, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
