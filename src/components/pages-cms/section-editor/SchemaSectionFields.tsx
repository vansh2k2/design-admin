"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, FileUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { api, ApiRequestError } from "@/lib/api";
import { uploadApi } from "@/lib/uploadApi";
import { FieldLabel, ImageWithAltField, SelectField, TextInput, Textarea } from "../fields";

/* Form built from a section's field schema (sent by the backend with GET /home-sections/:key?schema=1)
   and saved with PUT /home-sections/:key. Field types mirror backend/src/modules/home-sections/homeSections.schema.js. */

type Json = Record<string, unknown>;

interface BaseField {
  key: string;
  label: string;
  required?: boolean;
  help?: string;
}
type Field =
  | (BaseField & { type: "text" | "textarea"; max?: number; placeholder?: string })
  | (BaseField & { type: "link" | "pdf" })
  | (BaseField & { type: "image"; altKey?: string; folder?: string })
  | (BaseField & { type: "select"; options?: { value: string; label: string }[]; optionsFrom?: string; optionLabel?: string })
  | (BaseField & { type: "lines"; maxItems?: number })
  | (BaseField & { type: "group"; fields: Field[] })
  | (BaseField & { type: "list"; fields: Field[]; itemLabel?: string; titleKey?: string; min?: number; max?: number; newItem?: Json; idFrom?: string });

interface SectionResponse {
  key: string;
  label: string;
  content: Json;
  fields: Field[];
}

type Path = (string | number)[];

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2400,
  timerProgressBar: true,
  background: "#1e2433",
  color: "#e2e8f0",
});

const asText = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const asList = (v: unknown): Json[] => (Array.isArray(v) ? (v as Json[]) : []);
const asObj = (v: unknown): Json => (v && typeof v === "object" && !Array.isArray(v) ? (v as Json) : {});

/** Copy of `obj` with the value at `path` replaced */
function setIn(obj: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (typeof head === "number") {
    const arr = [...asList(obj)];
    arr[head] = setIn(arr[head], rest, value) as Json;
    return arr;
  }
  const o = { ...asObj(obj) };
  o[head] = setIn(o[head], rest, value);
  return o;
}

const Card = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-3 rounded-[6px] border border-[#e2e8f0] bg-white p-3">{children}</div>
);

const smallBtn = "grid h-[26px] w-[26px] place-items-center rounded-[4px] text-[#475569] transition hover:bg-slate-100 disabled:opacity-30";

export function SchemaSectionFields({ sectionKey }: { sectionKey: string }) {
  const [section, setSection] = useState<SectionResponse | null>(null);
  const [content, setContent] = useState<Json>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Partial<SectionResponse>>(`/home-sections/${sectionKey}?schema=1`)
      .then((res) => {
        if (!res || !Array.isArray(res.fields) || !res.content) {
          setLoadError("Could not load the section from the server. Refresh the page; if it persists, check the backend is running.");
          return;
        }
        setSection(res as SectionResponse);
        setContent(res.content);
      })
      .catch((err) => setLoadError(err instanceof ApiRequestError ? err.message : "Could not load the section."));
  }, [sectionKey]);

  const set = (path: Path, value: unknown) => {
    setContent((c) => setIn(c, path, value) as Json);
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const saved = await api.put<SectionResponse>(`/home-sections/${sectionKey}`, { content });
      setSection(saved);
      setContent(saved.content);
      setDirty(false);
      Toast.fire({ icon: "success", iconColor: "#34d399", title: `${saved.label} saved — live on the website` });
    } catch (err) {
      Toast.fire({ icon: "error", iconColor: "#f87171", title: err instanceof ApiRequestError ? err.message : "Could not save the section." });
    } finally {
      setSaving(false);
    }
  };

  const uploadPdf = async (path: Path, file?: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      Toast.fire({ icon: "error", iconColor: "#f87171", title: "Please choose a PDF file." });
      return;
    }
    const id = path.join(".");
    setUploading(id);
    try {
      const res = await uploadApi.file(file, `design-house/${sectionKey}`);
      set(path, res.url);
      Toast.fire({ icon: "success", iconColor: "#34d399", title: "PDF uploaded — click Save Section" });
    } catch (err) {
      Toast.fire({ icon: "error", iconColor: "#f87171", title: err instanceof Error ? err.message : "PDF upload failed" });
    } finally {
      setUploading(null);
    }
  };

  if (loadError) return <p className="rounded-[4px] bg-red-50 px-2 py-1.5 text-[10px] font-semibold text-red-600">{loadError}</p>;
  if (!section) {
    return (
      <p className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
        <Loader2 className="h-3 w-3 animate-spin" /> Loading section…
      </p>
    );
  }

  // ---------- one field ----------
  const renderField = (field: Field, value: Json, base: Path): ReactNode => {
    const path = [...base, field.key];
    const v = value[field.key];
    const label = (
      <FieldLabel required={field.required}>{field.label}</FieldLabel>
    );
    const help = field.help ? <p className="mt-0.5 text-[9.5px] text-slate-500">{field.help}</p> : null;

    switch (field.type) {
      case "text":
      case "link":
        return (
          <div key={field.key}>
            {label}
            <TextInput value={asText(v)} onChange={(next) => set(path, next)} placeholder={field.type === "link" ? "/page or https://…" : ""} hideLimit={true} />
            {help}
          </div>
        );
      case "textarea":
        return (
          <div key={field.key} className="md:col-span-2">
            {label}
            <Textarea value={asText(v)} onChange={(next) => set(path, next)} rows={2} maxLength={field.max ?? 400} />
            {help}
          </div>
        );
      case "pdf": {
        const id = path.join(".");
        return (
          <div key={field.key}>
            {label}
            <div className="flex items-center gap-1.5">
              <div className="min-w-0 flex-1">
                <TextInput value={asText(v)} onChange={(next) => set(path, next)} placeholder="/downloads or uploaded PDF" hideLimit={true} />
              </div>
              <label
                className={`inline-flex h-[28px] shrink-0 cursor-pointer items-center gap-1 rounded-[4px] border border-[#0A2B5E]/25 bg-[#0A2B5E]/[0.05] px-2 text-[10px] font-semibold text-[#0A2B5E] transition hover:bg-[#0A2B5E]/[0.12] ${uploading ? "pointer-events-none opacity-60" : ""}`}
              >
                {uploading === id ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileUp className="h-3 w-3" />}
                {uploading === id ? "Uploading…" : "Upload PDF"}
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    void uploadPdf(path, e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
            {help}
          </div>
        );
      }
      case "image":
        return (
          <div key={field.key} className="md:col-span-2">
            <ImageWithAltField
              label={`${field.label} (Upload)`}
              image={asText(v)}
              alt={field.altKey ? asText(value[field.altKey]) : ""}
              onImageChange={(next) => set(path, next)}
              onAltChange={(next) => field.altKey && set([...base, field.altKey], next)}
              altLabel="Alt Text"
              altPlaceholder="Describe the image for Google and screen readers"
              folder={field.folder}
            />
          </div>
        );
      case "select": {
        const options = field.optionsFrom
          ? asList(content[field.optionsFrom]).map((o) => ({ value: asText(o.id), label: asText(o[field.optionLabel ?? "label"]) || asText(o.id) }))
          : field.options ?? [];
        return (
          <div key={field.key}>
            {label}
            <SelectField value={asText(v)} options={options} onChange={(next) => set(path, next)} />
          </div>
        );
      }
      case "lines":
        return (
          <div key={field.key} className="md:col-span-2">
            {label}
            <Textarea
              value={(Array.isArray(v) ? (v as string[]) : []).join("\n")}
              onChange={(next) => set(path, next.split("\n"))}
              rows={4}
              noLimit={true}
            />
          </div>
        );
      case "group":
        return (
          <div key={field.key} className="md:col-span-2 rounded-[6px] border border-dashed border-[#cbd5e1] p-2.5">
            <p className="mb-2 text-[10.5px] font-bold text-[#334155]">{field.label}</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{field.fields.map((sub) => renderField(sub, asObj(v), path))}</div>
          </div>
        );
      case "list": {
        const items = asList(v);
        const max = field.max ?? 20;
        return (
          <div key={field.key} className="md:col-span-2 flex flex-col gap-2">
            <p className="text-[11px] font-bold text-[#1e40af]">
              {field.label} <span className="font-medium text-slate-400">({items.length})</span>
            </p>
            {items.map((item, i) => {
              const title = asText(item[field.titleKey ?? "title"]).split("\n").join(" ");
              return (
                <div key={i} className="rounded-[6px] border border-[#e2e8f0] bg-[#fbfcfe] p-2.5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10.5px] font-bold text-[#0A2B5E]">
                      {field.itemLabel ?? "Item"} {i + 1}: {title || "New"}
                    </p>
                    <div className="flex items-center gap-1">
                      <button type="button" title="Move up" disabled={i === 0} onClick={() => set(path, move(items, i, i - 1))} className={smallBtn}>
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" title="Move down" disabled={i === items.length - 1} onClick={() => set(path, move(items, i, i + 1))} className={smallBtn}>
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        title="Remove"
                        disabled={items.length <= (field.min ?? 0)}
                        onClick={() => set(path, items.filter((_, idx) => idx !== i))}
                        className={`${smallBtn} text-red-500 hover:bg-red-50`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{field.fields.map((sub) => renderField(sub, item, [...path, i]))}</div>
                </div>
              );
            })}
            {items.length < max && (
              <button
                type="button"
                onClick={() => set(path, [...items, { ...(field.newItem ?? {}) }])}
                className="inline-flex w-fit items-center gap-1 text-[10.5px] font-semibold text-[#0A2B5E] hover:underline"
              >
                <Plus className="h-3 w-3" /> Add {(field.itemLabel ?? "item").toLowerCase()}
              </button>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 rounded-[6px] border border-[#dbe4f3] bg-[#f8fafd] px-3 py-2">
        <p className="text-[10.5px] font-bold text-[#0A2B5E]">{section.label} — content shown on the website</p>
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="inline-flex h-[26px] items-center gap-1.5 rounded-[4px] bg-[#0A2B5E] px-[10px] text-[10px] font-semibold text-white transition hover:bg-[#0d3a7d] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
          {saving ? "Saving…" : "Save Section"}
        </button>
      </div>
      <Card>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{section.fields.map((field) => renderField(field, content, []))}</div>
      </Card>
    </div>
  );
}

function move<T>(list: T[], from: number, to: number): T[] {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
