// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

function checkMainPaths(pathname: string) {
  return pathname.startsWith('/api') ||
    pathname.startsWith('/opportunities') ||
    pathname.startsWith('/api/review') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/members');
    //TODO: add more paths to be blocked if necessary : componenets, etc?
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log('middleware: ', pathname);
  // Allow unrestricted access to /api/auth paths for login purposes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Check if the request is for the other API routes
  if (checkMainPaths(pathname)) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    console.log('token: ', token);
    if (!token) {
      const loginUrl = new URL('/auth', request.url);
      return NextResponse.redirect(loginUrl);
    }
  } 

  // Proceed with the request if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/opportunities/:path*', '/review/:path*', '/profile/:path*', '/members/:path*'],
};