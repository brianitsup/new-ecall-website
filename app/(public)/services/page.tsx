import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
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
  MapPin,
  CalendarPlus,
} from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      title: "Maternal & Child Healthcare",
      description:
        "Comprehensive care for mothers and children, including prenatal care, delivery services, postnatal care, and pediatric health services.",
      icon: <Baby className="h-12 w-12 text-sky-600" />,
      locations: ["Alvaro", "Henderson Court"],
    },
    {
      title: "Medical Consultations",
      description:
        "Professional medical consultations with experienced doctors for diagnosis, treatment planning, and health advice.",
      icon: <Stethoscope className="h-12 w-12 text-sky-600" />,
      locations: ["Alvaro", "Henderson Court"],
    },
    {
      title: "Medications & Treatment",
      description:
        "Access to essential medications and comprehensive treatment programs for various health conditions.",
      icon: <Pill className="h-12 w-12 text-sky-600" />,
      locations: ["Alvaro", "Henderson Court"],
    },
    {
      title: "Ultrasound & Imaging",
      description:
        "Advanced diagnostic imaging services including ultrasound, X-rays, and other medical imaging technologies.",
      icon: <Activity className="h-12 w-12 text-sky-600" />,
      locations: ["Alvaro", "Henderson Court"],
    },
    {
      title: "Minor Surgical Procedures",
      description: "Safe and professional minor surgical procedures performed by qualified medical professionals.",
      icon: <Scissors className="h-12 w-12 text-sky-600" />,
      locations: ["Alvaro", "Henderson Court"],
    },
    {
      title: "Laboratory Services",
      description: "Comprehensive laboratory testing services for accurate diagnosis and health monitoring.",
      icon: <FlaskConical className="h-12 w-12 text-sky-600" />,
      locations: ["Alvaro", "Henderson Court"],
    },
    {
      title: "Microscopy Services",
      description: "Advanced microscopy services for detailed medical analysis and diagnostic purposes.",
      icon: <Microscope className="h-12 w-12 text-sky-600" />,
      locations: ["Alvaro", "Henderson Court"],
    },
    {
      title: "Dental Services",
      description: "Complete dental care services including preventive care, treatments, and oral health education.",
      icon: <Smile className="h-12 w-12 text-sky-600" />,
      locations: ["Henderson Court"],
    },
    {
      title: "Occupational Health",
      description: "Workplace health services to ensure employee wellness and safety in various occupational settings.",
      icon: <Briefcase className="h-12 w-12 text-sky-600" />,
      locations: ["Alvaro", "Henderson Court"],
    },
    {
      title: "Public Health Consultancy",
      description:
        "Expert consultancy services for public health initiatives, policy development, and community health programs.",
      icon: <Users className="h-12 w-12 text-sky-600" />,
      locations: ["Alvaro", "Henderson Court"],
    },
    {
      title: "Overseas Medical Referrals",
      description: "Coordination and facilitation of medical referrals to overseas specialists and medical facilities.",
      icon: <Globe className="h-12 w-12 text-sky-600" />,
      locations: ["Alvaro", "Henderson Court"],
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
                eCall Health Center provides a comprehensive range of medical services delivered with excellence and
                compassion by our experienced healthcare team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow group">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-sky-50 p-4 rounded-full">{service.icon}</div>
                  </div>
                  <CardTitle className="text-xl text-center">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-center text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <MapPin className="h-4 w-4 text-sky-600 mr-1" />
                      <span className="text-xs font-medium text-gray-600">Available at</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-1">
                      {service.locations.map((location, locationIndex) => (
                        <Badge
                          key={locationIndex}
                          variant="secondary"
                          className="bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs px-2 py-1"
                        >
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 transition-colors group-hover:bg-sky-100 group-hover:scale-105 transition-all duration-200"
                      title="Book appointment"
                    >
                      <CalendarPlus className="h-5 w-5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-sky-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Need Medical Assistance?</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Contact us today to schedule an appointment or learn more about our comprehensive healthcare services.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="bg-sky-600 hover:bg-sky-700">
                <Link href="/contact">Book Appointment</Link>
              </Button>
              <Button asChild variant="outline" className="border-sky-600 text-sky-600 hover:bg-sky-50">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
