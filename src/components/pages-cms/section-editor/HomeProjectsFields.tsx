"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { api, ApiRequestError } from "@/lib/api";
import { FieldLabel, ImageWithAltField, SelectField, TextInput, Textarea } from "../fields";

interface Category {
  id: string;
  label: string;
}

interface Project {
  title: string;
  subtitle: string;
  category: string;
  href: string;
  image: string;
  imageAlt: string;
}

interface HomeProjectsData {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  button: { label: string; href: string };
  badge: { title: string; text: string };
  categories: Category[];
  projects: Project[];
}

const MAX_PROJECTS = 30;
const MAX_CATEGORIES = 10;

const toId = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2400,
  timerProgressBar: true,
  background: "#1e2433",
  color: "#e2e8f0",
});

const move = <T,>(list: T[], from: number, to: number) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col gap-3 rounded-[6px] border border-[#e2e8f0] bg-white p-3">{children}</div>
);

/**
 * Home "Our Projects" section exactly as the website shows it: heading (H2), badge, filter tabs and
 * project cards. Loaded from and saved to the backend (/home-projects); images go to Cloudinary.
 */
export function HomeProjectsFields() {
  const [data, setData] = useState<HomeProjectsData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    api
      .get<Partial<HomeProjectsData>>("/home-projects")
      .then((res) => {
        // A response without project cards is not this section's data (e.g. an old demo answer)
        if (!res || !Array.isArray(res.projects)) {
          setLoadError("Could not load the section from the server. Refresh the page; if it persists, check the backend is running.");
          return;
        }
        setData({
          eyebrow: res.eyebrow ?? "",
          title: res.title ?? "",
          highlight: res.highlight ?? "",
          description: res.description ?? "",
          button: { label: res.button?.label ?? "", href: res.button?.href ?? "" },
          badge: { title: res.badge?.title ?? "", text: res.badge?.text ?? "" },
          categories: Array.isArray(res.categories) ? res.categories : [],
          projects: res.projects,
        });
      })
      .catch((err) => setLoadError(err instanceof ApiRequestError ? err.message : "Could not load the section."));
  }, []);

  const change = (next: Partial<HomeProjectsData>) => {
    setData((d) => (d ? { ...d, ...next } : d));
    setDirty(true);
  };
  const setProject = (i: number, patch: Partial<Project>) =>
    data && change({ projects: data.projects.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });

  // Renaming a tab keeps its projects on it
  const renameCategory = (i: number, label: string) => {
    if (!data) return;
    const oldId = data.categories[i].id;
    const newId = toId(label) || oldId;
    change({
      categories: data.categories.map((c, idx) => (idx === i ? { id: newId, label } : c)),
      projects: data.projects.map((p) => (p.category === oldId ? { ...p, category: newId } : p)),
    });
  };

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const saved = await api.put<HomeProjectsData>("/home-projects", data);
      setData(saved);
      setDirty(false);
      Toast.fire({ icon: "success", iconColor: "#34d399", title: "Our Projects saved — live on the website" });
    } catch (err) {
      Toast.fire({ icon: "error", iconColor: "#f87171", title: err instanceof ApiRequestError ? err.message : "Could not save the section." });
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <p className="rounded-[4px] bg-red-50 px-2 py-1.5 text-[10px] font-semibold text-red-600">{loadError}</p>;
  if (!data) {
    return (
      <p className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
        <Loader2 className="h-3 w-3 animate-spin" /> Loading Our Projects…
      </p>
    );
  }

  const smallBtn = "grid h-[26px] w-[26px] place-items-center rounded-[4px] text-[#475569] transition hover:bg-slate-100 disabled:opacity-30";
  const categoryOptions = data.categories.map((c) => ({ label: c.label, value: c.id }));

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 rounded-[6px] border border-[#dbe4f3] bg-[#f8fafd] px-3 py-2">
        <p className="text-[10.5px] font-bold text-[#0A2B5E]">
          Our Projects — {data.projects.length} projects · {data.categories.length} filter tabs
        </p>
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

      {/* ---------- Heading, button & badge ---------- */}
      <Card>
        <p className="border-b border-gray-100 pb-1.5 text-[11px] font-bold text-[#1e40af]">Heading, Button & Badge</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <TextInput value={data.eyebrow} onChange={(v) => change({ eyebrow: v })} placeholder="Our Projects" hideLimit={true} />
          </div>
          <div />
          <div>
            <FieldLabel required>Heading — H2 (navy)</FieldLabel>
            <TextInput value={data.title} onChange={(v) => change({ title: v })} placeholder="Spaces We Have" hideLimit={true} />
          </div>
          <div>
            <FieldLabel>Heading — H2 (orange part)</FieldLabel>
            <TextInput value={data.highlight} onChange={(v) => change({ highlight: v })} placeholder="Brought to Life" hideLimit={true} />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <Textarea value={data.description} onChange={(v) => change({ description: v })} rows={2} maxLength={400} />
          </div>
          <div>
            <FieldLabel>Button Text</FieldLabel>
            <TextInput value={data.button.label} onChange={(v) => change({ button: { ...data.button, label: v } })} placeholder="View All Projects" hideLimit={true} />
          </div>
          <div>
            <FieldLabel>Button Link</FieldLabel>
            <TextInput value={data.button.href} onChange={(v) => change({ button: { ...data.button, href: v } })} placeholder="/projects" hideLimit={true} />
          </div>
          <div>
            <FieldLabel>Badge Title</FieldLabel>
            <TextInput value={data.badge.title} onChange={(v) => change({ badge: { ...data.badge, title: v } })} placeholder="Diverse Industries" hideLimit={true} />
          </div>
          <div>
            <FieldLabel>Badge Text</FieldLabel>
            <TextInput value={data.badge.text} onChange={(v) => change({ badge: { ...data.badge, text: v } })} placeholder="Retail | Corporate | F&B | …" hideLimit={true} />
          </div>
        </div>
      </Card>

      {/* ---------- Filter tabs ---------- */}
      <Card>
        <p className="border-b border-gray-100 pb-1.5 text-[11px] font-bold text-[#1e40af]">Filter Tabs (&quot;All Projects&quot; is always first)</p>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {data.categories.map((c, i) => (
            <div key={i} className="flex items-end gap-1.5">
              <div className="min-w-0 flex-1">
                <FieldLabel>{`Tab ${i + 1}`}</FieldLabel>
                <TextInput value={c.label} onChange={(v) => renameCategory(i, v)} placeholder="Retail Showroom" hideLimit={true} />
              </div>
              <button
                type="button"
                title={data.projects.some((p) => p.category === c.id) ? "Move this tab's projects to another tab first" : "Remove tab"}
                disabled={data.projects.some((p) => p.category === c.id)}
                onClick={() => change({ categories: data.categories.filter((_, idx) => idx !== i) })}
                className={`${smallBtn} mb-[1px] text-red-500 hover:bg-red-50`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        {data.categories.length < MAX_CATEGORIES && (
          <button
            type="button"
            onClick={() => change({ categories: [...data.categories, { id: `tab-${Date.now()}`, label: "New tab" }] })}
            className="inline-flex w-fit items-center gap-1 text-[10.5px] font-semibold text-[#0A2B5E] hover:underline"
          >
            <Plus className="h-3 w-3" /> Add filter tab
          </button>
        )}
      </Card>

      {/* ---------- Project cards ---------- */}
      {data.projects.map((p, i) => (
        <Card key={i}>
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5">
            <p className="text-[11px] font-bold text-[#1e40af]">
              Project {i + 1}: {p.title || "New project"} {i === 5 && <span className="ml-1 font-medium text-slate-400">(first page ends here — 6 per page)</span>}
            </p>
            <div className="flex items-center gap-1">
              <button type="button" title="Move up" disabled={i === 0} onClick={() => change({ projects: move(data.projects, i, i - 1) })} className={smallBtn}>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" title="Move down" disabled={i === data.projects.length - 1} onClick={() => change({ projects: move(data.projects, i, i + 1) })} className={smallBtn}>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" title="Remove project" onClick={() => change({ projects: data.projects.filter((_, idx) => idx !== i) })} className={`${smallBtn} text-red-500 hover:bg-red-50`}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <FieldLabel required>Title (H3)</FieldLabel>
              <TextInput value={p.title} onChange={(v) => setProject(i, { title: v })} placeholder="Luxury Retail Showroom" hideLimit={true} />
            </div>
            <div>
              <FieldLabel>Subtitle</FieldLabel>
              <TextInput value={p.subtitle} onChange={(v) => setProject(i, { subtitle: v })} placeholder="Retail Interiors" hideLimit={true} />
            </div>
            <div>
              <FieldLabel required>Filter Tab</FieldLabel>
              <SelectField value={p.category} options={categoryOptions} onChange={(v) => setProject(i, { category: v })} />
            </div>
            <div>
              <FieldLabel required>Link</FieldLabel>
              <TextInput value={p.href} onChange={(v) => setProject(i, { href: v })} placeholder="/services/retail-showrooms" hideLimit={true} />
            </div>
            <div className="md:col-span-2">
              <ImageWithAltField
                label="Project Image (Upload)"
                image={p.image}
                alt={p.imageAlt}
                onImageChange={(v) => setProject(i, { image: v })}
                onAltChange={(v) => setProject(i, { imageAlt: v })}
                altLabel="Image Alt Text"
                altPlaceholder="e.g. Luxury retail showroom interior by Design House India"
                folder="design-house/our-projects"
              />
            </div>
          </div>
        </Card>
      ))}
      {data.projects.length < MAX_PROJECTS && (
        <button
          type="button"
          onClick={() =>
            change({
              projects: [...data.projects, { title: "", subtitle: "", category: data.categories[0]?.id ?? "", href: "/projects", image: "", imageAlt: "" }],
            })
          }
          className="inline-flex w-fit items-center gap-1 text-[10.5px] font-semibold text-[#0A2B5E] hover:underline"
        >
          <Plus className="h-3 w-3" /> Add project
        </button>
      )}
    </div>
  );
}
