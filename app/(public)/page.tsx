import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Mail,
  Stethoscope,
  Pill,
  Activity,
  Scissors,
  Baby,
  FlaskConical,
  Microscope,
  Smile,
  Briefcase,
  Users,
  Globe,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Quality Healthcare in Solomon Islands
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  eCall Health Center provides affordable, patient-centered medical services at two convenient locations
                  in Honiara.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild className="bg-sky-600 hover:bg-sky-700">
                  <Link href="/contact">Book Appointment</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/services">Our Services</Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <Image
                alt="eCall Health Center"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height={550}
                src="/images/hero.jpeg"
                width={800}
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAAcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Information */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Your Health Is Our Priority
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Led by Dr. Lazarus Tavichikai, our clinic combines clinical excellence with community health
                initiatives.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5 text-sky-600" />
                  Extended Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  We offer extended opening hours to ensure healthcare is accessible when you need it.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-sky-600" />
                  Two Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Visit us at Alvaro, Point Cruz or Henderson Court for convenient access to quality healthcare.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Phone className="h-5 w-5 text-sky-600" />
                  Easy Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Book appointments easily and get the care you need without unnecessary delays.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Overview - Redesigned without locations */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Services</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Comprehensive healthcare services to meet your needs.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-5xl py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
              {[
                {
                  icon: <Stethoscope className="h-6 w-6 text-sky-600" />,
                  title: "Medical Consultations",
                },
                {
                  icon: <Pill className="h-6 w-6 text-sky-600" />,
                  title: "Medications & Treatment",
                },
                {
                  icon: <Activity className="h-6 w-6 text-sky-600" />,
                  title: "Ultrasound Imaging",
                },
                {
                  icon: <Scissors className="h-6 w-6 text-sky-600" />,
                  title: "Minor Surgical Procedures",
                },
                {
                  icon: <Baby className="h-6 w-6 text-sky-600" />,
                  title: "Maternal & Child Healthcare",
                },
                {
                  icon: <FlaskConical className="h-6 w-6 text-sky-600" />,
                  title: "Laboratory Services",
                },
                {
                  icon: <Microscope className="h-6 w-6 text-sky-600" />,
                  title: "Microscopy Services",
                },
                {
                  icon: <Smile className="h-6 w-6 text-sky-600" />,
                  title: "Dental Services",
                },
                {
                  icon: <Briefcase className="h-6 w-6 text-sky-600" />,
                  title: "Occupational Health",
                },
                {
                  icon: <Users className="h-6 w-6 text-sky-600" />,
                  title: "Public Health Consultancy",
                },
                {
                  icon: <Globe className="h-6 w-6 text-sky-600" />,
                  title: "Overseas Medical Referrals",
                },
              ].map((service, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3">{service.icon}</div>
                  <h3 className="font-medium text-sm">{service.title}</h3>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Button asChild variant="outline" className="gap-1">
                <Link href="/services">
                  View Service Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Dr. Lazarus */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mx-auto lg:order-last">
              <Image
                alt="Dr. Lazarus Tavichikai"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
                height={400}
                src="/images/lazarus-tavichikai.webp"
                width={400}
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Led by Dr. Lazarus Tavichikai</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  With extensive experience and a commitment to patient care, Dr. Tavichikai leads our team in providing
                  exceptional healthcare services to the Solomon Islands community.
                </p>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our clinic combines clinical excellence with community health initiatives, bridging gaps in the local
                  health system and contributing to better health outcomes across the Solomon Islands.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild variant="outline" className="gap-1">
                  <Link href="/about/dr-lazarus-tavichikai">
                    About Dr. Lazarus
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/about">Learn More About Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Locations</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Visit us at one of our two convenient locations in Honiara, Solomon Islands.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Alvaro, Point Cruz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <Image
                    alt="Alvaro, Point Cruz Location"
                    className="object-cover w-full h-full"
                    height={300}
                    src="/images/ecall-alvaro.webp"
                    width={500}
                  />
                </div>
                <div className="flex items-start gap-2 text-gray-500">
                  <MapPin className="h-4 w-4 mt-1" />
                  <p>Office 4, Alvaro Building, Point Cruz, Honiara</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone className="h-4 w-4" />
                  <p>+677 23130</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail className="h-4 w-4" />
                  <p>hello@ecall.com.sb</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Henderson Court</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <Image
                    alt="Henderson Court Location"
                    className="object-cover w-full h-full"
                    height={300}
                    src="/images/ecall-henderson.jpeg"
                    width={500}
                  />
                </div>
                <div className="flex items-start gap-2 text-gray-500">
                  <MapPin className="h-4 w-4 mt-1" />
                  <p>Room 4 & 5, Henderson Court, Henderson, Honiara</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone className="h-4 w-4" />
                  <p>+677 36130</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail className="h-4 w-4" />
                  <p>hello@ecall.com.sb</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center">
            <Button asChild className="bg-sky-600 hover:bg-sky-700">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
