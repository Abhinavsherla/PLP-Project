# Quick Start Guide — 5 Minutes to Running

> Get ModernPLP up and running in under 5 minutes.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** ≥ 18.17.0 — [Download](https://nodejs.org)
- **npm** ≥ 9.0.0 (comes with Node.js)
- An internet connection (to fetch products from the API)

Check your versions:

```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show 9.x.x or higher
```

---

## Step 1 — Install Dependencies

```bash
npm install
```

This installs Next.js 14, React 18, and ESLint. Should take 30–60 seconds.

---

## Step 2 — Configure Environment

```bash
cp .env.example .env.local
```

The defaults work out of the box (uses Fake Store API). No changes needed for local development.

---

## Step 3 — Start the Dev Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 14.2.3
  - Local: http://localhost:3000
✓ Ready in 3.2s
```

---

## Step 4 — Open in Browser

Visit: **http://localhost:3000**

You'll see the product listing page with:
- 20 products loaded from the Fake Store API
- Working filters, search, sort, and pagination
- Responsive layout (try resizing the browser)

---

## Step 5 — Build for Production (optional)

```bash
npm run build
```

If the build succeeds without errors, your code is production-ready.

---

## Common Issues

### Port 3000 already in use

```bash
# Use a different port
npm run dev -- -p 3001
```

### "Cannot find module" error

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### API fetch fails

- Check your internet connection
- The Fake Store API may be temporarily down
- The UI shows a graceful error message in this case

### Images not loading

- Next.js image optimization requires the API domain to be in `next.config.js`
- The domain `fakestoreapi.com` is already configured

---

## Next Steps

- [README.md](../README.md) — Full project overview
- [DEPLOYMENT.md](DEPLOYMENT.md) — Deploy to Netlify
- [API_INTEGRATION.md](API_INTEGRATION.md) — Use your own API
