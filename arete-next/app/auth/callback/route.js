import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || ''

  if (code) {
    // Next.js 14 — cookies() is SYNCHRONOUS, no await
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {}
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Tylko odczyt roli — nie tworzymy profilu tutaj (trigger w bazie to robi)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        // Bezpieczny next — tylko lokalne ścieżki zaczynające się od /
        if (next && next.startsWith('/') && !next.startsWith('//')) {
          return NextResponse.redirect(new URL(next, requestUrl.origin))
        }

        const redirectPath = profile?.role === 'coach' ? '/dashboard' : '/client'
        return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
      }
    }
  }

  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}