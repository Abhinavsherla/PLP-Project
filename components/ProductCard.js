/**
 * @fileoverview ProductCard Component
 * @description Displays a single product with image, title, description,
 *   price, rating, badges, and Add to Cart / Wishlist actions.
 */

import { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { useShop } from '../pages/_app';
import { useToast } from './Toast';
import {
  formatPrice,
  formatRating,
  formatCategoryLabel,
  generateStars,
  formatCount,
  truncateText,
} from '../lib/utils';
import styles from '../styles/ProductCard.module.css';

/**
 * Star rating display component.
 *
 * @param {{ rate: number, count: number }} props
 */
function StarRating({ rate, count }) {
  const stars = generateStars(rate);

  return (
    <div className={styles.ratingRow} aria-label={`Rating: ${formatRating(rate)} out of 5 stars from ${count} reviews`}>
      <span className={styles.stars} aria-hidden="true">
        {stars.map((type, index) => (
          <span
            key={index}
            className={
              type === 'full'
                ? styles.starFull
                : type === 'half'
                ? styles.starHalf
                : styles.starEmpty
            }
          >
            {type === 'empty' ? '☆' : '★'}
          </span>
        ))}
      </span>
      <span className={styles.ratingValue}>{formatRating(rate)}</span>
      <span className={styles.ratingCount}>({formatCount(count)})</span>
    </div>
  );
}

/**
 * Individual product card.
 * Wrapped in React.memo to prevent unnecessary re-renders when pagination changes.
 *
 * @param {{ product: import('../lib/api').Product }} props
 */
const ProductCard = memo(function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted, recentlyAdded } = useShop();
  const { addToast } = useToast();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const wishlisted = isWishlisted(product.id);
  const justAdded = recentlyAdded.has(product.id);

  const handleAddToCart = useCallback(() => {
    addToCart(product);
    addToast(`"${truncateText(product.title, 40)}" added to cart`, 'success');
  }, [addToCart, product, addToast]);

  const handleToggleWishlist = useCallback(() => {
    const isCurrentlyWishlisted = isWishlisted(product.id);
    toggleWishlist(product);
    if (isCurrentlyWishlisted) {
      addToast(`Removed from wishlist`, 'info');
    } else {
      addToast(`Added to wishlist ♥`, 'success');
    }
  }, [toggleWishlist, isWishlisted, product, addToast]);

  return (
    <article
      className={styles.card}
      aria-label={`${product.title} — ${formatPrice(product.price)}`}
    >
      {/* ── Image Container ── */}
      <div className={styles.imageContainer}>
        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <span className={styles.discountBadge} aria-label={`${product.discountPercent}% discount`}>
            -{product.discountPercent}%
          </span>
        )}

        {/* Stock Badge */}
        {!product.inStock && (
          <span className={styles.outOfStockBadge} aria-label="Out of stock">
            Out of Stock
          </span>
        )}

        {/* Wishlist Button */}
        <button
          className={`${styles.wishlistButton} ${wishlisted ? styles.wishlisted : ''}`}
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          aria-pressed={wishlisted}
          type="button"
        >
          <span aria-hidden="true">{wishlisted ? '♥' : '♡'}</span>
        </button>

        {/* Product Image */}
        <div className={`${styles.imageSkeleton} ${imageLoaded ? styles.imageLoaded : ''}`}>
          {!imageError ? (
            <Image
              src={product.image}
              alt={truncateText(product.title, 100)}
              fill
              sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
              className={styles.productImage}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
              style={{ objectFit: 'contain' }}
            />
          ) : (
            /* Fallback for broken images */
            <div className={styles.imageFallback} aria-hidden="true">
              <span>◻</span>
              <p>Image unavailable</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className={styles.cardBody}>
        {/* Category Tag */}
        <span className={styles.categoryTag} aria-label={`Category: ${formatCategoryLabel(product.category)}`}>
          {formatCategoryLabel(product.category)}
        </span>

        {/* Product Title */}
        <h3 className={styles.title} title={product.title}>
          {product.title}
        </h3>

        {/* Product Description */}
        <p className={styles.description}>
          {truncateText(product.description, 120)}
        </p>

        {/* Star Rating */}
        <StarRating rate={product.rating.rate} count={product.rating.count} />

        {/* Pricing */}
        <div className={styles.pricing} aria-label={`Price: ${formatPrice(product.price)}, was ${formatPrice(product.originalPrice)}`}>
          <span className={styles.currentPrice}>
            {formatPrice(product.price)}
          </span>
          <span className={styles.originalPrice}>
            {formatPrice(product.originalPrice)}
          </span>
        </div>

        {/* Stock Status */}
        <p className={`${styles.stockStatus} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
          <span aria-hidden="true">{product.inStock ? '●' : '○'}</span>
          {product.inStock ? ' In Stock' : ' Out of Stock'}
        </p>
      </div>

      {/* ── Card Footer ── */}
      <div className={styles.cardFooter}>
        <button
          className={`${styles.addToCartButton} ${justAdded ? styles.addedToCart : ''} ${!product.inStock ? styles.disabled : ''}`}
          onClick={handleAddToCart}
          disabled={!product.inStock}
          aria-label={
            !product.inStock
              ? `${product.title} is out of stock`
              : justAdded
              ? `${product.title} added to cart`
              : `Add ${product.title} to cart`
          }
          type="button"
        >
          {justAdded ? (
            <span className={styles.addedContent} aria-live="polite">
              <span aria-hidden="true">✓</span> Added!
            </span>
          ) : !product.inStock ? (
            'Out of Stock'
          ) : (
            <>
              <span aria-hidden="true">+</span> Add to Cart
            </>
          )}
        </button>
      </div>
    </article>
  );
});

export default ProductCard;
