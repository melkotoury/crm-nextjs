import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn');
  const { pathname } = request.nextUrl;

  // Allow access to login page and API routes without authentication
  if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Redirect to login page if not logged in
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('x-logged-in', isLoggedIn ? 'true' : 'false');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - api (api routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|api).*) ',
  ],
};