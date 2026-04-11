"use client"

import * as React from "react"
import Link from "next/link"
import { MoreHorizontal, Share2, Edit, Clock, ThumbsUp, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { AttachmentsGrid } from "@/components/attachments-grid"
import { ForumContent } from "./forum-content"
import type { Attachment } from "@/lib/attachments"
import type { PostReply } from "./forum-reply-item"

export type { PostReply }

export type DatabasePost = {
  id: string | number
  title: string | null
  content?: string | null
  category?: string | null
  created_at?: string | null
  edited_at?: string | null
  isHidden?: boolean | null
  isPinned?: boolean | null
  replies_count?: number | null
  likes?: number | null
  user_id?: string | null
  user_full_name?: string | null
  user_role?: string | null
  json_likes?: string[] | null
  attachments?: Attachment[] | null
  is_markdown?: boolean | null
}

interface ForumPostCardProps {
  post: DatabasePost
  user: any
  canModerateForum: boolean
  isUpdatingLike: boolean
  likedPost: boolean
  showCopiedPopover: boolean
  isAdminActionLoading: boolean
  isDeletingOwn: boolean
  onLike: () => void
  onShare: () => void
  onDeletePost: () => void
  onDeleteOwnPost: () => void
  onSetShowCopiedPopover: (show: boolean) => void
}

export function ForumPostCard({
  post,
  user,
  canModerateForum,
  isUpdatingLike,
  likedPost,
  showCopiedPopover,
  isAdminActionLoading,
  isDeletingOwn,
  onLike,
  onShare,
  onDeletePost,
  onDeleteOwnPost,
  onSetShowCopiedPopover,
}: ForumPostCardProps) {
  const postAuthorName = post.user_full_name || "Community Member"
  const postAuthorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(postAuthorName)}&background=0ea5e9&color=fff`

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
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {post.category && <Badge variant="outline">{post.category}</Badge>}
            </div>
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={postAuthorAvatar} alt={postAuthorName} />
                  <AvatarFallback>{postAuthorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{postAuthorName}</span>
                {post.user_role === 'admin' && <span className="text-xs text-muted-foreground">(admin)</span>}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.created_at ? formatDate(post.created_at) : "Just now"}
                {post.edited_at && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (edited {formatDate(post.edited_at)})
                  </span>
                )}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="hover:text-white" variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2 hover:text-white" />
                Share
              </DropdownMenuItem>
              {user?.id === post.user_id && (
                <DropdownMenuItem asChild>
                  <Link href={`/forum/${post.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2 hover:text-white" />
                    Edit
                  </Link>
                </DropdownMenuItem>
              )}
              {canModerateForum && (
                <DropdownMenuItem
                  onClick={onDeletePost}
                  disabled={isAdminActionLoading}
                  className="text-destructive"
                >
                  Delete Discussion
                </DropdownMenuItem>
              )}
              {user?.id === post.user_id && !canModerateForum && (
                <DropdownMenuItem
                  onClick={onDeleteOwnPost}
                  disabled={isDeletingOwn}
                  className="text-destructive"
                >
                  Delete Discussion
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <ForumContent 
          content={post.content || ""} 
          isMarkdown={post.is_markdown} 
          className="mb-6"
        />
        <AttachmentsGrid attachments={post.attachments} />

        <Separator className="my-4" />

        <div className="flex items-center gap-4">
          <Button
            variant={likedPost ? "default" : "outline"}
            size="sm"
            onClick={onLike}
            className="gap-2 dark:hover:text-gray-400"
            disabled={isUpdatingLike}
          >
            <ThumbsUp className="h-4 w-4" />
            {post.likes ?? 0}
          </Button>
          <Button variant="outline" size="sm" className="gap-2 dark:hover:text-gray-400">
            <MessageSquare className="h-4 w-4" />
            {post.replies_count ?? 0} Replies
          </Button>
          <Popover open={showCopiedPopover} onOpenChange={onSetShowCopiedPopover}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onShare} className="gap-2 ml-auto hover:text-white">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-auto p-2">
              <p className="text-sm">Link copied to clipboard!</p>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}
