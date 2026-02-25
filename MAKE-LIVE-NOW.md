# Make www.smalltownbigstage.org live now (Stripe later)

**Easiest: run the script** (on your PC, in PowerShell):

1. Install CLIs once: `npm install -g @railway/cli vercel`
2. Double-click or run: `powershell -ExecutionPolicy Bypass -File deploy-live.ps1`
3. When it opens your browser, log in to Railway (and Vercel if asked). Then run the script again.
4. When it asks for your Railway URL, get it from [railway.app](https://railway.app) dashboard → your project → Settings → Domains (or Deployments).
5. After deploy, do the GoDaddy DNS step below (one time).

**Stripe:** add your Stripe keys later in Railway → Variables.

---

## 1. Backend (Railway)

1. **[railway.app](https://railway.app)** → Sign in with GitHub.
2. **New Project** → **Deploy from GitHub repo** → **buckeye7066/smalltownbigstage**.
3. Open the new service → **Settings** → **Root Directory** = `backend`.
4. **Variables** → Add these (you can leave Stripe empty for now):

   | Name | Value |
   |------|--------|
   | `FRONTEND_URL` | `https://www.smalltownbigstage.org` |
   | `PORT` | `3001` |
   | `STRIPE_SECRET_KEY` | *(leave empty or `sk_live_placeholder` until you have it)* |
   | `STRIPE_WEBHOOK_SECRET` | *(leave empty until you add Stripe)* |

5. Deploy. When it’s running, copy the **public URL** (e.g. `https://….up.railway.app`).

---

## 2. Frontend (Vercel)

1. **[vercel.com](https://vercel.com)** → Sign in with GitHub.
2. **Add New** → **Project** → **Import** → **buckeye7066/smalltownbigstage**.
3. Before **Deploy**:
   - **Root Directory:** Edit → set `frontend`.
   - **Environment Variable:** `NEXT_PUBLIC_API_URL` = *(paste the Railway URL from step 1)*.
4. **Deploy**. Wait for the build to finish.
5. **Settings** → **Domains** → Add: `www.smalltownbigstage.org` and (optional) `smalltownbigstage.org`.

---

## 3. GoDaddy DNS

1. **[godaddy.com](https://godaddy.com)** → **My Products** → **smalltownbigstage.org** → **DNS**.
2. Set these (change or remove any conflicting A/CNAME for this domain):

   | Type | Name | Value | TTL |
   |------|------|--------|-----|
   | **A** | `@` | `76.76.21.21` | 600 |
   | **CNAME** | `www` | `cname.vercel-dns.com` | 600 |

3. Save. Wait 5–60 min. In Vercel → Domains, it will show **Valid** when done.

---

## 4. Later: add Stripe

When you have your Stripe link/keys:

1. **Railway** → your service → **Variables**: set `STRIPE_SECRET_KEY` (and optionally `STRIPE_WEBHOOK_SECRET`).
2. **Stripe Dashboard** → Webhooks → Add endpoint: `https://YOUR_RAILWAY_URL/api/webhook`; copy the signing secret into `STRIPE_WEBHOOK_SECRET` in Railway.
3. Redeploy the backend in Railway if needed.

Site will be live at **https://www.smalltownbigstage.org** after steps 1–3.
