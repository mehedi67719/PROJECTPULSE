import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Login page ছাড়া সব page private
  if (pathname !== "/Authintaction/login" && !token) {
    return NextResponse.redirect(new URL("/Authintaction/login", req.url));
  }

  // Logged in user tries to access login page → redirect to home
  if (pathname === "/Authintaction/login" && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Protect all pages except _next, favicon.ico, Authentication/login, api/auth
export const config = {
  matcher: ["/((?!_next|favicon.ico|Authintaction/login|api/auth).*)"],
};
