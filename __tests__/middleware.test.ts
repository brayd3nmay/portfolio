import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { middleware } from '../middleware'

function makeReq(url: string, { ua = '', cookie = '' } = {}) {
  const headers = new Headers()
  if (ua) headers.set('user-agent', ua)
  if (cookie) headers.set('cookie', cookie)
  return new NextRequest(url, { headers })
}

describe('middleware', () => {
  it('redirects mobile UA at / to /gui', () => {
    const res = middleware(makeReq('http://localhost/', { ua: 'iPhone' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/gui')
  })

  it('does not redirect desktop UA at /', () => {
    const res = middleware(makeReq('http://localhost/', { ua: 'Mozilla/5.0 (Macintosh)' }))
    expect(res.headers.get('location')).toBeNull()
  })

  it('honors cookie over UA', () => {
    const res = middleware(makeReq('http://localhost/', {
      ua: 'iPhone',
      cookie: 'portfolio_mode=terminal',
    }))
    expect(res.headers.get('location')).toBeNull()
  })
})
