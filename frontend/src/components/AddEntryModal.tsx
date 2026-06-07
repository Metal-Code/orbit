import { useRef, useState } from "react";
import { Image as ImageIcon, Video as VideoIcon, FileText, X } from "lucide-react";
import { api } from "@/lib/api";
import { ENTRY_TYPES, type EntryType } from "@/lib/types";

interface Props { projectId: string; onClose: () => void; onAdded: () => void }

const ACCEPT = "image/jpeg,image/png,image/gif,video/mp4,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

type AttachmentCategory = "image" | "video" | "document";

interface PendingAttachment {
  id: string; // local id
  file: File;
  file_name: string; // unique name sent to S3
  file_type: AttachmentCategory;
  label: string;
  file_url?: string; // populated after upload
  uploading: boolean;
  error?: string;
}

function categorize(mime: string): AttachmentCategory {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "document";
}

function makeUniqueName(original: string) {
  const safe = original.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${Date.now()}-${safe}`;
}

export function AddEntryModal({ projectId, onClose, onAdded }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<EntryType>("Dev");
  const [links, setLinks] = useState<{ url: string; label: string }[]>([]);
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateLink = (i: number, k: "url" | "label", v: string) => {
    setLinks((ls) => ls.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)));
  };

  const uploadOne = async (att: PendingAttachment) => {
    try {
      const { data } = await api.get("/upload/presigned-url", {
        params: { file_name: att.file_name, file_type: att.file.type },
      });
      const presignedUrl: string = data.presigned_url;
      const fileUrl: string = data.file_url;
      const putRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": att.file.type },
        body: att.file,
      });
      if (!putRes.ok) throw new Error(`S3 upload failed (${putRes.status})`);
      setAttachments((as) =>
        as.map((a) => (a.id === att.id ? { ...a, uploading: false, file_url: fileUrl } : a)),
      );
    } catch (e: any) {
      setAttachments((as) =>
        as.map((a) =>
          a.id === att.id ? { ...a, uploading: false, error: e?.message ?? "Upload failed" } : a,
        ),
      );
    }
  };

  const onPickFiles = (files: FileList | null) => {
    if (!files) return;
    const newOnes: PendingAttachment[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      file_name: makeUniqueName(file.name),
      file_type: categorize(file.type),
      label: "",
      uploading: true,
    }));
    setAttachments((as) => [...as, ...newOnes]);
    newOnes.forEach((att) => void uploadOne(att));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((as) => as.filter((a) => a.id !== id));
  };

  const updateAttachmentLabel = (id: string, label: string) => {
    setAttachments((as) => as.map((a) => (a.id === id ? { ...a, label } : a)));
  };


  const anyUploading = attachments.some((a) => a.uploading);
  const anyFailed = attachments.some((a) => a.error);

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      const readyAttachments = attachments
        .filter((a) => a.file_url && !a.error)
        .map((a) => ({
          file_name: a.file_name,
          file_url: a.file_url!,
          file_type: a.file_type,
          label: a.label.trim() || null,
        }));
      await api.post(`/projects/${projectId}/timeline`, {
        title,
        description,
        type,
        links: links.filter((l) => l.url.trim()),
        attachments: readyAttachments,
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
            {ENTRY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
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
        <div className="field">
          <label className="label">Attachments</label>
          {attachments.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
              {attachments.map((a) => {
                const Icon = a.file_type === "image" ? ImageIcon : a.file_type === "video" ? VideoIcon : FileText;
                return (
                  <div
                    key={a.id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      padding: "8px 10px",
                      border: "1px solid var(--border, #2a2a2a)",
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon size={16} />
                      <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.file.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                        {a.uploading ? "Uploading…" : a.error ? `Failed: ${a.error}` : "Ready"}
                      </div>
                      <button className="icon-btn" onClick={() => removeAttachment(a.id)} aria-label="Remove">
                        <X size={14} />
                      </button>
                    </div>
                    <input
                      className="input"
                      placeholder="Label (optional)"
                      value={a.label}
                      onChange={(e) => updateAttachmentLabel(a.id, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPT}
            style={{ display: "none" }}
            onChange={(e) => onPickFiles(e.target.files)}
          />
          <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
            + Add Attachment
          </button>
        </div>
        {err && <div className="error-text">{err}</div>}
        {anyFailed && !err && <div className="error-text">Some uploads failed. Remove them or try again.</div>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!title || loading || anyUploading}
            onClick={submit}
          >
            {anyUploading ? "Uploading…" : loading ? "Saving…" : "Add to Timeline"}
          </button>
        </div>
      </div>
    </div>
  );
}
