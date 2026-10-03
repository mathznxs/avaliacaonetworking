const fallbackUrl = "https://uvrgwlsepqwptzkrvdzn.supabase.co"
const fallbackPublishableKey = "sb_publishable_P8L8c1il4QCZsfX776hPxw_Wx2N7lMd"

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackUrl
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  fallbackPublishableKey

