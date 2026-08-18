export type LayerKind = 'city' | 'peaks' | 'hills' | 'trees' | 'roofs';

export interface SceneLayer {
    kind: LayerKind;
    /** Horizon height, 0 (top) to 1 (bottom). */
    y: number;
    /** Peak height as a fraction of the canvas. */
    amp: number;
    color: string;
    /** Lit windows, canopy highlights, blossoms. */
    accent?: string;
    /** Density of blossoms scattered through a canopy, 0 to 1. */
    bloom?: number;
    /** 0 = crisp, 1 = fully washed into the horizon haze. */
    haze?: number;
}

export interface SceneLandmark {
    kind:
        | 'pearl' | 'twist' | 'opener' | 'stepped'
        | 'boc' | 'crown' | 'pyramid' | 'slab' | 'spire'
        | 'skytree' | 'tokyotower' | 'fuji'
        | 'canopy' | 'statue' | 'hall' | 'wall'
        | 'junk' | 'ferry' | 'promenade' | 'billboard';
    /** Centre position, 0 (left) to 1 (right). */
    x: number;
    /** Ground row, 0 (top) to 1 (bottom). */
    base: number;
    /** Height as a fraction of the canvas. */
    h: number;
    /** Width as a fraction of the canvas; walls and the promenade use it. */
    w?: number;
    body: string;
    light: string;
    accent?: string;
    /** Colour bands along a canopy roof. */
    colors?: string[];
    /** Drawn after the water, so it floats instead of being submerged. */
    onWater?: boolean;
    /** Drawn before the skyline, so the city stands in front of it. */
    behind?: boolean;
}

export interface ScenePixels {
    /** Sky bands, top to bottom. Rendered with ordered dithering between bands. */
    sky: string[];
    /** Warm glow sitting on the horizon. */
    haze?: { color: string; y: number; strength: number };
    clouds?: { count: number; color: string; shade?: string; y: number; spread: number };
    celestial?: { kind: 'sun' | 'moon'; x: number; y: number; r: number; color: string; glow: string };
    stars?: number;
    layers: SceneLayer[];
    /** Named buildings drawn on top of the generic skyline. */
    landmarks?: SceneLandmark[];
    water?: { y: number; colors: string[]; shimmer: string; reflect: number };
    weather?: 'fireflies' | 'petals';
    /** Deterministic terrain seed. */
    seed: number;
}

/** Each scene is drawn procedurally at low resolution, then scaled up with hard pixel edges. */
export const scenePixels: Record<string, ScenePixels> = {
    bund: {
        // Composed after the night view across the Huangpu: black sky, the
        // Pearl tower on the left, Shanghai Tower and the bottle opener on the
        // right, and long ribbons of colour dragged across the water.
        sky: ['#04050e', '#070a1c', '#0d1130', '#161a44', '#241f4e'],
        haze: { color: '#3a2a5e', y: 0.68, strength: 0.5 },
        stars: 26,
        layers: [
            { kind: 'city', y: 0.6, amp: 0.14, color: '#2a2a58', accent: '#ffd98a', haze: 0.3 },
            { kind: 'city', y: 0.63, amp: 0.2, color: '#1b1d44', accent: '#ffe0a0', haze: 0.12 },
            { kind: 'city', y: 0.66, amp: 0.12, color: '#101232', accent: '#ffe6b0', haze: 0.02 },
        ],
        landmarks: [
            { kind: 'pearl', x: 0.14, base: 0.68, h: 0.66, body: '#3d2f78', light: '#ff2f8f', accent: '#e0338f' },
            { kind: 'stepped', x: 0.62, base: 0.68, h: 0.4, body: '#2a2c60', light: '#ffe6a8' },
            { kind: 'billboard', x: 0.71, base: 0.68, h: 0.26, body: '#1d1f4a', light: '#e03434' },
            { kind: 'opener', x: 0.79, base: 0.68, h: 0.5, body: '#232a5c', light: '#ffd98a' },
            { kind: 'twist', x: 0.87, base: 0.68, h: 0.62, body: '#28306a', light: '#9ad4ff' },
            { kind: 'ferry', x: 0.4, base: 0.79, h: 0.045, body: '#0d1230', light: '#ffd98a', onWater: true },
            { kind: 'promenade', x: 0.5, base: 1, h: 0.11, w: 1, body: '#07091c', light: '#f0c98a', onWater: true },
        ],
        water: { y: 0.68, colors: ['#121a3e', '#0d1430', '#080d22'], shimmer: '#ffd98a', reflect: 0.9 },
        seed: 11,
    },
    gugong: {
        // Composed after the view down from Jingshan: hazy gold sky, ranks of
        // tiled roofs receding into the smog, the gate hall standing in front.
        sky: ['#c9a074', '#e6c398', '#f4dcb8', '#faeacf', '#fdf3e0'],
        haze: { color: '#f7e2c0', y: 0.42, strength: 0.75 },
        celestial: { kind: 'sun', x: 0.72, y: 0.12, r: 8, color: '#fffaea', glow: '#ffe0a8' },
        layers: [
            { kind: 'city', y: 0.34, amp: 0.04, color: '#9a8a7c', haze: 0.88 },
            { kind: 'roofs', y: 0.38, amp: 0.05, color: '#a86a4a', accent: '#d2a058', haze: 0.55 },
            { kind: 'roofs', y: 0.5, amp: 0.075, color: '#a4553a', accent: '#d9a441', haze: 0.32 },
            { kind: 'trees', y: 0.56, amp: 0.07, color: '#5c6b3c', accent: '#7f9450', haze: 0.22 },
            { kind: 'roofs', y: 0.63, amp: 0.1, color: '#9e4530', accent: '#e0aa42', haze: 0.12 },
            { kind: 'trees', y: 0.8, amp: 0.09, color: '#3f5230', accent: '#647d3c' },
        ],
        landmarks: [
            { kind: 'hall', x: 0.5, base: 0.84, h: 0.26, body: '#b0402f', light: '#dda23f' },
            { kind: 'wall', x: 0.5, base: 1.0, h: 0.16, w: 1.02, body: '#a83c2c', light: '#e0aa42' },
        ],
        seed: 71,
    },
    shenzhen: {
        // Composed after the view from Lianhua Hill Park: blue sky over the
        // Futian axis, the banded Civic Center roof, bougainvillea in front.
        sky: ['#2f7fc8', '#5aa2dc', '#8cc4ea', '#bcdcf2', '#dcecf7'],
        haze: { color: '#dcecf7', y: 0.52, strength: 0.5 },
        clouds: { count: 9, color: '#ffffff', shade: '#9ab8d4', y: 0.22, spread: 0.24 },
        layers: [
            { kind: 'hills', y: 0.52, amp: 0.06, color: '#7f9ab4', haze: 0.6 },
            { kind: 'city', y: 0.56, amp: 0.16, color: '#8fa4bc', accent: '#e8f2fa', haze: 0.42 },
            { kind: 'city', y: 0.6, amp: 0.2, color: '#5f7893', accent: '#dcecf8', haze: 0.16 },
            { kind: 'trees', y: 0.78, amp: 0.09, color: '#3f6b34', accent: '#6f9c42' },
            { kind: 'trees', y: 1.02, amp: 0.26, color: '#24512a', accent: '#e0417f', bloom: 0.1 },
        ],
        landmarks: [
            { kind: 'spire', x: 0.63, base: 0.64, h: 0.58, body: '#9db5cf', light: '#f8fcff' },
            { kind: 'crown', x: 0.26, base: 0.64, h: 0.3, body: '#7d95b0', light: '#eaf4fc' },
            { kind: 'slab', x: 0.12, base: 0.64, h: 0.26, body: '#8ba3bd', light: '#eaf4fc' },
            {
                kind: 'canopy',
                x: 0.5,
                base: 0.73,
                h: 0.1,
                body: '#4c6a86',
                light: '#4a8cae',
                colors: ['#c53a30', '#efc132'],
            },
        ],
        seed: 61,
    },
    tokyo: {
        // Composed after the dusk view out over the city: the last of the sun
        // along the horizon, rank behind rank of blocks running off into the
        // haze, Tokyo Tower lit orange, the Skytree standing off to the right.
        sky: ['#182450', '#4a3f7e', '#9c5f80', '#e08a5e', '#ffc890'],
        haze: { color: '#f4a878', y: 0.56, strength: 0.6 },
        clouds: { count: 7, color: '#e8a97e', shade: '#5c4a7a', y: 0.24, spread: 0.22 },
        layers: [
            { kind: 'city', y: 0.58, amp: 0.09, color: '#7a6a9a', accent: '#ffd8a0', haze: 0.6 },
            { kind: 'city', y: 0.63, amp: 0.15, color: '#5a4f7e', accent: '#ffd8a0', haze: 0.34 },
            { kind: 'city', y: 0.68, amp: 0.2, color: '#38335e', accent: '#ffd08a', haze: 0.12 },
            { kind: 'city', y: 1.06, amp: 0.3, color: '#171a34', accent: '#ffdc9a' },
        ],
        landmarks: [
            { kind: 'slab', x: 0.14, base: 0.7, h: 0.32, body: '#413a68', light: '#ffd08a' },
            { kind: 'tokyotower', x: 0.42, base: 0.76, h: 0.5, body: '#d2542e', light: '#ffe0a8' },
            { kind: 'skytree', x: 0.8, base: 0.72, h: 0.6, body: '#3f4a78', light: '#a8d8ff' },
        ],
        seed: 33,
    },
    fuji: {
        // Composed after the mountain in spring, from the hills an hour west of
        // the city: the cone over a hazy ridge, cedar along the valley, and a
        // bank of cherry close enough to shed petals across the frame.
        sky: ['#3f88cc', '#6fa9dc', '#a5cbe9', '#cfe2f2', '#f0e2e2'],
        haze: { color: '#f2e0e4', y: 0.62, strength: 0.6 },
        clouds: { count: 6, color: '#ffffff', shade: '#a8bcd8', y: 0.18, spread: 0.16 },
        layers: [
            { kind: 'hills', y: 0.68, amp: 0.06, color: '#7e88ac', haze: 0.6 },
            { kind: 'trees', y: 0.75, amp: 0.05, color: '#4a6152', haze: 0.4 },
            { kind: 'trees', y: 0.88, amp: 0.09, color: '#3c5545', accent: '#f7c9dc', bloom: 0.05 },
            { kind: 'trees', y: 1.1, amp: 0.34, color: '#584250', accent: '#ffc3d8', bloom: 0.22 },
        ],
        landmarks: [
            {
                kind: 'fuji',
                x: 0.5,
                base: 0.72,
                h: 0.46,
                w: 2,
                body: '#7c86b8',
                light: '#fff4e4',
                accent: '#f2f4fb',
                behind: true,
            },
        ],
        weather: 'petals',
        seed: 24,
    },
    victoria: {
        sky: ['#04081a', '#0b1430', '#16204a', '#2a2a5e', '#4a3568'],
        haze: { color: '#c88a6a', y: 0.62, strength: 0.3 },
        celestial: { kind: 'moon', x: 0.14, y: 0.14, r: 5, color: '#fff2d8', glow: '#ffe0b0' },
        stars: 60,
        layers: [
            { kind: 'peaks', y: 0.6, amp: 0.26, color: '#161f3e', haze: 0.24 },
            { kind: 'city', y: 0.66, amp: 0.16, color: '#141d40', accent: '#ffcf6b', haze: 0.14 },
            { kind: 'city', y: 0.7, amp: 0.22, color: '#0d1430', accent: '#ffd98a', haze: 0.04 },
        ],
        landmarks: [
            { kind: 'crown', x: 0.22, base: 0.72, h: 0.46, body: '#1c2b52', light: '#ffe0a0' },
            { kind: 'boc', x: 0.4, base: 0.72, h: 0.56, body: '#24375f', light: '#a8e0ff' },
            { kind: 'pyramid', x: 0.56, base: 0.72, h: 0.46, body: '#1c2b52', light: '#ffcf6b' },
            { kind: 'slab', x: 0.8, base: 0.72, h: 0.42, body: '#182549', light: '#ffd98a' },
            { kind: 'junk', x: 0.66, base: 0.88, h: 0.09, body: '#2a1d22', light: '#d4633a', onWater: true },
            { kind: 'ferry', x: 0.32, base: 0.83, h: 0.045, body: '#0a1024', light: '#ffe0a0', onWater: true },
        ],
        water: { y: 0.72, colors: ['#122045', '#0d1836', '#091026'], shimmer: '#ffcf6b', reflect: 0.6 },
        seed: 47,
    },
};

/** Display order; nothing is labelled on the page itself. */
export const sceneOrder = ['bund', 'gugong', 'shenzhen', 'victoria', 'tokyo', 'fuji'];

export const sceneNames: Record<string, Record<string, { name: string; place: string }>> = {
    en: {
        bund: { name: 'The Bund', place: 'Shanghai' },
        gugong: { name: 'The Forbidden City', place: 'Beijing' },
        shenzhen: { name: 'Lianhua Hill Park', place: 'Shenzhen' },
        victoria: { name: 'Victoria Harbour', place: 'Hong Kong' },
        tokyo: { name: 'The Skyline', place: 'Tokyo' },
        fuji: { name: 'Mount Fuji', place: 'Yamanashi' },
    },
    zh: {
        bund: { name: '外滩', place: '上海' },
        gugong: { name: '故宫', place: '北京' },
        shenzhen: { name: '莲花山公园', place: '深圳' },
        victoria: { name: '维多利亚港', place: '香港' },
        tokyo: { name: '东京天际线', place: '东京' },
        fuji: { name: '富士山', place: '山梨' },
    },
    ja: {
        bund: { name: '外灘', place: '上海' },
        gugong: { name: '故宮', place: '北京' },
        shenzhen: { name: '蓮花山公園', place: '深圳' },
        victoria: { name: 'ビクトリア・ハーバー', place: '香港' },
        tokyo: { name: '東京の街並み', place: '東京' },
        fuji: { name: '富士山', place: '山梨' },
    },
};
