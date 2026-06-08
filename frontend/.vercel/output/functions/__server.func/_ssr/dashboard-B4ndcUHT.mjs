import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { N as Navbar, S as ShareProjectModal } from "./ShareProjectModal-BgYqHjxE.mjs";
import { a as api, T as TOKEN_KEY } from "./api-CNEwPBqD.mjs";
import { F as FolderGit2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./OrbitLogo-CF1LOC5D.mjs";
import "../_libs/axios.mjs";
import "../_libs/form-data.mjs";
import "fs";
import "../_libs/combined-stream.mjs";
import "../_libs/delayed-stream.mjs";
import "path";
import "http";
import "https";
import "url";
import "../_libs/mime-types.mjs";
import "../_libs/mime-db.mjs";
import "../_libs/asynckit.mjs";
import "../_libs/es-set-tostringtag.mjs";
import "../_libs/get-intrinsic.mjs";
import "../_libs/es-object-atoms.mjs";
import "../_libs/es-errors.mjs";
import "../_libs/math-intrinsics.mjs";
import "../_libs/gopd.mjs";
import "../_libs/es-define-property.mjs";
import "../_libs/has-symbols.mjs";
import "../_libs/get-proto.mjs";
import "../_libs/dunder-proto.mjs";
import "../_libs/call-bind-apply-helpers.mjs";
import "../_libs/function-bind.mjs";
import "../_libs/hasown.mjs";
import "../_libs/has-tostringtag.mjs";
import "../_libs/proxy-from-env.mjs";
import "../_libs/https-proxy-agent.mjs";
import "net";
import "tls";
import "assert";
import "../_libs/debug.mjs";
import "../_libs/ms.mjs";
import "tty";
import "../_libs/supports-color.mjs";
import "os";
import "../_libs/has-flag.mjs";
import "../_libs/agent-base.mjs";
import "events";
import "http2";
import "../_libs/follow-redirects.mjs";
import "zlib";
function NewProjectModal({ onClose, onCreated }) {
  const [name, setName] = reactExports.useState("");
  const [desc, setDesc] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState("");
  const [invite, setInvite] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  const submit = async () => {
    setErr("");
    setLoading(true);
    try {
      const r = await api.post("/projects/", { name, description: desc });
      if (r.data?.invite_code) {
        setInvite(r.data.invite_code);
      } else {
        onCreated();
      }
    } catch (e) {
      setErr(e?.response?.data?.detail ?? "Failed to create project");
    } finally {
      setLoading(false);
    }
  };
  const copy = async () => {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(invite);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-title", children: invite ? "Project created" : "New project" }),
    invite ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--text-dim)", fontSize: 13, marginBottom: 12 }, children: "Share this invite code with teammates so they can join the project:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "invite-box", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "invite-code", children: invite }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: copy, children: copied ? "Copied" : "Copy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: onCreated, style: { width: "100%", marginTop: 8 }, children: "Continue to Dashboard" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Project name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: name, onChange: (e) => setName(e.target.value), autoFocus: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Description (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "textarea", value: desc, onChange: (e) => setDesc(e.target.value) })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-text", children: err }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: onClose, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", disabled: !name || loading, onClick: submit, children: "Create Project" })
      ] })
    ] })
  ] }) });
}
function JoinProjectModal({ onClose, onJoined }) {
  const [code, setCode] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState("");
  const submit = async () => {
    setErr("");
    setLoading(true);
    try {
      await api.post(`/projects/join?invite_code=${encodeURIComponent(code)}`);
      onJoined();
    } catch (e) {
      setErr(e?.response?.data?.detail ?? "Failed to join project");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-title", children: "Join a project" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--text-dim)", fontSize: 13, marginBottom: 12 }, children: "Paste a project invite code shared by the project owner." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Invite code" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: code, onChange: (e) => setCode(e.target.value), autoFocus: true })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-text", children: err }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", disabled: !code || loading, onClick: submit, children: "Join Project" })
    ] })
  ] }) });
}
const PENDING_INVITE_KEY = "orbit.pending_invite";
const TYPE_COLOR = {
  Dev: "var(--dev)",
  Business: "var(--business)",
  Design: "var(--design)",
  Meeting: "var(--meeting)",
  Milestone: "var(--milestone)",
  Testing: "var(--testing)",
  Discussion: "var(--discussion)",
  Research: "var(--research)",
  Documentation: "var(--documentation)",
  Planning: "var(--planning)",
  Review: "var(--review)",
  Bug: "var(--bug)",
  Deployment: "var(--deployment)",
  Release: "var(--release)"
};
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 6e4);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
function Dashboard() {
  const [projects, setProjects] = reactExports.useState(null);
  const [recent, setRecent] = reactExports.useState({});
  const [showNew, setShowNew] = reactExports.useState(false);
  const [showJoin, setShowJoin] = reactExports.useState(false);
  const [shareProjectId, setShareProjectId] = reactExports.useState(null);
  const navigate = useNavigate();
  const load = reactExports.useCallback(async () => {
    try {
      const r = await api.get("/projects/");
      const list = r.data;
      setProjects(list);
      const results = await Promise.all(list.map((p) => api.get(`/projects/${p.id}/timeline`).then((res) => [p.id, res.data]).catch(() => [p.id, []])));
      const map = {};
      for (const [pid, entries] of results) {
        map[pid] = [...entries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
      setRecent(map);
    } catch {
      setProjects([]);
    }
  }, []);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(TOKEN_KEY)) {
      navigate({
        to: "/login"
      });
      return;
    }
    const pending = typeof window !== "undefined" ? localStorage.getItem(PENDING_INVITE_KEY) : null;
    if (pending) {
      localStorage.removeItem(PENDING_INVITE_KEY);
      api.post(`/projects/join?invite_code=${encodeURIComponent(pending)}`).catch(() => {
      }).finally(() => load());
    } else {
      load();
    }
  }, [load, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "page-title", children: "Projects" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          display: "flex",
          gap: 8
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => setShowJoin(true), children: "Join Project" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: () => setShowNew(true), children: "+ New Project" })
        ] })
      ] }),
      projects === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "spinner-page", children: "Loading..." }) : projects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty", children: "No projects yet. Create your first one or join with an invite code." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "project-grid", children: projects.map((p) => {
        const orderMap = (() => {
          try {
            return JSON.parse(localStorage.getItem("orbit.timeline.order") ?? "{}");
          } catch {
            return {};
          }
        })();
        const isOldTop = orderMap[String(p.id)] === "oldTop";
        const top3 = (recent[p.id] ?? []).slice(0, 3);
        const items = isOldTop ? [...top3].reverse() : top3;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "project-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: p.name }),
            p.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "desc", style: {
              marginTop: 6
            }, children: p.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recent-activity", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "recent-activity-label", children: "Recent activity" }),
            items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "recent-empty", children: "No entries yet" }) : items.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "recent-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dot", style: {
                background: TYPE_COLOR[e.type]
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title", children: e.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "when", children: timeAgo(e.created_at) })
            ] }, e.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta", children: [
            "Created ",
            new Date(p.created_at).toLocaleDateString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "actions", style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/projects/$id/timeline", params: {
              id: String(p.id)
            }, className: "btn btn-secondary", children: "View Timeline →" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "split-share-half", onClick: () => setShareProjectId(p.id), title: "Share project", "aria-label": "Share project", style: {
              borderRadius: 8
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderGit2, { size: 16 }) })
          ] })
        ] }, p.id);
      }) })
    ] }),
    showNew && /* @__PURE__ */ jsxRuntimeExports.jsx(NewProjectModal, { onClose: () => setShowNew(false), onCreated: () => {
      setShowNew(false);
      load();
    } }),
    showJoin && /* @__PURE__ */ jsxRuntimeExports.jsx(JoinProjectModal, { onClose: () => setShowJoin(false), onJoined: () => {
      setShowJoin(false);
      load();
    } }),
    shareProjectId != null && /* @__PURE__ */ jsxRuntimeExports.jsx(ShareProjectModal, { projectId: shareProjectId, onClose: () => setShareProjectId(null) })
  ] });
}
export {
  Dashboard as component
};
