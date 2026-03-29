# Performance Optimization Guide

> Techniques used in ModernPLP to achieve 85+ Lighthouse scores.

---

## Implemented Optimizations

### 1. Server-Side Rendering (SSR)

```js
export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  );
  const { products } = await fetchProducts();
  return { props: { products } };
}
```

**Impact:** The CDN serves cached HTML for 60 seconds. After that, Next.js re-fetches in the background while users still see the cached version (stale-while-revalidate).

---

### 2. Next.js Image Optimization

```jsx
<Image
  src={product.image}
  alt={product.title}
  fill
  sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, 25vw"
  loading="lazy"
  style={{ objectFit: 'contain' }}
/>
```

**Benefits:**
- Converts images to WebP/AVIF automatically
- Serves appropriately sized images based on `sizes` attribute
- Lazy loads images below the fold
- Prevents layout shift with fixed aspect ratios

---

### 3. React.memo on Expensive Components

```js
// ProductCard.js
const ProductCard = memo(function ProductCard({ product }) { ... });

// Pagination.js (inside ProductGrid.js)
const Pagination = memo(function Pagination({ currentPage, totalPages, onPageChange }) { ... });
```

**Impact:** When filter state changes (re-renders parent), product cards that haven't changed props skip re-rendering.

---

### 4. useMemo for Derived Data

```js
// index.js
const filteredProducts = useMemo(
  () => filterProducts(products, activeFilters),
  [products, activeFilters]
);

const sortedProducts = useMemo(
  () => sortProducts(filteredProducts, sortBy),
  [filteredProducts, sortBy]
);
```

**Impact:** Filtering and sorting (O(n log n) operations) only run when their dependencies change — not on every render.

---

### 5. Debounced Search

```js
const debouncedSetSearch = useRef(
  debounce((value) => {
    setDebouncedSearch(value);
    setCurrentPage(1);
  }, 300)
).current;
```

**Impact:** Filter computation runs at most once per 300ms while the user is typing, instead of on every keystroke.

---

### 6. useCallback for Stable Event Handlers

```js
const handleAddToCart = useCallback(() => {
  addToCart(product);
}, [addToCart, product]);
```

**Impact:** Stable function references prevent React.memo'd children from re-rendering.

---

### 7. Production Console Removal

```js
// next.config.js
compiler: {
  removeConsole: process.env.NODE_ENV === 'production',
}
```

**Impact:** Zero `console.*` calls shipped to production — slightly smaller bundle.

---

### 8. Security Headers (No Render Blocking)

Security headers are set server-side and don't affect render performance.

---

### 9. Image Skeleton Loader

```jsx
<div className={`${styles.imageSkeleton} ${imageLoaded ? styles.imageLoaded : ''}`}>
  <Image onLoad={() => setImageLoaded(true)} />
</div>
```

**Impact:** Prevents blank white boxes — a shimmer CSS animation shows while images load. Reduces perceived loading time.

---

### 10. CSS Modules (Zero Runtime Cost)

Unlike CSS-in-JS (styled-components, emotion), CSS Modules have:
- No JavaScript overhead at runtime
- Styles are statically extracted to `.css` files at build time
- No hydration mismatch issues

---

## Further Optimizations to Consider

### ISR (Incremental Static Regeneration)

Replace `getServerSideProps` with `getStaticProps` + `revalidate`:

```js
export async function getStaticProps() {
  const { products } = await fetchProducts();
  return {
    props: { products },
    revalidate: 300, // Rebuild page every 5 minutes
  };
}
```

**Trade-off:** Faster page loads (static HTML) but products may be up to 5 minutes stale.

### React Server Components (Next.js 13+ App Router)

The App Router allows server components that can fetch data without `getServerSideProps`:

```jsx
// app/page.js (App Router)
export default async function Page() {
  const { products } = await fetchProducts();
  return <ProductGrid products={products} />;
}
```

### Virtual Scrolling for Large Catalogs

For 500+ products, use a virtual list library to only render visible items:

```bash
npm install @tanstack/react-virtual
```

### Bundle Analysis

```bash
npm install @next/bundle-analyzer
ANALYZE=true npm run build
```

This opens an interactive bundle visualizer to identify large dependencies.

### Font Preloading

```html
<!-- Already in _document.js -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

Google Fonts are preconnected to reduce DNS lookup time.

---

## Lighthouse Audit Checklist

Run locally with Chrome DevTools → Lighthouse:

| Category | Target | Technique |
|---|---|---|
| Performance | ≥ 85 | SSR, lazy images, memoization |
| Accessibility | ≥ 95 | ARIA labels, semantic HTML, focus indicators |
| Best Practices | ≥ 90 | HTTPS, security headers, no console errors |
| SEO | ≥ 95 | Meta tags, JSON-LD, semantic HTML, sitemap |
