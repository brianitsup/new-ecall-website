"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Upload, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useToast } from "@/hooks/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params
  const isNewPost = id === "new"

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    image: null as File | null,
    imageUrl: "",
    currentImageUrl: "",
  })
  const [loading, setLoading] = useState(!isNewPost)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    // Skip fetching if we're creating a new post
    if (isNewPost) {
      setLoading(false)
      return
    }

    const fetchPost = async () => {
      try {
        const { data, error } = await supabase.from("posts").select("*").eq("id", id).single()

        if (error) throw error

        if (data) {
          setFormData({
            title: data.title || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            category: data.category || "",
            image: null,
            imageUrl: "",
            currentImageUrl: data.image || "",
          })
        }
      } catch (error: any) {
        console.error("Error fetching post:", error)
        setError("Failed to load post")
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, isNewPost])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imageUrl: URL.createObjectURL(file),
      }))
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      imageUrl: "",
      currentImageUrl: "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Validate form
      if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
        throw new Error("Please fill in all required fields")
      }

      let imageUrl = formData.currentImageUrl

      // Upload new image if exists
      if (formData.image) {
        const fileExt = formData.image.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `blog/${fileName}`

        const { error: uploadError } = await supabase.storage.from("images").upload(filePath, formData.image)

        if (uploadError) throw uploadError

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      if (isNewPost) {
        // Create new post
        const { error: insertError } = await supabase.from("posts").insert([
          {
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            category: formData.category,
            image: imageUrl,
            author: "Admin", // This could be dynamic based on the logged-in user
          },
        ])

        if (insertError) throw insertError

        // Show success toast for new post
        toast({
          variant: "success",
          title: "Post Created Successfully!",
          description: `"${formData.title}" has been published and is now live.`,
        })
      } else {
        // Update existing post
        const { error: updateError } = await supabase
          .from("posts")
          .update({
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            category: formData.category,
            image: imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)

        if (updateError) throw updateError

        // Show success toast for updated post
        toast({
          variant: "success",
          title: "Post Updated Successfully!",
          description: `"${formData.title}" has been updated.`,
        })
      }

      // Show success toast and redirect immediately
      if (isNewPost) {
        toast({
          variant: "success",
          title: "Post Created Successfully!",
          description: `"${formData.title}" has been published and is now live.`,
        })
      } else {
        toast({
          variant: "success",
          title: "Post Updated Successfully!",
          description: `"${formData.title}" has been updated.`,
        })
      }

      // Reset saving state
      setSaving(false)

      // Redirect after a short delay to show the toast
      setTimeout(() => {
        router.push("/dashboard/posts")
      }, 500)
    } catch (error: any) {
      setError(error.message || `An error occurred while ${isNewPost ? "creating" : "updating"} the post`)
      console.error(`Error ${isNewPost ? "creating" : "updating"} post:`, error)

      // Show error toast
      toast({
        variant: "destructive",
        title: `Failed to ${isNewPost ? "Create" : "Update"} Post`,
        description: error.message || "Please try again.",
      })

      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/posts">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isNewPost ? "Create New Post" : "Edit Post"}</h1>
          <p className="text-gray-500">{isNewPost ? "Add a new blog post or update" : "Update your blog post"}</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the post"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clinic News">Clinic News</SelectItem>
                  <SelectItem value="Health Tips">Health Tips</SelectItem>
                  <SelectItem value="Programs">Programs</SelectItem>
                  <SelectItem value="Community Outreach">Community Outreach</SelectItem>
                  <SelectItem value="Public Health">Public Health</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              {formData.imageUrl || formData.currentImageUrl ? (
                <div className="relative rounded-md overflow-hidden">
                  <Image
                    src={formData.imageUrl || formData.currentImageUrl}
                    alt="Preview"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    Select Image
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Write your post content here..."
              />
              <p className="text-xs text-gray-500">
                Use the toolbar above to format your content. You can add headings, lists, links, and more.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/posts")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-sky-600 hover:bg-sky-700" disabled={saving}>
            {saving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {isNewPost ? "Creating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isNewPost ? "Create Post" : "Save Changes"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
