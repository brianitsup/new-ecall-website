import { type NextRequest, NextResponse } from "next/server"

// Test endpoint to verify webhook functionality
export async function POST(request: NextRequest) {
  try {
    console.log("Test webhook endpoint called")

    // Get the webhook URL from environment
    const webhookUrl = process.env.EMAIL_WEBHOOK_URL
    const webhookSecret = process.env.WEBHOOK_SECRET

    // Validate webhook URL
    if (!webhookUrl) {
      console.error("EMAIL_WEBHOOK_URL not configured")
      return NextResponse.json(
        {
          error: "EMAIL_WEBHOOK_URL not configured",
          envVars: {
            webhookUrl: !!webhookUrl,
            webhookSecret: !!webhookSecret,
            nodeEnv: process.env.NODE_ENV || "unknown",
          },
        },
        { status: 500 },
      )
    }

    // Create test payload
    const testPayload = {
      type: "contact_form_submission",
      data: {
        name: "Test User",
        email: "test@example.com",
        phone: "+677 123456",
        service: "General Inquiry",
        message: "This is a test message to verify the webhook functionality is working correctly.",
      },
      timestamp: new Date().toISOString(),
      source: "webhook-test",
    }

    console.log("Sending test payload to webhook:", webhookUrl)

    // Send test request to webhook with better error handling
    let response
    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(webhookSecret && { Authorization: `Bearer ${webhookSecret}` }),
        },
        body: JSON.stringify(testPayload),
      })

      console.log("Fetch response status:", response.status)

      // Handle non-JSON responses
      let responseData
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json()
      } else {
        const textResponse = await response.text()
        responseData = { text: textResponse, contentType }
        console.log("Non-JSON response:", textResponse)
      }

      return NextResponse.json({
        success: response.ok,
        status: response.status,
        webhookUrl,
        response: responseData,
        testPayload,
      })
    } catch (fetchError) {
      console.error("Fetch error:", fetchError)
      return NextResponse.json(
        {
          error: "Fetch failed",
          message: fetchError instanceof Error ? fetchError.message : "Unknown fetch error",
          webhookUrl,
          testPayload,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Webhook test error:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Check environment variables
    const webhookUrl = process.env.EMAIL_WEBHOOK_URL
    const webhookSecret = process.env.WEBHOOK_SECRET
    const nodeEnv = process.env.NODE_ENV || "development"

    // Get hostname for debugging
    let hostname = "unknown"
    try {
      hostname = new URL(webhookUrl || "").hostname
    } catch (e) {
      console.warn("Could not parse webhook URL:", e)
    }

    return NextResponse.json({
      message: "Webhook test endpoint",
      usage: "POST to this endpoint to test webhook functionality",
      environment: nodeEnv,
      webhookConfigured: !!webhookUrl,
      webhookUrlHostname: webhookUrl ? hostname : null,
      secretConfigured: !!webhookSecret,
      secretLength: webhookSecret ? webhookSecret.length : 0,
      serverTime: new Date().toISOString(),
    })
  } catch (error) {
    console.error("GET error:", error)
    return NextResponse.json(
      {
        error: "Error getting webhook info",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
