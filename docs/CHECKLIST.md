# Launch Checklist

> Verify all requirements are met before submitting or going live.

---

## Development Setup

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts on http://localhost:3000
- [ ] Products load from the Fake Store API
- [ ] No JavaScript errors in browser console
- [ ] `.env.local` created from `.env.example`

---

## Core Features

### Search
- [ ] Search bar in header updates the product grid in real-time
- [ ] Debouncing: typing quickly doesn't freeze the UI
- [ ] Clear search button (✕) appears when search query is present
- [ ] Clearing search restores the full product list

### Filters
- [ ] Category radio buttons filter products by category
- [ ] Selecting "All Categories" shows all products
- [ ] Min/Max price fields filter correctly
- [ ] Price presets (Under $25, $25–$50, etc.) work
- [ ] Star rating filter shows only products with ≥ that rating
- [ ] In-stock filter hides out-of-stock products
- [ ] Active filter count shown in results text
- [ ] "Clear All Filters" resets every filter

### Sorting
- [ ] Featured (default) — composite score ordering
- [ ] Price: Low to High
- [ ] Price: High to Low
- [ ] Highest Rated
- [ ] Newest
- [ ] Sort works in combination with active filters

### Pagination
- [ ] 12 products shown per page
- [ ] "Showing 1–12 of 20 products — Page 1 of 2" text correct
- [ ] Next / Prev buttons work
- [ ] Page number buttons work
- [ ] Disabled state on Prev (page 1) and Next (last page)
- [ ] Page scrolls to top on page change

### Product Cards
- [ ] Product image loads (with skeleton shimmer while loading)
- [ ] Discount badge shows (e.g., "-20%")
- [ ] "Out of Stock" badge appears for out-of-stock items
- [ ] Wishlist heart button toggles on/off
- [ ] Star rating display is correct
- [ ] "Add to Cart" button shows "✓ Added!" feedback for 1.5s
- [ ] "Out of Stock" button is disabled (grayed out)

### Cart & Wishlist
- [ ] Cart badge count increments in header
- [ ] Wishlist badge count increments in header
- [ ] Clicking wishlist on an item already wishlisted removes it

### Empty State
- [ ] Filters that produce 0 results show the empty state
- [ ] "Clear All Filters" button in empty state works
- [ ] Empty state has a helpful description

---

## Design & UX

- [ ] Responsive: 4-column grid at ≥1200px desktop
- [ ] Responsive: 3-column grid at 1024–1199px
- [ ] Responsive: 2-column grid at 768–1023px (tablet)
- [ ] Responsive: 1-column grid at <768px (mobile)
- [ ] No horizontal scrolling on any screen size
- [ ] Hover effects on product cards (lift + shadow)
- [ ] Smooth transitions on all interactive elements
- [ ] Touch targets ≥ 44px for all buttons
- [ ] Footer newsletter form shows success message after submit

---

## SEO

- [ ] Page `<title>` is 50–60 characters
- [ ] `<meta name="description">` is present
- [ ] Canonical URL tag is present
- [ ] Open Graph tags are present
- [ ] Twitter Card tags are present
- [ ] JSON-LD `ItemList` is present in page source
- [ ] JSON-LD `CollectionPage` is present in page source
- [ ] Validate at https://validator.schema.org
- [ ] `robots.txt` accessible at `/robots.txt`
- [ ] `sitemap.xml` accessible at `/sitemap.xml`
- [ ] One `<h1>` per page ("Our Collection")

---

## Accessibility (WCAG 2.1 AA)

- [ ] All interactive elements have descriptive `aria-label`
- [ ] `role="banner"`, `role="main"`, `role="contentinfo"` present
- [ ] Keyboard navigation: Tab through all interactive elements
- [ ] Keyboard navigation: Enter activates buttons and links
- [ ] Keyboard navigation: Escape closes mobile menu
- [ ] Visible focus indicators on all focusable elements
- [ ] Skip to main content link (appears on first Tab press)
- [ ] All images have non-empty `alt` text
- [ ] Form labels are associated with inputs via `htmlFor`/`id`
- [ ] `aria-live` regions update for filter results and cart
- [ ] Color contrast ≥ 4.5:1 for normal text

---

## Performance

- [ ] Lighthouse Performance ≥ 85
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Lighthouse SEO ≥ 95
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] No unused dependencies in `node_modules`
- [ ] No `console.log` statements in production

---

## Code Quality

- [ ] All components use camelCase for JS and PascalCase for component names
- [ ] All CSS classes use kebab-case
- [ ] No hardcoded API URLs (all use environment variables)
- [ ] JSDoc comments on all exported functions
- [ ] PropTypes or JSDoc parameter documentation on all components
- [ ] No inline styles (CSS Modules used throughout)
- [ ] No Tailwind, Bootstrap, or CSS-in-JS
- [ ] `npm run lint` passes without errors

---

## Deployment

- [ ] `npm run build` succeeds locally
- [ ] `netlify.toml` is configured with correct build command
- [ ] Environment variables set in deployment platform
- [ ] Site deployed and accessible at production URL
- [ ] Custom domain configured (optional)
- [ ] HTTPS working (SSL certificate)

---

## Documentation

- [ ] README.md includes setup instructions
- [ ] QUICK_START.md is beginner-friendly
- [ ] All 10 docs files present in `docs/`
- [ ] Code comments explain non-obvious logic
