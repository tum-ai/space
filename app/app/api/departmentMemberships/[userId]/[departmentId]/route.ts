import prisma from "database/db";
import { DepartmentMembership } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/departmentMemberships/[userId]/[departmentId]
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = parseInt(searchParams.get("userId"));
    const departmentId = parseInt(searchParams.get("departmentId"));
    let readDepartmentMembership: DepartmentMembership;

    try {
      readDepartmentMembership = await prisma.departmentMembership.findUnique({
        where: { userId, departmentId },
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
