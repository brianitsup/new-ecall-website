import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Validate webhook request
function validateRequest(request: NextRequest): { valid: boolean; error?: string } {
  try {
    // Check authorization if webhook secret is configured
    const webhookSecret = process.env.WEBHOOK_SECRET
    if (webhookSecret) {
      const authHeader = request.headers.get("authorization")
      if (!authHeader) {
        return { valid: false, error: "Missing Authorization header" }
      }

      const [scheme, token] = authHeader.split(" ")
      if (scheme !== "Bearer" || token !== webhookSecret) {
        return { valid: false, error: "Invalid Authorization token" }
      }
    }

    return { valid: true }
  } catch (error) {
    console.error("Webhook validation error:", error)
    return { valid: false, error: "Validation error" }
  }
}

// Create email transporter using environment variables
function createEmailTransporter() {
  try {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPassword = process.env.SMTP_PASSWORD

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      throw new Error("Missing SMTP configuration")
    }

    return nodemailer.createTransport({
      host: smtpHost,
      port: Number.parseInt(smtpPort),
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    })
  } catch (error) {
    console.error("Failed to create email transporter:", error)
    throw error
  }
}

// Send email using Resend API (serverless-compatible)
async function sendEmailWithResend(data: any): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    const smtpFrom = process.env.SMTP_FROM || "website@ecall.com.sb"
    const smtpTo = process.env.SMTP_TO || "hello@ecall.com.sb"

    if (!resendApiKey) {
      return { success: false, error: "Resend API key not configured" }
    }

    // Create email content
    const formData = data.data
    const emailSubject = `New Contact Form Message from ${formData.name}`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #334155;">Contact Information</h3>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
          ${formData.phone ? `<p><strong>Phone:</strong> <a href="tel:${formData.phone}">${formData.phone}</a></p>` : ""}
          ${formData.service ? `<p><strong>Service of Interest:</strong> ${formData.service}</p>` : ""}
        </div>

        <div style="background-color: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #334155;">Message</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${formData.message}</p>
        </div>

        <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #1e40af;">
            <strong>Next Steps:</strong> Please respond to this inquiry within 24 hours by replying directly to ${formData.email}
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
        
        <p style="font-size: 12px; color: #64748b; text-align: center;">
          This message was sent from the eCall Health Center website contact form.<br>
          Submitted on ${new Date().toLocaleString("en-US", { timeZone: "Pacific/Guadalcanal" })} (Solomon Islands time)
        </p>
      </div>
    `

    const emailText = `
New Contact Form Submission

Contact Information:
Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ""}
${formData.service ? `Service of Interest: ${formData.service}` : ""}

Message:
${formData.message}

Please respond to this inquiry within 24 hours by replying directly to ${formData.email}

Submitted on ${new Date().toLocaleString("en-US", { timeZone: "Pacific/Guadalcanal" })} (Solomon Islands time)
    `

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `eCall Health Center <${smtpFrom}>`,
        to: [smtpTo],
        reply_to: formData.email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Resend API error: ${response.status} - ${errorData}`)
    }

    const result = await response.json()
    console.log("Email sent successfully via Resend:", result.id)

    return { success: true, id: result.id }
  } catch (error) {
    console.error("Email sending failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    }
  }
}

// Main webhook handler
export async function POST(request: NextRequest) {
  console.log("Email webhook endpoint called")

  try {
    // Validate the request
    const validation = validateRequest(request)
    if (!validation.valid) {
      console.error("Webhook validation failed:", validation.error)
      return NextResponse.json({ error: validation.error }, { status: 401 })
    }

    // Parse the request body
    let data
    try {
      data = await request.json()
    } catch (parseError) {
      console.error("Failed to parse webhook payload:", parseError)
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 })
    }

    // Validate payload structure
    if (!data || !data.type || !data.data) {
      console.error("Invalid webhook payload structure:", data)
      return NextResponse.json({ error: "Invalid payload structure" }, { status: 400 })
    }

    // Process based on type
    if (data.type === "contact_form_submission") {
      console.log("Processing contact form submission webhook")

      // Send email using Resend API
      const emailResult = await sendEmailWithResend(data)

      if (emailResult.success) {
        return NextResponse.json({
          success: true,
          message: "Email sent successfully",
          id: emailResult.id,
        })
      } else {
        console.error("Email sending failed:", emailResult.error)
        return NextResponse.json(
          {
            success: false,
            error: emailResult.error,
          },
          { status: 500 },
        )
      }
    } else {
      console.warn("Unknown webhook type:", data.type)
      return NextResponse.json({ error: "Unknown webhook type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Email webhook endpoint is running",
    environment: process.env.NODE_ENV || "development",
    resendConfigured: !!process.env.RESEND_API_KEY,
    smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
    timestamp: new Date().toISOString(),
  })
}
