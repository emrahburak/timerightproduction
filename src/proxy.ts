import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['tr', 'en'];
const defaultLocale = 'tr';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the pathname is exactly '/', redirect to '/tr'
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Check if the pathname already starts with a supported locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // If no locale is found at the beginning of the pathname (and it's not the root path, which is handled above),
  // then redirect to the default locale prefixed path.
  // This handles paths like '/some-page', transforming it to '/tr/some-page'
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  // If a locale is present (e.g., /tr, /en, /tr/page, /en/another), then proceed normally
  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `api` routes, `_next/static` and `_next/image` files, and all files in the public folder.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

