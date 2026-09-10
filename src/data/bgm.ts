import { languages } from '../i18n/ui';

/**
 * Background music. Every track is a YouTube video id, played through the
 * embedded player in src/components/chrome/Bgm.astro rather than a self-hosted
 * file: the platform holds the licence for the upload, so nothing copyrighted
 * is served from this domain.
 *
 * Nothing here plays on its own. Browsers refuse audio that no one asked for,
 * and the player is built inside the ♪ press for exactly that reason — these
 * maps only decide *which* track is playing once the visitor has started it.
 */

export interface Track {
    /** YouTube video id. */
    id: string;
    /**
     * Seconds in, where the track starts and where it returns each time it
     * runs out — the サビ, for a song that has one. Nobody hears an intro
     * here: a scene may only hold the screen for a few seconds, so the music
     * has to arrive already at the good part.
     *
     * Omit it for anything with no サビ to find. Game music is written to
     * loop and is best from the top.
     */
    start?: number;
}

/** Plays wherever nothing more specific is set. */
export const defaultTrack: Track = { id: '3ML2nYnCO0E' }; // Fire◎Flower - halyosy (Piano Cover)

/**
 * One track per scene in the reel, keyed by the ids in sceneOrder.
 *
 * null means "no track chosen yet": the scene stays on whatever the page
 * underneath it is playing, so the music only changes where a choice has
 * actually been made.
 */
export const sceneTracks: Record<string, Track | null> = {
    // 松原みき - 真夜中のドア〜stay with me. City pop, and the genre is the
    // subject: a modern city at night, which is what the scene is.
    bund: { id: 'nuU2YHtxMik', start: 62 },
    // いーあるふぁんくらぶ 〜超絶技巧ピアノアレンジVer.〜
    gugong: { id: '-8gDcwKd3DI', start: 101 },
    // 清华二校門 arrived after the tracks were picked and has none of its own,
    // so it keeps the site default until one is chosen.
    tsinghua: null,
    tianjin: { id: 'W9Fq1HC_5hg', start: 49 }, // 告五人 - 帶我去找夜生活
    // Game music, both of them: written as loops, with no サビ to skip to.
    shenzhen: { id: 'Bw7ggOj9CVs' }, // ポケモン HGSS - しぜんこうえん
    victoria: { id: 'KQ3PzgYN8BI' }, // Pokémon Black/White - Black City
    // The remix climbs the whole way through rather than turning a corner
    // anywhere, so there is no サビ to drop into. It plays from the top.
    // The album cut has no official upload; this is the one on her own channel.
    tokyo: { id: 'Ej1fyNdnuFI' }, // 椎名林檎 - 丸ノ内サディスティック (Miso Remix)
    fuji: { id: 'Sw1Flgub9s8', start: 48 }, // ヨルシカ - 春泥棒
};

/**
 * One track per page, keyed by the first path segment after the language —
 * '' being the home page. Unlisted or null falls through to defaultTrack.
 */
export const pageTracks: Record<string, Track | null> = {
    '': null, // home
    stars: null,
    globe: null,
    scenes: null,
    playlist: null,
    bandit: null,
    hanoi: null,
    projects: null,
};

/** '/ja/stars/' -> 'stars', '/en/' -> '', '/' -> ''. */
export function pageKey(pathname: string): string {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length && parts[0] in languages) parts.shift();
    return parts[0] ?? '';
}

export function trackForPath(pathname: string): Track {
    return pageTracks[pageKey(pathname)] ?? defaultTrack;
}

/** A scene without a track of its own keeps the page's. */
export function trackForScene(sceneId: string, pathname: string): Track {
    return sceneTracks[sceneId] ?? trackForPath(pathname);
}

/** Two tracks are the same music from the same place. */
export function sameTrack(a: Track | null, b: Track | null): boolean {
    if (!a || !b) return a === b;
    return a.id === b.id && (a.start ?? 0) === (b.start ?? 0);
}
