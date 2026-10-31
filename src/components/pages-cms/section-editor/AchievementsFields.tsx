"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { api, ApiRequestError } from "@/lib/api";
import { FieldLabel, ImageWithAltField, TextInput, Textarea } from "../fields";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: string;
  iconAlt: string;
}

interface AchievementsData {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  backgroundImage: string;
  backgroundAlt: string;
  stats: Stat[];
}

const MAX_STATS = 6;

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
 * Home "Our Achievements" section exactly as the website shows it: heading, background photo and
 * stat cards. Loaded from and saved to the backend (/home-achievements); images go to Cloudinary.
 */
export function AchievementsFields() {
  const [data, setData] = useState<AchievementsData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    api
      .get<Partial<AchievementsData>>("/home-achievements")
      .then((res) => {
        // A response without the stat cards is not this section's data (e.g. an old demo answer)
        if (!res || !Array.isArray(res.stats)) {
          setLoadError("Could not load the section from the server. Refresh the page; if it persists, check the backend is running.");
          return;
        }
        setData({
          eyebrow: res.eyebrow ?? "",
          title: res.title ?? "",
          highlight: res.highlight ?? "",
          description: res.description ?? "",
          backgroundImage: res.backgroundImage ?? "",
          backgroundAlt: res.backgroundAlt ?? "",
          stats: res.stats,
        });
      })
      .catch((err) => setLoadError(err instanceof ApiRequestError ? err.message : "Could not load the section."));
  }, []);

  const change = (next: Partial<AchievementsData>) => {
    setData((d) => (d ? { ...d, ...next } : d));
    setDirty(true);
  };
  const setStat = (i: number, patch: Partial<Stat>) =>
    data && change({ stats: data.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const saved = await api.put<AchievementsData>("/home-achievements", data);
      setData(saved);
      setDirty(false);
      Toast.fire({ icon: "success", iconColor: "#34d399", title: "Achievements saved — live on the website" });
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
        <Loader2 className="h-3 w-3 animate-spin" /> Loading Our Achievements…
      </p>
    );
  }

  const smallBtn = "grid h-[26px] w-[26px] place-items-center rounded-[4px] text-[#475569] transition hover:bg-slate-100 disabled:opacity-30";

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 rounded-[6px] border border-[#dbe4f3] bg-[#f8fafd] px-3 py-2">
        <p className="text-[10.5px] font-bold text-[#0A2B5E]">Our Achievements — {data.stats.length} stat cards</p>
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

      {/* ---------- Heading & background ---------- */}
      <Card>
        <p className="border-b border-gray-100 pb-1.5 text-[11px] font-bold text-[#1e40af]">Heading & Background</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <TextInput value={data.eyebrow} onChange={(v) => change({ eyebrow: v })} placeholder="Our Achievements" hideLimit={true} />
          </div>
          <div />
          <div>
            <FieldLabel required>Heading — H2 (white)</FieldLabel>
            <TextInput value={data.title} onChange={(v) => change({ title: v })} placeholder="Numbers that Reflect" hideLimit={true} />
          </div>
          <div>
            <FieldLabel>Heading — H2 (orange, next line)</FieldLabel>
            <TextInput value={data.highlight} onChange={(v) => change({ highlight: v })} placeholder="Your Trust in Us" hideLimit={true} />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <Textarea value={data.description} onChange={(v) => change({ description: v })} rows={3} maxLength={400} />
          </div>
          <div className="md:col-span-2">
            <ImageWithAltField
              label="Background Image (Upload)"
              image={data.backgroundImage}
              alt={data.backgroundAlt}
              onImageChange={(v) => change({ backgroundImage: v })}
              onAltChange={(v) => change({ backgroundAlt: v })}
              altLabel="Background Alt Text"
              altPlaceholder="e.g. Design House India corporate office reception"
              folder="design-house/achievements"
            />
          </div>
        </div>
      </Card>

      {/* ---------- Stat cards ---------- */}
      {data.stats.map((stat, i) => (
        <Card key={i}>
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5">
            <p className="text-[11px] font-bold text-[#1e40af]">
              Card {i + 1}: {stat.value.toLocaleString()}
              {stat.suffix} {stat.label}
            </p>
            <div className="flex items-center gap-1">
              <button type="button" title="Move up" disabled={i === 0} onClick={() => change({ stats: move(data.stats, i, i - 1) })} className={smallBtn}>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" title="Move down" disabled={i === data.stats.length - 1} onClick={() => change({ stats: move(data.stats, i, i + 1) })} className={smallBtn}>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button type="button" title="Remove card" onClick={() => change({ stats: data.stats.filter((_, idx) => idx !== i) })} className={`${smallBtn} text-red-500 hover:bg-red-50`}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[110px_70px_1fr]">
            <div>
              <FieldLabel required>Number</FieldLabel>
              <TextInput value={String(stat.value)} onChange={(v) => setStat(i, { value: Number(v.replace(/[^\d]/g, "")) || 0 })} placeholder="21" hideLimit={true} />
            </div>
            <div>
              <FieldLabel>Suffix</FieldLabel>
              <TextInput value={stat.suffix} onChange={(v) => setStat(i, { suffix: v })} placeholder="+" hideLimit={true} />
            </div>
            <div>
              <FieldLabel required>Label</FieldLabel>
              <TextInput value={stat.label} onChange={(v) => setStat(i, { label: v })} placeholder="Years Experience" hideLimit={true} />
            </div>
            <div className="md:col-span-3">
              <FieldLabel>Sub-label</FieldLabel>
              <TextInput value={stat.sublabel} onChange={(v) => setStat(i, { sublabel: v })} placeholder="Industry leadership since 2004" hideLimit={true} />
            </div>
            <div className="md:col-span-3">
              <ImageWithAltField
                label="Round Icon (Upload)"
                image={stat.icon}
                alt={stat.iconAlt}
                onImageChange={(v) => setStat(i, { icon: v })}
                onAltChange={(v) => setStat(i, { iconAlt: v })}
                altLabel="Icon Alt Text"
                altPlaceholder="e.g. Years of experience"
                folder="design-house/achievements"
              />
            </div>
          </div>
        </Card>
      ))}
      {data.stats.length < MAX_STATS && (
        <button
          type="button"
          onClick={() => change({ stats: [...data.stats, { value: 0, suffix: "+", label: "", sublabel: "", icon: "", iconAlt: "" }] })}
          className="inline-flex w-fit items-center gap-1 text-[10.5px] font-semibold text-[#0A2B5E] hover:underline"
        >
          <Plus className="h-3 w-3" /> Add stat card
        </button>
      )}
    </div>
  );
}
