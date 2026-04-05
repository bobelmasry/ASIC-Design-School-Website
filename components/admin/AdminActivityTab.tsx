"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  Calendar,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react"

type ActivityData = {
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
}

interface AdminActivityTabProps {
  activityData: ActivityData | null
  activityLoading: boolean
  activityError: string | null
  onRefreshActivity: () => void
}

export function AdminActivityTab({
  activityData,
  activityLoading,
  activityError,
  onRefreshActivity
}: AdminActivityTabProps) {
  return (
    <>
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
            onClick={onRefreshActivity}
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
                  <CardContent className="p-4">
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
    </>
  )
}