import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { NewProjectModal } from "@/components/NewProjectModal";
import { JoinProjectModal } from "@/components/JoinProjectModal";
import { api, TOKEN_KEY } from "@/lib/api";
import type { EntryType, Project, TimelineEntry } from "@/lib/types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — DevCycle" }] }),
  component: Dashboard,
});

const PENDING_INVITE_KEY = "devcycle.pending_invite";

const TYPE_COLOR: Record<EntryType, string> = {
  Dev: "var(--dev)",
  Business: "var(--business)",
  Design: "var(--design)",
  Meeting: "var(--meeting)",
  Milestone: "var(--milestone)",
  Testing: "var(--testing)",
  Discussion: "var(--discussion)",
  Research: "var(--research)",
  Documentation: "var(--documentation)",
  Planning: "var(--planning)",
  Review: "var(--review)",
  Bug: "var(--bug)",
  Deployment: "var(--deployment)",
  Release: "var(--release)",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function Dashboard() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [recent, setRecent] = useState<Record<number, TimelineEntry[]>>({});
  const [showNew, setShowNew] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const r = await api.get("/projects/");
      const list: Project[] = r.data;
      setProjects(list);
      const results = await Promise.all(
        list.map((p) =>
          api.get(`/projects/${p.id}/timeline`).then((res) => [p.id, res.data] as const).catch(() => [p.id, []] as const),
        ),
      );
      const map: Record<number, TimelineEntry[]> = {};
      for (const [pid, entries] of results) {
        map[pid] = [...entries].sort(
          (a: TimelineEntry, b: TimelineEntry) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      }
      setRecent(map);
    } catch {
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(TOKEN_KEY)) {
      navigate({ to: "/login" });
      return;
    }
    // Consume pending invite (from /join?code=...) — user already has an org here,
    // so try joining a project.
    const pending = typeof window !== "undefined" ? localStorage.getItem(PENDING_INVITE_KEY) : null;
    if (pending) {
      localStorage.removeItem(PENDING_INVITE_KEY);
      api.post(`/projects/join?invite_code=${encodeURIComponent(pending)}`)
        .catch(() => {})
        .finally(() => load());
    } else {
      load();
    }
  }, [load, navigate]);

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="page-header">
          <h1 className="page-title">Projects</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => setShowJoin(true)}>
              Join Project
            </button>
            <button className="btn btn-primary" onClick={() => setShowNew(true)}>+ New Project</button>
          </div>
        </div>
        {projects === null ? (
          <div className="spinner-page">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="empty">No projects yet. Create your first one or join with an invite code.</div>
        ) : (
          <div className="project-grid">
            {projects.map((p) => {
              const orderMap = (() => {
                try { return JSON.parse(localStorage.getItem("devcycle.timeline.order") ?? "{}"); }
                catch { return {}; }
              })();
              const isOldTop = orderMap[String(p.id)] === "oldTop";
              const top3 = (recent[p.id] ?? []).slice(0, 3);
              const items = isOldTop ? [...top3].reverse() : top3;
              return (
                <div key={p.id} className="project-card">
                  <div>
                    <h3>{p.name}</h3>
                    {p.description && <p className="desc" style={{ marginTop: 6 }}>{p.description}</p>}
                  </div>
                  <div className="recent-activity">
                    <div className="recent-activity-label">Recent activity</div>
                    {items.length === 0 ? (
                      <div className="recent-empty">No entries yet</div>
                    ) : (
                      items.map((e) => (
                        <div key={e.id} className="recent-item">
                          <span className="dot" style={{ background: TYPE_COLOR[e.type] }} />
                          <span className="title">{e.title}</span>
                          <span className="when">{timeAgo(e.created_at)}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="meta">Created {new Date(p.created_at).toLocaleDateString()}</div>
                  <div className="actions">
                    <Link to="/projects/$id/timeline" params={{ id: String(p.id) }} className="btn btn-secondary">
                      View Timeline →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showNew && (
        <NewProjectModal
          onClose={() => setShowNew(false)}
          onCreated={() => { setShowNew(false); load(); }}
        />
      )}
      {showJoin && (
        <JoinProjectModal
          onClose={() => setShowJoin(false)}
          onJoined={() => { setShowJoin(false); load(); }}
        />
      )}
    </div>
  );
}
