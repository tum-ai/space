import { NextResponse } from 'next/server'
import prisma from "database/db";
import { error } from 'console';

export async function GET(request: Request, context: { params }) {
    const profiles = await prisma.user.findMany({
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            image: true,
            permission: true,
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
    });
       
    return NextResponse.json({"profiles": profiles}, { status: 200 })
}


export async function PUT(req: Request, params: { id: string }) {
    

    let payload;
    console.log(req.body);
    try {
        payload = await req.json();
    } catch (err) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }


    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "Missing id " }, { status: 400 });
    }
    const { first_name, last_name, email, permission, department_memberships } = payload;

    const data: any = {};

    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;
    if (email) data.email = email;
    if (permission) data.permission = permission;

    const profiles = await prisma.user.update({
        where: {
            id: String(id),
        },
        data: {
            first_name,
            last_name,
            email,
            permission,
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            image: true,
            permission: true,
        }
    });

    return NextResponse.json({"profiles": profiles}, { status: 200 })
}



// Path: app/app/api/profiles/[id]/route.ts