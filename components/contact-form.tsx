"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, User, MessageSquare, Send, Loader2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { sendContactEmail } from "@/app/actions/send-email"

interface ContactFormProps {
  defaultService?: string
  showServiceSelect?: boolean
  className?: string
}

export function ContactForm({ defaultService, showServiceSelect = true, className = "" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: defaultService || "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const services = [
    "Medical Consultations",
    "Medications and Treatment",
    "Ultrasound Imaging",
    "Minor Surgical Procedures",
    "Maternal & Child Healthcare",
    "Laboratory Services",
    "Microscopy Services",
    "Dental Services",
    "Occupational Health Services",
    "Public Health Consultancy",
    "Overseas Medical Referrals",
    "General Inquiry",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: defaultService || "",
      message: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      })
      return
    }

    setLoading(true)

    try {
      const result = await sendContactEmail({
        ...formData,
        recaptchaToken: "no-recaptcha-configured", // Simple bypass for now
      })

      if (result.success) {
        toast({
          variant: "success",
          title: "Message Sent Successfully!",
          description: result.message,
        })
        resetForm()
      } else {
        console.error("Email send failed:", result.error)
        toast({
          variant: "destructive",
          title: "Failed to Send Message",
          description: result.message,
        })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        variant: "destructive",
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again or contact us directly.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+677 XXXXXXX"
                className="pl-10"
              />
            </div>
          </div>

          {showServiceSelect && (
            <div className="space-y-2">
              <Label htmlFor="service">Service of Interest</Label>
              <Select value={formData.service} onValueChange={handleServiceChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">
            Message <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please describe how we can help you..."
              className="pl-10 min-h-[120px]"
              required
            />
          </div>
        </div>

        {/* Development Mode Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-blue-800 text-sm font-medium">Secure Contact Form</p>
              <p className="text-blue-700 text-xs mt-1">
                Your message will be sent securely to our team. We'll respond within 24 hours.
              </p>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By submitting this form, you agree to be contacted by eCall Health Center regarding your inquiry.
        </p>
      </form>
    </div>
  )
}
