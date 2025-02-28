import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/chatbot",
  "/watchlist",
  "/settings",
  "/launch",
  "/bets",
];

export function middleware(request: NextRequest) {
  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If it's not a protected route, allow the request to proceed
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // For client-side auth, we need to check cookies instead of localStorage
  // This is a simple implementation - in a real app, you'd verify a JWT token
  const isAuthenticated =
    request.cookies.get("isAuthenticated")?.value === "true";

  // If not authenticated and trying to access a protected route, redirect to login
  if (!isAuthenticated) {
    const redirectUrl = new URL("/signin", request.url);
    // Add the original URL as a redirect parameter
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/chatbot/:path*",
    "/watchlist/:path*",
    "/settings/:path*",
    "/launch/:path*",
    "/bets/:path*",
  ],
};
