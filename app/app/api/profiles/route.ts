import { NextRequest, NextResponse } from 'next/server'
import prisma from "database/db";
import { checkPermission } from "@lib/auth/checkUserPermission";
import { getServerSession } from 'next-auth';
import { DepartmentMembership, User } from '@prisma/client';

const complete_view = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    userRoles: {
        select: {
            name: true,
        }
    },
    image: true,
    departmentMemberships: {
        select: {
            department: {
                select: {
                    name: true,
                }
            },
            departmentPosition: true,
            membershipEnd: true,
            membershipStart: true,
        }
    }
}

const partial_view = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    userRoles: {
        select: {
            name: true,
        }
    },
    image: true
}


export async function GET(req: NextRequest) {

    const id  = req.nextUrl.searchParams.get('id');
    let profiles;

    try {
        if (id) {
            profiles = await prisma.user.findUnique({
                where: {
                    id: String(id),
                },
                select: complete_view
            }); 
        } else {
            profiles = await prisma.user.findMany({
                select: complete_view,
            });
        }
    } catch (error) {
        return NextResponse.json({"error": error}, { status: 500 })
    }

    const new_profiles = prepareMembershipData(profiles);

    return NextResponse.json({"profiles": new_profiles}, { status: 200 })
};


export async function PUT(req: NextRequest) {

     let body = await req.json()
     const id  = req.nextUrl.searchParams.get('id');
    
    if (!id) {
        return NextResponse.json({ error: "Missing id " }, { status: 400 });
    }

    let data;
    let profiles; 

    try {
        const { first_name, last_name, email, image } = body;

        if (first_name) data.first_name = first_name;
        if (last_name) data.last_name = last_name;
        if (email) data.email = email;
        if (image) data.image = image;
    
        profiles = await prisma.user.update({
            where: {
                id: String(id),
            },
            data: data,
            select: complete_view
        });     
    } catch (error) {
        return NextResponse.json({"error": error}, { status: 500 })
    }
    
    
    const new_profiles = prepareMembershipData(profiles);

    return NextResponse.json({"profiles": new_profiles}, { status: 200 })
}

export async function DELETE(req: NextRequest) {


    const id  = req.nextUrl.searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: "Missing id " }, { status: 400 });
    }
    const profiles = await prisma.user.delete({
        where: {
            id: String(id),
        },
        select: complete_view
    });

    const new_profiles = prepareMembershipData(profiles);

    return NextResponse.json({"profiles": new_profiles}, { status: 200 })
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

    profiles.forEach(profile => {
        if (profile.departmentMemberships && Array.isArray(profile.departmentMemberships)) {
            profile.departmentMemberships.sort((a, b) => {
                if (a.membershipEnd === b.membershipEnd) {
                    return b.membershipStart.getTime() - a.membershipStart.getTime();
                }
                return b.membershipEnd.getTime() - a.membershipEnd.getTime();
            });
        }
    });

    //assign new fields
    profiles.forEach(profile => {
        if (profile.departmentMemberships && profile.departmentMemberships?.length > 0) {
            profile['currentDepartment'] = profile.departmentMemberships[0]?.department?.name;
            profile['currentDepartmentPosition'] = profile.departmentMemberships[0]?.departmentPosition;
        } else {
            profile['currentDepartment'] = "";
            profile['currentDepartmentPosition'] = "";
        }
    });

    return profiles;
}