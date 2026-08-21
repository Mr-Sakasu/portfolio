const homeWindow = window;

const initProjectVideos = () => {
  const videos = Array.from(document.querySelectorAll('[data-project-video]'));
  if (!videos.length) return;

  const playVideo = (video) => {
    if (!(video instanceof HTMLVideoElement)) return;
    if (!video.src && video.dataset.src) {
      video.src = video.dataset.src;
      video.load();
    }
    video.muted = true;
    video.play().catch(() => {
      // Some browsers defer autoplay until the video is visible or the user interacts.
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = homeWindow.__projectVideoObserver ?? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!(entry.target instanceof HTMLVideoElement)) continue;
        if (entry.isIntersecting) {
          playVideo(entry.target);
        } else {
          entry.target.pause();
        }
      }
    }, { rootMargin: '200px 0px', threshold: 0.2 });
    homeWindow.__projectVideoObserver = observer;

    videos.forEach((video) => {
      if (video.dataset.projectVideoBound === 'true') return;
      video.dataset.projectVideoBound = 'true';
      observer.observe(video);
    });
    return;
  }

  videos.forEach(playVideo);
};

const heroTypewriterState = homeWindow.__heroTypewriterState ?? {
  element: null,
  running: false,
  completed: false,
  timeouts: [],
  runId: 0,
};
homeWindow.__heroTypewriterState = heroTypewriterState;

const clearHeroTypewriterTimers = () => {
  for (const timeoutId of heroTypewriterState.timeouts) {
    window.clearTimeout(timeoutId);
  }
  heroTypewriterState.timeouts = [];
  heroTypewriterState.running = false;
};

const queueHeroTypewriterStep = (callback, delay) => {
  const timeoutId = window.setTimeout(() => {
    heroTypewriterState.timeouts = heroTypewriterState.timeouts.filter((id) => id !== timeoutId);
    callback();
  }, delay);
  heroTypewriterState.timeouts.push(timeoutId);
};

const runHeroTypewriter = () => {
  const el = document.getElementById('hero-typewriter');
  if (!(el instanceof HTMLElement)) return;
  const textEl = el.querySelector('.typewriter-title__text');
  if (!(textEl instanceof HTMLElement)) return;

  const fullText = el.dataset.text ?? '';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const typingIntervalMs = 120;
  const startDelayMs = 140;
  const finishDelayMs = 900;

  if (heroTypewriterState.element === el && (heroTypewriterState.running || heroTypewriterState.completed)) {
    return;
  }

  clearHeroTypewriterTimers();
  heroTypewriterState.element = el;
  heroTypewriterState.completed = false;
  heroTypewriterState.runId += 1;
  const currentRunId = heroTypewriterState.runId;

  if (reduceMotion) {
    textEl.textContent = fullText;
    el.classList.remove('typing', 'settling');
    el.classList.add('done');
    heroTypewriterState.completed = true;
    return;
  }

  textEl.textContent = '';
  el.classList.remove('done', 'settling');
  el.classList.add('typing');
  heroTypewriterState.running = true;

  let index = 0;
  const typeNext = () => {
    if (heroTypewriterState.runId !== currentRunId) return;

    if (index >= fullText.length) {
      el.classList.remove('typing');
      el.classList.add('settling');
      queueHeroTypewriterStep(() => {
        if (heroTypewriterState.runId !== currentRunId) return;
        el.classList.remove('settling');
        el.classList.add('done');
        heroTypewriterState.running = false;
        heroTypewriterState.completed = true;
      }, finishDelayMs);
      return;
    }
    index += 1;
    textEl.textContent = fullText.slice(0, index);
    queueHeroTypewriterStep(typeNext, typingIntervalMs);
  };

  queueHeroTypewriterStep(typeNext, startDelayMs);
};

export const initHomePage = () => {
  initProjectVideos();
  runHeroTypewriter();

  if (!homeWindow.__homePageHooksAttached) {
    document.addEventListener('astro:page-load', () => {
      initProjectVideos();
      runHeroTypewriter();
    });
    document.addEventListener('astro:before-swap', clearHeroTypewriterTimers);
    homeWindow.__homePageHooksAttached = true;
  }
};
