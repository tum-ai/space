// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import { getSession } from "next-auth/react"; // Adjust the import path as necessary
import { checkPermission } from "@lib/auth/checkUserPermission"; // Adjust the import path as necessary

function checkMainPaths(pathname: string) {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/opportunities") ||
    pathname.startsWith("/review") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/members")
  );
  //TODO: add more paths to be blocked if necessary : componenets, etc?
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Allow unrestricted access to /api/auth paths for login purposes
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  // Check if the request is for the other API routes
  if (checkMainPaths(pathname)) {
    const session = await getSession();
    if (!session) {
      console.log("pathname", pathname);
      const loginUrl = new URL("/auth", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Proceed with the request if authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/opportunities/:path*",
    "/review/:path*",
    "/profile/:path*",
    "/members/:path*",
  ],
};

export async function authMiddleware(req, requiredRoles) {
  const session = await getSession();
  const authUserId = session?.user?.id;

  if (!authUserId) {
    return NextResponse.json(
      { error: "You need to be logged in to view this page" },
      { status: 401 },
    );
  }

  const permissionGranted = await checkPermission(requiredRoles, authUserId);

  if (!permissionGranted) {
    return NextResponse.json(
      { error: "You don't have permission to view this page" },
      { status: 403 },
    );
  }

  return null; // Returning null indicates that no error response is needed
}
