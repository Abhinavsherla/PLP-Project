# Deployment Guide

> Deploy ModernPLP to Netlify, Vercel, or a self-hosted server.

---

## Option 1 — Netlify (Recommended)

### Prerequisites
- A [Netlify](https://netlify.com) account (free tier works)
- Your project pushed to a GitHub, GitLab, or Bitbucket repository

### Step-by-Step

1. **Push your code to GitHub**

   ```bash
   git init
   git add .
   git commit -m "feat: initial PLP project"
   git remote add origin https://github.com/your-username/modern-plp.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Select GitHub and authorise Netlify
   - Select your `modern-plp` repository

3. **Configure Build Settings**

   | Setting | Value |
   |---|---|
   | Build command | `npm run build` |
   | Publish directory | `.next` |
   | Node version | `18` |

4. **Environment Variables**
   - In Netlify Dashboard → **Site settings** → **Environment variables**
   - Add:
     - `NEXT_PUBLIC_API_URL` = `https://fakestoreapi.com`
     - `NEXT_PUBLIC_PRODUCTS_PER_PAGE` = `12`
     - `NEXT_PUBLIC_SITE_URL` = `https://your-site.netlify.app`

5. **Deploy**
   - Click **"Deploy site"**
   - Netlify will install dependencies, build, and deploy automatically
   - Your site will be live at `https://random-name.netlify.app`

6. **Custom Domain (Optional)**
   - Site settings → **Domain management** → Add custom domain
   - Update `NEXT_PUBLIC_SITE_URL` environment variable with your custom domain

### The `netlify.toml` file (already included)

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

The `@netlify/plugin-nextjs` plugin enables full SSR support including `getServerSideProps`.

---

## Option 2 — Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts. Vercel auto-detects Next.js projects.

4. Set environment variables in Vercel Dashboard → Project → Settings → Environment Variables.

> **Note:** Vercel natively supports Next.js SSR — no additional plugins needed.

---

## Option 3 — Self-Hosted (VPS / Server)

### Requirements
- Node.js ≥ 18
- PM2 (process manager)
- Nginx (reverse proxy)

### Steps

1. **Build on your server**
   ```bash
   npm install
   npm run build
   ```

2. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "modern-plp" -- start
   pm2 save
   pm2 startup
   ```

3. **Nginx reverse proxy** (`/etc/nginx/sites-available/modern-plp`):
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

4. **Enable HTTPS with Certbot**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## Environment Variables for Production

Always set in your deployment platform's dashboard — **never commit `.env.local`**.

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Product API base URL | `https://fakestoreapi.com` |
| `NEXT_PUBLIC_PRODUCTS_PER_PAGE` | Items per page | `12` |
| `NEXT_PUBLIC_SITE_URL` | Your production URL | `https://myshop.com` |

---

## Post-Deployment Checklist

- [ ] Site loads at production URL
- [ ] Products are fetched and displayed
- [ ] All filters, search, sort, pagination work
- [ ] Mobile layout looks correct
- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] `sitemap.xml` accessible at `/sitemap.xml`
- [ ] Google Search Console: submit sitemap
- [ ] Run Lighthouse audit (target 85+ performance)
- [ ] Verify Open Graph tags with [opengraph.xyz](https://opengraph.xyz)

---

## Troubleshooting Deployment

### `Module not found` during build

```bash
rm -rf .next node_modules
npm install
npm run build
```

### `getServerSideProps` returns empty products on Netlify

- Ensure `@netlify/plugin-nextjs` is listed in `netlify.toml`
- Check that the API URL environment variable is set in Netlify Dashboard

### Images not loading in production

- Verify `NEXT_PUBLIC_SITE_URL` is set to your actual deployment URL
- Check `next.config.js` → `images.domains` includes your API's image host
