# ModernPLP — Production-Ready Product Listing Page

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org)
[![CSS Modules](https://img.shields.io/badge/Styling-CSS_Modules-orange)](https://github.com/css-modules/css-modules)
[![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7)](https://netlify.com)

> A production-grade, SEO-optimised Product Listing Page (PLP) built with **Next.js 14** and **pure CSS Modules** — zero CSS frameworks, zero unnecessary dependencies.

---

## Live Demo

🔗 [https://modern-plp.netlify.app](https://modern-plp.netlify.app)

---

## Features at a Glance

| Feature | Implementation |
|---|---|
| **SSR / SEO** | `getServerSideProps` — fully server-rendered HTML |
| **Search** | Real-time with 300ms debounce |
| **Filters** | Category, price range, star rating, stock status |
| **Sorting** | Featured, price, rating, newest |
| **Pagination** | 12 products/page with smart page numbers |
| **Responsive** | 4 → 3 → 2 → 1 column breakpoints |
| **Wishlist** | Toggle with heart icon and badge count |
| **Cart** | Add to Cart with ✓ Added feedback |
| **Accessibility** | WCAG 2.1 AA, ARIA, keyboard navigation |
| **Performance** | Lazy images, memoized derivations, debounce |

---

## Tech Stack

- **Framework:** Next.js 14.2.3
- **UI Library:** React 18.3.1
- **Styling:** CSS Modules (pure vanilla CSS, no frameworks)
- **Data:** Fake Store API (`https://fakestoreapi.com/products`)
- **Fonts:** Crimson Text (display) + Sora (body) via Google Fonts
- **Deployment:** Netlify with `@netlify/plugin-nextjs`
- **Package Manager:** npm

---

## Quick Start

```bash
# 1. Clone or unzip the project
cd PLP-Project

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local

# 4. Start the development server
npm run dev

# 5. Open http://localhost:3000
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
PLP-Project/
├── pages/
│   ├── index.js          ← Main PLP (SSR with getServerSideProps)
│   ├── _app.js           ← Global app + Cart/Wishlist context
│   └── _document.js      ← HTML shell, Google Fonts, JSON-LD
├── components/
│   ├── Header.js         ← Sticky nav with search & action buttons
│   ├── Filters.js        ← Sidebar: category, price, rating filters
│   ├── ProductCard.js    ← Individual product card
│   ├── ProductGrid.js    ← Grid with sort bar and pagination
│   └── Footer.js         ← Newsletter, nav columns, social
├── styles/
│   ├── globals.css       ← Design system (CSS variables, reset, animations)
│   ├── Header.module.css
│   ├── Filters.module.css
│   ├── ProductCard.module.css
│   ├── ProductGrid.module.css
│   ├── Footer.module.css
│   └── pages/
│       └── index.module.css
├── lib/
│   ├── api.js            ← Fetch layer with timeout & normalization
│   └── utils.js          ← Filtering, sorting, pagination, formatting
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── docs/                 ← 10 comprehensive documentation files
├── next.config.js
├── netlify.toml
├── .env.example
└── .gitignore
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://fakestoreapi.com
NEXT_PUBLIC_PRODUCTS_PER_PAGE=12
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

To use a custom API, change `NEXT_PUBLIC_API_URL` and update `lib/api.js` → `normalizeProduct()`.

---

## Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| Primary | `#112759` (deep navy) | Buttons, links, header |
| Accent | `#d4a017` (warm gold) | Badges, CTAs, highlights |
| Neutral | `#f9f9fb` → `#0f1120` | Background scale |

### Typography

| Font | Weight | Usage |
|---|---|---|
| Crimson Text | 400–700 | Headings, display text |
| Sora | 300–800 | Body, UI elements |

### Breakpoints

| Breakpoint | Grid Columns |
|---|---|
| ≥ 1200px | 4 columns |
| 1024–1199px | 3 columns |
| 768–1023px | 2 columns |
| < 768px | 1 column |

---

## SEO

- ✅ `<title>` and `<meta description>` optimised
- ✅ Open Graph and Twitter Card tags
- ✅ Canonical URL
- ✅ JSON-LD: `CollectionPage` + `ItemList` + `Product` + `AggregateRating`
- ✅ `robots.txt` and `sitemap.xml`
- ✅ Semantic HTML (`<header>`, `<main>`, `<aside>`, `<nav>`, `<footer>`, `<article>`)
- ✅ Proper heading hierarchy (one `<h1>` per page)

---

## Accessibility (WCAG 2.1 AA)

- ✅ ARIA roles and labels on all interactive elements
- ✅ Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- ✅ Visible focus indicators
- ✅ Screen reader skip link (`Skip to main content`)
- ✅ `aria-live` regions for dynamic filter results and cart
- ✅ Color contrast ≥ 4.5:1 for all text
- ✅ Images have descriptive `alt` attributes

---

## Performance

- Image lazy loading via Next.js `<Image>` component
- `useMemo` for expensive filter/sort/paginate derivations
- `React.memo` on `ProductCard` to prevent unnecessary re-renders
- 300ms debounced search to limit filter triggering
- `debounce.cancel()` cleanup on component unmount
- `removeConsole` in production builds
- Cache-Control headers: `s-maxage=60, stale-while-revalidate=300`

---

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for the complete Netlify deployment guide.

**Quick Deploy:**
1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Node version: 18
5. Done!

---

## Custom API Integration

See [API_INTEGRATION.md](docs/API_INTEGRATION.md) for step-by-step instructions.

**TL;DR:** Update `NEXT_PUBLIC_API_URL` in `.env.local` and update `normalizeProduct()` in `lib/api.js` to map your API's field names.

---

## License

MIT © ModernPLP
