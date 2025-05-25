"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, ArrowRight, AlertTriangle, Database, TrendingUp, Users, Calendar } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { usePosts } from "@/hooks/use-posts"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    thisMonthPosts: 0,
    popularCategory: "",
  })

  // Get recent posts for the dashboard
  const {
    posts: recentPosts,
    loading,
    error,
    totalCount,
  } = usePosts({
    limit: 5,
    selectFields: "id, title, created_at, category",
  })

  // Calculate additional stats
  useEffect(() => {
    if (recentPosts.length > 0) {
      const thisMonth = new Date()
      thisMonth.setDate(1)
      thisMonth.setHours(0, 0, 0, 0)

      const thisMonthPosts = recentPosts.filter((post) => new Date(post.created_at) >= thisMonth).length

      // Find most popular category
      const categoryCount: Record<string, number> = {}
      recentPosts.forEach((post) => {
        categoryCount[post.category] = (categoryCount[post.category] || 0) + 1
      })

      const popularCategory = Object.entries(categoryCount).sort(([, a], [, b]) => b - a)[0]?.[0] || ""

      setStats({
        totalPosts: totalCount,
        thisMonthPosts,
        popularCategory,
      })
    }
  }, [recentPosts, totalCount])

  const tableExists = !error?.includes("does not exist")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome to the eCall Health Center admin dashboard.</p>
      </div>

      {error && !tableExists && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Database Setup Required</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              The posts table does not exist in your Supabase database. You need to create it before you can manage blog
              posts.
            </p>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">SQL to Create Posts Table:</h3>
              <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
                {`-- Create posts table with performance optimizations
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  author TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_title_search ON posts USING gin(to_tsvector('english', title));`}
              </pre>
              <p className="mt-4 text-sm">
                Run this SQL in the Supabase SQL Editor to create the necessary database structure.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && tableExists && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
              ) : tableExists ? (
                stats.totalPosts
              ) : (
                "—"
              )}
            </div>
            <p className="text-xs text-gray-500">Blog and update posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
              ) : tableExists ? (
                stats.thisMonthPosts
              ) : (
                "—"
              )}
            </div>
            <p className="text-xs text-gray-500">Posts published this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Popular Category</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {loading ? (
                <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
              ) : tableExists && stats.popularCategory ? (
                stats.popularCategory
              ) : (
                "—"
              )}
            </div>
            <p className="text-xs text-gray-500">Most used category</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-sky-600 hover:bg-sky-700" disabled={!tableExists}>
              <Link href="/dashboard/posts/new">Create New Post</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Recently published blog posts and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-gray-200"></div>
                ))}
              </div>
            ) : !tableExists ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Database className="h-12 w-12 text-gray-300 mb-2" />
                <p className="text-gray-500">Database setup required</p>
              </div>
            ) : recentPosts.length > 0 ? (
              <ul className="space-y-4">
                {recentPosts.map((post: any) => (
                  <li key={post.id} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{post.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/posts/${post.id}`}>Edit</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No posts yet. Create your first post!</p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" disabled={!tableExists} className="w-full">
              <Link href={tableExists ? "/dashboard/posts" : "#"}>
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance Tips</CardTitle>
            <CardDescription>Optimize your blog for better performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Images are optimized</p>
                  <p className="text-gray-500">Using Next.js Image component for better performance</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Database queries optimized</p>
                  <p className="text-gray-500">Selective field fetching and caching implemented</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium">Pagination enabled</p>
                  <p className="text-gray-500">Load more posts as needed for better performance</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
