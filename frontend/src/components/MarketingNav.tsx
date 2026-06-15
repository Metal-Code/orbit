import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { MoonIcon } from "@/components/icons/MoonIcon";
import { OrbitLogo } from "@/components/OrbitLogo";

interface Props {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export function MarketingNav({ theme, onToggleTheme }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="marketing-nav"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100, // Elevated to be above mobile menu and visual content
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 28px",
          gap: 16,
        }}
      >
        <Link to="/" style={{ display: "inline-flex" }} onClick={() => setIsMenuOpen(false)}>
          <OrbitLogo size={22} />
        </Link>
        
        {/* Desktop Navigation Links */}
        <div
          className="marketing-nav-center"
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Link
            to="/"
            className="btn btn-ghost"
            activeOptions={{ exact: true }}
            activeProps={{ style: { color: "var(--text)", background: "var(--surface)" } }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="btn btn-ghost"
            activeProps={{ style: { color: "var(--text)", background: "var(--surface)" } }}
          >
            About
          </Link>
          <Link
            to="/report"
            className="btn btn-ghost"
            activeProps={{ style: { color: "var(--text)", background: "var(--surface)" } }}
          >
            Report
          </Link>
        </div>

        <div className="marketing-nav-right" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className="btn btn-ghost"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀" : <MoonIcon size={16} style={{ display: "inline-block", verticalAlign: "-3px" }} />}
          </button>
          
          <div className="marketing-nav-desktop-actions" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="marketing-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: "none",
              border: "none",
              color: "var(--text)",
              cursor: "pointer",
              padding: 8,
              display: "none", // Controlled by CSS media queries
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      {isMenuOpen && (
        <div
          className="marketing-mobile-drawer"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--bg)",
            zIndex: 90,
            display: "flex",
            flexDirection: "column",
            padding: "80px 24px 24px",
            gap: 20,
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="btn btn-ghost"
              style={{ justifyContent: "flex-start", padding: "12px 16px", fontSize: 16 }}
              activeOptions={{ exact: true }}
              activeProps={{ style: { color: "var(--text)", background: "var(--surface)" } }}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="btn btn-ghost"
              style={{ justifyContent: "flex-start", padding: "12px 16px", fontSize: 16 }}
              activeProps={{ style: { color: "var(--text)", background: "var(--surface)" } }}
            >
              About
            </Link>
            <Link
              to="/report"
              onClick={() => setIsMenuOpen(false)}
              className="btn btn-ghost"
              style={{ justifyContent: "flex-start", padding: "12px 16px", fontSize: 16 }}
              activeProps={{ style: { color: "var(--text)", background: "var(--surface)" } }}
            >
              Report
            </Link>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "8px 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="btn btn-ghost"
              style={{ justifyContent: "center", padding: "12px 16px", fontSize: 16 }}
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="btn btn-secondary"
              style={{ justifyContent: "center", padding: "12px 16px", fontSize: 16 }}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export function useMarketingTheme() {
  return null;
}
