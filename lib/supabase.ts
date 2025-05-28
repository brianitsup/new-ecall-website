import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

// Validate environment variables
if (!supabaseUrl) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. Please check your .env.local file and ensure it's set to your Supabase project URL (e.g., https://your-project.supabase.co)",
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your .env.local file and ensure it's set to your Supabase anon key.",
  )
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(
    `Invalid NEXT_PUBLIC_SUPABASE_URL format: "${supabaseUrl}". Please ensure it's a valid URL (e.g., https://your-project.supabase.co)`,
  )
}

// Validate that it's a Supabase URL
if (!supabaseUrl.includes("supabase.co") && !supabaseUrl.includes("localhost")) {
  console.warn(
    `Warning: NEXT_PUBLIC_SUPABASE_URL doesn't appear to be a Supabase URL: "${supabaseUrl}". Expected format: https://your-project.supabase.co`,
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
