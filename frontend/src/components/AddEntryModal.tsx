import { useState } from "react";
import { api } from "@/lib/api";

interface Props { projectId: string; onClose: () => void; onAdded: () => void }
type EntryType = "Dev" | "Business" | "Design" | "Meeting" | "Milestone";

export function AddEntryModal({ projectId, onClose, onAdded }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<EntryType>("Dev");
  const [links, setLinks] = useState<{ url: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const updateLink = (i: number, k: "url" | "label", v: string) => {
    setLinks((ls) => ls.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)));
  };

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      await api.post(`/projects/${projectId}/timeline`, {
        title, description, type,
        links: links.filter((l) => l.url.trim()),
      });
      onAdded();
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Failed to add entry");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Add timeline entry</div>
        <div className="field">
          <label className="label">Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        </div>
        <div className="field">
          <label className="label">Description</label>
          <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Type</label>
          <select className="select" value={type} onChange={(e) => setType(e.target.value as EntryType)}>
            <option>Dev</option><option>Business</option><option>Design</option>
            <option>Meeting</option><option>Milestone</option>
          </select>
        </div>
        <div className="field">
          <label className="label">Links</label>
          {links.map((l, i) => (
            <div className="link-row" key={i}>
              <input className="input" placeholder="https://..." value={l.url} onChange={(e) => updateLink(i, "url", e.target.value)} />
              <input className="input" placeholder="Label" value={l.label} onChange={(e) => updateLink(i, "label", e.target.value)} />
              <button className="icon-btn" onClick={() => setLinks((ls) => ls.filter((_, idx) => idx !== i))}>×</button>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={() => setLinks((ls) => [...ls, { url: "", label: "" }])}>
            + Add Link
          </button>
        </div>
        {err && <div className="error-text">{err}</div>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!title || loading} onClick={submit}>Add to Timeline</button>
        </div>
      </div>
    </div>
  );
}
