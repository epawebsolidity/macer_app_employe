import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  // Jika tidak ada token → paksa login
  if (!accessToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  let userData;
  try {
    userData = jwtDecode(accessToken);
  } catch (e) {
    // Token invalid / corrupt → logout
    return NextResponse.redirect(new URL("/", req.url));
  }

  const userRole = userData?.role;

  const isAdmin = userRole === "Admin";

  // Jika user buka halaman /dashboard/me tapi dia admin → lempar ke dashboard admin
  if (pathname.startsWith("/features/users/home") && isAdmin) {
    return NextResponse.redirect(new URL("/features/admin/home", req.url));
  }

  // Jika user buka /dashboard tapi dia BUKAN admin → lempar ke /me
  if (pathname.startsWith("/features/admin/home") && !isAdmin) {
    return NextResponse.redirect(new URL("/features/users/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/features/admin/home/:path*", "/features/admin/home", "/features/users/home", "/features/users/home/:path*"],
};
