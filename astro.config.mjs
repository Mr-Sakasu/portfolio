import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    // Absolute URLs for canonical links, hreflang alternates, link previews
    // and the sitemap all come from here.
    site: 'https://portfolio-five-blond-32.vercel.app',
    integrations: [tailwind()],
});