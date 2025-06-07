// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const DEFAULT_LANG = 'ja'; // 例：日本語デフォルト

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next();
    }

    const hasLangPrefix = /^\/(en|ja|zh)(\/|$)/.test(pathname);
    if (!hasLangPrefix) {
        const url = req.nextUrl.clone();
        url.pathname = `/${DEFAULT_LANG}${pathname}`;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
