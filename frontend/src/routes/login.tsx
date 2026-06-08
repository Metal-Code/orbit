import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api, TOKEN_KEY } from "@/lib/api";
import { OrgSetupModal } from "@/components/OrgSetupModal";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — Orbit" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOrg, setShowOrg] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const r = await api.post("/auth/login", { email, password });
      localStorage.setItem(TOKEN_KEY, r.data.access_token);
      const me = await api.get("/auth/me");
      const pending = localStorage.getItem("orbit.pending_invite");

      if (me.data.org_id == null) {
        if (pending) {
          localStorage.removeItem("orbit.pending_invite");
          try {
            await api.post(`/organizations/join?invite_code=${encodeURIComponent(pending)}`);
            navigate({ to: "/dashboard" });
            return;
          } catch { /* fall through to org setup */ }
        }
        setShowOrg(true);
      } else {
        // pending invite (if any) will be consumed as a project join on dashboard
        navigate({ to: "/dashboard" });
      }
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue building.</p>
        <div className="field">
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {err && <div className="error-text">{err}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: 8 }}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <div className="auth-footer">Don't have an account? <Link to="/register">Register</Link></div>
      </form>
      {showOrg && <OrgSetupModal onDone={() => navigate({ to: "/dashboard" })} />}
    </div>
  );
}
