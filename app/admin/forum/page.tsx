"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-context"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft,
  Trash2,
  MessageSquare,
  ThumbsUp,
  Clock,
  AlertTriangle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  isHidden?: boolean | null
  replies?: any[] | null
  replies_count?: number | null
  likes?: number | null
  user_id?: string | null
  user_full_name?: string | null
  json_likes?: string[] | null
  attachments?: Attachment[] | null
}

export default function AdminForumDashboard() {
  const { user, canModerateForum, isAuthenticated, forceRefreshSession } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = React.useState<DatabasePost[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [deletingPostId, setDeletingPostId] = React.useState<string | null>(null)
  const [isRefreshingSession, setIsRefreshingSession] = React.useState(false)

  // Debug logging
  React.useEffect(() => {
    console.log('Admin dashboard debug:', {
      isAuthenticated,
      canModerateForum,
      userRole: user?.role,
      userId: user?.id,
      userEmail: user?.email
    })
  }, [isAuthenticated, canModerateForum, user])

  const handleRefreshSession = async () => {
    setIsRefreshingSession(true)
    try {
      await forceRefreshSession()
      // Force a page reload to get updated context
      window.location.reload()
    } catch (error) {
      console.error('Failed to refresh session:', error)
    } finally {
      setIsRefreshingSession(false)
    }
  }

  React.useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, staying on page to show access denied')
      return
    }
    
    if (!canModerateForum) {
      console.log('User does not have moderator permissions, staying on page to show access denied')
      return
    }

    const loadPosts = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      setPosts(data || [])
      setIsLoading(false)
    }

    loadPosts()
  }, [isAuthenticated, canModerateForum, router])

  const handleHidePost = async (postId: string) => {
    setDeletingPostId(postId)

    const { error } = await supabase
      .from("posts")
      .update({ isHidden: true })
      .eq("id", postId)

    if (error) {
      alert(`Failed to hide post: ${error.message}`)
      setDeletingPostId(null)
      return
    }

    setPosts(posts.map(post => 
      String(post.id) === postId 
        ? { ...post, isHidden: true }
        : post
    ))
    setDeletingPostId(null)
  }

  const handleUnhidePost = async (postId: string) => {
    setDeletingPostId(postId)

    const { error } = await supabase
      .from("posts")
      .update({ isHidden: false })
      .eq("id", postId)

    if (error) {
      alert(`Failed to unhide post: ${error.message}`)
      setDeletingPostId(null)
      return
    }

    setPosts(posts.map(post => 
      String(post.id) === postId 
        ? { ...post, isHidden: false }
        : post
    ))
    setDeletingPostId(null)
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Just now"
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInMinutes < 5) return "Just now"
    if (diffInHours < 1) return `${diffInMinutes}m ago`
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (!isAuthenticated || !canModerateForum) {
    return (
      <div className="container px-4 py-16 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access the admin dashboard.
        </p>
        {isAuthenticated && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you were recently granted admin access, try refreshing your session:
            </p>
            <Button onClick={handleRefreshSession} disabled={isRefreshingSession}>
              {isRefreshingSession ? "Refreshing..." : "Refresh Session"}
            </Button>
          </div>
        )}
        <div className="mt-6">
          <Button asChild>
            <Link href="/forum">Back to Forum</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-16">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/forum">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forum
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Admin Forum Dashboard</h1>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={`loading-${index}`} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="flex gap-4">
                      <div className="h-3 bg-muted rounded w-16" />
                      <div className="h-3 bg-muted rounded w-12" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Posts</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" asChild>
          <Link href="/forum">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forum
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Admin Forum Dashboard</h1>
          <p className="text-muted-foreground">Manage forum posts and moderation</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            All Posts ({posts.length}) - {posts.filter(p => p.isHidden).length} Hidden
          </CardTitle>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No posts found.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => {
                const authorName = post.user_full_name || "Community Member"
                const authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0ea5e9&color=fff`

                return (
                  <Card key={String(post.id)} className={`border ${post.isHidden ? "border-destructive/50 bg-destructive/5" : ""}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={authorAvatar} alt={authorName} />
                          <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <h3 className={`font-semibold ${post.isHidden ? "line-through text-muted-foreground" : ""}`}>
                                  {post.title || "Untitled"}
                                </h3>
                                {post.category && <Badge variant="outline">{post.category}</Badge>}
                                {post.isHidden && (
                                  <Badge variant="destructive" className="text-xs">
                                    Hidden
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{authorName}</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(post.created_at)}
                                </span>
                                {post.edited_at && (
                                  <span className="text-xs text-muted-foreground">
                                    (edited {formatDate(post.edited_at)})
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-muted-foreground text-right">
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {post.replies_count ?? 0}
                                </div>
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  {post.likes ?? 0}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {post.isHidden ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUnhidePost(String(post.id))}
                                    disabled={deletingPostId === String(post.id)}
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                  >
                                    Unhide
                                  </Button>
                                ) : (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={deletingPostId === String(post.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Hide Post</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to hide this post? It will be hidden from regular users but can be unhidden later by admins.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleHidePost(String(post.id))}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          Hide Post
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </div>
                          </div>
                          <p className={`text-sm ${post.isHidden ? "text-muted-foreground line-through" : "text-muted-foreground"} line-clamp-2`}>
                            {post.content ? `${post.content.slice(0, 200)}...` : "No content"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}