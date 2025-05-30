"use server"

import { contactLogger } from "@/lib/contact-logger"

interface ContactFormData {
  name: string
  email: string
  phone: string
  service?: string
  message: string
  recaptchaToken?: string
}

interface EmailResponse {
  success: boolean
  message: string
  error?: string
}

// Send email notification using Resend API directly
async function sendEmailNotification(formData: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Attempting to send email notification via Resend...")

    const resendApiKey = process.env.RESEND_API_KEY
    const smtpFrom = process.env.SMTP_FROM || "website@ecall.com.sb"
    const smtpTo = process.env.SMTP_TO || "hello@ecall.com.sb"

    if (!resendApiKey) {
      console.log("Resend API key not found, skipping email sending")
      return { success: false, error: "Resend API key not configured" }
    }

    // Create email content
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
    console.log("Sending email via Resend API...")
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

    return { success: true }
  } catch (error) {
    console.error("Email sending failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown email error",
    }
  }
}

// Improved webhook notification with better error handling
async function sendWebhookNotification(formData: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const webhookUrl = process.env.EMAIL_WEBHOOK_URL
    const webhookSecret = process.env.WEBHOOK_SECRET

    if (!webhookUrl) {
      console.log("No webhook URL configured, skipping webhook notification")
      return { success: true } // Not an error if webhook isn't configured
    }

    console.log("Sending webhook notification to:", webhookUrl)

    // Prepare webhook payload
    const payload = {
      type: "contact_form_submission",
      data: formData,
      timestamp: new Date().toISOString(),
      source: "ecall-website",
    }

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (webhookSecret) {
      headers.Authorization = `Bearer ${webhookSecret}`
    }

    // Send webhook with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Webhook HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Webhook sent successfully:", result)
      return { success: true }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }
  } catch (error) {
    console.error("Webhook sending failed:", error)

    // Provide more specific error messages
    let errorMessage = "Unknown webhook error"
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Webhook request timed out"
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage = "Webhook URL not accessible (network error)"
      } else {
        errorMessage = error.message
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Skip reCAPTCHA verification if no secret key is configured
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.log("Skipping reCAPTCHA verification (no secret key configured)")
      return { success: true }
    }

    // Skip verification for test tokens
    if (!token || token === "no-recaptcha-configured" || token.startsWith("test-")) {
      console.log("Skipping reCAPTCHA verification for test/missing token")
      return { success: true }
    }

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    if (!response.ok) {
      return { success: false, error: `reCAPTCHA API error: ${response.status}` }
    }

    const data = await response.json()

    if (!data.success) {
      const errorCodes = data["error-codes"] || []
      return {
        success: false,
        error: `reCAPTCHA verification failed: ${errorCodes.join(", ")}`,
      }
    }

    return { success: true }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown reCAPTCHA error",
    }
  }
}

export async function sendContactEmail(formData: ContactFormData): Promise<EmailResponse> {
  let submissionId: string | null = null

  try {
    console.log("Processing contact form submission...")

    // Validate form data first
    if (!formData.name?.trim() || !formData.email?.trim() || !formData.message?.trim()) {
      return {
        success: false,
        message: "Please fill in all required fields.",
        error: "Missing required fields",
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
        error: "Invalid email format",
      }
    }

    // Verify reCAPTCHA
    console.log("Verifying reCAPTCHA...")
    const recaptchaResult = await verifyRecaptcha(formData.recaptchaToken || "")
    if (!recaptchaResult.success) {
      console.error("reCAPTCHA verification failed:", recaptchaResult.error)
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
        error: recaptchaResult.error,
      }
    }

    console.log("reCAPTCHA verified successfully")

    // Log the submission to database
    try {
      console.log("Logging submission to database...")

      submissionId = await contactLogger.logSubmission({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "",
        service: formData.service || "",
        message: formData.message,
        ip_address: "Unknown",
        user_agent: "Web Client",
      })

      console.log("Submission logged successfully with ID:", submissionId)
    } catch (loggingError) {
      console.error("Failed to log submission:", loggingError)
      return {
        success: false,
        message:
          "We're experiencing technical difficulties. Please try again or contact us directly at hello@ecall.com.sb.",
        error: "Database logging failed",
      }
    }

    // Try to send email notification directly via Resend
    console.log("Attempting direct email notification...")
    const emailResult = await sendEmailNotification(formData)

    // Try webhook as backup only if direct email fails
    let webhookResult = { success: false, error: "Not attempted" }
    if (!emailResult.success) {
      console.log("Direct email failed, trying webhook...")
      webhookResult = await sendWebhookNotification(formData)
    }

    // Determine final status
    let finalStatus = "received"
    let statusMessage = "Submission logged successfully"

    if (emailResult.success) {
      finalStatus = "sent"
      statusMessage = "Email sent successfully via Resend"
      console.log("Email notification sent successfully")
    } else if (webhookResult.success) {
      finalStatus = "sent"
      statusMessage = "Email sent successfully via webhook"
      console.log("Webhook notification sent successfully")
    } else {
      finalStatus = "received"
      statusMessage = `Email failed: ${emailResult.error}; Webhook failed: ${webhookResult.error}`
      console.log("Both email and webhook failed, but submission is logged")
    }

    // Update submission status
    if (submissionId) {
      try {
        await contactLogger.updateSubmissionStatus(submissionId, finalStatus, statusMessage)
      } catch (updateError) {
        console.warn("Failed to update submission status:", updateError)
      }
    }

    // Always return success if the message was logged
    // Email failure shouldn't prevent form submission success
    return {
      success: true,
      message:
        "Thank you! Your message has been received and logged. Our team will review it and contact you directly at the email address you provided within 24 hours.",
    }
  } catch (error: any) {
    console.error("Contact form submission error:", error)

    const errorDetails = error instanceof Error ? error.message : "Unknown error"

    // Try to update submission status if we have an ID
    if (submissionId) {
      try {
        await contactLogger.updateSubmissionStatus(submissionId, "failed", errorDetails)
      } catch (updateError) {
        console.warn("Failed to update submission status:", updateError)
      }
    }

    return {
      success: false,
      message:
        "We're experiencing technical difficulties. Please try again or contact us directly at hello@ecall.com.sb.",
      error: errorDetails,
    }
  }
}
