import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Props {
  orgId: number;
  onClose: () => void;
}

export function InviteModal({ orgId, onClose }: Props) {
  const [code, setCode] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  useEffect(() => {
    api
      .get(`/organizations/${orgId}`)
      .then((r) => setCode(r.data.invite_code))
      .catch(() => setErr("Failed to load invite code"));
  }, [orgId]);

  const link =
    code && typeof window !== "undefined"
      ? `${window.location.origin}/register?invite=${encodeURIComponent(code)}`
      : "";

  const copy = async (text: string, which: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Invite to organization</div>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 14 }}>
          Share the invite code or the joining link with your teammates.
        </p>

        {err && <div className="error-text">{err}</div>}

        {!code && !err ? (
          <div style={{ color: "var(--text-dim)", fontSize: 13 }}>Loading…</div>
        ) : code ? (
          <>
            <div className="field">
              <label className="label">Invite code</label>
              <div className="invite-box">
                <span className="invite-code">{code}</span>
                <button className="btn btn-secondary" onClick={() => copy(code, "code")}>
                  {copied === "code" ? "Copied" : "Copy code"}
                </button>
              </div>
            </div>

            <div className="field">
              <label className="label">Joining link</label>
              <div className="invite-box">
                <span
                  className="invite-code"
                  style={{ fontSize: 12, letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 12 }}
                >
                  {link}
                </span>
                <button className="btn btn-secondary" onClick={() => copy(link, "link")}>
                  {copied === "link" ? "Copied" : "Copy link"}
                </button>
              </div>
            </div>

            <button className="btn btn-primary" onClick={onClose} style={{ width: "100%", marginTop: 6 }}>
              Done
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
