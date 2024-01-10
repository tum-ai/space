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
                    first_name: true,
                    last_name: true,
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

    //authorization
    const session = await getServerSession().catch((e) => {
        console.log(e);
        return null;
    });
    const user_permission = session?.user?.permission;
  
    const has_admin_permission = user_permission && await checkPermission(['admin'], user_permission);

    // _________________________________________________________

    let departments;

    
    if (has_admin_permission) {
        departments = await prisma.department.findMany({
            select: complete_view
        });
    } else {
        departments = await prisma.department.findMany({
            select: partial_view
        });
    }

    return NextResponse.json({"departments": departments}, { status: 200 })
    
};
     