type PlaylistWindow = Window & {
  __playlistPlayerHookAttached?: boolean;
};

const playlistWindow = window as PlaylistWindow;

const buildEmbedUrl = (videoId: string, playlistId: string) => {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    playsinline: '1',
  });
  if (playlistId) {
    params.set('list', playlistId);
  }
  return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
};

const clearPlaylistPlayers = () => {
  document.querySelectorAll<HTMLIFrameElement>('[data-player-frame]').forEach((frame) => {
    frame.src = '';
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
    const player = card?.querySelector<HTMLElement>('[data-playlist-player]');
    const frame = card?.querySelector<HTMLIFrameElement>('[data-player-frame]');
    const title = card?.querySelector<HTMLElement>('[data-player-title]');
    const videoId = button.dataset.videoId ?? '';

    if (!card || !player || !frame || !videoId) {
      return;
    }

    card.querySelectorAll<HTMLButtonElement>('[data-play-button]').forEach((item) => {
      item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
    });

    if (title) {
      title.textContent = button.dataset.trackTitle ?? '';
    }
    frame.src = buildEmbedUrl(videoId, button.dataset.playlistId ?? '');
    player.classList.remove('hidden');
    player.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  document.addEventListener('astro:before-swap', clearPlaylistPlayers);
  playlistWindow.__playlistPlayerHookAttached = true;
};
