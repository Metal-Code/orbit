import { useEffect, useRef, useState } from "react";
import { MessageSquareText, X, FileText } from "lucide-react";
import { api } from "@/lib/api";

interface ChatLink {
  url: string;
  label?: string;
}
interface ChatAttachment {
  url: string;
  label?: string;
  type?: "image" | "video" | string;
}

type Preview = { url: string; label: string; type: "image" | "video" };

interface ChatSource {
  entry_id: number;
  title: string;
  links?: ChatLink[];
  attachments?: ChatAttachment[];
}

interface Msg {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
}

interface Props {
  projectId: string;
}

export function TimelineChatbot({ projectId }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask me anything about this project's timeline entries or links." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get(`/projects/${projectId}/chat/history`);
        const items: Array<{ question: string; answer: string; sources?: ChatSource[] }> =
          Array.isArray(res.data) ? res.data : [];
        if (cancelled) return;
        if (items.length > 0) {
          const restored: Msg[] = [];
          for (const it of items) {
            restored.push({ role: "user", content: it.question });
            restored.push({
              role: "assistant",
              content: it.answer,
              sources: Array.isArray(it.sources) ? it.sources : [],
            });
          }
          setMessages(restored);
        }
      } catch {
        // keep default greeting on error
      } finally {
        if (!cancelled) setHistoryLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [projectId]);

  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPreview(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [preview]);


  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await api.post(`/projects/${projectId}/chat`, { question: text });
      const answer: string = res.data?.answer ?? res.data?.reply ?? "(no response)";
      const sources: ChatSource[] = Array.isArray(res.data?.sources) ? res.data.sources : [];
      setMessages((m) => [...m, { role: "assistant", content: answer, sources }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong, please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        className="chatbot-fab chatbot-fab-icon"
        style={{ left: 24, right: "auto" }}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close timeline assistant" : "Open timeline assistant"}
      >
        {open ? <X size={20} strokeWidth={1.75} /> : <MessageSquareText size={18} strokeWidth={1.75} />}
      </button>


      {open && (
        <aside
          className="chatbot-panel"
          style={{ left: 24, right: "auto" }}
          role="dialog"
          aria-label="Timeline assistant"
        >
          <div className="chatbot-header">
            <div>
              <div className="chatbot-title">Timeline Assistant</div>
              <div className="chatbot-sub">Ask about entries & links</div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </div>

          <div className="chatbot-messages chatbot-scroll" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg-wrap chatbot-msg-wrap-${m.role}`}>
                <div className={`chatbot-msg chatbot-msg-${m.role}`}>{m.content}</div>
                {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                  <SourcesBlock sources={m.sources} onPreview={setPreview} />
                )}
              </div>
            ))}
            {loading && <div className="chatbot-msg chatbot-msg-assistant chatbot-typing">…</div>}
          </div>

          <div className="chatbot-input-row">
            <textarea
              className="chatbot-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Ask a question…"
              rows={1}
            />
            <button className="chatbot-send" onClick={send} disabled={loading || !input.trim()} aria-label="Send">
              ↑
            </button>
          </div>
        </aside>
      )}
      {preview && (
        <div className="chatbot-lightbox" onClick={() => setPreview(null)} role="dialog" aria-label={preview.label}>
          <button className="chatbot-lightbox-close" onClick={() => setPreview(null)} aria-label="Close">×</button>
          <div className="chatbot-lightbox-content" onClick={(e) => e.stopPropagation()}>
            {preview.type === "image" ? (
              <img src={preview.url} alt={preview.label} className="chatbot-lightbox-media" />
            ) : (
              <video src={preview.url} controls autoPlay className="chatbot-lightbox-media" />
            )}
            {preview.label && <div className="chatbot-lightbox-label">{preview.label}</div>}
          </div>
        </div>
      )}
    </>
  );
}


function SourcesBlock({ sources, onPreview }: { sources: ChatSource[]; onPreview: (p: Preview) => void }) {
  const multiple = sources.length > 1;
  return (
    <div className="chatbot-sources">
      {sources.map((s) => {
        const links = s.links ?? [];
        const attachments = s.attachments ?? [];
        if (links.length === 0 && attachments.length === 0) return null;
        return (
          <div key={s.entry_id} className="chatbot-source">
            {multiple && <div className="chatbot-source-title">From: {s.title}</div>}
            {links.length > 0 && (
              <div className="chatbot-chip-row">
                {links.map((l, i) => {
                  let label = l.label;
                  if (!label) {
                    try { label = new URL(l.url).hostname; } catch { label = l.url; }
                  }
                  return (
                    <a key={i} href={l.url} target="_blank" rel="noreferrer" className="link-chip">
                      {label} ↗
                    </a>
                  );
                })}
              </div>
            )}
            {attachments.length > 0 && (
              <div className="chatbot-chip-row">
                {attachments.map((a, i) => (
                  <AttachmentChip key={i} attachment={a} onPreview={onPreview} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AttachmentChip({ attachment, onPreview }: { attachment: ChatAttachment; onPreview: (p: Preview) => void }) {
  const label = attachment.label || (() => {
    try { return new URL(attachment.url).pathname.split("/").pop() || "file"; } catch { return "file"; }
  })();
  const isImage = attachment.type === "image";
  const isVideo = attachment.type === "video";
  if (isImage || isVideo) {
    return (
      <button
        type="button"
        className="chatbot-attach-chip"
        onClick={() => onPreview({ url: attachment.url, label, type: isImage ? "image" : "video" })}
      >
        {isImage ? (
          <img src={attachment.url} alt={label} className="chatbot-attach-thumb" />
        ) : (
          <span className="chatbot-attach-thumb chatbot-attach-thumb-icon"><FileText size={14} /></span>
        )}
        <span>{label}</span>
      </button>
    );
  }
  return (
    <a href={attachment.url} target="_blank" rel="noreferrer" className="link-chip" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <FileText size={14} />
      <span>{label}</span>
    </a>
  );
}

