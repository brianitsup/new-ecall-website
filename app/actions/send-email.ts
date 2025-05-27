"use server"

import nodemailer from "nodemailer"

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

// Create email transporter
function createTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    throw new Error("SMTP configuration is incomplete")
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
}

// Generate email templates
function generateEmailHTML(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission - eCall Health Center</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0ea5e9; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 4px solid #0ea5e9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
          <p>eCall Health Center Website</p>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${data.email}</div>
          </div>
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${data.phone}</div>
          </div>
          ${
            data.service
              ? `
          <div class="field">
            <div class="label">Service Interested In:</div>
            <div class="value">${data.service}</div>
          </div>
          `
              : ""
          }
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${data.message.replace(/\n/g, "<br>")}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the eCall Health Center website contact form.</p>
          <p>Submitted on: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateEmailText(data: ContactFormData): string {
  return `
New Contact Form Submission - eCall Health Center

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
${data.service ? `Service: ${data.service}\n` : ""}
Message: ${data.message}

Submitted on: ${new Date().toLocaleString()}
  `.trim()
}

export async function sendContactEmail(formData: ContactFormData): Promise<EmailResponse> {
  try {
    console.log("Starting email send process...")

    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
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

    // Check email configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.SMTP_TO) {
      console.error("Email configuration incomplete")
      return {
        success: false,
        message: "Email service is not properly configured. Please contact the administrator.",
        error: "SMTP configuration incomplete",
      }
    }

    // Create transporter
    console.log("Creating email transporter...")
    const transporter = createTransporter()

    // Verify transporter configuration
    console.log("Verifying transporter...")
    try {
      await transporter.verify()
      console.log("Transporter verified successfully")
    } catch (verifyError) {
      console.error("Transporter verification failed:", verifyError)
      return {
        success: false,
        message: "Email service configuration error. Please contact the administrator.",
        error: verifyError instanceof Error ? verifyError.message : "Transporter verification failed",
      }
    }

    // Email options
    const mailOptions = {
      from: `"eCall Health Center Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      replyTo: formData.email,
      subject: `New Contact Form Submission from ${formData.name}`,
      text: generateEmailText(formData),
      html: generateEmailHTML(formData),
    }

    console.log("Sending email...")
    console.log("Mail options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)

    return {
      success: true,
      message: "Your message has been sent successfully! We will get back to you soon.",
    }
  } catch (error: any) {
    console.error("Email sending error:", error)

    // Handle specific error types
    let userMessage = "Failed to send message. Please try again or contact us directly."
    let errorDetails = "Unknown error"

    if (error instanceof Error) {
      errorDetails = error.message

      if (error.message.includes("EAUTH")) {
        userMessage = "Email authentication failed. Please contact the administrator."
      } else if (error.message.includes("ECONNECTION") || error.message.includes("ETIMEDOUT")) {
        userMessage = "Unable to connect to email server. Please try again later."
      } else if (error.message.includes("Invalid login")) {
        userMessage = "Email service configuration error. Please contact the administrator."
      }
    }

    return {
      success: false,
      message: userMessage,
      error: errorDetails,
    }
  }
}
