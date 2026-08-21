import Globe from 'globe.gl';

type City = { name: string; lat: number; lng: number; color: string };
type Route = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
  label: string;
  duration: number;
};
type RenderedRoute = Route & { layer: 'base' | 'signal' };

const cities: City[] = [
  { name: 'Tokyo', lat: 35.68, lng: 139.76, color: '#60a5fa' },
  { name: 'Singapore', lat: 1.35, lng: 103.82, color: '#34d399' },
  { name: 'Seoul, South Korea', lat: 37.57, lng: 126.98, color: '#a78bfa' },
  { name: 'Beijing', lat: 39.90, lng: 116.41, color: '#60a5fa' },
  { name: 'Ulaanbaatar, Mongolia', lat: 47.92, lng: 106.92, color: '#34d399' },
  { name: 'Hanoi, Vietnam', lat: 21.03, lng: 105.85, color: '#60a5fa' },
  { name: 'Bangkok, Thailand', lat: 13.76, lng: 100.50, color: '#a78bfa' },
  { name: 'Kuala Lumpur, Malaysia', lat: 3.14, lng: 101.69, color: '#34d399' },
  { name: 'Mumbai', lat: 19.08, lng: 72.88, color: '#34d399' },
  { name: 'Dubai', lat: 25.20, lng: 55.27, color: '#a78bfa' },
  { name: 'Nairobi', lat: -1.29, lng: 36.82, color: '#34d399' },
  { name: 'Johannesburg, South Africa', lat: -26.20, lng: 28.05, color: '#60a5fa' },
  { name: 'London', lat: 51.51, lng: -0.13, color: '#a78bfa' },
  { name: 'Frankfurt', lat: 50.11, lng: 8.68, color: '#60a5fa' },
  { name: 'Paris', lat: 48.86, lng: 2.35, color: '#34d399' },
  { name: 'Stockholm', lat: 59.33, lng: 18.07, color: '#a78bfa' },
  { name: 'New York', lat: 40.71, lng: -74.01, color: '#60a5fa' },
  { name: 'San Francisco', lat: 37.77, lng: -122.42, color: '#34d399' },
  { name: 'Toronto', lat: 43.65, lng: -79.38, color: '#a78bfa' },
  { name: 'Panama City, Panama', lat: 8.98, lng: -79.52, color: '#a78bfa' },
  { name: 'São Paulo', lat: -23.55, lng: -46.63, color: '#34d399' },
  { name: 'Santiago', lat: -33.45, lng: -70.67, color: '#60a5fa' },
  { name: 'Sydney', lat: -33.87, lng: 151.21, color: '#a78bfa' },
];

const routeColors: Array<[string, string]> = [
  ['rgba(96,165,250,0.15)', '#60a5fa'],
  ['rgba(167,139,250,0.15)', '#a78bfa'],
  ['rgba(52,211,153,0.15)', '#34d399'],
];

let cleanupCurrent: (() => void) | undefined;

const initGlobe = () => {
  cleanupCurrent?.();
  const root = document.querySelector<HTMLElement>('[data-globe-page]');
  const mount = root?.querySelector<HTMLElement>('[data-globe-canvas]');
  if (!root || !mount) return;

  const labels = JSON.parse(root.dataset.labels ?? '{}') as Record<string, string>;
  const activeCount = root.querySelector<HTMLElement>('[data-active-count]');
  const transferCount = root.querySelector<HTMLElement>('[data-transfer-count]');
  const regionCount = root.querySelector<HTMLElement>('[data-region-count]');
  const rotationButton = root.querySelector<HTMLButtonElement>('[data-rotation-toggle]');
  let routes: Route[] = [];
  let transfers = 0;
  let autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (regionCount) regionCount.textContent = String(cities.length);

  const globe = new Globe(mount)
    .backgroundColor('rgba(0,0,0,0)')
    .globeImageUrl('/images/earth-night.jpg')
    .showAtmosphere(true)
    .atmosphereColor('#4f9dff')
    .atmosphereAltitude(0.2)
    .pointsData(cities)
    .pointLat('lat')
    .pointLng('lng')
    .pointColor('color')
    .pointAltitude(0.012)
    .pointRadius(0.28)
    .pointLabel((city: object) => (city as City).name)
    .arcsData(routes)
    .arcStartLat('startLat')
    .arcStartLng('startLng')
    .arcEndLat('endLat')
    .arcEndLng('endLng')
    .arcColor((route: object) => {
      const item = route as RenderedRoute;
      return item.layer === 'base'
        ? ['rgba(96,165,250,0.1)', 'rgba(52,211,153,0.14)']
        : item.color;
    })
    .arcAltitudeAutoScale(0.32)
    .arcStroke((route: object) => (route as RenderedRoute).layer === 'base' ? 0.22 : 0.68)
    .arcDashLength((route: object) => (route as RenderedRoute).layer === 'base' ? 1 : 0.18)
    .arcDashGap((route: object) => (route as RenderedRoute).layer === 'base' ? 0 : 0.82)
    .arcDashInitialGap((route: object) => (route as RenderedRoute).layer === 'base' ? 0 : Math.random())
    .arcDashAnimateTime((route: object) => (route as RenderedRoute).layer === 'base' ? 0 : (route as RenderedRoute).duration)
    .arcLabel((route: object) => (route as Route).label)
    .ringsData([])
    .ringLat('lat')
    .ringLng('lng')
    .ringColor(() => (time: number) => `rgba(125, 211, 252, ${Math.max(0, 1 - time)})`)
    .ringMaxRadius(2.3)
    .ringPropagationSpeed(2.8)
    .ringRepeatPeriod(850)
    .pointOfView({ lat: 24, lng: 128, altitude: 2.15 }, 0);

  const controls = globe.controls();
  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = 0.32;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 125;
  controls.maxDistance = 430;

  const resize = () => {
    globe.width(mount.clientWidth).height(mount.clientHeight);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);
  resize();

  const emitRoute = () => {
    const startIndex = Math.floor(Math.random() * cities.length);
    let endIndex = Math.floor(Math.random() * cities.length);
    while (endIndex === startIndex) endIndex = Math.floor(Math.random() * cities.length);
    const start = cities[startIndex];
    const end = cities[endIndex];
    let activeRoute: Route;
    let routeAdded = false;
    if (routes.length < 24) {
      activeRoute = {
        startLat: start.lat,
        startLng: start.lng,
        endLat: end.lat,
        endLng: end.lng,
        color: routeColors[Math.floor(Math.random() * routeColors.length)],
        label: `${start.name} → ${end.name}`,
        duration: 2600 + Math.random() * 1800,
      };
      routes = [...routes, activeRoute];
      routeAdded = true;
    } else {
      activeRoute = routes[Math.floor(Math.random() * routes.length)];
    }
    transfers += Math.floor(18 + Math.random() * 80);
    if (routeAdded) {
      const renderedRoutes: RenderedRoute[] = routes.flatMap((item) => [
        { ...item, layer: 'base' },
        { ...item, layer: 'signal' },
      ]);
      globe.arcsData(renderedRoutes);
    }
    globe.ringsData([{ lat: activeRoute.endLat, lng: activeRoute.endLng }]);
    if (activeCount) activeCount.textContent = String(routes.length);
    if (transferCount) transferCount.textContent = transfers.toLocaleString();
  };

  for (let index = 0; index < 24; index += 1) emitRoute();
  const routeTimer = window.setInterval(emitRoute, 680);

  const toggleRotation = () => {
    autoRotate = !autoRotate;
    controls.autoRotate = autoRotate;
    if (rotationButton) rotationButton.textContent = autoRotate ? labels.pause : labels.resume;
  };
  rotationButton?.addEventListener('click', toggleRotation);
  if (rotationButton && !autoRotate) rotationButton.textContent = labels.resume;

  const onVisibility = () => {
    if (document.hidden) globe.pauseAnimation();
    else globe.resumeAnimation();
  };
  document.addEventListener('visibilitychange', onVisibility);

  cleanupCurrent = () => {
    window.clearInterval(routeTimer);
    resizeObserver.disconnect();
    rotationButton?.removeEventListener('click', toggleRotation);
    document.removeEventListener('visibilitychange', onVisibility);
    globe.pauseAnimation();
    mount.replaceChildren();
    cleanupCurrent = undefined;
  };
};

document.addEventListener('astro:page-load', initGlobe);
document.addEventListener('astro:before-swap', () => cleanupCurrent?.());
initGlobe();
