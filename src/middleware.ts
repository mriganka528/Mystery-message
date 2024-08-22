import { NextRequest, NextResponse } from 'next/server';
export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/sign-in',
        '/sign-up',
        '/verify/:path*'
    ],
};

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("next-auth.session-token")?.value;
    const url = request.nextUrl;
    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')
        )
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));

    }

    return NextResponse.next();
}