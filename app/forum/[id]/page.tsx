"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-context"
import { supabase } from "@/lib/supabase"
import {
  uploadAttachments,
  validateAttachmentSelection,
  MAX_ATTACHMENT_COUNT,
  MAX_ATTACHMENT_SIZE_MB,
  type Attachment,
} from "@/lib/attachments"
import { AttachmentsGrid } from "@/components/attachments-grid"
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Clock,
  Share2,
  Flag,
  MoreHorizontal,
  Send,
  CheckCircle2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PostReply = {
  id: string
  content: string
  user_id?: string | null
  user_full_name?: string | null
  user_avatar?: string | null
  created_at: string
  likes?: number | null
  isAccepted?: boolean
  isHidden?: boolean
  moderationReason?: string | null
  moderatedBy?: string | null
  moderatedAt?: string | null
  moderationHistory?: Array<{
    action: string
    reason: string | null
    moderatedBy: string
    moderatedAt: string
  }> | null
  liked_user_ids?: string[] | null
  attachments?: Attachment[] | null
}

type DatabasePost = {
  id: string | number
  title: string | null
  content?: string | null
  category?: string | null
  created_at?: string | null
  replies?: PostReply[] | null
  replies_count?: number | null
  likes?: number | null
  user_id?: string | null
  user_full_name?: string | null
  json_likes?: string[] | null
  attachments?: Attachment[] | null
}

const normalizePost = (data: DatabasePost | null): DatabasePost | null => {
  if (!data) return null
  const likedUsers = Array.isArray(data.json_likes) ? data.json_likes : []
  return {
    ...data,
    json_likes: likedUsers,
    likes: data.likes ?? likedUsers.length,
  }
}

const normalizeReplies = (
  rawReplies: PostReply[] | null | undefined,
  includeHidden = false,
): PostReply[] => {
  if (!Array.isArray(rawReplies)) return []
  const normalized = rawReplies.map((reply) => {
    const likedUsers = Array.isArray(reply.liked_user_ids) ? reply.liked_user_ids : []
    const moderationHistory = Array.isArray(reply.moderationHistory)
      ? reply.moderationHistory
          .filter(
            (
              entry,
            ): entry is {
              action: string
              reason: string | null
              moderatedBy: string
              moderatedAt: string
            } =>
              Boolean(entry) &&
              typeof entry === 'object' &&
              typeof entry.action === 'string' &&
              typeof entry.moderatedBy === 'string' &&
              typeof entry.moderatedAt === 'string',
          )
          .map((entry) => ({
            action: entry.action,
            reason: typeof entry.reason === 'string' ? entry.reason : null,
            moderatedBy: entry.moderatedBy,
            moderatedAt: entry.moderatedAt,
          }))
      : []

    return {
      ...reply,
      liked_user_ids: likedUsers,
      likes: reply.likes ?? likedUsers.length,
      attachments: reply.attachments || [],
      moderationHistory,
    }
  })

  if (includeHidden) return normalized
  return normalized.filter((reply) => !reply.isHidden)
}

export default function ForumPostPage() {
  const params = useParams()
  const router = useRouter()
  const { openAuthModal, isAuthenticated, user } = useAuth()
  const [replyContent, setReplyContent] = React.useState("")
  const [likedPost, setLikedPost] = React.useState(false)
  const [likedReplies, setLikedReplies] = React.useState<Set<string>>(new Set())

  const [post, setPost] = React.useState<DatabasePost | null>(null)
  const [isLoadingPost, setIsLoadingPost] = React.useState(true)
  const [fetchError, setFetchError] = React.useState<string | null>(null)
  const [replies, setReplies] = React.useState<PostReply[]>([])
  const [isSubmittingReply, setIsSubmittingReply] = React.useState(false)
  const [replyError, setReplyError] = React.useState<string | null>(null)
  const [isUpdatingLike, setIsUpdatingLike] = React.useState(false)
  const [likeError, setLikeError] = React.useState<string | null>(null)
  const [replyLikeError, setReplyLikeError] = React.useState<string | null>(null)
  const [moderationError, setModerationError] = React.useState<string | null>(null)
  const [updatingReplyLikeId, setUpdatingReplyLikeId] = React.useState<string | null>(null)
  const [isModeratingReplyId, setIsModeratingReplyId] = React.useState<string | null>(null)
  const [canModerate, setCanModerate] = React.useState(false)
  const [replyFiles, setReplyFiles] = React.useState<File[]>([])
  const [replyUploadError, setReplyUploadError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isMounted = true

    const loadPost = async () => {
      setIsLoadingPost(true)
      setReplies([])
      const response = await fetch(`/api/forum/threads/${params.id}`)
      const result = await response.json()

      if (!isMounted) return

      if (!response.ok || !result?.thread) {
        setFetchError(result?.error ?? "Failed to load discussion.")
        setIsLoadingPost(false)
        return
      }

      const normalizedPost = normalizePost(result.thread as DatabasePost)
      setPost(normalizedPost)
      setReplies(normalizeReplies(result.thread.replies as PostReply[] | null, canModerate))
      setFetchError(null)
      setIsLoadingPost(false)
    }

    loadPost()

    return () => {
      isMounted = false
    }
  }, [params.id, canModerate])

  React.useEffect(() => {
    let isMounted = true

    const checkModeratorAccess = async () => {
      if (!isAuthenticated) {
        setCanModerate(false)
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        if (isMounted) setCanModerate(false)
        return
      }

      const response = await fetch('/api/admin/rbac/roles', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (isMounted) {
        setCanModerate(response.ok)
      }
    }

    checkModeratorAccess()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, user?.id])

  React.useEffect(() => {
    if (!post || !user?.id) {
      setLikedPost(false)
      return
    }

    const likedUsers = Array.isArray(post.json_likes) ? post.json_likes : []
    setLikedPost(likedUsers.includes(user.id))
  }, [post, user?.id])

  React.useEffect(() => {
    if (!user?.id) {
      setLikedReplies(new Set())
      return
    }

    const likedIds = replies
      .filter((reply) => Array.isArray(reply.liked_user_ids) && reply.liked_user_ids.includes(user.id))
      .map((reply) => reply.id)

    setLikedReplies(new Set(likedIds))
  }, [replies, user?.id])

  const postAuthorName = post?.user_full_name || "Community Member"
  const postAuthorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(postAuthorName)}&background=0ea5e9&color=fff`

  if (isLoadingPost) {
    return (
      <div className="container px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`post-skeleton-${index}`}
              className="h-28 rounded-lg border border-gray-300 dark:border-gray-800 animate-pulse bg-muted/30"
            />
          ))}
        </div>
      </div>
    )
  }

  if (fetchError || !post) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{fetchError ? "Unable to load discussion" : "Discussion Not Found"}</h1>
        <p className="text-muted-foreground mb-6">
          {fetchError || "The discussion you're looking for doesn't exist or has been removed."}
        </p>
        <Button asChild>
          <Link href="/forum">Back to Forum</Link>
        </Button>
      </div>
    )
  }

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

  const handleLikePost = async () => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    if (!post || isUpdatingLike || !user?.id) return

    setLikeError(null)
    setIsUpdatingLike(true)

    const previousLikedUsers = Array.isArray(post.json_likes) ? [...post.json_likes] : []
    const hasLiked = previousLikedUsers.includes(user.id)
    const nextLiked = !hasLiked
    const updatedLikedUsers = nextLiked
      ? [...previousLikedUsers, user.id]
      : previousLikedUsers.filter((id) => id !== user.id)
    const updatedLikes = updatedLikedUsers.length

    setLikedPost(nextLiked)
    setPost((prev) =>
      prev
        ? {
            ...prev,
            likes: updatedLikes,
            json_likes: updatedLikedUsers,
          }
        : prev
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      setLikeError("Your session expired. Please sign in again.")
      setLikedPost(hasLiked)
      setPost((prev) =>
        prev
          ? {
              ...prev,
              likes: previousLikedUsers.length,
              json_likes: previousLikedUsers,
            }
          : prev
      )
      setIsUpdatingLike(false)
      openAuthModal()
      return
    }

    const response = await fetch(`/api/forum/threads/${post.id}/likes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      setLikeError(result?.error ?? "Failed to update likes. Please try again.")
      setLikedPost(hasLiked)
      setPost((prev) =>
        prev
          ? {
              ...prev,
              likes: previousLikedUsers.length,
              json_likes: previousLikedUsers,
            }
          : prev
      )
      setIsUpdatingLike(false)
      return
    }

    setLikedPost(Boolean(result?.liked))
    setPost((prev) =>
      prev
        ? {
            ...prev,
            likes: Number(result?.likes ?? 0),
            json_likes: Array.isArray(result?.likedUserIds) ? result.likedUserIds : [],
          }
        : prev
    )

    setIsUpdatingLike(false)
  }

  const handleLikeReply = async (replyId: string) => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    if (!post || !user?.id) return

    setReplyLikeError(null)
    setUpdatingReplyLikeId(replyId)

    const previousReplies = replies
    const nextReplies = replies.map((reply) => {
      if (reply.id !== replyId) return reply
      const likedUsers = Array.isArray(reply.liked_user_ids) ? [...reply.liked_user_ids] : []
      const hasLiked = likedUsers.includes(user.id)
      const updatedLikedUsers = hasLiked
        ? likedUsers.filter((id) => id !== user.id)
        : [...likedUsers, user.id]
      return {
        ...reply,
        liked_user_ids: updatedLikedUsers,
        likes: updatedLikedUsers.length,
        attachments: Array.isArray(reply.attachments) ? reply.attachments : [],
      }
    })

    setReplies(nextReplies)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      setReplyLikeError("Your session expired. Please sign in again.")
      setReplies(previousReplies)
      setUpdatingReplyLikeId(null)
      openAuthModal()
      return
    }

    const response = await fetch(`/api/forum/threads/${post.id}/replies/${replyId}/likes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      setReplyLikeError(result?.error ?? "Failed to update reply like. Please try again.")
      setReplies(previousReplies)
      setUpdatingReplyLikeId(null)
      return
    }

    setReplies((prev) =>
      prev.map((reply) => {
        if (reply.id !== replyId) return reply

        return {
          ...reply,
          liked_user_ids: Array.isArray(result?.likedUserIds) ? result.likedUserIds : [],
          likes: Number(result?.likes ?? 0),
        }
      })
    )
    setUpdatingReplyLikeId(null)
  }

  const handleReplyFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return

    const files = Array.from(event.target.files)
    const validationError = validateAttachmentSelection(files)

    if (validationError) {
      setReplyUploadError(validationError)
      return
    }

    setReplyUploadError(null)
    setReplyFiles(files)
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    if (!replyContent.trim() || !post) return

    setReplyError(null)
    setReplyUploadError(null)
    setIsSubmittingReply(true)

    const pendingContent = replyContent.trim()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token || !session.user) {
      setReplyError("Your session expired. Please sign in again.")
      setIsSubmittingReply(false)
      openAuthModal()
      return
    }

    let attachments: Attachment[] = []

    if (replyFiles.length) {
     try {
        attachments = await uploadAttachments(replyFiles, session.user.id)
      } catch (error) {
        console.error(error)
        setReplyUploadError(
          error instanceof Error
            ? error.message
            : "Failed to upload attachments. Please try again.",
        )
        setIsSubmittingReply(false)
        return
      }
    }

    const response = await fetch(`/api/forum/threads/${post.id}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        content: pendingContent,
        attachments,
      }),
    })

    const result = await response.json()

    if (!response.ok || !result?.reply) {
      setReplyError(result?.error ?? "Failed to post reply. Please try again.")
      setReplyContent(pendingContent)
      setIsSubmittingReply(false)
      return
    }

    setReplyContent("")
    setReplyFiles([])
    setReplies((prev) => normalizeReplies([...prev, result.reply as PostReply], canModerate))
    setPost((prev) =>
      prev
        ? {
            ...prev,
            replies_count: Number(result.repliesCount ?? (prev.replies_count ?? 0) + 1),
          }
        : prev
    )
    setIsSubmittingReply(false)
  }

  const handleModerationAction = async (
    replyId: string,
    action: 'remove-reply' | 'restore-reply' | 'mark-accepted',
  ) => {
    if (!post || !isAuthenticated) {
      openAuthModal()
      return
    }

    setModerationError(null)
    setIsModeratingReplyId(replyId)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      setModerationError('Your session expired. Please sign in again.')
      setIsModeratingReplyId(null)
      openAuthModal()
      return
    }

    const payload =
      action === 'remove-reply'
        ? { action, replyId, reason: 'Removed via moderator tools' }
        : { action, replyId }

    const response = await fetch(`/api/forum/threads/${post.id}/moderation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()

    if (!response.ok) {
      setModerationError(result?.error ?? 'Failed to apply moderation action.')
      setIsModeratingReplyId(null)
      return
    }

    setReplies(normalizeReplies(result?.replies as PostReply[] | null, canModerate))
    setIsModeratingReplyId(null)
  }

  const handleShare = async () => {
    try {
      const shareData: ShareData = {
        title: post.title ?? "Discussion",
        url: window.location.href,
      }

      if (post.content) {
        shareData.text = post.content
      }

      await navigator.share(shareData)
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="container px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6 hover:text-white" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Forum
      </Button>

      {/* Main Post */}
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
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.created_at ? formatDate(post.created_at) : "Just now"}
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
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2 hover:text-white" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2 hover:text-white" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
             <p className="leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
          <AttachmentsGrid attachments={post.attachments} />

          <Separator className="my-4" />

          {/* Post Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant={likedPost ? "default" : "outline"}
              size="sm"
              onClick={handleLikePost}
              className="gap-2 dark:hover:text-gray-400"
              disabled={isUpdatingLike}
            >
              <ThumbsUp className="h-4 w-4" />
              {post.likes ?? 0}
            </Button>
            <Button variant="outline" size="sm" className="gap-2 dark:hover:text-gray-400">
              <MessageSquare className="h-4 w-4" />
              {replies.length} Replies
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2 ml-auto hover:text-white">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Replies Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
        </h2>

        {replyLikeError && <p className="text-sm text-destructive mb-3">{replyLikeError}</p>}
        {moderationError && <p className="text-sm text-destructive mb-3">{moderationError}</p>}
        <div className="space-y-4">
          {replies.map((reply) => {
            const replyAuthorName = reply.user_full_name || "Community Member"
            const replyAvatar =
              reply.user_avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(replyAuthorName)}&background=0ea5e9&color=fff`

            return (
              <Card key={reply.id} className={reply.isAccepted ? "border-green-500/50" : ""}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={replyAvatar} alt={replyAuthorName} />
                      <AvatarFallback>{replyAuthorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{replyAuthorName}</span>
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
                            {canModerate && !reply.isHidden && (
                              <DropdownMenuItem
                                onClick={() => handleModerationAction(reply.id, 'remove-reply')}
                                disabled={isModeratingReplyId === reply.id}
                              >
                                Hide Reply
                              </DropdownMenuItem>
                            )}
                            {canModerate && reply.isHidden && (
                              <DropdownMenuItem
                                onClick={() => handleModerationAction(reply.id, 'restore-reply')}
                                disabled={isModeratingReplyId === reply.id}
                              >
                                Restore Reply
                              </DropdownMenuItem>
                            )}
                            {canModerate && (
                              <DropdownMenuItem
                                onClick={() => handleModerationAction(reply.id, 'mark-accepted')}
                                disabled={isModeratingReplyId === reply.id}
                              >
                                Mark Accepted
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Flag className="h-4 w-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {reply.isHidden ? (
                        <p className="text-sm leading-relaxed mb-3 text-muted-foreground">
                          This reply is hidden from community view.
                        </p>
                      ) : (
                        <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">{reply.content}</p>
                      )}
                      {canModerate && reply.isHidden && reply.moderationReason && (
                        <p className="text-xs text-muted-foreground mb-3">
                          Moderation note: {reply.moderationReason}
                        </p>
                      )}
                      {canModerate && Array.isArray(reply.moderationHistory) && reply.moderationHistory.length > 0 && (
                        <div className="mb-3 rounded-md border border-border/60 bg-muted/30 p-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Moderation history</p>
                          <ul className="space-y-1">
                            {reply.moderationHistory.slice(0, 3).map((entry, index) => (
                              <li key={`${reply.id}-moderation-${index}`} className="text-xs text-muted-foreground">
                                {entry.action} by {entry.moderatedBy} on {formatDate(entry.moderatedAt)}
                                {entry.reason ? ` (${entry.reason})` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <AttachmentsGrid attachments={reply.attachments} />
                      {!reply.isHidden && (
                        <Button
                          variant={likedReplies.has(reply.id) ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleLikeReply(reply.id)}
                          className="gap-2 h-8"
                          disabled={updatingReplyLikeId === reply.id}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          {reply.likes ?? 0}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Reply Form */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Leave a Reply</h3>
          {isAuthenticated ? (
            <form onSubmit={handleSubmitReply}>
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                   <Textarea
                     placeholder="Share your thoughts or answer..."
                     value={replyContent}
                     onChange={(e) => setReplyContent(e.target.value)}
                     rows={4}
                   />
                   <div>
                     <label className="text-sm font-medium">Attachments</label>
                      <input
                        type="file"
                        multiple
                        onChange={handleReplyFileSelection}
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
                   {likeError && <p className="text-sm text-destructive">{likeError}</p>}
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
              <Button onClick={openAuthModal}>Sign In to Reply</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

