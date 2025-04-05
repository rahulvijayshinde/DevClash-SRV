import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Simply allow all requests to pass through
  return NextResponse.next()
}

// Keep the matcher config for reference, but it won't block access
export const config = {
  matcher: [
    '/settings/:path*',
    '/medications/:path*',
    '/consultations/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
    '/reset-password'
  ]
}