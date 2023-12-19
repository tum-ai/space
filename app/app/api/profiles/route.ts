import { NextRequest, NextResponse } from 'next/server'
import prisma from "database/db";
import { checkPermission } from "@lib/auth/checkUserPermission";
import { getServerSession } from 'next-auth';

const complete_view = {
    id: true,
    first_name: true,
    last_name: true,
    email: true,
    permission: true,
    image: true,
    department_memberships: {
        select: {
            department: {
                select: {
                    name: true,
                }
            },
            department_position: true,
        }
    }
}

const partial_view = {
    id: true,
    first_name: true,
    last_name: true,
    email: true,
    permission: true,
    image: true,
    department_memberships: {
        select: {
            department: {
                select: {
                    name: true,
                }
            },
            department_position: true,
        }
    }
}




export async function GET(req: NextRequest) {

    //authorization
    const session = await getServerSession();
    const user_permission = session?.user?.permission;
  
    const has_permission = await checkPermission(['user'], user_permission);
  
    if (!has_permission) {
        return NextResponse.json({ error: "Missing permission " }, { status: 400 });
    }

    // _________________________________________________________

    const id  = req.nextUrl.searchParams.get('id');

    if (id) {
        const profiles = await prisma.user.findUnique({
            where: {
                id: String(id),
            },
            select: complete_view
        });
        return NextResponse.json({"profiles": profiles}, { status: 200 })
    } else {
        const profiles = await prisma.user.findMany({
            select: partial_view
        });
        return NextResponse.json({"profiles": profiles}, { status: 200 })
    }
};


export async function PUT(req: NextRequest) {
     //authorization
     const session = await getServerSession();
     const user_permission = session?.user?.permission;
   
     const has_permission = user_permission && await checkPermission(['user'], user_permission);
     const has_admin_permission = user_permission && await checkPermission(['admin'], user_permission);
   
     if (!has_permission) {
         return NextResponse.json({ error: "Missing permission " }, { status: 400 });
     }
 
     // _________________________________________________________

     let body = await req.json()
     const id  = req.nextUrl.searchParams.get('id');
    
    if (!id) {
        return NextResponse.json({ error: "Missing id " }, { status: 400 });
    }

    let data;
    
    if (has_admin_permission) {
        data = body;
    } else {
        // if not admin only this
        const { first_name, last_name, email, image } = body;

        if (first_name) data.first_name = first_name;
        if (last_name) data.last_name = last_name;
        if (email) data.email = email;
        if (image) data.image = image;
    }

    const profiles = await prisma.user.update({
        where: {
            id: String(id),
        },
        data: data,
        select: complete_view
    });

    return NextResponse.json({"profiles": profiles}, { status: 200 })
}

export async function DELETE(req: NextRequest) {

     //authorization
     const session = await getServerSession();
     const user_permission = session?.user?.permission;
   
     const has_permission = user_permission && await checkPermission(['admin'], user_permission);
   
     if (!has_permission) {
         return NextResponse.json({ error: "Missing permission " }, { status: 400 });
     }
 
     // _________________________________________________________

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
    return NextResponse.json({"profiles": profiles}, { status: 200 })
}