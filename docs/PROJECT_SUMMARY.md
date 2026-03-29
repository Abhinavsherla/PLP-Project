# Project Summary — Architecture & Technology Stack

## Overview

ModernPLP is a production-ready **Product Listing Page (PLP)** that demonstrates advanced
frontend development with Next.js 14, React 18, and pure CSS Modules.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / CDN                            │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP Request
┌────────────────────────────▼────────────────────────────────────┐
│                    Next.js 14 Server (SSR)                       │
│                                                                  │
│  getServerSideProps()                                            │
│    └── lib/api.js → fetchProducts()                              │
│          └── fetch("https://fakestoreapi.com/products")          │
│                │                                                 │
│      normalizeProduct()  ← maps API fields to internal shape     │
│                │                                                 │
│  React Component Tree:                                           │
│    <_document.js>  ← HTML shell, Google Fonts, JSON-LD           │
│    <_app.js>       ← ShopProvider (cart + wishlist state)         │
│    <index.js>      ← Page state: filters, sort, page             │
│      ├── <Header>  ← sticky nav, search input                    │
│      ├── <Filters> ← category, price, rating, stock              │
│      ├── <ProductGrid>                                           │
│      │     ├── <ProductCard> × N  (React.memo)                   │
│      │     └── <Pagination>                                      │
│      └── <Footer>  ← newsletter, nav, social                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

1. **Server** calls `fetchProducts()` on every request
2. Raw API data is **normalized** to a consistent `Product` shape
3. Products are passed as **props** to the page component (SSR)
4. Client-side **state** manages: search query, filters, sort key, current page
5. `useMemo` derives `filteredProducts` → `sortedProducts` → `pageItems`
6. Only the current page's products are rendered as `<ProductCard>` components

---

## State Management

No external state library is used. State is organized in two layers:

| Layer | What it manages | Where |
|---|---|---|
| **ShopContext** (React Context) | Cart items, wishlist IDs, recently-added set | `_app.js` |
| **Page state** (React useState) | Search query, active filters, sort key, current page | `index.js` |

Custom hook `useShop()` exposes the context to any component.

---

## Technology Decisions

### Why Next.js 14 with SSR?

- All product HTML is server-rendered → crawlable by search engines without JavaScript
- `getServerSideProps` ensures content is always fresh (no stale cache issues)
- `Cache-Control: s-maxage=60` lets CDNs cache responses for 60 seconds

### Why Pure CSS Modules?

- **Zero runtime cost** — no CSS-in-JS JavaScript overhead
- **Guaranteed scoping** — CSS class names are hashed at build time
- **CSS variables** provide a shared design system across modules
- **Smaller bundle** — no framework CSS to download

### Why No Global State Library?

- React Context + `useMemo` is sufficient for this use case (one page, mock cart)
- Avoids Redux/Zustand boilerplate for a project of this scope
- `useCallback` + `React.memo` prevent unnecessary re-renders

---

## Component Responsibilities

| Component | Responsibility |
|---|---|
| `Header` | Logo, nav, search (controlled), cart/wishlist badge buttons |
| `Filters` | All filter state inputs; emits `onFilterChange` callbacks |
| `ProductCard` | Display one product; reads from `useShop` for cart/wishlist |
| `ProductGrid` | Sort dropdown, responsive grid, empty state, pagination |
| `Footer` | Newsletter form, nav columns, social links, copyright |

---

## Utility Functions (`lib/utils.js`)

| Function | Purpose |
|---|---|
| `filterProducts()` | Applies search, category, price, rating, stock filters |
| `sortProducts()` | Sorts by featured/price/rating/newest |
| `paginate()` | Slices array for current page |
| `getPageNumbers()` | Generates pagination buttons with ellipsis |
| `debounce()` | Returns debounced function with `.cancel()` |
| `formatPrice()` | Formats number as `$XX.XX` using `Intl.NumberFormat` |
| `generateStars()` | Returns array of `'full' \| 'half' \| 'empty'` for rating display |
| `scrollToTop()` | Smooth scrolls to top on page change |

---

## Key Patterns Used

- **React.memo** — `ProductCard` and `Pagination` skip re-renders when props haven't changed
- **useMemo** — filter/sort/paginate chains are only recalculated when dependencies change
- **useCallback** — event handlers are stable references, preventing child re-renders
- **useRef** — stores debounce function across renders without triggering effects
- **Compound hooks** — `useShop()` hides context implementation details
- **JSDoc** — all exported functions and components are documented
