import prisma from "database/db";
import { DepartmentMembership } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/departmentMemberships/[...departmentMembershipIds]
export async function GET(
  req: NextRequest,
  { params }: { params: { departmentMembershipIds: string[] } },
) {
  try {
    const { departmentMembershipIds } = params;
    let readDepartmentMembership: DepartmentMembership[];

    try {
      readDepartmentMembership = await prisma.departmentMembership.findMany({
        where: {
          id: { in: departmentMembershipIds.map((id) => parseInt(id)) },
        },
      });
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(readDepartmentMembership, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// DELETE /api/departmentMemberships/[...departmentMembershipIds]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { departmentMembershipIds: string[] } },
) {
  try {
    const { departmentMembershipIds } = params;
    let deleteDepartmentMembershipCount: number;

    try {
      deleteDepartmentMembershipCount = (
        await prisma.departmentMembership.deleteMany({
          where: {
            id: { in: departmentMembershipIds.map((id) => parseInt(id)) },
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
