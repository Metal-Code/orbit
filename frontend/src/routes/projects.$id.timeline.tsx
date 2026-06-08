import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, ArrowDown, ArrowUp, MoreVertical, ArrowLeftRight } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { AddEntryModal } from "@/components/AddEntryModal";
import { EntryDetailPanel } from "@/components/EntryDetailPanel";
import { ShareProjectModal } from "@/components/ShareProjectModal";
import { InviteModal } from "@/components/InviteModal";
import { TimelineChatbot } from "@/components/TimelineChatbot";
import { TypeBadge } from "@/components/TypeBadge";
import { api, TOKEN_KEY } from "@/lib/api";
import { ENTRY_TYPES, type EntryType, type Project, type TimelineEntry } from "@/lib/types";

export const Route = createFileRoute("/projects/$id/timeline")({
  head: () => ({ meta: [{ title: "Timeline — Orbit" }] }),
  component: TimelinePage,
});

const DEFAULT_LEFT_TYPES: EntryType[] = ["Dev", "Design", "Testing", "Bug", "Deployment"];
type Order = "oldTop" | "newTop";
type Layout = "alternate" | "category";
const ORDER_KEY = "orbit.timeline.order"; // { [projectId]: Order }
const LAYOUT_KEY = "orbit.timeline.layout"; // { [projectId]: Layout }
const LEFT_TYPES_KEY = "orbit.timeline.leftTypes"; // { [projectId]: EntryType[] }

function readLeftTypes(id: string): EntryType[] {
  if (typeof window === "undefined") return DEFAULT_LEFT_TYPES;
  try {
    const saved = JSON.parse(localStorage.getItem(LEFT_TYPES_KEY) ?? "{}");
    const arr = saved[id];
    if (Array.isArray(arr)) return arr.filter((t: string) => (ENTRY_TYPES as string[]).includes(t)) as EntryType[];
  } catch { /* ignore */ }
  return DEFAULT_LEFT_TYPES;
}

function TimelinePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [entries, setEntries] = useState<TimelineEntry[] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showInviteOrg, setShowInviteOrg] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [orgId, setOrgId] = useState<number | null>(null);
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
  const [layout, setLayout] = useState<Layout>(() => {
    if (typeof window === "undefined") return "category";
    try {
      const saved = JSON.parse(localStorage.getItem(LAYOUT_KEY) ?? "{}");
      return saved[id] === "alternate" ? "alternate" : "category";
    } catch {
      return "category";
    }
  });
  const [leftTypes, setLeftTypes] = useState<EntryType[]>(() => readLeftTypes(id));
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const didInitialScroll = useRef(false);
  const hydratedForId = useRef<string | null>(null);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const viewMenuRef = useRef<HTMLDivElement | null>(null);
  const [showCategoryConfig, setShowCategoryConfig] = useState(false);
  const [pendingLeft, setPendingLeft] = useState<EntryType[]>(leftTypes);
  const categoryConfigRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showViewMenu) return;
    const onDoc = (e: MouseEvent) => {
      if (!viewMenuRef.current?.contains(e.target as Node)) setShowViewMenu(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [showViewMenu]);

  // Re-hydrate when project id changes (lazy init only runs once)
  useEffect(() => {
    if (hydratedForId.current === id) return;
    try {
      const saved = JSON.parse(localStorage.getItem(ORDER_KEY) ?? "{}");
      setOrder(saved[id] === "newTop" ? "newTop" : "oldTop");
    } catch { /* ignore */ }
    try {
      const savedL = JSON.parse(localStorage.getItem(LAYOUT_KEY) ?? "{}");
      setLayout(savedL[id] === "alternate" ? "alternate" : "category");
    } catch { /* ignore */ }
    setLeftTypes(readLeftTypes(id));
    hydratedForId.current = id;
  }, [id]);

  useEffect(() => {
    if (showCategoryConfig) setPendingLeft(leftTypes);
  }, [showCategoryConfig, leftTypes]);

  useEffect(() => {
    if (!showCategoryConfig) return;
    const onDoc = (e: MouseEvent) => {
      if (!categoryConfigRef.current?.contains(e.target as Node)) setShowCategoryConfig(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [showCategoryConfig]);

  // Persist — but only after we've hydrated for this id, so we don't clobber the saved value
  useEffect(() => {
    if (hydratedForId.current !== id) return;
    try {
      const saved = JSON.parse(localStorage.getItem(ORDER_KEY) ?? "{}");
      saved[id] = order;
      localStorage.setItem(ORDER_KEY, JSON.stringify(saved));
    } catch { /* ignore */ }
  }, [order, id]);

  useEffect(() => {
    if (hydratedForId.current !== id) return;
    try {
      const saved = JSON.parse(localStorage.getItem(LAYOUT_KEY) ?? "{}");
      saved[id] = layout;
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(saved));
    } catch { /* ignore */ }
  }, [layout, id]);

  useEffect(() => {
    if (hydratedForId.current !== id) return;
    try {
      const saved = JSON.parse(localStorage.getItem(LEFT_TYPES_KEY) ?? "{}");
      saved[id] = leftTypes;
      localStorage.setItem(LEFT_TYPES_KEY, JSON.stringify(saved));
    } catch { /* ignore */ }
  }, [leftTypes, id]);

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
    api.get("/auth/me").then((r) => {
      setIsOwner(r.data?.role === "owner");
      setOrgId(r.data?.org_id ?? null);
    }).catch(() => {});
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
      <Navbar
        showBack
        title={project?.name}
        hideOrgInvite
        showProjectInvites
        onInviteOrg={isOwner && orgId != null ? () => setShowInviteOrg(true) : undefined}
        onInviteProject={() => setShowShare(true)}
      />
      <div className="timeline-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
          <div className="view-options-wrap" ref={viewMenuRef}>
            <button
              className="order-flip view-options-btn"
              onClick={() => setShowViewMenu((v) => !v)}
              title="View options"
              aria-label="View options"
              aria-expanded={showViewMenu}
            >
              <SlidersHorizontal size={15} />
            </button>
            {showViewMenu && (
              <div className="view-options-pop" role="menu">
                <div className="view-options-group">
                  <div className="view-options-label">Layout</div>
                  <div className="view-options-row">
                    <button
                      className={layout === "alternate" ? "active" : ""}
                      onClick={() => setLayout("alternate")}
                      title="Alternate entries left/right regardless of type."
                    >Zig-zag</button>
                    <div className="category-with-config" ref={categoryConfigRef}>
                      <button
                        className={`category-main ${layout === "category" ? "active" : ""}`}
                        onClick={() => setLayout("category")}
                        title="Group entries by type — assign each type to a side."
                      >Category</button>
                      <button
                        className={`category-config-btn ${layout === "category" ? "active" : ""}`}
                        onClick={(e) => { e.stopPropagation(); setLayout("category"); setShowCategoryConfig((v) => !v); }}
                        title="Configure which types appear on each side"
                        aria-label="Configure category sides"
                      >
                        <MoreVertical size={14} />
                      </button>
                      {showCategoryConfig && (
                        <div className="category-config-pop" role="dialog" onClick={(e) => e.stopPropagation()}>
                          <div className="cc-board">
                            <CategoryColumn
                              side="left"
                              title="Left"
                              types={ENTRY_TYPES.filter((t) => pendingLeft.includes(t))}
                              onDropType={(t) => setPendingLeft((prev) => prev.includes(t) ? prev : [...prev, t])}
                              onMoveType={(t) => setPendingLeft((prev) => prev.filter((x) => x !== t))}
                            />
                            <button
                              className="cc-swap"
                              onClick={() => setPendingLeft((prev) => ENTRY_TYPES.filter((t) => !prev.includes(t)))}
                              title="Swap sides"
                              aria-label="Swap sides"
                            >
                              <ArrowLeftRight size={14} />
                            </button>
                            <CategoryColumn
                              side="right"
                              title="Right"
                              types={ENTRY_TYPES.filter((t) => !pendingLeft.includes(t))}
                              onDropType={(t) => setPendingLeft((prev) => prev.filter((x) => x !== t))}
                              onMoveType={(t) => setPendingLeft((prev) => prev.includes(t) ? prev : [...prev, t])}
                            />
                          </div>
                          <div className="category-config-footer">
                            <button
                              className="btn-ghost-sm"
                              onClick={() => setPendingLeft(DEFAULT_LEFT_TYPES)}
                              title="Reset to default split"
                            >Reset</button>
                            <button
                              className="btn-primary-sm"
                              onClick={() => { setLeftTypes(pendingLeft); setShowCategoryConfig(false); }}
                              title="Apply these sides to the timeline"
                            >Apply</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="view-options-group">
                  <div className="view-options-label">Order</div>
                  <div className="view-options-row">
                    <button
                      className={order === "oldTop" ? "active order-stack" : "order-stack"}
                      onClick={() => { setOrder("oldTop"); didInitialScroll.current = false; }}
                      title="Oldest at top, newest at bottom."
                    >
                      <span>Old</span>
                      <ArrowDown size={12} />
                      <span>New</span>
                    </button>
                    <button
                      className={order === "newTop" ? "active order-stack" : "order-stack"}
                      onClick={() => { setOrder("newTop"); didInitialScroll.current = false; }}
                      title="Newest at top, oldest at bottom."
                    >
                      <span>New</span>
                      <ArrowUp size={12} />
                      <span>Old</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add Entry</button>
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
              const isLeft = layout === "alternate" ? i % 2 === 0 : leftTypes.includes(entry.type);
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
      {showInviteOrg && orgId != null && (
        <InviteModal orgId={orgId} onClose={() => setShowInviteOrg(false)} />
      )}
      <TimelineChatbot projectId={id} />
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

function CategoryColumn({
  side,
  title,
  types,
  onDropType,
  onMoveType,
}: {
  side: "left" | "right";
  title: string;
  types: EntryType[];
  onDropType: (t: EntryType) => void;
  onMoveType: (t: EntryType) => void;
}) {
  const [over, setOver] = useState(false);
  return (
    <div
      className={`cc-col ${over ? "is-over" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const t = e.dataTransfer.getData("text/plain") as EntryType;
        if (t && (ENTRY_TYPES as string[]).includes(t)) onDropType(t);
      }}
    >
      <div className="cc-col-title">{title}</div>
      <div className="cc-col-body">
        {types.length === 0 ? (
          <div className="cc-empty">Drop types here</div>
        ) : types.map((t) => (
          <div
            key={t}
            className="cc-chip"
            draggable
            onDragStart={(e) => { e.dataTransfer.setData("text/plain", t); e.dataTransfer.effectAllowed = "move"; }}
            onDoubleClick={() => onMoveType(t)}
            title={`Drag to ${side === "left" ? "right" : "left"}, or double-click to move`}
          >
            <span className={`type-dot type-${t.toLowerCase()}`} />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
