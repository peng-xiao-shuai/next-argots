import { NextRequest, NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { languages, FALLBACK_LNG } from '@/locales/i18n';
import { COOKIE_NAME } from './locales/settings';

acceptLanguage.languages(languages);

export const config = {
  matcher: [
    '/((?!api|_next/static|_vercel|service-worker.js|_next/image|assets|favicon.ico|sw.js|avatar/|logo|google6abe2b93559e52fc|sitemap|robots|admin).*)',
  ],
};

export function middleware(req: NextRequest) {
  let lng;
  if (req.cookies.has(COOKIE_NAME))
    lng = acceptLanguage.get(req.cookies.get(COOKIE_NAME)?.value);
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = FALLBACK_LNG;

  /**
   * 如果路径是语言路径，不进行重定向
   */
  console.log('\x1b[33m%s\x1b[0m', `路径: ${req.nextUrl.pathname} -----------`);

  // 如果是根路径或者不带lng的语言路径，不进行重定向，由nextConfig配置重写路径
  if (
    req.nextUrl.pathname === '/' ||
    req.nextUrl.pathname.indexOf(lng) === -1
  ) {
    return NextResponse.next();
  }

  // if (
  //   !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
  //   !req.nextUrl.pathname.startsWith('/_next')
  // ) {
  //   console.log(
  //     '\x1b[33m%s\x1b[0m',
  //     '重定向：',
  //     `/${lng}${req.nextUrl.pathname}`
  //   );

  //   return NextResponse.redirect(
  //     new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
  //   );
  // }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '');
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    response.cookies.set(COOKIE_NAME, lngInReferer || FALLBACK_LNG);
    return response;
  }

  return NextResponse.next();
}
