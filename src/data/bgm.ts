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

/** Plays wherever nothing more specific is set. */
export const defaultTrack = '3ML2nYnCO0E'; // Fire◎Flower - halyosy (Piano Cover)

/**
 * One track per scene in the reel, keyed by the ids in sceneOrder.
 *
 * null means "no track chosen yet": the scene stays on whatever the page
 * underneath it is playing, so the music only changes where a choice has
 * actually been made. Drop a video id in to give a scene its own track.
 */
export const sceneTracks: Record<string, string | null> = {
    // Perrey & Kingsley, 1967. The Moog record the Electrical Parade was built
    // on — the neon over the Huangpu, forty years early.
    bund: '7lXFjnw5h34', // Baroque Hoedown
    gugong: 'bq-zpXAiyKQ', // Classical Chinese Music: Guqin, Erhu, Guzheng
    tianjin: 'W9Fq1HC_5hg', // 告五人 - 帶我去找夜生活
    shenzhen: 'Bw7ggOj9CVs', // ポケモン HGSS - しぜんこうえん
    victoria: 'KQ3PzgYN8BI', // Pokémon Black/White - Black City
    // The album cut has no official upload; this is the one on Shiina Ringo's
    // own channel.
    tokyo: 'Ej1fyNdnuFI', // 椎名林檎 - 丸ノ内サディスティック (Miso Remix)
    fuji: 'Sw1Flgub9s8', // ヨルシカ - 春泥棒
};

/**
 * One track per page, keyed by the first path segment after the language —
 * '' being the home page. Unlisted or null falls through to defaultTrack.
 */
export const pageTracks: Record<string, string | null> = {
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

export function trackForPath(pathname: string): string {
    return pageTracks[pageKey(pathname)] ?? defaultTrack;
}

/** A scene without a track of its own keeps the page's. */
export function trackForScene(sceneId: string, pathname: string): string {
    return sceneTracks[sceneId] ?? trackForPath(pathname);
}
