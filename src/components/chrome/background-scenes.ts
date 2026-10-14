import { startAutumnScene } from './autumn-scene';
import { createFireworksScene } from './fireworks-scene.js';
import type { SiteAppearance } from '../../config/appearance';

type Options = { intro?: boolean; onFinish?: () => void };

function startFireworks(canvas: HTMLCanvasElement, options: Options = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) { options.onFinish?.(); return () => {}; }
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let last = 0;
  let draw: (light: boolean) => void;
  const light = () => document.documentElement.dataset.theme === 'light';
  const paint = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); draw(light()); };
  function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    draw = createFireworksScene(canvas, ctx);
    // A still bloom represents the scene when motion is disabled.
    if (motion.matches) for (let i = 0; i < 220; i++) paint();
    else paint();
  }
  function animate(now: number) {
    if (now - last >= 1000 / 60) { paint(); last = now; }
    frame = requestAnimationFrame(animate);
  }
  function sync() {
    cancelAnimationFrame(frame);
    last = 0;
    if (!document.hidden && !motion.matches) frame = requestAnimationFrame(animate);
    else if (motion.matches) resize();
  }
  function repaint() { if (motion.matches) resize(); }
  const timer = options.intro ? window.setTimeout(() => { dispose(); options.onFinish?.(); }, 3200) : undefined;
  function dispose() {
    cancelAnimationFrame(frame);
    clearTimeout(timer);
    window.removeEventListener('resize', resize);
    window.removeEventListener('portfolio-theme-change', repaint);
    document.removeEventListener('visibilitychange', sync);
    motion.removeEventListener('change', sync);
  }
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('portfolio-theme-change', repaint);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  resize();
  sync();
  return dispose;
}

// The background registry knows nothing about the home page's layout or palette.
const scenes = { autumn: startAutumnScene, fireworks: startFireworks };
export function startBackground(canvas: HTMLCanvasElement, name: SiteAppearance['background'], options: Options = {}) {
  canvas.dataset.background = name;
  if (name === 'none') { options.onFinish?.(); return () => {}; }
  return scenes[name](canvas, options);
}
