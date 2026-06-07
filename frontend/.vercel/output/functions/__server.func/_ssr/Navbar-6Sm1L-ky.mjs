import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { M as MoonIcon } from "./Moonicon-fPehC_Ph.mjs";
import { a as api, T as TOKEN_KEY } from "./api-DdXEKwlO.mjs";
import { B as Building2, c as FolderGit2 } from "../_libs/lucide-react.mjs";
function InviteModal({ orgId, onClose }) {
  const [code, setCode] = reactExports.useState(null);
  const [err, setErr] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState(null);
  reactExports.useEffect(() => {
    api.get(`/organizations/${orgId}`).then((r) => setCode(r.data.invite_code)).catch(() => setErr("Failed to load invite code"));
  }, [orgId]);
  const link = code && typeof window !== "undefined" ? `${window.location.origin}/join?code=${encodeURIComponent(code)}` : "";
  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-title", children: "Invite to organization" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--text-dim)", fontSize: 13, marginBottom: 14 }, children: "Share the invite code or the joining link with your teammates." }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-text", children: err }),
    !code && !err ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--text-dim)", fontSize: 13 }, children: "Loading…" }) : code ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Invite code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "invite-box", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "invite-code", children: code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => copy(code, "code"), children: copied === "code" ? "Copied" : "Copy code" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Joining link" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "invite-box", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "invite-code",
              style: { fontSize: 12, letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 12 },
              children: link
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => copy(link, "link"), children: copied === "link" ? "Copied" : "Copy link" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: onClose, style: { width: "100%", marginTop: 6 }, children: "Done" })
    ] }) : null
  ] }) });
}
function Navbar({ showBack, title, hideOrgInvite, showProjectInvites, onInviteOrg, onInviteProject }) {
  const [me, setMe] = reactExports.useState(null);
  const [showInvite, setShowInvite] = reactExports.useState(false);
  const [theme, setTheme] = reactExports.useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("devcycle.theme") || "dark";
  });
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("devcycle.theme", theme);
  }, [theme]);
  reactExports.useEffect(() => {
    api.get("/auth/me").then((r) => {
      setMe(r.data);
    }).catch(() => {
    });
  }, []);
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate({ to: "/login" });
  };
  const toggleTheme = () => setTheme((t) => t === "dark" ? "light" : "dark");
  const isOwner = me?.role === "owner";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "navbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 16 }, children: [
      showBack && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "btn btn-ghost", children: "← Back to Projects" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", className: "navbar-logo", children: title ?? "DevCycle" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "navbar-center" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "navbar-right", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "btn btn-ghost",
          onClick: toggleTheme,
          title: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
          "aria-label": "Toggle theme",
          children: theme === "dark" ? "☀" : /* @__PURE__ */ jsxRuntimeExports.jsx(MoonIcon, { size: 16, style: { display: "inline-block", verticalAlign: "-3px" } })
        }
      ),
      showProjectInvites && isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "split-share", role: "group", "aria-label": "Invite", children: [
        me?.org_id != null && onInviteOrg && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "split-share-half",
            onClick: onInviteOrg,
            title: "Invite to Organization",
            "aria-label": "Invite to Organization",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 16 })
          }
        ),
        onInviteProject && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "split-share-half",
            onClick: onInviteProject,
            title: "Invite to Project",
            "aria-label": "Invite to Project",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderGit2, { size: 16 })
          }
        )
      ] }),
      !hideOrgInvite && isOwner && me?.org_id != null && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => setShowInvite(true), children: "Invite to Org" }),
      me && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 13 }, children: me.full_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "badge role-badge",
            title: me.role.charAt(0).toUpperCase() + me.role.slice(1),
            "aria-label": me.role,
            children: me.role.charAt(0).toUpperCase()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: logout, children: "Logout" })
      ] })
    ] }),
    showInvite && me?.org_id != null && /* @__PURE__ */ jsxRuntimeExports.jsx(InviteModal, { orgId: me.org_id, onClose: () => setShowInvite(false) })
  ] });
}
export {
  InviteModal as I,
  Navbar as N
};
