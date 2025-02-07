/**
 * @copyright (c) 2024 - Present
 * @author github.com/shubhhhwarrior
 * @license MIT
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const session = req.nextauth.token;

    if (path.startsWith('/admin')) {
      if (!session?.email || session.email !== 'admin@humourshub.com') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.email === 'admin@humourshub.com';
        }
        return !!token;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard',
    '/profile',
    '/admin',
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
  ],
}; 