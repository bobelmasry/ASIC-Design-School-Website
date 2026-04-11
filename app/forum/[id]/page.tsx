"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import {
  getPost,
  updatePostLikes,
  updatePostReplies,
  deletePost,
  updateReplyStatus,
  updateReplyLike,
} from "@/lib/forum-api"
import {
  uploadAttachments,
  validateAttachmentSelection,
  type Attachment,
} from "@/lib/attachments"
import { ArrowLeft } from "lucide-react"

// Import modular components
import { ForumPostCard, type DatabasePost } from "@/components/forum/forum-post-card"
import { ForumReplyItem, type PostReply } from "@/components/forum/forum-reply-item"
import { ForumReplyForm } from "@/components/forum/forum-reply-form"

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
  
  // State for post and replies
  const [post, setPost] = React.useState<DatabasePost | null>(null)
  const [replies, setReplies] = React.useState<PostReply[]>([])
  const [isLoadingPost, setIsLoadingPost] = React.useState(true)
  const [fetchError, setFetchError] = React.useState<string | null>(null)
  
  // State for interactions
  const [likedPost, setLikedPost] = React.useState(false)
  const [likedReplies, setLikedReplies] = React.useState<Set<string>>(new Set())
  const [isUpdatingLike, setIsUpdatingLike] = React.useState(false)
  const [updatingReplyLikeId, setUpdatingReplyLikeId] = React.useState<string | null>(null)
  const [showCopiedPopover, setShowCopiedPopover] = React.useState(false)
  
  // State for reply form
  const [replyContent, setReplyContent] = React.useState("")
  const [isMarkdownReply, setIsMarkdownReply] = React.useState(false)
  const [mentionedUserIds, setMentionedUserIds] = React.useState<string[]>([])
  const [replyFiles, setReplyFiles] = React.useState<File[]>([])
  const [isSubmittingReply, setIsSubmittingReply] = React.useState(false)
  const [replyError, setReplyError] = React.useState<string | null>(null)
  const [replyUploadError, setReplyUploadError] = React.useState<string | null>(null)
  
  // State for errors and loading (general)
  const [likeError, setLikeError] = React.useState<string | null>(null)
  const [replyLikeError, setReplyLikeError] = React.useState<string | null>(null)
  const [adminActionError, setAdminActionError] = React.useState<string | null>(null)
  const [isAdminActionLoading, setIsAdminActionLoading] = React.useState(false)
  const [isDeletingOwn, setIsDeletingOwn] = React.useState(false)
  const [isDeletingOwnReply, setIsDeletingOwnReply] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isMounted = true

    const loadPost = async () => {
      setIsLoadingPost(true)
      setReplies([])
      const { data, error } = await getPost(params.id as string)

      if (!isMounted) return

      if (error) {
        setFetchError(error.message ?? "Failed to load discussion.")
        setIsLoadingPost(false)
        return
      }

      const normalizedPost = normalizePost(data as DatabasePost)
      
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
  }, [params.id, canModerateForum])

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

    const { error } = await updatePostLikes(post.id, updatedLikes, updatedLikedUsers)

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

    const { error, data } = await updateReplyLike(post.id, nextReplies)

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
    const replyId = typeof crypto !== "undefined" && "randomUUID" in crypto ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2, 10)
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

    const { error, data } = await updatePostReplies(post.id, updatedReplies)

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

    setPost(normalizePost(data as DatabasePost))
    setReplyFiles([])
    setReplies(normalizeReplies(data.replies as PostReply[] | null))
    setIsSubmittingReply(false)
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
    } catch {
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

    const { error } = await deletePost(post.id)

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
    const { error, data } = await updatePostReplies(post.id, updatedReplies)

    if (error) {
      alert("Failed to delete reply.")
      setIsDeletingOwnReply(null)
      return
    }

    setPost(normalizePost(data as DatabasePost))
    setReplies(normalizeReplies(data.replies as PostReply[] | null))
    setIsDeletingOwnReply(null)
  }

  const handleDeletePost = async () => {
    if (!post || !canModerateForum || isAdminActionLoading) return

    const confirmed = window.confirm("Delete this discussion and all its replies?")
    if (!confirmed) return

    setAdminActionError(null)
    setIsAdminActionLoading(true)

    const { error } = await deletePost(post.id)

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
    const { error, data } = await updatePostReplies(post.id, updatedReplies)

    if (error) {
      setAdminActionError(error.message ?? "Failed to delete reply.")
      setIsAdminActionLoading(false)
      return
    }

    setPost(normalizePost(data as DatabasePost))
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

    const { error, data } = await updateReplyStatus(post.id, updatedReplies)

    if (error) {
      setAdminActionError(error.message ?? "Failed to update reply status.")
      setIsAdminActionLoading(false)
      return
    }

    setPost(normalizePost(data as DatabasePost))
    setReplies(normalizeReplies(data.replies as PostReply[] | null))
    setIsAdminActionLoading(false)
  }

  return (
    <div className="container px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6 hover:text-white" asChild>
        <Link href="/forum">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forum
        </Link>
      </Button>

      {post && (
        <ForumPostCard 
          post={post}
          user={user}
          canModerateForum={canModerateForum}
          isUpdatingLike={isUpdatingLike}
          likedPost={likedPost}
          showCopiedPopover={showCopiedPopover}
          isAdminActionLoading={isAdminActionLoading}
          isDeletingOwn={isDeletingOwn}
          onLike={handleLikePost}
          onShare={handleShare}
          onDeletePost={handleDeletePost}
          onDeleteOwnPost={handleDeleteOwnPost}
          onSetShowCopiedPopover={setShowCopiedPopover}
        />
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
        </h2>

        {replyLikeError && <p className="text-sm text-destructive mb-3">{replyLikeError}</p>}
        {adminActionError && <p className="text-sm text-destructive mb-3">{adminActionError}</p>}
        
        <div className="space-y-4">
          {replies.map((reply) => (
            <ForumReplyItem 
              key={reply.id}
              reply={reply}
              user={user}
              canModerateForum={canModerateForum}
              isAdminActionLoading={isAdminActionLoading}
              isDeletingOwnReply={isDeletingOwnReply === reply.id}
              isLiked={likedReplies.has(reply.id)}
              isUpdatingLike={updatingReplyLikeId === reply.id}
              onLike={() => handleLikeReply(reply.id)}
              onToggleAccepted={() => handleToggleAcceptedReply(reply.id)}
              onDelete={() => handleDeleteReply(reply.id)}
              onDeleteOwn={() => handleDeleteOwnReply(reply.id)}
            />
          ))}
        </div>
      </div>

      <ForumReplyForm 
        isAuthenticated={isAuthenticated}
        user={user}
        replyContent={replyContent}
        isMarkdownReply={isMarkdownReply}
        isSubmittingReply={isSubmittingReply}
        replyError={replyError}
        replyUploadError={replyUploadError}
        replyFiles={replyFiles}
        onOpenAuthModal={openAuthModal}
        onReplyContentChange={setReplyContent}
        onIsMarkdownReplyChange={setIsMarkdownReply}
        onMentionIdsChange={setMentionedUserIds}
        onFileSelection={handleReplyFileSelection}
        onSubmit={handleSubmitReply}
      />
      
      {likeError && <p className="text-sm text-destructive mt-4">{likeError}</p>}
    </div>
  )
}
