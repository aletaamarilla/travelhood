import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..');
const VERCEL_JSON = resolve(ROOT, 'vercel.json');
const OUTPUT_CONFIG = resolve(ROOT, '.vercel/output/config.json');

function paramToRegex(source) {
  let paramIndex = 0;
  const regex = source
    .replace(/:(\w+)\*/g, () => { paramIndex++; return '(.*)'; })
    .replace(/:(\w+)/g, () => { paramIndex++; return '([^/]+)'; })
    .replace(/\//g, '\\/');
  return { regex: `^${regex}$`, paramCount: paramIndex };
}

function paramToReplacement(destination, paramNames) {
  let idx = 0;
  return destination
    .replace(/:(\w+)\*/g, () => { idx++; return `$${idx}`; })
    .replace(/:(\w+)/g, () => { idx++; return `$${idx}`; });
}

function convertRedirect(redirect) {
  const { regex } = paramToRegex(redirect.source);
  const dest = paramToReplacement(redirect.destination);
  const status = redirect.permanent ? 301 : 307;

  return {
    src: regex,
    headers: { Location: dest },
    status,
  };
}

function convertHeader(header) {
  const src = header.source.replace(/\(\.?\*\)/g, '(.*)').replace(/\//g, '\\/');
  const headers = {};
  for (const h of header.headers) {
    headers[h.key.toLowerCase()] = h.value;
  }
  return { src: `^${src}$`, headers, continue: true };
}

const vercelJson = JSON.parse(readFileSync(VERCEL_JSON, 'utf-8'));
const outputConfig = JSON.parse(readFileSync(OUTPUT_CONFIG, 'utf-8'));

const redirectRoutes = (vercelJson.redirects || []).map(convertRedirect);
const headerRoutes = (vercelJson.headers || [])
  .filter(h => !h.source.includes('_astro'))
  .map(convertHeader);

const fsIndex = outputConfig.routes.findIndex(r => r.handle === 'filesystem');

if (fsIndex === -1) {
  console.error('Could not find "handle: filesystem" in config.json');
  process.exit(1);
}

const before = outputConfig.routes.slice(0, fsIndex);
const after = outputConfig.routes.slice(fsIndex);

outputConfig.routes = [
  ...redirectRoutes,
  ...before,
  ...headerRoutes,
  ...after,
];

writeFileSync(OUTPUT_CONFIG, JSON.stringify(outputConfig, null, 2));

console.log(`Injected ${redirectRoutes.length} redirects and ${headerRoutes.length} header rules into config.json`);
