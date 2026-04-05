import { NextRequest, NextResponse } from "next/server"
import { adminSupabase } from "@/lib/admin-supabase"

export async function GET(request: NextRequest) {
  try {
    // Fetch all users from auth.users
    const { data: users, error } = await adminSupabase.auth.admin.listUsers()

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    // Transform the data to include role information
    const transformedUsers = users.users.map(user => {
      const rawAppMetaData = user.app_metadata as any
      const role = rawAppMetaData?.role === 'admin' ? 'admin' : 'member'

      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      }
    })

    return NextResponse.json({ users: transformedUsers })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}