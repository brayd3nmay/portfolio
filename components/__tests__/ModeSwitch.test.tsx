import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModeSwitch } from '../ModeSwitch'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('ModeSwitch', () => {
  beforeEach(() => {
    document.cookie = 'portfolio_mode=; path=/; max-age=0'
  })

  it('writes cookie when clicked', async () => {
    render(<ModeSwitch to="gui" />)
    await userEvent.click(screen.getByRole('link'))
    expect(document.cookie).toContain('portfolio_mode=gui')
  })

  it('renders correct label for terminal target', () => {
    render(<ModeSwitch to="terminal" />)
    expect(screen.getByRole('link')).toHaveTextContent('switch to terminal')
  })
})
