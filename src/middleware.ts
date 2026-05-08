import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "medqueue-super-secret-key");

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;

  // Protect all main app routes except login and api
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/book") || 
                           request.nextUrl.pathname.startsWith("/queue") ||
                           request.nextUrl.pathname.startsWith("/doctors") ||
                           request.nextUrl.pathname.startsWith("/hospitals") ||
                           request.nextUrl.pathname === "/";
                           
  const isAuthRoute = request.nextUrl.pathname === "/login";

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      // Invalid token, clear it and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  // Redirect away from login if already authenticated
  if (isAuthRoute && token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.redirect(new URL("/", request.url));
    } catch (error) {
      // Token invalid, let them stay on login page
      const response = NextResponse.next();
      response.cookies.delete("auth-token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/book/:path*",
    "/queue/:path*",
    "/doctors/:path*",
    "/hospitals/:path*",
    "/login"
  ],
};
