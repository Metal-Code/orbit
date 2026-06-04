import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { AddEntryModal } from "@/components/AddEntryModal";
import { EntryDetailPanel } from "@/components/EntryDetailPanel";
import { ShareProjectModal } from "@/components/ShareProjectModal";
import { TypeBadge } from "@/components/TypeBadge";
import { api, TOKEN_KEY } from "@/lib/api";
import type { Project, TimelineEntry } from "@/lib/types";

export const Route = createFileRoute("/projects/$id/timeline")({
  head: () => ({ meta: [{ title: "Timeline — DevCycle" }] }),
  component: TimelinePage,
});

const LEFT_TYPES = new Set(["Dev", "Design"]);
type Order = "oldTop" | "newTop";
const ORDER_KEY = "devcycle.timeline.order"; // { [projectId]: Order }

function TimelinePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [entries, setEntries] = useState<TimelineEntry[] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [selected, setSelected] = useState<TimelineEntry | null>(null);
  // Initialize order synchronously from localStorage so we never persist the default first
  const [order, setOrder] = useState<Order>(() => {
    if (typeof window === "undefined") return "oldTop";
    try {
      const saved = JSON.parse(localStorage.getItem(ORDER_KEY) ?? "{}");
      return saved[id] === "newTop" ? "newTop" : "oldTop";
    } catch {
      return "oldTop";
    }
  });
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const didInitialScroll = useRef(false);
  const hydratedForId = useRef<string | null>(null);

  // Re-hydrate when project id changes (lazy init only runs once)
  useEffect(() => {
    if (hydratedForId.current === id) return;
    try {
      const saved = JSON.parse(localStorage.getItem(ORDER_KEY) ?? "{}");
      setOrder(saved[id] === "newTop" ? "newTop" : "oldTop");
    } catch { /* ignore */ }
    hydratedForId.current = id;
  }, [id]);

  // Persist — but only after we've hydrated for this id, so we don't clobber the saved value
  useEffect(() => {
    if (hydratedForId.current !== id) return;
    try {
      const saved = JSON.parse(localStorage.getItem(ORDER_KEY) ?? "{}");
      saved[id] = order;
      localStorage.setItem(ORDER_KEY, JSON.stringify(saved));
    } catch { /* ignore */ }
  }, [order, id]);

  const load = useCallback(async () => {
    try {
      const [p, t] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/timeline`),
      ]);
      setProject(p.data);
      const sorted = [...t.data].sort((a: TimelineEntry, b: TimelineEntry) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      setEntries(sorted);
    } catch {
      setEntries([]);
    }
  }, [id]);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(TOKEN_KEY)) {
      navigate({ to: "/login" });
      return;
    }
    api.get("/auth/me").then((r) => setIsOwner(r.data?.role === "owner")).catch(() => {});
    load();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 5000);
    const onVis = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [load, navigate]);

  const rows = useMemo(() => {
    const e = entries ?? [];
    return order === "oldTop" ? e : [...e].reverse();
  }, [entries, order]);

  // Scroll to latest entry on first load
  useEffect(() => {
    if (didInitialScroll.current) return;
    if (!entries || entries.length === 0) return;
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = order === "oldTop" ? el.scrollHeight : 0;
      didInitialScroll.current = true;
    });
  }, [entries, order]);

  return (
    <div className="timeline-page">
      <Navbar showBack />
      <div className="timeline-header">
        <h1 className="page-title">{project?.name ?? "Timeline"}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="order-flip"
            onClick={() => {
              setOrder((o) => (o === "oldTop" ? "newTop" : "oldTop"));
              didInitialScroll.current = false;
            }}
            title={order === "oldTop" ? "Oldest → Newest (click to flip)" : "Newest → Oldest (click to flip)"}
            aria-label="Toggle sort order"
          >
            <span className="order-flip-label">{order === "oldTop" ? "Old" : "New"}</span>
            <span className="order-flip-arrow">⇅</span>
            <span className="order-flip-label">{order === "oldTop" ? "New" : "Old"}</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Entry</button>
          {isOwner && (
            <button className="btn btn-secondary" onClick={() => setShowShare(true)}>Share Project</button>
          )}
        </div>
      </div>

      <div className="timeline-scroll" ref={scrollRef}>


        {entries === null ? (
          <div className="spinner-page">Loading timeline...</div>
        ) : entries.length === 0 ? (
          <div style={{ padding: "0 32px" }}>
            <div className="empty">No entries yet. Add the first milestone of this project.</div>
          </div>
        ) : (
          <div className="timeline-container">
            <div className="timeline-spine" />
            {rows.map((entry, i) => {
              const isLeft = LEFT_TYPES.has(entry.type);
              const dt = new Date(entry.created_at);
              const stamp = `${dt.toLocaleDateString(undefined, { day: "2-digit", month: "short" })}\n${dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
              return (
                <div
                  className="timeline-row"
                  key={entry.id}
                  style={{ ["--entry-color" as any]: `var(--${entry.type.toLowerCase()})` }}
                >
                  <div className="timeline-side left">
                    {isLeft && <EntryCard entry={entry} onClick={() => setSelected(entry)} />}
                  </div>
                  <div className="timeline-side right">
                    {!isLeft && <EntryCard entry={entry} onClick={() => setSelected(entry)} />}
                  </div>
                  <div className={`timeline-connector ${isLeft ? "left" : "right"}`} />
                  <div className={`timeline-timestamp ${isLeft ? "right" : "left"}`}>
                    {stamp.split("\n").map((s, idx) => <div key={idx}>{s}</div>)}
                  </div>
                  <div className="timeline-node" />
                  {i === 0 && (
                    <div style={{ position: "absolute", top: -28, right: 0, color: "var(--text-dim)", fontSize: 12 }}>
                      {dt.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <AddEntryModal
          projectId={id}
          onClose={() => setShowAdd(false)}
          onAdded={() => { setShowAdd(false); load(); }}
        />
      )}
      {selected && <EntryDetailPanel entry={selected} onClose={() => setSelected(null)} />}
      {showShare && (
        <ShareProjectModal projectId={Number(id)} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}

function EntryCard({ entry, onClick }: { entry: TimelineEntry; onClick: () => void }) {
  return (
    <div className="timeline-entry-card" onClick={onClick}>
      <TypeBadge type={entry.type} />
      <div className="entry-title">{entry.title}</div>
      <div className="entry-meta">by {entry.added_by_name}</div>
    </div>
  );
}
