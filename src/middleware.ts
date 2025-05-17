import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware for handling authentication and route protection
export function middleware(request: NextRequest) {
  // Get the path from the request
  const path = request.nextUrl.pathname;

  // Define protected routes that require authentication
  const protectedRoutes = ['/kudowall', '/analytics', '/admin', '/reports', '/profile'];

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`));

  // Get auth token from cookies (cookies are accessible in middleware)
  const authToken = request.cookies.get('auth_token')?.value;

  // If it's a protected route and there's no token, redirect to home page
  if (isProtectedRoute && !authToken) {
    console.log(`Unauthorized access attempt to ${path}, redirecting to home`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Routes that will trigger this middleware
    // Exclude static files, API routes, images, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
