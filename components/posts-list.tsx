"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Search, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePosts } from "@/hooks/use-posts"

interface PostsListProps {
  showSearch?: boolean
  showCategoryFilter?: boolean
  showLoadMore?: boolean
  limit?: number
  className?: string
}

export function PostsList({
  showSearch = true,
  showCategoryFilter = true,
  showLoadMore = true,
  limit = 12,
  className = "",
}: PostsListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce search query
  const debounceSearch = useCallback((query: string) => {
    const timer = setTimeout(() => {
      setDebouncedSearch(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Update debounced search when searchQuery changes
  useState(() => {
    const cleanup = debounceSearch(searchQuery)
    return cleanup
  })

  const { posts, loading, error, totalCount, hasMore, loadMore, refresh } = usePosts({
    limit,
    category: selectedCategory || undefined,
    searchQuery: debouncedSearch || undefined,
    selectFields: "id, title, excerpt, category, image, author, created_at",
  })

  const categories = ["Clinic News", "Health Tips", "Programs", "Community Outreach", "Public Health", "Events"]

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === "all" ? "" : value)
  }

  const handleLoadMore = async () => {
    await loadMore()
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-medium text-red-600">Error Loading Posts</h3>
        <p className="text-gray-500 mt-2">{error}</p>
        <Button onClick={refresh} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters */}
      {(showSearch || showCategoryFilter) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input placeholder="Search posts..." value={searchQuery} onChange={handleSearchChange} className="pl-9" />
            </div>
          )}

          {showCategoryFilter && (
            <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <div className="text-sm text-gray-500">
          {totalCount === 0 ? "No posts found" : `${totalCount} post${totalCount === 1 ? "" : "s"} found`}
          {(searchQuery || selectedCategory) && (
            <Button
              variant="link"
              className="p-0 h-auto ml-2 text-sky-600"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("")
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Posts Grid */}
      {loading && posts.length === 0 ? (
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
      ) : posts.length > 0 ? (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="flex flex-col overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow duration-200"
              >
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg?height=300&width=600"}
                    alt={post.title}
                    width={600}
                    height={300}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    loading="lazy"
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
                  <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
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

          {/* Load More Button */}
          {showLoadMore && hasMore && (
            <div className="flex justify-center mt-8">
              <Button onClick={handleLoadMore} variant="outline" disabled={loading} className="min-w-32">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Posts"
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-xl font-medium">No posts found</h3>
          <p className="text-gray-500 mt-2">
            {searchQuery || selectedCategory
              ? "Try adjusting your search or filter criteria"
              : "Check back soon for new updates and health resources."}
          </p>
        </div>
      )}
    </div>
  )
}
