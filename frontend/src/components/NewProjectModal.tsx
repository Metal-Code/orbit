import { useState } from "react";
import { api } from "@/lib/api";

interface Props { onClose: () => void; onCreated: () => void }

export function NewProjectModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [invite, setInvite] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      const r = await api.post("/projects/", { name, description: desc });
      if (r.data?.invite_code) {
        setInvite(r.data.invite_code);
      } else {
        onCreated();
      }
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Failed to create project");
    } finally { setLoading(false); }
  };

  const copy = async () => {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(invite);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{invite ? "Project created" : "New project"}</div>

        {invite ? (
          <>
            <p style={{ color: "var(--text-dim)", fontSize: 13, marginBottom: 12 }}>
              Share this invite code with teammates so they can join the project:
            </p>
            <div className="invite-box">
              <span className="invite-code">{invite}</span>
              <button className="btn btn-secondary" onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <button className="btn btn-primary" onClick={onCreated} style={{ width: "100%", marginTop: 8 }}>
              Continue to Dashboard
            </button>
          </>
        ) : (
          <>
            <div className="field">
              <label className="label">Project name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="field">
              <label className="label">Description (optional)</label>
              <textarea className="textarea" value={desc} onChange={(e) => setDesc(e.target.value)} />
            </div>
            {err && <div className="error-text">{err}</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" disabled={!name || loading} onClick={submit}>Create Project</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
