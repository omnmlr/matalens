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
  page.on('console', message => {
    if (message.type() === 'error' && message.text().includes('Content Security Policy')) pageErrors.push(message.text())
  })
  page.on('request', request => { if (request.url().includes('/api/stories')) storyRequests.push([request.method(), request.url()]) })
  page.on('pageerror', error => pageErrors.push(error.message))
  const lead = 'One deadline extension. Two published dates.'
  const collection = page.waitForResponse(response => response.url() === baseURL + '/api/stories' && response.ok())
  await page.goto('/')
  await collection
  await expect(page.getByRole('heading', { name: lead })).toBeVisible()
  await expect(page.getByText('Editorial sample', { exact: true })).toHaveCount(0)
  assert.ok(await page.evaluate(async () => {
    await document.fonts.ready
    return [...document.fonts].some(face => face.family.includes('Newsreader') && face.status === 'loaded') &&
      [...document.fonts].some(face => face.family.includes('Manrope') && face.status === 'loaded')
  }))
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(screenshots, 'home-desktop-light.png'), fullPage: true, animations: 'disabled' })

  await page.getByRole('link', { name: 'See the evidence' }).click()
  const comparison = page.getByRole('region', { name: lead })
  await expect(comparison).toContainText(/2 December.*3 December/)
  await expect(comparison.getByRole('link', { name: /Read the official notice/ })).toHaveAttribute('href', /inecnigeria\.org\/press\/inec-updates-closing-date/)
  await expect(comparison.getByRole('link', { name: /Read the republished statement/ })).toHaveAttribute('href', /pressreleasenaija\.com\.ng/)
  await expect(comparison.getByRole('heading', { name: 'Still unclear' })).toBeVisible()
  await page.screenshot({ path: join(screenshots, 'evidence-desktop-light.png'), fullPage: true, animations: 'disabled' })
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Home' }).click()
  await page.getByRole('link', { name: /Find candidates and parties/ }).click()
  await expect(page.getByRole('link', { name: '2027 elections', exact: true })).toHaveAttribute('aria-current', 'page')
  await page.getByRole('link', { name: '2023 archive', exact: true }).click()
  await page.getByRole('searchbox', { name: 'Politician search' }).fill('Peter Obi')
  await expect(page.getByRole('link', { name: 'Peter Obi', exact: true })).toHaveAttribute('href', /2023-president/)
  await page.getByRole('link', { name: '2027 elections', exact: true }).click()
  await page.getByRole('searchbox', { name: 'Politician search' }).fill('Bola Ahmed Tinubu')
  await expect(page.getByRole('link', { name: 'Bola Ahmed Tinubu', exact: true })).toBeVisible()
  await page.screenshot({ path: join(screenshots, 'discover-desktop-light.png'), animations: 'disabled' })
  await page.getByRole('link', { name: 'Bola Ahmed Tinubu', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Official candidacy' })).toBeVisible()
  await page.screenshot({ path: join(screenshots, 'profile-desktop-light.png'), animations: 'disabled' })
  const watch = page.getByRole('button', { name: 'Save Bola Ahmed Tinubu to watchlist' })
  await watch.click()
  await expect(watch).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('link', { name: /The Manifesto/ })).toHaveAttribute('href', 'https://renewedhope02.com/manifesto')

  const detail = page.waitForResponse(response => response.url() === baseURL + '/api/stories/presidential-roster-2027' && response.ok())
  await page.getByRole('link', { name: 'The 2027 presidential candidate list is out' }).click()
  await detail
  const contextSection = page.getByRole('region', { name: 'Why it matters' })
  await contextSection.locator('summary', { hasText: 'Read the context' }).click()
  await expect(contextSection.getByText(/pairs a candidate for president and a running mate/)).toBeVisible()
  const original = page.getByRole('link', { name: /Final List – Presidential/ }).first()
  await expect(original).toHaveAttribute('href', /final-list-presidential\.pdf$/)
  await expect(original).toHaveAttribute('target', '_blank')
  await page.locator('summary', { hasText: 'Expand social housing and affordable mortgages' }).click()
  await expect(page.getByRole('link', { name: /Pillar 2/ })).toHaveAttribute('href', 'https://apc.com.ng/apc-2027-manifesto.pdf')
  await expect(page.getByText('October 2026', { exact: true })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Timeline' }).getByText('Scheduled', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Save story' }).click()
  await page.getByRole('radio', { name: '18', exact: true }).check()
  await page.getByRole('button', { name: 'Check answer' }).click()
  await expect(page.getByRole('status')).toContainText('That’s right.')
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({ path: join(screenshots, 'story-desktop-light.png'), fullPage: true, animations: 'disabled' })

  await page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'Civic learning' }).click()
  await page.getByRole('link', { name: 'Find your polling unit' }).click()
  await page.getByRole('radio', { name: 'The one nearest to my home' }).check()
  await page.getByRole('button', { name: 'Check answer' }).click()
  await expect(page.getByRole('status')).toContainText('Here’s the answer.')
  await expect(page.getByText('Attempted', { exact: true })).toBeVisible()
  await expect(page.getByText('Answered correctly', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('radio', { name: 'The one assigned to my registration' })).toBeFocused()
  await page.reload()
  await expect(page.getByText('Attempted', { exact: true })).toBeVisible()
  await page.getByRole('radio', { name: 'The one assigned to my registration' }).check()
  await page.getByRole('button', { name: 'Check answer' }).click()
  await expect(page.getByRole('status')).toContainText('That’s right.')

  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'My Desk' }).click()
  await expect(page.getByRole('link', { name: 'The 2027 presidential candidate list is out', exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Find your polling unit', exact: true }).locator('..')).toContainText('Answered correctly')
  await page.reload()
  await expect(page.getByRole('button', { name: 'Save Bola Ahmed Tinubu to watchlist' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('link', { name: 'Manifesto evidence' })).toHaveAttribute('href', /2027-president.*#manifestos$/)
  await expect(page.getByRole('link', { name: '2027 presidential election', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Save Bola Ahmed Tinubu to watchlist' }).click()
  await expect(page.getByText(/Save a person to return to their candidacy/)).toBeVisible()
  await page.route('**/api/stories/mock-accreditation-2026', route => route.fulfill({ status: 503 }), { times: 1 })
  await page.goto('/stories/mock-accreditation-2026')
  await expect(page.getByText('Updates are temporarily unavailable.')).toBeVisible()
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('heading', { name: 'What INEC’s mock accreditation will test' })).toBeVisible()
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller))
  await desktop.setOffline(true)
  await page.reload()
  await expect(page.getByText('You’re offline. Reconnect to get updates.')).toBeVisible()
  await desktop.setOffline(false)
  await expect(page.getByRole('heading', { name: 'What INEC’s mock accreditation will test' })).toBeVisible()
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
      await view.getByRole('link', { name: /Find candidates and parties/ }).click()
      await expect(view.getByRole('heading', { name: 'Find candidates and parties' })).toBeVisible()
      assert.ok(await view.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      await view.screenshot({ path: join(screenshots, 'discover-mobile-dark.png'), animations: 'disabled' })
      await view.getByRole('searchbox', { name: 'Politician search' }).fill('Bola Ahmed Tinubu')
      await view.getByRole('link', { name: 'Bola Ahmed Tinubu', exact: true }).click()
      await expect(view.getByRole('heading', { name: 'Bola Ahmed Tinubu' })).toBeVisible()
      assert.ok(await view.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      await view.screenshot({ path: join(screenshots, 'profile-mobile-dark.png'), animations: 'disabled' })
      await view.goto('/stories/inec-recruitment-deadline-2027')
      await expect(view.getByRole('heading', { name: lead })).toBeVisible()
      assert.ok(await view.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      await view.screenshot({ path: join(screenshots, 'evidence-mobile-dark.png'), fullPage: true, animations: 'disabled' })
    }
    await context.close()
  }
})
