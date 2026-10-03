import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config"

/**
 * Create a Supabase server client for server-side operations
 * Important: Don't put this client in a global variable when using Fluid compute
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * Create a Supabase server client with service role key for admin operations
 * Use this for operations that need to bypass RLS
 */
export function createServiceClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.")

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export function createAuthorizedClient(accessToken?: string) {
  return createSupabaseClient(supabaseUrl, supabasePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  })
}
