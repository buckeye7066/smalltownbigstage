# The domain is showing a different site (not this repo)

**What you see now:** A simple page: "Axiom Biolabs Present...", "Join us for an unforgettable night of music!", phone number.

**What should show:** The full site from this repo — Small Town Big Stage nav, May 30 2026, Cody McCarver • John Schneider • Mike Neff & Friends, Artists section, Tickets with seat selection, Seating Map, Sponsors.

**Cause:** In Vercel, **www.smalltownbigstage.org** is assigned to a different project (the simple page), not to the project that deploys **this** repo.

**Fix (in Vercel):**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard).
2. Find the project that deploys from **buckeye7066/smalltownbigstage** (this repo).  
   If you don’t see it, use **Add New → Project → Import** and connect **buckeye7066/smalltownbigstage**. Set **Root Directory** to **frontend**.
3. Open that project → **Settings → Domains**.
4. **Add** **www.smalltownbigstage.org** and (optional) **smalltownbigstage.org**.
5. If Vercel says the domain is already used by another project, open **that** project → **Settings → Domains** and **remove** www.smalltownbigstage.org (and smalltownbigstage.org) from it. Then add the domain again in the project from step 2.

After that, the full concert site from this repo will be what people see at www.smalltownbigstage.org.
