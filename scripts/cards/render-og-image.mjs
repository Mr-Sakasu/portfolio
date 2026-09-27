// Renders public/og.png, the picture link previews show for every page.
//
// It is the Tokyo skyline the profile card stands on, blown up with its pixels
// kept square, under the name of the site. Run it again when the still in
// public/scenes/profile.webp changes:
//
//   node scripts/cards/render-og-image.mjs
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

const still = await sharp('public/scenes/profile.webp')
    .resize({ width: WIDTH, height: HEIGHT, fit: 'cover', position: 'centre', kernel: 'nearest' })
    .toBuffer();

const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a0e17" stop-opacity="0.35"/>
      <stop offset="0.55" stop-color="#0a0e17" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#0a0e17" stop-opacity="0.92"/>
    </linearGradient>
    <linearGradient id="dot" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade)"/>
  <rect x="0" y="0" width="10" height="${HEIGHT}" fill="#60a5fa"/>
  <text x="72" y="438" font-family="Noto Sans, Inter, sans-serif" font-weight="700" font-size="84" fill="#f8fafc" letter-spacing="-2">Sakasu's note<tspan fill="url(#dot)">.</tspan></text>
  <text x="76" y="502" font-family="Noto Sans, Inter, sans-serif" font-weight="500" font-size="30" fill="#cbd5e1">Sota Akasaka — optimization, affective computing, creative code</text>
  <text x="76" y="560" font-family="Noto Sans, Inter, sans-serif" font-weight="600" font-size="22" fill="#94a3b8" letter-spacing="3">EN · 中文 · 日本語</text>
</svg>`);

await sharp(still)
    .composite([{ input: overlay }])
    .png({ compressionLevel: 9, palette: true })
    .toFile('public/og.png');

console.log('wrote public/og.png');
