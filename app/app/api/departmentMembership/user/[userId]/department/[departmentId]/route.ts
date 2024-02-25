import prisma from "server/db";
import { DepartmentMembership } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/departmentMembership/user/[userId]/department/[departmentId]
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string; departmentId: string } },
) {
  try {
    const { userId, departmentId } = params;
    let readDepartmentMembership: DepartmentMembership;

    try {
      readDepartmentMembership = await prisma.departmentMembership.findFirst({
        where: {
          userId,
          departmentId: parseInt(departmentId),
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
