interface ChartSlice {
  artist: string;
  percentage: string;
  end: number;
}

export function initArtistCharts() {
  document.querySelectorAll<HTMLElement>('[data-artist-chart]').forEach((chart) => {
    if (chart.dataset.initialized) return;
    chart.dataset.initialized = 'true';

    const disc = chart.querySelector<HTMLElement>('[data-artist-chart-disc]');
    const tooltip = chart.querySelector<HTMLElement>('[data-artist-chart-tooltip]');
    if (!disc || !tooltip) return;

    const slices = JSON.parse(chart.dataset.slices ?? '[]') as ChartSlice[];
    if (slices.length === 0) return;
    let activeIndex = 0;

    const show = (index: number, x: number, y: number) => {
      const slice = slices[index];
      if (!slice) return;
      activeIndex = index;
      tooltip.textContent = `${slice.artist} · ${slice.percentage}`;
      tooltip.classList.remove('hidden');
      tooltip.setAttribute('aria-hidden', 'false');
      const maxX = chart.clientWidth - tooltip.offsetWidth / 2 - 4;
      const minX = tooltip.offsetWidth / 2 + 4;
      tooltip.style.left = `${Math.max(minX, Math.min(maxX, x))}px`;
      tooltip.style.top = `${Math.max(tooltip.offsetHeight + 8, y)}px`;
      tooltip.style.transform = 'translate(-50%, -110%)';
    };
    const hide = () => {
      tooltip.classList.add('hidden');
      tooltip.setAttribute('aria-hidden', 'true');
    };

    disc.addEventListener('pointermove', (event) => {
      const rect = disc.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dx = x - rect.width / 2;
      const dy = y - rect.height / 2;
      if (Math.hypot(dx, dy) > Math.min(rect.width, rect.height) / 2) {
        hide();
        return;
      }
      // CSS conic gradients start at twelve o'clock and advance clockwise.
      const angle = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
      const percentage = angle / 3.6;
      const index = slices.findIndex((slice) => percentage < slice.end);
      show(index < 0 ? slices.length - 1 : index, x, y);
    });
    disc.addEventListener('pointerleave', hide);
    disc.addEventListener('focus', () => show(activeIndex, chart.clientWidth / 2, chart.clientHeight / 2));
    disc.addEventListener('blur', hide);
    disc.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      show((activeIndex + direction + slices.length) % slices.length, chart.clientWidth / 2, chart.clientHeight / 2);
    });
  });
}

document.addEventListener('astro:page-load', initArtistCharts);
