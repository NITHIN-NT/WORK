import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Define Public Routes (accessible without login)
  const PUBLIC_ROUTES = ['/login', '/register', '/share'];
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

  // 2. Check session status
  const session = request.cookies.get('__session_active');

  // 3. Logic: Redirect Unauthenticated to Login
  if (!isPublicRoute && !session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // 4. Logic: Redirect Authenticated away from Auth pages
  if (isPublicRoute && session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
