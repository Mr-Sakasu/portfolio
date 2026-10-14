/** Change these independently, then rebuild. No browser preference overrides them. */
export interface SiteAppearance {
  homeLayout: 'journal' | 'bento';
  palette: 'autumn' | 'summer';
  background: 'autumn' | 'fireworks' | 'none';
  intro: boolean;
}

export const siteAppearance: SiteAppearance = {
  homeLayout: 'journal',
  palette: 'autumn',
  background: 'autumn',
  intro: true,
};

export const paletteDetails = {
  autumn: {
    color: '#181410',
  },
  summer: {
    color: '#0a0e17',
  },
} as const;

export const introStorageKey = `portfolio-intro-${siteAppearance.background}`;
