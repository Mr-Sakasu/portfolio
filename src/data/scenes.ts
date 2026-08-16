export type LayerKind = 'city' | 'peaks' | 'cone' | 'hills' | 'shore' | 'bamboo' | 'trees';
export type Weather = 'snow' | 'rain' | 'fireflies' | 'petals';

export interface SceneLayer {
    kind: LayerKind;
    /** Horizon height, 0 (top) to 1 (bottom). */
    y: number;
    /** Peak height as a fraction of the canvas. */
    amp: number;
    color: string;
    /** Optional second color: lit windows, snow caps, highlights. */
    accent?: string;
}

export interface ScenePixels {
    /** Sky bands, top to bottom. Rendered with ordered dithering between bands. */
    sky: string[];
    celestial?: { kind: 'sun' | 'moon'; x: number; y: number; r: number; color: string; glow: string };
    stars?: number;
    aurora?: string[];
    fog?: { color: string; y: number; rows: number };
    layers: SceneLayer[];
    water?: { y: number; colors: string[]; shimmer: string };
    weather?: Weather;
    /** Deterministic terrain seed. */
    seed: number;
}

/** Each scene is drawn procedurally at low resolution, then scaled up with hard pixel edges. */
export const scenePixels: Record<string, ScenePixels> = {
    bund: {
        sky: ['#0b1030', '#1b2a5e', '#4b3a7d', '#a8547a', '#e08a6d'],
        celestial: { kind: 'moon', x: 0.18, y: 0.2, r: 5, color: '#fff3d0', glow: '#ffd9a0' },
        stars: 40,
        layers: [
            { kind: 'city', y: 0.62, amp: 0.3, color: '#171c3a', accent: '#ffd98a' },
            { kind: 'city', y: 0.66, amp: 0.16, color: '#0c0f24', accent: '#ffe6a8' },
        ],
        water: { y: 0.72, colors: ['#16204a', '#101838', '#0b1029'], shimmer: '#ffd98a' },
        seed: 11,
    },
    lijiang: {
        sky: ['#e7f0ef', '#cfe0dd', '#a9c4c0', '#8aa9a4'],
        celestial: { kind: 'sun', x: 0.72, y: 0.22, r: 4, color: '#fffdf0', glow: '#ffffff' },
        fog: { color: '#e2ecea', y: 0.5, rows: 6 },
        layers: [
            { kind: 'peaks', y: 0.58, amp: 0.34, color: '#7d9a95' },
            { kind: 'peaks', y: 0.63, amp: 0.26, color: '#55736f' },
            { kind: 'peaks', y: 0.68, amp: 0.18, color: '#34504c' },
        ],
        water: { y: 0.74, colors: ['#8fada8', '#7b9a95', '#6a8884'], shimmer: '#e7f0ef' },
        seed: 23,
    },
    xihu: {
        sky: ['#ffd9b0', '#ffb894', '#e08a9a', '#8a6fa8', '#4a4a80'],
        celestial: { kind: 'sun', x: 0.3, y: 0.42, r: 7, color: '#fffbe8', glow: '#ff7a4c' },
        layers: [
            { kind: 'hills', y: 0.56, amp: 0.12, color: '#6a5a8a' },
            { kind: 'trees', y: 0.62, amp: 0.1, color: '#3c3560', accent: '#57487d' },
        ],
        water: { y: 0.66, colors: ['#8a6f9e', '#6f5a86', '#54446a'], shimmer: '#ffd9a0' },
        weather: 'petals',
        seed: 7,
    },
    zhangjiajie: {
        sky: ['#dbe6ec', '#bccdd6', '#94adb8', '#6d8894'],
        fog: { color: '#eaf2f6', y: 0.55, rows: 7 },
        layers: [
            { kind: 'peaks', y: 0.46, amp: 0.36, color: '#6a8492' },
            { kind: 'peaks', y: 0.6, amp: 0.34, color: '#44606c' },
            { kind: 'peaks', y: 0.82, amp: 0.3, color: '#22363f' },
        ],
        seed: 41,
    },
    fuji: {
        sky: ['#12203f', '#2b4a7a', '#7a7fae', '#e8a6a0', '#ffd2b0'],
        celestial: { kind: 'sun', x: 0.76, y: 0.34, r: 5, color: '#fff2d8', glow: '#ffb894' },
        stars: 14,
        layers: [
            { kind: 'cone', y: 0.66, amp: 0.42, color: '#26304f', accent: '#f2e8f0' },
            { kind: 'hills', y: 0.7, amp: 0.08, color: '#141a2e' },
        ],
        water: { y: 0.74, colors: ['#2a3a5e', '#1e2c48', '#141d33'], shimmer: '#ffc9a8' },
        seed: 3,
    },
    arashiyama: {
        sky: ['#1c3320', '#2f4a26', '#4f7233', '#84a447'],
        celestial: { kind: 'sun', x: 0.5, y: 0.26, r: 4, color: '#f2ffcf', glow: '#b6d96a' },
        layers: [
            { kind: 'bamboo', y: 1.0, amp: 0.0, color: '#2b4020', accent: '#6f9a3c' },
        ],
        weather: 'fireflies',
        seed: 19,
    },
    biei: {
        sky: ['#7ea9dc', '#a9c6e6', '#cfe0ef', '#e8f0f8'],
        layers: [
            { kind: 'hills', y: 0.6, amp: 0.14, color: '#5f7fa8' },
            { kind: 'trees', y: 0.66, amp: 0.14, color: '#3f5a7d', accent: '#e8f0f8' },
        ],
        water: { y: 0.7, colors: ['#63b5c4', '#4d9dae', '#3a8496'], shimmer: '#d8f4f8' },
        weather: 'snow',
        seed: 29,
    },
    odaiba: {
        sky: ['#04081a', '#0c1436', '#1d2350', '#3a2a5e'],
        stars: 55,
        layers: [
            { kind: 'city', y: 0.58, amp: 0.26, color: '#0a0f26', accent: '#7fd4ff' },
            { kind: 'city', y: 0.64, amp: 0.16, color: '#060a1a', accent: '#ffd98a' },
        ],
        water: { y: 0.7, colors: ['#0c1430', '#0a1130', '#070c22'], shimmer: '#7fd4ff' },
        seed: 13,
    },
    victoria: {
        sky: ['#050d1e', '#0e1c38', '#1e2c50', '#3f3468'],
        stars: 30,
        layers: [
            { kind: 'peaks', y: 0.5, amp: 0.2, color: '#0b1226' },
            { kind: 'city', y: 0.6, amp: 0.3, color: '#070d1c', accent: '#ffcf6b' },
        ],
        water: { y: 0.68, colors: ['#0d1832', '#0a1228', '#070d1e'], shimmer: '#ffcf6b' },
        seed: 47,
    },
    marina: {
        sky: ['#101c3a', '#25386b', '#5a4d8c', '#9a6f9e', '#e0a08a'],
        celestial: { kind: 'sun', x: 0.24, y: 0.4, r: 5, color: '#ffe6c0', glow: '#e08a6d' },
        layers: [
            { kind: 'city', y: 0.62, amp: 0.28, color: '#121a36', accent: '#9be7d4' },
            { kind: 'trees', y: 0.66, amp: 0.16, color: '#0d1428', accent: '#5fd8b4' },
        ],
        water: { y: 0.72, colors: ['#1b2a52', '#152142', '#0f1830'], shimmer: '#9be7d4' },
        seed: 5,
    },
    halong: {
        sky: ['#d6e8ea', '#b4cfd4', '#8fb2b8', '#6d949c'],
        celestial: { kind: 'sun', x: 0.66, y: 0.28, r: 4, color: '#fffdf2', glow: '#e8f4f2' },
        fog: { color: '#dceaec', y: 0.58, rows: 4 },
        layers: [
            { kind: 'peaks', y: 0.6, amp: 0.22, color: '#5d8087' },
            { kind: 'peaks', y: 0.66, amp: 0.16, color: '#3c5f66' },
        ],
        water: { y: 0.7, colors: ['#7fa3a8', '#6b9096', '#587c82'], shimmer: '#eaf6f6' },
        seed: 31,
    },
    aurora: {
        sky: ['#01040f', '#04101f', '#062032', '#083040'],
        stars: 70,
        aurora: ['#7dffbe', '#3fd9a0', '#2a9ec4'],
        layers: [
            { kind: 'peaks', y: 0.66, amp: 0.24, color: '#0a1526', accent: '#cfe6f0' },
            { kind: 'trees', y: 0.74, amp: 0.12, color: '#050b16' },
        ],
        water: { y: 0.8, colors: ['#07131f', '#050f1a', '#040a14'], shimmer: '#7dffbe' },
        seed: 59,
    },
};

/** Display order; groups are kept for ordering only, no headings are drawn. */
export const sceneOrder = [
    'bund',
    'lijiang',
    'xihu',
    'zhangjiajie',
    'fuji',
    'arashiyama',
    'biei',
    'odaiba',
    'victoria',
    'marina',
    'halong',
    'aurora',
];

export const sceneNames: Record<string, Record<string, { name: string; place: string }>> = {
    en: {
        bund: { name: 'The Bund', place: 'Shanghai' },
        lijiang: { name: 'Li River', place: 'Guilin' },
        xihu: { name: 'West Lake', place: 'Hangzhou' },
        zhangjiajie: { name: 'Zhangjiajie', place: 'Hunan' },
        fuji: { name: 'Mt. Fuji', place: 'Lake Kawaguchi' },
        arashiyama: { name: 'Bamboo Grove', place: 'Arashiyama, Kyoto' },
        biei: { name: 'Blue Pond', place: 'Biei, Hokkaido' },
        odaiba: { name: 'Rainbow Bridge', place: 'Odaiba, Tokyo' },
        victoria: { name: 'Victoria Harbour', place: 'Hong Kong' },
        marina: { name: 'Marina Bay', place: 'Singapore' },
        halong: { name: 'Ha Long Bay', place: 'Vietnam' },
        aurora: { name: 'Northern Lights', place: 'Tromsø, Norway' },
    },
    zh: {
        bund: { name: '外滩', place: '上海' },
        lijiang: { name: '漓江', place: '桂林' },
        xihu: { name: '西湖', place: '杭州' },
        zhangjiajie: { name: '张家界', place: '湖南' },
        fuji: { name: '富士山', place: '河口湖' },
        arashiyama: { name: '竹林小径', place: '京都·岚山' },
        biei: { name: '青池', place: '北海道·美瑛' },
        odaiba: { name: '彩虹大桥', place: '东京·台场' },
        victoria: { name: '维多利亚港', place: '香港' },
        marina: { name: '滨海湾', place: '新加坡' },
        halong: { name: '下龙湾', place: '越南' },
        aurora: { name: '北极光', place: '挪威·特罗姆瑟' },
    },
    ja: {
        bund: { name: '外灘', place: '上海' },
        lijiang: { name: '漓江', place: '桂林' },
        xihu: { name: '西湖', place: '杭州' },
        zhangjiajie: { name: '張家界', place: '湖南省' },
        fuji: { name: '富士山', place: '河口湖' },
        arashiyama: { name: '竹林の小径', place: '京都・嵐山' },
        biei: { name: '青い池', place: '北海道・美瑛' },
        odaiba: { name: 'レインボーブリッジ', place: '東京・お台場' },
        victoria: { name: 'ビクトリア・ハーバー', place: '香港' },
        marina: { name: 'マリーナ・ベイ', place: 'シンガポール' },
        halong: { name: 'ハロン湾', place: 'ベトナム' },
        aurora: { name: 'オーロラ', place: 'ノルウェー・トロムソ' },
    },
};
