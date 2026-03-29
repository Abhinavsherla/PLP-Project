/**
 * @fileoverview Next.js App — Global application wrapper
 * @description Imports global CSS, provides cart and wishlist context to the
 *   entire application via React Context API.
 */

import { useState, createContext, useContext, useCallback, useMemo } from 'react';
import '../styles/globals.css';
import { ToastProvider } from '../components/Toast';

// ── Cart & Wishlist Context ────────────────────────────────────────────────────

/**
 * @typedef {Object} CartItem
 * @property {number} id
 * @property {string} title
 * @property {number} price
 * @property {string} image
 * @property {number} quantity
 */

const ShopContext = createContext(null);

/**
 * Custom hook to access the shop context.
 * Must be used inside a <ShopProvider> tree.
 *
 * @returns {ShopContextValue}
 */
export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}

/**
 * Provides cart and wishlist state to the entire component tree.
 *
 * @param {{ children: React.ReactNode }} props
 */
function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]); // Changed from Set to array
  const [recentlyAdded, setRecentlyAdded] = useState(new Set());

  // ── Cart Operations ──────────────────────────────────────────────────────────

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });

    // Show "Added" feedback for 1.5 seconds
    setRecentlyAdded((prev) => {
      const next = new Set(prev);
      next.add(product.id);
      return next;
    });

    setTimeout(() => {
      setRecentlyAdded((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // ── Wishlist Operations ──────────────────────────────────────────────────────

  const toggleWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        }];
      }
    });
  }, []);

  const isWishlisted = useCallback(
    (productId) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems]
  );

  // ── Memoized Context Value ───────────────────────────────────────────────────

  const contextValue = useMemo(
    () => ({
      cartItems,
      cartCount: getCartCount(),
      wishlistItems, // Exporting full wishlist objects
      wishlistCount: wishlistItems.length,
      recentlyAdded,
      addToCart,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
    }),
    [
      cartItems,
      wishlistItems,
      recentlyAdded,
      getCartCount,
      addToCart,
      removeFromCart,
      toggleWishlist,
      isWishlisted,
    ]
  );

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
}

/**
 * Root application component.
 *
 * @param {{ Component: React.ComponentType, pageProps: Object }} props
 */
export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <ShopProvider>
        <Component {...pageProps} />
      </ShopProvider>
    </ToastProvider>
  );
}
