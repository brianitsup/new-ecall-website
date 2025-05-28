export function checkEnvironmentVariables() {
  const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error("Missing required environment variables:", missingVars)
    console.error("Please check your .env.local file and ensure all required variables are set.")
    return false
  }

  // Check URL format
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl) {
    try {
      new URL(supabaseUrl)
    } catch (error) {
      console.error(`Invalid NEXT_PUBLIC_SUPABASE_URL format: "${supabaseUrl}"`)
      console.error("Expected format: https://your-project-id.supabase.co")
      return false
    }
  }

  return true
}
