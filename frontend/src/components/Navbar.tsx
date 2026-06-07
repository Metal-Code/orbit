import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, TOKEN_KEY } from "@/lib/api";
import { InviteModal } from "./InviteModal";

interface Me {
  id: number;
  full_name: string;
  email: string;
  role: string;
  org_id: number | null;
}


interface Props {
  showBack?: boolean;
  title?: string;
  hideOrgInvite?: boolean;
}

export function Navbar({ showBack, title, hideOrgInvite }: Props) {
  const [me, setMe] = useState<Me | null>(null);
  const [showInvite, setShowInvite] = useState(false);
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
    }).catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate({ to: "/login" });
  };

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const isOwner = me?.role === "owner";

  return (
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {showBack && (
          <Link to="/dashboard" className="btn btn-ghost">← Back to Projects</Link>
        )}
        <Link to="/dashboard" className="navbar-logo">{title ?? "DevCycle"}</Link>
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-right">
        <button
          className="btn btn-ghost"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
        {!hideOrgInvite && isOwner && me?.org_id != null && (
          <button className="btn btn-secondary" onClick={() => setShowInvite(true)}>
            Invite to Org
          </button>
        )}
        {me && (
          <>
            <span style={{ fontSize: 13 }}>{me.full_name}</span>
            <span
              className="badge role-badge"
              title={me.role.charAt(0).toUpperCase() + me.role.slice(1)}
              aria-label={me.role}
            >
              {me.role.charAt(0).toUpperCase()}
            </span>
            <button className="btn btn-secondary" onClick={logout}>Logout</button>
          </>
        )}
      </div>
      {showInvite && me?.org_id != null && (
        <InviteModal orgId={me.org_id} onClose={() => setShowInvite(false)} />
      )}
    </nav>
  );
}
