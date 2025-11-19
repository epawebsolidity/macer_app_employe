import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const token = req.cookies.get("accessToken")?.value;

  // if (!token && pathname.startsWith("/features")) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }


  let userData: any;
  try {
    userData = jwtDecode(token);
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const userRole = userData?.role;
  const isAdmin = userRole === "Admin";

  if (pathname.startsWith("/features/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/features/users/home", req.url));
  }

  if (pathname.startsWith("/features/users") && isAdmin) {
    return NextResponse.redirect(new URL("/features/admin/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/features/admin/:path*",
    "/features/users/:path*",
  ],
};
