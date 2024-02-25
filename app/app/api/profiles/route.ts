import { NextRequest, NextResponse } from "next/server";
import prisma from "server/db";

export async function GET(req: NextRequest) {
  let profiles;

  try {
    profiles = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        departmentMemberships: {
          select: {
            department: {
              select: {
                id: true,
                name: true,
              },
            },
            departmentPosition: true,
            membershipEnd: true,
            membershipStart: true,
          },
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }

  const new_profiles = prepareMembershipData(profiles);

  return NextResponse.json({ profiles: new_profiles }, { status: 200 });
}

function prepareMembershipData(profiles: any) {
  // not possible to order by nested fields. function required.
  // orderBy: {
  //     membership_end: 'desc',
  //     membership_start: 'desc'
  // }
  // in Prisma2 https://github.com/graphql-nexus/nexus-plugin-prisma/issues/458

  if (!profiles) return;

  if (!Array.isArray(profiles)) {
    profiles = [profiles];
  }

  profiles.forEach((profile) => {
    if (
      profile.departmentMemberships &&
      Array.isArray(profile.departmentMemberships)
    ) {
      profile.departmentMemberships.sort((a, b) => {
        if (a.membershipEnd === b.membershipEnd) {
          return b.membershipStart.getTime() - a.membershipStart.getTime();
        }
        return b.membershipEnd.getTime() - a.membershipEnd.getTime();
      });
    }
  });

  //assign new fields
  profiles.forEach((profile) => {
    if (
      profile.departmentMemberships &&
      profile.departmentMemberships?.length > 0
    ) {
      profile.currentDepartment =
        profile.departmentMemberships[0]?.department?.name;
      profile.currentDepartmentPosition =
        profile.departmentMemberships[0]?.departmentPosition;
    } else {
      profile.currentDepartment = "";
      profile.currentDepartmentPosition = "";
    }
  });

  return profiles;
}
