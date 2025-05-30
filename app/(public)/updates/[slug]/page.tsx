"use client"
import Link from "next/link"
import { ArrowLeft, Calendar, Facebook, Linkedin, Twitter, ArrowRight } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { usePost, useRelatedPosts } from "@/hooks/use-posts"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { post, loading, error } = usePost(params.slug)
  const { relatedPosts, loading: relatedLoading } = useRelatedPosts(post?.category || "", params.slug, 3)

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="h-8 w-40 animate-pulse rounded bg-gray-200"></div>
              <div className="h-12 w-2/3 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="aspect-video animate-pulse rounded-lg bg-gray-200 mb-8"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-gray-200"></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex flex-col min-h-screen">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Post Not Found</h1>
              <p className="text-gray-500">The post you're looking for doesn't exist or has been removed.</p>
              <Button asChild className="bg-sky-600 hover:bg-sky-700">
                <Link href="/updates">Back to Updates</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-sky-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <Link
              href="/updates"
              className="flex items-center text-sm text-sky-600 hover:text-sky-700 transition-colors mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Updates
            </Link>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                <span className="inline-block px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium">
                  {post.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl max-w-[900px]">
                {post.title}
              </h1>
              <p className="text-gray-500">By {post.author || "eCall Health Center"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            {post.image && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  width={1000}
                  height={500}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            )}

            {/* Social Share */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium">Share:</span>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">Share on LinkedIn</span>
              </Button>
            </div>

            {/* Article Content */}
            <article className="prose prose-sky max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
            </article>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Related Updates</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  You might also be interested in these recent updates from eCall Health Center.
                </p>
              </div>
            </div>

            {relatedLoading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex flex-col overflow-hidden rounded-lg border shadow-sm">
                    <div className="aspect-video animate-pulse bg-gray-200"></div>
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="flex flex-col overflow-hidden border-0 shadow-sm">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={relatedPost.image || "/placeholder.svg?height=300&width=600"}
                        alt={relatedPost.title}
                        width={600}
                        height={300}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <CardHeader className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <span className="inline-block px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-medium">
                          {relatedPost.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(relatedPost.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{relatedPost.title}</CardTitle>
                      <CardDescription className="line-clamp-3">{relatedPost.excerpt}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button
                        asChild
                        variant="ghost"
                        className="p-0 h-auto font-medium text-sky-600 hover:text-sky-700"
                      >
                        <Link href={`/updates/${relatedPost.slug}`} className="flex items-center gap-1">
                          Read More <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
