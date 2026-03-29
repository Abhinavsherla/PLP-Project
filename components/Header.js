import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useShop } from '../pages/_app';
import { useToast } from './Toast';
import { formatPrice } from '../lib/utils';
import styles from '../styles/Header.module.css';

/**
 * Ultra-Premium Elite Header
 * @description Features centered professional navigation, search, and refined drawers.
 */
export default function Header({ searchQuery, onSearchChange, onSortChange, onFilterChange }) {
  const { cartItems, cartCount, wishlistItems, wishlistCount, removeFromCart, toggleWishlist } = useShop();
  const { addToast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchInputRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const drawerRef = useRef(null);

  // ── Functional Nav Links ──
  const NAV_LINKS = [
    { label: 'New Arrivals', onClick: () => onSortChange('newest') },
    { label: 'Bestsellers', onClick: () => onSortChange('rating-high') },
    { label: 'Electronics', onClick: () => onFilterChange('category', 'electronics') },
    { label: 'Sale', onClick: () => onSortChange('price-low') },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', !!activeDrawer);
    return () => document.body.classList.remove('no-scroll');
  }, [activeDrawer]);

  const handleSearchInput = useCallback((e) => onSearchChange(e.target.value), [onSearchChange]);
  
  const handleClearSearch = useCallback(() => {
    onSearchChange('');
    searchInputRef.current?.focus();
  }, [onSearchChange]);

  const handleStartShopping = useCallback(() => {
    setActiveDrawer(null);
    document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleCheckout = useCallback(() => {
    addToast('Redirecting to secure checkout...', 'success');
    setTimeout(() => addToast('Processing secure connection...', 'info'), 800);
  }, [addToast]);

  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  return (
    <>
      <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.headerInner}>
          <a href="/" className={styles.logo}>
             <span className={styles.logoIcon}>◆</span>
             <span className={styles.logoText}>Modern<span className={styles.logoAccent}>PLP</span></span>
          </a>

          <nav className={styles.desktopNav}>
             <ul className={styles.navList}>
               {NAV_LINKS.map(link => (
                 <li key={link.label}>
                   <button className={styles.navLink} onClick={link.onClick}>{link.label}</button>
                 </li>
               ))}
             </ul>
          </nav>

          <div className={styles.actions}>
             <div className={`${styles.searchWrapper} ${isSearchFocused ? styles.searchFocused : ''}`}>
                <span className={styles.searchIcon}>⌕</span>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Find elite products..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && <button className={styles.clearSearch} onClick={handleClearSearch}>✕</button>}
             </div>

             <button className={`${styles.actionButton} ${activeDrawer === 'wishlist' ? styles.actionActive : ''}`} onClick={() => setActiveDrawer('wishlist')}>
               <span className={styles.actionIcon}>{wishlistCount > 0 ? '♥' : '♡'}</span>
               {wishlistCount > 0 && <span className={styles.badge}>{wishlistCount}</span>}
             </button>

             <button className={`${styles.actionButton} ${activeDrawer === 'cart' ? styles.actionActive : ''}`} onClick={() => setActiveDrawer('cart')}>
               <span className={styles.actionIcon}>⊡</span>
               {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
             </button>

             <button className={styles.menuToggle} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
               <div className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}>
                 <span></span><span></span><span></span>
               </div>
             </button>
          </div>
        </div>

        <nav ref={mobileMenuRef} className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
           <ul className={styles.mobileNavList}>
              {NAV_LINKS.map(link => (
                <li key={link.label}>
                  <button className={styles.mobileBtn} onClick={() => { link.onClick(); setIsMobileMenuOpen(false); }}>{link.label}</button>
                </li>
              ))}
              <li className={styles.mobileDivider}></li>
              <li>
                <button className={styles.mobileBtn} onClick={() => { setActiveDrawer('wishlist'); setIsMobileMenuOpen(false); }}>♥ Wishlist ({wishlistCount})</button>
              </li>
              <li>
                <button className={styles.mobileBtn} onClick={() => { setActiveDrawer('cart'); setIsMobileMenuOpen(false); }}>⊡ Cart ({cartCount})</button>
              </li>
           </ul>
        </nav>
      </header>

      {activeDrawer && (
        <>
          <div className={styles.drawerOverlay} onClick={() => setActiveDrawer(null)} />
          <aside ref={drawerRef} className={`${styles.drawer} ${styles.drawerOpen}`}>
             <div className={styles.drawerHeader}>
                <h2 className={styles.drawerTitle}>
                  {activeDrawer === 'cart' ? 'Shopping Cart' : 'My Wishlist'}
                  <span className={styles.drawerCount}>({activeDrawer === 'cart' ? cartCount : wishlistCount})</span>
                </h2>
                <button className={styles.drawerClose} onClick={() => setActiveDrawer(null)}>✕</button>
             </div>

             <div className={styles.drawerContent}>
                {(activeDrawer === 'cart' ? cartItems : wishlistItems).length > 0 ? (
                  <ul className={styles.drawerList}>
                    {(activeDrawer === 'cart' ? cartItems : wishlistItems).map(item => (
                      <li key={item.id} className={styles.drawerItem}>
                        <div className={styles.itemImage}>
                          <Image src={item.image} alt={item.title} fill sizes="64px" style={{ objectFit: 'contain' }} />
                        </div>
                        <div className={styles.itemMeta}>
                          <h3 className={styles.itemName}>{item.title}</h3>
                          <p className={styles.itemPrice}>
                             {item.quantity && `${item.quantity} × `} {formatPrice(item.price)}
                          </p>
                        </div>
                        <button className={styles.itemRemove} onClick={() => activeDrawer === 'cart' ? removeFromCart(item.id) : toggleWishlist(item)}>✕</button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.emptyState}>
                    <p>Your {activeDrawer} is empty.</p>
                    <button className={styles.shopNow} onClick={handleStartShopping}>Start Shopping</button>
                  </div>
                )}
             </div>

             {activeDrawer === 'cart' && cartItems.length > 0 && (
               <div className={styles.drawerFooter}>
                  <div className={styles.subtotal}>
                    <span>Total:</span>
                    <span className={styles.totalValue}>{formatPrice(cartTotal)}</span>
                  </div>
                  <button className={styles.checkoutBtn} onClick={handleCheckout}>Checkout Now</button>
               </div>
             )}
          </aside>
        </>
      )}
    </>
  );
}
