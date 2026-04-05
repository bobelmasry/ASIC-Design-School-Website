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
  Users,
  Search,
  Shield,
  ShieldOff,
  BarChart3,
  TrendingUp,
  Calendar,
  Activity,
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
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

type User = {
  id: string
  email: string
  name: string
  role: 'admin' | 'member'
  created_at: string
  last_sign_in_at: string | null
}

export default function AdminDashboard() {
  const { user, canModerateForum, isAuthenticated, forceRefreshSession } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = React.useState<DatabasePost[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [deletingPostId, setDeletingPostId] = React.useState<string | null>(null)
  const [isRefreshingSession, setIsRefreshingSession] = React.useState(false)
  const [users, setUsers] = React.useState<User[]>([])
  const [usersLoading, setUsersLoading] = React.useState(false)
  const [usersError, setUsersError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [updatingUserId, setUpdatingUserId] = React.useState<string | null>(null)
  const [activityData, setActivityData] = React.useState<{
    postStats: {
      total: number
      today: number
      thisWeek: number
      thisMonth: number
    }
    topActiveUsers: Array<{
      id: string
      name: string
      posts: number
      replies: number
      totalActivity: number
    }>
  } | null>(null)
  const [activityLoading, setActivityLoading] = React.useState(false)
  const [activityError, setActivityError] = React.useState<string | null>(null)

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

  const loadUsers = async () => {
    setUsersLoading(true)
    setUsersError(null)
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Error loading users:', error)
      setUsersError(error instanceof Error ? error.message : 'Failed to load users')
    } finally {
      setUsersLoading(false)
    }
  }

  const loadActivity = async () => {
    setActivityLoading(true)
    setActivityError(null)
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/activity')
      ])

      if (!statsResponse.ok || !activityResponse.ok) {
        throw new Error('Failed to fetch activity data')
      }

      const statsData = await statsResponse.json()
      const activityData = await activityResponse.json()

      setActivityData({
        postStats: statsData.postStats,
        topActiveUsers: activityData.topActiveUsers
      })
    } catch (error) {
      console.error('Error loading activity:', error)
      setActivityError(error instanceof Error ? error.message : 'Failed to load activity data')
    } finally {
      setActivityLoading(false)
    }
  }

  const updateUserRole = async (userId: string, role: 'admin' | 'member') => {
    setUpdatingUserId(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user role')
      }

      // Update the local state
      setUsers(prev => prev.map(u =>
        u.id === userId ? { ...u, role } : u
      ))
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role')
    } finally {
      setUpdatingUserId(null)
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
    loadUsers()
    loadActivity()
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
      <div className="container px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <Button variant="ghost" asChild className="self-start">
            <Link href="/forum">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Forum
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Manage forum posts and users</p>
          </div>
        </div>
        <div className="flex justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage forum posts and users</p>
        </div>
      </div>

      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="mt-6">
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
                                        onClick={() => handleUnhidePost(String(post.id))}
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
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users ({users.length})
              </CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Button variant="outline" onClick={loadUsers} disabled={usersLoading} className="w-full sm:w-auto">
                  {usersLoading ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Card key={`loading-user-${index}`} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-muted rounded w-48" />
                              <div className="h-3 bg-muted rounded w-32" />
                            </div>
                          </div>
                          <div className="h-6 w-16 bg-muted rounded self-end sm:self-center flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : usersError ? (
                <p className="text-center text-destructive py-8">{usersError}</p>
              ) : (
                <div className="space-y-4">
                  {users
                    .filter(user =>
                      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      user.id.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((user) => (
                      <Card key={user.id}>
                        <CardContent>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10 flex-shrink-0">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff`} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold truncate">{user.name}</h3>
                                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                <p className="text-xs text-muted-foreground font-mono truncate">{user.id}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="flex-shrink-0">
                                {user.role === 'admin' ? (
                                  <Shield className="h-3 w-3 mr-1" />
                                ) : (
                                  <ShieldOff className="h-3 w-3 mr-1" />
                                )}
                                {user.role}
                              </Badge>
                              <Checkbox
                                checked={user.role === 'admin'}
                                onCheckedChange={(checked) => updateUserRole(user.id, checked ? 'admin' : 'member')}
                                disabled={updatingUserId === user.id}
                                className="flex-shrink-0"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activityLoading ? "..." : activityData?.postStats.total || 0}
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Posts</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activityLoading ? "..." : activityData?.postStats.today || 0}
                </div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activityLoading ? "..." : activityData?.postStats.thisWeek || 0}
                </div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activityLoading ? "..." : activityData?.postStats.thisMonth || 0}
                </div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Top Active Users
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Users with the most forum activity (posts + replies)
              </p>
              <Button
                variant="outline"
                onClick={loadActivity}
                disabled={activityLoading}
                className="w-full sm:w-auto self-start"
              >
                {activityLoading ? "Loading..." : "Refresh"}
              </Button>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Card key={`loading-activity-${index}`} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-muted" />
                            <div className="space-y-2">
                              <div className="h-4 bg-muted rounded w-32" />
                              <div className="h-3 bg-muted rounded w-24" />
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="h-4 bg-muted rounded w-16" />
                            <div className="h-3 bg-muted rounded w-12" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : activityError ? (
                <p className="text-center text-destructive py-8">{activityError}</p>
              ) : activityData?.topActiveUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No activity data available.</p>
              ) : (
                <div className="space-y-4">
                  {activityData?.topActiveUsers.map((user, index) => (
                    <Card key={user.id}>
                      <CardContent>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </div>
                            <Avatar className="h-10 w-10 flex-shrink-0">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff`} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold truncate">{user.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {user.posts} posts, {user.replies} replies
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-bold text-primary">
                              {user.totalActivity}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Total Activity
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
