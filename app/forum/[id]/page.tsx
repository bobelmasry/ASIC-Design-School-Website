"use client"

import * as React from "react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
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
import { UserTagging } from "@/components/user-tagging"
import { Switch } from "@/components/ui/switch"
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
  Edit,
} from "lucide-react"
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

type PostReply = {
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

type DatabasePost = {
  id: string | number
  title: string | null
  content?: string | null
  category?: string | null
  created_at?: string | null
  edited_at?: string | null
  isHidden?: boolean | null
  isPinned?: boolean | null
  replies?: PostReply[] | null
  replies_count?: number | null
  likes?: number | null
  user_id?: string | null
  user_full_name?: string | null
  user_role?: string | null
  json_likes?: string[] | null
  attachments?: Attachment[] | null
  is_markdown?: boolean | null
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

const normalizeReplies = (rawReplies: PostReply[] | null | undefined): PostReply[] => {
  if (!Array.isArray(rawReplies)) return []
  return rawReplies.map((reply) => {
    const likedUsers = Array.isArray(reply.liked_user_ids) ? reply.liked_user_ids : []
    return {
      ...reply,
      liked_user_ids: likedUsers,
      likes: reply.likes ?? likedUsers.length,
      attachments: reply.attachments || [],
    }
  })
}

export default function ForumPostPage() {
  const params = useParams()
  const router = useRouter()
  const { openAuthModal, isAuthenticated, user, canModerateForum } = useAuth()
  const [replyContent, setReplyContent] = React.useState("")
  const [isMarkdownReply, setIsMarkdownReply] = React.useState(false)
  const [mentionedUserIds, setMentionedUserIds] = React.useState<string[]>([])
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
  const [updatingReplyLikeId, setUpdatingReplyLikeId] = React.useState<string | null>(null)
  const [replyFiles, setReplyFiles] = React.useState<File[]>([])
  const [replyUploadError, setReplyUploadError] = React.useState<string | null>(null)
  const [adminActionError, setAdminActionError] = React.useState<string | null>(null)
  const [isDeletingOwn, setIsDeletingOwn] = React.useState(false)
  const [isDeletingOwnReply, setIsDeletingOwnReply] = React.useState<string | null>(null)
  const [isAdminActionLoading, setIsAdminActionLoading] = React.useState(false)
  const [showCopiedPopover, setShowCopiedPopover] = React.useState(false)

  React.useEffect(() => {
    let isMounted = true

    const loadPost = async () => {
      setIsLoadingPost(true)
      setReplies([])
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", params.id)
        .single()

      if (!isMounted) return

      if (error) {
        setFetchError(error.message ?? "Failed to load discussion.")
        setIsLoadingPost(false)
        return
      }

      const normalizedPost = normalizePost(data)
      
      // Check if post is hidden and user is not admin
      if (normalizedPost?.isHidden && !canModerateForum) {
        setFetchError("This post is not available.")
        setIsLoadingPost(false)
        return
      }
      
      setPost(normalizedPost)
      setReplies(normalizeReplies(data.replies as PostReply[] | null))
      setFetchError(null)
      setIsLoadingPost(false)
    }

    loadPost()

    return () => {
      isMounted = false
    }
  }, [params.id])

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

    const { error } = await supabase
      .from("posts")
      .update({ likes: updatedLikes, json_likes: updatedLikedUsers })
      .eq("id", post.id)

    if (error) {
      setLikeError(error.message ?? "Failed to update likes. Please try again.")
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

    const { error, data } = await supabase
      .from("posts")
      .update({ replies: nextReplies })
      .eq("id", post.id)
      .select("replies")
      .single()

    if (error) {
      setReplyLikeError(error.message ?? "Failed to update reply like. Please try again.")
      setReplies(previousReplies)
      setUpdatingReplyLikeId(null)
      return
    }

    setReplies(normalizeReplies(data.replies as PostReply[] | null))
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
    const replyId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : cryptoIdFallback()
    const authorName = user?.name || "Community Member"
    let attachments: Attachment[] = []

    if (replyFiles.length) {
     try {
        attachments = await uploadAttachments(replyFiles, user?.id)
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

    const newReply: PostReply = {
      id: replyId,
      content: pendingContent,
      is_markdown: isMarkdownReply,
      mentioned_user_ids: mentionedUserIds,
      user_id: user?.id,
      user_full_name: authorName,
      user_role: user?.role || 'member',
      user_avatar:
        user?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0ea5e9&color=fff`,
      created_at: new Date().toISOString(),
      likes: 0,
      liked_user_ids: [],
      attachments,
    }

    const previousReplies = replies
    const updatedReplies = [...replies, newReply]

    setReplies(updatedReplies)
    setReplyContent("")
    setPost((prev) =>
      prev
        ? {
            ...prev,
            replies_count: updatedReplies.length,
          }
        : prev
    )

    const { error, data } = await supabase
      .from("posts")
      .update({
        replies: updatedReplies,
        replies_count: updatedReplies.length,
      })
      .eq("id", post.id)
      .select("*")
      .single()

    if (error) {
      setReplyError(error.message ?? "Failed to post reply. Please try again.")
      setReplies(previousReplies)
      setReplyContent(pendingContent)
      setPost((prev) =>
        prev
          ? {
              ...prev,
              replies_count: previousReplies.length,
            }
          : prev
      )
      setIsSubmittingReply(false)
      return
    }

    setPost(normalizePost(data))
    setReplyFiles([])
    setReplies(normalizeReplies(data.replies as PostReply[] | null))
    setIsSubmittingReply(false)
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
    setShowCopiedPopover(true)
    setTimeout(() => setShowCopiedPopover(false), 2000)
  }

  const handleDeleteOwnPost = async () => {
    if (!post || !user?.id || user.id !== post.user_id || isDeletingOwn) return

    const confirmed = window.confirm("Delete this discussion and all its replies?")
    if (!confirmed) return

    setIsDeletingOwn(true)

    const { error } = await supabase.from("posts").delete().eq("id", post.id)

    if (error) {
      alert("Failed to delete discussion.")
      setIsDeletingOwn(false)
      return
    }

    router.push("/forum")
  }

  const handleDeleteOwnReply = async (replyId: string) => {
    if (!post || !user?.id || isDeletingOwnReply === replyId) return

    const reply = replies.find(r => r.id === replyId)
    if (!reply || reply.user_id !== user.id) return

    const confirmed = window.confirm("Delete this reply?")
    if (!confirmed) return

    setIsDeletingOwnReply(replyId)

    const updatedReplies = replies.filter((r) => r.id !== replyId)
    const { error, data } = await supabase
      .from("posts")
      .update({ replies: updatedReplies, replies_count: updatedReplies.length })
      .eq("id", post.id)
      .select("*")
      .single()

    if (error) {
      alert("Failed to delete reply.")
      setIsDeletingOwnReply(null)
      return
    }

    setPost(normalizePost(data))
    setReplies(normalizeReplies(data.replies as PostReply[] | null))
    setIsDeletingOwnReply(null)
  }

  const handleDeletePost = async () => {
    if (!post || !canModerateForum || isAdminActionLoading) return

    const confirmed = window.confirm("Delete this discussion and all its replies?")
    if (!confirmed) return

    setAdminActionError(null)
    setIsAdminActionLoading(true)

    const { error } = await supabase.from("posts").delete().eq("id", post.id)

    if (error) {
      setAdminActionError(error.message ?? "Failed to delete discussion.")
      setIsAdminActionLoading(false)
      return
    }

    router.push("/forum")
  }

  const handleDeleteReply = async (replyId: string) => {
    if (!post || !canModerateForum || isAdminActionLoading) return

    const confirmed = window.confirm("Delete this reply?")
    if (!confirmed) return

    setAdminActionError(null)
    setIsAdminActionLoading(true)

    const updatedReplies = replies.filter((reply) => reply.id !== replyId)
    const { error, data } = await supabase
      .from("posts")
      .update({ replies: updatedReplies, replies_count: updatedReplies.length })
      .eq("id", post.id)
      .select("*")
      .single()

    if (error) {
      setAdminActionError(error.message ?? "Failed to delete reply.")
      setIsAdminActionLoading(false)
      return
    }

    setPost(normalizePost(data))
    setReplies(normalizeReplies(data.replies as PostReply[] | null))
    setIsAdminActionLoading(false)
  }

  const handleToggleAcceptedReply = async (replyId: string) => {
    if (!post || !canModerateForum || isAdminActionLoading) return

    setAdminActionError(null)
    setIsAdminActionLoading(true)

    const updatedReplies = replies.map((reply) =>
      reply.id === replyId
        ? {
            ...reply,
            isAccepted: !reply.isAccepted,
          }
        : reply,
    )

    const { error, data } = await supabase
      .from("posts")
      .update({ replies: updatedReplies })
      .eq("id", post.id)
      .select("*")
      .single()

    if (error) {
      setAdminActionError(error.message ?? "Failed to update reply status.")
      setIsAdminActionLoading(false)
      return
    }

    setPost(normalizePost(data))
    setReplies(normalizeReplies(data.replies as PostReply[] | null))
    setIsAdminActionLoading(false)
  }

  return (
    <div className="container px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6 hover:text-white" asChild>
        <Link href="/forum">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Link>
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
                  {post?.user_role === 'admin' && <span className="text-xs text-muted-foreground">(admin)</span>}
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
                  <DropdownMenuItem onClick={handleShare}>
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
                      onClick={handleDeletePost}
                      disabled={isAdminActionLoading}
                      className="text-destructive"
                    >
                      Delete Discussion
                    </DropdownMenuItem>
                  )}
                  {user?.id === post.user_id && !canModerateForum && (
                    <DropdownMenuItem
                      onClick={handleDeleteOwnPost}
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
          {adminActionError && <p className="text-sm text-destructive mb-3">{adminActionError}</p>}
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
             {post.is_markdown ? (
               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                 {post.content || ""}
               </ReactMarkdown>
             ) : (
               <p className="leading-relaxed">{parseLinks(post.content || "")}</p>
             )}
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
            <Popover open={showCopiedPopover} onOpenChange={setShowCopiedPopover}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2 ml-auto hover:text-white">
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

      {/* Replies Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
        </h2>

        {replyLikeError && <p className="text-sm text-destructive mb-3">{replyLikeError}</p>}
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
                                   onClick={() => handleToggleAcceptedReply(reply.id)}
                                   disabled={isAdminActionLoading}
                                 >
                                   {reply.isAccepted ? "Remove Accepted Mark" : "Mark as Accepted"}
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                   onClick={() => handleDeleteReply(reply.id)}
                                   disabled={isAdminActionLoading}
                                   className="text-destructive"
                                 >
                                   Delete Reply
                                 </DropdownMenuItem>
                               </>
                             )}
                             {user?.id === reply.user_id && !canModerateForum && (
                               <DropdownMenuItem
                                 onClick={() => handleDeleteOwnReply(reply.id)}
                                 disabled={isDeletingOwnReply === reply.id}
                                 className="text-destructive"
                               >
                                 Delete Reply
                               </DropdownMenuItem>
                             )}
                           </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed mb-3">
                        {reply.is_markdown ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {reply.content}
                          </ReactMarkdown>
                        ) : (
                          parseLinks(reply.content)
                        )}
                      </div>
                      <AttachmentsGrid attachments={reply.attachments} />
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
                   <div className="space-y-2">
                     <div className="flex items-center justify-between">
                       <label className="text-sm font-medium">Your Message</label>
                       <div className="flex items-center space-x-2">
                         <Switch
                           id="reply-markdown-mode"
                           checked={isMarkdownReply}
                           onCheckedChange={setIsMarkdownReply}
                         />
                         <label htmlFor="reply-markdown-mode" className="text-xs text-muted-foreground cursor-pointer">
                           Markdown
                         </label>
                       </div>
                     </div>
                     <UserTagging
                       placeholder={isMarkdownReply ? "Markdown supported... Tag users with @" : "Share your thoughts or answer... Tag users with @"}
                       value={replyContent}
                       onChange={setReplyContent}
                       onMentionIdsChange={setMentionedUserIds}
                       rows={4}
                       className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     />
                   </div>
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

const cryptoIdFallback = () =>
  Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)

// Utility function to parse and render links and @mentions in text
const parseLinks = (text: string) => {
  // Regular expression to match URLs and @mentions
  // Mentions match @ followed by word characters and spaces until a non-word/non-space character that isn't part of a name
  // This version is more greedy to capture full names
  const urlRegex = /(https?:\/\/[^\s]+|@[a-zA-Z0-9.\-_]+(?:\s[a-zA-Z0-9.\-_]+)*)/g

  // Split text by regex matches and map to React elements
  const parts = text.split(urlRegex)

  return parts.map((part, index) => {
    if (part.startsWith('http')) {
      // This part is a URL, wrap it in an anchor tag
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline break-all"
        >
          {part}
        </a>
      )
    } else if (part.startsWith('@')) {
      // This part is a mention
      return (
        <span key={index} className="text-primary font-medium bg-primary/10 px-1 rounded">
          {part}
        </span>
      )
    } else {
      // This part is regular text, preserve line breaks
      return part.split('\n').map((line, lineIndex, lineArray) => (
        <React.Fragment key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < lineArray.length - 1 && <br />}
        </React.Fragment>
      ))
    }
  })
}
