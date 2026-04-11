"use client"

import * as React from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { UserTagging } from "@/components/user-tagging"
import {
  MAX_ATTACHMENT_COUNT,
  MAX_ATTACHMENT_SIZE_MB,
} from "@/lib/attachments"

interface ForumReplyFormProps {
  isAuthenticated: boolean
  user: any
  replyContent: string
  isMarkdownReply: boolean
  isSubmittingReply: boolean
  replyError: string | null
  replyUploadError: string | null
  replyFiles: File[]
  onOpenAuthModal: () => void
  onReplyContentChange: (content: string) => void
  onIsMarkdownReplyChange: (isMarkdown: boolean) => void
  onMentionIdsChange: (ids: string[]) => void
  onFileSelection: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
}

export function ForumReplyForm({
  isAuthenticated,
  user,
  replyContent,
  isMarkdownReply,
  isSubmittingReply,
  replyError,
  replyUploadError,
  replyFiles,
  onOpenAuthModal,
  onReplyContentChange,
  onIsMarkdownReplyChange,
  onMentionIdsChange,
  onFileSelection,
  onSubmit,
}: ForumReplyFormProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Leave a Reply</h3>
        {isAuthenticated ? (
          <form onSubmit={onSubmit}>
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Your Message</label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="reply-markdown-mode"
                        checked={isMarkdownReply}
                        onCheckedChange={onIsMarkdownReplyChange}
                      />
                      <label htmlFor="reply-markdown-mode" className="text-xs text-muted-foreground cursor-pointer">
                        Markdown
                      </label>
                    </div>
                  </div>
                  <UserTagging
                    placeholder={isMarkdownReply ? "Markdown supported... Tag users with @" : "Share your thoughts or answer... Tag users with @"}
                    value={replyContent}
                    onChange={onReplyContentChange}
                    onMentionIdsChange={onMentionIdsChange}
                    rows={4}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Attachments</label>
                  <input
                    type="file"
                    multiple
                    onChange={onFileSelection}
                    className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Up to {MAX_ATTACHMENT_COUNT} files, {MAX_ATTACHMENT_SIZE_MB}MB each (images, PDFs, text, ZIP).
                  </p>
                  {replyFiles.length > 0 && (
                    <ul className="text-xs text-muted-foreground list-disc pl-4 mt-2 space-y-1">
                      {replyFiles.map((file) => (
                        <li key={file.name + file.size}>
                          {file.name} ({(file.size / (1024 * 1024)).toFixed(1)}MB)
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {replyError && <p className="text-sm text-destructive">{replyError}</p>}
                {replyUploadError && <p className="text-sm text-destructive">{replyUploadError}</p>}
                <div className="flex justify-end">
                  <Button type="submit" disabled={!replyContent.trim() || isSubmittingReply}>
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmittingReply ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              You need to be signed in to reply to this discussion.
            </p>
            <Button onClick={onOpenAuthModal}>Sign In to Reply</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
