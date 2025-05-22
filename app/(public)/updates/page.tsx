"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/supabase-js"

export default function UpdatesPage() {
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setBlogPosts(data || [])
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Updates & Health Resources
              </h1>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Stay informed with the latest news, health tips, and updates from eCall Health Center.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col overflow-hidden rounded-lg border shadow-sm">
                  <div className="aspect-video animate-pulse bg-gray-200"></div>
                  <div className="flex-1 p-6 space-y-4">
                    <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Card key={post.id} className="flex flex-col overflow-hidden border-0 shadow-sm">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image || "/placeholder.svg?height=300&width=600"}
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span className="inline-block px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild variant="ghost" className="p-0 h-auto font-medium text-sky-600 hover:text-sky-700">
                      <Link href={`/updates/${post.id}`} className="flex items-center gap-1">
                        Read More <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium">No updates available</h3>
              <p className="text-gray-500 mt-2">Check back soon for new updates and health resources.</p>
            </div>
          )}

          {/* Pagination - Only show if there are posts */}
          {blogPosts.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-sky-50">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-sky-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Stay Updated</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Subscribe to our newsletter to receive the latest health tips and clinic updates.
              </p>
            </div>
            <div className="w-full max-w-md flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button className="bg-sky-600 hover:bg-sky-700">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
