import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdir, writeFile, readFile } from 'node:fs/promises'

// Requires Playwright supplied by the operator; no production collector is contacted.
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')
const base = process.env.ANALYTICS_TEST_URL || 'http://127.0.0.1:4325'
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Run only against a local server')
const dir = 'docs/analytics/evidence'
await mkdir(dir, { recursive: true })
const headersConfig = JSON.parse(await readFile('vercel.json', 'utf8')).headers[0].headers
const securityHeaders = Object.fromEntries(headersConfig.map(({ key, value }) => [key, value]))
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] })
const results = []
const consent = (analytics, marketing) => ({ necessary: true, analytics, marketing })
const events = (page) => page.evaluate(() => Array.isArray(window.dataLayer) ? window.dataLayer.filter((e) => e && e.th_event) : [])

async function session(viewport, choice, path = '/viajes-privados/?utm_campaign=qa-marker%40invalid.test&email=qa-marker%40invalid.test', brokenInit = false, bookingFixture = false) {
  const context = await browser.newContext({ viewport, serviceWorkers: 'block' })
  if (choice) await context.addCookies([{ name: 'th_cookie_consent', value: encodeURIComponent(JSON.stringify(choice)), url: base }])
  const requests = []
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin === new URL(base).origin) {
      if (route.request().resourceType() !== 'document') return route.continue()
      const response = await route.fetch()
      let body = await response.text();
      if (bookingFixture && url.pathname === '/destino/japon/') {
        // Explicit LOCAL FIXTURE: inject a synthetic provider URL into Astro props.
        // No production content changes, and the external navigation is prevented.
        body = body.replace(/<astro-island\b[^>]*>/g, (tag) => {
          if (!tag.includes('TripDetailPage')) return tag;
          const attr = tag.match(/props="([^"]*)"/);
          assert.ok(attr, 'Trip detail props must exist');
          const raw = attr[1].replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
          const props = JSON.parse(raw);
          for (const key of ['trips', 'allTrips']) for (const trip of props[key][1]) trip[1].bookingUrl = [0, 'https://reservas.travelhood.es/qa-analytics-fixture-no-booking'];
          const encoded = JSON.stringify(props).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
          return tag.replace(attr[0], `props="${encoded}"`);
        });
      }
      return route.fulfill({ response, body, headers: { ...response.headers(), ...securityHeaders } })
    }
    requests.push(url.origin + url.pathname)
    if (url.hostname === 'www.googletagmanager.com') return route.fulfill({ contentType: 'application/javascript', body: '/* Deliberate shared GTM canary, not Meta or GA SDK. */ window.__thSharedContainerCanary = (window.__thSharedContainerCanary || 0) + 1;'  })
    return route.abort()
  })
  if (brokenInit) await context.addInitScript(() => {
    window.dataLayer = [];
    window.dataLayer.push = () => { throw Error('Blocked tracker during initialization') };
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(base + path)
  await page.waitForFunction(() => document.querySelector('astro-island[component-url]:not([ssr])'))
  await page.waitForTimeout(400)
  await page.evaluate(() => document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a')
    if (a && new URL(a.href).origin !== location.origin) e.preventDefault()
  }, true))
  return { context, page, requests, errors }
}

try {
  for (const viewport of [{ width: 375, height: 812 }, { width: 1440, height: 1000 }]) {
    for (const [name, choice] of [['absent', null], ['rejected', consent(false, false)], ['analytics_only', consent(true, false)], ['marketing_only', consent(false, true)], ['all', consent(true, true)]]) {
      const { context, page, requests, errors } = await session(viewport, choice)
      if (!choice) await page.getByRole('button', { name: 'Solo necesarias' }).click()
      await page.locator('[data-private-trip-whatsapp]:visible').first().click()
      const emitted = await events(page)
      assert.equal(emitted.filter((e) => e.event === 'private_trip_whatsapp_click').length, choice?.analytics ? 1 : 0)
      assert.equal(emitted.filter((e) => e.event === 'private_trip_landing_view').length, choice?.analytics ? 1 : 0)
      assert.equal(emitted.filter((e) => e.event === 'th_page_view').length, choice?.analytics ? 1 : 0)
      assert.equal(requests.filter((u) => u.includes('/gtm.js')).length, 1)
      assert.equal(await page.evaluate(() => window.__thSharedContainerCanary), 1)
      assert.ok(!JSON.stringify(emitted).includes('qa-marker'))
      assert.ok(emitted.every((e) => e.th_event.parameters.traffic_type === 'developer' && e.th_event.parameters.debug_mode === true))
      assert.ok(!requests.some((u) => /tiktok|facebook|doubleclick|google-analytics/.test(u)))
      assert.deepEqual(errors, [])
      results.push({ viewport, scenario: name, result: 'passed', events: emitted, gtmStubRequests: requests.filter((u) => u.includes('/gtm.js')).length })
      await context.close()
    }
    // Exercise the actual preferences UI: grant, repeat, withdraw and regrant.
    const { context, page, errors } = await session(viewport, null)
    await page.getByRole('button', { name: 'Personalizar' }).click()
    await page.locator('input[type="checkbox"]').nth(1).check()
    await page.locator('input[type="checkbox"]').nth(2).check()
    await page.getByRole('button', { name: /Guardar/ }).click()
    await page.waitForFunction(() => (window.dataLayer || []).some((e) => e.event === 'th_page_view'))
    await page.locator('[data-private-trip-whatsapp]:visible').first().click()
    await page.locator('#manage-cookies-btn').click()
    await page.getByRole('button', { name: /Guardar/ }).click()
    assert.equal((await events(page)).filter((e) => e.event === 'th_page_view').length, 1)
    assert.equal((await events(page)).filter((e) => e.event === 'private_trip_whatsapp_click').length, 1)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: `${dir}/private-${viewport.width}.png`, fullPage: false })
    await context.addCookies([{ name: '_ga', value: 'synthetic-test', url: base }, { name: '_fbp', value: 'qa-meta-owned', url: base }, { name: '_fbc', value: 'qa-meta-owned', url: base }])
    await page.locator('#manage-cookies-btn').click()
    await page.locator('input[type="checkbox"]').nth(1).uncheck()
    await page.getByRole('button', { name: /Guardar/ }).click()
    assert.ok(!(await context.cookies()).some((c) => c.name === '_ga'), JSON.stringify(await context.cookies()))
    for (const name of ['_fbp', '_fbc']) assert.equal((await context.cookies()).find((c) => c.name === name)?.value, 'qa-meta-owned')
    await page.waitForTimeout(300)
    const withdrawnCount = (await events(page)).length
    await page.locator('[data-private-trip-whatsapp]:visible').first().click()
    assert.equal((await events(page)).length, withdrawnCount)
    assert.equal(await page.evaluate(() => window.__thSharedContainerCanary), 1)
    await page.locator('#manage-cookies-btn').click()
    await page.locator('input[type="checkbox"]').nth(1).check()
    await page.getByRole('button', { name: /Guardar/ }).click()
    await page.waitForFunction(() => (window.dataLayer || []).some((e) => e.event === 'th_page_view'))
    assert.equal((await events(page)).filter((e) => e.event === 'th_page_view').length, 1)
    assert.deepEqual(errors, [])
    results.push({ viewport, scenario: 'preferences_grant_repeat_withdraw_regrant', result: 'passed' })
    // A throwing tracker must leave the contact link and its navigation intact.
    await page.evaluate(() => { window.dataLayer.push = () => { throw Error('Blocked tracker') } })
    await page.locator('[data-private-trip-whatsapp]:visible').first().click()
    assert.ok(await page.locator('[data-private-trip-whatsapp]:visible').first().getAttribute('href'))
    assert.deepEqual(errors, [])
    results.push({ viewport, scenario: 'tracker_failure_contact_link_preserved', result: 'passed' })
    await context.close()

    const broken = await session(viewport, null, '/viajes-privados/', true);
    await broken.page.getByRole('button', { name: 'Aceptar todas' }).click();
    await broken.page.locator('[data-private-trip-whatsapp]:visible').first().click();
    assert.deepEqual(broken.errors, []);
    results.push({ viewport, scenario: 'tracker_failure_before_module_import_hydration', result: 'passed' });
    await broken.context.close();

    // Real search navigation: save the previous document's emitted events at unload.
    const search = await session(viewport, consent(true, false), '/');
    await search.page.evaluate(() => window.addEventListener('beforeunload', () => sessionStorage.setItem('qa_search_events', JSON.stringify(window.dataLayer.filter((e) => e.th_event)))));
    await search.page.getByRole('form', { name: 'Buscar viajes' }).waitFor();
    await search.page.waitForFunction(() => !document.querySelector('astro-island[component-export="default"][component-url*="SearchIsland"][ssr]'));
    await search.page.getByRole('form', { name: 'Buscar viajes' }).locator('button[type="submit"]').click();
    await search.page.waitForURL('**/viajes/**');
    const searchEvents = await search.page.evaluate(() => JSON.parse(sessionStorage.getItem('qa_search_events') || '[]'));
    assert.equal(searchEvents.filter((e) => e.event === 'home_search_submitted').length, 1);
    assert.equal(searchEvents.filter((e) => e.event === 'search_results_navigation').length, 1);
    assert.equal(searchEvents.find((e) => e.event === 'home_search_submitted').source, 'home_hero');
    assert.deepEqual(search.errors, []);
    results.push({ viewport, scenario: 'home_search_actual_navigation', result: 'passed', events: searchEvents });
    await search.context.close();

    for (const [path, event, selector] of [
      ['/presupuesto/japon/', 'destination_whatsapp_click', 'a[href*="wa.me"]:visible'],
      ['/cuando-viajar-a/japon/', 'destination_whatsapp_click', 'a[href*="wa.me"]:visible'],
      ['/coordinador/', 'coordinator_cta_click', '[data-coordinator-action="whatsapp"]:visible'],
    ]) {
      const support = await session(viewport, consent(true, false), path);
      await support.page.locator(selector).first().click();
      const supportEvents = await events(support.page);
      assert.equal(supportEvents.filter((e) => e.event === event).length, 1);
      assert.equal(supportEvents.filter((e) => e.event === 'th_page_view').length, 1);
      assert.deepEqual(support.errors, []);
      results.push({ viewport, scenario: `supporting_route_${path}`, result: 'passed', events: supportEvents });
      await support.context.close();
    }

    // Hydrated destination and actual departures modal; external links are prevented.
    for (const bookingFixture of [false, true]) {
    const detail = await session(viewport, consent(true, false), '/destino/japon/', false, bookingFixture)
    await detail.page.waitForFunction(() => (window.dataLayer || []).some((e) => e.event === 'destination_view'))
    const buttons = detail.page.getByRole('button', { name: /Ver salidas/ })
    const count = await buttons.count()
    let clicked = false
    for (let i = 0; i < count; i++) if (await buttons.nth(i).isVisible()) { await buttons.nth(i).click(); clicked = true; break }
    assert.ok(clicked, 'A departures CTA must be available')
    assert.equal((await events(detail.page)).filter((e) => e.event === 'destination_dates_price_interaction').length, 1)
    const links = detail.page.locator('a[href^="https://reservas.travelhood.es"], a[href*="wa.me"]').filter({ hasText: /Reservar/ })
    let bookingHref = ''
    for (let i = 0; i < await links.count(); i++) if (await links.nth(i).isVisible()) { bookingHref = await links.nth(i).getAttribute('href'); await links.nth(i).click(); break }
    assert.ok(bookingHref, 'A booking CTA must remain usable')
    const emitted = await events(detail.page)
    assert.equal(emitted.filter((e) => ['destination_booking_click', 'destination_whatsapp_click'].includes(e.event)).length, 1)
    assert.equal(emitted.filter((e) => e.event === 'destination_view').length, 1)
    assert.equal(emitted.filter((e) => e.event === 'th_page_view').length, 1)
    if (!bookingFixture) await detail.page.screenshot({ path: `${dir}/destination-${viewport.width}.png`, fullPage: false })
    assert.equal(emitted.filter((e) => e.event === (bookingFixture ? 'destination_booking_click' : 'destination_whatsapp_click')).length, 1)
    assert.deepEqual(detail.errors, [])
    results.push({ viewport, scenario: bookingFixture ? 'destination_booking_MYGOQU_LOCAL_FIXTURE' : 'destination_departures_booking', result: 'passed', bookingProvider: bookingHref.includes('wa.me') ? 'whatsapp' : 'mygoqu', events: emitted })
    await detail.context.close()
    }
  }
} finally {
  await browser.close()
  await writeFile(`${dir}/browser-results.json`, JSON.stringify({ environment: 'Local static Astro QA build, Chromium with repository Vercel security headers; GTM explicitly stubbed, all other external services blocked. NOT GA4 reception evidence.', results }, null, 2) + '\n')
}
console.log(`Analytics browser: ${results.length} scenarios passed. External collection was blocked/stubbed.`)
