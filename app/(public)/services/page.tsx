import Link from "next/link"
import { ArrowRight, MapPin, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
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

export default function ServicesPage() {
  // Array of services with their details, including location availability and icons
  const services = [
    {
      title: "Medical Consultations",
      description:
        "Our experienced doctors provide comprehensive medical consultations for patients of all ages. We focus on preventive care, diagnosis, and treatment of various health conditions.",
      locations: "Both locations",
      icon: Stethoscope,
      bookingUrl: "/contact?service=medical-consultations",
    },
    {
      title: "Medications and Treatment",
      description:
        "We provide a wide range of medications and treatments for various conditions. Our clinic ensures access to essential medicines and appropriate therapeutic interventions.",
      locations: "Both locations",
      icon: Pill,
      bookingUrl: "/contact?service=medications-treatment",
    },
    {
      title: "Ultrasound Imaging",
      description:
        "We offer advanced diagnostic imaging services to help accurately assess and diagnose various conditions. Our ultrasound services include comprehensive examinations.",
      locations: "Both locations",
      icon: Activity,
      bookingUrl: "/contact?service=ultrasound-imaging",
    },
    {
      title: "Minor Surgical Procedures",
      description:
        "Our clinic is equipped to perform a range of minor surgical procedures in a safe and sterile environment. These include wound care, abscess drainage, and suturing.",
      locations: "Both locations",
      icon: Scissors,
      bookingUrl: "/contact?service=minor-surgical-procedures",
    },
    {
      title: "Maternal & Child Healthcare",
      description:
        "We provide specialized care for mothers and children at all stages, including prenatal care, postnatal support, child health check-ups, and vaccinations.",
      locations: "Both locations",
      icon: Baby,
      bookingUrl: "/contact?service=maternal-child-healthcare",
    },
    {
      title: "Laboratory Services",
      description:
        "Our comprehensive laboratory services include blood tests, urinalysis, and other diagnostic tests to help in the accurate diagnosis and monitoring of health conditions.",
      locations: "Both locations",
      icon: FlaskConical,
      bookingUrl: "/contact?service=laboratory-services",
    },
    {
      title: "Microscopy Services",
      description:
        "We offer specialized microscopy services for the diagnosis of infectious diseases prevalent in Solomon Islands, including malaria, dengue fever, and parasitic infections.",
      locations: "Both locations",
      icon: Microscope,
      bookingUrl: "/contact?service=microscopy-services",
    },
    {
      title: "Dental Services",
      description:
        "Our dental services include routine check-ups, cleanings, fillings, extractions, and preventive care. We focus on maintaining oral health with professional care.",
      locations: "Henderson Court only",
      specialLocation: true,
      icon: Smile,
      bookingUrl: "/contact?service=dental-services",
    },
    {
      title: "Occupational Health Services",
      description:
        "We provide comprehensive occupational health services for businesses and organizations, including pre-employment assessments and workplace health consultations.",
      locations: "Both locations",
      icon: Briefcase,
      bookingUrl: "/contact?service=occupational-health",
    },
    {
      title: "Public Health Consultancy",
      description:
        "Our team provides expert consultancy services in public health, helping organizations and communities develop and implement effective health programs and policies.",
      locations: "Both locations",
      icon: Users,
      bookingUrl: "/contact?service=public-health-consultancy",
    },
    {
      title: "Overseas Medical Referrals",
      description:
        "Through our partnership with Medivisor India, we support advanced overseas medical referrals for patients who require specialized treatment not available locally.",
      locations: "Both locations",
      icon: Globe,
      bookingUrl: "/contact?service=overseas-medical-referrals",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Services</h1>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                eCall Health Center offers a wide range of affordable and patient-centered health services across our
                two convenient locations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card
                  key={index}
                  className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 group-hover:bg-sky-200 transition-colors duration-300">
                      <IconComponent className="h-8 w-8 text-sky-600" />
                    </div>
                    <CardTitle className="text-xl leading-tight">{service.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 pt-0 pb-4">
                    <CardDescription className="text-sm text-gray-600 leading-relaxed mb-4">
                      {service.description}
                    </CardDescription>

                    <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
                      <MapPin className="h-4 w-4 text-sky-600 flex-shrink-0" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Available at:</span>
                        {service.specialLocation ? (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200 text-xs px-2 py-1"
                          >
                            {service.locations}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200 text-xs px-2 py-1">
                            {service.locations}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button
                      asChild
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <Link href={service.bookingUrl} className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Book This Service
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                <Calendar className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
              <p className="text-sm text-gray-600">
                Book appointments quickly and easily through our contact form or by calling our clinics directly.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                <MapPin className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Two Locations</h3>
              <p className="text-sm text-gray-600">
                Choose from our Alvaro Point Cruz or Henderson Court locations for your convenience.
              </p>
            </div>
            <div className="text-center md:col-span-2 lg:col-span-1">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                <Stethoscope className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Care</h3>
              <p className="text-sm text-gray-600">
                Receive professional, patient-centered healthcare from our experienced medical team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-sky-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Experience Quality Healthcare?
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Contact us today to schedule an appointment or learn more about our services.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="bg-sky-600 hover:bg-sky-700">
                <Link href="/contact">Book Appointment</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact" className="gap-1">
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
