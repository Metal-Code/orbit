import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as api, T as TOKEN_KEY } from "./api-CNEwPBqD.mjs";
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
function OrgSetupModal({ onDone }) {
  const [name, setName] = reactExports.useState("");
  const [desc, setDesc] = reactExports.useState("");
  const [code, setCode] = reactExports.useState("");
  const [invite, setInvite] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState("");
  const create = async () => {
    setErr("");
    setLoading(true);
    try {
      const r = await api.post("/organizations/", { name, description: desc });
      setInvite(r.data.invite_code);
    } catch (e) {
      setErr(e?.response?.data?.detail ?? "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };
  const join = async () => {
    setErr("");
    setLoading(true);
    try {
      await api.post(`/organizations/join?invite_code=${encodeURIComponent(code)}`);
      onDone();
    } catch (e) {
      setErr(e?.response?.data?.detail ?? "Failed to join organization");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal modal-wide", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-title", children: "Set up your organization" }),
    invite ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--text-dim)", fontSize: 13, marginBottom: 8 }, children: "Organization created. Share this invite code with your team:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "invite-box", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "invite-code", children: invite }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => navigator.clipboard.writeText(invite), children: "Copy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: onDone, style: { width: "100%" }, children: "Continue to Dashboard" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "org-split", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "org-option", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Create Organization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: name, onChange: (e) => setName(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Description (optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "textarea", value: desc, onChange: (e) => setDesc(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", disabled: !name || loading, onClick: create, style: { width: "100%" }, children: "Create Organization" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "org-option", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Join Organization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Invite code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: code, onChange: (e) => setCode(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", disabled: !code || loading, onClick: join, style: { width: "100%" }, children: "Join Organization" })
        ] })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-text", children: err })
    ] })
  ] }) });
}
function LoginPage() {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [err, setErr] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [showOrg, setShowOrg] = reactExports.useState(false);
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const r = await api.post("/auth/login", {
        email,
        password
      });
      localStorage.setItem(TOKEN_KEY, r.data.access_token);
      const me = await api.get("/auth/me");
      const pending = localStorage.getItem("orbit.pending_invite");
      if (me.data.org_id == null) {
        if (pending) {
          localStorage.removeItem("orbit.pending_invite");
          try {
            await api.post(`/organizations/join?invite_code=${encodeURIComponent(pending)}`);
            navigate({
              to: "/dashboard"
            });
            return;
          } catch {
          }
        }
        setShowOrg(true);
      } else {
        navigate({
          to: "/dashboard"
        });
      }
    } catch (e2) {
      setErr(e2?.response?.data?.detail ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "auth-card", onSubmit: submit, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "auth-title", children: "Welcome back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "auth-sub", children: "Sign in to continue building." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true })
      ] }),
      err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-text", children: err }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", type: "submit", disabled: loading, style: {
        width: "100%",
        marginTop: 8
      }, children: loading ? "Signing in..." : "Login" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-footer", children: [
        "Don't have an account? ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", children: "Register" })
      ] })
    ] }),
    showOrg && /* @__PURE__ */ jsxRuntimeExports.jsx(OrgSetupModal, { onDone: () => navigate({
      to: "/dashboard"
    }) })
  ] });
}
export {
  LoginPage as component
};
