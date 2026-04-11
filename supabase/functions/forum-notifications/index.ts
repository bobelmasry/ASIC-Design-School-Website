import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log("Forum notifications function loaded")

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  schema: string
  record: any
  old_record: any
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload: WebhookPayload = await req.json()
    console.log('Received webhook:', payload.type, payload.table)

    if (payload.type !== 'UPDATE' || payload.table !== 'posts') {
      return new Response('Ignored', { status: 200 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const oldReplies = payload.old_record?.replies || []
    const newReplies = payload.record?.replies || []

    if (newReplies.length <= oldReplies.length) {
      return new Response('No new replies', { status: 200 })
    }

    // Find new replies
    const newRepliesList = newReplies.slice(oldReplies.length)

    for (const reply of newRepliesList) {
      await processReplyNotifications(supabase, payload.record, reply)
    }

    return new Response('Processed', { status: 200 })

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

async function processReplyNotifications(supabase: any, post: any, reply: any) {
  const postOwnerId = post.user_id
  const replyAuthorId = reply.user_id

  // Skip if reply author is post owner
  const isSelfReply = postOwnerId === replyAuthorId

  // Get post owner's email and preferences
  if (!isSelfReply) {
    const { data: ownerPrefs } = await supabase
      .from('user_email_preferences')
      .select('reply_notifications')
      .eq('user_id', postOwnerId)
      .single()

    if (ownerPrefs?.reply_notifications !== false) { // Default true
      await sendReplyNotification(supabase, post, reply, postOwnerId)
    }
  }

  // Send mention notifications
  const mentionedUserIds = reply.mentioned_user_ids || []
  for (const mentionedUserId of mentionedUserIds) {
    if (mentionedUserId !== replyAuthorId) { // Don't notify if self-mention
      const { data: mentionPrefs } = await supabase
        .from('user_email_preferences')
        .select('mention_notifications')
        .eq('user_id', mentionedUserId)
        .single()

      if (mentionPrefs?.mention_notifications !== false) { // Default true
        await sendMentionNotification(supabase, post, reply, mentionedUserId)
      }
    }
  }
}

async function sendReplyNotification(supabase: any, post: any, reply: any, recipientUserId: string) {
  // Get recipient's email
  const { data: user } = await supabase.auth.admin.getUserById(recipientUserId)
  if (!user?.email) return

  const subject = `New reply to "${post.title}"`
  const html = `
    <h2>New Reply in Forum</h2>
    <p><strong>${reply.user_full_name}</strong> replied to your post <strong>"${post.title}"</strong>:</p>
    <blockquote>${reply.content.length > 200 ? reply.content.substring(0, 200) + '...' : reply.content}</blockquote>
    <p><a href="${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/forum/${post.id}">View the full discussion</a></p>
    <p>You can manage your email preferences in your account settings.</p>
  `

  await callSendEmailFunction(user.email, subject, html)
}

async function sendMentionNotification(supabase: any, post: any, reply: any, recipientUserId: string) {
  // Get recipient's email
  const { data: user } = await supabase.auth.admin.getUserById(recipientUserId)
  if (!user?.email) return

  const subject = `You were mentioned in "${post.title}"`
  const html = `
    <h2>You were mentioned!</h2>
    <p><strong>${reply.user_full_name}</strong> mentioned you in their reply to <strong>"${post.title}"</strong>:</p>
    <blockquote>${reply.content.length > 200 ? reply.content.substring(0, 200) + '...' : reply.content}</blockquote>
    <p><a href="${Deno.env.get('SITE_URL') || 'http://localhost:3000'}/forum/${post.id}">View the discussion</a></p>
    <p>You can manage your email preferences in your account settings.</p>
  `

  await callSendEmailFunction(user.email, subject, html)
}

async function callSendEmailFunction(to: string, subject: string, html: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, subject, html }),
  })

  if (!response.ok) {
    console.error('Failed to send email:', await response.text())
  } else {
    console.log('Email sent successfully')
  }
}