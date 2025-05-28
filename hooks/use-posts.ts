"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  slug?: string
  category?: string
  image?: string | null
  author?: string
  published?: boolean
  created_at: string
  updated_at?: string
}

interface UsePostsOptions {
  limit?: number
  offset?: number
  category?: string
  searchQuery?: string
  published?: boolean
}

interface UsePostsReturn {
  posts: Post[]
  loading: boolean
  error: string | null
  totalCount: number
  hasMore: boolean
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

export function usePosts(options: UsePostsOptions = {}): UsePostsReturn {
  const { limit = 10, offset = 0, category, searchQuery, published } = options

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentOffset, setCurrentOffset] = useState(offset)

  const fetchPosts = useCallback(
    async (isLoadMore = false, customOffset = 0) => {
      try {
        if (!isLoadMore) {
          setLoading(true)
          setError(null)
        }

        // First, check what columns exist in the posts table
        const { data: tableInfo, error: tableError } = await supabase.from("posts").select("*").limit(1)

        if (tableError) {
          console.error("Error checking table structure:", tableError)
          throw tableError
        }

        // Determine available columns
        const hasPublished = tableInfo && tableInfo.length > 0 && "published" in tableInfo[0]
        const hasSlug = tableInfo && tableInfo.length > 0 && "slug" in tableInfo[0]
        const hasCategory = tableInfo && tableInfo.length > 0 && "category" in tableInfo[0]
        const hasAuthor = tableInfo && tableInfo.length > 0 && "author" in tableInfo[0]

        // Build query based on available columns
        let query = supabase
          .from("posts")
          .select("*", { count: "exact" })
          .order("created_at", { ascending: false })
          .range(customOffset, customOffset + limit - 1)

        // Add filters only if columns exist
        if (hasPublished && published !== undefined) {
          query = query.eq("published", published)
        }

        if (hasCategory && category) {
          query = query.eq("category", category)
        }

        if (searchQuery) {
          if (hasSlug) {
            query = query.or(
              `title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`,
            )
          } else {
            query = query.or(
              `title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`,
            )
          }
        }

        const { data, error: fetchError, count } = await query

        if (fetchError) {
          console.error("Error fetching posts:", fetchError)
          throw fetchError
        }

        // Normalize the data to ensure consistent structure
        const normalizedPosts = (data || []).map((post) => ({
          id: post.id,
          title: post.title || "Untitled",
          content: post.content || "",
          excerpt: post.excerpt || "",
          slug: hasSlug ? post.slug : post.id,
          category: hasCategory ? post.category : "General",
          image: post.image || null,
          author: hasAuthor ? post.author : "ECall Health Center",
          published: hasPublished ? post.published : true,
          created_at: post.created_at,
          updated_at: post.updated_at || post.created_at,
        }))

        if (isLoadMore) {
          setPosts((prev) => [...prev, ...normalizedPosts])
        } else {
          setPosts(normalizedPosts)
        }

        setTotalCount(count || 0)
        setCurrentOffset(customOffset + normalizedPosts.length)
      } catch (error: any) {
        console.error("Error fetching posts:", error)
        setError(error.message || "Failed to fetch posts")
      } finally {
        setLoading(false)
      }
    },
    [limit, category, searchQuery, published],
  )

  const loadMore = useCallback(async () => {
    if (loading || currentOffset >= totalCount) return
    await fetchPosts(true, currentOffset)
  }, [loading, currentOffset, totalCount, fetchPosts])

  const refresh = useCallback(async () => {
    setCurrentOffset(0)
    await fetchPosts(false, 0)
  }, [fetchPosts])

  useEffect(() => {
    setCurrentOffset(0)
    fetchPosts(false, 0)
  }, [fetchPosts])

  const hasMore = currentOffset < totalCount

  return {
    posts,
    loading,
    error,
    totalCount,
    hasMore,
    loadMore,
    refresh,
  }
}

// Hook for single post by slug or ID
export function usePost(slugOrId: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slugOrId) return

    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        // First try to fetch by slug, then by ID
        let query = supabase.from("posts").select("*")

        // Check if the posts table has a slug column
        const { data: tableInfo } = await supabase.from("posts").select("*").limit(1)

        const hasSlug = tableInfo && tableInfo.length > 0 && "slug" in tableInfo[0]
        const hasPublished = tableInfo && tableInfo.length > 0 && "published" in tableInfo[0]

        if (hasSlug) {
          query = query.eq("slug", slugOrId)
        } else {
          query = query.eq("id", slugOrId)
        }

        if (hasPublished) {
          query = query.eq("published", true)
        }

        const { data, error: fetchError } = await query.single()

        if (fetchError) {
          console.error("Error fetching post:", fetchError)
          throw fetchError
        }

        // Normalize the post data
        const normalizedPost = {
          id: data.id,
          title: data.title || "Untitled",
          content: data.content || "",
          excerpt: data.excerpt || "",
          slug: hasSlug ? data.slug : data.id,
          category: data.category || "General",
          image: data.image || null,
          author: data.author || "ECall Health Center",
          published: hasPublished ? data.published : true,
          created_at: data.created_at,
          updated_at: data.updated_at || data.created_at,
        }

        setPost(normalizedPost)
      } catch (error: any) {
        console.error("Error fetching post:", error)
        setError(error.message || "Failed to fetch post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slugOrId])

  return { post, loading, error }
}

// Hook for related posts
export function useRelatedPosts(category: string, excludeSlugOrId: string, limit = 3) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!category || !excludeSlugOrId) return

    const fetchRelatedPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check table structure
        const { data: tableInfo } = await supabase.from("posts").select("*").limit(1)

        const hasSlug = tableInfo && tableInfo.length > 0 && "slug" in tableInfo[0]
        const hasCategory = tableInfo && tableInfo.length > 0 && "category" in tableInfo[0]
        const hasPublished = tableInfo && tableInfo.length > 0 && "published" in tableInfo[0]

        let query = supabase
          .from("posts")
          .select("id, title, excerpt, slug, category, image, author, created_at")
          .order("created_at", { ascending: false })
          .limit(limit)

        if (hasCategory) {
          query = query.eq("category", category)
        }

        if (hasPublished) {
          query = query.eq("published", true)
        }

        if (hasSlug) {
          query = query.neq("slug", excludeSlugOrId)
        } else {
          query = query.neq("id", excludeSlugOrId)
        }

        const { data, error: fetchError } = await query

        if (fetchError) {
          console.error("Error fetching related posts:", fetchError)
          throw fetchError
        }

        const normalizedPosts = (data || []).map((post) => ({
          id: post.id,
          title: post.title || "Untitled",
          content: "",
          excerpt: post.excerpt || "",
          slug: hasSlug ? post.slug : post.id,
          category: post.category || "General",
          image: post.image || null,
          author: post.author || "ECall Health Center",
          published: true,
          created_at: post.created_at,
          updated_at: post.created_at,
        }))

        setRelatedPosts(normalizedPosts)
      } catch (error: any) {
        console.error("Error fetching related posts:", error)
        setError(error.message || "Failed to fetch related posts")
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedPosts()
  }, [category, excludeSlugOrId, limit])

  return { relatedPosts, loading, error }
}
