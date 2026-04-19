import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { detectModeFromRequest, MODE_COOKIE } from '@/lib/mode'

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== '/') return NextResponse.next()
  const cookie = req.cookies.get(MODE_COOKIE)?.value ?? null
  const ua = req.headers.get('user-agent') ?? ''
  const mode = detectModeFromRequest({ cookie, ua })
  if (mode === 'gui') {
    const url = req.nextUrl.clone()
    url.pathname = '/gui'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/'] }
