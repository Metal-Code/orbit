import { TypeBadge } from "./TypeBadge";
import type { TimelineEntry } from "@/lib/types";

interface Props { entry: TimelineEntry; onClose: () => void }

export function EntryDetailPanel({ entry, onClose }: Props) {
  const dt = new Date(entry.created_at);
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
      </div>
    </div>
  );
}
