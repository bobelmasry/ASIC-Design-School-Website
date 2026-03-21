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
import { forumPosts, forumReplies } from "@/lib/placeholder-data"
import {
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Eye,
  Clock,
  Share2,
  Flag,
  MoreHorizontal,
  Send,
  CheckCircle2,
  Pin,
  Flame,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ForumPostPage() {
  const params = useParams()
  const router = useRouter()
  const { openAuthModal, isAuthenticated, user } = useAuth()
  const [replyContent, setReplyContent] = React.useState("")
  const [likedPost, setLikedPost] = React.useState(false)
  const [likedReplies, setLikedReplies] = React.useState<Set<string>>(new Set())

  const post = forumPosts.find((p) => p.id === params.id)
  const replies = forumReplies.filter((r) => r.postId === params.id)

  if (!post) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Discussion Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The discussion you&apos;re looking for doesn&apos;t exist or has been removed.
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

  const handleLikePost = () => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    setLikedPost(!likedPost)
  }

  const handleLikeReply = (replyId: string) => {
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    setLikedReplies((prev) => {
      const next = new Set(prev)
      if (next.has(replyId)) {
        next.delete(replyId)
      } else {
        next.add(replyId)
      }
      return next
    })
  }

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      openAuthModal()
      return
    }
    if (!replyContent.trim()) return
    // In a real app, this would submit to the backend
    setReplyContent("")
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
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
                {post.isPinned && (
                  <Badge variant="secondary" className="gap-1">
                    <Pin className="h-3 w-3" />
                    Pinned
                  </Badge>
                )}
                {post.isHot && (
                  <Badge variant="secondary" className="gap-1 bg-orange-500/10 text-orange-500 border-orange-500/20">
                    <Flame className="h-3 w-3" />
                    Hot
                  </Badge>
                )}
                <Badge variant="outline">{post.category}</Badge>
              </div>
              <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Link href={`/engineers/${post.author.id}`} className="hover:text-primary">
                    {post.author.name}
                  </Link>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views} views
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

          <Separator className="my-4" />

          {/* Post Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant={likedPost ? "default" : "outline"}
              size="sm"
              onClick={handleLikePost}
              className="gap-2 dark:hover:text-gray-400"
            >
              <ThumbsUp className="h-4 w-4" />
              {post.likes + (likedPost ? 1 : 0)}
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

        <div className="space-y-4">
          {replies.map((reply) => (
            <Card key={reply.id} className={reply.isAccepted ? "border-green-500/50" : ""}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                    <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/engineers/${reply.author.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {reply.author.name}
                        </Link>
                        {reply.isAccepted && (
                          <Badge variant="secondary" className="gap-1 bg-green-500/10 text-green-600 border-green-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Accepted
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Flag className="h-4 w-4 mr-2" />
                            Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                      {reply.content}
                    </p>
                    <Button
                      variant={likedReplies.has(reply.id) ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleLikeReply(reply.id)}
                      className="gap-2 h-8"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {reply.likes + (likedReplies.has(reply.id) ? 1 : 0)}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!replyContent.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      Post Reply
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
