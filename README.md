# ReplyPilot

AI-written replies to customer reviews, sold as a $19/month subscription.

Stack: Next.js (hosted on Vercel), Supabase (email login + database), Stripe (subscriptions), Anthropic Claude Haiku 4.5 (reply writing).

## Setup in short
1. Run `supabase/schema.sql` in the Supabase SQL Editor.
2. Create a monthly recurring price in Stripe and a webhook to `/api/stripe-webhook` for:
   `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
3. Add every variable from `.env.example` to Vercel and deploy.
4. In Supabase > Authentication > URL Configuration, set the Site URL and add `https://YOURSITE/auth/callback` as a redirect URL.

The full step-by-step guide is in the "Launch Guide: Templates + ReplyPilot" doc.

## Where to change things
- Name, price label, free/pro limits, AI model: `lib/config.ts`
- The AI's instructions: `app/api/generate/route.ts`
- Landing page: `app/page.tsx`
- Terms & privacy text: `app/legal/page.tsx`

## Run locally (optional)
```
npm install
cp .env.example .env.local   # fill it in
npm run dev
```
