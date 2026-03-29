/**
 * @fileoverview Filters Sidebar Component
 * @description Collapsible filter sections for category, price range, rating,
 *   and stock status. Provides real-time filtering feedback.
 */

import { useState, useCallback, useId } from 'react';
import { formatCategoryLabel } from '../lib/utils';
import styles from '../styles/Filters.module.css';

/** Star ratings selectable options */
const RATING_OPTIONS = [
  { value: 4, label: '4 & above' },
  { value: 3, label: '3 & above' },
  { value: 2, label: '2 & above' },
  { value: 1, label: '1 & above' },
];

/**
 * Collapsible filter section wrapper.
 *
 * @param {{ title: string, children: React.ReactNode, defaultOpen?: boolean }} props
 */
function FilterSection({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const headingId = useId();
  const contentId = useId();

  return (
    <div className={styles.section}>
      <button
        className={styles.sectionHeader}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={headingId}
        type="button"
      >
        <span className={styles.sectionTitle}>{title}</span>
        <span
          className={`${styles.sectionChevron} ${isOpen ? styles.chevronOpen : ''}`}
          aria-hidden="true"
        >
          ›
        </span>
      </button>

      <div
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        className={`${styles.sectionContent} ${isOpen ? styles.sectionContentOpen : ''}`}
      >
        <div className={styles.sectionBody}>{children}</div>
      </div>
    </div>
  );
}

/**
 * Renders 5 interactive star icons for rating selection.
 *
 * @param {{ value: number, onChange: (value: number) => void }} props
 */
function StarRatingSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const displayValue = hovered || value;

  return (
    <div className={styles.starSelector} role="group" aria-label="Filter by minimum rating">
      {RATING_OPTIONS.map((option) => (
        <label key={option.value} className={styles.ratingLabel}>
          <input
            type="radio"
            name="min-rating"
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <button
            type="button"
            className={`${styles.ratingOption} ${value === option.value ? styles.ratingActive : ''}`}
            onClick={() => onChange(value === option.value ? 0 : option.value)}
            aria-label={option.label}
          >
            <span className={styles.stars} aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={i < option.value ? styles.starFilled : styles.starEmpty}
                >
                  ★
                </span>
              ))}
            </span>
            <span className={styles.ratingOptionLabel}>{option.label}</span>
          </button>
        </label>
      ))}
    </div>
  );
}

/**
 * Sidebar filter panel with category, price, rating, and stock filters.
 *
 * @param {{
 *   categories: string[],
 *   filters: FilterState,
 *   hasActiveFilters: boolean,
 *   onFilterChange: (key: string, value: any) => void,
 *   onClearFilters: () => void,
 *   totalResults: number,
 * }} props
 */
export default function Filters({
  categories,
  filters,
  hasActiveFilters,
  onFilterChange,
  onClearFilters,
  totalResults,
}) {
  const handleCategoryChange = useCallback(
    (category) => {
      // Toggle category: clicking active category deselects it
      onFilterChange('category', filters.category === category ? '' : category);
    },
    [filters.category, onFilterChange]
  );

  const handlePriceChange = useCallback(
    (field, value) => {
      // Validate: only allow positive numbers or empty string
      if (value !== '' && (isNaN(value) || parseFloat(value) < 0)) return;
      onFilterChange(field, value);
    },
    [onFilterChange]
  );

  const handleRatingChange = useCallback(
    (value) => onFilterChange('minRating', value),
    [onFilterChange]
  );

  const handleInStockChange = useCallback(
    (e) => onFilterChange('inStockOnly', e.target.checked),
    [onFilterChange]
  );

  return (
    <aside className={styles.filters} aria-label="Product filters">
      {/* ── Filter Header ── */}
      <div className={styles.filtersHeader}>
        <h2 className={styles.filtersTitle}>
          <span aria-hidden="true">⊟</span> Filters
        </h2>
        {hasActiveFilters && (
          <button
            className={styles.clearAllButton}
            onClick={onClearFilters}
            aria-label="Clear all filters"
            type="button"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Results Count ── */}
      <p className={styles.resultsCount} aria-live="polite" aria-atomic="true">
        <strong>{totalResults}</strong> product{totalResults !== 1 ? 's' : ''} found
      </p>

      {/* ── Category Filter ── */}
      <FilterSection title="Category" defaultOpen={true}>
        <fieldset className={styles.fieldset}>
          <legend className="sr-only">Filter by category</legend>

          {/* All categories option */}
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.category === ''}
              onChange={() => onFilterChange('category', '')}
              className={styles.radioInput}
            />
            <span className={styles.radioCustom} aria-hidden="true" />
            <span className={styles.radioText}>All Categories</span>
          </label>

          {/* Individual category options */}
          {categories.map((cat) => (
            <label key={cat} className={styles.radioLabel}>
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filters.category === cat}
                onChange={() => handleCategoryChange(cat)}
                className={styles.radioInput}
              />
              <span className={styles.radioCustom} aria-hidden="true" />
              <span className={styles.radioText}>{formatCategoryLabel(cat)}</span>
            </label>
          ))}
        </fieldset>
      </FilterSection>

      {/* ── Price Range Filter ── */}
      <FilterSection title="Price Range" defaultOpen={true}>
        <div className={styles.priceRange}>
          <div className={styles.priceFieldGroup}>
            <label htmlFor="min-price" className={styles.priceLabel}>
              Min ($)
            </label>
            <input
              id="min-price"
              type="number"
              className={styles.priceInput}
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              min="0"
              step="0.01"
              aria-label="Minimum price in US dollars"
            />
          </div>

          <span className={styles.priceSeparator} aria-hidden="true">—</span>

          <div className={styles.priceFieldGroup}>
            <label htmlFor="max-price" className={styles.priceLabel}>
              Max ($)
            </label>
            <input
              id="max-price"
              type="number"
              className={styles.priceInput}
              placeholder="999"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              min="0"
              step="0.01"
              aria-label="Maximum price in US dollars"
            />
          </div>
        </div>

        {/* Quick price presets */}
        <div className={styles.pricePresets} role="group" aria-label="Quick price ranges">
          {[
            { label: 'Under $25',  min: '',   max: '25' },
            { label: '$25–$50',    min: '25', max: '50' },
            { label: '$50–$100',   min: '50', max: '100' },
            { label: 'Over $100',  min: '100', max: '' },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={`${styles.presetButton} ${
                filters.minPrice === preset.min && filters.maxPrice === preset.max
                  ? styles.presetActive
                  : ''
              }`}
              onClick={() => {
                onFilterChange('minPrice', preset.min);
                onFilterChange('maxPrice', preset.max);
              }}
              aria-pressed={
                filters.minPrice === preset.min && filters.maxPrice === preset.max
              }
            >
              {preset.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── Rating Filter ── */}
      <FilterSection title="Minimum Rating" defaultOpen={false}>
        <StarRatingSelector
          value={filters.minRating}
          onChange={handleRatingChange}
        />
      </FilterSection>

      {/* ── Availability Filter ── */}
      <FilterSection title="Availability" defaultOpen={false}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={filters.inStockOnly}
            onChange={handleInStockChange}
            id="in-stock-filter"
          />
          <span className={styles.checkboxCustom} aria-hidden="true" />
          <span className={styles.checkboxText}>In stock only</span>
        </label>
      </FilterSection>

      {/* ── Clear Filters Button ── */}
      {hasActiveFilters && (
        <button
          className={styles.clearButton}
          onClick={onClearFilters}
          type="button"
          aria-label="Clear all active filters and show all products"
        >
          ✕ Clear All Filters
        </button>
      )}
    </aside>
  );
}
