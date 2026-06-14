/**
 * HeroOverlay — premium streaming HUD over the gallery.
 */

import { useState, useCallback } from "react";
import { Crown, Menu, Play, Sparkles, X } from "lucide-react";

const NAV = [
  { label: "Plans", href: "#plans" },
  { label: "Setup Guide", href: "#setup" },
  { label: "Support", href: "#support" },
];

const FEATURES = [
  "24/7 Live Channels",
  "VOD Library",
  "Multi-Device",
  "HD & 4K",
  "Instant Activation",
  "24/7 Support",
];

export default function HeroOverlay() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="hero-overlay fixed inset-0 z-10 pointer-events-none">
      <div className="hud-vignette" aria-hidden />
      <div className="hud-top-fade" aria-hidden />

      <header className="hud-top hud-top--premium">
        <a href="/" className="pointer-events-auto hud-logo">
          <span className="hud-logo-mark" aria-hidden />
          signalpass<span className="hud-logo-accent">.tv</span>
        </a>

        <nav className="hud-nav hidden lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="pointer-events-auto hud-nav-link"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hud-top-actions pointer-events-auto">
          <button
            type="button"
            className="hud-menu-btn lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <a href="#login" className="hud-login hidden sm:inline">
            Login
          </a>
          <a href="#plans" className="hud-cta">
            Get Started
          </a>
        </div>
      </header>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="hud-mobile-nav pointer-events-auto lg:hidden"
          aria-label="Mobile"
        >
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hud-mobile-link"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
          <a href="#login" className="hud-mobile-link" onClick={closeMenu}>
            Login
          </a>
        </nav>
      )}

      <div className="hud-hero-panel">
        <div className="hud-glass-panel pointer-events-none">
          <p className="hud-eyebrow">Independent IPTV · Premium Access</p>
          <h1 className="hud-headline">
            IPTV That Puts You{" "}
            <span className="hud-headline-glow">In Control</span>
          </h1>
          <p className="hud-body">
            Explore a world of live TV, movies, sports, and more. Navigate,
            click, and enjoy — your way.
          </p>
          <div className="pointer-events-auto hud-panel-actions">
            <a href="#plans" className="hud-btn hud-btn--primary">
              <Crown size={14} strokeWidth={2.2} aria-hidden />
              View Plans
            </a>
            <a href="#learn-more" className="hud-btn hud-btn--ghost">
              <Sparkles size={14} strokeWidth={2} aria-hidden />
              Learn More
            </a>
          </div>
          <div className="hud-drag-hint">
            <span className="hud-drag-mouse" aria-hidden>
              <Play size={10} fill="currentColor" strokeWidth={0} />
            </span>
            Drag to explore the gallery
          </div>
        </div>
      </div>

      <footer className="hud-bottom">
        <div className="hud-feature-bar">
          {FEATURES.map((label) => (
            <span key={label} className="hud-feature-item">
              {label}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
