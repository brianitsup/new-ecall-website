"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PlusCircle, Edit, Trash2, Search, AlertTriangle, Database, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { usePosts } from "@/hooks/use-posts"

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [deletePostSlug, setDeletePostSlug] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { toast } = useToast()

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { posts, loading, error, totalCount, hasMore, loadMore, refresh } = usePosts({
    limit: 20,
    category: selectedCategory || undefined,
    searchQuery: debouncedSearch || undefined,
    published: undefined, // Show all posts in admin
  })

  const categories = ["Clinic News", "Health Tips", "Programs", "Community Outreach", "Public Health", "Events"]

  const handleDeletePost = async () => {
    if (!deletePostSlug) return

    try {
      setDeleting(true)

      // Find the post to get its title for the toast
      const postToDelete = posts.find((post) => post.slug === deletePostSlug)
      const postTitle = postToDelete?.title || "Post"

      const { supabase } = await import("@/lib/supabase")
      const { error } = await supabase.from("posts").delete().eq("slug", deletePostSlug)

      if (error) throw error

      // Show success toast
      toast({
        title: "Post Deleted Successfully!",
        description: `"${postTitle}" has been permanently deleted.`,
      })

      // Refresh the posts list
      await refresh()

      // Reset delete state
      setDeletePostSlug(null)
    } catch (error: any) {
      console.error("Error deleting post:", error)

      // Show error toast
      toast({
        variant: "destructive",
        title: "Failed to Delete Post",
        description: error.message || "Please try again.",
      })
    } finally {
      setDeleting(false)
    }
  }

  // Check if table exists by looking at the error
  const tableExists = !error?.includes("does not exist")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-gray-500">Manage your blog posts and updates</p>
        </div>
        <Button asChild className="bg-sky-600 hover:bg-sky-700" disabled={!tableExists}>
          <Link href="/dashboard/posts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
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
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  author TEXT NOT NULL DEFAULT 'Admin',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);`}
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

      {!tableExists ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-12 text-center">
          <Database className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium">Database Setup Required</h3>
          <p className="text-gray-500 max-w-md mt-2">
            The posts table does not exist in your Supabase database. Please run the SQL script above to create the
            necessary database structure.
          </p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}
            >
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
          </div>

          {/* Results count */}
          {!loading && (
            <div className="flex items-center justify-between">
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
              {hasMore && (
                <Button onClick={loadMore} variant="outline" size="sm" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              )}
            </div>
          )}

          {loading && posts.length === 0 ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded bg-gray-200"></div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{post.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={post.published ? "default" : "secondary"}>
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {post.updated_at ? new Date(post.updated_at).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/dashboard/posts/${post.slug || post.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => setDeletePostSlug(post.slug || post.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the post "{post.title}". This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeletePostSlug(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={handleDeletePost}
                                  disabled={deleting}
                                >
                                  {deleting ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
              <div className="text-center">
                <h3 className="text-lg font-medium">No posts found</h3>
                <p className="text-gray-500">
                  {searchQuery || selectedCategory
                    ? `No posts matching your criteria`
                    : "You haven't created any posts yet."}
                </p>
                {!searchQuery && !selectedCategory && (
                  <Button asChild className="mt-4 bg-sky-600 hover:bg-sky-700">
                    <Link href="/dashboard/posts/new">Create your first post</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
