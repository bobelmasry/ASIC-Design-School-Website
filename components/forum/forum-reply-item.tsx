"use client"

import * as React from "react"
import { ThumbsUp, CheckCircle2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AttachmentsGrid } from "@/components/attachments-grid"
import { ForumContent } from "./forum-content"
import type { Attachment } from "@/lib/attachments"

export type PostReply = {
  id: string
  content: string
  user_id?: string | null
  user_full_name?: string | null
  user_avatar?: string | null
  created_at: string
  likes?: number | null
  isAccepted?: boolean
  liked_user_ids?: string[] | null
  attachments?: Attachment[] | null
  user_role?: string
  is_markdown?: boolean | null
  mentioned_user_ids?: string[] | null
}

interface ForumReplyItemProps {
  reply: PostReply
  user: any
  canModerateForum: boolean
  isAdminActionLoading: boolean
  isDeletingOwnReply: boolean
  isLiked: boolean
  isUpdatingLike: boolean
  onLike: () => void
  onToggleAccepted: () => void
  onDelete: () => void
  onDeleteOwn: () => void
}

export function ForumReplyItem({
  reply,
  user,
  canModerateForum,
  isAdminActionLoading,
  isDeletingOwnReply,
  isLiked,
  isUpdatingLike,
  onLike,
  onToggleAccepted,
  onDelete,
  onDeleteOwn,
}: ForumReplyItemProps) {
  const replyAuthorName = reply.user_full_name || "Community Member"
  const replyAvatar =
    reply.user_avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(replyAuthorName)}&background=0ea5e9&color=fff`

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className={reply.isAccepted ? "border-green-500/50" : ""}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={replyAvatar} alt={replyAuthorName} />
            <AvatarFallback>{replyAuthorName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{replyAuthorName}</span>
                  {reply.user_role === 'admin' && <span className="text-xs text-muted-foreground">(admin)</span>}
                </div>
                {reply.isAccepted && (
                  <Badge
                    variant="secondary"
                    className="gap-1 bg-green-500/10 text-green-600 border-green-500/20"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Accepted
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {reply.created_at ? formatDate(reply.created_at) : "Moments ago"}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canModerateForum && (
                    <>
                      <DropdownMenuItem
                        onClick={onToggleAccepted}
                        disabled={isAdminActionLoading}
                      >
                        {reply.isAccepted ? "Remove Accepted Mark" : "Mark as Accepted"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={onDelete}
                        disabled={isAdminActionLoading}
                        className="text-destructive"
                      >
                        Delete Reply
                      </DropdownMenuItem>
                    </>
                  )}
                  {user?.id === reply.user_id && !canModerateForum && (
                    <DropdownMenuItem
                      onClick={onDeleteOwn}
                      disabled={isDeletingOwnReply}
                      className="text-destructive"
                    >
                      Delete Reply
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <ForumContent 
              content={reply.content} 
              isMarkdown={reply.is_markdown} 
              className="text-sm leading-relaxed mb-3" 
            />
            <AttachmentsGrid attachments={reply.attachments} />
            <Button
              variant={isLiked ? "default" : "ghost"}
              size="sm"
              onClick={onLike}
              className="gap-2 h-8"
              disabled={isUpdatingLike}
            >
              <ThumbsUp className="h-3 w-3" />
              {reply.likes ?? 0}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
