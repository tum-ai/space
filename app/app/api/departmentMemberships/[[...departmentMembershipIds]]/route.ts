import prisma from "database/db";
import { DepartmentMembership } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/departmentMemberships/[[...departmentMembershipIds]]
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    let departmentMembershipIds = searchParams.getAll(
      "departmentMembershipIds",
    );
    if (!departmentMembershipIds.length) {
      departmentMembershipIds = undefined;
    }

    let readDepartmentMembership: DepartmentMembership[];

    try {
      readDepartmentMembership = await prisma.departmentMembership.findMany({
        where: {
          id: {
            in: departmentMembershipIds?.map((id) => parseInt(id)),
          },
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
