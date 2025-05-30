import { createClient } from "@supabase/supabase-js"

export interface ContactSubmissionLog {
  id: string
  name: string
  email: string
  phone?: string
  service?: string
  message: string
  status: "pending" | "received" | "sent" | "failed"
  error_message?: string
  ip_address?: string
  user_agent?: string
  created_at: string
  updated_at: string
}

export interface ContactAnalytics {
  submission_date: string
  total_submissions: number
  successful_submissions: number
  failed_submissions: number
  success_rate: number
}

export interface ContactStats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  successRate: number
}

class ContactLogger {
  private getClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
      throw new Error("Missing Supabase URL configuration")
    }

    // Try to use service role key first, fall back to anon key
    let apiKey = supabaseServiceKey
    let keyType = "service_role"

    if (!supabaseServiceKey) {
      console.warn("SUPABASE_SERVICE_ROLE_KEY not found, falling back to anon key")
      apiKey = supabaseAnonKey
      keyType = "anon"
    }

    if (!apiKey) {
      console.error("No valid Supabase API key found")
      throw new Error("Missing Supabase API key configuration")
    }

    console.log(`Creating Supabase client with ${keyType} key`)
    console.log("Supabase URL:", supabaseUrl.substring(0, 30) + "...")

    return createClient(supabaseUrl, apiKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  private async ensureTableExists(): Promise<{ exists: boolean; error?: string; client?: any }> {
    try {
      console.log("Contact Logger: Checking if contact_submissions table exists...")

      const supabase = this.getClient()

      // Test if we can access the table
      const { data, error } = await supabase.from("contact_submissions").select("id").limit(1)

      if (error) {
        console.log("Table access result:", error.message)

        // If table doesn't exist, that's expected for first run
        if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
          console.log("Table does not exist - this is expected for first setup")
          return { exists: false, error: "Table does not exist", client: supabase }
        }

        // For other errors, log but continue
        console.warn("Table access error (continuing anyway):", error.message)
        return { exists: false, error: error.message, client: supabase }
      }

      console.log("Table exists and is accessible")
      return { exists: true, client: supabase }
    } catch (error) {
      console.error("Error checking table existence:", error)

      // Still return a client so we can attempt operations
      try {
        const supabase = this.getClient()
        return {
          exists: false,
          error: error instanceof Error ? error.message : "Unknown error",
          client: supabase,
        }
      } catch (clientError) {
        return {
          exists: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }
      }
    }
  }

  async logSubmission(data: {
    name: string
    email: string
    phone?: string
    service?: string
    message: string
    ip_address?: string
    user_agent?: string
  }): Promise<string | null> {
    try {
      console.log("Contact Logger: Starting submission logging process...")

      // Get client and check table
      const tableCheck = await this.ensureTableExists()
      if (!tableCheck.client) {
        throw new Error("Could not create Supabase client")
      }

      const supabase = tableCheck.client

      // If table doesn't exist, try to create it
      if (!tableCheck.exists) {
        console.log("Attempting to create contact_submissions table...")

        // Try using SQL to create the table
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS contact_submissions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            service TEXT,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'sent', 'failed')),
            error_message TEXT,
            ip_address TEXT,
            user_agent TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `

        // Try to execute the SQL
        try {
          const { error: sqlError } = await supabase.rpc("exec_sql", { sql: createTableSQL })
          if (sqlError) {
            console.warn("Could not create table via SQL:", sqlError.message)
          } else {
            console.log("Table created successfully")
          }
        } catch (sqlErr) {
          console.warn("SQL execution not available, table may need manual creation")
        }
      }

      console.log("Contact Logger: Preparing submission data...")
      const submissionData = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        service: data.service?.trim() || null,
        message: data.message.trim(),
        status: "pending" as const,
        ip_address: data.ip_address || "Unknown",
        user_agent: data.user_agent || "Web Client",
      }

      console.log("Contact Logger: Inserting submission...")

      const { data: result, error } = await supabase
        .from("contact_submissions")
        .insert(submissionData)
        .select("id")
        .single()

      if (error) {
        console.error("Database insert error:", error)
        throw new Error(`Database insert failed: ${error.message}`)
      }

      if (!result || !result.id) {
        console.error("No result returned from database insert")
        throw new Error("Database insert succeeded but no ID was returned")
      }

      console.log("Contact Logger: Submission logged successfully with ID:", result.id)
      return result.id
    } catch (error) {
      console.error("Error in logSubmission:", error)
      throw error
    }
  }

  async updateSubmissionStatus(
    id: string,
    status: "received" | "sent" | "failed",
    errorMessage?: string,
  ): Promise<boolean> {
    try {
      console.log(`Contact Logger: Updating submission ${id} status to ${status}`)

      const tableCheck = await this.ensureTableExists()
      if (!tableCheck.client) {
        console.warn("Could not get Supabase client, skipping status update")
        return false
      }

      const supabase = tableCheck.client
      const { error } = await supabase
        .from("contact_submissions")
        .update({
          status,
          error_message: errorMessage,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) {
        console.error("Failed to update submission status:", error)
        return false
      }

      console.log(`Contact Logger: Successfully updated submission ${id} status to ${status}`)
      return true
    } catch (error) {
      console.error("Error updating submission status:", error)
      return false
    }
  }

  async getRecentSubmissions(limit = 20): Promise<ContactSubmissionLog[]> {
    try {
      const tableCheck = await this.ensureTableExists()
      if (!tableCheck.client) {
        console.warn("Could not get Supabase client")
        return []
      }

      if (!tableCheck.exists) {
        console.log("Table does not exist, returning empty submissions list")
        return []
      }

      const supabase = tableCheck.client
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("Failed to fetch recent submissions:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error fetching recent submissions:", error)
      return []
    }
  }

  async getSubmissionStats(): Promise<ContactStats> {
    try {
      const tableCheck = await this.ensureTableExists()
      if (!tableCheck.client) {
        console.warn("Could not get Supabase client")
        return {
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
          successRate: 0,
        }
      }

      if (!tableCheck.exists) {
        console.log("Table does not exist, returning zero stats")
        return {
          total: 0,
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
          successRate: 0,
        }
      }

      const supabase = tableCheck.client
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const [totalResult, todayResult, weekResult, monthResult, successResult] = await Promise.all([
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
        supabase
          .from("contact_submissions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", today.toISOString()),
        supabase
          .from("contact_submissions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", thisWeek.toISOString()),
        supabase
          .from("contact_submissions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", thisMonth.toISOString()),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("status", "sent"),
      ])

      const total = totalResult.count || 0
      const successful = successResult.count || 0
      const successRate = total > 0 ? Math.round((successful / total) * 100) : 0

      return {
        total,
        today: todayResult.count || 0,
        thisWeek: weekResult.count || 0,
        thisMonth: monthResult.count || 0,
        successRate,
      }
    } catch (error) {
      console.error("Failed to fetch submission stats:", error)
      return {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        successRate: 0,
      }
    }
  }

  async getAnalytics(days = 7): Promise<ContactAnalytics[]> {
    try {
      const tableCheck = await this.ensureTableExists()
      if (!tableCheck.client) {
        console.warn("Could not get Supabase client")
        return []
      }

      if (!tableCheck.exists) {
        console.log("Table does not exist, returning empty analytics")
        return []
      }

      const supabase = tableCheck.client
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from("contact_submissions")
        .select("created_at, status")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Failed to fetch analytics:", error)
        return []
      }

      // Group by date
      const analytics: { [key: string]: ContactAnalytics } = {}

      data?.forEach((submission) => {
        const date = new Date(submission.created_at).toISOString().split("T")[0]

        if (!analytics[date]) {
          analytics[date] = {
            submission_date: date,
            total_submissions: 0,
            successful_submissions: 0,
            failed_submissions: 0,
            success_rate: 0,
          }
        }

        analytics[date].total_submissions++
        if (submission.status === "sent") {
          analytics[date].successful_submissions++
        } else if (submission.status === "failed") {
          analytics[date].failed_submissions++
        }
      })

      // Calculate success rates
      Object.values(analytics).forEach((day) => {
        day.success_rate =
          day.total_submissions > 0 ? Math.round((day.successful_submissions / day.total_submissions) * 100) : 0
      })

      return Object.values(analytics).sort(
        (a, b) => new Date(b.submission_date).getTime() - new Date(a.submission_date).getTime(),
      )
    } catch (error) {
      console.error("Error fetching analytics:", error)
      return []
    }
  }
}

export const contactLogger = new ContactLogger()
