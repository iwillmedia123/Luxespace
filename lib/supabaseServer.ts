import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Creates a Supabase client for use in Server Components, Server Actions, and API Routes.
 * Uses Next.js async cookies store to manage authentication sessions.
 */
export const createServerSupabase = async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if middleware handles session refreshing.
        }
      },
    },
  });
};

/**
 * Creates a Supabase client bypassing RLS policies using the Service Role Key.
 * MUST only be called on the server side and in administrative contexts.
 */
export const createAdminSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  
  if (!serviceKey) {
    console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY is not defined.");
  }
  
  return createServerClient(supabaseUrl, serviceKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
};
