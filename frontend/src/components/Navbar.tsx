import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, TOKEN_KEY } from "@/lib/api";

interface Me {
  id: number;
  full_name: string;
  email: string;
  role: string;
  org_id: number | null;
}
interface Org { id: number; name: string }

interface Props {
  showBack?: boolean;
}

export function Navbar({ showBack }: Props) {
  const [me, setMe] = useState<Me | null>(null);
  const [org, setOrg] = useState<Org | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("devcycle.theme") as "dark" | "light") || "dark";
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("devcycle.theme", theme);
  }, [theme]);

  useEffect(() => {
    api.get("/auth/me").then((r) => {
      setMe(r.data);
      if (r.data.org_id) {
        api.get(`/organizations/${r.data.org_id}`).then((o) => setOrg(o.data)).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate({ to: "/login" });
  };

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {showBack && (
          <Link to="/dashboard" className="btn btn-ghost">← Back to Projects</Link>
        )}
        <Link to="/dashboard" className="navbar-logo">DevCycle</Link>
      </div>
      <div className="navbar-center">{org?.name ?? ""}</div>
      <div className="navbar-right">
        <button
          className="btn btn-ghost"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
        {me && (
          <>
            <span style={{ fontSize: 13 }}>{me.full_name}</span>
            <span className="badge">{me.role}</span>
            <button className="btn btn-secondary" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
