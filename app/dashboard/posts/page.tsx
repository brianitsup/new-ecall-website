"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PlusCircle, Edit, Trash2, Search, AlertTriangle, Database } from "lucide-react"

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
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deletePostId, setDeletePostId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tableExists, setTableExists] = useState(true)

  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)

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

      // If the table exists, proceed with fetching posts
      if (!tableCheckError) {
        const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

        if (error) throw error
        setPosts(data || [])
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error)
      setError(error.message || "An error occurred while fetching posts")
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async () => {
    if (!deletePostId) return

    try {
      setDeleting(true)

      // Find the post to get its title for the toast
      const postToDelete = posts.find((post) => post.id === deletePostId)
      const postTitle = postToDelete?.title || "Post"

      const { error } = await supabase.from("posts").delete().eq("id", deletePostId)

      if (error) throw error

      // Remove the deleted post from the state
      setPosts(posts.filter((post) => post.id !== deletePostId))

      // Show success toast
      toast({
        variant: "success",
        title: "Post Deleted Successfully!",
        description: `"${postTitle}" has been permanently deleted.`,
      })

      // Reset delete state
      setDeletePostId(null)
    } catch (error: any) {
      console.error("Error deleting post:", error)
      setError(error.message || "An error occurred while deleting the post")

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

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse rounded bg-gray-200"></div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                      </TableCell>
                      <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/dashboard/posts/${post.id}`}>
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
                                onClick={() => setDeletePostId(post.id)}
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
                                <AlertDialogCancel onClick={() => setDeletePostId(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={handleDeletePost}
                                  disabled={deleting}
                                >
                                  {deleting ? (
                                    <>
                                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
                  {searchQuery ? `No posts matching "${searchQuery}"` : "You haven't created any posts yet."}
                </p>
                {!searchQuery && (
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
