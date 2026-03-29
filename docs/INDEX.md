# Documentation Index

> Master navigation guide for all ModernPLP documentation.

---

## Start Here

| Guide | Best for | Link |
|---|---|---|
| **QUICK_START** | First-time setup in 5 minutes | [QUICK_START.md](QUICK_START.md) |
| **README** | Full project overview and features | [../README.md](../README.md) |
| **CHECKLIST** | Verify everything before submission | [CHECKLIST.md](CHECKLIST.md) |

---

## Architecture & Code

| Guide | Contents |
|---|---|
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Architecture diagrams, data flow, state management, component responsibilities |
| [FILE_STRUCTURE.md](FILE_STRUCTURE.md) | Every file explained — purpose, exports, props, sub-components |

---

## Deployment

| Guide | Contents |
|---|---|
| [DEPLOYMENT.md](DEPLOYMENT.md) | Netlify (recommended), Vercel, self-hosted VPS with Nginx |

---

## Customization

| Guide | Contents |
|---|---|
| [API_INTEGRATION.md](API_INTEGRATION.md) | Replace Fake Store API with WooCommerce, Shopify, or custom REST/GraphQL API |

---

## Quality & Optimization

| Guide | Contents |
|---|---|
| [SEO_GUIDE.md](SEO_GUIDE.md) | JSON-LD schemas, Open Graph, crawlability, dynamic sitemap, URL-based filters |
| [PERFORMANCE.md](PERFORMANCE.md) | SSR caching, React.memo, useMemo, debounce, lazy images, bundle analysis |
| [CHECKLIST.md](CHECKLIST.md) | Pre-launch verification for features, accessibility, SEO, performance, deployment |

---

## Quick Reference

### Run the project

```bash
npm install && npm run dev
# → http://localhost:3000
```

### Build for production

```bash
npm run build
```

### Change number of products per page

```bash
# .env.local
NEXT_PUBLIC_PRODUCTS_PER_PAGE=8
```

### Change API

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-api.com
```

Then update `normalizeProduct()` in `lib/api.js`.

### Add a new color to the design system

```css
/* styles/globals.css */
:root {
  --color-custom: #your-hex;
}
```

Then use `var(--color-custom)` in any CSS Module.

---

## External Resources

| Resource | Link |
|---|---|
| Next.js 14 Docs | [nextjs.org/docs](https://nextjs.org/docs) |
| React 18 Docs | [react.dev](https://react.dev) |
| CSS Modules | [github.com/css-modules](https://github.com/css-modules/css-modules) |
| Fake Store API | [fakestoreapi.com](https://fakestoreapi.com) |
| Schema.org Validator | [validator.schema.org](https://validator.schema.org) |
| WCAG 2.1 Guidelines | [w3.org/TR/WCAG21](https://www.w3.org/TR/WCAG21/) |
| Netlify Plugin for Next.js | [github.com/netlify/netlify-plugin-nextjs](https://github.com/netlify/netlify-plugin-nextjs) |
| Lighthouse | [Chrome DevTools → Audits tab](https://developer.chrome.com/docs/lighthouse/overview/) |
