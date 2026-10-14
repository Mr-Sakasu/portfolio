type SceneOptions = { intro?: boolean; onFinish?: () => void };
type Leaf = {
  x: number; y: number; size: number; speed: number; phase: number;
  rotation: number; spin: number; kind: number; color: number;
};

// Shared by the background and the first-visit gust. Positions use CSS pixels.
export function startAutumnScene(canvas: HTMLCanvasElement, options: SceneOptions = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) { options.onFinish?.(); return () => {}; }

  const maple = new Path2D('M0 10 L-4 5 L-12 7 L-10 1 L-17 -3 L-11 -6 L-13 -13 L-5 -10 L-4 -17 L0 -25 L4 -17 L5 -10 L13 -13 L11 -6 L17 -3 L10 1 L12 7 L4 5 Z');
  const ginkgo = new Path2D('M0 11 C-3 5 -17 0 -19 -10 C-19 -16 -10 -22 -3 -20 L0 -14 L3 -20 C10 -22 19 -16 19 -10 C17 0 3 5 0 11 Z');
  const veins = [
    new Path2D('M0 17 L0 -19 M0 1 L-11 -9 M0 1 L11 -9 M0 6 L-10 3 M0 6 L10 3'),
    new Path2D('M0 17 L0 8 M0 8 Q-4 -3 -14 -13 M0 8 Q-2 -5 -6 -17 M0 8 Q2 -5 6 -17 M0 8 Q4 -3 14 -13'),
  ];
  const darkColors = ['#cf6942', '#b94b3d', '#dc994e', '#d9b35b'];
  const lightColors = ['#ab4d2c', '#9f3c31', '#b57929', '#aa821f'];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0;
  let height = 0;
  let leaves: Leaf[] = [];
  let frameId = 0;
  let previous = 0;
  let elapsed = 0;
  let disposed = false;

  function makeLeaf(initial: boolean): Leaf {
    const kind = Math.random() < 0.65 ? 0 : 1;
    return {
      x: Math.random() * (width + 100) - 50,
      y: initial ? Math.random() * height : -45 - Math.random() * 90,
      size: 0.3 + Math.random() * (width < 640 ? 0.35 : 0.6),
      speed: 14 + Math.random() * 22, phase: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.6,
      kind, color: kind === 1 ? 3 : Math.floor(Math.random() * 3),
    };
  }

  function drawLeaf(leaf: Leaf, isLight: boolean, opacity: number) {
    const flutter = Math.sin(elapsed * 0.0011 + leaf.phase);
    ctx!.save();
    ctx!.translate(leaf.x, leaf.y);
    ctx!.rotate(leaf.rotation + flutter * 0.28);
    ctx!.scale(leaf.size * (0.7 + flutter * 0.25), leaf.size);
    ctx!.globalAlpha = opacity;
    ctx!.fillStyle = (isLight ? lightColors : darkColors)[leaf.color];
    ctx!.fill(leaf.kind === 0 ? maple : ginkgo);
    ctx!.strokeStyle = isLight ? '#653b22' : '#f6cb8e';
    ctx!.globalAlpha = opacity * 0.46;
    ctx!.lineWidth = 0.65;
    ctx!.stroke(veins[leaf.kind]);
    ctx!.restore();
  }

  function drawBough(mirrored: boolean, isLight: boolean) {
    ctx!.save();
    ctx!.translate(mirrored ? width + 16 : -16, mirrored ? 92 : 175);
    const scale = width < 640 ? 0.57 : 1;
    ctx!.scale((mirrored ? -1 : 1) * scale, scale);
    ctx!.strokeStyle = isLight ? '#92744f' : '#79513b';
    ctx!.globalAlpha = 0.5;
    ctx!.lineWidth = 1.3;
    ctx!.beginPath();
    ctx!.moveTo(0, -50);
    ctx!.bezierCurveTo(65, -24, 108, 22, 218, 49);
    ctx!.moveTo(53, -18);
    ctx!.quadraticCurveTo(92, -36, 127, -28);
    ctx!.moveTo(105, 12);
    ctx!.quadraticCurveTo(124, 51, 151, 65);
    ctx!.moveTo(154, 30);
    ctx!.quadraticCurveTo(177, 7, 201, 12);
    ctx!.stroke();
    for (let i = 0; i < 13; i++) {
      drawLeaf({ x: 36 + i * 14, y: -32 + i * 6 + (i % 2 ? 18 : -14),
        size: 0.65 + (i % 3) * 0.13, rotation: (i % 2 ? -0.8 : 0.7) + i * 0.12,
        phase: i, spin: 0, speed: 0, kind: mirrored && i % 3 === 0 ? 1 : 0,
        color: (i + (mirrored ? 1 : 0)) % 4 }, isLight, isLight ? 0.42 : 0.5);
    }
    ctx!.restore();
  }

  function render(delta = 0) {
    const isLight = document.documentElement.dataset.theme === 'light';
    ctx!.clearRect(0, 0, width, height);
    if (!options.intro) { drawBough(false, isLight); drawBough(true, isLight); }
    const fade = options.intro ? Math.min(1, elapsed / 350) * Math.max(0, 1 - Math.max(0, elapsed - 1700) / 1100) : 1;
    for (let i = 0; i < leaves.length; i++) {
      let leaf = leaves[i];
      if (delta) {
        leaf.y += leaf.speed * delta * (options.intro ? 2.4 : 1);
        leaf.x += (9 + Math.sin(elapsed * 0.00035 + leaf.phase) * 18) * delta;
        leaf.rotation += leaf.spin * delta;
        if (leaf.y > height + 45 || leaf.x > width + 60) leaf = leaves[i] = makeLeaf(false);
      }
      // Keep the middle quiet; the margins carry the more saturated leaves.
      const edge = Math.abs(leaf.x / width - 0.5) * 2;
      drawLeaf(leaf, isLight, (options.intro ? 0.65 : 0.19 + edge * 0.42) * fade);
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = options.intro ? (width < 640 ? 16 : 28) : Math.min(44, Math.max(16, Math.round(width * height / 29000)));
    leaves = Array.from({ length: count }, () => makeLeaf(true));
    render();
  }

  function animate(now: number) {
    frameId = 0;
    if (disposed || document.hidden || motion.matches) return;
    // Time-based steps keep the drift identical at different refresh rates.
    const delta = previous ? Math.min(now - previous, 50) : 0;
    previous = now;
    elapsed += delta;
    render(delta / 1000);
    if (options.intro && elapsed >= 2800) { finish(); return; }
    frameId = requestAnimationFrame(animate);
  }

  function syncMotion() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    previous = 0;
    if (options.intro && (motion.matches || document.hidden)) { finish(); return; }
    render();
    if (!motion.matches && !document.hidden) frameId = requestAnimationFrame(animate);
  }

  function redraw() { render(); }
  function dispose() {
    disposed = true;
    cancelAnimationFrame(frameId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('portfolio-theme-change', redraw);
    document.removeEventListener('visibilitychange', syncMotion);
    motion.removeEventListener('change', syncMotion);
  }
  function finish() { dispose(); options.onFinish?.(); }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('portfolio-theme-change', redraw);
  document.addEventListener('visibilitychange', syncMotion);
  motion.addEventListener('change', syncMotion);
  resize();
  syncMotion();
  return dispose;
}
