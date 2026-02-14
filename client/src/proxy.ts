import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register');

    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
    console.log(isProtectedRoute, "isProtectedRoute")

    // Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Redirect to dashboard if accessing auth pages with token
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/login', '/register'],
};