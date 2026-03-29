import { useState, useCallback } from 'react';
import styles from '../styles/Footer.module.css';

/**
 * Site-wide footer component with functional category and sort links.
 * 
 * @param {{
 *   onFilterChange: (key: string, value: any) => void,
 *   onSortChange: (sort: string) => void
 * }} props
 */
export default function Footer({ onFilterChange, onSortChange }) {
  const currentYear = new Date().getFullYear();

  // ── Shop Column Links (Functional) ──
  const SHOP_LINKS = [
    { label: 'New Arrivals', onClick: () => onSortChange('newest') },
    { label: 'Best Sellers', onClick: () => onSortChange('rating-high') },
    { label: 'Electronics', onClick: () => onFilterChange('category', 'electronics') },
    { label: "Men's Clothing", onClick: () => onFilterChange('category', "men's clothing") },
    { label: "Women's Clothing", onClick: () => onFilterChange('category', "women's clothing") },
    { label: 'Jewellery', onClick: () => onFilterChange('category', 'jewelery') },
    { label: 'Sale', onClick: () => onSortChange('price-low') },
  ];

  const OTHER_COLUMNS = [
    {
      heading: 'Customer Service',
      links: ['Help Center', 'Track Order', 'Returns', 'Shipping Info', 'Size Guide', 'Contact Us'],
    },
    {
      heading: 'Company',
      links: ['About Us', 'Blog', 'Careers', 'Press Kit', 'Sustainability'],
    },
    {
      heading: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'],
    },
  ];

  return (
    <footer className={styles.footer} role="contentinfo">
      {/* ── Newsletter Strip ── */}
      <div className={styles.newsletterSection}>
        <div className={styles.newsletterContent}>
          <div className={styles.newsletterText}>
            <h2 className={styles.newsletterTitle}>Stay in the loop</h2>
            <p className={styles.newsletterSubtitle}>Get the latest arrivals and exclusive deals.</p>
          </div>
          <div className={styles.newsletterForm}>
             <input type="email" placeholder="your@email.com" className={styles.newsletterInput} />
             <button className={styles.newsletterBtn}>Subscribe</button>
          </div>
        </div>
      </div>

      <div className={styles.footerMain}>
        <div className={styles.footerColumns}>
          {/* Brand Column */}
          <div className={styles.brandColumn}>
            <a href="/" className={styles.footerLogo}>
              <span className={styles.footerLogoIcon}>◆</span>
              <span className={styles.footerLogoText}>Modern<span className={styles.footerLogoAccent}>PLP</span></span>
            </a>
            <p className={styles.brandTagline}>Premium products curated for modern living.</p>
          </div>

          {/* Shop Column (Functional) */}
          <nav className={styles.footerNav}>
            <h3 className={styles.footerNavHeading}>Shop</h3>
            <ul className={styles.footerNavList}>
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <button className={styles.footerNavBtn} onClick={link.onClick}>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Static Columns */}
          {OTHER_COLUMNS.map((col) => (
            <nav key={col.heading} className={styles.footerNav}>
              <h3 className={styles.footerNavHeading}>{col.heading}</h3>
              <ul className={styles.footerNavList}>
                {col.links.map((link) => (
                  <li key={link}>
                    <button className={styles.footerNavBtn}>{link}</button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <p className={styles.copyright}>© {currentYear} ModernPLP. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <button className={styles.bottomBtn}>Privacy</button>
            <button className={styles.bottomBtn}>Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
