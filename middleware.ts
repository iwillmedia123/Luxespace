import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin routes
  if (path.startsWith("/admin")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    // Fail-Safe Fallback: If Supabase configuration keys are not defined,
    // verify the sandbox admin session cookie to secure access.
    if (!supabaseUrl || !supabaseAnonKey) {
      const sessionCookie = request.cookies.get("luxespace_admin_session");
      if (!sessionCookie && path !== "/admin/login") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      if (sessionCookie && path === "/admin/login") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Prepare response object to write back updated cookies
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    // Safely retrieve the authenticated user session
    const { data: { user } } = await supabase.auth.getUser();

    // If no authenticated user is found, redirect them to the admin login page
    if (!user && path !== "/admin/login") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // If authenticated user attempts to load login, redirect them directly to dashboard
    if (user && path === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return response;
  }

  return NextResponse.next();
}

// Config to target only administrative portals
export const config = {
  matcher: ["/admin/:path*"],
};
