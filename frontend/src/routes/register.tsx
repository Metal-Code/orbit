import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — Orbit" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await api.post("/auth/register", { full_name, email, password });
      const next = `/verify-otp?email=${encodeURIComponent(email)}`;
      sessionStorage.setItem("orbit.pending_otp_email", email);
      sessionStorage.setItem("orbit.pending_otp_password", password);
      window.location.assign(next);
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start tracking your product's story.</p>
        <div className="field">
          <label className="label">Full name</label>
          <input className="input" value={full_name} onChange={(e) => setName(e.target.value)} required />
        </div>
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
          {loading ? "Creating..." : "Register"}
        </button>
        <div className="auth-footer">Already have an account? <Link to="/login">Login</Link></div>
      </form>
    </div>
  );
}
