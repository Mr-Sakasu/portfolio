import playlistData from '../../data/generated/ytmusic-playlist.json';
import type { ui } from '../../i18n/ui';

export type PlaylistLocale = keyof typeof ui;

export interface PlaylistTrack {
    videoId?: string;
    title?: string;
    artists?: string;
    album?: string;
    duration?: string;
    thumbnail?: string;
    url?: string;
    publishedAt?: string;
    uploadedAt?: string;
    addedAt?: string;
}

export interface PlaylistData {
    configured?: boolean;
    byLang?: Partial<Record<PlaylistLocale, PlaylistData>>;
    playlists?: PlaylistData[];
    playlistId?: string;
    title?: string;
    description?: string;
    author?: string;
    trackCount?: number;
    duration?: string;
    thumbnail?: string;
    url?: string;
    updatedAt?: string;
    tracks?: PlaylistTrack[];
}

/** The order the playlist page deals a locale's playlists in. */
const playlistOrderByLang: Partial<Record<PlaylistLocale, string[]>> = {
    zh: [
        'PLiz-kupUIzB5Wl6V7K-nHcq0OUOafpUDn',
        'PLiz-kupUIzB5_O-O6c-zNcdKe1BGJVXDZ',
    ],
    en: [
        'PLiz-kupUIzB78ViYoU-wQ6iaJ3_1G_ezI',
    ],
    ja: [
        'PLiz-kupUIzB6CcPtBlm-W9MpMuGw2I3le',
        'PLiz-kupUIzB6fO7Svf1w3dUi3GSss_H6f',
        'PLiz-kupUIzB70ktndKK9cPKR2zz9siN2A',
        'PLiz-kupUIzB5Fo3N3xVwtYsis_U9i4ol3',
        'PLiz-kupUIzB5R2QlsvnTmpFMWXiLVvxtw',
        'PLiz-kupUIzB7o_jAtsyT-iGY8gpQvOWxJ',
        'PLiz-kupUIzB4bOwHGV_WKNPi6m7m2mT8l',
        'PLiz-kupUIzB7x5yWRVSGXdNcRjnDaom6M',
        'PLiz-kupUIzB75wypS-rh2V1ZPLgae3jcu',
    ],
};

/** The one playlist the home page speaks for, where the locale names it. */
const homePlaylistByLang: Partial<Record<PlaylistLocale, string[]>> = {
    ja: ['PLiz-kupUIzB6CcPtBlm-W9MpMuGw2I3le'],
};

const playlistRoot = playlistData as PlaylistData;

const trackTime = (track: PlaylistTrack) => {
    const rawDate = track.publishedAt || track.uploadedAt || track.addedAt || '';
    const timestamp = Date.parse(rawDate);
    return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
};

/** Newest first, and stable within a day so equal dates keep the feed's order. */
export function sortTracks(tracks: PlaylistTrack[] | undefined): PlaylistTrack[] {
    return Array.isArray(tracks)
        ? tracks
            .filter((track) => track?.title)
            .map((track, index) => ({ track, index }))
            .sort((first, second) => {
                const dateDifference = trackTime(second.track) - trackTime(first.track);
                return dateDifference || first.index - second.index;
            })
            .map(({ track }) => track)
        : [];
}

export function playlistCollectionFor(lang: PlaylistLocale): PlaylistData {
    return playlistRoot.byLang?.[lang] ?? playlistRoot;
}

/**
 * The playlists a locale shows, in order. The home variant speaks for one
 * playlist only, so the card in the bento and the page below it cannot end up
 * quoting different music.
 */
export function selectPlaylists(lang: PlaylistLocale, variant: 'home' | 'page'): PlaylistData[] {
    const collection = playlistCollectionFor(lang);
    const sources = Array.isArray(collection.playlists) && collection.playlists.length > 0
        ? collection.playlists
        : [collection];

    const order = playlistOrderByLang[lang] ?? [];
    const ordered = order.length > 0
        ? [...sources].sort((first, second) => {
            const firstOrder = order.indexOf(first.playlistId ?? '');
            const secondOrder = order.indexOf(second.playlistId ?? '');
            return (firstOrder === -1 ? Number.MAX_SAFE_INTEGER : firstOrder)
                - (secondOrder === -1 ? Number.MAX_SAFE_INTEGER : secondOrder);
        })
        : sources;

    const homeOrder = variant === 'home' ? homePlaylistByLang[lang] ?? [] : [];
    return homeOrder.length > 0
        ? ordered.filter((playlist) => homeOrder.includes(playlist.playlistId ?? ''))
        : ordered;
}
