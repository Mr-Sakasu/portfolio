import type { PlaylistData, PlaylistTrack } from './select';

// Keep the existing artist attribution, including known covers, consistent
// between the chart and the track sections.
const englishArtistNameOverrides: Record<string, string> = {
  'AbbaVEVO': 'ABBA',
  'billyjoelVEVO': 'Billy Joel',
  'DefTech004': 'Def Tech',
  'IBeLovinTheJ5': 'The Jackson 5',
  'JFlaMusic': 'J.Fla',
  'JustinBieberVEVO': 'Justin Bieber',
  'KnaanVEVO': "K'NAAN",
  'littlemixVEVO': 'Little Mix',
  'MIKAVEVO': 'MIKA',
  'MKTOVEVO': 'MKTO',
  'oasisvideos': 'Oasis',
  'PentatonixVEVO': 'Pentatonix',
  'PostmodernJukebox': 'Postmodern Jukebox',
  'Queen Official': 'Queen',
  'RachelPlattenVEVO': 'Rachel Platten',
  'TheKillersVEVO': 'The Killers',
  'TimefliesVEVO': 'Timeflies',
  'VideoHitsBelemBrazil': 'Kylie Minogue',
  'XXxxZakixxXX': 'Weezer',
};
const englishArtistFromTitle = (title: string) => {
  const knownArtists = [
    'Billy Joel',
    'Bruno Mars',
    'Daniel Powter',
    'Dua Lipa',
    'Ed Sheeran',
    'Green Day',
    'James Blunt',
    'John Lennon',
    'Kylie Minogue',
    'Little Mix',
    'MIKA',
    'Oasis',
    'Pentatonix',
    'Rachel Platten',
    'Queen',
    'The Carpenters',
    'The Killers',
    'Weezer',
  ];
  const loweredTitle = title.trim().toLowerCase();
  return knownArtists.find((artist) => {
    const name = artist.toLowerCase();
    return loweredTitle === name || (loweredTitle.startsWith(name) && /^[\s:–—-]/.test(loweredTitle.slice(name.length)));
  }) ?? '';
};
const englishRelatedArtistByVideoId: Record<string, string> = {
  '7RZ12L-sp7g': 'Maroon 5',
  // The track titles identify the performers rather than their upload channels.
  'EKHg6GJAxjA': 'JAWNY',
  'NwOnHxFs9ns': 'Mackenzie Ziegler',
  'CLnuZRbMQ9Q': 'Travis',
  // Artist credit in https://www.youtube.com/watch?v=EYj2ZY1lsXs
  'EYj2ZY1lsXs': 'INNXCENCE, Sxilwix & TWXNY',
};
const englishRelatedArtistFromTrack = (track: PlaylistTrack) => {
  const videoIdArtist = englishRelatedArtistByVideoId[track.videoId ?? ''];
  if (videoIdArtist) {
    return videoIdArtist;
  }

  const title = (track.title ?? '').trim().toLowerCase();
  if (title === 'memories (feat. ben woodward)') {
    return 'Maroon 5';
  }

  return '';
};
export const englishArtistForTrack = (track: PlaylistTrack, unknownArtist = 'Unknown artist') => {
  // This Christmas upload credits only its channel, not its performer.
  if (track.videoId === 'MpgaWm2pnNs') return unknownArtist;
  const relatedArtist = englishRelatedArtistFromTrack(track);
  if (relatedArtist) {
    return relatedArtist;
  }

  const titleArtist = englishArtistFromTitle(track.title ?? '');
  if (titleArtist) {
    return titleArtist;
  }

  const rawArtist = (track.artists ?? '').trim();
  const mappedArtist = englishArtistNameOverrides[rawArtist] ?? rawArtist;
  const normalizedArtist = mappedArtist
    .replace(/\s*-\s*Topic$/i, '')
    .replace(/VEVO$/i, '')
    .trim();
  return englishArtistNameOverrides[normalizedArtist] ?? (normalizedArtist || unknownArtist);
};

export interface ArtistGroup {
  artist: string;
  sectionId: string;
  tracks: PlaylistTrack[];
  source: PlaylistData;
}

export function groupEnglishTracks(playlists: PlaylistData[], unknownArtist = 'Unknown artist'): ArtistGroup[] {
  const groups = new Map<string, ArtistGroup>();
  const seenVideos = new Set<string>();

  for (const playlist of playlists) {
    for (const track of playlist.tracks ?? []) {
      if (!track.title || (track.videoId && seenVideos.has(track.videoId))) continue;
      if (track.videoId) seenVideos.add(track.videoId);

      const artist = englishArtistForTrack(track, unknownArtist);
      const key = artist.toLowerCase();
      let group = groups.get(key);
      if (!group) {
        group = { artist, sectionId: `artist-${encodeURIComponent(key)}`, tracks: [], source: playlist };
        groups.set(key, group);
      }
      group.tracks.push(track);
    }
  }

  return [...groups.values()].sort((a, b) => b.tracks.length - a.tracks.length || a.artist.localeCompare(b.artist, 'en'));
}
