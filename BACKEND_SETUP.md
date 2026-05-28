# Backend Setup Guide — hardduckmarket.xyz

## What Was Built

Your Next.js store now has a full backend:

- **Cart** — live item count in header, persistent across page refreshes (localStorage)
- **Accounts** — register, login, logout, session cookies
- **Checkout** — Stripe (card) + Coinbase Commerce (crypto), email required
- **Orders** — saved to SQLite database, shown in account page
- **Email** — order confirmation + product delivery via Resend
- **Webhooks** — Stripe and Coinbase both confirm payments server-side

---

## Step 1 — Install the new packages

```bash
cd your-project-folder
npm install prisma @prisma/client bcryptjs @types/bcryptjs stripe resend
```

---

## Step 2 — Set up your environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in each value. See below for where to get them.

---

## Step 3 — Set up the database

Run this once to create your SQLite database:

```bash
npx prisma generate
npx prisma db push
```

This creates a `dev.db` file in your project — it stores all users and orders.

---

## Step 4 — Where to get your API keys

### Stripe (card payments)
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret key** → `STRIPE_SECRET_KEY`
3. Copy your **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Go to https://dashboard.stripe.com/webhooks → **Add endpoint**
   - URL: `https://hardduckmarket.xyz/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### Coinbase Commerce (crypto)
1. Go to https://beta.commerce.coinbase.com
2. Settings → Security → **Create API key** → `COINBASE_COMMERCE_API_KEY`
3. Settings → Webhook subscriptions → Add webhook:
   - URL: `https://hardduckmarket.xyz/api/webhooks/coinbase`
   - Copy the shared secret → `COINBASE_COMMERCE_WEBHOOK_SECRET`

### Resend (email)
1. Sign up free at https://resend.com (3,000 emails/month free)
2. Add your domain `hardduckmarket.xyz` and follow the DNS instructions
3. API Keys → **Create API key** → `RESEND_API_KEY`

---

## Step 5 — Test locally

```bash
npm run dev
```

For Stripe webhooks locally, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
This gives you a local `STRIPE_WEBHOOK_SECRET` for testing.

---

## Sending the actual product in the email

Open `lib/email.ts` — find this comment near the bottom:

```ts
// productContent: "Your license key: XXXX-XXXX-XXXX-XXXX",
```

Uncomment it and put whatever you want to deliver — a key, a download link, instructions, etc.

You can also look up the product in the webhook handler (`app/api/webhooks/stripe/route.ts`) and send different content per product.

---

## File structure of everything added

```
prisma/
  schema.prisma          ← database models

lib/
  prisma.ts              ← database client
  auth.ts                ← session helpers
  email.ts               ← email sending

context/
  cart-context.tsx       ← global cart state
  auth-context.tsx       ← global user state

app/
  layout.tsx             ← updated: wraps providers
  login/page.tsx
  register/page.tsx
  account/page.tsx
  cart/page.tsx
  checkout/page.tsx
  checkout/payment/page.tsx   ← Stripe card form
  order-success/page.tsx

  api/
    auth/login/route.ts
    auth/register/route.ts
    auth/logout/route.ts
    auth/me/route.ts
    checkout/stripe/route.ts
    checkout/crypto/route.ts
    webhooks/stripe/route.ts
    webhooks/coinbase/route.ts
    orders/route.ts

components/
  header.tsx             ← updated: live cart count, user menu
```

---

## When you're ready for production

- Make sure `NEXT_PUBLIC_BASE_URL` is your live domain
- Switch Stripe from **Test mode** to **Live mode** (different API keys)
- Run `npx prisma db push` on your server if it's a fresh deploy
- On Vercel: add all `.env.local` values as Environment Variables in the dashboard
