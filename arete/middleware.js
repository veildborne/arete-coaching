import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Catch auth code on ANY page and redirect to callback
  const code = request.nextUrl.searchParams.get('code')
  if (code && !pathname.startsWith('/auth/callback')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/callback'
    url.searchParams.set('code', code)
    return NextResponse.redirect(url)
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes: redirect to login if not authenticated
  if (!user && (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/client')
  )) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If logged in and tries to access /login or / — redirect to panel
  if (user && (pathname === '/login' || pathname === '/')) {
    // Don't redirect / if it's the landing page with modal
    // Only redirect /login
    if (pathname === '/login') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const url = request.nextUrl.clone()
      url.pathname = profile?.role === 'coach' ? '/dashboard' : '/client'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/client/:path*',
    '/login',
    '/auth/callback',
  ],
}