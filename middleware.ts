import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.endsWith(".html")) {
    const newPathname = pathname.slice(0, -5);
    const url = new URL(req.url);
    url.pathname = newPathname;

    return NextResponse.redirect(url);
  }

  // Allow the request to continue if no redirection is needed
  return NextResponse.next();
}

// Only match paths that end with .html
export const config = {
  matcher: ["/(.*html)"],
};
