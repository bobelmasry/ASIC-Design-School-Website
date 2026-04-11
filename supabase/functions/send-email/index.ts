import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

console.log("Send email function loaded")

interface EmailRequest {
  to: string
  subject: string
  html: string
  from?: string
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { to, subject, html, from }: EmailRequest = await req.json()

    if (!to || !subject || !html) {
      return new Response('Missing required fields: to, subject, html', { status: 400 })
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not set')
      return new Response('Server configuration error', { status: 500 })
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || 'noreply@asic-design-school.com', // Use your domain
        to: [to],
        subject,
        html,
      }),
    })

    if (!resendResponse.ok) {
      const error = await resendResponse.text()
      console.error('Resend API error:', error)
      return new Response('Failed to send email', { status: 500 })
    }

    const result = await resendResponse.json()
    console.log('Email sent successfully:', result.id)

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response('Internal server error', { status: 500 })
  }
})