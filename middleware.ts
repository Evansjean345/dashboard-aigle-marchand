import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Gestion des redirections basées sur les cookies
  if (
    (pathname === "/login" || pathname === "/register") &&
    request.cookies.has("userAuth")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    (pathname === "/" || pathname === "/accounts") &&
    !request.cookies.has("userAuth")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Ajouter les en-têtes CORS pour autoriser les appels API
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*"); // Ou spécifiez l'origine
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: ["/", "/accounts", "/login", "/register"],
};
