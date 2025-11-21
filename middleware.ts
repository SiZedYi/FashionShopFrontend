import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/my-account', '/my-orders', '/wishlist', '/checkout', '/cart', '/checkout'];
const dashboardRoutes = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if accessing dashboard routes (excluding login page)
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));
  const isDashboardLogin = pathname === '/login';

  if (isDashboardRoute && !isDashboardLogin) {
    // Check for admin token in cookies
    const adminToken = request.cookies.get('admin_token')?.value;

    if (!adminToken) {
      // Redirect to dashboard login if no admin token found
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Check if the current path is protected (user routes)
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // Check for auth token in cookies
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      // Redirect to sign-in if no token found
      const signInUrl = new URL('/sign-in', request.url);
      // Optional: add redirect param to return after login
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/my-account/:path*',
    '/my-orders/:path*',
    '/wishlist/:path*',
    '/checkout/:path*',
    '/cart/:path*'
  ]
};
