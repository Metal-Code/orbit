import { FileText } from "lucide-react";
import { TypeBadge } from "./TypeBadge";
import type { TimelineEntry, TimelineAttachment } from "@/lib/types";

interface Props { entry: TimelineEntry; onClose: () => void }

export function EntryDetailPanel({ entry, onClose }: Props) {
  const dt = new Date(entry.created_at);
  const attachments = entry.attachments ?? [];
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal entry-modal" onClick={(e) => e.stopPropagation()}>
        <button className="panel-close" onClick={onClose}>×</button>
        <TypeBadge type={entry.type} />
        <h2 className="panel-title">{entry.title}</h2>

        {entry.description && (
          <div className="panel-section">
            <h4>Description</h4>
            <div className="panel-desc">{entry.description}</div>
          </div>
        )}

        <div className="panel-section">
          <h4>Added by</h4>
          <div style={{ fontSize: 13 }}>{entry.added_by_name}</div>
          <div style={{ fontSize: 12, color: "var(--text-dim)" }}>{entry.added_by_email}</div>
        </div>

        <div className="panel-section">
          <h4>Date</h4>
          <div style={{ fontSize: 13 }}>
            {dt.toLocaleDateString(undefined, { dateStyle: "medium" })} · {dt.toLocaleTimeString(undefined, { timeStyle: "short" })}
          </div>
        </div>

        {entry.links && entry.links.length > 0 && (
          <div className="panel-section">
            <h4>Links</h4>
            <div>
              {entry.links.map((l) => {
                let label = l.label;
                if (!label) {
                  try { label = new URL(l.url).hostname; } catch { label = l.url; }
                }
                return (
                  <a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="link-chip">
                    {label} ↗
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="panel-section">
            <h4>Attachments</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {attachments.map((a) => (
                <AttachmentItem key={a.id} attachment={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AttachmentItem({ attachment }: { attachment: TimelineAttachment }) {
  const { file_type, file_url, file_name, label } = attachment;
  const displayName = label || file_name;

  if (file_type === "image") {
    return (
      <a href={file_url} target="_blank" rel="noreferrer" style={{ display: "block" }}>
        <img
          src={file_url}
          alt={displayName}
          style={{
            maxWidth: "100%",
            maxHeight: 220,
            borderRadius: 8,
            border: "1px solid var(--border, #2a2a2a)",
            display: "block",
          }}
        />
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>{displayName}</div>
      </a>
    );
  }

  if (file_type === "video") {
    return (
      <div>
        <video
          src={file_url}
          controls
          style={{
            maxWidth: "100%",
            maxHeight: 260,
            borderRadius: 8,
            border: "1px solid var(--border, #2a2a2a)",
            display: "block",
          }}
        />
        <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>{displayName}</div>
      </div>
    );
  }

  return (
    <a
      href={file_url}
      target="_blank"
      rel="noreferrer"
      className="link-chip"
      style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
    >
      <FileText size={16} />
      <span>{displayName}</span>
    </a>
  );
}
