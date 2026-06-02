import { useState } from "react";
import { api } from "@/lib/api";

interface Props { onClose: () => void; onJoined: () => void }

export function JoinProjectModal({ onClose, onJoined }: Props) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      await api.post(`/projects/join?invite_code=${encodeURIComponent(code)}`);
      onJoined();
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Failed to join project");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Join a project</div>
        <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 12 }}>
          Paste a project invite code shared by the project owner.
        </p>
        <div className="field">
          <label className="label">Invite code</label>
          <input className="input" value={code} onChange={(e) => setCode(e.target.value)} autoFocus />
        </div>
        {err && <div className="error-text">{err}</div>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!code || loading} onClick={submit}>Join Project</button>
        </div>
      </div>
    </div>
  );
}
