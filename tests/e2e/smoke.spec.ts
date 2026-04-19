import { test, expect } from '@playwright/test'

test('desktop: terminal renders, help works, ?cmd= auto-runs', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop-only')
  await page.context().clearCookies()
  await page.goto('/')
  await expect(page.getByText('type help to get started')).toBeVisible()

  await page.getByLabel('terminal input').fill('help')
  await page.keyboard.press('Enter')
  await expect(page.getByText(/\babout\b/)).toBeVisible()

  await page.goto('/?cmd=about')
  await expect(page.getByText(/Brayden May/)).toBeVisible()
})

test('mobile: root redirects to /gui', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'mobile-only')
  await page.context().clearCookies()
  await page.goto('/')
  await expect(page).toHaveURL(/\/gui$/)
})

test('gui: writing index renders', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop-only')
  await page.goto('/gui/writing')
  await expect(page.locator('h1')).toContainText('Writing')
})
