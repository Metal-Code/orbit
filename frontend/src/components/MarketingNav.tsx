import { Link } from "@tanstack/react-router";
import { MoonIcon } from "@/components/icons/MoonIcon";
import { OrbitLogo } from "@/components/OrbitLogo";

interface Props {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

export function MarketingNav({ theme, onToggleTheme }: Props) {
  return (
    <nav
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 28px",
        gap: 16,
      }}
    >
      <Link to="/" style={{ display: "inline-flex" }}>
        <OrbitLogo size={22} />
      </Link>
      <div
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
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          className="btn btn-ghost"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? "☀" : <MoonIcon size={16} style={{ display: "inline-block", verticalAlign: "-3px" }} />}
        </button>
        <Link to="/login" className="btn btn-ghost">Login</Link>
        <Link to="/register" className="btn btn-secondary">Register</Link>
      </div>
    </nav>
  );
}

export function useMarketingTheme() {
  // lightweight hook colocated for convenience
  return null;
}
