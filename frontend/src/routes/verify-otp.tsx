import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/verify-otp")({
  head: () => ({ meta: [{ title: "Verify OTP — Orbit" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    email: typeof s.email === "string" ? s.email : "",
  }),
  component: VerifyOtpPage,
});

const COUNTDOWN = 45;

function VerifyOtpPage() {
  const { email } = Route.useSearch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN);
  const [expired, setExpired] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
      const left = Math.max(0, COUNTDOWN - elapsed);
      setSecondsLeft(left);
      if (left === 0) {
        setExpired(true);
        clearInterval(id);
      }
    }, 250);
    return () => clearInterval(id);
  }, []);

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setInfo(""); setLoading(true);
    try {
      await api.post(
        `/auth/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
      );
      navigate({ to: "/login" });
    } catch (e: any) {
      const detail = e?.response?.data?.detail ?? "";
      if (/expire/i.test(detail)) setExpired(true);
      setErr(detail || "Invalid OTP");
    } finally { setLoading(false); }
  };

  const resend = async () => {
    setErr(""); setInfo(""); setResending(true);
    try {
      await api.post(`/auth/resend-otp?email=${encodeURIComponent(email)}`);
      setInfo("A new OTP has been sent to your email.");
      setOtp("");
      setExpired(false);
      startedAt.current = Date.now();
      setSecondsLeft(COUNTDOWN);
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Failed to resend OTP");
    } finally { setResending(false); }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={verify}>
        <h1 className="auth-title">Verify your email</h1>
        <p className="auth-sub">
          We sent a 6-digit code to <strong>{email || "your email"}</strong>.
        </p>

        <div className="field">
          <label className="label">Email</label>
          <input className="input" type="email" value={email} readOnly />
        </div>

        <div className="field">
          <label className="label">OTP</label>
          <input
            className="input"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="123456"
            required
            disabled={expired}
          />
        </div>

        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
          {expired ? (
            <span>OTP expired, resend?</span>
          ) : (
            <span>Code expires in {secondsLeft}s</span>
          )}
        </div>

        {err && <div className="error-text">{err}</div>}
        {info && <div style={{ color: "var(--success, #16a34a)", fontSize: 13 }}>{info}</div>}

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading || expired || otp.length !== 6}
          style={{ width: "100%", marginTop: 8 }}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={resend}
          disabled={resending || (!expired && secondsLeft > 0)}
          style={{ width: "100%", marginTop: 8 }}
        >
          {resending ? "Resending..." : expired ? "Resend OTP" : `Resend in ${secondsLeft}s`}
        </button>
      </form>
    </div>
  );
}
