const formatCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const timelineWindow = window as Window & {
  __timelineMonthListenerAttached?: boolean;
};

const refreshCurrentMonth = () => {
  const formatted = formatCurrentMonth();
  document.querySelectorAll('[data-current-month]').forEach((node) => {
    node.textContent = formatted;
  });
};

export const initTimeline = () => {
  refreshCurrentMonth();
  if (timelineWindow.__timelineMonthListenerAttached) {
    return;
  }
  document.addEventListener('astro:page-load', refreshCurrentMonth);
  timelineWindow.__timelineMonthListenerAttached = true;
};
