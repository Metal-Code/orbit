import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { T as TOKEN_KEY, a as api } from "./api-DdXEKwlO.mjs";
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
const PENDING_INVITE_KEY = "devcycle.pending_invite";
function JoinPage() {
  const navigate = useNavigate();
  const ran = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const code = new URLSearchParams(window.location.search).get("code") ?? "";
    if (!code) {
      navigate({
        to: "/dashboard"
      });
      return;
    }
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      localStorage.setItem(PENDING_INVITE_KEY, code);
      navigate({
        to: "/login"
      });
      return;
    }
    (async () => {
      try {
        const me = await api.get("/auth/me");
        if (me.data.org_id == null) {
          await api.post(`/organizations/join?invite_code=${encodeURIComponent(code)}`);
        } else {
          await api.post(`/projects/join?invite_code=${encodeURIComponent(code)}`);
        }
      } catch {
      }
      navigate({
        to: "/dashboard"
      });
    })();
  }, [navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "auth-shell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "auth-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "auth-title", children: "Joining…" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "auth-sub", children: "Please wait while we add you." })
  ] }) });
}
export {
  JoinPage as component
};
