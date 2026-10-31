"use client";

import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CheckCheck, FileText, MessageCircle, PencilLine, RotateCcw, Save, Send, UserRound } from "lucide-react";
import Swal from "sweetalert2";
import typography from "../pages/PagesTypography.module.css";
import Modal from "@/components/ui/Modal";
import { ApiRequestError } from "@/lib/api";
import { whatsappTemplateApi, type WhatsAppTemplate } from "@/lib/whatsappTemplateApi";

/* =========================================================
   TOAST HELPER
========================================================= */

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  background: "#1e2433",
  color: "#e2e8f0",
});

const showSuccess = (title: string) => Toast.fire({ icon: "success", iconColor: "#34d399", title });
const showError = (title: string) => Toast.fire({ icon: "error", iconColor: "#f87171", title });

/* =========================================================
   WHATSAPP PREVIEW
========================================================= */

// Example values used to fill [[PLACEHOLDERS]] in the preview
const SAMPLE_VALUES: Record<string, string> = {
  NAME: "Rahul Sharma",
  PHONE: "9876543210",
  SERVICE: "Interiors — Retail Interior",
  LOCATION: "Noida, Uttar Pradesh",
  COMPANY: "UrbanCart Retail Pvt. Ltd.",
  MESSAGE: "Need a complete interior fit-out for our new 1,200 sq ft showroom.",
  SUBJECT: "Interior Designer",
};

const fillSample = (text: string) => text.replace(/\[\[([A-Z_]+)\]\]/g, (match, key: string) => SAMPLE_VALUES[key] ?? match);

/** WhatsApp formatting: *bold*, _italic_, ~strike~ */
function renderWhatsAppText(text: string): ReactNode[] {
  return text.split(/(\*[^*\n]+\*|_[^_\n]+_|~[^~\n]+~)/g).map((part, i) => {
    if (/^\*[^*\n]+\*$/.test(part)) return <strong key={i}>{part.slice(1, -1)}</strong>;
    if (/^_[^_\n]+_$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
    if (/^~[^~\n]+~$/.test(part)) return <s key={i}>{part.slice(1, -1)}</s>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function WhatsAppPreview({ body, compact = false }: { body: string; compact?: boolean }) {
  return (
    <div
      className={`overflow-y-auto rounded-[8px] bg-[#efeae2] p-3 ${compact ? "max-h-[230px]" : "h-full min-h-[320px]"}`}
      style={{
        backgroundImage: "radial-gradient(rgba(0,0,0,0.045) 1px, transparent 1px)",
        backgroundSize: "14px 14px",
      }}
    >
      <div className="relative max-w-[92%] rounded-[8px] rounded-tl-none bg-white px-2.5 pb-1.5 pt-2 shadow-[0_1px_1px_rgba(0,0,0,0.12)]">
        {/* Bubble tail */}
        <span className="absolute -left-[6px] top-0 h-0 w-0 border-r-[7px] border-t-[8px] border-r-white border-t-transparent" />
        <p className="whitespace-pre-wrap break-words text-[10.5px] leading-[1.5] text-[#111b21]">
          {renderWhatsAppText(fillSample(body))}
        </p>
        <p className="mt-0.5 flex items-center justify-end gap-1 text-[8px] text-[#667781]">
          10:42 am
          <CheckCheck className="h-3 w-3 text-[#53bdeb]" />
        </p>
      </div>
    </div>
  );
}

function formatUpdated(t: WhatsAppTemplate) {
  if (!t.updatedAt) return "Never edited";
  const d = new Date(t.updatedAt);
  const when = Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
  return `Updated ${when} by ${t.updatedBy}`;
}

/* =========================================================
   WHATSAPP TEMPLATES PAGE
========================================================= */

export default function WhatsAppTemplatesPage() {
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<WhatsAppTemplate | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const fetchItems = () =>
    whatsappTemplateApi
      .list()
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .catch((err) => setLoadError(err instanceof ApiRequestError ? err.message : "Failed to load WhatsApp templates."))
      .finally(() => setLoading(false));

  useEffect(() => {
    // First load: the state already starts as loading
    fetchItems();
  }, []);

  const openEditor = (t: WhatsAppTemplate) => {
    setEditing(t);
    setDraft(t.whatsappBody);
  };

  const replaceTemplate = (updated: WhatsAppTemplate) => {
    setTemplates((prev) => prev.map((t) => (t.formType === updated.formType ? updated : t)));
  };

  // Puts [[KEY]] where the cursor is in the editor
  const insertPlaceholder = (key: string) => {
    const token = `[[${key}]]`;
    const el = textareaRef.current;
    if (!el) {
      setDraft((d) => d + token);
      return;
    }
    const start = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? draft.length;
    const next = draft.slice(0, start) + token + draft.slice(end);
    setDraft(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!draft.trim()) {
      showError("Message cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const updated = await whatsappTemplateApi.update(editing.formType, draft);
      replaceTemplate(updated);
      setEditing(null);
      showSuccess(`${updated.label} template saved`);
    } catch (err) {
      showError(err instanceof ApiRequestError ? err.message : "Failed to save template.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!editing) return;
    const result = await Swal.fire({
      title: "Reset to default message?",
      text: "Your edited text for this template will be replaced.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reset",
      confirmButtonColor: "#fd6e15",
      background: "#1e2433",
      color: "#e2e8f0",
    });
    if (!result.isConfirmed) return;

    setSaving(true);
    try {
      const updated = await whatsappTemplateApi.reset(editing.formType);
      replaceTemplate(updated);
      setEditing(updated);
      setDraft(updated.whatsappBody);
      showSuccess("Reset to default message");
    } catch (err) {
      showError(err instanceof ApiRequestError ? err.message : "Failed to reset template.");
    } finally {
      setSaving(false);
    }
  };

  const unknownPlaceholders = useMemo(() => {
    if (!editing) return [];
    const allowed = new Set(editing.placeholders.map((p) => p.key));
    const used = Array.from(draft.matchAll(/\[\[([A-Z_]+)\]\]/g), (m) => m[1]);
    return Array.from(new Set(used.filter((k) => !allowed.has(k))));
  }, [draft, editing]);

  const isDirty = editing ? draft !== editing.whatsappBody : false;

  return (
    <div className={`${typography.pages} min-h-[calc(100vh-100px)] w-full bg-white text-[#18233b]`}>
      <div className="flex min-h-full flex-col px-[18px] pb-[16px] pt-[14px]">
        {/* HEADER */}
        <div className="mb-[14px] border-b-[2px] border-[#293681] pb-[10px]">
          <h1 className="text-[19px] font-bold leading-[1.15] tracking-[-0.018em] text-[#0A2B5E]">WhatsApp Templates</h1>
          <p className="mt-0.5 text-[9px] font-medium text-black">
            WhatsApp messages sent automatically (through Opus) to visitors after they submit a website form. Click Edit to change the text.
          </p>
        </div>

        {loading ? (
          <p className="py-16 text-center text-[10px] text-[#6c7587]">Loading templates…</p>
        ) : loadError ? (
          <p className="py-16 text-center text-[10px] font-semibold text-red-600">{loadError}</p>
        ) : templates.length === 0 ? (
          <p className="py-16 text-center text-[10px] text-[#6c7587]">No WhatsApp templates found. Make sure the backend is running.</p>
        ) : (
          <div className="grid gap-[12px] md:grid-cols-2 xl:grid-cols-3">
            {templates.map((t) => (
              <div
                key={t.formType}
                className="flex flex-col overflow-hidden rounded-[10px] border border-[#e5e7eb] bg-white"
                style={{ boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px" }}
              >
                {/* Card header */}
                <div className="flex items-start gap-2 border-b border-[#eef0f2] bg-[#0A2B5E] px-3 py-2.5">
                  <span className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
                    <MessageCircle className="h-[15px] w-[15px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-bold text-white">{t.label}</p>
                    <p className="truncate text-[8.5px] font-medium text-white/70">{t.usedOn}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-[4px] px-[6px] py-[2px] text-[7.5px] font-bold uppercase ${
                      t.isCustomised ? "bg-[#fd6e15] text-white" : "bg-white/15 text-white"
                    }`}
                  >
                    {t.isCustomised ? "Edited" : "Default"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-3">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[8.5px] font-medium text-[#475569]">
                    <span className="flex items-center gap-1">
                      <UserRound className="h-3 w-3 text-[#94a3b8]" /> Sent to: {t.sentTo}
                    </span>
                    <span className="flex items-center gap-1">
                      <Send className="h-3 w-3 text-[#94a3b8]" /> Via Opus WhatsApp API
                    </span>
                  </div>

                  <WhatsAppPreview body={t.whatsappBody} compact />

                  <div className="mt-auto flex items-center justify-between gap-2 pt-1">
                    <span className="truncate text-[8px] font-medium text-[#94a3b8]">{formatUpdated(t)}</span>
                    <button
                      type="button"
                      onClick={() => openEditor(t)}
                      className="inline-flex h-[26px] shrink-0 items-center gap-1.5 rounded-[5px] bg-[#0A2B5E] px-[10px] text-[9px] font-bold text-white transition hover:bg-[#0d3a7d] active:scale-95"
                    >
                      <PencilLine className="h-3 w-3" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <Modal
        isOpen={!!editing}
        onClose={() => !saving && setEditing(null)}
        title={editing ? `Edit WhatsApp Template — ${editing.label}` : "Edit WhatsApp Template"}
        size="lg"
        footer={
          editing && (
            <>
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="mr-auto inline-flex h-[32px] items-center gap-1.5 rounded-[4px] px-[12px] text-[12px] font-semibold text-[#c2410c] transition hover:bg-orange-50 disabled:opacity-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset to default
              </button>
              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={saving}
                className="inline-flex h-[32px] items-center rounded-[4px] border border-[#d8dce2] px-[14px] text-[12px] font-semibold text-[#334155] transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !isDirty}
                className="inline-flex h-[32px] items-center gap-1.5 rounded-[4px] bg-[#0A2B5E] px-[14px] text-[12px] font-semibold text-white transition hover:bg-[#0d3a7d] active:scale-95 disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Saving…" : "Save Template"}
              </button>
            </>
          )
        }
      >
        {editing && (
          <div className="grid gap-4 md:grid-cols-2">
            {/* Editor */}
            <div className="flex min-w-0 flex-col">
              <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#64748b]">
                <FileText className="h-3 w-3" /> Message
              </p>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={16}
                className="min-h-[300px] w-full flex-1 resize-y rounded-[6px] border border-[#d8dce2] bg-white p-3 font-mono text-[12px] leading-[1.55] text-[#1e293b] outline-none focus:border-[#0A2B5E] focus:ring-2 focus:ring-[#0A2B5E]/10"
              />
              <div className="mt-1 flex justify-between text-[10px] text-[#94a3b8]">
                <span>*bold* · _italic_ · ~strike~</span>
                <span>{draft.length} / 4000</span>
              </div>

              <p className="mb-1 mt-3 text-[10px] font-bold uppercase tracking-wide text-[#64748b]">Insert placeholder</p>
              <div className="flex flex-wrap gap-1.5">
                {editing.placeholders.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => insertPlaceholder(p.key)}
                    title={p.description}
                    className="rounded-[4px] border border-[#0A2B5E]/20 bg-[#0A2B5E]/[0.05] px-2 py-1 font-mono text-[10.5px] font-semibold text-[#0A2B5E] transition hover:border-[#0A2B5E]/50 hover:bg-[#0A2B5E]/[0.12]"
                  >
                    [[{p.key}]]
                  </button>
                ))}
              </div>
              <ul className="mt-2 space-y-0.5 text-[10.5px] text-[#64748b]">
                {editing.placeholders.map((p) => (
                  <li key={p.key}>
                    <span className="font-mono font-semibold text-[#334155]">[[{p.key}]]</span> — {p.description}
                  </li>
                ))}
              </ul>
              {unknownPlaceholders.length > 0 && (
                <p className="mt-2 rounded-[4px] bg-amber-50 px-2 py-1.5 text-[10.5px] font-semibold text-amber-700">
                  Not filled in automatically: {unknownPlaceholders.map((k) => `[[${k}]]`).join(", ")}
                </p>
              )}
            </div>

            {/* Live preview */}
            <div className="flex min-w-0 flex-col">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#64748b]">Preview (sample details)</p>
              <WhatsAppPreview body={draft} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
