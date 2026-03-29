/**
 * @fileoverview ProductGrid Component
 * @description Renders the product grid header (sort + result count),
 *   the responsive product grid, pagination controls, and empty state.
 */

import { memo, useCallback, useMemo } from 'react';
import ProductCard from './ProductCard';
import { getPageNumbers } from '../lib/utils';
import styles from '../styles/ProductGrid.module.css';

/** Sort options available in the dropdown */
const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'newest',     label: 'Newest' },
];

/**
 * Empty state displayed when no products match the current filters.
 *
 * @param {{ onClearFilters: () => void, hasActiveFilters: boolean }} props
 */
function EmptyState({ onClearFilters, hasActiveFilters }) {
  return (
    <div className={styles.emptyState} role="status" aria-live="polite">
      <div className={styles.emptyIcon} aria-hidden="true">⊘</div>
      <h2 className={styles.emptyTitle}>No products found</h2>
      <p className={styles.emptyDescription}>
        {hasActiveFilters
          ? "We couldn't find any products matching your current filters. Try adjusting or clearing your filters."
          : "No products are available at the moment. Please check back later."}
      </p>
      {hasActiveFilters && (
        <button
          className={styles.emptyClearButton}
          onClick={onClearFilters}
          type="button"
          aria-label="Clear all filters to show all products"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

/**
 * Pagination controls with previous, page numbers, and next buttons.
 *
 * @param {{
 *   currentPage: number,
 *   totalPages: number,
 *   onPageChange: (page: number) => void
 * }} props
 */
const Pagination = memo(function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = useMemo(
    () => getPageNumbers(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const handlePrev = useCallback(() => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  }, [currentPage, totalPages, onPageChange]);

  if (totalPages <= 1) return null;

  return (
    <nav
      className={styles.pagination}
      aria-label="Product list pagination"
      role="navigation"
    >
      {/* Previous button */}
      <button
        className={`${styles.pageButton} ${styles.pageNavButton}`}
        onClick={handlePrev}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        aria-disabled={currentPage === 1}
        type="button"
      >
        ‹ Prev
      </button>

      {/* Page number buttons */}
      <ol className={styles.pageNumbers} aria-label="Page numbers" role="list">
        {pageNumbers.map((page, index) => (
          <li key={`${page}-${index}`} role="listitem">
            {page === '...' ? (
              <span className={styles.pageEllipsis} aria-hidden="true">…</span>
            ) : (
              <button
                className={`${styles.pageButton} ${
                  page === currentPage ? styles.pageActive : ''
                }`}
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                type="button"
              >
                {page}
              </button>
            )}
          </li>
        ))}
      </ol>

      {/* Next button */}
      <button
        className={`${styles.pageButton} ${styles.pageNavButton}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        aria-disabled={currentPage === totalPages}
        type="button"
      >
        Next ›
      </button>
    </nav>
  );
});

/**
 * Product grid with sort bar, responsive grid, and pagination.
 *
 * @param {{
 *   products: import('../lib/api').Product[],
 *   allProductCount: number,
 *   sortBy: string,
 *   currentPage: number,
 *   totalPages: number,
 *   startIndex: number,
 *   endIndex: number,
 *   hasActiveFilters: boolean,
 *   onSortChange: (sort: string) => void,
 *   onPageChange: (page: number) => void,
 *   onClearFilters: () => void,
 * }} props
 */
export default function ProductGrid({
  products,
  allProductCount,
  sortBy,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  hasActiveFilters,
  onSortChange,
  onPageChange,
  onClearFilters,
}) {
  const handleSortChange = useCallback(
    (e) => onSortChange(e.target.value),
    [onSortChange]
  );

  const isListEmpty = products.length === 0;

  return (
    <div className={styles.productGridWrapper}>
      {/* ── Grid Header: results count + sort ── */}
      <div className={styles.gridHeader}>
        <p className={styles.resultsInfo} aria-live="polite" aria-atomic="true">
          {isListEmpty ? (
            'No results'
          ) : (
            <>
              Showing{' '}
              <strong aria-label={`products ${startIndex + 1} to ${endIndex}`}>
                {startIndex + 1}–{endIndex}
              </strong>{' '}
              of{' '}
              <strong aria-label={`${allProductCount} total products`}>
                {allProductCount}
              </strong>{' '}
              product{allProductCount !== 1 ? 's' : ''}
              {totalPages > 1 && (
                <span className={styles.pageInfo}>
                  {' '}— Page {currentPage} of {totalPages}
                </span>
              )}
            </>
          )}
        </p>

        {/* Sort Dropdown */}
        <div className={styles.sortWrapper}>
          <label htmlFor="sort-select" className={styles.sortLabel}>
            Sort by:
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="sort-select"
              className={styles.sortSelect}
              value={sortBy}
              onChange={handleSortChange}
              aria-label="Sort products by"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className={styles.selectChevron} aria-hidden="true">›</span>
          </div>
        </div>
      </div>

      {/* ── Product Grid or Empty State ── */}
      {isListEmpty ? (
        <EmptyState
          onClearFilters={onClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      ) : (
        <ul
          className={styles.grid}
          role="list"
          aria-label={`Product listing, page ${currentPage} of ${totalPages}`}
        >
          {products.map((product, index) => (
            <li
              key={product.id}
              role="listitem"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}

      {/* ── Pagination ── */}
      {!isListEmpty && (
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
