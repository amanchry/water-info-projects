// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // List of public routes that don't require authentication
  const publicPaths = ["/auth/login", "/auth/signup", "/auth/forgot-password", "/api", "/_next", "/favicon.ico", "/images", "/public"];
  const { pathname } = req.nextUrl;

  // Allow requests to public paths
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get the user's token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, allow the request
  return NextResponse.next();
}

// Optionally, specify which paths to run the middleware on
export const config = {
  matcher: [
    /*
      Match all request paths except for:
      - /api (API routes)
      - /_next (Next.js internals)
      - /auth/login and /auth/signup (public auth pages)
      - /favicon.ico, /images, /public (static assets)
    */
    "/((?!api|_next|auth/login|auth/signup|auth/forgot-password|favicon.ico|images|public).*)",
  ],
};
