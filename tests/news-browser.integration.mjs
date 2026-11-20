import assert from 'node:assert/strict'
import { once } from 'node:events'
import { existsSync, mkdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import test from 'node:test'
import { chromium, expect } from '@playwright/test'
import { createApp } from '../server/app.mjs'
import { serveClient } from '../server/client.mjs'

test('the frontend handoff reads the real story API and personalizes on-device', async t => {
  const frontend = process.env.MATALENS_FRONTEND_DIR
  assert.ok(frontend && existsSync(join(frontend, 'dist/index.html')), 'Build the frontend with VITE_STORY_PROVIDER=api and set MATALENS_FRONTEND_DIR.')
  const screenshots = resolve(frontend, 'test-results', 'integration')
  mkdirSync(screenshots, { recursive: true })
  const originalDirectory = process.cwd()
  process.chdir(frontend)

  const { app, close } = createApp()
  serveClient(app)
  const server = app.listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(async () => {
    process.chdir(originalDirectory)
    await new Promise(resolveClose => server.close(resolveClose))
    close()
  })
  const baseURL = 'http://127.0.0.1:' + server.address().port
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
  })
  t.after(() => browser.close())

  const desktop = await browser.newContext({ baseURL, viewport: { width: 1440, height: 1000 }, colorScheme: 'light' })
  const page = await desktop.newPage()
  const storyRequests = []
  const pageErrors = []
  page.on('request', request => { if (request.url().includes('/api/stories')) storyRequests.push([request.method(), request.url()]) })
  page.on('pageerror', error => pageErrors.push(error.message))
  const lead = 'INEC extends the election staff application deadline'
  const collection = page.waitForResponse(response => response.url() === baseURL + '/api/stories' && response.ok())
  await page.goto('/')
  await collection
  await expect(page.getByRole('heading', { name: lead })).toBeVisible()
  await expect(page.getByText('Editorial sample', { exact: true })).toHaveCount(0)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(screenshots, 'home-desktop-light.png'), fullPage: true, animations: 'disabled' })

  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Discover' }).click()
  await page.getByRole('searchbox', { name: 'Politician search' }).fill('Bola Ahmed Tinubu')
  await page.getByRole('link', { name: 'Bola Ahmed Tinubu', exact: true }).click()
  const follow = page.getByRole('button', { name: 'Follow Bola Ahmed Tinubu' })
  await follow.click()
  await expect(follow).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('link', { name: /The Manifesto/ })).toHaveAttribute('href', 'https://renewedhope02.com/manifesto')

  await page.getByRole('link', { name: 'Home', exact: true }).click()
  const following = page.getByRole('region', { name: 'Your following' })
  const detail = page.waitForResponse(response => response.url() === baseURL + '/api/stories/presidential-roster-2027' && response.ok())
  await following.getByRole('link', { name: 'The 2027 presidential candidate list is out' }).click()
  await detail
  const contextSection = page.getByRole('region', { name: 'Why it matters' })
  await contextSection.locator('summary', { hasText: 'Read the context' }).click()
  await expect(contextSection.getByText(/pairs a candidate for president and a running mate/)).toBeVisible()
  const original = page.getByRole('link', { name: /Final List – Presidential/ }).first()
  await expect(original).toHaveAttribute('href', /final-list-presidential\.pdf$/)
  await expect(original).toHaveAttribute('target', '_blank')
  await page.getByRole('button', { name: 'Save story' }).click()
  await page.getByRole('radio', { name: '18', exact: true }).check()
  await page.getByRole('button', { name: 'Check answer' }).click()
  await expect(page.getByRole('status')).toContainText('That’s right.')
  await page.screenshot({ path: join(screenshots, 'story-desktop-light.png'), fullPage: true, animations: 'disabled' })

  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Learn' }).click()
  await page.getByRole('link', { name: 'Find your polling unit' }).click()
  await page.getByRole('radio', { name: 'The one assigned to my registration' }).check()
  await page.getByRole('button', { name: 'Check answer' }).click()
  await expect(page.getByRole('status')).toContainText('That’s right.')
  await page.getByRole('link', { name: 'Return to your briefing' }).click()
  await expect(following.getByRole('link', { name: 'The 2027 presidential candidate list is out' })).toBeVisible()
  await page.reload()
  await expect(following.getByRole('button', { name: 'Follow Bola Ahmed Tinubu' })).toHaveAttribute('aria-pressed', 'true')

  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'My Desk' }).click()
  await expect(page.getByRole('link', { name: 'The 2027 presidential candidate list is out', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Find your polling unit', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Follow Bola Ahmed Tinubu' }).click()
  await expect(page.getByText(/Follow politicians to see relevant updates here/)).toBeVisible()
  assert.deepEqual(pageErrors, [])
  assert.ok(storyRequests.length > 0)
  assert.ok(storyRequests.every(([method, url]) => method === 'GET' && !new URL(url).search))
  await desktop.close()

  for (const [label, viewport, colorScheme] of [
    ['desktop-dark', { width: 1440, height: 1000 }, 'dark'],
    ['mobile-light', { width: 390, height: 844 }, 'light'],
    ['mobile-dark', { width: 390, height: 844 }, 'dark'],
  ]) {
    const context = await browser.newContext({ baseURL, viewport, colorScheme, isMobile: label.startsWith('mobile'), deviceScaleFactor: 1, hasTouch: label.startsWith('mobile') })
    const view = await context.newPage()
    await view.goto('/')
    await expect(view.getByRole('heading', { name: lead })).toBeVisible()
    await expect(view.locator('html')).toHaveAttribute('data-theme', colorScheme)
    assert.ok(await view.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
    await view.evaluate(() => document.fonts.ready)
    await view.screenshot({ path: join(screenshots, 'home-' + label + '.png'), fullPage: true, animations: 'disabled' })
    if (label === 'mobile-dark') {
      await view.goto('/stories/presidential-roster-2027')
      await expect(view.getByRole('heading', { name: 'The 2027 presidential candidate list is out' })).toBeVisible()
      assert.ok(await view.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      await view.screenshot({ path: join(screenshots, 'story-mobile-dark.png'), fullPage: true, animations: 'disabled' })
    }
    await context.close()
  }
})
