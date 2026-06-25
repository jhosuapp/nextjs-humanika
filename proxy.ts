import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "i18next";

// La autenticación del panel admin (/dashboard y /api/admin) se maneja con una
// sesión por cookie firmada (src/shared/libs/session.ts), validada en el
// getServerSideProps de /dashboard y en el handler de /api/admin. El proxy solo
// se encarga de fijar la cookie de idioma para next-i18next.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  if (pathname.startsWith("/en")) {
    response.cookies.set(COOKIE_NAME, "en");
  } else {
    response.cookies.set(COOKIE_NAME, "es");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
