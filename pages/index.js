/**
 * @fileoverview Main Product Listing Page (Elite Version)
 * @description Server-side rendered (SSR) with Next.js. Optimized for SEO (JSON-LD),
 *   Performance (Minimal DOM), and Reach (Full Responsiveness).
 */

import Head from 'next/head';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

import Header from '../components/Header';
import Filters from '../components/Filters';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

import { fetchProducts } from '../lib/api';
import { filterProducts, sortProducts, paginate, scrollToTop, debounce } from '../lib/utils';

import styles from '../styles/pages/index.module.css';

// ── Constants ─────────────────────────────────────────────────────────────────

const PRODUCTS_PER_PAGE = 12;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://modern-plp.netlify.app';

const PAGE_TITLE = 'ModernPLP Elite — Premium Product Collection';
const PAGE_DESCRIPTION = 'Discover curated luxury across electronics, jewellery, and fashion. Expertly filtered for the discerning shopper.';

const DEFAULT_FILTERS = {
  searchQuery: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  inStockOnly: false,
};

/**
 * Product Listing Page component.
 */
export default function ProductListingPage({ products = [], categories = [], error = null }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSetSearch = useRef(
    debounce((value) => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 300)
  ).current;

  const handleSearchChange = useCallback((value) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }));
    debouncedSetSearch(value);
  }, [debouncedSetSearch]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setDebouncedSearch('');
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    scrollToTop();
  }, []);

  // ── Derived Data ──
  const activeFilters = useMemo(() => ({ ...filters, searchQuery: debouncedSearch }), [filters, debouncedSearch]);
  const filteredProducts = useMemo(() => filterProducts(products, activeFilters), [products, activeFilters]);
  const sortedProducts = useMemo(() => sortProducts(filteredProducts, sortBy), [filteredProducts, sortBy]);
  const { pageItems, totalPages, startIndex, endIndex, currentPage: safePage } = useMemo(
    () => paginate(sortedProducts, currentPage, PRODUCTS_PER_PAGE),
    [sortedProducts, currentPage]
  );

  const hasActiveFilters = useMemo(() => (
    filters.category !== '' || filters.minPrice !== '' || filters.maxPrice !== '' || filters.minRating > 0 || filters.inStockOnly || debouncedSearch !== ''
  ), [filters, debouncedSearch]);

  // ── JSON-LD Schema ──
  const itemListSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured Products',
    numberOfItems: products.length,
    itemListElement: products.slice(0, 15).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.title,
        image: p.image,
        description: p.description,
        sku: `SKU-${p.id}`,
        brand: { '@type': 'Brand', name: 'Elite Collection' },
        offers: {
            '@type': 'Offer',
            price: p.price.toFixed(2),
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
        }
      }
    }))
  }), [products]);

  return (
    <>
      <Head>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0a1a3d" />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:locale" content="en_IN" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Appscrip Candidate" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      </Head>

      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      <main id="main-content" className={styles.main} role="main">
        <section className={styles.heroSection} aria-label="Page Header">
          <div className={styles.heroContent}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <ol>
                <li><a href="/">Home</a></li>
                <li aria-current="page">Products</li>
              </ol>
            </nav>
            <h1 className={styles.pageTitle}>Our Premium Collection</h1>
            <p className={styles.pageSubtitle}>
              {error ? 'Service unavailable' : `Showing ${products.length} luxury items`}
            </p>
          </div>
        </section>

        {!error && (
          <div className={styles.contentLayout}>
            <aside className={styles.sidebar} aria-label="Filters">
              <Filters
                categories={categories}
                filters={filters}
                hasActiveFilters={hasActiveFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                totalResults={filteredProducts.length}
              />
            </aside>

            <section className={styles.gridSection} aria-label="Products">
              <ProductGrid
                products={pageItems}
                allProductCount={filteredProducts.length}
                sortBy={sortBy}
                currentPage={safePage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                hasActiveFilters={hasActiveFilters}
                onSortChange={handleSortChange}
                onPageChange={handlePageChange}
                onClearFilters={handleClearFilters}
              />
            </section>
          </div>
        )}

        {error && (
          <div className={styles.errorContent} role="alert">
            <h2>Unable to Connect</h2>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}
      </main>

      <Footer onFilterChange={handleFilterChange} onSortChange={handleSortChange} />
    </>
  );
}

export async function getServerSideProps(context) {
  context.res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  const { products, categories, error } = await fetchProducts();
  return { props: { products, categories, error } };
}
