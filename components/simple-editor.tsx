"use client"

import { useState } from "react"
import { Bold, Italic, List, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface SimpleEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function SimpleEditor({ content, onChange, placeholder = "Start writing..." }: SimpleEditorProps) {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null)

  const insertText = (before: string, after = "") => {
    if (!textareaRef) return

    const start = textareaRef.selectionStart
    const end = textareaRef.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textareaRef.focus()
      textareaRef.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const insertBold = () => insertText("**", "**")
  const insertItalic = () => insertText("*", "*")
  const insertList = () => insertText("\n- ")
  const insertLink = () => insertText("[", "](https://)")

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Simple Toolbar */}
      <div className="border-b p-2 flex gap-1 bg-gray-50">
        <Button type="button" variant="ghost" size="sm" onClick={insertBold}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={insertItalic}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={insertList}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={insertLink}>
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        ref={setTextareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] border-0 resize-none focus-visible:ring-0"
        rows={10}
      />

      <div className="p-2 text-xs text-gray-500 bg-gray-50 border-t">
        Use **bold**, *italic*, and [links](url) for formatting. Start lines with "- " for lists.
      </div>
    </div>
  )
}
