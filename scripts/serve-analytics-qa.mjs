// Local diagnostics only. Never deploy this server or its injected controls.
import http from 'node:http'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(process.env.ANALYTICS_QA_BUILD_DIR || 'dist')
const mode = process.env.ANALYTICS_QA_MODE || 'stub'
if (!['stub', 'real'].includes(mode)) throw Error('ANALYTICS_QA_MODE must be stub or real')
const port = Number(process.env.ANALYTICS_QA_PORT || 4327)
const previewQuery = process.env.ANALYTICS_QA_PREVIEW_QUERY || ''
if (previewQuery && (mode !== 'real' || !/^&gtm_auth=[a-zA-Z0-9_-]+&gtm_preview=env-[0-9]+&gtm_cookies_win=x$/.test(previewQuery))) throw Error('Invalid real-only GTM preview query')
const config = JSON.parse(await readFile('vercel.json', 'utf8'))
const baseHeaders = Object.fromEntries(config.headers[0].headers.map(({ key, value }) => [key, value]))
const evidence = 'docs/analytics/evidence/shared-bootstrap-browser'
await mkdir(evidence, { recursive: true })

function diagnostics(mode) {
  const records = []
  const attempts = []
  const documentId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  let canaryLoads = 0
  let timer
  let latest
  function render() {
    const node = document.getElementById('th-qa-log')
    if (!node) return
    latest = {
      environment: mode === 'stub' ? 'Local built Astro UI, explicit GTM canary; NO Google or Meta SDK' : 'Local built Astro UI, real GTM/Google SDK; transport attempts do NOT prove GA4 receipt',
      documentId, route: location.pathname, scenario: new URL(location.href).searchParams.get('qa_scenario') || 'manual',
      viewport: { width: innerWidth, height: innerHeight },
      phase1Ready: window.__thGoogleConsent?.phase1Ready === true,
      googleDisabled: window['ga-disable-G-XQMPJG8B08'] === true,
      sharedContainerScripts: [...document.scripts].filter(s => /\/gtm\.js\?/.test(s.src)).length,
      canaryLoads, consentDefaults: records.filter(x => x.command === 'consent' && x.operation === 'default').length,
      cookiesPresent: document.cookie.split(';').map(x => x.trim().split('=')[0]).filter(x => /^(th_cookie_consent|_ga($|_)|_gid$|_gat|_fbp$|_fbc$|__TAG_ASSISTANT$)/.test(x)),
      events: records.filter(x => x.event), commands: records.filter(x => x.command), transportAttempts: attempts,
    }
    node.textContent = JSON.stringify(latest, null, 2)
    clearTimeout(timer)
    timer = setTimeout(() => fetch('/__qa/result', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(latest) }).catch(() => {}), 100)
  }
  window.dataLayer = window.dataLayer || []
  const originalPush = window.dataLayer.push
  window.dataLayer.push = function (...values) {
    for (const x of values) {
      if (x?.th_event) records.push(JSON.parse(JSON.stringify(x)))
      else if (x?.[0] === 'consent') records.push({ command: 'consent', operation: x[1], value: x[2] })
    }
    const result = originalPush.apply(this, values)
    render()
    return result
  }
  function inspect(url, body) {
    try {
      const target = new URL(typeof url === 'string' ? url : url.url, location.href)
      if (!/(^|\.)google-analytics\.com$/.test(target.hostname) || !target.pathname.endsWith('/collect')) return
      const params = new URLSearchParams(target.search)
      const bodyLines = typeof body === 'string' ? body.split('\n').filter(Boolean) : []
      const entries = bodyLines.length ? bodyLines.map(line => new URLSearchParams(line)) : [new URLSearchParams()]
      const allowed = ['tid', 'en', 'dl', 'dr', '_dbg', 'ep.measurement_version', 'ep.traffic_type', 'ep.debug_mode', 'epn.debug_mode', 'epn.measurement_version', 'epn.traffic_type', 'tt']
      attempts.push({ method: 'attempt observed before native transport', events: entries.map(entry => {
        const merged = new URLSearchParams(params)
        for (const [key, value] of entry) merged.set(key, value)
        return { keys: [...merged.keys()].sort(), ...Object.fromEntries(allowed.filter(k => merged.has(k)).map(k => [k, merged.get(k)])) }
      }) })
      render()
    } catch { /* Diagnostics must not affect the transport. */ }
  }
  const originalFetch = window.fetch
  window.fetch = function (input, init) { inspect(input, init?.body); return originalFetch.apply(this, arguments) }
  const originalBeacon = navigator.sendBeacon.bind(navigator)
  navigator.sendBeacon = function (url, body) {
    if (body instanceof Blob) body.text().then(value => inspect(url, value)).catch(() => {})
    else inspect(url, body)
    return originalBeacon(url, body)
  }
  window.addEventListener('pagehide', () => { if (latest) originalBeacon('/__qa/result', JSON.stringify(latest)) })
  window.addEventListener('th-qa-canary', () => { canaryLoads++; render() })
  window.addEventListener('cookieConsentUpdated', () => setTimeout(render, 0))
  window.addEventListener('focus', () => setTimeout(render, 0))
  window.addEventListener('storage', () => setTimeout(render, 0))
  document.addEventListener('DOMContentLoaded', () => {
    const box = document.createElement('details')
    box.id = 'th-qa'; box.open = true
    box.style.cssText = 'position:relative;z-index:9998;background:white;color:black;font:12px monospace;border:2px solid #777;padding:8px'
    const title = document.createElement('summary'); title.textContent = `QA LOCAL ${mode.toUpperCase()} — diagnóstico, no publicación`; box.append(title)
    const reset = document.createElement('button'); reset.textContent = 'QA reiniciar sin elección'
    reset.onclick = () => {
      document.cookie = 'th_cookie_consent=;Max-Age=0;path=/'
      localStorage.removeItem('th_consent_storage_blocked')
      location.reload()
    }
    box.append(reset)
    if (mode === 'stub') {
      const seed = document.createElement('button'); seed.textContent = 'QA cookies sintéticas GA y Meta'
      seed.onclick = () => { for (const key of ['_ga', '_fbp', '_fbc']) document.cookie = `${key}=qa-synthetic;path=/`; render() }
      box.append(seed)
      const broken = document.createElement('button'); broken.textContent = 'QA simular fallo dataLayer'
      broken.onclick = () => { window.dataLayer.push = () => { throw Error('QA deliberate tracker failure') } }
      box.append(broken)
    }
    const log = document.createElement('pre'); log.id = 'th-qa-log'; log.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere'; box.append(log)
    document.body.append(box)
    document.addEventListener('click', e => {
      const link = e.target.closest?.('a')
      if (link && new URL(link.href).origin !== location.origin) e.preventDefault()
    }, true)
    render()
  })
}
const diag = `<script>(${diagnostics.toString()})(${JSON.stringify(mode)})</script>`
const types = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.md': 'text/markdown' }

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost')
    if (req.method === 'POST' && url.pathname === '/__qa/result') {
      const chunks = []; let length = 0
      for await (const chunk of req) { length += chunk.length; if (length > 100000) throw Error('Too large'); chunks.push(chunk) }
      const data = JSON.parse(Buffer.concat(chunks).toString())
      const name = `${String(data.documentId).replace(/[^a-zA-Z0-9-]/g, '')}.json`
      await writeFile(path.join(evidence, name), JSON.stringify(data, null, 2) + '\n')
      res.writeHead(204); return res.end()
    }
    if (req.method !== 'GET') { res.writeHead(405); return res.end() }
    if (url.pathname === '/__qa/gtm.js' && mode === 'stub') {
      res.writeHead(200, { 'content-type': 'application/javascript' })
      return res.end("/* Explicit GTM canary: no GA/Meta SDK. */ if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>window.dispatchEvent(new Event('th-qa-canary')),{once:true});else window.dispatchEvent(new Event('th-qa-canary')); ")
    }
    if (url.pathname === '/__qa/frame' && mode === 'stub') {
      const width = url.searchParams.get('width') === '1440' ? 1440 : 375
      const route = url.searchParams.get('route') || '/viajes-privados/'
      if (!route.startsWith('/') || route.startsWith('//')) throw Error('Invalid local route')
      const target = new URL(route, 'http://localhost'); target.searchParams.set('qa_frame', '1')
      res.writeHead(200, { 'content-type': 'text/html' })
      return res.end(`<title>QA viewport ${width}</title><body style="margin:0"><h1 style="font:16px monospace;margin:0;height:24px">QA fixture ${width}px, GTM canary</h1><iframe title="Travelhood QA" src="${(target.pathname + target.search).replaceAll('&','&amp;').replaceAll('"','&quot;')}" style="width:${width}px;height:640px;border:0;display:block"></iframe>`)
    }
    let file = path.resolve(root, '.' + decodeURIComponent(url.pathname))
    if (!file.startsWith(root + path.sep) && file !== root) throw Error('Invalid path')
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html')
    let body = await readFile(file)
    const headers = { ...baseHeaders, 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' }
    for (const rule of config.headers.slice(1)) {
      if (rule.source === url.pathname || rule.source === url.pathname.replace(/\/$/, '')) {
        for (const { key, value } of rule.headers) headers[key.toLowerCase()] = value
      }
    }
    if (file.endsWith('.html')) {
      let html = body.toString().replace('<head>', '<head>' + diag)
      if (previewQuery) html = html.replace('https://www.googletagmanager.com/gtm.js?id=${config.gtmId}', 'https://www.googletagmanager.com/gtm.js?id=${config.gtmId}' + previewQuery)
      if (mode === 'stub') {
        html = html.replaceAll('https://www.googletagmanager.com/gtm.js', '/__qa/gtm.js')
        // Local fixture blocks all third-party scripts/collectors. No SDK runs.
        headers['Content-Security-Policy'] = headers['Content-Security-Policy'].replace(/script-src[^;]*;/, "script-src 'self' 'unsafe-inline';").replace(/script-src-elem[^;]*;/, "script-src-elem 'self' 'unsafe-inline';").replace(/connect-src[^;]*;/, "connect-src 'self';")
        if (url.searchParams.has('qa_frame')) {
          headers['X-Frame-Options'] = 'SAMEORIGIN'
          headers['Content-Security-Policy'] = headers['Content-Security-Policy'].replace("frame-ancestors 'none'", "frame-ancestors 'self'")
        }
      }
      body = html
    }
    res.writeHead(200, headers); res.end(body)
  } catch { res.writeHead(404); res.end('Not found') }
}).listen(port, '127.0.0.1', () => console.log(`Local analytics QA ${mode} on http://127.0.0.1:${port}; build ${root}`))
