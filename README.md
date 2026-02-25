# Small Town Big Stage 🎸

**Live Concert — May 30, 2026 at Vermilion Sailor Stadium**

Featuring: Cody McCarver • John Schneider • Mike Neff & Friends

Website: [www.smalltownbigstage.org](https://www.smalltownbigstage.org)

**Vercel:** Point domain www.smalltownbigstage.org to the project that deploys this repo with **Root Directory** = `frontend`.

---

## Architecture

| Component | Technology | Hosting |
|-----------|-----------|---------|
| Frontend | Next.js 14 (React) | Vercel |
| Backend API | Express.js + Stripe | Railway |
| Payments | Stripe Checkout | - |
| Domain | smalltownbigstage.org | Configured in Vercel |

## Ticket Types

| Tier | Price | Seats | Selection |
|------|-------|-------|-----------|
| On Stage | $325 | 20 | Pick individual seats (2 rows × 5, left & right of stage) |
| VIP | $125 | 828 | Pick individual seats (rows 1-12, 69/row) |
| GA Tier 1 | $85 | 828 | Quantity-based (first come, first serve) |
| GA Tier 2 | $65 | 5,190 | Quantity-based (first come, first serve) |
| Bleacher | $50 | 4,100 | Quantity-based (first come, first serve) |

**Add-On:** General Lee Photo Op — $40 (free with On Stage, $10 off with VIP)

## Setup & Deployment

### 1. GitHub Repository

```bash
cd smalltownbigstage
git init
git add .
git commit -m "Initial commit - Small Town Big Stage"
git remote add origin https://github.com/YOUR_USERNAME/smalltownbigstage.git
git push -u origin main
```

### 2. Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Set root directory to `backend`
3. Add environment variables:
   - `STRIPE_SECRET_KEY` = your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` = your Stripe webhook signing secret
   - `FRONTEND_URL` = `https://www.smalltownbigstage.org`
   - `PORT` = `3001`
4. Railway will auto-deploy on push

### 3. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → Import GitHub repo
2. Set root directory to `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway API URL (e.g. `https://smalltownbigstage-api-production.up.railway.app`)
4. Add custom domain: `www.smalltownbigstage.org`

### 4. Configure Stripe

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://YOUR_RAILWAY_URL/api/webhook`
3. Listen for events:
   - `checkout.session.completed`
   - `checkout.session.expired`
4. Copy the webhook signing secret to Railway env vars

### 5. Configure Domain (DNS)

Point your domain to Vercel:
- `www.smalltownbigstage.org` → CNAME to `cname.vercel-dns.com`
- `smalltownbigstage.org` → A record to `76.76.21.21`

## Local Development

```bash
# Backend
cd backend
cp .env.example .env  # Edit with your Stripe keys
npm install
npm start             # Runs on :3001

# Frontend (separate terminal)
cd frontend
cp .env.example .env.local  # Edit API URL
npm install
npm run dev            # Runs on :3000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/tickets` | All ticket/addon/sponsor info |
| GET | `/api/seats/onstage` | On-stage seat map with status |
| GET | `/api/seats/vip` | VIP seat map with status |
| GET | `/api/inventory` | GA/Bleacher remaining inventory |
| POST | `/api/checkout` | Create Stripe checkout session |
| POST | `/api/webhook` | Stripe webhook handler |
| POST | `/api/sponsor-inquiry` | Sponsor contact form |

## Important Notes

- **Seat Locking:** On Stage and VIP seats are held for 10 minutes during checkout. If payment isn't completed, seats are automatically released.
- **In-Memory Storage:** The current backend uses in-memory storage. For production, consider adding PostgreSQL or Redis for persistence across deploys.
- **Inventory:** GA and Bleacher tickets are quantity-based — no individual seat selection needed.

## Future Enhancements

- [ ] Add PostgreSQL database for persistent seat/inventory tracking
- [ ] Admin dashboard for managing sales
- [ ] Email confirmations with QR code tickets
- [ ] Sponsor inquiry form with email notifications
- [ ] Mobile ticket wallet integration
