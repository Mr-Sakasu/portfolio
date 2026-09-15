// Renders the scenes that sit behind the home page's bento cards to stills.
//
// The scenes card frames the reel itself, which is worth one iframe. Three more
// would not be: each costs the whole scenes page again. So those cards get a
// picture, rendered from the same artwork by the same renderer.
//
// Run it when a scene's artwork changes:
//
//   npm run dev
//   node scripts/scenes/render-card-stills.mjs
//
// It drives the dev server in headless Chrome, so `google-chrome` has to be on
// the path. Chrome is started and stopped by this script; the dev server is not.
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

// Which scene backs which card. The sizes are the renderer's own resolution,
// not the card's: it draws 240 rows and as many columns as the aspect asks for,
// so a viewport of 480x240 maps one art pixel to one image pixel. The cards
// scale that up with image-rendering: pixelated, which is what keeps the
// pixels square — and keeps the files a few KB instead of a few hundred.
const STILLS = [
    { card: 'profile', scene: 'tokyo', width: 480, height: 240 },
    { card: 'playlist', scene: 'victoria', width: 480, height: 240 },
    { card: 'bandit', scene: 'shenzhen', width: 480, height: 240 },
];

const ORIGIN = process.env.SCENE_STILL_ORIGIN ?? 'http://localhost:4321';
const LANG = 'en';
const OUT_DIR = new URL('../../public/scenes/', import.meta.url);
const PORT = 9333;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(url, attempts = 40) {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
            const response = await fetch(url);
            if (response.ok) return true;
        } catch {}
        await sleep(250);
    }
    return false;
}

/** One CDP session against a fresh tab, closed when the callback returns. */
async function withPage(url, run) {
    const target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();
    const socket = new WebSocket(target.webSocketDebuggerUrl);
    const pending = new Map();
    let id = 0;
    const send = (method, params = {}) => new Promise((resolve) => {
        const callId = (id += 1);
        pending.set(callId, resolve);
        socket.send(JSON.stringify({ id: callId, method, params }));
    });
    await new Promise((resolve) => { socket.onopen = resolve; });
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.id && pending.has(message.id)) {
            pending.get(message.id)(message.result);
            pending.delete(message.id);
        }
    };
    try {
        return await run(send);
    } finally {
        await send('Page.close');
        socket.close();
    }
}

const userDataDir = await mkdtemp(join(tmpdir(), 'scene-stills-'));
const chrome = spawn('google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--disable-gpu',
], { stdio: 'ignore' });

try {
    if (!(await waitFor(`${ORIGIN}/${LANG}/`))) {
        throw new Error(`No dev server at ${ORIGIN} — start one with \`npm run dev\` first.`);
    }
    if (!(await waitFor(`http://127.0.0.1:${PORT}/json/version`))) {
        throw new Error('Headless Chrome did not come up.');
    }
    await mkdir(OUT_DIR, { recursive: true });

    for (const { card, scene, width, height } of STILLS) {
        const url = `${ORIGIN}/${LANG}/scenes/?preview=1&scene=${scene}`;
        const png = await withPage(url, async (send) => {
            await send('Page.enable');
            await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
            await send('Page.navigate', { url });
            // The renderer paints its first frame on load; give the clouds and
            // the light show a moment to reach a frame worth keeping.
            await sleep(3500);
            // The dev server hangs its toolbar over the bottom of the page,
            // and a screenshot keeps it. Against `npm run preview` there is
            // nothing to remove and this does nothing.
            await send('Runtime.evaluate', {
                expression: "document.querySelectorAll('astro-dev-toolbar').forEach((el) => el.remove())",
            });
            const shot = await send('Page.captureScreenshot', {
                format: 'png',
                clip: { x: 0, y: 0, width, height, scale: 1 },
                captureBeyondViewport: true,
            });
            return Buffer.from(shot.data, 'base64');
        });

        // Lossless: the art is flat colour and heavy dithering, which lossy
        // WebP smears into mush at any quality worth the bytes it saves.
        const out = new URL(`${card}.webp`, OUT_DIR);
        await sharp(png).webp({ lossless: true, effort: 6 }).toFile(out.pathname);
        const { size } = await stat(out);
        console.log(`${card}: ${scene} ${width}x${height} -> public/scenes/${card}.webp (${Math.round(size / 1024)}KB)`);
    }
} finally {
    chrome.kill();
    // Chrome writes its profile out on the way down; removing it from under
    // itself races and throws ENOTEMPTY.
    await new Promise((resolve) => chrome.once('exit', resolve));
    await rm(userDataDir, { recursive: true, force: true }).catch(() => {});
}
