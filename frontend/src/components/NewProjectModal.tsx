import { useState } from "react";
import { api } from "@/lib/api";

interface Props { onClose: () => void; onCreated: () => void }

export function NewProjectModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      await api.post("/projects/", { name, description: desc });
      onCreated();
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Failed to create project");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">New project</div>
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
      </div>
    </div>
  );
}
