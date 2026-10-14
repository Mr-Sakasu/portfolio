import { defineConfig } from 'astro/config';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';

export default defineConfig({
    // Absolute URLs for canonical links, hreflang alternates, link previews
    // and the sitemap all come from here.
    site: 'https://portfolio-five-blond-32.vercel.app',
    // Preserve the whitespace behavior used before Astro 7.
    compressHTML: true,
    // Keep Tailwind 3 styles without the Astro 5-only integration.
    vite: {
        css: {
            postcss: {
                plugins: [tailwindcss(), autoprefixer()],
            },
        },
    },
});
