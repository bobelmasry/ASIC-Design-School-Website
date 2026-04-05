import { NextRequest, NextResponse } from "next/server"
import { adminSupabase } from "@/lib/admin-supabase"

export async function GET(request: NextRequest) {
  try {
    // First, get users with their post counts
    const { data: userPosts, error: postsError } = await adminSupabase
      .from("posts")
      .select("user_id, user_full_name")
      .not("user_id", "is", null)

    if (postsError) {
      console.error("Error fetching user posts:", postsError)
      return NextResponse.json({ error: "Failed to fetch user activity" }, { status: 500 })
    }

    // Count posts per user
    const postCounts = userPosts.reduce((acc, post) => {
      const userId = post.user_id
      const userName = post.user_full_name || "Unknown User"

      if (!acc[userId]) {
        acc[userId] = { id: userId, name: userName, posts: 0, replies: 0, total: 0 }
      }
      acc[userId].posts++
      acc[userId].total++
      return acc
    }, {} as Record<string, { id: string; name: string; posts: number; replies: number; total: number }>)

    // For replies, we need to check if there's a replies table or if replies are stored in posts
    // Let's check if there's a replies column in posts that contains reply data
    const { data: postsWithReplies, error: repliesError } = await adminSupabase
      .from("posts")
      .select("replies")
      .not("replies", "is", null)

    if (repliesError) {
      console.error("Error fetching replies:", repliesError)
    } else if (postsWithReplies) {
      // If replies are stored as JSON in posts table
      postsWithReplies.forEach(post => {
        if (post.replies && Array.isArray(post.replies)) {
          post.replies.forEach((reply: any) => {
            if (reply.user_id) {
              const userId = reply.user_id
              const userName = reply.user_full_name || "Unknown User"

              if (!postCounts[userId]) {
                postCounts[userId] = { id: userId, name: userName, posts: 0, replies: 0, total: 0 }
              }
              postCounts[userId].replies++
              postCounts[userId].total++
            }
          })
        }
      })
    }

    // Convert to array and sort by total activity
    const activeUsers = Object.values(postCounts)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(user => ({
        id: user.id,
        name: user.name,
        posts: user.posts,
        replies: user.replies,
        totalActivity: user.total
      }))

    return NextResponse.json({
      topActiveUsers: activeUsers
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}