/**
 * @fileoverview API Integration Layer
 * @description Abstracts all external API calls. Replace the base URL and
 *   endpoint paths here to integrate with your own backend — zero component changes needed.
 * @module lib/api
 */

/** Base API URL — configurable via environment variable */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://fakestoreapi.com';

/** Timeout for API requests in milliseconds */
const REQUEST_TIMEOUT_MS = 10000;

/**
 * USD → INR conversion rate.
 * Update this constant to the current exchange rate as needed.
 * Source: approx. market rate (1 USD ≈ ₹83.5)
 */
const USD_TO_INR = 83.5;

/**
 * Performs a fetch with a timeout guard.
 *
 * @param {string} url - Full URL to fetch
 * @param {RequestInit} [options={}] - Fetch options
 * @returns {Promise<Response>}
 * @throws {Error} When the request times out or network fails
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetches all products from the API.
 *
 * ── Customization Guide ──────────────────────────────────────────────────────
 * To use your own API:
 *   1. Set NEXT_PUBLIC_API_URL in .env.local to your base URL
 *   2. Update the endpoint path below (currently `/products`)
 *   3. Map the response fields in the normalizeProduct() function
 *
 * Expected shape returned by this function:
 *   {
 *     products: Product[],
 *     total: number,
 *     categories: string[],
 *     error: string | null,
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * @returns {Promise<{ products: Product[], total: number, categories: string[], error: string|null }>}
 */
export async function fetchProducts() {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/products`);

    if (!response.ok) {
      throw new Error(
        `API error: ${response.status} ${response.statusText}`
      );
    }

    const rawProducts = await response.json();

    if (!Array.isArray(rawProducts)) {
      throw new Error('Unexpected API response format: expected an array');
    }

    // Normalize each product to a consistent internal shape
    const products = rawProducts.map(normalizeProduct);

    // Derive unique categories from product list
    const categories = [
      ...new Set(products.map((p) => p.category)),
    ].sort();

    return {
      products,
      total: products.length,
      categories,
      error: null,
    };
  } catch (error) {
    // Provide a structured error so the UI can handle gracefully
    const message =
      error.name === 'AbortError'
        ? 'Request timed out. Please check your internet connection.'
        : error.message || 'Failed to fetch products. Please try again later.';

    return {
      products: [],
      total: 0,
      categories: [],
      error: message,
    };
  }
}

/**
 * Fetches a single product by ID.
 *
 * @param {number|string} id - Product ID
 * @returns {Promise<{ product: Product|null, error: string|null }>}
 */
export async function fetchProductById(id) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error(`Product not found: ${response.status}`);
    }

    const raw = await response.json();
    return { product: normalizeProduct(raw), error: null };
  } catch (error) {
    return { product: null, error: error.message };
  }
}

/**
 * Fetches all available product categories.
 *
 * @returns {Promise<{ categories: string[], error: string|null }>}
 */
export async function fetchCategories() {
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/products/categories`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }

    const categories = await response.json();
    return { categories: Array.isArray(categories) ? categories : [], error: null };
  } catch (error) {
    return { categories: [], error: error.message };
  }
}

/**
 * Normalizes a raw API product object to the internal Product shape.
 * Modify this function when integrating a custom API with different field names.
 *
 * @param {Object} raw - Raw product from the API
 * @returns {Product} Normalized product object
 */
function normalizeProduct(raw) {
  // Convert USD price to INR
  const priceINR = parseFloat(((raw.price || 0) * USD_TO_INR).toFixed(2));

  // Calculate a mock "original price" to simulate discounts (10-40% above actual)
  const discountPercent = Math.floor(Math.random() * 30) + 10;
  const originalPriceINR = parseFloat(
    (priceINR * (1 + discountPercent / 100)).toFixed(2)
  );

  // Simulate stock status (90% in stock)
  const inStock = Math.random() > 0.1;

  return {
    /** @type {number} Unique product identifier */
    id: raw.id,

    /** @type {string} Product display name */
    title: raw.title || 'Unnamed Product',

    /** @type {string} Full product description */
    description: raw.description || '',

    /** @type {number} Current selling price in INR */
    price: priceINR,

    /** @type {number} Original price before discount in INR */
    originalPrice: originalPriceINR,

    /** @type {number} Discount percentage (whole number) */
    discountPercent,

    /** @type {string} Product image URL */
    image: raw.image || '',

    /** @type {string} Product category slug */
    category: raw.category || 'uncategorized',

    /** @type {Object} Rating data */
    rating: {
      /** @type {number} Average rating (0-5) */
      rate: raw.rating?.rate ?? 0,
      /** @type {number} Total review count */
      count: raw.rating?.count ?? 0,
    },

    /** @type {boolean} Whether the product is in stock */
    inStock,

    /** @type {string} ISO date string for sorting by "newest" */
    createdAt: new Date(Date.now() - raw.id * 86400000 * 3).toISOString(),
  };
}

/**
 * @typedef {Object} Product
 * @property {number}  id
 * @property {string}  title
 * @property {string}  description
 * @property {number}  price
 * @property {number}  originalPrice
 * @property {number}  discountPercent
 * @property {string}  image
 * @property {string}  category
 * @property {{ rate: number, count: number }} rating
 * @property {boolean} inStock
 * @property {string}  createdAt
 */
