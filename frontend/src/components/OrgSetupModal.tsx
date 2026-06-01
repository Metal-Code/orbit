import { useState } from "react";
import { api } from "@/lib/api";

interface Props { onDone: () => void }

export function OrgSetupModal({ onDone }: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [code, setCode] = useState("");
  const [invite, setInvite] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const create = async () => {
    setErr(""); setLoading(true);
    try {
      const r = await api.post("/organizations/", { name, description: desc });
      setInvite(r.data.invite_code);
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Failed to create organization");
    } finally { setLoading(false); }
  };

  const join = async () => {
    setErr(""); setLoading(true);
    try {
      await api.post(`/organizations/join?invite_code=${encodeURIComponent(code)}`);
      onDone();
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Failed to join organization");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal modal-wide">
        <div className="modal-title">Set up your organization</div>
        {invite ? (
          <div>
            <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 8 }}>
              Organization created. Share this invite code with your team:
            </p>
            <div className="invite-box">
              <span className="invite-code">{invite}</span>
              <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(invite)}>Copy</button>
            </div>
            <button className="btn btn-primary" onClick={onDone} style={{ width: "100%" }}>Continue to Dashboard</button>
          </div>
        ) : (
          <>
            <div className="org-split">
              <div className="org-option">
                <h4>Create Organization</h4>
                <div className="field">
                  <label className="label">Name</label>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="field">
                  <label className="label">Description (optional)</label>
                  <textarea className="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} />
                </div>
                <button className="btn btn-primary" disabled={!name || loading} onClick={create} style={{ width: "100%" }}>
                  Create Organization
                </button>
              </div>
              <div className="org-option">
                <h4>Join Organization</h4>
                <div className="field">
                  <label className="label">Invite code</label>
                  <input className="input" value={code} onChange={(e) => setCode(e.target.value)} />
                </div>
                <button className="btn btn-secondary" disabled={!code || loading} onClick={join} style={{ width: "100%" }}>
                  Join Organization
                </button>
              </div>
            </div>
            {err && <div className="error-text">{err}</div>}
          </>
        )}
      </div>
    </div>
  );
}
