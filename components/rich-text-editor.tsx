"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import { useEffect, useState } from "react"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  LinkIcon,
  Undo,
  Redo,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("")
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const [fallbackMode, setFallbackMode] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  const editor = useEditor({
    extensions: [
      // Use StarterKit with proper configuration - don't try to extend it
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      // Add only the extensions that aren't in StarterKit
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-sky-600 underline hover:text-sky-700",
        },
      }),
      Underline,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      try {
        const html = editor.getHTML()
        onChange(html)
      } catch (error) {
        console.error("Error updating editor content:", error)
        setDebugInfo(`Update error: ${error}`)
      }
    },
    onCreate: ({ editor }) => {
      setEditorReady(true)
      setDebugInfo("Editor created successfully")
    },
    onError: ({ error }) => {
      console.error("Tiptap editor error:", error)
      setDebugInfo(`Editor error: ${error}`)
      setFallbackMode(true)
    },
    editorProps: {
      attributes: {
        class: "min-h-[200px] p-4 border-0 focus:outline-none prose prose-sm max-w-none",
        style: "outline: none;",
      },
    },
  })

  // Fallback to textarea if editor fails
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!editor && !fallbackMode) {
        console.warn("Tiptap editor failed to initialize, falling back to textarea")
        setDebugInfo("Editor initialization timeout - using fallback")
        setFallbackMode(true)
      }
    }, 3000) // 3 second timeout

    return () => clearTimeout(timer)
  }, [editor, fallbackMode])

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "")
    }
  }, [editor, content])

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setLinkDialogOpen(false)
    }
  }

  const removeLink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run()
    }
  }

  // Fallback textarea mode
  if (fallbackMode || !editor) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
          Rich text editor unavailable. Using basic text editor.
          {debugInfo && <div className="text-xs mt-1">Debug: {debugInfo}</div>}
        </div>
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[200px] font-mono text-sm"
          rows={10}
        />
        <p className="text-xs text-gray-500">
          You can use HTML tags for formatting. For example, &lt;h2&gt;Heading&lt;/h2&gt; for headings,
          &lt;p&gt;Paragraph&lt;/p&gt; for paragraphs, &lt;ul&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ul&gt; for lists.
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && debugInfo && (
        <div className="bg-blue-50 text-blue-700 p-2 text-xs border-b">
          Debug: {debugInfo} | Ready: {editorReady ? "Yes" : "No"}
        </div>
      )}

      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1 bg-gray-50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
          disabled={!editorReady}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
          disabled={!editorReady}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-gray-200" : ""}
          disabled={!editorReady}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "bg-gray-200" : ""}
          disabled={!editorReady}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}
          disabled={!editorReady}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}
          disabled={!editorReady}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}
          disabled={!editorReady}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
          disabled={!editorReady}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
          disabled={!editorReady}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={editor.isActive("link") ? "bg-gray-200" : ""}
              disabled={!editorReady}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Link</DialogTitle>
              <DialogDescription>Enter the URL you want to link to.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="col-span-3"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setLinkDialogOpen(false)}>
                Cancel
              </Button>
              {editor.isActive("link") && (
                <Button type="button" variant="destructive" onClick={removeLink}>
                  Remove Link
                </Button>
              )}
              <Button type="button" onClick={addLink}>
                Add Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo() || !editorReady}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || !editorReady}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="min-h-[200px] bg-white">
        {!editorReady && (
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600 mx-auto mb-2"></div>
              <div className="text-sm">Loading editor...</div>
            </div>
          </div>
        )}
        <EditorContent editor={editor} className={`${!editorReady ? "opacity-0" : "opacity-100"} transition-opacity`} />
      </div>
    </div>
  )
}
