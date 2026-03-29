# SEO Optimization Guide

> How ModernPLP implements SEO and how to extend it.

---

## Implemented SEO Features

### 1. Title & Meta Description

```jsx
// pages/index.js
<Head>
  <title>ModernPLP — Premium Product Collection | Shop Now</title>
  <meta name="description" content="Discover over 20 premium products..." />
</Head>
```

**Best practices applied:**
- Title: 50–60 characters including primary keyword
- Description: 150–160 characters with a call to action
- Keywords naturally integrated (not keyword-stuffed)

---

### 2. Open Graph & Twitter Cards

```jsx
<meta property="og:type"        content="website" />
<meta property="og:url"         content={SITE_URL} />
<meta property="og:title"       content={PAGE_TITLE} />
<meta property="og:description" content={PAGE_DESCRIPTION} />
<meta property="og:image"       content={`${SITE_URL}/images/og-image.jpg`} />
<meta name="twitter:card"       content="summary_large_image" />
```

**Customization:** Replace `/images/og-image.jpg` with a 1200×630px image of your products.

---

### 3. JSON-LD Structured Data (Schema.org)

Two schema blocks are injected:

#### `CollectionPage` (in `_document.js`)
```json
{
  "@type": "CollectionPage",
  "name": "ModernPLP — Premium Product Collection",
  "publisher": { "@type": "Organization", ... }
}
```

#### `ItemList` + `Product` (in `index.js`, dynamic)
```json
{
  "@type": "ItemList",
  "numberOfItems": 20,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "name": "...",
        "offers": { "@type": "Offer", "price": "29.99", "priceCurrency": "USD" },
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.5", ... }
      }
    }
  ]
}
```

**Validate at:** [schema.org/validator](https://validator.schema.org)

---

### 4. Semantic HTML

| Element | Usage |
|---|---|
| `<header role="banner">` | Site header |
| `<main role="main">` | Main content |
| `<nav role="navigation">` | Navigation bars |
| `<aside role="complementary">` | Filters sidebar |
| `<article>` | Each product card |
| `<footer role="contentinfo">` | Site footer |
| `<section aria-label="...">` | Logical page sections |
| `<h1>` | Page title ("Our Collection") — one per page |

---

### 5. Crawlability

**`robots.txt`**
```
User-agent: *
Allow: /
Sitemap: https://modern-plp.netlify.app/sitemap.xml
```

**`sitemap.xml`**
```xml
<url>
  <loc>https://modern-plp.netlify.app/</loc>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
</url>
```

---

## How to Improve SEO Further

### Add Product Detail Pages

Individual product URLs are more SEO-valuable than a single PLP:

```
/products/[id]  →  pages/products/[id].js
```

Each product page would have its own `<title>`, `<meta description>`, and `Product` JSON-LD.

### Dynamic Sitemap

For large catalogs, generate a dynamic sitemap:

```js
// pages/sitemap.xml.js
export async function getServerSideProps({ res }) {
  const { products } = await fetchProducts();
  const sitemap = `<?xml version="1.0"?>
  <urlset xmlns="...">
    ${products.map(p => `<url><loc>/products/${p.id}</loc></url>`).join('')}
  </urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
  return { props: {} };
}
```

### URL-Based Filters

Currently, filters are client-side state. For SEO-indexable category pages:

```
/products?category=electronics
```

Read filter state from `context.query` in `getServerSideProps` and pass as initial filter values.

### Image `alt` Text

All product images use the product title as alt text (`truncateText(title, 100)`).
For even better SEO, write custom alt text that includes keywords.

### Canonical URLs with Filters

When filters are applied, set a canonical URL to avoid duplicate content:

```jsx
<link rel="canonical" href={`${SITE_URL}/`} />
```

### Core Web Vitals

| Metric | Target | Status |
|---|---|---|
| LCP | < 2.5s | ✅ Lazy images, SSR pre-renders content |
| CLS | < 0.1 | ✅ Fixed image aspect ratios prevent layout shift |
| FID | < 100ms | ✅ Minimal JS, no blocking third-party scripts |

### Google Search Console

1. Verify ownership of your domain
2. Submit your sitemap URL
3. Monitor Coverage report for crawl errors
4. Monitor Core Web Vitals report
