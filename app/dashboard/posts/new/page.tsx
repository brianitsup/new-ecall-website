"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"

export default function NewPostPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    image: null as File | null,
    imageUrl: "",
  })
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
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
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.title || !formData.excerpt || !formData.content || !formData.category) {
        throw new Error("Please fill in all required fields")
      }

      let imageUrl = ""

      // Upload image if exists
      if (formData.image) {
        const fileExt = formData.image.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `blog/${fileName}`

        const { error: uploadError, data } = await supabase.storage.from("images").upload(filePath, formData.image)

        if (uploadError) throw uploadError

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      // Insert post into database
      const { error: insertError, data: post } = await supabase
        .from("posts")
        .insert([
          {
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            category: formData.category,
            image: imageUrl,
            author: "Admin", // This could be dynamic based on the logged-in user
          },
        ])
        .select()

      if (insertError) throw insertError

      // Redirect to posts list
      router.push("/dashboard/posts")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred while creating the post")
      console.error("Error creating post:", error)
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
          <p className="text-gray-500">Add a new blog post or update</p>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 md:col-span-1">
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
              {formData.imageUrl ? (
                <div className="relative rounded-md overflow-hidden">
                  <Image
                    src={formData.imageUrl || "/placeholder.svg"}
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

          <div className="space-y-4 md:col-span-1">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content here..."
                className="min-h-[300px]"
                required
              />
              <p className="text-xs text-gray-500">
                Use HTML tags for formatting. For example, &lt;h2&gt;Heading&lt;/h2&gt; for headings,
                &lt;p&gt;Paragraph&lt;/p&gt; for paragraphs, &lt;ul&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ul&gt; for lists.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/posts")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-sky-600 hover:bg-sky-700" disabled={loading}>
            {loading ? (
              "Creating..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Post
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
