# Make smalltownbigstage.org show the site from your file (this repo)

Right now the domain shows a **different** site (simple headline + cookie banner).  
This repo has the **full** site from your tar.gz: "Small Town Big Stage", May 30 2026, Artists, Tickets, Seating Map, Sponsors.

**You only need to point the domain to the correct project in Vercel (one time):**

1. Go to **https://vercel.com/dashboard**
2. Find the project that is connected to **GitHub repo: buckeye7066/smalltownbigstage**.
   - If you don’t see it: **Add New → Project → Import** → select **buckeye7066/smalltownbigstage** → set **Root Directory** to **frontend** → Deploy.
3. Open that project → **Settings** → **Domains**.
4. Click **Add** and add: **www.smalltownbigstage.org** and **smalltownbigstage.org**.
5. If it says “Domain is already assigned”:
   - Open the **other** project that currently has the domain (the one showing the simple page).
   - In that project: **Settings → Domains** → **Remove** smalltownbigstage.org and www.smalltownbigstage.org.
   - Then in the **buckeye7066/smalltownbigstage** project again, **Add** both domains.

After that, the site at smalltownbigstage.org will be the one from your file (this repo). No code changes needed—the repo already has the right content.
