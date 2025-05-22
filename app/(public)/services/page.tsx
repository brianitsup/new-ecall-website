import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ServicesPage() {
  // Array of services with their details, including location availability
  const services = [
    {
      title: "Medical Consultations",
      description:
        "Our experienced doctors provide comprehensive medical consultations for patients of all ages. We focus on preventive care, diagnosis, and treatment of various health conditions with personalized attention.",
      locations: "Both locations",
    },
    {
      title: "Medications and Treatment",
      description:
        "We provide a wide range of medications and treatments for various conditions. Our clinic ensures access to essential medicines and appropriate therapeutic interventions tailored to each patient's needs.",
      locations: "Both locations",
    },
    {
      title: "Ultrasound Imaging",
      description:
        "We offer advanced diagnostic imaging services to help accurately assess and diagnose various conditions. Our ultrasound services include abdominal, pelvic, obstetric, and soft tissue examinations.",
      locations: "Both locations",
    },
    {
      title: "Minor Surgical Procedures",
      description:
        "Our clinic is equipped to perform a range of minor surgical procedures in a safe and sterile environment. These include wound care, abscess drainage, suturing, and removal of skin lesions.",
      locations: "Both locations",
    },
    {
      title: "Maternal & Child Healthcare",
      description:
        "We provide specialized care for mothers and children at all stages, including prenatal care, postnatal support, child health check-ups, vaccinations, and developmental assessments.",
      locations: "Both locations",
    },
    {
      title: "Laboratory Services",
      description:
        "Our comprehensive laboratory services include blood tests, urinalysis, and other diagnostic tests to help in the accurate diagnosis and monitoring of various health conditions with timely and reliable results.",
      locations: "Both locations",
    },
    {
      title: "Microscopy Services",
      description:
        "We offer specialized microscopy services for the diagnosis of infectious diseases prevalent in Solomon Islands, including malaria, dengue fever, and other parasitic infections, providing quick and accurate results.",
      locations: "Both locations",
    },
    {
      title: "Dental Services",
      description:
        "Our dental services include routine check-ups, cleanings, fillings, extractions, and preventive care. We focus on maintaining oral health and addressing dental issues with professional and gentle care.",
      locations: "Henderson Court branch only",
      specialLocation: true,
    },
    {
      title: "Occupational Health Services",
      description:
        "We provide comprehensive occupational health services for businesses and organizations, including pre-employment assessments, periodic health check-ups, and workplace health and safety consultations.",
      locations: "Both locations",
    },
    {
      title: "Public Health Consultancy",
      description:
        "Our team provides expert consultancy services in public health, helping organizations and communities develop and implement effective health programs and policies.",
      locations: "Both locations",
    },
    {
      title: "Overseas Medical Referrals",
      description:
        "Through our partnership with Medivisor India, we support advanced overseas medical referrals for patients who require specialized treatment not available locally.",
      locations: "Both locations",
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
                eCall Health Center offers a wide range of affordable and patient-centered health services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video overflow-hidden rounded-lg mb-4">
                    <img
                      alt={service.title}
                      className="object-cover w-full h-full"
                      height="200"
                      src="/placeholder.svg?height=200&width=350"
                      width="350"
                    />
                  </div>
                  <CardDescription className="text-sm text-gray-500">{service.description}</CardDescription>
                  <div className="flex items-center gap-2 mt-4">
                    <MapPin className="h-4 w-4 text-sky-600" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Locations:</span>
                      {service.specialLocation ? (
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{service.locations}</Badge>
                      ) : (
                        <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-100">{service.locations}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
