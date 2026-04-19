import { test, expect } from '@playwright/test'

test('desktop: terminal renders, help works, ?cmd= auto-runs', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop-only')
  await page.context().clearCookies()
  await page.goto('/')
  await expect(page.getByText('type help to get started')).toBeVisible()

  await page.getByLabel('terminal input').fill('help')
  await page.keyboard.press('Enter')
  await expect(page.getByText(/\babout\b/)).toBeVisible()

  await page.goto('/?cmd=writing')
  await expect(page.getByText(/Hello, world/)).toBeVisible()
})

test('mobile: root redirects to /gui', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'mobile-only')
  await page.context().clearCookies()
  await page.goto('/')
  await expect(page).toHaveURL(/\/gui$/)
})

test('gui: article page renders with reading time', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop-only')
  await page.goto('/gui/writing/hello-world')
  await expect(page.locator('h1')).toContainText('Hello, world')
  await expect(page.getByText(/min read/)).toBeVisible()
})
