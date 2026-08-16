export interface Scene {
    id: string;
    name: string;
    place: string;
    note: string;
    when: string;
}

export interface SceneGroup {
    id: string;
    title: string;
    scenes: Scene[];
}

/** Horizon silhouettes, so cards in the same group don't repeat one shape. */
export const sceneRidges = {
    /** Blocky skyline for city views. */
    city: 'polygon(0 70%,8% 70%,8% 46%,16% 46%,16% 62%,24% 62%,24% 30%,31% 30%,31% 58%,42% 58%,42% 40%,50% 40%,50% 66%,60% 66%,60% 22%,66% 22%,66% 60%,76% 60%,76% 48%,86% 48%,86% 68%,100% 68%,100% 100%,0 100%)',
    /** Narrow, steep karst-style peaks. */
    karst: 'polygon(0 78%,7% 44%,13% 74%,22% 30%,30% 70%,38% 48%,46% 76%,56% 36%,64% 72%,74% 50%,84% 74%,92% 42%,100% 70%,100% 100%,0 100%)',
    /** A single symmetric cone. */
    cone: 'polygon(0 84%,18% 80%,38% 34%,46% 24%,54% 24%,62% 34%,82% 78%,100% 82%,100% 100%,0 100%)',
    /** Soft rolling hills. */
    hills: 'polygon(0 74%,12% 62%,26% 72%,40% 56%,54% 70%,68% 58%,82% 72%,100% 62%,100% 100%,0 100%)',
    /** Low, flat shoreline. */
    shore: 'polygon(0 82%,20% 78%,34% 84%,52% 76%,68% 84%,84% 78%,100% 84%,100% 100%,0 100%)',
} as const;

export type RidgeKind = keyof typeof sceneRidges;

/** Look of each scene card: sky gradient plus a silhouette drawn in CSS. */
export const sceneArt: Record<string, { sky: string; land: string; glow: string; glyph: string; ridge: RidgeKind }> = {
    bund: { sky: 'linear-gradient(180deg,#0b1a3a 0%,#2a2a63 55%,#c2557a 100%)', land: '#070b18', glow: '#ffd7a1', glyph: '🌃', ridge: 'city' },
    lijiang: { sky: 'linear-gradient(180deg,#dfe9ec 0%,#a9c3c6 60%,#6f8f8c 100%)', land: '#2f4442', glow: '#ffffff', glyph: '⛰️', ridge: 'karst' },
    xihu: { sky: 'linear-gradient(180deg,#f5d6c0 0%,#d7a1a8 55%,#6d6f9b 100%)', land: '#28304a', glow: '#ffe6c2', glyph: '🪷', ridge: 'shore' },
    zhangjiajie: { sky: 'linear-gradient(180deg,#c9d6de 0%,#8fa3ad 55%,#4d6470 100%)', land: '#1f2c33', glow: '#eaf2f5', glyph: '☁️', ridge: 'karst' },
    fuji: { sky: 'linear-gradient(180deg,#123 0%,#2b4a7a 50%,#f0a6a0 100%)', land: '#101725', glow: '#ffd9d1', glyph: '🗻', ridge: 'cone' },
    arashiyama: { sky: 'linear-gradient(180deg,#1d3320 0%,#3f5f34 55%,#94b25a 100%)', land: '#0e1a10', glow: '#d8f0a0', glyph: '🎋', ridge: 'hills' },
    biei: { sky: 'linear-gradient(180deg,#7fa8d8 0%,#b9cfe8 55%,#dfe9f5 100%)', land: '#3a4f6b', glow: '#ffffff', glyph: '❄️', ridge: 'hills' },
    odaiba: { sky: 'linear-gradient(180deg,#050a1a 0%,#122048 55%,#3b2a5e 100%)', land: '#04070f', glow: '#8fd7ff', glyph: '🌉', ridge: 'city' },
    victoria: { sky: 'linear-gradient(180deg,#06101f 0%,#152a48 55%,#4a3a6b 100%)', land: '#050910', glow: '#ffcf6b', glyph: '✨', ridge: 'city' },
    marina: { sky: 'linear-gradient(180deg,#101a35 0%,#2b3f6e 55%,#8a6f9e 100%)', land: '#080d1a', glow: '#9be7d4', glyph: '💠', ridge: 'city' },
    halong: { sky: 'linear-gradient(180deg,#cfe3e6 0%,#96b7bd 55%,#5c7d84 100%)', land: '#22383c', glow: '#f2fbfc', glyph: '⛵', ridge: 'karst' },
    aurora: { sky: 'linear-gradient(180deg,#020814 0%,#0b2c33 50%,#124f45 100%)', land: '#030711', glow: '#7dffbe', glyph: '🌌', ridge: 'shore' },
};

export const sceneGroups: Record<string, SceneGroup[]> = {
    en: [
        {
            id: 'china',
            title: 'China',
            scenes: [
                { id: 'bund', name: 'The Bund', place: 'Shanghai', note: 'Colonial facades on one bank, Pudong towers on the other.', when: 'Blue hour' },
                { id: 'lijiang', name: 'Li River', place: 'Guilin', note: 'Karst peaks fading into each other over quiet water.', when: 'Morning mist' },
                { id: 'xihu', name: 'West Lake', place: 'Hangzhou', note: 'Causeways, willows, and a pagoda catching the last light.', when: 'Sunset' },
                { id: 'zhangjiajie', name: 'Zhangjiajie', place: 'Hunan', note: 'Sandstone pillars standing above a sea of cloud.', when: 'After rain' },
            ],
        },
        {
            id: 'japan',
            title: 'Japan',
            scenes: [
                { id: 'fuji', name: 'Mt. Fuji', place: 'Lake Kawaguchi', note: 'The cone doubled in still water, pink at first light.', when: 'Dawn' },
                { id: 'arashiyama', name: 'Bamboo Grove', place: 'Arashiyama, Kyoto', note: 'Green light filtered through a corridor of stems.', when: 'Early morning' },
                { id: 'biei', name: 'Blue Pond', place: 'Biei, Hokkaido', note: 'Bare larch trunks in impossible turquoise water.', when: 'Late autumn' },
                { id: 'odaiba', name: 'Rainbow Bridge', place: 'Odaiba, Tokyo', note: 'The bay skyline reading like a circuit board.', when: 'Night' },
            ],
        },
        {
            id: 'elsewhere',
            title: 'Elsewhere',
            scenes: [
                { id: 'victoria', name: 'Victoria Harbour', place: 'Hong Kong', note: 'A wall of light rising straight out of the water.', when: 'Night' },
                { id: 'marina', name: 'Marina Bay', place: 'Singapore', note: 'Supertrees and glass reflecting a warm equatorial dusk.', when: 'Dusk' },
                { id: 'halong', name: 'Ha Long Bay', place: 'Vietnam', note: 'Limestone islands drifting in and out of the haze.', when: 'Morning' },
                { id: 'aurora', name: 'Northern Lights', place: 'Tromsø, Norway', note: 'Green curtains moving faster than a camera expects.', when: 'Winter night' },
            ],
        },
    ],
    zh: [
        {
            id: 'china',
            title: '中国',
            scenes: [
                { id: 'bund', name: '外滩', place: '上海', note: '一岸是万国建筑，一岸是浦东天际线。', when: '蓝调时刻' },
                { id: 'lijiang', name: '漓江', place: '桂林', note: '喀斯特山峰层层淡去，水面安静如镜。', when: '晨雾' },
                { id: 'xihu', name: '西湖', place: '杭州', note: '长堤、垂柳，雷峰塔接住最后一缕光。', when: '日落' },
                { id: 'zhangjiajie', name: '张家界', place: '湖南', note: '砂岩石柱立在云海之上。', when: '雨后' },
            ],
        },
        {
            id: 'japan',
            title: '日本',
            scenes: [
                { id: 'fuji', name: '富士山', place: '河口湖', note: '山影倒映在静水里，晨光把它染成粉色。', when: '黎明' },
                { id: 'arashiyama', name: '竹林小径', place: '京都·岚山', note: '光穿过竹竿，整条路都是绿的。', when: '清晨' },
                { id: 'biei', name: '青池', place: '北海道·美瑛', note: '枯树立在不可思议的青蓝色水中。', when: '深秋' },
                { id: 'odaiba', name: '彩虹大桥', place: '东京·台场', note: '湾岸的灯光排布得像一块电路板。', when: '夜晚' },
            ],
        },
        {
            id: 'elsewhere',
            title: '其他地方',
            scenes: [
                { id: 'victoria', name: '维多利亚港', place: '香港', note: '一整面灯墙直接从海面升起来。', when: '夜晚' },
                { id: 'marina', name: '滨海湾', place: '新加坡', note: '擎天树与玻璃幕墙映着赤道的暖色黄昏。', when: '黄昏' },
                { id: 'halong', name: '下龙湾', place: '越南', note: '石灰岩岛屿在薄雾中若隐若现。', when: '早晨' },
                { id: 'aurora', name: '北极光', place: '挪威·特罗姆瑟', note: '绿色的帘幕比相机反应得还快。', when: '冬夜' },
            ],
        },
    ],
    ja: [
        {
            id: 'china',
            title: '中国',
            scenes: [
                { id: 'bund', name: '外灘（バンド）', place: '上海', note: '片岸は歴史的建築、対岸は浦東の摩天楼。', when: 'ブルーアワー' },
                { id: 'lijiang', name: '漓江', place: '桂林', note: 'カルスト地形の山が水面の上で淡く重なる。', when: '朝もや' },
                { id: 'xihu', name: '西湖', place: '杭州', note: '堤と柳、そして最後の光を受ける塔。', when: '夕暮れ' },
                { id: 'zhangjiajie', name: '張家界', place: '湖南省', note: '雲海の上に立つ砂岩の柱群。', when: '雨上がり' },
            ],
        },
        {
            id: 'japan',
            title: '日本',
            scenes: [
                { id: 'fuji', name: '富士山', place: '河口湖', note: '静かな湖面に映る逆さ富士が朝日で紅く染まる。', when: '夜明け' },
                { id: 'arashiyama', name: '竹林の小径', place: '京都・嵐山', note: '竹の間から差す光で道全体が緑になる。', when: '早朝' },
                { id: 'biei', name: '青い池', place: '北海道・美瑛', note: '立ち枯れの木と、ありえないほど青い水。', when: '晩秋' },
                { id: 'odaiba', name: 'レインボーブリッジ', place: '東京・お台場', note: '湾岸の灯りが基板の回路みたいに並ぶ。', when: '夜' },
            ],
        },
        {
            id: 'elsewhere',
            title: 'その他',
            scenes: [
                { id: 'victoria', name: 'ビクトリア・ハーバー', place: '香港', note: '光の壁が海からそのまま立ち上がる。', when: '夜' },
                { id: 'marina', name: 'マリーナ・ベイ', place: 'シンガポール', note: 'スーパーツリーとガラスに映る赤道の夕暮れ。', when: '薄暮' },
                { id: 'halong', name: 'ハロン湾', place: 'ベトナム', note: '石灰岩の島が霞の中に現れては消える。', when: '朝' },
                { id: 'aurora', name: 'オーロラ', place: 'ノルウェー・トロムソ', note: '緑のカーテンがカメラの想定より速く動く。', when: '冬の夜' },
            ],
        },
    ],
};
