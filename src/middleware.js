import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next|favicon.ico|Authintaction/login|api/auth).*)"],
  runtime: "experimental-edge", 
};

export default async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname !== "/Authintaction/login" && !token) {
    return NextResponse.redirect(new URL("/Authintaction/login", req.url));
  }

  if (pathname === "/Authintaction/login" && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
