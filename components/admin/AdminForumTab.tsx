"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageSquare,
  ThumbsUp,
  Clock,
  Trash2,
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
import { Button } from "@/components/ui/button"

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
  attachments?: any[] | null
}

interface AdminForumTabProps {
  posts: DatabasePost[]
  error: string | null
  deletingPostId: string | null
  onHidePost: (postId: string) => void
  onUnhidePost: (postId: string) => void
}

export function AdminForumTab({ posts, error, deletingPostId, onHidePost, onUnhidePost }: AdminForumTabProps) {
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

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          All Posts ({posts.length}) - {posts.filter(p => p.isHidden).length} Hidden
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="text-center text-destructive py-8">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No posts found.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const authorName = post.user_full_name || "Community Member"
              const authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=0ea5e9&color=fff`

              return (
                <Card key={String(post.id)} className={`border ${post.isHidden ? "border-destructive/50 bg-destructive/5" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Avatar className="h-10 w-10 flex-shrink-0 self-start">
                        <AvatarImage src={authorAvatar} alt={authorName} />
                        <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className={`font-semibold truncate ${post.isHidden ? "line-through text-muted-foreground" : ""}`}>
                                {post.title || "Untitled"}
                              </h3>
                              {post.category && <Badge variant="outline" className="flex-shrink-0">{post.category}</Badge>}
                              {post.isHidden && (
                                <Badge variant="destructive" className="text-xs flex-shrink-0">
                                  Hidden
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                              <span className="truncate">{authorName}</span>
                              <span className="flex items-center gap-1 flex-shrink-0">
                                <Clock className="h-3 w-3" />
                                {formatDate(post.created_at)}
                              </span>
                              {post.edited_at && (
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  (edited {formatDate(post.edited_at)})
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 sm:gap-2 flex-shrink-0">
                            <div className="text-sm text-muted-foreground text-right flex flex-col sm:flex-row sm:gap-4">
                              <div className="flex items-center gap-1 justify-end sm:justify-start">
                                <MessageSquare className="h-3 w-3" />
                                {post.replies_count ?? 0}
                              </div>
                              <div className="flex items-center gap-1 justify-end sm:justify-start">
                                <ThumbsUp className="h-3 w-3" />
                                {post.likes ?? 0}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {post.isHidden ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onUnhidePost(String(post.id))}
                                  disabled={deletingPostId === String(post.id)}
                                  className="text-green-600 border-green-600 hover:bg-green-50 flex-shrink-0"
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
                                      className="flex-shrink-0"
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
                                        onClick={() => onHidePost(String(post.id))}
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
  )
}