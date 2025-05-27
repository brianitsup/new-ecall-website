"use client"

import { useState } from "react"
import { ContactForm } from "@/components/contact-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "lucide-react"

interface ServiceContactFormProps {
  serviceName: string
  className?: string
}

export function ServiceContactForm({ serviceName, className = "" }: ServiceContactFormProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-sky-600 hover:bg-sky-700 text-white ${className}`}>
          <Calendar className="h-4 w-4 mr-2" />
          Book This Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {serviceName}</DialogTitle>
          <DialogDescription>
            Fill out the form below to book an appointment or get more information about {serviceName}.
          </DialogDescription>
        </DialogHeader>
        <ContactForm defaultService={serviceName} showServiceSelect={false} className="mt-4" />
      </DialogContent>
    </Dialog>
  )
}
