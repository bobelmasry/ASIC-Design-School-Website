import { NextRequest, NextResponse } from "next/server"
import { adminSupabase } from "@/lib/admin-supabase"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params
    const body = await request.json()
    const { role } = body

    if (!role || !['admin', 'member'].includes(role)) {
      return NextResponse.json({ error: "Invalid role. Must be 'admin' or 'member'" }, { status: 400 })
    }

    // Update the user's app_metadata
    const { data, error } = await adminSupabase.auth.admin.updateUserById(userId, {
      app_metadata: {
        role,
        provider: "google", // keeping existing structure
        providers: ["google"]
      }
    })

    if (error) {
      console.error("Error updating user:", error)
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}