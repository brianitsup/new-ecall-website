import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logos/logo.png"
                alt="eCall Health Center Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <h3 className="text-lg font-bold">eCall Health Center</h3>
            </div>
            <p className="text-sm text-gray-500">
              Providing affordable, patient-centered health services in Solomon Islands.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-sky-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-sky-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="mailto:enquiries@ecall.com.sb" className="text-gray-500 hover:text-sky-600">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Locations</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-sky-600 mt-0.5" />
                <p className="text-sm text-gray-500">Office 4, Alvaro Building, Point Cruz, Honiara</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-sky-600 mt-0.5" />
                <p className="text-sm text-gray-500">Room 4 & 5, Henderson Court, Henderson, Honiara</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-sky-600" />
                <p className="text-sm text-gray-500">Alvaro: +677 23130 | Henderson: +677 36130</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-sky-600" />
                <p className="text-sm text-gray-500">hello@ecall.com.sb</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-sm text-gray-500 hover:text-sky-600">
                Home
              </Link>
              <Link href="/about" className="text-sm text-gray-500 hover:text-sky-600">
                About
              </Link>
              <Link href="/services" className="text-sm text-gray-500 hover:text-sky-600">
                Services
              </Link>
              <Link href="/updates" className="text-sm text-gray-500 hover:text-sky-600">
                Updates
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-sky-600">
                Contact
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} eCall Health Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
