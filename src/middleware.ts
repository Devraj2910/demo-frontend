import { NextRequest, NextResponse } from "next/server";
import { getAuthAPI } from "./api";

// Paths that don't require authentication
const publicPaths = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  try {
    // Check if the path is public
    const path = request.nextUrl.pathname;
    const isPublicPath = publicPaths.some((publicPath) =>
      path.startsWith(publicPath)
    );

    // Get auth token from cookie
    const authToken = request.cookies.get("auth-token")?.value;

    // For now, we'll just check if the token exists
    // In a real implementation, we would validate the token with the backend
    let isValidToken = false;

    if (authToken) {
      try {
        // This is using our API service which currently has a mock implementation
        // Later this will be replaced with a real API call to validate the token
        const authAPI = getAuthAPI();
        isValidToken = await authAPI.validateToken(authToken);
      } catch (error) {
        console.error("Token validation error:", error);
      }
    }

    // If the path requires authentication and token is not valid, redirect to login
    if (!isPublicPath && !isValidToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", path);
      return NextResponse.redirect(url);
    }

    // If user is authenticated and tries to access login/register, redirect to home
    if (isValidToken && (path === "/login" || path === "/register")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If there's an error in middleware, allow request to continue but log the error
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    // All paths except public assets
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
