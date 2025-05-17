import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Since our authentication is client-side using localStorage,
// this middleware provides basic route protection based on path
export function middleware(request: NextRequest) {
  // Get the path from the request
  const path = request.nextUrl.pathname;

  // Define public routes that don't require authentication
  const isPublicRoute = path === '/';

  // For client-side authentication, we'll let most of the auth checking happen in components
  // This middleware just provides a basic layer of route protection

  // If it's not a public route, we will still allow access and let client-side
  // code redirect if not authenticated (since we can't directly access localStorage in middleware)
  if (!isPublicRoute) {
    // Allow the request but client-side code will handle redirection
    return NextResponse.next();
  }

  // Always allow public routes
  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Routes that will trigger this middleware
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
