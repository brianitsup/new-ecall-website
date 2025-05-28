import { ArrowLeft, ArrowRight, GraduationCap, Award, Heart, Users } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Dr. Lazarus Tavichikai - Founder & Medical Director | eCall Health Center",
  description:
    "Learn about Dr. Lazarus Tavichikai, founder and medical director of eCall Health Center, his background, qualifications, and commitment to healthcare in Solomon Islands.",
}

export default function DrLazarusTavichikaiPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb Navigation */}
      <section className="w-full py-4 bg-gray-50 border-b">
        <div className="container px-4 md:px-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-sky-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/about" className="hover:text-sky-600">
              About
            </Link>
            <span>/</span>
            <span className="text-gray-900">Dr. Lazarus Tavichikai</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Dr. Lazarus Tavichikai</h1>
                <p className="text-xl text-sky-600 font-medium">Founder & Medical Director</p>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Leading healthcare innovation and community health initiatives in the Solomon Islands with over [X]
                  years of medical experience and a passion for accessible healthcare.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild className="bg-sky-600 hover:bg-sky-700">
                  <Link href="/contact">Book Consultation</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/about" className="gap-1">
                    <ArrowLeft className="h-4 w-4" />
                    Back to About
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <Image
                alt="Dr. Lazarus Tavichikai - Founder and Medical Director of eCall Health Center"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height={500}
                src="/placeholder.svg?height=500&width=500&text=Dr.+Lazarus+Tavichikai"
                width={500}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Professional Background */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Professional Background</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A distinguished medical career dedicated to improving healthcare outcomes in the Solomon Islands.
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-sky-600" />
                  Education & Training
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">[Medical Degree]</h4>
                  <p className="text-sm text-gray-500">[University Name], [Year]</p>
                </div>
                <div>
                  <h4 className="font-medium">[Specialization/Residency]</h4>
                  <p className="text-sm text-gray-500">[Institution], [Year]</p>
                </div>
                <div>
                  <h4 className="font-medium">[Additional Qualifications]</h4>
                  <p className="text-sm text-gray-500">[Details to be added]</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="h-5 w-5 text-sky-600" />
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">Founder & Medical Director</h4>
                  <p className="text-sm text-gray-500">eCall Health Center, [Year] - Present</p>
                </div>
                <div>
                  <h4 className="font-medium">[Previous Position]</h4>
                  <p className="text-sm text-gray-500">[Institution], [Years]</p>
                </div>
                <div>
                  <h4 className="font-medium">[Previous Position]</h4>
                  <p className="text-sm text-gray-500">[Institution], [Years]</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Vision for Healthcare</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Dr. Tavichikai's vision extends beyond traditional medical practice. He believes in creating a
                  healthcare system that is accessible, affordable, and culturally sensitive to the needs of Solomon
                  Islands communities.
                </p>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  His approach combines modern medical practices with community health initiatives, focusing on
                  preventive care and health education to create lasting positive impacts on public health outcomes.
                </p>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  [Additional details about his philosophy, approach to patient care, and commitment to the community
                  will be added here.]
                </p>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <Image
                alt="Dr. Lazarus Tavichikai with patients and community"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height={400}
                src="/placeholder.svg?height=400&width=600&text=Community+Healthcare+Vision"
                width={600}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements & Impact */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Achievements & Community Impact
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Making a difference in healthcare delivery and community health outcomes across the Solomon Islands.
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
                <Heart className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold">Patient Care Excellence</h3>
              <p className="text-sm text-gray-500">
                [Number] patients served with compassionate, high-quality medical care across multiple specialties.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
                <Users className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold">Community Health Programs</h3>
              <p className="text-sm text-gray-500">
                Initiated and led [number] community health programs focusing on preventive care and health education.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">
                <Award className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold">Professional Recognition</h3>
              <p className="text-sm text-gray-500">
                [Awards, recognitions, or professional achievements to be added based on actual accomplishments.]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Philosophy */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-sky-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                "Healthcare is a fundamental right, not a privilege"
              </h2>
              <p className="max-w-[800px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Dr. Tavichikai's commitment to accessible healthcare drives every aspect of eCall Health Center's
                mission. His dedication to serving the Solomon Islands community reflects a deep understanding of local
                health challenges and a vision for sustainable healthcare solutions.
              </p>
              <p className="max-w-[800px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                [Additional personal philosophy, quotes, or mission statements will be added here based on actual
                content.]
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild className="bg-sky-600 hover:bg-sky-700">
                <Link href="/contact">Schedule Consultation</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/services" className="gap-1">
                  Our Services
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
