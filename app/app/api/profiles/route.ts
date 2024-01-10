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
            membership_end: true,
            membership_start: true,
        }
    }
}

const partial_view = {
    id: true,
    first_name: true,
    last_name: true,
    email: true,
    permission: true,
    image: true
}


export async function GET(req: NextRequest) {

    //authorization
    const session = await getServerSession().catch((e) => {
        console.log(e);
        return null;
    });
    const user_permission = session?.user?.permission;
  
    const has_permission = await checkPermission(['user'], user_permission);
  
    if (!has_permission) {
        return NextResponse.json({ error: "Missing permission " }, { status: 403 });
    }

    // _________________________________________________________

    const id  = req.nextUrl.searchParams.get('id');
    let profiles;

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

    prepareMembershipData(profiles);

    return NextResponse.json({"profiles": profiles}, { status: 200 })
};


export async function PUT(req: NextRequest) {
     //authorization
     const session = await getServerSession().catch((e) => {
        console.log(e);
        return null;
    });
     const user_permission = session?.user?.permission;
   
     const has_permission = user_permission && await checkPermission(['user'], user_permission);
     const has_admin_permission = user_permission && await checkPermission(['admin'], user_permission);
   
     if (!has_permission) {
         return NextResponse.json({ error: "Missing permission " }, { status: 403 });
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

    prepareMembershipData(profiles);

    return NextResponse.json({"profiles": profiles}, { status: 200 })
}

export async function DELETE(req: NextRequest) {

     //authorization
     const session = await getServerSession();
     const user_permission = session?.user?.permission;
   
     const has_permission = user_permission && await checkPermission(['admin'], user_permission);
   
     if (!has_permission) {
         return NextResponse.json({ error: "Missing permission " }, { status: 403 });
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

    prepareMembershipData(profiles);

    return NextResponse.json({"profiles": profiles}, { status: 200 })
}



function prepareMembershipData(profiles) {
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
        if (profile.department_memberships && Array.isArray(profile.department_memberships)) {
            profile.department_memberships.sort((a, b) => {
                if (a.membership_end === b.membership_end) {
                    return b.membership_start.getTime() - a.membership_start.getTime();
                }
                return b.membership_end.getTime() - a.membership_end.getTime();
            });
        }
    });

    //assign new fields
    profiles.forEach(profile => {
        if (profile.department_memberships && profile.department_memberships?.length > 0) {
            profile['current_department'] = profile.department_memberships[0]?.department?.name;
            profile['current_department_position'] = profile.department_memberships[0]?.department_position;
        } else {
            profile['current_department'] = null;
            profile['current_department_position'] = null;
        }
    });

    return;
}