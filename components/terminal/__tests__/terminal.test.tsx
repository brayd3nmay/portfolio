import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Terminal } from '../Terminal'
import type { CommandContext } from '../types'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

const ctx: Omit<CommandContext, 'cwd'> = {
  articles: [{ slug: 'foo', title: 'Foo', date: '2026-01-01', excerpt: '', readingTime: 1, body: 'body' }],
  books: [{ title: 'Bk', author: 'A', cover: '/x.jpg', rating: 5, finishedAt: '2025-01' }],
}

describe('Terminal', () => {
  it('runs initialCommand on mount', async () => {
    render(<Terminal ctx={ctx} initialCommand="help" />)
    // help output includes a line containing "skills" — match a command from help listing
    expect(await screen.findByText(/skills\s+tech stack/)).toBeInTheDocument()
  })

  it('arrow up recalls last command', async () => {
    const user = userEvent.setup()
    render(<Terminal ctx={ctx} />)
    const input = screen.getByLabelText('terminal input') as HTMLInputElement
    await user.type(input, 'help{Enter}')
    await user.keyboard('{ArrowUp}')
    expect(input.value).toBe('help')
  })

  it('Tab completes a single match', async () => {
    const user = userEvent.setup()
    render(<Terminal ctx={ctx} />)
    const input = screen.getByLabelText('terminal input') as HTMLInputElement
    await user.type(input, 'abo')
    await user.keyboard('{Tab}')
    expect(input.value).toBe('about')
  })

  it('shows fallback banner after 8s idle', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    try {
      render(<Terminal ctx={ctx} />)
      act(() => { vi.advanceTimersByTime(8001) })
      expect(screen.getByText(/not sure what to type/i)).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('unknown command triggers fallback banner immediately', async () => {
    const user = userEvent.setup()
    render(<Terminal ctx={ctx} />)
    const input = screen.getByLabelText('terminal input') as HTMLInputElement
    await user.type(input, 'banana{Enter}')
    expect(screen.getByText(/not sure what to type/i)).toBeInTheDocument()
  })
})
