import type { PlaylistTrack } from '../features/playlist/select';

// Site selections are kept outside the generated feed so a refresh cannot erase them.
export const playlistAdditionsById: Record<string, PlaylistTrack[]> = {
  'PLiz-kupUIzB78ViYoU-wQ6iaJ3_1G_ezI': [
    {
      videoId: 'hEhutIEUq8k',
      title: 'We Are Golden',
      artists: 'MIKA',
      thumbnail: 'https://i.ytimg.com/vi/hEhutIEUq8k/hqdefault.jpg',
      url: 'https://www.youtube.com/watch?v=hEhutIEUq8k',
    },
    {
      videoId: 'MN_eYAdfGO8',
      title: 'We Are Golden (Acoustic Version)',
      artists: 'MIKA',
      thumbnail: 'https://i.ytimg.com/vi/MN_eYAdfGO8/hqdefault.jpg',
      url: 'https://www.youtube.com/watch?v=MN_eYAdfGO8',
      publishedAt: '2009-09-21',
      addedAt: '2026-10-24',
    },
  ],
};
