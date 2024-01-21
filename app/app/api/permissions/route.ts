import { NextRequest, NextResponse } from 'next/server'
import prisma from "database/db";
import { checkPermission } from "@lib/auth/checkUserPermission";
import { getServerSession } from 'next-auth';

const complete_view = {
    id: true,
    name: true,
    department_memberships: {
        select: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    image: true,
                }
            },
            department_position: true,
        }
    }
}

const partial_view = {
    id: true,
    name: true,
}


export async function GET(req: NextRequest) {

    let permissions;
    const id  = req.nextUrl.searchParams.get('id');
    
    try {
        if (id) {
            permissions = await prisma.userPermission.findMany({
                select: complete_view
            });
        } else {
            permissions = await prisma.userPermission.findMany({
                select: partial_view
            });
        }
    } catch (error) {
        return NextResponse.json({"error": error}, { status: 500 })
    }
    

    return NextResponse.json({"permissions": permissions}, { status: 200 })
};
     