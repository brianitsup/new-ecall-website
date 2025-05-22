"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logos/logo.png" alt="eCall Health Center Logo" width={32} height={32} className="h-8 w-auto" />
            <span className="font-bold text-xl text-sky-600">eCall Health Center</span>
          </Link>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:text-sky-600 transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-sky-600 transition-colors">
            About
          </Link>
          <Link href="/services" className="text-sm font-medium hover:text-sky-600 transition-colors">
            Services
          </Link>
          <Link href="/updates" className="text-sm font-medium hover:text-sky-600 transition-colors">
            Updates
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-sky-600 transition-colors">
            Contact
          </Link>
        </nav>
        <div className="hidden md:flex">
          <Button asChild className="bg-sky-600 hover:bg-sky-700">
            <Link href="/contact">Book Appointment</Link>
          </Button>
        </div>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="container md:hidden py-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-sm font-medium hover:text-sky-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-sky-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium hover:text-sky-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/updates"
              className="text-sm font-medium hover:text-sky-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Updates
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-sky-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Button asChild className="bg-sky-600 hover:bg-sky-700 w-full" onClick={() => setIsMenuOpen(false)}>
              <Link href="/contact">Book Appointment</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
