/**
 * @fileoverview Utility Functions
 * @description Pure utility functions for filtering, sorting, pagination,
 *   formatting, and other shared logic. Zero side-effects, fully testable.
 * @module lib/utils
 */

// ── 1. Price Formatting ───────────────────────────────────────────────────────

/**
 * Formats a number as an INR price string.
 *
 * @param {number} price - Raw price value (in INR)
 * @param {string} [currency='INR'] - ISO 4217 currency code
 * @param {string} [locale='en-IN'] - BCP 47 locale string
 * @returns {string} Formatted price, e.g. "₹2,499.00"
 *
 * @example
 * formatPrice(2499)    // "₹2,499.00"
 * formatPrice(109999)  // "₹1,09,999.00"
 */
export function formatPrice(price, currency = 'INR', locale = 'en-IN') {
  if (typeof price !== 'number' || isNaN(price)) return '₹0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// ── 2. Star Rating Display ─────────────────────────────────────────────────────

/**
 * Generates an array of star types for rendering a star rating.
 *
 * @param {number} rating - Rating value between 0 and 5
 * @param {number} [maxStars=5] - Total number of stars to display
 * @returns {Array<'full' | 'half' | 'empty'>} Array of star type strings
 *
 * @example
 * generateStars(3.7) // ['full', 'full', 'full', 'half', 'empty']
 */
export function generateStars(rating, maxStars = 5) {
  const clampedRating = Math.max(0, Math.min(rating, maxStars));
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (clampedRating >= i) {
      stars.push('full');
    } else if (clampedRating >= i - 0.5) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  return stars;
}

/**
 * Formats a rating value as a display string.
 *
 * @param {number} rating - Rating value
 * @returns {string} Formatted rating, e.g. "4.3"
 */
export function formatRating(rating) {
  if (typeof rating !== 'number' || isNaN(rating)) return '0.0';
  return rating.toFixed(1);
}

// ── 3. Text Utilities ──────────────────────────────────────────────────────────

/**
 * Truncates text to a specified character count, appending an ellipsis.
 *
 * @param {string} text - Source text
 * @param {number} maxLength - Maximum character count
 * @returns {string} Truncated text
 *
 * @example
 * truncateText("Hello World", 6) // "Hello…"
 */
export function truncateText(text, maxLength) {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Converts a category slug to a human-readable label.
 *
 * @param {string} category - Category string from API (e.g. "men's clothing")
 * @returns {string} Formatted label (e.g. "Men's Clothing")
 */
export function formatCategoryLabel(category) {
  if (!category) return '';
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ── 4. Debounce ───────────────────────────────────────────────────────────────

/**
 * Returns a debounced version of a function that delays invocation
 * until after `delay` ms have elapsed since the last call.
 *
 * @template {(...args: any[]) => any} T
 * @param {T} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {T & { cancel: () => void }} Debounced function with cancel method
 *
 * @example
 * const debouncedSearch = debounce(handleSearch, 300);
 */
export function debounce(fn, delay) {
  let timeoutId;

  function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  }

  debounced.cancel = () => clearTimeout(timeoutId);

  return debounced;
}

// ── 5. Product Filtering ───────────────────────────────────────────────────────

/**
 * Filters a list of products based on search, category, and price criteria.
 *
 * @param {import('./api').Product[]} products - Full product list
 * @param {FilterOptions} filters - Active filter state
 * @returns {import('./api').Product[]} Filtered product list
 *
 * @typedef {Object} FilterOptions
 * @property {string}      searchQuery  - Text to search in title and description
 * @property {string}      category     - Category slug to filter by, or '' for all
 * @property {number|''}   minPrice     - Minimum price (inclusive), or '' for none
 * @property {number|''}   maxPrice     - Maximum price (inclusive), or '' for none
 * @property {number}      minRating    - Minimum rating (0-5), 0 means no filter
 * @property {boolean}     inStockOnly  - If true, show only in-stock products
 */
export function filterProducts(products, filters) {
  const {
    searchQuery = '',
    category = '',
    minPrice = '',
    maxPrice = '',
    minRating = 0,
    inStockOnly = false,
  } = filters;

  const searchLower = searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    // ── Search filter
    if (searchLower) {
      const titleMatch = product.title.toLowerCase().includes(searchLower);
      const descMatch = product.description.toLowerCase().includes(searchLower);
      const catMatch = product.category.toLowerCase().includes(searchLower);
      if (!titleMatch && !descMatch && !catMatch) return false;
    }

    // ── Category filter
    if (category && product.category !== category) {
      return false;
    }

    // ── Price range filter
    const min = minPrice !== '' ? parseFloat(minPrice) : null;
    const max = maxPrice !== '' ? parseFloat(maxPrice) : null;

    if (min !== null && !isNaN(min) && product.price < min) return false;
    if (max !== null && !isNaN(max) && product.price > max) return false;

    // ── Rating filter
    if (minRating > 0 && product.rating.rate < minRating) return false;

    // ── In-stock filter
    if (inStockOnly && !product.inStock) return false;

    return true;
  });
}

// ── 6. Product Sorting ─────────────────────────────────────────────────────────

/**
 * Sort option identifiers.
 * @typedef {'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest'} SortOption
 */

/**
 * Sorts a product list by the given sort key.
 * Returns a new array; does not mutate the input.
 *
 * @param {import('./api').Product[]} products - Products to sort
 * @param {SortOption} sortBy - Sort key
 * @returns {import('./api').Product[]} Sorted product list
 */
export function sortProducts(products, sortBy) {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);

    case 'rating-desc':
      return sorted.sort((a, b) => {
        // Sort by rating first, then by review count as a tiebreaker
        if (b.rating.rate !== a.rating.rate) {
          return b.rating.rate - a.rating.rate;
        }
        return b.rating.count - a.rating.count;
      });

    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

    case 'featured':
    default:
      // Featured: sort by a composite score (rating × log(reviews))
      return sorted.sort((a, b) => {
        const scoreA = a.rating.rate * Math.log(a.rating.count + 1);
        const scoreB = b.rating.rate * Math.log(b.rating.count + 1);
        return scoreB - scoreA;
      });
  }
}

// ── 7. Pagination ──────────────────────────────────────────────────────────────

/**
 * Slices a product array for the current page.
 *
 * @param {any[]} items - Full list of items
 * @param {number} currentPage - Current page (1-indexed)
 * @param {number} itemsPerPage - Number of items per page
 * @returns {{ pageItems: any[], totalPages: number, startIndex: number, endIndex: number }}
 */
export function paginate(items, currentPage, itemsPerPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const safePage = Math.max(1, Math.min(currentPage, totalPages));
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);

  return {
    pageItems: items.slice(startIndex, endIndex),
    totalPages,
    startIndex,
    endIndex,
    currentPage: safePage,
  };
}

/**
 * Generates an array of page numbers to display in a pagination bar,
 * with ellipsis markers ('...') for large page counts.
 *
 * @param {number} currentPage - Active page (1-indexed)
 * @param {number} totalPages - Total number of pages
 * @param {number} [maxVisible=7] - Maximum page buttons to show
 * @returns {Array<number | '...'>} Page buttons to render
 *
 * @example
 * getPageNumbers(5, 10) // [1, '...', 4, 5, 6, '...', 10]
 */
export function getPageNumbers(currentPage, totalPages, maxVisible = 7) {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(currentPage - half, 1);
  let end = Math.min(start + maxVisible - 1, totalPages);

  if (end - start + 1 < maxVisible) {
    start = Math.max(end - maxVisible + 1, 1);
  }

  const pages = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push('...');
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('...');
    pages.push(totalPages);
  }

  return pages;
}

// ── 8. Miscellaneous ──────────────────────────────────────────────────────────

/**
 * Smoothly scrolls the page to the top.
 */
export function scrollToTop() {
  if (typeof window === 'undefined') return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param {number} value - Input value
 * @param {number} min - Minimum bound
 * @param {number} max - Maximum bound
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

/**
 * Returns a human-readable count string.
 *
 * @param {number} count - Review or product count
 * @returns {string} Formatted string e.g. "1.2K" for counts >= 1000
 */
export function formatCount(count) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Checks whether a given value is within a min/max price range.
 *
 * @param {number} price
 * @param {number|''} min
 * @param {number|''} max
 * @returns {boolean}
 */
export function isInPriceRange(price, min, max) {
  const minNum = min !== '' ? parseFloat(min) : null;
  const maxNum = max !== '' ? parseFloat(max) : null;
  if (minNum !== null && price < minNum) return false;
  if (maxNum !== null && price > maxNum) return false;
  return true;
}

/**
 * Generates a unique client-side identifier for list keys.
 *
 * @returns {string} Unique string key
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
