import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const WIDTH = 1200;
const HEIGHT = 630;
const BG_COLOR = '#0B2E3A';
const ACCENT_COLOR = '#0E94B0';

const logoSvgRaw = readFileSync(resolve('public/images/logo.svg'), 'utf-8');

const logoWhite = logoSvgRaw.replace(/fill="#0f3648"/g, 'fill="#FFFFFF"');

const logoHeight = 280;
const logoWidth = Math.round(logoHeight * (573 / 377));

const logoPng = await sharp(Buffer.from(logoWhite))
  .resize(logoWidth, logoHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const accentLineWidth = 100;
const accentLineSvg = `<svg width="${accentLineWidth}" height="3" xmlns="http://www.w3.org/2000/svg">
  <rect width="${accentLineWidth}" height="3" fill="${ACCENT_COLOR}" rx="1.5"/>
</svg>`;

const taglineSvg = `<svg width="600" height="40" xmlns="http://www.w3.org/2000/svg">
  <text x="300" y="28" text-anchor="middle" 
    font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="400"
    fill="rgba(255,255,255,0.75)" letter-spacing="1">
    Viajes en grupo · 20-35 años
  </text>
</svg>`;

const domainSvg = `<svg width="200" height="30" xmlns="http://www.w3.org/2000/svg">
  <text x="190" y="20" text-anchor="end"
    font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="400"
    fill="rgba(255,255,255,0.45)">
    travelhood.es
  </text>
</svg>`;

const logoTop = 100;
const accentTop = logoTop + logoHeight + 30;
const taglineTop = accentTop + 20;

const image = await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: BG_COLOR,
  },
})
  .composite([
    {
      input: logoPng,
      top: logoTop,
      left: Math.round((WIDTH - logoWidth) / 2),
    },
    {
      input: Buffer.from(accentLineSvg),
      top: accentTop,
      left: Math.round((WIDTH - accentLineWidth) / 2),
    },
    {
      input: Buffer.from(taglineSvg),
      top: taglineTop,
      left: Math.round((WIDTH - 600) / 2),
    },
    {
      input: Buffer.from(domainSvg),
      top: HEIGHT - 45,
      left: WIDTH - 210,
    },
  ])
  .jpeg({ quality: 90 })
  .toFile(resolve('public/images/og-default.jpg'));

console.log('OG image generated: public/images/og-default.jpg');

const info = await sharp(resolve('public/images/og-default.jpg')).metadata();
console.log(`Dimensions: ${info.width}x${info.height}, Size: ${(info.size / 1024).toFixed(1)} KB`);
