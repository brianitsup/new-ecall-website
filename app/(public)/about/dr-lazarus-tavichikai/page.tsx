import { ArrowLeft, ArrowRight, GraduationCap, Award, Users } from "lucide-react"
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
                  Leading healthcare innovation in the Solomon Islands with over 20 years of medical experience,
                  specializing in radiology and diagnostic imaging, with a passion for accessible healthcare and public
                  health.
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
                src="/images/lazarus-tavichikai.webp"
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
                A distinguished medical career spanning over two decades, from medical internship to founding eCall
                Health Center.
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
                  <h4 className="font-medium">Medical Degree</h4>
                  <p className="text-sm text-gray-500">Fiji School of Medicine</p>
                </div>
                <div>
                  <h4 className="font-medium">Master of Public Health and Tropical Medicine (MPHTM)</h4>
                  <p className="text-sm text-gray-500">James Cook University, Australia</p>
                </div>
                <div>
                  <h4 className="font-medium">DHC Paediatric Medicine</h4>
                  <p className="text-sm text-gray-500">University of Sydney, Australia (2013)</p>
                </div>
                <div>
                  <h4 className="font-medium">Radiology Training</h4>
                  <p className="text-sm text-gray-500">CWMH Hospital, Fiji (2006)</p>
                </div>
                <div>
                  <h4 className="font-medium">Medical Internship</h4>
                  <p className="text-sm text-gray-500">National Referral Hospital, Solomon Islands (2001)</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="h-5 w-5 text-sky-600" />
                  Career Progression
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">Founder & Medical Director</h4>
                  <p className="text-sm text-gray-500">eCall Health Center, 2014 - Present</p>
                </div>
                <div>
                  <h4 className="font-medium">Radiologist</h4>
                  <p className="text-sm text-gray-500">National Referral Hospital, 2005 - 2014</p>
                </div>
                <div>
                  <h4 className="font-medium">Internal Medicine & Emergency Department</h4>
                  <p className="text-sm text-gray-500">National Referral Hospital, 2001 - 2005</p>
                </div>
                <div>
                  <h4 className="font-medium">Relief Doctor</h4>
                  <p className="text-sm text-gray-500">Honiara General Hospital</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Specializations & Services */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Medical Specializations</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Dr. Tavichikai specializes in radiology and diagnostic imaging, offering a comprehensive range of
                  ultrasound services at eCall Health Center.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                    <span className="text-sm">Obstetric Scans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                    <span className="text-sm">Liver & Kidney Scans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                    <span className="text-sm">Prostate & Abdominal Scans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                    <span className="text-sm">Gynecological Scans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                    <span className="text-sm">Thyroid & Eye Scans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                    <span className="text-sm">Inguinoscrotal Scans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                    <span className="text-sm">Echocardiography</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-sky-600 rounded-full"></div>
                    <span className="text-sm">Public Health Consulting</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <Image
                alt="Dr. Lazarus Tavichikai providing medical consultation"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height={400}
                src="/placeholder.svg?height=400&width=600&text=Medical+Consultation"
                width={600}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Professional Memberships */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Professional Memberships</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Active membership in leading international medical organizations and professional bodies.
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-sm text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mx-auto mb-3 overflow-hidden rounded-full">
                  <Image
                    src="/images/RACGP.png"
                    alt="Royal Australian College of General Practitioners icon"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm">Royal Australian College of General Practitioners (RACGP)</h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mx-auto mb-3 overflow-hidden rounded-full">
                  <Image
                    src="/images/ACRRM.png"
                    alt="Australian College of Rural and Remote Medicine icon"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm">Australian College of Rural and Remote Medicine (ACRRM)</h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mx-auto mb-3 overflow-hidden rounded-full">
                  <Image
                    src="/images/ASUM.png"
                    alt="Australasian Society for Ultrasound in Medicine icon"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm">Australasian Society for Ultrasound in Medicine (ASUM)</h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mx-auto mb-3 overflow-hidden rounded-full">
                  <Image
                    src="/images/RCGP.png"
                    alt="Royal College of General Practitioners icon"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm">Royal College of General Practitioners (RCGP – UK)</h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mx-auto mb-3 overflow-hidden rounded-full">
                  <Image
                    src="/images/ESCARDIO.png"
                    alt="European Society of Cardiology icon"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm">European Society of Cardiology (ESCARDIO – Europe)</h3>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mx-auto mb-3 overflow-hidden rounded-full">
                  <Image
                    src="/images/AIUM.png"
                    alt="American Institute of Ultrasound in Medicine icon"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-sm">American Institute of Ultrasound in Medicine (AIUM – USA)</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership & Board Roles */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Leadership & Board Roles</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Contributing to healthcare development and professional advancement in the Solomon Islands through
                leadership positions.
              </p>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5 text-sky-600" />
                  Current Positions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">Board Member</h4>
                  <p className="text-sm text-gray-500">Solomon Islands Medical and Dental Board (SIMDB)</p>
                </div>
                <div>
                  <h4 className="font-medium">Relief Doctor</h4>
                  <p className="text-sm text-gray-500">Helena Goldie Hospital</p>
                </div>
                <div>
                  <h4 className="font-medium">Founding Interim Chair</h4>
                  <p className="text-sm text-gray-500">Solomon Islands Private Doctors Association (SIPDA) & SIGMA</p>
                </div>
                <div>
                  <h4 className="font-medium">Trustee</h4>
                  <p className="text-sm text-gray-500">Empower Isles</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="h-5 w-5 text-sky-600" />
                  Previous Leadership Roles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">Board Member</h4>
                  <p className="text-sm text-gray-500">Solomon Islands Chamber of Commerce and Industry (SICCI)</p>
                </div>
                <div>
                  <h4 className="font-medium">Board Member</h4>
                  <p className="text-sm text-gray-500">
                    Solomon Islands Country Coordinating Mechanism (SICCM) for Global Fund
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Founding Chair</h4>
                  <p className="text-sm text-gray-500">Small and Medium Enterprise Working Group (SMEWG) under SICCI</p>
                </div>
                <div>
                  <h4 className="font-medium">Health Impact Assessment Consultant</h4>
                  <p className="text-sm text-gray-500">NFD and development of occupational clinic in Noro</p>
                </div>
                <div>
                  <h4 className="font-medium">UN-Designated Physician</h4>
                  <p className="text-sm text-gray-500">Medical evacuations (MEDEVACS) for UN expatriates</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Personal Life & Philosophy */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Personal Philosophy & Life
              </h2>
            </div>

            <div className="space-y-8">
              {/* Quote Section */}
              <div className="bg-sky-50 rounded-lg p-8 text-center">
                <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  "Healthcare is a fundamental right, not a privilege"
                </blockquote>
                <cite className="text-sky-600 font-medium">- Dr. Lazarus Tavichikai</cite>
              </div>

              {/* Content Grid */}
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Personal Life</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Beyond his professional achievements, Dr. Tavichikai is a devoted husband and father of four. He
                    believes in creating a healthcare system that is accessible, affordable, and culturally sensitive to
                    the needs of Solomon Islands communities.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    In his personal time, he enjoys gardening, watching movies, reading, and recently has taken up
                    writing novels and screenplays.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">Healthcare Philosophy</h3>
                  <p className="text-gray-600 leading-relaxed">
                    His approach combines modern medical practices with community health initiatives, focusing on
                    preventive care and health education to create lasting positive impacts on public health outcomes.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Dr. Tavichikai's vision extends beyond traditional medical practice, emphasizing the importance of
                    accessible healthcare for all Solomon Islands communities.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center pt-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
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
          </div>
        </div>
      </section>
    </div>
  )
}
