import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, FolderGit2 } from "lucide-react";
import { MoonIcon } from "@/components/icons/MoonIcon";
import { OrbitLogo } from "@/components/OrbitLogo";
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
  showProjectInvites?: boolean;
  onInviteOrg?: () => void;
  onInviteProject?: () => void;
}

export function Navbar({ showBack, title, hideOrgInvite, showProjectInvites, onInviteOrg, onInviteProject }: Props) {
  const [me, setMe] = useState<Me | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("orbit.theme") as "dark" | "light") || "dark";
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("orbit.theme", theme);
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
        <Link to="/dashboard" className="navbar-logo" style={{ display: "inline-flex", alignItems: "center" }}>
          {title ? title : <OrbitLogo size={26} />}
        </Link>
      </div>
      <div className="navbar-center"></div>
      <div className="navbar-right">
        <button
          className="btn btn-ghost"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀" : <MoonIcon size={16} style={{ display: "inline-block", verticalAlign: "-3px" }} />}
        </button>
        {showProjectInvites && (
          <div className="split-share" role="group" aria-label="Invite">
            {onInviteProject && (
              <button
                className="split-share-half"
                onClick={onInviteProject}
                title="Invite to Project"
                aria-label="Invite to Project"
              >
                <FolderGit2 size={16} />
              </button>
            )}
            {isOwner && me?.org_id != null && onInviteOrg && (
              <button
                className="split-share-half"
                onClick={onInviteOrg}
                title="Invite to Organization"
                aria-label="Invite to Organization"
              >
                <Building2 size={16} />
              </button>
            )}
          </div>
        )}
        {!hideOrgInvite && isOwner && me?.org_id != null && (
          <button
            className="split-share-half"
            onClick={() => setShowInvite(true)}
            title="Invite to Organization"
            aria-label="Invite to Organization"
            style={{ borderRadius: 8 }}
          >
            <Building2 size={16} />
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
