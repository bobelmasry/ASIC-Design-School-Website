"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

export default function NewPostPage() {
  const router = useRouter()
  const { isAuthenticated, openAuthModal } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [formData, setFormData] = React.useState({
    title: "",
    category: "",
    content: "",
    tags: [] as string[],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.category || !formData.content.trim()) {
      return
    }

    setIsSubmitting(true)

    const { data: userData } = await supabase.auth.getUser()

    const { data, error } = await supabase.from("posts").insert({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      user_id: userData?.user?.id,
    }).select()

    setIsSubmitting(false)

    if (error || !data || data.length === 0) {
      console.error(error)
      alert("Failed to create post")
      return
    }

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

      <Card>
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
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {forumCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
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
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button className="dark:hover:text-gray-400" type="button" variant="outline" asChild>
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
