# Environment setup

## Local development

Edit the ignored `.env.local` file and replace these placeholders with values from Supabase **Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
NEXT_PUBLIC_USE_MOCK=false
```

Use the publishable/anon key only. Never put `service_role` in a `NEXT_PUBLIC_*` variable or in browser code.

Restart `npm run dev` after changing environment variables.

## Vercel

Create these Production environment variables in Vercel:

```text
NEXT_PUBLIC_APP_NAME
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_WHATSAPP_URL
NEXT_PUBLIC_LINKEDIN_URL
```

After saving them, redeploy. Keep `.env.local` and any file containing real keys out of Git.
