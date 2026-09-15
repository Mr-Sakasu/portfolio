// Draws the pictures behind the playlist and bandit cards on the home page.
//
// The other two cards borrow a scene: the reel's card frames the live page and
// the profile takes a still of Tokyo, both of which are about the place they
// show. These two are about a subject instead — a record being played, and the
// row of machines the multi-armed bandit is named after — so nothing in the
// reel fits them, and they are drawn here in the same 8-bit idiom: a small
// canvas, a short palette, ordered dithering, and no smoothing on the way up.
//
//   node scripts/cards/render-card-art.mjs
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const WIDTH = 480;
const HEIGHT = 320;
const OUT_DIR = new URL('../../public/cards/', import.meta.url);

/** A deterministic shuffle, so the art is the same every time it is drawn. */
const rng = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
};

const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
];

const hex = (value) => [
    parseInt(value.slice(1, 3), 16),
    parseInt(value.slice(3, 5), 16),
    parseInt(value.slice(5, 7), 16),
];

function canvas() {
    const data = new Uint8Array(WIDTH * HEIGHT * 3);
    const put = (x, y, colour) => {
        x = Math.round(x);
        y = Math.round(y);
        if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
        const at = (y * WIDTH + x) * 3;
        data[at] = colour[0];
        data[at + 1] = colour[1];
        data[at + 2] = colour[2];
    };

    return {
        data,
        put,
        /** Vertical gradient, banded by a 4x4 Bayer matrix the way the scenes are. */
        sky(topHex, bottomHex, spread = 10) {
            const top = hex(topHex);
            const bottom = hex(bottomHex);
            for (let y = 0; y < HEIGHT; y += 1) {
                const t = y / (HEIGHT - 1);
                for (let x = 0; x < WIDTH; x += 1) {
                    const jitter = (BAYER[y % 4][x % 4] / 15 - 0.5) * spread;
                    put(x, y, top.map((channel, index) =>
                        Math.max(0, Math.min(255, Math.round(channel + (bottom[index] - channel) * t + jitter)))));
                }
            }
        },
        rect(x, y, w, h, colourHex) {
            const colour = hex(colourHex);
            for (let j = 0; j < h; j += 1) for (let i = 0; i < w; i += 1) put(x + i, y + j, colour);
        },
        disc(cx, cy, r, colourHex) {
            const colour = hex(colourHex);
            for (let y = -r; y <= r; y += 1) {
                for (let x = -r; x <= r; x += 1) {
                    if (x * x + y * y <= r * r) put(cx + x, cy + y, colour);
                }
            }
        },
        ring(cx, cy, r, thickness, colourHex) {
            const colour = hex(colourHex);
            const outer = r * r;
            const inner = (r - thickness) * (r - thickness);
            for (let y = -r; y <= r; y += 1) {
                for (let x = -r; x <= r; x += 1) {
                    const d = x * x + y * y;
                    if (d <= outer && d >= inner) put(cx + x, cy + y, colour);
                }
            }
        },
        /** A line thick enough to read as drawn rather than aliased away. */
        line(x1, y1, x2, y2, thickness, colourHex) {
            const colour = hex(colourHex);
            const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
            for (let step = 0; step <= steps; step += 1) {
                const t = steps === 0 ? 0 : step / steps;
                const x = x1 + (x2 - x1) * t;
                const y = y1 + (y2 - y1) * t;
                for (let j = 0; j < thickness; j += 1) {
                    for (let i = 0; i < thickness; i += 1) put(x + i, y + j, colour);
                }
            }
        },
    };
}

async function write(name, art) {
    await mkdir(OUT_DIR, { recursive: true });
    const out = new URL(`${name}.webp`, OUT_DIR).pathname;
    const buffer = await sharp(Buffer.from(art.data), { raw: { width: WIDTH, height: HEIGHT, channels: 3 } })
        .webp({ lossless: true, effort: 6 })
        .toBuffer();
    await sharp(buffer).toFile(out);
    console.log(`${name}: ${WIDTH}x${HEIGHT} -> public/cards/${name}.webp (${Math.round(buffer.length / 1024)}KB)`);
}

/** A record on the deck, under an arm, over a room full of level meters. */
function playlist() {
    const art = canvas();
    const random = rng(20260916);
    art.sky('#1a1145', '#42206b');

    // Dust in the light.
    for (let i = 0; i < 150; i += 1) {
        const x = Math.floor(random() * WIDTH);
        const y = Math.floor(random() * (HEIGHT - 90));
        art.rect(x, y, 1, 1, random() > 0.6 ? '#f5d0fe' : '#c4b5fd');
    }

    // The record: grooves out of a violet label, and a highlight across them.
    const cx = 240;
    const cy = 138;
    art.disc(cx, cy, 92, '#0e0824');
    for (let r = 88; r > 34; r -= 6) art.ring(cx, cy, r, 2, r % 12 === 4 ? '#2e1c5e' : '#241550');
    art.ring(cx, cy, 90, 3, '#4c2a86');
    art.disc(cx, cy, 30, '#a78bfa');
    art.ring(cx, cy, 30, 2, '#ddd6fe');
    art.disc(cx, cy, 16, '#7c3aed');
    art.disc(cx, cy, 4, '#1a1145');
    for (let i = 0; i < 46; i += 1) {
        art.rect(cx - 74 + i, cy - 62 + Math.round(i * 0.9), 2, 2, '#6d4bb8');
    }

    // The arm, come down off its rest onto the outer groove.
    art.line(432, 44, 330, 96, 4, '#94a3b8');
    art.line(330, 96, 300, 112, 5, '#cbd5e1');
    art.rect(296, 108, 14, 12, '#e2e8f0');
    art.disc(436, 44, 11, '#64748b');
    art.disc(436, 44, 5, '#cbd5e1');

    // Level meters along the foot, the loudest in the middle of the room.
    const bars = 30;
    const gap = Math.floor(WIDTH / bars);
    for (let i = 0; i < bars; i += 1) {
        const centred = 1 - Math.abs(i - (bars - 1) / 2) / ((bars - 1) / 2);
        const height = Math.round(14 + centred * 54 + random() * 30);
        const x = i * gap + 2;
        for (let y = 0; y < height; y += 1) {
            const t = y / height;
            const colour = t > 0.74 ? '#f0abfc' : t > 0.4 ? '#c084fc' : '#7c3aed';
            art.rect(x, HEIGHT - 1 - y, gap - 4, 1, colour);
        }
        art.rect(x, HEIGHT - height - 3, gap - 4, 2, '#fbcfe8');
    }

    return art;
}

/** The row of machines the problem is named after, arms out, reels spun. */
function bandit() {
    const art = canvas();
    const random = rng(9162026);
    art.sky('#071528', '#123a68');

    for (let i = 0; i < 90; i += 1) {
        art.rect(Math.floor(random() * WIDTH), Math.floor(random() * 150), 1, 1, '#93c5fd');
    }

    // The floor they stand on.
    art.rect(0, 268, WIDTH, HEIGHT - 268, '#081b33');
    art.rect(0, 268, WIDTH, 2, '#1e4a8a');

    const symbols = [
        ['#fbbf24', '#f59e0b'],
        ['#f87171', '#ef4444'],
        ['#67e8f9', '#22d3ee'],
    ];

    const machines = 3;
    const width = 104;
    const gap = 30;
    const left = Math.round((WIDTH - (machines * width + (machines - 1) * gap)) / 2);

    for (let m = 0; m < machines; m += 1) {
        const x = left + m * (width + gap);
        const top = 96;

        // Cabinet, with a lit crown.
        art.rect(x, top, width, 172, '#15325f');
        art.rect(x, top, 3, 172, '#1e4a8a');
        art.rect(x + width - 3, top, 3, 172, '#0b2140');
        art.rect(x - 6, top - 18, width + 12, 20, '#1e4a8a');
        art.rect(x - 6, top - 18, width + 12, 3, '#3b82f6');
        for (let b = 0; b < 6; b += 1) {
            art.disc(x + 4 + b * 19, top - 8, 3, b % 2 ? '#fbbf24' : '#67e8f9');
        }

        // The window, and three reels stopped on a payout.
        art.rect(x + 12, top + 14, width - 24, 50, '#04101f');
        art.rect(x + 12, top + 14, width - 24, 2, '#0b2140');
        for (let reel = 0; reel < 3; reel += 1) {
            const rx = x + 16 + reel * 26;
            art.rect(rx, top + 18, 22, 42, '#e2e8f0');
            art.rect(rx, top + 18, 22, 2, '#94a3b8');
            const [light, dark] = symbols[(m + reel) % symbols.length];
            art.disc(rx + 11, top + 34, 7, light);
            art.disc(rx + 11, top + 34, 4, dark);
            art.rect(rx + 4, top + 46, 14, 4, dark);
        }

        // Buttons, coin slot, and the tray they pay into.
        for (let b = 0; b < 3; b += 1) {
            art.rect(x + 18 + b * 24, top + 76, 16, 7, ['#f87171', '#4ade80', '#38bdf8'][b]);
        }
        art.rect(x + 34, top + 92, 36, 4, '#04101f');
        art.rect(x + 12, top + 108, width - 24, 30, '#0b2140');
        art.rect(x + 12, top + 108, width - 24, 2, '#04101f');
        for (let coin = 0; coin < 4; coin += 1) {
            art.disc(x + 24 + coin * 18, top + 128, 5, '#fbbf24');
            art.disc(x + 24 + coin * 18, top + 128, 2, '#fde68a');
        }

        // The arm. This is the part the name is about.
        art.rect(x + width, top + 26, 8, 8, '#334155');
        art.line(x + width + 3, top + 30, x + width + 16, top + 4, 4, '#cbd5e1');
        art.disc(x + width + 17, top + 2, 8, '#ef4444');
        art.disc(x + width + 15, top, 3, '#fca5a5');
    }

    // Coins that missed the tray.
    for (let coin = 0; coin < 9; coin += 1) {
        const x = 20 + Math.floor(random() * (WIDTH - 40));
        const y = 280 + Math.floor(random() * 30);
        art.disc(x, y, 4, '#fbbf24');
        art.disc(x, y, 2, '#fde68a');
    }

    return art;
}

await write('playlist', playlist());
await write('bandit', bandit());
