import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as api } from "./api-DdXEKwlO.mjs";
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
function RegisterPage() {
  const [full_name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [err, setErr] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.post("/auth/register", {
        full_name,
        email,
        password
      });
      navigate({
        to: "/login"
      });
    } catch (e2) {
      setErr(e2?.response?.data?.detail ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "auth-shell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "auth-card", onSubmit: submit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "auth-title", children: "Create your account" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "auth-sub", children: "Start tracking your product's story." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Full name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: full_name, onChange: (e) => setName(e.target.value), required: true })
    ] }),
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
    }, children: loading ? "Creating..." : "Register" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-footer", children: [
      "Already have an account? ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", children: "Login" })
    ] })
  ] }) });
}
export {
  RegisterPage as component
};
