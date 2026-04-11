# Email Notifications Setup

This directory contains Supabase Edge Functions and database migrations for implementing email notifications in the ASIC Design School forum.

## Setup Instructions

### 1. Apply Database Migration

Run the migration to create the `user_email_preferences` table:

```bash
npx supabase db push
```

Or apply manually in the Supabase Dashboard SQL Editor.

### 2. Deploy Edge Functions

Deploy the Edge Functions to your Supabase project:

```bash
npx supabase functions deploy send-email
npx supabase functions deploy forum-notifications
npx supabase functions deploy daily-digest
```

### 3. Set Environment Variables

In Supabase Dashboard → Project Settings → Edge Functions:

- `RESEND_API_KEY`: Your Resend API key
- `SITE_URL`: Your site's URL (e.g., https://your-domain.com)

### 4. Create Database Webhook

In Supabase Dashboard → Database → Webhooks:

- Name: `forum-reply-notifications`
- Table: `posts`
- Events: `UPDATE`
- Type: `Edge Function`
- Function: `forum-notifications`
- HTTP Headers: (leave default)

### 5. Create Cron Job for Daily Digest

In Supabase Dashboard → Database → Cron:

- Name: `daily-forum-digest`
- Schedule: `0 9 * * *` (daily at 9 AM)
- Command: Select "Edge Function" and choose `daily-digest`

### 6. Configure Resend

- Sign up at [resend.com](https://resend.com)
- Add your domain (or use their shared domain for testing)
- Update the `from` address in `send-email/index.ts` if needed

### 7. Test

- Create a test post and reply to it
- Check email delivery
- Verify user preferences work

## Features Implemented

- **Reply Notifications**: Email sent to post owner when someone replies (unless disabled in preferences)
- **Mention Notifications**: Email sent to users when they are @mentioned in replies (unless disabled)
- **Daily Digest**: Daily email with forum activity summary (opt-in via preferences)

Users can manage their preferences in the `user_email_preferences` table. Defaults are all enabled.