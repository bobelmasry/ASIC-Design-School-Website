"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-context"
import { forumCategories } from "@/lib/placeholder-data"
import {
  ArrowLeft,
  Send,
  Plus,
  X,
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

type DatabasePost = {
  id: string | number
  title: string | null
  content?: string | null
  category?: string | null
  created_at?: string | null
  edited_at?: string | null
  replies?: any[] | null
  replies_count?: number | null
  likes?: number | null
  user_id?: string | null
  user_full_name?: string | null
  json_likes?: string[] | null
  attachments?: Attachment[] | null
}

export default function EditPostPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, openAuthModal, user } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [post, setPost] = React.useState<DatabasePost | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const [formData, setFormData] = React.useState({
    title: "",
    category: "",
    content: "",
  })

  const [existingAttachments, setExistingAttachments] = React.useState<Attachment[]>([])
  const [attachmentsToRemove, setAttachmentsToRemove] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    const loadPost = async () => {
      if (!params.id) return

      setIsLoading(true)
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error || !data) {
        setError("Post not found or you don't have permission to edit it.")
        setIsLoading(false)
        return
      }

      // Check if user is the author
      if (data.user_id !== user?.id) {
        setError("You can only edit your own posts.")
        setIsLoading(false)
        return
      }

      setPost(data)
      setFormData({
        title: data.title || "",
        category: data.category || "",
        content: data.content || "",
      })
      setExistingAttachments(data.attachments || [])
      setError(null)
      setIsLoading(false)
    }

    if (isAuthenticated && user) {
      loadPost()
    }
  }, [params.id, isAuthenticated, user])

  const handleRemoveExistingAttachment = (attachmentId: string) => {
    setAttachmentsToRemove(prev => new Set([...prev, attachmentId]))
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

    if (!post || !formData.title.trim() || !formData.category || !formData.content.trim()) {
      return
    }

    setIsSubmitting(true)
    setUploadError(null)

    let uploadedAttachments: Attachment[] = []
    let finalAttachments = existingAttachments.filter(att => !attachmentsToRemove.has(att.id))

    if (selectedFiles.length) {
      try {
        uploadedAttachments = await uploadAttachments(selectedFiles, user?.id)
      } catch (error) {
        console.error(error)
        setUploadError("Failed to upload attachments. Please try again.")
        setIsSubmitting(false)
        return
      }
    }

    finalAttachments = [...finalAttachments, ...uploadedAttachments]

    const { error } = await supabase
      .from("posts")
      .update({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        attachments: finalAttachments,
        edited_at: new Date().toISOString(),
      })
      .eq("id", post.id)

    setIsSubmitting(false)

    if (error) {
      console.error(error)
      alert("Failed to update post")
      return
    }

    setSelectedFiles([])
    router.push(`/forum/${post.id}`)
  }

  const isValid = formData.title.trim() && formData.category && formData.content.trim()

  if (!isAuthenticated) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
        <p className="text-muted-foreground mb-6">
          You need to be signed in to edit posts.
        </p>
        <Button onClick={openAuthModal}>Sign In</Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-16 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Unable to Edit</h1>
        <p className="text-muted-foreground mb-6">
          {error || "Post not found."}
        </p>
        <Button asChild>
          <Link href="/forum">Back to Forum</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 max-w-3xl">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6 hover:text-white" asChild>
        <Link href={`/forum/${post.id}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Post
        </Link>
      </Button>

      <Card className="border-gray-300 dark:border-gray-800">
        <CardHeader>
          <CardTitle>Edit Discussion</CardTitle>
          <CardDescription>
            Make changes to your discussion
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
              <label htmlFor="content" className="text-sm font-medium">
                Content <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="content"
                placeholder="Describe your question or topic in detail."
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                rows={10}
                className="border-gray-300 dark:border-gray-800"
              />
            </div>

            {/* Existing Attachments */}
            {existingAttachments.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Attachments</label>
                <ul className="space-y-2">
                  {existingAttachments
                    .filter(att => !attachmentsToRemove.has(att.id))
                    .map((attachment) => (
                      <li key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{attachment.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveExistingAttachment(attachment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* New Attachments */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Add New Attachments</label>
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
                <Link href={`/forum/${post.id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">
                      <Plus className="h-4 w-4" />
                    </span>
                    Updating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Update Discussion
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