import { NextResponse } from 'next/server'
import prisma from "database/db";

export async function GET(request: Request, context: { params }) {
    const profiles = await prisma.user.findMany({
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
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
    });
       
    return NextResponse.json({"profiles": profiles}, { status: 200 })
}




// Path: app/app/api/profiles/[id]/route.ts