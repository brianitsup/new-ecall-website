"use client"

import { useState, useEffect, useCallback } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Post {
  id: string
  title: string
  excerpt: string
  content?: string
  category: string
  image: string | null
  author: string
  created_at: string
  updated_at: string
}

interface UsePostsOptions {
  limit?: number
  offset?: number
  category?: string
  searchQuery?: string
  selectFields?: string
  orderBy?: string
  orderDirection?: "asc" | "desc"
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

// Cache for posts data
const postsCache = new Map<string, { data: Post[]; timestamp: number; totalCount: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function usePosts(options: UsePostsOptions = {}): UsePostsReturn {
  const {
    limit = 10,
    offset = 0,
    category,
    searchQuery,
    selectFields = "id, title, excerpt, category, image, author, created_at",
    orderBy = "created_at",
    orderDirection = "desc",
  } = options

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [currentOffset, setCurrentOffset] = useState(offset)

  const supabase = createClientComponentClient()

  // Generate cache key based on options
  const getCacheKey = useCallback((opts: UsePostsOptions) => {
    return JSON.stringify({
      category: opts.category,
      searchQuery: opts.searchQuery,
      selectFields: opts.selectFields,
      orderBy: opts.orderBy,
      orderDirection: opts.orderDirection,
    })
  }, [])

  const fetchPosts = useCallback(
    async (isLoadMore = false, customOffset = 0) => {
      try {
        if (!isLoadMore) {
          setLoading(true)
          setError(null)
        }

        const cacheKey = getCacheKey(options)
        const cached = postsCache.get(cacheKey)

        // Check if we have valid cached data for initial load
        if (!isLoadMore && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setPosts(cached.data)
          setTotalCount(cached.totalCount)
          setLoading(false)
          return
        }

        // Build query
        let query = supabase
          .from("posts")
          .select(selectFields, { count: "exact" })
          .order(orderBy, { ascending: orderDirection === "asc" })
          .range(customOffset, customOffset + limit - 1)

        // Add filters
        if (category) {
          query = query.eq("category", category)
        }

        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        }

        const { data, error: fetchError, count } = await query

        if (fetchError) throw fetchError

        const newPosts = data || []

        if (isLoadMore) {
          setPosts((prev) => [...prev, ...newPosts])
        } else {
          setPosts(newPosts)
          // Cache the initial load
          postsCache.set(cacheKey, {
            data: newPosts,
            timestamp: Date.now(),
            totalCount: count || 0,
          })
        }

        setTotalCount(count || 0)
        setCurrentOffset(customOffset + newPosts.length)
      } catch (error: any) {
        console.error("Error fetching posts:", error)
        setError(error.message || "Failed to fetch posts")
      } finally {
        setLoading(false)
      }
    },
    [supabase, selectFields, orderBy, orderDirection, limit, category, searchQuery, options, getCacheKey],
  )

  const loadMore = useCallback(async () => {
    if (loading || currentOffset >= totalCount) return
    await fetchPosts(true, currentOffset)
  }, [loading, currentOffset, totalCount, fetchPosts])

  const refresh = useCallback(async () => {
    // Clear cache for this query
    const cacheKey = getCacheKey(options)
    postsCache.delete(cacheKey)
    setCurrentOffset(0)
    await fetchPosts(false, 0)
  }, [fetchPosts, getCacheKey, options])

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

// Hook for single post with caching
export function usePost(id: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!id) return

    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check cache first
        const cacheKey = `post-${id}`
        const cached = postsCache.get(cacheKey)

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setPost(cached.data[0] || null)
          setLoading(false)
          return
        }

        const { data, error: fetchError } = await supabase.from("posts").select("*").eq("id", id).single()

        if (fetchError) throw fetchError

        setPost(data)

        // Cache the post
        postsCache.set(cacheKey, {
          data: [data],
          timestamp: Date.now(),
          totalCount: 1,
        })
      } catch (error: any) {
        console.error("Error fetching post:", error)
        setError(error.message || "Failed to fetch post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, supabase])

  return { post, loading, error }
}

// Hook for related posts
export function useRelatedPosts(category: string, excludeId: string, limit = 3) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!category || !excludeId) return

    const fetchRelatedPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await supabase
          .from("posts")
          .select("id, title, excerpt, category, image, created_at")
          .eq("category", category)
          .neq("id", excludeId)
          .order("created_at", { ascending: false })
          .limit(limit)

        if (fetchError) throw fetchError

        setRelatedPosts(data || [])
      } catch (error: any) {
        console.error("Error fetching related posts:", error)
        setError(error.message || "Failed to fetch related posts")
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedPosts()
  }, [category, excludeId, limit, supabase])

  return { relatedPosts, loading, error }
}
