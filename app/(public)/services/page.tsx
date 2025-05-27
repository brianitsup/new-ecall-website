import { ServiceContactForm } from "@/components/service-contact-form"

export default function ServicesPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Medical Consultations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Medical Consultations</h2>
          <p className="text-gray-700 mb-4">
            Receive expert medical advice and guidance from our experienced healthcare professionals.
          </p>
          <ServiceContactForm serviceName="Medical Consultations" className="w-full" />
        </div>

        {/* Mental Health Support */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Mental Health Support</h2>
          <p className="text-gray-700 mb-4">
            Access compassionate and confidential mental health support services to improve your well-being.
          </p>
          <ServiceContactForm serviceName="Mental Health Support" className="w-full" />
        </div>

        {/* Nutritional Guidance */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Nutritional Guidance</h2>
          <p className="text-gray-700 mb-4">
            Get personalized nutritional advice and meal plans to optimize your health and achieve your dietary goals.
          </p>
          <ServiceContactForm serviceName="Nutritional Guidance" className="w-full" />
        </div>

        {/* Fitness Programs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Fitness Programs</h2>
          <p className="text-gray-700 mb-4">
            Join our tailored fitness programs designed to help you reach your fitness goals and improve your overall
            health.
          </p>
          <ServiceContactForm serviceName="Fitness Programs" className="w-full" />
        </div>

        {/* Wellness Workshops */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Wellness Workshops</h2>
          <p className="text-gray-700 mb-4">
            Participate in our informative and engaging wellness workshops to learn about various health topics and
            improve your lifestyle.
          </p>
          <ServiceContactForm serviceName="Wellness Workshops" className="w-full" />
        </div>

        {/* Personalized Health Plans */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Personalized Health Plans</h2>
          <p className="text-gray-700 mb-4">
            Receive a customized health plan tailored to your specific needs and goals, developed in consultation with
            our healthcare experts.
          </p>
          <ServiceContactForm serviceName="Personalized Health Plans" className="w-full" />
        </div>
      </div>
    </div>
  )
}
