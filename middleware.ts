import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PROTECTED_PREFIXES = ['/forum', '/materials', '/engineers', '/admin']
const PUBLIC_EXACT = ['/', '/login', '/verify-email']
const PUBLIC_ROUTE_PREFIXES = ['/auth/callback']
const PUBLIC_PREFIXES = ['/events']

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const normalizeToken = (value: string) => {
  const decoded = decodeURIComponent(value)

  if (!decoded) return null

  try {
    const parsed = JSON.parse(decoded) as unknown

    if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
      return parsed[0]
    }

    if (
      parsed &&
      typeof parsed === 'object' &&
      'access_token' in parsed &&
      typeof parsed.access_token === 'string'
    ) {
      return parsed.access_token
    }
  } catch {
    return decoded
  }

  return null
}

const getAccessTokenFromCookies = (request: NextRequest) => {
  const cookies = request.cookies.getAll()

  for (const cookie of cookies) {
    if (
      cookie.name.endsWith('-auth-token') ||
      cookie.name.endsWith('-access-token')
    ) {
      const token = normalizeToken(cookie.value)
      if (token) return token
    }
  }

  return null
}

const isPublicPath = (pathname: string) => {
  if (PUBLIC_EXACT.includes(pathname)) return true
  if (PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

const isProtectedPath = (pathname: string) =>
  PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname) || !isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next()
  }

  const token = getAccessTokenFromCookies(request)

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      loginUrl.searchParams.set('reason', 'expired')
      return NextResponse.redirect(loginUrl)
    }

    if (!data.user.email_confirmed_at) {
      const verifyUrl = new URL('/verify-email', request.url)
      if (data.user.email) {
        verifyUrl.searchParams.set('email', data.user.email)
      }
      return NextResponse.redirect(verifyUrl)
    }

    return NextResponse.next()
  } catch {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    loginUrl.searchParams.set('reason', 'expired')
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: ['/forum/:path*', '/materials/:path*', '/engineers/:path*', '/admin/:path*'],
}
