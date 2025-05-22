import { Folder, FileImage, FileText, FileIcon } from "lucide-react"

export default function AssetsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Asset Directory</h1>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                This page explains the asset structure for the eCall Health Center website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Asset Directory Information */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Asset Directory Structure</h2>
              <p className="text-gray-500 mb-6">
                The following directory structure has been created in the <code>public</code> folder for organizing
                website assets:
              </p>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                <div className="flex items-start gap-2">
                  <Folder className="h-5 w-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="font-medium">public/</p>
                    <div className="pl-5 pt-2 space-y-3">
                      <div className="flex items-start gap-2">
                        <Folder className="h-5 w-5 text-sky-600 mt-0.5" />
                        <div>
                          <p className="font-medium">images/</p>
                          <p className="text-sm text-gray-500">
                            For all website images (hero images, location photos, service images, etc.)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Folder className="h-5 w-5 text-sky-600 mt-0.5" />
                        <div>
                          <p className="font-medium">logos/</p>
                          <p className="text-sm text-gray-500">For eCall Health Center logos and partner logos</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Folder className="h-5 w-5 text-sky-600 mt-0.5" />
                        <div>
                          <p className="font-medium">icons/</p>
                          <p className="text-sm text-gray-500">For any custom icons not available in Lucide icons</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Folder className="h-5 w-5 text-sky-600 mt-0.5" />
                        <div>
                          <p className="font-medium">documents/</p>
                          <p className="text-sm text-gray-500">
                            For downloadable documents like forms, brochures, and PDFs
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">How to Use Assets</h2>
              <p className="text-gray-500 mb-6">
                After uploading assets to these directories, you can reference them in your code as follows:
              </p>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                <div className="flex items-start gap-2">
                  <FileImage className="h-5 w-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Images</p>
                    <p className="text-sm text-gray-500 mb-2">Example usage in Next.js:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      {`<img src="/images/hero.jpg" alt="Hero Image" />`}
                    </pre>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FileIcon className="h-5 w-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Icons</p>
                    <p className="text-sm text-gray-500 mb-2">Example usage in Next.js:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      {`<img src="/icons/custom-icon.svg" alt="Custom Icon" />`}
                    </pre>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-sky-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Documents</p>
                    <p className="text-sm text-gray-500 mb-2">Example usage in Next.js:</p>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      {`<a href="/documents/registration-form.pdf" download>Download Registration Form</a>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-500">
                <li>Use descriptive filenames with kebab-case (e.g., hero-image.jpg, registration-form.pdf)</li>
                <li>Optimize images before uploading to reduce file size and improve website performance</li>
                <li>
                  Use appropriate file formats: JPG/JPEG for photos, PNG for images with transparency, SVG for icons
                </li>
                <li>Keep the directory structure organized by adding subdirectories as needed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
