import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware for handling authentication and route protection
export function middleware(request: NextRequest) {
  // Get the path from the request
  const path = request.nextUrl.pathname;

  // Define protected routes that require authentication
  const protectedRoutes = ['/kudowall', '/analytics', '/profile'];

  // Define admin-only routes
  const adminRoutes = ['/admin'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`));

  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some((route) => path === route || path.startsWith(`${route}/`));

  // Get auth token and user role from cookies (cookies are accessible in middleware)
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // If it's a protected route and there's no token, redirect to previous route
  if ((isProtectedRoute || isAdminRoute) && !authToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If it's an admin route and user is not an admin, redirect to previous route
  if (isAdminRoute && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/kudowall', request.url));
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
