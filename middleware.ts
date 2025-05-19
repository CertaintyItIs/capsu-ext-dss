// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  const isLoginPage = req.nextUrl.pathname === "/login";

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|auth|login).*)",
  ],
};