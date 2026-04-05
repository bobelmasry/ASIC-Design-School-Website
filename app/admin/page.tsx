"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft,
  AlertTriangle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminForumTab } from "@/components/admin/AdminForumTab"
import { AdminUsersTab } from "@/components/admin/AdminUsersTab"
import { AdminActivityTab } from "@/components/admin/AdminActivityTab"

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

      <Tabs defaultValue="forum" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forum">Forum</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="forum" className="mt-6">
          <AdminForumTab
            posts={posts}
            error={error}
            deletingPostId={deletingPostId}
            onHidePost={handleHidePost}
            onUnhidePost={handleUnhidePost}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <AdminUsersTab
            users={users}
            usersLoading={usersLoading}
            usersError={usersError}
            searchQuery={searchQuery}
            updatingUserId={updatingUserId}
            onSearchChange={setSearchQuery}
            onRefreshUsers={loadUsers}
            onUpdateUserRole={updateUserRole}
          />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <AdminActivityTab
            activityData={activityData}
            activityLoading={activityLoading}
            activityError={activityError}
            onRefreshActivity={loadActivity}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}