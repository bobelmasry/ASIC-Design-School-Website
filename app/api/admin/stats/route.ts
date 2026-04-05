import { NextRequest, NextResponse } from "next/server"
import { adminSupabase } from "@/lib/admin-supabase"

export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get total posts count
    const { count: totalPosts, error: totalError } = await adminSupabase
      .from("posts")
      .select("*", { count: "exact", head: true })

    if (totalError) {
      console.error("Error fetching total posts:", totalError)
      return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
    }

    // Get posts from today
    const { count: todayPosts, error: todayError } = await adminSupabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString())

    if (todayError) {
      console.error("Error fetching today's posts:", todayError)
      return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
    }

    // Get posts from this week
    const { count: weekPosts, error: weekError } = await adminSupabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString())

    if (weekError) {
      console.error("Error fetching week's posts:", weekError)
      return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
    }

    // Get posts from this month
    const { count: monthPosts, error: monthError } = await adminSupabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthAgo.toISOString())

    if (monthError) {
      console.error("Error fetching month's posts:", monthError)
      return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
    }

    return NextResponse.json({
      postStats: {
        total: totalPosts || 0,
        today: todayPosts || 0,
        thisWeek: weekPosts || 0,
        thisMonth: monthPosts || 0,
      }
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}