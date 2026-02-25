# Get www.smalltownbigstage.org Live (GoDaddy domain)

Follow these steps in order. The site will be live at **www.smalltownbigstage.org** when done.

**Repo:** https://github.com/buckeye7066/smalltownbigstage

---

## Step 1: Deploy backend (Railway)

1. Go to **[railway.app](https://railway.app)** → Sign in (e.g. with GitHub).
2. **New Project** → **Deploy from GitHub repo** → choose **buckeye7066/smalltownbigstage**.
3. After the repo is added, open the service → **Settings** (or **Variables**).
4. Set **Root Directory** to `backend` (or set the start command so it runs from `backend`).  
   If Railway created one service from the repo, set **Root Directory** = `backend`.
5. Add **Variables** (Environment Variables):
   - `FRONTEND_URL` = `https://www.smalltownbigstage.org`
   - `PORT` = `3001`
   - `STRIPE_SECRET_KEY` = your Stripe secret key (from [dashboard.stripe.com](https://dashboard.stripe.com/apikeys))
   - `STRIPE_WEBHOOK_SECRET` = leave empty for now (you’ll add after Step 3).
6. **Deploy** (or let it auto-deploy). Wait until it’s running.
7. Copy the **public URL** (e.g. `https://smalltownbigstage-production.up.railway.app`). You need it for the frontend and Stripe.

---

## Step 2: Deploy frontend (Vercel)

1. Go to **[vercel.com](https://vercel.com)** → Sign in (e.g. with GitHub).
2. **Add New** → **Project** → **Import** → **buckeye7066/smalltownbigstage**.
3. Before deploying, set:
   - **Root Directory:** click **Edit** and set to `frontend`.
   - **Environment Variable:**  
     Name: `NEXT_PUBLIC_API_URL`  
     Value: the Railway URL from Step 1 (e.g. `https://smalltownbigstage-production.up.railway.app`).
4. Click **Deploy**. Wait until the build finishes.
5. After deploy: **Project Settings** → **Domains** → **Add**:
   - `www.smalltownbigstage.org`
   - `smalltownbigstage.org` (optional)
6. Vercel will show DNS instructions (e.g. CNAME `www` → `cname.vercel-dns.com`). Use those for Step 3.

---

## Step 3: Point GoDaddy DNS to the site

1. Go to **[godaddy.com](https://godaddy.com)** → **My Products** → find **smalltownbigstage.org** → **DNS** (or **Manage DNS**).
2. Add or edit records so the domain points to Vercel:

   | Type   | Name | Value / Target             | TTL  |
   |--------|------|-----------------------------|------|
   | **A**  | `@`  | `76.76.21.21`              | 600  |
   | **CNAME** | `www` | `cname.vercel-dns.com`   | 600  |

   If Vercel shows different values when you added the domain, use what Vercel shows.
3. Remove or stop any other A or CNAME records that point the domain somewhere else.
4. **Save**. DNS can take 5–60 minutes. In Vercel → Domains, the domain will show **Valid Configuration** when it’s correct.

---

## Step 4: Stripe webhook (so payments work)

1. In **[Stripe Dashboard](https://dashboard.stripe.com)** → **Developers** → **Webhooks** → **Add endpoint**.
2. **Endpoint URL:** `https://YOUR_RAILWAY_URL/api/webhook` (use the same Railway URL from Step 1).
3. **Events to send:** `checkout.session.completed`, `checkout.session.expired`.
4. Create the endpoint and copy the **Signing secret** (starts with `whsec_`).
5. In **Railway** → your service → **Variables** → add (or edit):
   - `STRIPE_WEBHOOK_SECRET` = that signing secret.
6. Redeploy the backend in Railway if needed so it picks up the new variable.

---

## Done

- **Site URL:** https://www.smalltownbigstage.org  
- **GitHub:** https://github.com/buckeye7066/smalltownbigstage  
- Domain is on GoDaddy; the site is served by Vercel (frontend) and Railway (backend).
