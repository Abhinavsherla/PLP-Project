# API Integration Guide

> How to replace the Fake Store API with your own backend.

---

## Current Setup

By default, ModernPLP fetches products from the **Fake Store API**:

```
https://fakestoreapi.com/products
```

This returns an array of 20 products in the Fake Store format.

---

## Step 1 — Set Your API URL

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-api.com
```

No code changes needed if your API returns products at `GET /products`.

---

## Step 2 — Update the Endpoint Path

If your API uses a different endpoint path, update `lib/api.js`:

```js
// lib/api.js — Line 43
const response = await fetchWithTimeout(`${API_BASE_URL}/products`);
// Change to:
const response = await fetchWithTimeout(`${API_BASE_URL}/api/v1/items`);
```

---

## Step 3 — Normalize Your API Response

This is the key step. Update the `normalizeProduct()` function in `lib/api.js`
to map your API's field names to the internal `Product` shape:

### Current normalizer (Fake Store API fields):

```js
function normalizeProduct(raw) {
  return {
    id:             raw.id,
    title:          raw.title,
    description:    raw.description,
    price:          raw.price,
    image:          raw.image,
    category:       raw.category,
    rating: {
      rate:  raw.rating?.rate  ?? 0,
      count: raw.rating?.count ?? 0,
    },
    inStock:        true, // your API may have a real stock field
    // ...
  };
}
```

### Example: WooCommerce REST API

```js
function normalizeProduct(raw) {
  return {
    id:             raw.id,
    title:          raw.name,                        // WC uses "name"
    description:    raw.short_description,           // WC uses "short_description"
    price:          parseFloat(raw.price),
    originalPrice:  parseFloat(raw.regular_price),
    discountPercent: raw.on_sale
      ? Math.round((1 - raw.price / raw.regular_price) * 100)
      : 0,
    image:          raw.images?.[0]?.src ?? '',
    category:       raw.categories?.[0]?.slug ?? 'uncategorized',
    rating: {
      rate:  parseFloat(raw.average_rating) || 0,
      count: raw.rating_count || 0,
    },
    inStock:        raw.stock_status === 'instock',
    createdAt:      raw.date_created,
  };
}
```

### Example: Shopify Storefront API (GraphQL)

For GraphQL APIs, update `fetchProducts()` to use a `POST` request:

```js
export async function fetchProducts() {
  const query = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            description
            variants(first: 1) {
              edges { node { price availableForSale } }
            }
            images(first: 1) {
              edges { node { url } }
            }
          }
        }
      }
    }
  `;

  const response = await fetchWithTimeout(`${API_BASE_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  const rawProducts = data.products.edges.map(e => e.node);
  const products = rawProducts.map(normalizeProduct);
  // ...
}
```

---

## Required Product Shape

All components expect this internal `Product` shape. Your `normalizeProduct()` **must** return:

```ts
{
  id:             number | string   // Unique identifier
  title:          string            // Product name
  description:    string            // Full description
  price:          number            // Current price (USD float)
  originalPrice:  number            // Pre-discount price
  discountPercent: number           // 0-100 (0 = no discount)
  image:          string            // Image URL
  category:       string            // Category slug
  rating: {
    rate:  number                   // 0.0 - 5.0
    count: number                   // Total reviews
  }
  inStock:        boolean
  createdAt:      string            // ISO date string
}
```

---

## Adding Authentication Headers

If your API requires authentication:

```js
// lib/api.js
async function fetchWithTimeout(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.API_SECRET_TOKEN}`,  // Server-side only
      ...options.headers,
    },
  });
}
```

> **Important:** Never prefix server-only tokens with `NEXT_PUBLIC_`. They will be exposed to the client.

---

## Adding Image Domains

When you switch APIs, add the new image domain to `next.config.js`:

```js
images: {
  domains: ['fakestoreapi.com', 'your-api-images.com'],
},
```

---

## Pagination via API

Currently, all products are fetched at once and paginated client-side.
For large datasets, update `fetchProducts()` to accept page parameters:

```js
export async function fetchProducts({ page = 1, limit = 12 } = {}) {
  const url = `${API_BASE_URL}/products?page=${page}&limit=${limit}`;
  const response = await fetchWithTimeout(url);
  // ...
}
```

And pass `currentPage` and `PRODUCTS_PER_PAGE` from `getServerSideProps`:

```js
export async function getServerSideProps({ query }) {
  const page = parseInt(query.page || '1', 10);
  const { products, total, error } = await fetchProducts({ page, limit: 12 });
  return { props: { products, total, error, currentPage: page } };
}
```
