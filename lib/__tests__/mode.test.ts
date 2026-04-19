import { describe, it, expect } from 'vitest'
import { detectModeFromRequest, MOBILE_UA_REGEX } from '../mode'

describe('detectModeFromRequest', () => {
  it('returns cookie value when set', () => {
    expect(detectModeFromRequest({ cookie: 'terminal', ua: 'iPhone' })).toBe('terminal')
    expect(detectModeFromRequest({ cookie: 'gui', ua: 'Mozilla' })).toBe('gui')
  })

  it('defaults to gui for mobile UA when no cookie', () => {
    expect(detectModeFromRequest({ cookie: null, ua: 'iPhone' })).toBe('gui')
    expect(detectModeFromRequest({ cookie: null, ua: 'Android' })).toBe('gui')
  })

  it('defaults to terminal for desktop UA when no cookie', () => {
    expect(detectModeFromRequest({ cookie: null, ua: 'Mozilla/5.0 (Macintosh)' })).toBe('terminal')
  })

  it('mobile UA regex matches phones not desktops', () => {
    expect(MOBILE_UA_REGEX.test('iPhone')).toBe(true)
    expect(MOBILE_UA_REGEX.test('Android')).toBe(true)
    expect(MOBILE_UA_REGEX.test('Mozilla/5.0 (Macintosh)')).toBe(false)
  })
})
