# Point www.smalltownbigstage.org to your site (GoDaddy)

The code is on GitHub. To have **www.smalltownbigstage.org** show the site:

1. **Deploy the site** (e.g. Vercel: import `https://github.com/buckeye7066/smalltownbigstage`, root directory = `frontend`).
2. In Vercel, add the domain **www.smalltownbigstage.org** (and optionally **smalltownbigstage.org**).
3. **In GoDaddy** (where you own smalltownbigstage.org):

   - Go to [godaddy.com](https://godaddy.com) → My Products → **DNS** for **smalltownbigstage.org**.

   Add or edit:

   | Type   | Name | Value / Target           | TTL  |
   |--------|------|---------------------------|------|
   | **A**  | `@`  | `76.76.21.21`            | 600  |
   | **CNAME** | `www` | `cname.vercel-dns.com` | 600  |

   (If Vercel shows different values when you add the domain, use what Vercel shows.)

4. Save. Wait 5–60 minutes for DNS to update. Vercel will show "Valid Configuration" when it’s correct.

**GitHub repo (already pushed):** https://github.com/buckeye7066/smalltownbigstage
