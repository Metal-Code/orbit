import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

interface Msg {
  role: "user" | "assistant";
  content: string;
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
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
      const res = await api.post(`/projects/${projectId}/chat`, {
        message: text,
        history: next.slice(-10),
      });
      const reply: string = res.data?.reply ?? res.data?.message ?? "(no response)";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I couldn't reach the chat service. Make sure the backend `/projects/:id/chat` endpoint is running.",
        },
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
      {!open && (
        <button
          className="chatbot-fab"
          style={{ left: 24, right: "auto" }}
          onClick={() => setOpen(true)}
          aria-label="Open timeline assistant"
        >
          <span className="chatbot-fab-dot" />
          Ask Timeline
        </button>
      )}

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

          <div className="chatbot-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg-${m.role}`}>
                {m.content}
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
    </>
  );
}
