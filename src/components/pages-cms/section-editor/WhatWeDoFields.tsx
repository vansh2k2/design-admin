"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { api, ApiRequestError } from "@/lib/api";
import { FieldLabel, ImageWithAltField, SelectField, TextInput, Textarea } from "../fields";

interface ServiceCard {
  title: string;
  desc: string;
  href: string;
  image: string;
  imageAlt: string;
  icon: string;
  iconAlt: string;
}

type StatIcon = "trophy" | "layers" | "cog";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: StatIcon;
}

interface WhatWeDoData {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  button: { label: string; href: string };
  services: ServiceCard[];
  stats: Stat[];
  industriesTitle: string;
  industries: string[];
}

const STAT_ICON_OPTIONS: { label: string; value: StatIcon }[] = [
  { label: "Trophy", value: "trophy" },
  { label: "Layers", value: "layers" },
  { label: "Settings / cog", value: "cog" },
];

const MAX_CARDS = 12;
const MAX_STATS = 4;

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
 * Home "What We Do" section exactly as the website shows it: heading, service cards, stats card
 * and "Industries We Serve". Loaded from and saved to the backend (/home-what-we-do);
 * images are uploaded to Cloudinary.
 */
export function WhatWeDoFields() {
  const [data, setData] = useState<WhatWeDoData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    api
      .get<Partial<WhatWeDoData>>("/home-what-we-do")
      .then((res) => {
        // A response without the cards is not this section's data (e.g. an old demo answer)
        if (!res || !Array.isArray(res.services)) {
          setLoadError("Could not load the section from the server. Refresh the page; if it persists, check the backend is running.");
          return;
        }
        setData({
          eyebrow: res.eyebrow ?? "",
          title: res.title ?? "",
          highlight: res.highlight ?? "",
          description: res.description ?? "",
          button: { label: res.button?.label ?? "", href: res.button?.href ?? "" },
          services: res.services,
          stats: Array.isArray(res.stats) ? res.stats : [],
          industriesTitle: res.industriesTitle ?? "",
          industries: Array.isArray(res.industries) ? res.industries : [],
        });
      })
      .catch((err) => setLoadError(err instanceof ApiRequestError ? err.message : "Could not load the section."));
  }, []);

  const change = (next: Partial<WhatWeDoData>) => {
    setData((d) => (d ? { ...d, ...next } : d));
    setDirty(true);
  };
  const setCard = (i: number, patch: Partial<ServiceCard>) =>
    data && change({ services: data.services.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const setStat = (i: number, patch: Partial<Stat>) =>
    data && change({ stats: data.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const saved = await api.put<WhatWeDoData>("/home-what-we-do", data);
      setData(saved);
      setDirty(false);
      Toast.fire({ icon: "success", iconColor: "#34d399", title: "What We Do saved — live on the website" });
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
        <Loader2 className="h-3 w-3 animate-spin" /> Loading What We Do…
      </p>
    );
  }

  const smallBtn = "grid h-[26px] w-[26px] place-items-center rounded-[4px] text-[#475569] transition hover:bg-slate-100 disabled:opacity-30";

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 rounded-[6px] border border-[#dbe4f3] bg-[#f8fafd] px-3 py-2">
        <p className="text-[10.5px] font-bold text-[#0A2B5E]">
          What We Do — {data.services.length} cards · {data.stats.length} stats
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

      {/* ---------- Heading ---------- */}
      <Card>
        <p className="border-b border-gray-100 pb-1.5 text-[11px] font-bold text-[#1e40af]">Heading & Button</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <TextInput value={data.eyebrow} onChange={(v) => change({ eyebrow: v })} placeholder="What We Do" hideLimit={true} />
          </div>
          <div />
          <div>
            <FieldLabel required>Heading — H1 of the home page (navy)</FieldLabel>
            <TextInput value={data.title} onChange={(v) => change({ title: v })} placeholder="Turnkey Spaces for" hideLimit={true} />
          </div>
          <div>
            <FieldLabel>Heading — H1 (orange, next line)</FieldLabel>
            <TextInput value={data.highlight} onChange={(v) => change({ highlight: v })} placeholder="Every Business" hideLimit={true} />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <Textarea value={data.description} onChange={(v) => change({ description: v })} rows={2} maxLength={300} />
          </div>
          <div>
            <FieldLabel>Button Text</FieldLabel>
            <TextInput value={data.button.label} onChange={(v) => change({ button: { ...data.button, label: v } })} placeholder="View All Services" hideLimit={true} />
          </div>
          <div>
            <FieldLabel>Button Link</FieldLabel>
            <TextInput value={data.button.href} onChange={(v) => change({ button: { ...data.button, href: v } })} placeholder="/services" hideLimit={true} />
          </div>
        </div>
      </Card>

      {/* ---------- Service cards ---------- */}
      {data.services.map((card, i) => (
        <Card key={i}>
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5">
            <p className="text-[11px] font-bold text-[#1e40af]">Card {i + 1}: {card.title || "New card"}</p>
            <div className="flex items-center gap-1">
              <button type="button" title="Move up" disabled={i === 0} onClick={() => change({ services: move(data.services, i, i - 1) })} className={smallBtn}>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" title="Move down" disabled={i === data.services.length - 1} onClick={() => change({ services: move(data.services, i, i + 1) })} className={smallBtn}>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" title="Remove card" onClick={() => change({ services: data.services.filter((_, idx) => idx !== i) })} className={`${smallBtn} text-red-500 hover:bg-red-50`}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <FieldLabel required>Title (H2)</FieldLabel>
              <TextInput value={card.title} onChange={(v) => setCard(i, { title: v })} placeholder="Corporate Interiors" hideLimit={true} />
            </div>
            <div>
              <FieldLabel required>Link</FieldLabel>
              <TextInput value={card.href} onChange={(v) => setCard(i, { href: v })} placeholder="/services/corporate-interiors" hideLimit={true} />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Short Description</FieldLabel>
              <TextInput value={card.desc} onChange={(v) => setCard(i, { desc: v })} placeholder="Workspaces that inspire performance." hideLimit={true} />
            </div>
            <ImageWithAltField
              label="Card Image (Upload)"
              image={card.image}
              alt={card.imageAlt}
              onImageChange={(v) => setCard(i, { image: v })}
              onAltChange={(v) => setCard(i, { imageAlt: v })}
              altLabel="Image Alt Text"
              altPlaceholder="e.g. Corporate office interior by Design House India"
              folder="design-house/what-we-do"
            />
            <ImageWithAltField
              label="Round Icon (Upload)"
              image={card.icon}
              alt={card.iconAlt}
              onImageChange={(v) => setCard(i, { icon: v })}
              onAltChange={(v) => setCard(i, { iconAlt: v })}
              altLabel="Icon Alt Text"
              altPlaceholder="e.g. Corporate Interiors icon"
              folder="design-house/what-we-do"
            />
          </div>
        </Card>
      ))}
      {data.services.length < MAX_CARDS && (
        <button
          type="button"
          onClick={() => change({ services: [...data.services, { title: "", desc: "", href: "/services", image: "", imageAlt: "", icon: "", iconAlt: "" }] })}
          className="inline-flex w-fit items-center gap-1 text-[10.5px] font-semibold text-[#0A2B5E] hover:underline"
        >
          <Plus className="h-3 w-3" /> Add card
        </button>
      )}

      {/* ---------- Stats card ---------- */}
      <Card>
        <p className="border-b border-gray-100 pb-1.5 text-[11px] font-bold text-[#1e40af]">Stats Card (counts up on the website)</p>
        {data.stats.map((stat, i) => (
          <div key={i} className="grid grid-cols-[90px_60px_1fr_150px_auto] items-end gap-2">
            <div>
              <FieldLabel>{`Stat ${i + 1} Number`}</FieldLabel>
              <TextInput value={String(stat.value)} onChange={(v) => setStat(i, { value: Number(v.replace(/[^\d]/g, "")) || 0 })} placeholder="21" hideLimit={true} />
            </div>
            <div>
              <FieldLabel>Suffix</FieldLabel>
              <TextInput value={stat.suffix} onChange={(v) => setStat(i, { suffix: v })} placeholder="+" hideLimit={true} />
            </div>
            <div>
              <FieldLabel>Label</FieldLabel>
              <TextInput value={stat.label} onChange={(v) => setStat(i, { label: v })} placeholder="Years of Experience" hideLimit={true} />
            </div>
            <div>
              <FieldLabel>Icon</FieldLabel>
              <SelectField value={stat.icon} options={STAT_ICON_OPTIONS} onChange={(v) => setStat(i, { icon: v as StatIcon })} />
            </div>
            <button type="button" title="Remove stat" onClick={() => change({ stats: data.stats.filter((_, idx) => idx !== i) })} className={`${smallBtn} mb-[1px] text-red-500 hover:bg-red-50`}>
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {data.stats.length < MAX_STATS && (
          <button
            type="button"
            onClick={() => change({ stats: [...data.stats, { value: 0, suffix: "+", label: "", icon: "trophy" }] })}
            className="inline-flex w-fit items-center gap-1 text-[10.5px] font-semibold text-[#0A2B5E] hover:underline"
          >
            <Plus className="h-3 w-3" /> Add stat
          </button>
        )}
      </Card>

      {/* ---------- Industries ---------- */}
      <Card>
        <p className="border-b border-gray-100 pb-1.5 text-[11px] font-bold text-[#1e40af]">Industries We Serve</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_2fr]">
          <div>
            <FieldLabel>Title</FieldLabel>
            <TextInput value={data.industriesTitle} onChange={(v) => change({ industriesTitle: v })} placeholder="Industries We Serve" hideLimit={true} />
          </div>
          <div>
            <FieldLabel>Industries (separated by commas)</FieldLabel>
            <TextInput
              value={data.industries.join(", ")}
              onChange={(v) => change({ industries: v.split(",").map((s) => s.trim()).filter(Boolean) })}
              placeholder="Corporate, Retail, Hospitality, …"
              hideLimit={true}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
