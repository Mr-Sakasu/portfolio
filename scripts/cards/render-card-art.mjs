// Draws the pictures behind the playlist and bandit cards on the home page.
//
// The other two cards borrow the reel: the scenes card frames the live page and
// the profile takes a still of Tokyo, both of which are about a place the reel
// has drawn. These two are about a subject instead — a record being played, and
// the row of machines the multi-armed bandit is named after — so they are drawn
// here, as SVG: gradients and glows rather than the reel's pixels, sharp at any
// size the card is asked to be, and a couple of KB each.
//
// Each is drawn twice, once per theme. A picture dark enough to sit under white
// type is a hole in a light page, so the light pair repaints the ground and
// leaves the subject — a black record, a lit machine — to carry itself. The
// card picks the file with a CSS background-image, so only one is ever fetched.
//
//   node scripts/cards/render-card-art.mjs
import { mkdir, writeFile } from 'node:fs/promises';

const WIDTH = 480;
const HEIGHT = 320;
const OUT_DIR = new URL('../../public/cards/', import.meta.url);

/** Deterministic, so the art only changes when this file does. */
const rng = (seed) => () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
};

const round = (value) => Math.round(value * 100) / 100;

/** Every colour either picture uses, once per theme. */
const PALETTES = {
    playlist: {
        dark: {
            skyTop: '#150d38', skyBottom: '#3b1d66',
            halo: '#a78bfa', haloStrength: 0.42,
            vinyl: ['#2b1b55', '#150d33', '#0c0722'],
            groove: '#ffffff', grooveStrong: 0.07, grooveFaint: 0.035,
            rim: '#c4b5fd', rimStrength: 0.35,
            label: ['#ddd6fe', '#a78bfa', '#6d28d9'], labelRing: '#f5f3ff', spindle: '#150d38',
            sheen: 0.22,
            arm: ['#e2e8f0', '#64748b'], pivot: '#475569', pivotCap: '#cbd5e1', head: '#e2e8f0',
            meter: [['#5b21b6', 0.5], ['#a855f7', 0.8], ['#f5d0fe', 1]],
        },
        light: {
            skyTop: '#faf5ff', skyBottom: '#d8ccfb',
            halo: '#8b5cf6', haloStrength: 0.3,
            // A record is black in any light; only the room around it changes.
            vinyl: ['#453d5e', '#221c38', '#141024'],
            groove: '#ffffff', grooveStrong: 0.09, grooveFaint: 0.04,
            rim: '#6d28d9', rimStrength: 0.4,
            label: ['#ede9fe', '#a78bfa', '#5b21b6'], labelRing: '#faf5ff', spindle: '#f5f3ff',
            sheen: 0.26,
            arm: ['#cbd5e1', '#475569'], pivot: '#64748b', pivotCap: '#f1f5f9', head: '#f8fafc',
            meter: [['#6d28d9', 0.65], ['#9333ea', 0.9], ['#d946ef', 1]],
        },
    },
    stars: {
        dark: {
            skyTop: '#040b1c', skyBottom: '#112c52',
            star: '#e2e8f0', starCount: 80, starStrength: 0.9,
            link: '#7dd3fc', linkStrength: 0.55, anchor: '#f8fafc',
            horizon: '#04091a', window: '#fbbf24', windowStrength: 0.75,
            glow: '#38bdf8', glowStrength: 0.3,
        },
        light: {
            // Not noon: the hour after sunset, when the constellation is out
            // and the sky has not gone black yet.
            skyTop: '#e9f1ff', skyBottom: '#a9c6ea',
            star: '#1e3a8a', starCount: 55, starStrength: 0.55,
            link: '#1d4ed8', linkStrength: 0.5, anchor: '#1e3a8a',
            horizon: '#7f92ad', window: '#b45309', windowStrength: 0.7,
            glow: '#2563eb', glowStrength: 0.16,
        },
    },
    hanoi: {
        dark: {
            skyTop: '#160e2e', skyBottom: '#311c5c',
            base: '#0f0a22', baseEdge: '#a78bfa', baseEdgeStrength: 0.3,
            peg: ['#cbd5e1', '#64748b'],
            disks: ['#34d399', '#60a5fa', '#a78bfa', '#f472b6'],
            shadow: '#050214', shadowStrength: 0.45,
            glow: '#a78bfa', glowStrength: 0.35,
        },
        light: {
            skyTop: '#f7f4ff', skyBottom: '#ddd3f7',
            base: '#b9adde', baseEdge: '#6d28d9', baseEdgeStrength: 0.35,
            peg: ['#e2e8f0', '#94a3b8'],
            disks: ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
            shadow: '#6d28d9', shadowStrength: 0.18,
            glow: '#8b5cf6', glowStrength: 0.18,
        },
    },
    bandit: {
        dark: {
            groundTop: '#050b16', groundBottom: '#0e2036',
            grid: '#38bdf8', gridStrength: 0.07,
            axis: '#64748b', axisStrength: 0.55,
            arm: '#94a3b8', armStroke: 0.5, armFill: 0.06,
            best: '#38bdf8', bestStroke: 0.95, bestFill: 0.16,
            whisker: '#cbd5e1', whiskerStrength: 0.6,
            mean: '#e2e8f0', chosen: '#fbbf24',
            sample: '#7dd3fc', sampleStrength: 0.5,
        },
        light: {
            groundTop: '#f4f8fc', groundBottom: '#d3e0ee',
            grid: '#1e3a8a', gridStrength: 0.09,
            axis: '#475569', axisStrength: 0.6,
            arm: '#64748b', armStroke: 0.55, armFill: 0.08,
            best: '#0369a1', bestStroke: 0.95, bestFill: 0.14,
            whisker: '#334155', whiskerStrength: 0.6,
            mean: '#1e293b', chosen: '#b45309',
            sample: '#0284c7', sampleStrength: 0.45,
        },
    },
};

/** A record turning under its arm, over a room of level meters. */
function playlist(palette) {
    const random = rng(20260916);

    const meters = [];
    const bars = 26;
    const slot = WIDTH / bars;
    for (let i = 0; i < bars; i += 1) {
        const centred = 1 - Math.abs(i - (bars - 1) / 2) / ((bars - 1) / 2);
        const height = round(26 + centred * 62 + random() * 34);
        const x = round(i * slot + slot * 0.18);
        const width = round(slot * 0.64);
        meters.push(`<rect x="${x}" y="${round(HEIGHT - height)}" width="${width}" height="${height + 12}" rx="${round(width / 2)}" fill="url(#meter)" />`);
    }

    const grooves = [];
    for (let r = 40; r <= 88; r += 4) {
        const strength = r % 8 === 0 ? palette.grooveStrong : palette.grooveFaint;
        grooves.push(`<circle cx="240" cy="136" r="${r}" fill="none" stroke="${palette.groove}" stroke-opacity="${strength}" stroke-width="1.2" />`);
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-label="A record turning under its arm above a row of level meters">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${palette.skyTop}" />
      <stop offset="1" stop-color="${palette.skyBottom}" />
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5">
      <stop offset="0" stop-color="${palette.halo}" stop-opacity="${palette.haloStrength}" />
      <stop offset="1" stop-color="${palette.halo}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="vinyl" cx="0.36" cy="0.3">
      <stop offset="0" stop-color="${palette.vinyl[0]}" />
      <stop offset="0.6" stop-color="${palette.vinyl[1]}" />
      <stop offset="1" stop-color="${palette.vinyl[2]}" />
    </radialGradient>
    <linearGradient id="label" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.label[0]}" />
      <stop offset="0.55" stop-color="${palette.label[1]}" />
      <stop offset="1" stop-color="${palette.label[2]}" />
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.5" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="meter" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="${palette.meter[0][0]}" stop-opacity="${palette.meter[0][1]}" />
      <stop offset="0.55" stop-color="${palette.meter[1][0]}" stop-opacity="${palette.meter[1][1]}" />
      <stop offset="1" stop-color="${palette.meter[2][0]}" stop-opacity="${palette.meter[2][1]}" />
    </linearGradient>
    <linearGradient id="arm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.arm[0]}" />
      <stop offset="1" stop-color="${palette.arm[1]}" />
    </linearGradient>
    <clipPath id="disc"><circle cx="240" cy="136" r="92" /></clipPath>
    <filter id="blur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" />
    </filter>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#sky)" />
  <circle cx="240" cy="136" r="168" fill="url(#halo)" />

  <g>
    <circle cx="240" cy="136" r="92" fill="url(#vinyl)" />
    ${grooves.join('\n    ')}
    <g clip-path="url(#disc)">
      <ellipse cx="200" cy="96" rx="104" ry="34" fill="url(#sheen)" opacity="${palette.sheen}" transform="rotate(-32 200 96)" />
    </g>
    <circle cx="240" cy="136" r="92" fill="none" stroke="${palette.rim}" stroke-opacity="${palette.rimStrength}" stroke-width="1.5" />
    <circle cx="240" cy="136" r="30" fill="url(#label)" />
    <circle cx="240" cy="136" r="30" fill="none" stroke="${palette.labelRing}" stroke-opacity="0.5" stroke-width="1.2" />
    <circle cx="240" cy="136" r="4.5" fill="${palette.spindle}" />
  </g>

  <g stroke-linecap="round">
    <line x1="424" y1="58" x2="300" y2="118" stroke="url(#arm)" stroke-width="6" />
    <rect x="286" y="112" width="22" height="13" rx="4" fill="${palette.head}" transform="rotate(-26 297 118)" />
    <circle cx="428" cy="54" r="13" fill="${palette.pivot}" />
    <circle cx="428" cy="54" r="6" fill="${palette.pivotCap}" />
  </g>

  <g opacity="0.45" filter="url(#blur)">
    ${meters.join('\n    ')}
  </g>
  <g opacity="0.92">
    ${meters.join('\n    ')}
  </g>
</svg>
`;
}

/**
 * The problem rather than the cabinet: four arms, each drawn as the reward
 * distribution it is hiding, with what has been learned about it plotted
 * underneath — an estimated mean and the interval still around it. The arm
 * currently worth pulling is the one picked out.
 */
function bandit(palette) {
    const random = rng(9162026);

    const baseline = 246;
    const arms = [
        { x: 84, mean: 0.42, spread: 30, height: 74, pulls: 18 },
        { x: 176, mean: 0.58, spread: 22, height: 104, pulls: 41 },
        { x: 288, mean: 0.74, spread: 26, height: 132, pulls: 96, best: true },
        { x: 392, mean: 0.36, spread: 38, height: 62, pulls: 11 },
    ];

    /** A bell over the axis, sampled densely enough to read as drawn. */
    const curve = (arm) => {
        const points = [];
        for (let step = 0; step <= 48; step += 1) {
            const t = -3 + (step / 48) * 6;
            const x = round(arm.x + t * (arm.spread / 1.6));
            const y = round(baseline - arm.height * Math.exp(-0.5 * t * t));
            points.push(`${x} ${y}`);
        }
        return points;
    };

    const shapes = arms.map((arm) => {
        const points = curve(arm);
        const stroke = arm.best ? palette.best : palette.arm;
        const strokeStrength = arm.best ? palette.bestStroke : palette.armStroke;
        const fillStrength = arm.best ? palette.bestFill : palette.armFill;
        return `<g>
    <path d="M ${points[0]} L ${points.slice(1).join(' L ')} L ${round(arm.x + 3 * (arm.spread / 1.6))} ${baseline} L ${round(arm.x - 3 * (arm.spread / 1.6))} ${baseline} Z" fill="${stroke}" fill-opacity="${fillStrength}" />
    <path d="M ${points[0]} L ${points.slice(1).join(' L ')}" fill="none" stroke="${stroke}" stroke-opacity="${strokeStrength}" stroke-width="${arm.best ? 2.4 : 1.6}" stroke-linejoin="round" />
  </g>`;
    });

    // What the run has learned so far: a mean, and the interval still around it.
    const estimates = arms.map((arm) => {
        const centre = round(baseline + 34);
        const halfWidth = round(46 / Math.sqrt(arm.pulls));
        const colour = arm.best ? palette.chosen : palette.mean;
        return `<g>
    <line x1="${round(arm.x - halfWidth)}" y1="${centre}" x2="${round(arm.x + halfWidth)}" y2="${centre}" stroke="${palette.whisker}" stroke-opacity="${palette.whiskerStrength}" stroke-width="1.4" />
    <line x1="${round(arm.x - halfWidth)}" y1="${centre - 5}" x2="${round(arm.x - halfWidth)}" y2="${centre + 5}" stroke="${palette.whisker}" stroke-opacity="${palette.whiskerStrength}" stroke-width="1.4" />
    <line x1="${round(arm.x + halfWidth)}" y1="${centre - 5}" x2="${round(arm.x + halfWidth)}" y2="${centre + 5}" stroke="${palette.whisker}" stroke-opacity="${palette.whiskerStrength}" stroke-width="1.4" />
    <circle cx="${arm.x}" cy="${centre}" r="${arm.best ? 4.4 : 3.2}" fill="${colour}" />
  </g>`;
    });

    // The draws themselves, scattered thinly under each bell.
    const samples = [];
    for (const arm of arms) {
        const count = Math.round(arm.pulls / 6);
        for (let i = 0; i < count; i += 1) {
            const t = (random() + random() + random() - 1.5) * 1.6;
            const x = round(arm.x + t * (arm.spread / 1.6));
            const y = round(baseline - random() * arm.height * 0.55);
            samples.push(`<circle cx="${x}" cy="${y}" r="1.3" fill="${palette.sample}" opacity="${round(palette.sampleStrength * (0.4 + random() * 0.6))}" />`);
        }
    }

    const grid = [];
    for (let y = 70; y < baseline; y += 44) {
        grid.push(`<line x1="24" y1="${y}" x2="${WIDTH - 24}" y2="${y}" stroke="${palette.grid}" stroke-opacity="${palette.gridStrength}" stroke-width="1" />`);
    }
    for (let x = 60; x < WIDTH; x += 60) {
        grid.push(`<line x1="${x}" y1="46" x2="${x}" y2="${baseline}" stroke="${palette.grid}" stroke-opacity="${round(palette.gridStrength * 0.7)}" stroke-width="1" />`);
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-label="Four reward distributions with the estimate and interval plotted under each">
  <defs>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${palette.groundTop}" />
      <stop offset="1" stop-color="${palette.groundBottom}" />
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#ground)" />
  ${grid.join('\n  ')}

  ${samples.join('\n  ')}
  ${shapes.join('\n  ')}

  <line x1="24" y1="${baseline}" x2="${WIDTH - 24}" y2="${baseline}" stroke="${palette.axis}" stroke-opacity="${palette.axisStrength}" stroke-width="1.4" />
  ${estimates.join('\n  ')}
</svg>
`;
}

/** Tonight's sky over a city: the Dipper picked out of the scatter. */
function stars(palette) {
    const random = rng(4102026);

    const scatter = [];
    for (let i = 0; i < palette.starCount; i += 1) {
        const x = round(random() * WIDTH);
        const y = round(random() * 250);
        const r = round(0.6 + random() * 1.5);
        scatter.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${palette.star}" opacity="${round(0.25 + random() * palette.starStrength * 0.6)}" />`);
    }

    // Ursa Major, the one the sky page labels first.
    const dipper = [[104, 156], [148, 134], [196, 130], [234, 152], [272, 142], [312, 112], [356, 122]];
    const links = dipper.slice(1).map(([x, y], index) => {
        const [px, py] = dipper[index];
        return `<line x1="${px}" y1="${py}" x2="${x}" y2="${y}" stroke="${palette.link}" stroke-opacity="${palette.linkStrength}" stroke-width="1.6" stroke-linecap="round" />`;
    });
    const anchors = dipper.map(([x, y], index) => `<circle cx="${x}" cy="${y}" r="${index === 0 || index === 6 ? 4.6 : 3.6}" fill="${palette.anchor}" />`);

    // A skyline to stand under it, with a few windows still lit.
    const towers = [];
    const windows = [];
    let x = -10;
    while (x < WIDTH + 10) {
        const w = round(18 + random() * 34);
        const h = round(26 + random() * 62);
        towers.push(`<rect x="${round(x)}" y="${round(HEIGHT - 46 - h)}" width="${w}" height="${h + 46}" rx="2" fill="${palette.horizon}" />`);
        for (let row = 0; row < Math.floor(h / 16); row += 1) {
            if (random() > 0.62) {
                windows.push(`<rect x="${round(x + 5 + random() * (w - 12))}" y="${round(HEIGHT - 40 - h + row * 15)}" width="3" height="4" fill="${palette.window}" opacity="${round(palette.windowStrength * (0.5 + random() * 0.5))}" />`);
            }
        }
        x += w + round(3 + random() * 8);
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-label="A constellation over a city skyline">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${palette.skyTop}" />
      <stop offset="1" stop-color="${palette.skyBottom}" />
    </linearGradient>
    <radialGradient id="cityGlow" cx="0.5" cy="1">
      <stop offset="0" stop-color="${palette.glow}" stop-opacity="${palette.glowStrength}" />
      <stop offset="1" stop-color="${palette.glow}" stop-opacity="0" />
    </radialGradient>
    <filter id="starGlow" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="3.5" />
    </filter>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#sky)" />
  ${scatter.join('\n  ')}
  <g>
    ${links.join('\n    ')}
    <g filter="url(#starGlow)" opacity="0.7">${anchors.join('')}</g>
    ${anchors.join('\n    ')}
  </g>
  <ellipse cx="240" cy="${HEIGHT}" rx="300" ry="110" fill="url(#cityGlow)" />
  ${towers.join('\n  ')}
  ${windows.join('\n  ')}
</svg>
`;
}

/** The puzzle mid-solve: three pegs, one of them already carrying a disk. */
function hanoi(palette) {
    const pegs = [120, 240, 360];
    const baseY = 232;

    const peg = (x) => `<rect x="${x - 5}" y="96" width="10" height="${baseY - 96}" rx="5" fill="url(#peg)" />`;

    const disk = (x, y, width, colour) => `<g>
    <ellipse cx="${x}" cy="${y + 12}" rx="${round(width / 2)}" ry="5" fill="${palette.shadow}" opacity="${palette.shadowStrength}" />
    <rect x="${round(x - width / 2)}" y="${y - 11}" width="${width}" height="22" rx="11" fill="${colour}" />
    <rect x="${round(x - width / 2 + 8)}" y="${y - 7}" width="${round(width - 16)}" height="5" rx="2.5" fill="#ffffff" opacity="0.28" />
  </g>`;

    const [smallest, small, medium, largest] = palette.disks;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" aria-label="Three pegs with stacked disks, part way through the puzzle">
  <defs>
    <linearGradient id="room" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0" stop-color="${palette.skyTop}" />
      <stop offset="1" stop-color="${palette.skyBottom}" />
    </linearGradient>
    <linearGradient id="peg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${palette.peg[0]}" />
      <stop offset="1" stop-color="${palette.peg[1]}" />
    </linearGradient>
    <radialGradient id="floorGlow" cx="0.5" cy="0.5">
      <stop offset="0" stop-color="${palette.glow}" stop-opacity="${palette.glowStrength}" />
      <stop offset="1" stop-color="${palette.glow}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#room)" />
  <ellipse cx="240" cy="250" rx="230" ry="60" fill="url(#floorGlow)" />

  <path d="M ${pegs[0]} 74 Q 240 26 ${pegs[2]} 74" fill="none" stroke="${palette.peg[1]}" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-dasharray="7 9" />
  <path d="M ${pegs[2] - 8} 66 L ${pegs[2]} 78 L ${pegs[2] + 9} 63" fill="none" stroke="${palette.peg[1]}" stroke-opacity="0.6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />

  ${pegs.map(peg).join('\n  ')}

  <rect x="36" y="${baseY}" width="408" height="16" rx="8" fill="${palette.base}" />
  <rect x="36" y="${baseY}" width="408" height="2" rx="1" fill="${palette.baseEdge}" fill-opacity="${palette.baseEdgeStrength}" />

  ${disk(pegs[0], baseY - 11, 150, largest)}
  ${disk(pegs[0], baseY - 35, 120, medium)}
  ${disk(pegs[0], baseY - 59, 92, small)}
  ${disk(pegs[2], baseY - 11, 66, smallest)}
</svg>
`;
}

await mkdir(OUT_DIR, { recursive: true });
for (const [name, draw] of [['playlist', playlist], ['bandit', bandit], ['stars', stars], ['hanoi', hanoi]]) {
    for (const theme of ['dark', 'light']) {
        const file = theme === 'dark' ? `${name}.svg` : `${name}-light.svg`;
        const svg = draw(PALETTES[name][theme]);
        await writeFile(new URL(file, OUT_DIR), svg, 'utf8');
        console.log(`${name} (${theme}): -> public/cards/${file} (${Math.round(Buffer.byteLength(svg) / 1024)}KB)`);
    }
}
