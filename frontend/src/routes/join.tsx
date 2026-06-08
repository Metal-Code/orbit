import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { api, TOKEN_KEY } from "@/lib/api";

export const Route = createFileRoute("/join")({
  head: () => ({ meta: [{ title: "Join — Orbit" }] }),
  component: JoinPage,
});

const PENDING_INVITE_KEY = "orbit.pending_invite";

function JoinPage() {
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const code = new URLSearchParams(window.location.search).get("code") ?? "";
    if (!code) {
      navigate({ to: "/dashboard" });
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      localStorage.setItem(PENDING_INVITE_KEY, code);
      navigate({ to: "/login" });
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
      } catch { /* ignore — user will see dashboard either way */ }
      navigate({ to: "/dashboard" });
    })();
  }, [navigate]);

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-title">Joining…</h1>
        <p className="auth-sub">Please wait while we add you.</p>
      </div>
    </div>
  );
}
