export type Mode = 'terminal' | 'gui'
export const MODE_COOKIE = 'portfolio_mode'
export const MOBILE_UA_REGEX = /iPhone|iPad|iPod|Android|Mobile/i

export function detectModeFromRequest({
  cookie,
  ua,
}: { cookie: string | null; ua: string }): Mode {
  if (cookie === 'terminal' || cookie === 'gui') return cookie
  return MOBILE_UA_REGEX.test(ua) ? 'gui' : 'terminal'
}

export function setModeCookie(mode: Mode) {
  if (typeof document === 'undefined') return
  const oneYear = 60 * 60 * 24 * 365
  document.cookie = `${MODE_COOKIE}=${mode}; path=/; max-age=${oneYear}; SameSite=Lax`
}
