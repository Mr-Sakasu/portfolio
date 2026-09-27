import type { APIRoute } from 'astro';
import { languages } from '../i18n';
import { projectSlugs } from '../data/projects';

/* One entry per built page, with its two siblings in the other languages as
   alternates. Kept by hand rather than through an integration: the routes
   are few and all follow the same /{lang}/... shape. Global Network is left
   out on purpose — it builds, but it is unlisted everywhere else too. */
const paths = [
    '/',
    '/scenes/',
    '/playlist/',
    '/playground/',
    '/stars/',
    '/bandit/',
    '/hanoi/',
    ...projectSlugs.map((slug) => `/projects/${slug}/`),
];

export const GET: APIRoute = ({ site }) => {
    const origin = site?.origin ?? '';
    const langs = Object.keys(languages);

    const entries = paths.flatMap((path) => langs.map((lang) => {
        const alternates = langs
            .map((alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${origin}/${alt}${path}" />`)
            .join('\n');
        return `  <url>\n    <loc>${origin}/${lang}${path}</loc>\n${alternates}\n  </url>`;
    }));

    const body = `<?xml version="1.0" encoding="UTF-8"?>\n`
        + `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`
        + `${entries.join('\n')}\n</urlset>\n`;

    return new Response(body, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
};
