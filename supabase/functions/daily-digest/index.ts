import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Daily digest function loaded")

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get users who want daily digest
    const { data: usersWithDigest } = await supabase
      .from('user_email_preferences')
      .select('user_id')
      .eq('daily_digest', true)

    if (!usersWithDigest || usersWithDigest.length === 0) {
      console.log('No users opted in for daily digest')
      return new Response('No recipients', { status: 200 })
    }

    // Get posts and replies from last 24 hours
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { data: recentPosts } = await supabase
      .from('posts')
      .select(`
        id, title, created_at, user_full_name, category,
        replies!inner(id, created_at, user_full_name)
      `)
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false })
      .limit(20)

    const { data: recentReplies } = await supabase
      .from('posts')
      .select(`
        id, title, user_full_name as post_author,
        replies!inner(id, content, created_at, user_full_name, liked_user_ids)
      `)
      .gte('replies.created_at', yesterday.toISOString())
      .order('replies.created_at', { ascending: false })
      .limit(20)

    // Generate digest content
    const digestHtml = generateDigestHtml(recentPosts || [], recentReplies || [])

    // Send to each user
    for (const userPref of usersWithDigest) {
      const { data: user } = await supabase.auth.admin.getUserById(userPref.user_id)
      if (user?.email) {
        await sendDigestEmail(user.email, digestHtml)
      }
    }

    console.log(`Sent daily digest to ${usersWithDigest.length} users`)

    return new Response('Digest sent', { status: 200 })

  } catch (error) {
    console.error('Error sending daily digest:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

function generateDigestHtml(posts: any[], replies: any[]): string {
  const date = new Date().toLocaleDateString()

  let html = `
    <h1>Daily Forum Digest - ${date}</h1>
    <p>Here's what happened in the forum yesterday:</p>
  `

  if (posts.length > 0) {
    html += '<h2>New Posts</h2><ul>'
    for (const post of posts) {
      const replyCount = post.replies?.length || 0
      html += `
        <li>
          <strong>${post.title}</strong> by ${post.user_full_name} in ${post.category}
          (${replyCount} replies)
          <br><a href="${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/forum/${post.id}">View Post</a>
        </li>
      `
    }
    html += '</ul>'
  }

  if (replies.length > 0) {
    html += '<h2>Recent Activity</h2><ul>'
    for (const post of replies) {
      const reply = post.replies[0] // Get the first (most recent) reply
      const likes = reply.liked_user_ids?.length || 0
      html += `
        <li>
          <strong>${post.post_author}'s post</strong> got a reply from ${reply.user_full_name}
          (${likes} likes)
          <br><a href="${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/forum/${post.id}">View Discussion</a>
        </li>
      `
    }
    html += '</ul>'
  }

  if (posts.length === 0 && replies.length === 0) {
    html += '<p>No new activity yesterday. Check back tomorrow!</p>'
  }

  html += `
    <p><a href="${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/forum">Visit the Forum</a></p>
    <p>You can manage your email preferences in your account settings.</p>
  `

  return html
}

async function sendDigestEmail(to: string, html: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      subject: 'Daily Forum Digest',
      html
    }),
  })

  if (!response.ok) {
    console.error('Failed to send digest email:', await response.text())
  }
}