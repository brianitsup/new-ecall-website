import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Contact Us</h1>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We're here to help. Reach out to us with any questions or to schedule an appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-bold">Get in Touch</h2>
                <p className="text-gray-500 mt-2">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="Enter your phone number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter your message" className="min-h-[120px]" />
                </div>
                <Button className="bg-sky-600 hover:bg-sky-700">Send Message</Button>
              </form>
            </div>
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl font-bold">Our Locations</h2>
                <p className="text-gray-500 mt-2">
                  Visit us at one of our two convenient locations in Honiara, Solomon Islands.
                </p>
              </div>
              <div className="grid gap-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Alvaro, Point Cruz</CardTitle>
                    <CardDescription>Main Clinic</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-sky-600 mt-0.5" />
                      <p className="text-sm text-gray-500">
                        Office 4, Alvaro Building, Point Cruz, Honiara, Solomon Islands
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-sky-600" />
                      <p className="text-sm text-gray-500">+677 23130</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-sky-600" />
                      <p className="text-sm text-gray-500">enquiries@ecall.com.sb</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Opening Hours:</p>
                      <p className="text-sm text-gray-500">Monday - Friday: 9:00 AM - 8:00 PM</p>
                      <p className="text-sm text-gray-500">Saturday & Sunday: 9:00 AM - 4:00 PM</p>
                      <p className="text-sm text-gray-500">Public Holidays: Closed</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Henderson Court</CardTitle>
                    <CardDescription>Branch Clinic</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-sky-600 mt-0.5" />
                      <p className="text-sm text-gray-500">
                        Room 4 & 5, Henderson Court, Henderson, Honiara, Solomon Islands
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-sky-600" />
                      <p className="text-sm text-gray-500">+677 36130</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-sky-600" />
                      <p className="text-sm text-gray-500">enquiries@ecall.com.sb</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Opening Hours (Clinic):</p>
                      <p className="text-sm text-gray-500">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-sm text-gray-500">Saturday: 9:00 AM - 4:00 PM</p>
                      <p className="text-sm text-gray-500">Sunday & Public Holidays: Closed</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Opening Hours (Dental Services):</p>
                      <p className="text-sm text-gray-500">Monday - Saturday: 9:00 AM - 4:00 PM</p>
                      <p className="text-sm text-gray-500">Sunday: Booking Only</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Find Us</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our clinics are conveniently located in Honiara, Solomon Islands.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl py-8">
            <div className="aspect-video overflow-hidden rounded-xl border bg-muted">
              {/* This would be replaced with an actual map component in a real implementation */}
              <div className="flex items-center justify-center h-full bg-gray-200">
                <p className="text-gray-500">Interactive Map Would Be Displayed Here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
