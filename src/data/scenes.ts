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
        | 'canopy' | 'statue' | 'hall' | 'wall'
        | 'junk' | 'ferry' | 'promenade';
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
    weather?: 'fireflies';
    /** Deterministic terrain seed. */
    seed: number;
}

/** Each scene is drawn procedurally at low resolution, then scaled up with hard pixel edges. */
export const scenePixels: Record<string, ScenePixels> = {
    bund: {
        sky: ['#070a24', '#111a44', '#2b2a62', '#5c3a6e', '#a04f70', '#d97a63'],
        haze: { color: '#e0906a', y: 0.6, strength: 0.5 },
        celestial: { kind: 'moon', x: 0.26, y: 0.16, r: 7, color: '#fff6dc', glow: '#ffd9a0' },
        stars: 70,
        layers: [
            { kind: 'city', y: 0.6, amp: 0.16, color: '#2a2c56', accent: '#ffd98a', haze: 0.26 },
            { kind: 'city', y: 0.64, amp: 0.22, color: '#1d2048', accent: '#ffe0a0', haze: 0.12 },
            { kind: 'city', y: 0.67, amp: 0.13, color: '#111436', accent: '#ffe6b0', haze: 0.04 },
        ],
        landmarks: [
            { kind: 'pearl', x: 0.19, base: 0.7, h: 0.52, body: '#2c2350', light: '#ff5f8a' },
            { kind: 'twist', x: 0.43, base: 0.7, h: 0.6, body: '#232a5c', light: '#9ad4ff' },
            { kind: 'opener', x: 0.55, base: 0.7, h: 0.5, body: '#1d2450', light: '#ffd98a' },
            { kind: 'stepped', x: 0.65, base: 0.7, h: 0.42, body: '#252c5e', light: '#ffe6a8' },
            { kind: 'ferry', x: 0.72, base: 0.84, h: 0.05, body: '#0d1230', light: '#ffd98a', onWater: true },
            { kind: 'promenade', x: 0.5, base: 1, h: 0.2, w: 1, body: '#07091c', light: '#f0c98a', onWater: true },
        ],
        water: { y: 0.7, colors: ['#1a2350', '#141b40', '#0d1230'], shimmer: '#ffd98a', reflect: 0.55 },
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
            { kind: 'hall', x: 0.5, base: 0.84, h: 0.26, body: '#b0402f', light: '#e8b44c' },
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
                x: 0.46,
                base: 0.73,
                h: 0.1,
                body: '#4c6a86',
                light: '#e8eef2',
                colors: ['#c8443c', '#e0a23a', '#2f6fae', '#cfd8de'],
            },
        ],
        seed: 61,
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
export const sceneOrder = ['bund', 'gugong', 'shenzhen', 'victoria'];

export const sceneNames: Record<string, Record<string, { name: string; place: string }>> = {
    en: {
        bund: { name: 'The Bund', place: 'Shanghai' },
        gugong: { name: 'The Forbidden City', place: 'Beijing' },
        shenzhen: { name: 'Lianhua Hill Park', place: 'Shenzhen' },
        victoria: { name: 'Victoria Harbour', place: 'Hong Kong' },
    },
    zh: {
        bund: { name: '外滩', place: '上海' },
        gugong: { name: '故宫', place: '北京' },
        shenzhen: { name: '莲花山公园', place: '深圳' },
        victoria: { name: '维多利亚港', place: '香港' },
    },
    ja: {
        bund: { name: '外灘', place: '上海' },
        gugong: { name: '故宮', place: '北京' },
        shenzhen: { name: '蓮花山公園', place: '深圳' },
        victoria: { name: 'ビクトリア・ハーバー', place: '香港' },
    },
};
