import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config"

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    // Create Supabase client for middleware
    const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    try {
      await supabase.auth.getUser()

      // For this registration system, we don't need authentication protection
      // The middleware just ensures session management works properly
    } catch (authError) {
      console.warn("[v0] Auth error in middleware:", authError)
      // Continue without failing the request
    }

    return supabaseResponse
  } catch (error) {
    console.error("[v0] Middleware error:", error)
    // Return a simple NextResponse to prevent 500 errors
    return NextResponse.next({
      request,
    })
  }
}
