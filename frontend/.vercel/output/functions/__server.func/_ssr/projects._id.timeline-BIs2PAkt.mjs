import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { N as Navbar, I as InviteModal } from "./Navbar-6Sm1L-ky.mjs";
import { a as api, T as TOKEN_KEY } from "./api-DdXEKwlO.mjs";
import { R as Route } from "./router-C4U2bwYA.mjs";
import { S as SlidersHorizontal, E as EllipsisVertical, A as ArrowLeftRight, a as ArrowDown, b as ArrowUp, I as Image, V as Video, F as FileText, X, M as MessageSquareText } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./Moonicon-fPehC_Ph.mjs";
import "../_libs/axios.mjs";
import "../_libs/form-data.mjs";
import "fs";
import "../_libs/combined-stream.mjs";
import "../_libs/delayed-stream.mjs";
import "path";
import "http";
import "https";
import "url";
import "../_libs/mime-types.mjs";
import "../_libs/mime-db.mjs";
import "../_libs/asynckit.mjs";
import "../_libs/es-set-tostringtag.mjs";
import "../_libs/get-intrinsic.mjs";
import "../_libs/es-object-atoms.mjs";
import "../_libs/es-errors.mjs";
import "../_libs/math-intrinsics.mjs";
import "../_libs/gopd.mjs";
import "../_libs/es-define-property.mjs";
import "../_libs/has-symbols.mjs";
import "../_libs/get-proto.mjs";
import "../_libs/dunder-proto.mjs";
import "../_libs/call-bind-apply-helpers.mjs";
import "../_libs/function-bind.mjs";
import "../_libs/hasown.mjs";
import "../_libs/has-tostringtag.mjs";
import "../_libs/proxy-from-env.mjs";
import "../_libs/https-proxy-agent.mjs";
import "net";
import "tls";
import "assert";
import "../_libs/debug.mjs";
import "../_libs/ms.mjs";
import "tty";
import "../_libs/supports-color.mjs";
import "os";
import "../_libs/has-flag.mjs";
import "../_libs/agent-base.mjs";
import "events";
import "http2";
import "../_libs/follow-redirects.mjs";
import "zlib";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
const ENTRY_TYPES = [
  "Dev",
  "Business",
  "Design",
  "Meeting",
  "Milestone",
  "Testing",
  "Discussion",
  "Research",
  "Documentation",
  "Planning",
  "Review",
  "Bug",
  "Deployment",
  "Release"
];
const ACCEPT = "image/jpeg,image/png,image/gif,video/mp4,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
function categorize(mime) {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "document";
}
function makeUniqueName(original) {
  const safe = original.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${Date.now()}-${safe}`;
}
function AddEntryModal({ projectId, onClose, onAdded }) {
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [type, setType] = reactExports.useState("Dev");
  const [links, setLinks] = reactExports.useState([]);
  const [attachments, setAttachments] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState("");
  const fileInputRef = reactExports.useRef(null);
  const updateLink = (i, k, v) => {
    setLinks((ls) => ls.map((l, idx) => idx === i ? { ...l, [k]: v } : l));
  };
  const uploadOne = async (att) => {
    try {
      const { data } = await api.get("/upload/presigned-url", {
        params: { file_name: att.file_name, file_type: att.file.type }
      });
      const presignedUrl = data.presigned_url;
      const fileUrl = data.file_url;
      const putRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": att.file.type },
        body: att.file
      });
      if (!putRes.ok) throw new Error(`S3 upload failed (${putRes.status})`);
      setAttachments(
        (as) => as.map((a) => a.id === att.id ? { ...a, uploading: false, file_url: fileUrl } : a)
      );
    } catch (e) {
      setAttachments(
        (as) => as.map(
          (a) => a.id === att.id ? { ...a, uploading: false, error: e?.message ?? "Upload failed" } : a
        )
      );
    }
  };
  const onPickFiles = (files) => {
    if (!files) return;
    const newOnes = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      file_name: makeUniqueName(file.name),
      file_type: categorize(file.type),
      label: "",
      uploading: true
    }));
    setAttachments((as) => [...as, ...newOnes]);
    newOnes.forEach((att) => void uploadOne(att));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const removeAttachment = (id) => {
    setAttachments((as) => as.filter((a) => a.id !== id));
  };
  const updateAttachmentLabel = (id, label) => {
    setAttachments((as) => as.map((a) => a.id === id ? { ...a, label } : a));
  };
  const anyUploading = attachments.some((a) => a.uploading);
  const anyFailed = attachments.some((a) => a.error);
  const submit = async () => {
    setErr("");
    setLoading(true);
    try {
      const readyAttachments = attachments.filter((a) => a.file_url && !a.error).map((a) => ({
        file_name: a.file_name,
        file_url: a.file_url,
        file_type: a.file_type,
        label: a.label.trim() || null
      }));
      await api.post(`/projects/${projectId}/timeline`, {
        title,
        description,
        type,
        links: links.filter((l) => l.url.trim()),
        attachments: readyAttachments
      });
      onAdded();
    } catch (e) {
      setErr(e?.response?.data?.detail ?? "Failed to add entry");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-title", children: "Add timeline entry" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Title" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: title, onChange: (e) => setTitle(e.target.value), autoFocus: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "textarea", value: description, onChange: (e) => setDescription(e.target.value) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Type" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "select", value: type, onChange: (e) => setType(e.target.value), children: ENTRY_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Links" }),
      links.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "link-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", placeholder: "https://...", value: l.url, onChange: (e) => updateLink(i, "url", e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", placeholder: "Label", value: l.label, onChange: (e) => updateLink(i, "label", e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", onClick: () => setLinks((ls) => ls.filter((_, idx) => idx !== i)), children: "×" })
      ] }, i)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => setLinks((ls) => [...ls, { url: "", label: "" }]), children: "+ Add Link" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Attachments" }),
      attachments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }, children: attachments.map((a) => {
        const Icon = a.file_type === "image" ? Image : a.file_type === "video" ? Video : FileText;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 6,
              padding: "8px 10px",
              border: "1px solid var(--border, #2a2a2a)",
              borderRadius: 8,
              fontSize: 13
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 16 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: a.file.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 11, color: "var(--text-dim)" }, children: a.uploading ? "Uploading…" : a.error ? `Failed: ${a.error}` : "Ready" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", onClick: () => removeAttachment(a.id), "aria-label": "Remove", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "input",
                  placeholder: "Label (optional)",
                  value: a.label,
                  onChange: (e) => updateAttachmentLabel(a.id, e.target.value)
                }
              )
            ]
          },
          a.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          multiple: true,
          accept: ACCEPT,
          style: { display: "none" },
          onChange: (e) => onPickFiles(e.target.files)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => fileInputRef.current?.click(), children: "+ Add Attachment" })
    ] }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-text", children: err }),
    anyFailed && !err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-text", children: "Some uploads failed. Remove them or try again." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "btn btn-primary",
          disabled: !title || loading || anyUploading,
          onClick: submit,
          children: anyUploading ? "Uploading…" : loading ? "Saving…" : "Add to Timeline"
        }
      )
    ] })
  ] }) });
}
function TypeBadge({ type }) {
  const t = type.toLowerCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "type-badge", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `type-dot type-${t}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: type })
  ] });
}
function EntryDetailPanel({ entry, onClose }) {
  const dt = new Date(entry.created_at);
  const attachments = entry.attachments ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal entry-modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "panel-close", onClick: onClose, children: "×" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: entry.type }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "panel-title", children: entry.title }),
    entry.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel-desc", children: entry.description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Added by" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13 }, children: entry.added_by_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "var(--text-dim)" }, children: entry.added_by_email })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Date" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: 13 }, children: [
        dt.toLocaleDateString(void 0, { dateStyle: "medium" }),
        " · ",
        dt.toLocaleTimeString(void 0, { timeStyle: "short" })
      ] })
    ] }),
    entry.links && entry.links.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Links" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: entry.links.map((l) => {
        let label = l.label;
        if (!label) {
          try {
            label = new URL(l.url).hostname;
          } catch {
            label = l.url;
          }
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: l.url, target: "_blank", rel: "noreferrer", className: "link-chip", children: [
          label,
          " ↗"
        ] }, l.id);
      }) })
    ] }),
    attachments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Attachments" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: attachments.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(AttachmentItem, { attachment: a }, a.id)) })
    ] })
  ] }) });
}
function AttachmentItem({ attachment }) {
  const { file_type, file_url, file_name, label } = attachment;
  const displayName = label || file_name;
  if (file_type === "image") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: file_url, target: "_blank", rel: "noreferrer", style: { display: "block" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: file_url,
          alt: displayName,
          style: {
            maxWidth: "100%",
            maxHeight: 220,
            borderRadius: 8,
            border: "1px solid var(--border, #2a2a2a)",
            display: "block"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "var(--text-dim)", marginTop: 4 }, children: displayName })
    ] });
  }
  if (file_type === "video") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "video",
        {
          src: file_url,
          controls: true,
          style: {
            maxWidth: "100%",
            maxHeight: 260,
            borderRadius: 8,
            border: "1px solid var(--border, #2a2a2a)",
            display: "block"
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 12, color: "var(--text-dim)", marginTop: 4 }, children: displayName })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "a",
    {
      href: file_url,
      target: "_blank",
      rel: "noreferrer",
      className: "link-chip",
      style: { display: "inline-flex", alignItems: "center", gap: 8 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 16 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: displayName })
      ]
    }
  );
}
function ShareProjectModal({ projectId, initialCode, onClose }) {
  const [code, setCode] = reactExports.useState(initialCode ?? null);
  const [err, setErr] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (initialCode) return;
    api.get(`/projects/${projectId}/invite-code`).then((r) => setCode(r.data.invite_code)).catch(() => setErr("Failed to load invite code"));
  }, [projectId, initialCode]);
  const link = code && typeof window !== "undefined" ? `${window.location.origin}/join?code=${encodeURIComponent(code)}` : "";
  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-title", children: "Share project" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--text-dim)", fontSize: 13, marginBottom: 14 }, children: "Share this invite code or link with teammates to give them access to this project." }),
    err && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "error-text", children: err }),
    !code && !err ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "var(--text-dim)", fontSize: 13 }, children: "Loading…" }) : code ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Invite code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "invite-box", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "invite-code", children: code }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => copy(code, "code"), children: copied === "code" ? "Copied" : "Copy code" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Joining link" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "invite-box", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "invite-code",
              style: { fontSize: 12, letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 12 },
              children: link
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-secondary", onClick: () => copy(link, "link"), children: copied === "link" ? "Copied" : "Copy link" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: onClose, style: { width: "100%", marginTop: 6 }, children: "Done" })
    ] }) : null
  ] }) });
}
function TimelineChatbot({ projectId }) {
  const [open, setOpen] = reactExports.useState(false);
  const [messages, setMessages] = reactExports.useState([
    { role: "assistant", content: "Hi! Ask me anything about this project's timeline entries or links." }
  ]);
  const [input, setInput] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const scrollRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);
  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await api.post(`/projects/${projectId}/chat`, {
        message: text,
        history: next.slice(-10)
      });
      const reply = res.data?.reply ?? res.data?.message ?? "(no response)";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "I couldn't reach the chat service. Make sure the backend `/projects/:id/chat` endpoint is running."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "chatbot-fab chatbot-fab-icon",
        style: { left: 24, right: "auto" },
        onClick: () => setOpen((o) => !o),
        "aria-label": open ? "Close timeline assistant" : "Open timeline assistant",
        children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 20, strokeWidth: 1.75 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareText, { size: 18, strokeWidth: 1.75 })
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "aside",
      {
        className: "chatbot-panel",
        style: { left: 24, right: "auto" },
        role: "dialog",
        "aria-label": "Timeline assistant",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chatbot-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chatbot-title", children: "Timeline Assistant" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chatbot-sub", children: "Ask about entries & links" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "chatbot-close", onClick: () => setOpen(false), "aria-label": "Close", children: "×" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chatbot-messages", ref: scrollRef, children: [
            messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `chatbot-msg chatbot-msg-${m.role}`, children: m.content }, i)),
            loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chatbot-msg chatbot-msg-assistant chatbot-typing", children: "…" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chatbot-input-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "chatbot-input",
                value: input,
                onChange: (e) => setInput(e.target.value),
                onKeyDown: onKey,
                placeholder: "Ask a question…",
                rows: 1
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "chatbot-send", onClick: send, disabled: loading || !input.trim(), "aria-label": "Send", children: "↑" })
          ] })
        ]
      }
    )
  ] });
}
const DEFAULT_LEFT_TYPES = ["Dev", "Design", "Testing", "Bug", "Deployment"];
const ORDER_KEY = "devcycle.timeline.order";
const LAYOUT_KEY = "devcycle.timeline.layout";
const LEFT_TYPES_KEY = "devcycle.timeline.leftTypes";
function readLeftTypes(id) {
  if (typeof window === "undefined") return DEFAULT_LEFT_TYPES;
  try {
    const saved = JSON.parse(localStorage.getItem(LEFT_TYPES_KEY) ?? "{}");
    const arr = saved[id];
    if (Array.isArray(arr)) return arr.filter((t) => ENTRY_TYPES.includes(t));
  } catch {
  }
  return DEFAULT_LEFT_TYPES;
}
function TimelinePage() {
  const {
    id
  } = Route.useParams();
  const navigate = useNavigate();
  const [project, setProject] = reactExports.useState(null);
  const [entries, setEntries] = reactExports.useState(null);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [showShare, setShowShare] = reactExports.useState(false);
  const [showInviteOrg, setShowInviteOrg] = reactExports.useState(false);
  const [isOwner, setIsOwner] = reactExports.useState(false);
  const [orgId, setOrgId] = reactExports.useState(null);
  const [selected, setSelected] = reactExports.useState(null);
  const [order, setOrder] = reactExports.useState(() => {
    if (typeof window === "undefined") return "oldTop";
    try {
      const saved = JSON.parse(localStorage.getItem(ORDER_KEY) ?? "{}");
      return saved[id] === "newTop" ? "newTop" : "oldTop";
    } catch {
      return "oldTop";
    }
  });
  const [layout, setLayout] = reactExports.useState(() => {
    if (typeof window === "undefined") return "category";
    try {
      const saved = JSON.parse(localStorage.getItem(LAYOUT_KEY) ?? "{}");
      return saved[id] === "alternate" ? "alternate" : "category";
    } catch {
      return "category";
    }
  });
  const [leftTypes, setLeftTypes] = reactExports.useState(() => readLeftTypes(id));
  const scrollRef = reactExports.useRef(null);
  const didInitialScroll = reactExports.useRef(false);
  const hydratedForId = reactExports.useRef(null);
  const [showViewMenu, setShowViewMenu] = reactExports.useState(false);
  const viewMenuRef = reactExports.useRef(null);
  const [showCategoryConfig, setShowCategoryConfig] = reactExports.useState(false);
  const [pendingLeft, setPendingLeft] = reactExports.useState(leftTypes);
  const categoryConfigRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!showViewMenu) return;
    const onDoc = (e) => {
      if (!viewMenuRef.current?.contains(e.target)) setShowViewMenu(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [showViewMenu]);
  reactExports.useEffect(() => {
    if (hydratedForId.current === id) return;
    try {
      const saved = JSON.parse(localStorage.getItem(ORDER_KEY) ?? "{}");
      setOrder(saved[id] === "newTop" ? "newTop" : "oldTop");
    } catch {
    }
    try {
      const savedL = JSON.parse(localStorage.getItem(LAYOUT_KEY) ?? "{}");
      setLayout(savedL[id] === "alternate" ? "alternate" : "category");
    } catch {
    }
    setLeftTypes(readLeftTypes(id));
    hydratedForId.current = id;
  }, [id]);
  reactExports.useEffect(() => {
    if (showCategoryConfig) setPendingLeft(leftTypes);
  }, [showCategoryConfig, leftTypes]);
  reactExports.useEffect(() => {
    if (!showCategoryConfig) return;
    const onDoc = (e) => {
      if (!categoryConfigRef.current?.contains(e.target)) setShowCategoryConfig(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [showCategoryConfig]);
  reactExports.useEffect(() => {
    if (hydratedForId.current !== id) return;
    try {
      const saved = JSON.parse(localStorage.getItem(ORDER_KEY) ?? "{}");
      saved[id] = order;
      localStorage.setItem(ORDER_KEY, JSON.stringify(saved));
    } catch {
    }
  }, [order, id]);
  reactExports.useEffect(() => {
    if (hydratedForId.current !== id) return;
    try {
      const saved = JSON.parse(localStorage.getItem(LAYOUT_KEY) ?? "{}");
      saved[id] = layout;
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(saved));
    } catch {
    }
  }, [layout, id]);
  reactExports.useEffect(() => {
    if (hydratedForId.current !== id) return;
    try {
      const saved = JSON.parse(localStorage.getItem(LEFT_TYPES_KEY) ?? "{}");
      saved[id] = leftTypes;
      localStorage.setItem(LEFT_TYPES_KEY, JSON.stringify(saved));
    } catch {
    }
  }, [leftTypes, id]);
  const load = reactExports.useCallback(async () => {
    try {
      const [p, t] = await Promise.all([api.get(`/projects/${id}`), api.get(`/projects/${id}/timeline`)]);
      setProject(p.data);
      const sorted = [...t.data].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      setEntries(sorted);
    } catch {
      setEntries([]);
    }
  }, [id]);
  reactExports.useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(TOKEN_KEY)) {
      navigate({
        to: "/login"
      });
      return;
    }
    api.get("/auth/me").then((r) => {
      setIsOwner(r.data?.role === "owner");
      setOrgId(r.data?.org_id ?? null);
    }).catch(() => {
    });
    load();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 5e3);
    const onVis = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [load, navigate]);
  const rows = reactExports.useMemo(() => {
    const e = entries ?? [];
    return order === "oldTop" ? e : [...e].reverse();
  }, [entries, order]);
  reactExports.useEffect(() => {
    if (didInitialScroll.current) return;
    if (!entries || entries.length === 0) return;
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTop = order === "oldTop" ? el.scrollHeight : 0;
      didInitialScroll.current = true;
    });
  }, [entries, order]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timeline-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, { showBack: true, title: project?.name, hideOrgInvite: true, showProjectInvites: isOwner, onInviteOrg: orgId != null ? () => setShowInviteOrg(true) : void 0, onInviteProject: () => setShowShare(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "timeline-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginLeft: "auto"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-options-wrap", ref: viewMenuRef, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "order-flip view-options-btn", onClick: () => setShowViewMenu((v) => !v), title: "View options", "aria-label": "View options", "aria-expanded": showViewMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { size: 15 }) }),
        showViewMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-options-pop", role: "menu", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-options-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "view-options-label", children: "Layout" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-options-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: layout === "alternate" ? "active" : "", onClick: () => setLayout("alternate"), title: "Alternate entries left/right regardless of type.", children: "Zig-zag" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "category-with-config", ref: categoryConfigRef, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `category-main ${layout === "category" ? "active" : ""}`, onClick: () => setLayout("category"), title: "Group entries by type — assign each type to a side.", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `category-config-btn ${layout === "category" ? "active" : ""}`, onClick: (e) => {
                  e.stopPropagation();
                  setLayout("category");
                  setShowCategoryConfig((v) => !v);
                }, title: "Configure which types appear on each side", "aria-label": "Configure category sides", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { size: 14 }) }),
                showCategoryConfig && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "category-config-pop", role: "dialog", onClick: (e) => e.stopPropagation(), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cc-board", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryColumn, { side: "left", title: "Left", types: ENTRY_TYPES.filter((t) => pendingLeft.includes(t)), onDropType: (t) => setPendingLeft((prev) => prev.includes(t) ? prev : [...prev, t]), onMoveType: (t) => setPendingLeft((prev) => prev.filter((x) => x !== t)) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "cc-swap", onClick: () => setPendingLeft((prev) => ENTRY_TYPES.filter((t) => !prev.includes(t))), title: "Swap sides", "aria-label": "Swap sides", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeftRight, { size: 14 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryColumn, { side: "right", title: "Right", types: ENTRY_TYPES.filter((t) => !pendingLeft.includes(t)), onDropType: (t) => setPendingLeft((prev) => prev.filter((x) => x !== t)), onMoveType: (t) => setPendingLeft((prev) => prev.includes(t) ? prev : [...prev, t]) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "category-config-footer", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-ghost-sm", onClick: () => setPendingLeft(DEFAULT_LEFT_TYPES), title: "Reset to default split", children: "Reset" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary-sm", onClick: () => {
                      setLeftTypes(pendingLeft);
                      setShowCategoryConfig(false);
                    }, title: "Apply these sides to the timeline", children: "Apply" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-options-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "view-options-label", children: "Order" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-options-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: order === "oldTop" ? "active order-stack" : "order-stack", onClick: () => {
                setOrder("oldTop");
                didInitialScroll.current = false;
              }, title: "Oldest at top, newest at bottom.", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Old" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 12 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "New" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: order === "newTop" ? "active order-stack" : "order-stack", onClick: () => {
                setOrder("newTop");
                didInitialScroll.current = false;
              }, title: "Newest at top, oldest at bottom.", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "New" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 12 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Old" })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: () => setShowAdd(true), children: "+ Add Entry" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "timeline-scroll", ref: scrollRef, children: entries === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "spinner-page", children: "Loading timeline..." }) : entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
      padding: "0 32px"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty", children: "No entries yet. Add the first milestone of this project." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timeline-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "timeline-spine" }),
      rows.map((entry, i) => {
        const isLeft = layout === "alternate" ? i % 2 === 0 : leftTypes.includes(entry.type);
        const dt = new Date(entry.created_at);
        const stamp = `${dt.toLocaleDateString(void 0, {
          day: "2-digit",
          month: "short"
        })}
${dt.toLocaleTimeString(void 0, {
          hour: "2-digit",
          minute: "2-digit"
        })}`;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timeline-row", style: {
          ["--entry-color"]: `var(--${entry.type.toLowerCase()})`
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "timeline-side left", children: isLeft && /* @__PURE__ */ jsxRuntimeExports.jsx(EntryCard, { entry, onClick: () => setSelected(entry) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "timeline-side right", children: !isLeft && /* @__PURE__ */ jsxRuntimeExports.jsx(EntryCard, { entry, onClick: () => setSelected(entry) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `timeline-connector ${isLeft ? "left" : "right"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `timeline-timestamp ${isLeft ? "right" : "left"}`, children: stamp.split("\n").map((s, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: s }, idx)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "timeline-node" }),
          i === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            position: "absolute",
            top: -28,
            right: 0,
            color: "var(--text-dim)",
            fontSize: 12
          }, children: dt.toLocaleDateString(void 0, {
            day: "numeric",
            month: "long",
            year: "numeric"
          }) })
        ] }, entry.id);
      })
    ] }) }),
    showAdd && /* @__PURE__ */ jsxRuntimeExports.jsx(AddEntryModal, { projectId: id, onClose: () => setShowAdd(false), onAdded: () => {
      setShowAdd(false);
      load();
    } }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsx(EntryDetailPanel, { entry: selected, onClose: () => setSelected(null) }),
    showShare && /* @__PURE__ */ jsxRuntimeExports.jsx(ShareProjectModal, { projectId: Number(id), onClose: () => setShowShare(false) }),
    showInviteOrg && orgId != null && /* @__PURE__ */ jsxRuntimeExports.jsx(InviteModal, { orgId, onClose: () => setShowInviteOrg(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineChatbot, { projectId: id })
  ] });
}
function EntryCard({
  entry,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timeline-entry-card", onClick, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TypeBadge, { type: entry.type }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "entry-title", children: entry.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "entry-meta", children: [
      "by ",
      entry.added_by_name
    ] })
  ] });
}
function CategoryColumn({
  side,
  title,
  types,
  onDropType,
  onMoveType
}) {
  const [over, setOver] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `cc-col ${over ? "is-over" : ""}`, onDragOver: (e) => {
    e.preventDefault();
    setOver(true);
  }, onDragLeave: () => setOver(false), onDrop: (e) => {
    e.preventDefault();
    setOver(false);
    const t = e.dataTransfer.getData("text/plain");
    if (t && ENTRY_TYPES.includes(t)) onDropType(t);
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cc-col-title", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cc-col-body", children: types.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cc-empty", children: "Drop types here" }) : types.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cc-chip", draggable: true, onDragStart: (e) => {
      e.dataTransfer.setData("text/plain", t);
      e.dataTransfer.effectAllowed = "move";
    }, onDoubleClick: () => onMoveType(t), title: `Drag to ${side === "left" ? "right" : "left"}, or double-click to move`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `type-dot type-${t.toLowerCase()}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t })
    ] }, t)) })
  ] });
}
export {
  TimelinePage as component
};
