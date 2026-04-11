"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-context"
import { UserTagging } from "@/components/user-tagging"
import { Switch } from "@/components/ui/switch"
import { forumCategories } from "@/lib/placeholder-data"
import {
  ArrowLeft,
  Send,
  Plus,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"
import {
  uploadAttachments,
  validateAttachmentSelection,
  MAX_ATTACHMENT_COUNT,
  MAX_ATTACHMENT_SIZE_MB,
  type Attachment,
} from "@/lib/attachments"

export default function NewPostPage() {
  const router = useRouter()
  const { isAuthenticated, openAuthModal, user } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [uploadError, setUploadError] = React.useState<string | null>(null)

  const [formData, setFormData] = React.useState({
    title: "",
    category: "",
    content: "",
    tags: [] as string[],
    isMarkdown: false,
  })
  const [tagInput, setTagInput] = React.useState("")

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal()
    }
  }, [isAuthenticated, openAuthModal])

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const files = Array.from(event.target.files)
    const validationError = validateAttachmentSelection(files)

    if (validationError) {
      setUploadError(validationError)
      return
    }

    setUploadError(null)
    setSelectedFiles(files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.category || !formData.content.trim()) {
      return
    }

    setIsSubmitting(true)
    setUploadError(null)

    const { data: userData } = await supabase.auth.getUser()
    const fullName = userData?.user?.user_metadata?.full_name || userData?.user?.email || "Community Member"

    let uploadedAttachments: Attachment[] = []

    if (selectedFiles.length) {
      try {
        uploadedAttachments = await uploadAttachments(selectedFiles, userData?.user?.id)
      } catch (error) {
        console.error(error)
        setUploadError("Failed to upload attachments. Please try again.")
        setIsSubmitting(false)
        return
      }
    }

        const { data, error } = await supabase
      .from("posts")
      .insert({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        user_id: userData?.user?.id,
        user_full_name: fullName,
        user_role: user?.role || 'member',
        attachments: uploadedAttachments,
        isHidden: false,
        is_markdown: formData.isMarkdown,
      })
      .select()

    setIsSubmitting(false)

    if (error || !data || data.length === 0) {
      console.error(error)
      alert("Failed to create post")
      return
    }

    setSelectedFiles([])
    router.push(`/forum/${data[0].id}`)
  }

  const isValid = formData.title.trim() && formData.category && formData.content.trim()

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
        <p className="text-muted-foreground mb-6">
          You need to be signed in to create a new discussion.
        </p>
        <Button onClick={openAuthModal}>Sign In</Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 max-w-3xl">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6 hover:text-white" asChild>
        <Link href="/forum">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Link>
      </Button>

      <Card className="border-gray-300 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Start a New Discussion</CardTitle>
          <CardDescription>
            Share your question, idea, or topic with the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                placeholder="What would you like to discuss?"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                maxLength={150}
                className="border-gray-300 dark:border-gray-800"
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.title.length}/150
              </p>
            </div>

            {/* Category */}
            <div className="space-y-8">
              <label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="border-gray-300 dark:border-gray-800">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {forumCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-2">
                        {category.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="content" className="text-sm font-medium">
                  Content <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="markdown-mode"
                    checked={formData.isMarkdown}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isMarkdown: checked }))}
                  />
                  <label htmlFor="markdown-mode" className="text-xs text-muted-foreground cursor-pointer">
                    Markdown
                  </label>
                </div>
              </div>
              <UserTagging
                id="content"
                placeholder={formData.isMarkdown ? "Markdown supported... Tag users with @" : "Describe your question or topic in detail. Tag users with @"}
                value={formData.content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                rows={10}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300 dark:border-gray-800"
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Attachments</label>
              <input
                type="file"
                multiple
                onChange={handleFileSelection}
                className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                Up to {MAX_ATTACHMENT_COUNT} files, {MAX_ATTACHMENT_SIZE_MB}MB each (images, PDFs, text, ZIP).
              </p>
              {selectedFiles.length > 0 && (
                <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                  {selectedFiles.map((file) => (
                    <li key={file.name + file.size}>
                      {file.name} ({(file.size / (1024 * 1024)).toFixed(1)}MB)
                    </li>
                  ))}
                </ul>
              )}
              {uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button className="dark:hover:text-gray-400 border-gray-300 dark:border-gray-800" type="button" variant="outline" asChild>
                <Link href="/forum">Cancel</Link>
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">
                      <Plus className="h-4 w-4" />
                    </span>
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Post Discussion
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
