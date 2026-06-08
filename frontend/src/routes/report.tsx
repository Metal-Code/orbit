import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";
import { MarketingNav } from "@/components/MarketingNav";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report — Orbit" },
      { name: "description", content: "Report a bug or share a suggestion." },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("orbit.theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("orbit.theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const [description, setDescription] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const addFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const incoming = Array.from(list);
    setFiles((prev) => [...prev, ...incoming]);
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!description.trim()) {
      setErr("Please describe the issue.");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("full_name", fullName.trim());
      fd.append("email", email.trim());
      fd.append("description", description.trim());
      files.forEach((f) => fd.append("attachments", f));
      const API_URL = import.meta.env.VITE_API_URL ?? "https://orbit-met4.onrender.com";
      const response = await fetch(`${API_URL}/report/`, {
        method: "POST",
        body: fd,
      });
      if (!response.ok) throw new Error("request failed");
      await response.json().catch(() => ({}));
      setDone(true);
      setDescription(""); setFullName(""); setEmail(""); setFiles([]);
    } catch {
      setErr("Failed to send report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "var(--bg)",
        color: "var(--text)",
        position: "relative",
      }}
    >
      <MarketingNav theme={theme} onToggleTheme={toggleTheme} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)",
          alignItems: "center",
          padding: "88px clamp(28px, 5vw, 72px) 32px",
          gap: "clamp(32px, 5vw, 72px)",
        }}
      >
        {/* Left: pitch */}
        <section style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12,
              letterSpacing: "0.25em",
              color: "var(--text-dim)",
              marginBottom: 18,
              textTransform: "uppercase",
            }}
          >
            Report →
          </div>
          <h1
            style={{
              fontSize: "clamp(30px, 4vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              fontWeight: 600,
              margin: 0,
              color: "var(--text)",
            }}
          >
            Found a bug?
            <br />
            Got an idea?
          </h1>
          <p
            style={{
              marginTop: 18,
              fontSize: 15,
              color: "var(--text-dim)",
              maxWidth: 440,
              lineHeight: 1.55,
            }}
          >
            Tell us what broke or what would make Orbit better. We read every
            single one.
          </p>
        </section>

        {/* Right: form */}
        <section style={{ display: "flex", alignItems: "center", height: "100%" }}>
          {done ? (
            <div
              style={{
                width: "100%",
                padding: 24,
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--surface)",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Thanks — we got it.</div>
              <p style={{ color: "var(--text-dim)", margin: 0 }}>
                Your report is on its way. We'll follow up if we need more detail.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: 18 }}
                onClick={() => setDone(false)}
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 22,
                border: "1px solid var(--border)",
                borderRadius: 14,
                background: "var(--surface)",
              }}
            >
              <div className="field" style={{ margin: 0 }}>
                <label className="label">
                  Issue description <span style={{ color: "var(--bug)" }}>*</span>
                </label>
                <textarea
                  className="input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  placeholder="What happened? What did you expect?"
                  style={{ resize: "none", height: 110, fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="field" style={{ margin: 0 }}>
                  <label className="label">Full name</label>
                  <input
                    className="input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name (optional)"
                  />
                </div>
                <div className="field" style={{ margin: 0 }}>
                  <label className="label">Email</label>
                  <input
                    className="input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com (optional)"
                  />
                </div>
              </div>

              <div className="field" style={{ margin: 0 }}>
                <label className="label">Attachments</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="btn btn-ghost"
                    style={{
                      alignSelf: "flex-start",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      border: "1px dashed var(--border-strong)",
                    }}
                  >
                    <Paperclip size={14} /> Add files
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    hidden
                    onChange={(e) => { addFiles(e.target.files); if (fileRef.current) fileRef.current.value = ""; }}
                  />
                  {files.length > 0 && (
                    <ul
                      className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                      style={{
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        padding: 0,
                        margin: 0,
                        maxHeight: 90,
                        overflowY: "auto",
                      }}
                    >
                      {files.map((f, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            fontSize: 12.5,
                            color: "var(--text-mid)",
                            background: "var(--surface-2)",
                            padding: "6px 10px",
                            borderRadius: 6,
                          }}
                        >
                          {(() => {
                            const previewable = f.type.startsWith("image/") || f.type.startsWith("video/");
                            const openPreview = () => {
                              if (!previewable) return;
                              const url = URL.createObjectURL(f);
                              const w = window.open(url, "_blank");
                              if (w) setTimeout(() => URL.revokeObjectURL(url), 60_000);
                            };
                            return (
                              <span
                                onClick={openPreview}
                                title={previewable ? "Click to preview" : undefined}
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  cursor: previewable ? "pointer" : "default",
                                  flex: 1,
                                }}
                              >
                                {f.name} <span style={{ color: "var(--text-dim)" }}>· {(f.size / 1024).toFixed(0)} KB</span>
                              </span>
                            );
                          })()}
                          <button
                            type="button"
                            onClick={() => removeFile(i)}
                            className="btn btn-ghost"
                            style={{ padding: 2 }}
                            aria-label={`Remove ${f.name}`}
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {err && <div className="error-text" style={{ margin: 0 }}>{err}</div>}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ alignSelf: "flex-start", padding: "10px 22px", marginTop: 2 }}
              >
                {loading ? "Sending…" : "Send report →"}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
