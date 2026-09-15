/**
 * Plays a track where it is listed — in the card on the home page, and in the
 * playlist page's own list.
 *
 * An iframe given ?autoplay=1 on click does not actually play: the browser's
 * autoplay policy stops it and the visitor is left looking at a poster with a
 * play button on it. So this drives YouTube's IFrame API instead, the way the
 * background music does: the player is built once, and a press calls
 * loadVideoById on a player that already exists, which counts as the visitor
 * starting it.
 */
type PlaylistWindow = Window & {
  __playlistPlayerHookAttached?: boolean;
  __playlistPlayers?: Map<HTMLElement, YouTubePlayer>;
  YT?: {
    Player: new (element: HTMLElement | string, options: Record<string, unknown>) => YouTubePlayer;
    PlayerState?: Record<string, number>;
  };
  onYouTubeIframeAPIReady?: () => void;
  __bgm?: { player?: { pauseVideo?: () => void } | null };
};

interface YouTubePlayer {
  loadVideoById: (options: { videoId: string; startSeconds?: number }) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo?: () => void;
  unMute?: () => void;
  getPlayerState?: () => number;
}

/** YT.PlayerState, the three values this cares about. */
const ENDED = 0;
const PLAYING = 1;
const BUFFERING = 3;

/** The press that started a track is the press that stops it. */
const markButtons = (card: HTMLElement, videoId: string, playing: boolean) => {
  card.querySelectorAll<HTMLButtonElement>('[data-play-button]').forEach((item) => {
    const isCurrent = item.dataset.videoId === videoId;
    item.setAttribute('aria-pressed', isCurrent && playing ? 'true' : 'false');
  });
};

const playlistWindow = window as PlaylistWindow;

/** Resolves once YT.Player can be constructed; loads the API the first time. */
const apiReady = () => new Promise<void>((resolve) => {
  if (playlistWindow.YT?.Player) {
    resolve();
    return;
  }

  // The API calls this global exactly once, so chain rather than overwrite:
  // the background music is waiting on it too.
  const previous = playlistWindow.onYouTubeIframeAPIReady;
  playlistWindow.onYouTubeIframeAPIReady = () => {
    if (typeof previous === 'function') previous();
    resolve();
  };

  if (!document.querySelector('script[data-youtube-api]')) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.dataset.youtubeApi = '1';
    document.head.appendChild(tag);
  }
});

/**
 * The background music and a track are both audio. Claiming the audio is a
 * protocol the music already understands — it stands down for any claim that
 * is not its own, and repaints its button while it does.
 */
const claimAudio = () => {
  try {
    const channel = new BroadcastChannel('portfolio-bgm-channel');
    channel.postMessage({ type: 'claim', id: `playlist-${Date.now()}` });
    channel.close();
  } catch {
    // Older browser: silence the player directly instead.
    playlistWindow.__bgm?.player?.pauseVideo?.();
  }
};

const players = playlistWindow.__playlistPlayers ?? (playlistWindow.__playlistPlayers = new Map());

/** The player for one card, built on the first press and kept for the rest. */
const playerFor = async (card: HTMLElement, videoId: string) => {
  const existing = players.get(card);
  if (existing) {
    existing.loadVideoById({ videoId });
    existing.unMute?.();
    return existing;
  }

  const mount = card.querySelector<HTMLElement>('[data-player-mount]');
  if (!mount) return null;

  await apiReady();
  const YT = playlistWindow.YT;
  if (!YT?.Player) return null;

  return new Promise<YouTubePlayer | null>((resolve) => {
    const player = new YT.Player(mount, {
      videoId,
      host: 'https://www.youtube-nocookie.com',
      playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
      events: {
        onReady: (event: { target: YouTubePlayer }) => {
          event.target.unMute?.();
          event.target.playVideo();
          resolve(event.target);
        },
        // The visitor can also stop it in the player's own controls, or the
        // track can simply run out; the button follows either way.
        onStateChange: (event: { data: number }) => {
          const current = card.dataset.playingVideo ?? '';
          if (!current) return;
          if (event.data === ENDED) {
            delete card.dataset.playingVideo;
            markButtons(card, current, false);
            return;
          }
          markButtons(card, current, event.data === PLAYING || event.data === BUFFERING);
        },
      },
    });
    players.set(card, player);
  });
};

const stopPlaylistPlayers = () => {
  players.forEach((player) => player.stopVideo?.());
  players.clear();
  document.querySelectorAll<HTMLElement>('[data-playlist-card]').forEach((card) => {
    delete card.dataset.playingVideo;
  });
};

export const initPlaylistPlayer = () => {
  if (playlistWindow.__playlistPlayerHookAttached) {
    return;
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    const playlistTarget = target instanceof Element
      ? target.closest<HTMLElement>('[data-playlist-target]')
      : null;

    if (playlistTarget?.dataset.playlistTarget) {
      document.getElementById(`playlist-${playlistTarget.dataset.playlistTarget}`)
        ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      return;
    }

    const button = target instanceof Element
      ? target.closest<HTMLButtonElement>('[data-play-button]')
      : null;

    if (!button) {
      return;
    }

    const card = button.closest<HTMLElement>('[data-playlist-card]');
    const panel = card?.querySelector<HTMLElement>('[data-playlist-player]');
    const title = card?.querySelector<HTMLElement>('[data-player-title]');
    const videoId = button.dataset.videoId ?? '';

    if (!card || !panel || !videoId) {
      return;
    }

    const player = players.get(card);
    const sameTrack = card.dataset.playingVideo === videoId;

    // The same button again: stop it, and leave it where it was so the next
    // press picks the track up rather than starting it over.
    if (player && sameTrack) {
      const state = player.getPlayerState?.() ?? -1;
      if (state === PLAYING || state === BUFFERING) {
        player.pauseVideo();
        markButtons(card, videoId, false);
      } else {
        player.playVideo();
        markButtons(card, videoId, true);
      }
      return;
    }

    card.dataset.playingVideo = videoId;
    markButtons(card, videoId, true);

    if (title) {
      title.textContent = button.dataset.trackTitle ?? '';
    }

    panel.classList.remove('hidden');
    claimAudio();
    void playerFor(card, videoId);
    panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  document.addEventListener('astro:before-swap', stopPlaylistPlayers);
  playlistWindow.__playlistPlayerHookAttached = true;
};
