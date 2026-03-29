# File Structure Reference

> Complete reference guide for every file in the ModernPLP project.

---

## Root Directory

```
PLP-Project/
├── package.json          ← npm configuration, scripts, and dependencies
├── next.config.js        ← Next.js configuration (image domains, headers, env)
├── netlify.toml          ← Netlify build settings and redirect rules
├── .env.example          ← Template for environment variables
├── .gitignore            ← Files excluded from Git version control
└── README.md             ← Project overview and quick reference
```

---

## `pages/` — Next.js Page Routes

```
pages/
├── _document.js
│   Purpose: Custom HTML document shell
│   Contents: Google Fonts links, JSON-LD CollectionPage schema, skip link
│   Rendered: Server-side only, once per request
│
├── _app.js
│   Purpose: Global app wrapper
│   Contents: ShopProvider (cart + wishlist React Context), global CSS import
│   Key export: useShop() hook — accessible from any component
│
└── index.js
    Purpose: Main Product Listing Page (SSR)
    Contents: getServerSideProps, filter/sort/paginate state, SEO <Head>
    Exports: default (page component) + getServerSideProps
```

---

## `components/` — React Components

```
components/
├── Header.js
│   Features: Logo, nav links, search bar (debounced), action buttons
│   Props: searchQuery (string), onSearchChange (function)
│   State: isScrolled, isMobileMenuOpen, isSearchFocused
│   Accessibility: role="banner", aria-expanded on mobile menu
│
├── Filters.js
│   Features: Collapsible sections (accordion), category radio,
│             price range + presets, star rating selector, stock toggle
│   Props: categories, filters, hasActiveFilters, onFilterChange,
│          onClearFilters, totalResults
│   Sub-components: FilterSection, StarRatingSelector
│
├── ProductCard.js
│   Features: Lazy-loaded Next.js Image, skeleton loader, discount badge,
│             out of stock badge, wishlist toggle, star rating, "Added!" feedback
│   Props: product (Product type)
│   Optimization: React.memo — only re-renders if product prop changes
│
├── ProductGrid.js
│   Features: Sort dropdown, responsive CSS Grid, empty state,
│             Pagination sub-component with getPageNumbers()
│   Props: products, allProductCount, sortBy, currentPage, totalPages,
│          startIndex, endIndex, hasActiveFilters, onSortChange,
│          onPageChange, onClearFilters
│   Sub-components: EmptyState, Pagination (React.memo)
│
└── Footer.js
    Features: Newsletter form (with validation + success state),
              4-column navigation, social links, copyright
    Sub-components: NewsletterForm (controlled form with async submit)
```

---

## `styles/` — CSS Modules

```
styles/
├── globals.css
│   Type: Global stylesheet (imported in _app.js)
│   Contents:
│     - CSS Custom Properties (design tokens)
│     - CSS reset and base styles
│     - Typography (h1-h6, links, form elements)
│     - Layout utilities (.container, .sr-only, .skip-link)
│     - Animation @keyframes (fadeIn, shimmer, spin, heartBeat, etc.)
│     - Scrollbar styles, selection colors
│     - Print styles
│     - prefers-reduced-motion support
│
├── Header.module.css       ← Sticky dark glass header, search, badges
├── Filters.module.css      ← Accordion, custom radio/checkbox, price inputs
├── ProductCard.module.css  ← Card hover, image skeleton, wishlist animation
├── ProductGrid.module.css  ← Responsive grid, empty state, pagination buttons
├── Footer.module.css       ← Dark footer, newsletter form, social links
│
└── pages/
    └── index.module.css    ← Page layout: hero section, sidebar + grid layout
```

---

## `lib/` — Library Utilities

```
lib/
├── api.js
│   Exports:
│     - fetchProducts()     ← Fetches all products (used in getServerSideProps)
│     - fetchProductById()  ← Fetches a single product by ID
│     - fetchCategories()   ← Fetches category list
│   Internal:
│     - fetchWithTimeout()  ← Wraps fetch with AbortController timeout
│     - normalizeProduct()  ← Maps raw API fields to internal Product shape
│
└── utils.js
    Exports:
      - formatPrice(price, currency, locale)
      - formatRating(rating)
      - truncateText(text, maxLength)
      - formatCategoryLabel(category)
      - debounce(fn, delay)            ← Returns function with .cancel() method
      - filterProducts(products, filters)
      - sortProducts(products, sortBy)
      - paginate(items, page, perPage)
      - getPageNumbers(current, total)
      - scrollToTop()
      - clamp(value, min, max)
      - formatCount(count)             ← "1.2K" for counts >= 1000
      - generateId()
```

---

## `public/` — Static Assets

```
public/
├── robots.txt     ← Search engine crawling rules
└── sitemap.xml    ← XML sitemap for SEO
```

---

## `docs/` — Documentation

```
docs/
├── QUICK_START.md       ← 5-minute setup guide
├── PROJECT_SUMMARY.md   ← Architecture and tech decisions
├── FILE_STRUCTURE.md    ← This file
├── DEPLOYMENT.md        ← Netlify, Vercel, and self-hosted deployment
├── API_INTEGRATION.md   ← How to replace with a custom API
├── SEO_GUIDE.md         ← SEO optimization strategies
├── PERFORMANCE.md       ← Performance techniques used
├── CHECKLIST.md         ← Launch readiness checklist
└── INDEX.md             ← Master navigation guide
```

---

## Configuration Files in Detail

### `package.json`
```json
{
  "scripts": {
    "dev":    "next dev",
    "build":  "next build",
    "start":  "next start",
    "lint":   "next lint",
    "export": "next build && next export"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```

### `next.config.js` key settings
- `images.domains` — `['fakestoreapi.com']` for Next.js image optimization
- `compiler.removeConsole` — removes all `console.*` calls in production
- `async headers()` — security headers on all routes

### `netlify.toml` key settings
- `[build] command = "npm run build"` — build command
- `publish = ".next"` — Next.js output directory
- `[[plugins]] package = "@netlify/plugin-nextjs"` — SSR support on Netlify
