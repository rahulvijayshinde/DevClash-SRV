import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  await supabase.auth.getSession()

  return res
}

// Specify which routes should be protected by the middleware
export const config = {
  matcher: [
    // Protect all routes under /dashboard
    '/dashboard/:path*',
    // Protect specific routes
    '/profile',
    '/settings',
    // Add more protected routes as needed
  ]
} 