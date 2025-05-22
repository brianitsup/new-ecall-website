"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, ArrowRight, AlertTriangle, Database } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    recentPosts: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tableExists, setTableExists] = useState(true)

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Check if the posts table exists
        const { error: tableCheckError } = await supabase.from("posts").select("id").limit(1).single()

        // If we get a specific error about the relation not existing
        if (
          tableCheckError &&
          tableCheckError.message.includes("relation") &&
          tableCheckError.message.includes("does not exist")
        ) {
          setTableExists(false)
          setError("The posts table does not exist in the database yet.")
          setLoading(false)
          return
        }

        // If the table exists, proceed with fetching stats
        if (!tableCheckError) {
          // Get total posts count
          const { count: totalPosts, error: countError } = await supabase
            .from("posts")
            .select("*", { count: "exact", head: true })

          if (countError) throw countError

          // Get recent posts
          const { data: recentPosts, error: postsError } = await supabase
            .from("posts")
            .select("id, title, created_at")
            .order("created_at", { ascending: false })
            .limit(5)

          if (postsError) throw postsError

          setStats({
            totalPosts: totalPosts || 0,
            recentPosts: recentPosts || [],
          })
        }
      } catch (error: any) {
        console.error("Error fetching dashboard stats:", error)
        setError(error.message || "An error occurred while fetching dashboard statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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
                {`-- Create posts table
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

-- Create storage for images (if needed)
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'images');

-- Set up storage policy to allow public to view images
CREATE POLICY "Allow public to view images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'images');`}
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div> : stats.totalPosts}
            </div>
            <p className="text-xs text-gray-500">Blog and update posts</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="ghost" className="p-0 h-auto text-sky-600 hover:text-sky-700">
              <Link href="/dashboard/posts" className="flex items-center gap-1">
                View all posts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
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
            ) : stats.recentPosts.length > 0 ? (
              <ul className="space-y-4">
                {stats.recentPosts.map((post: any) => (
                  <li key={post.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
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
            <Button asChild variant="outline" disabled={!tableExists}>
              <Link href={tableExists ? "/dashboard/posts/new" : "#"}>Create New Post</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
