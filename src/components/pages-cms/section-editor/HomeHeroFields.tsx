"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { api, ApiRequestError } from "@/lib/api";
import { FieldLabel, ImageWithAltField, SelectField, TextInput, Textarea } from "../fields";

type SlideIcon = "retail" | "corporate" | "restaurant" | "exhibition" | "kiosks" | "signage";

interface HeroSlide {
  icon: SlideIcon;
  label: string;
  href: string;
  image: string;
  imageAlt: string;
  tagline: string[];
  title1: string;
  title2: string;
  desc: string;
  buttonText: string;
}

interface BottomService {
  label: string;
  href: string;
  icon: string;
  iconAlt: string;
}

interface HomeHeroData {
  slides: HeroSlide[];
  secondaryButton: { label: string; href: string };
  bottomServices: BottomService[];
}

const ICON_OPTIONS: { label: string; value: SlideIcon }[] = [
  { label: "Retail showroom", value: "retail" },
  { label: "Corporate interiors", value: "corporate" },
  { label: "Restaurant interiors", value: "restaurant" },
  { label: "Exhibition stall", value: "exhibition" },
  { label: "Retail kiosks", value: "kiosks" },
  { label: "Signage & branding", value: "signage" },
];

const MAX_SLIDES = 10;
const MAX_SERVICES = 8;

const EMPTY_SLIDE: HeroSlide = {
  icon: "retail",
  label: "",
  href: "/services",
  image: "",
  imageAlt: "",
  tagline: ["Design", "Manufacturing", "Execution"],
  title1: "",
  title2: "",
  desc: "",
  buttonText: "Discuss Your Project",
};

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
 * Home page hero exactly as the website shows it: carousel slides (with the service list on the
 * right), the second button and the bottom icon strip. Loaded from and saved to the backend
 * (/home-hero); images are uploaded to Cloudinary.
 */
export function HomeHeroFields() {
  const [data, setData] = useState<HomeHeroData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    api
      .get<HomeHeroData>("/home-hero")
      .then((res) => {
        // A response without slides is not the hero's data (e.g. an old demo answer)
        if (!res || !Array.isArray(res.slides)) {
          setLoadError("Could not load the hero from the server. Refresh the page; if it persists, check the backend is running.");
          return;
        }
        setData({
          slides: res.slides,
          secondaryButton: { label: res.secondaryButton?.label ?? "", href: res.secondaryButton?.href ?? "" },
          bottomServices: Array.isArray(res.bottomServices) ? res.bottomServices : [],
        });
      })
      .catch((err) => setLoadError(err instanceof ApiRequestError ? err.message : "Could not load the hero."));
  }, []);

  const change = (next: Partial<HomeHeroData>) => {
    setData((d) => (d ? { ...d, ...next } : d));
    setDirty(true);
  };
  const setSlide = (i: number, patch: Partial<HeroSlide>) =>
    data && change({ slides: data.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const setService = (i: number, patch: Partial<BottomService>) =>
    data && change({ bottomServices: data.bottomServices.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const saved = await api.put<HomeHeroData>("/home-hero", data);
      setData(saved);
      setDirty(false);
      Toast.fire({ icon: "success", iconColor: "#34d399", title: "Hero saved — live on the website" });
    } catch (err) {
      Toast.fire({ icon: "error", iconColor: "#f87171", title: err instanceof ApiRequestError ? err.message : "Could not save the hero." });
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <p className="rounded-[4px] bg-red-50 px-2 py-1.5 text-[10px] font-semibold text-red-600">{loadError}</p>;
  if (!data) {
    return (
      <p className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
        <Loader2 className="h-3 w-3 animate-spin" /> Loading home hero…
      </p>
    );
  }

  const smallBtn =
    "grid h-[26px] w-[26px] place-items-center rounded-[4px] text-[#475569] transition hover:bg-slate-100 disabled:opacity-30";

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 rounded-[6px] border border-[#dbe4f3] bg-[#f8fafd] px-3 py-2">
        <p className="text-[10.5px] font-bold text-[#0A2B5E]">
          Home Hero — {data.slides.length} slides · {data.bottomServices.length} bottom services
        </p>
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="inline-flex h-[26px] items-center gap-1.5 rounded-[4px] bg-[#0A2B5E] px-[10px] text-[10px] font-semibold text-white transition hover:bg-[#0d3a7d] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
          {saving ? "Saving…" : "Save Hero"}
        </button>
      </div>

      {/* ---------- Slides ---------- */}
      {data.slides.map((slide, i) => (
        <Card key={i}>
          <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5">
            <p className="text-[11px] font-bold text-[#1e40af]">
              Slide {i + 1}: {slide.label.replace(/\n/g, " ") || "New slide"}
            </p>
            <div className="flex items-center gap-1">
              <button type="button" title="Move up" disabled={i === 0} onClick={() => change({ slides: move(data.slides, i, i - 1) })} className={smallBtn}>
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button type="button" title="Move down" disabled={i === data.slides.length - 1} onClick={() => change({ slides: move(data.slides, i, i + 1) })} className={smallBtn}>
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Remove slide"
                disabled={data.slides.length <= 1}
                onClick={() => change({ slides: data.slides.filter((_, idx) => idx !== i) })}
                className={`${smallBtn} text-red-500 hover:bg-red-50`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <FieldLabel required>Service Name (right-side list)</FieldLabel>
              <Textarea value={slide.label} onChange={(v) => setSlide(i, { label: v })} placeholder={"Retail\nShowroom\nInteriors"} rows={2} noLimit={true} />
              <p className="mt-0.5 text-[9.5px] text-slate-500">Press Enter for a new line (shown in capitals on the website).</p>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <FieldLabel required>Link (service page & main button)</FieldLabel>
                <TextInput value={slide.href} onChange={(v) => setSlide(i, { href: v })} placeholder="/services/corporate-interiors" hideLimit={true} />
              </div>
              <div>
                <FieldLabel>Icon (right-side list)</FieldLabel>
                <SelectField value={slide.icon} options={ICON_OPTIONS} onChange={(v) => setSlide(i, { icon: v as SlideIcon })} />
              </div>
            </div>
            <div className="md:col-span-2">
              <ImageWithAltField
                label="Banner Image (Upload)"
                image={slide.image}
                alt={slide.imageAlt}
                onImageChange={(v) => setSlide(i, { image: v })}
                onAltChange={(v) => setSlide(i, { imageAlt: v })}
                altLabel="Banner Alt Text"
                altPlaceholder="e.g. Retail showroom interiors by Design House India"
                folder="design-house/home-hero"
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Tagline (words separated by |)</FieldLabel>
              <TextInput
                value={slide.tagline.join(" | ")}
                onChange={(v) => setSlide(i, { tagline: v.split("|").map((t) => t.trim()).filter(Boolean) })}
                placeholder="Design | Manufacturing | Execution"
                hideLimit={true}
              />
            </div>
            <div>
              <FieldLabel required>Slide Title Line 1 (white, not a heading tag)</FieldLabel>
              <TextInput value={slide.title1} onChange={(v) => setSlide(i, { title1: v })} placeholder="Spaces That" hideLimit={true} />
            </div>
            <div>
              <FieldLabel>Slide Title Line 2 (orange)</FieldLabel>
              <TextInput value={slide.title2} onChange={(v) => setSlide(i, { title2: v })} placeholder="Build Brands" hideLimit={true} />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Description</FieldLabel>
              <Textarea value={slide.desc} onChange={(v) => setSlide(i, { desc: v })} rows={2} maxLength={400} />
            </div>
            <div>
              <FieldLabel>Main Button Text</FieldLabel>
              <TextInput value={slide.buttonText} onChange={(v) => setSlide(i, { buttonText: v })} placeholder="Discuss Your Project" hideLimit={true} />
            </div>
          </div>
        </Card>
      ))}
      {data.slides.length < MAX_SLIDES && (
        <button
          type="button"
          onClick={() => change({ slides: [...data.slides, { ...EMPTY_SLIDE }] })}
          className="inline-flex w-fit items-center gap-1 text-[10.5px] font-semibold text-[#0A2B5E] hover:underline"
        >
          <Plus className="h-3 w-3" /> Add slide
        </button>
      )}

      {/* ---------- Second button (same on every slide) ---------- */}
      <Card>
        <p className="border-b border-gray-100 pb-1.5 text-[11px] font-bold text-[#1e40af]">Second Button (all slides)</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <FieldLabel>Button Text</FieldLabel>
            <TextInput
              value={data.secondaryButton.label}
              onChange={(v) => change({ secondaryButton: { ...data.secondaryButton, label: v } })}
              placeholder="Get A Free Consultation"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Button Link</FieldLabel>
            <TextInput
              value={data.secondaryButton.href}
              onChange={(v) => change({ secondaryButton: { ...data.secondaryButton, href: v } })}
              placeholder="/contact"
              hideLimit={true}
            />
          </div>
        </div>
      </Card>

      {/* ---------- Bottom icon strip ---------- */}
      <Card>
        <p className="border-b border-gray-100 pb-1.5 text-[11px] font-bold text-[#1e40af]">Bottom Services Strip (icons, names & links)</p>
        {data.bottomServices.map((service, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 border-b border-dashed border-gray-200 pb-3 last:border-b-0 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <FieldLabel required>{`Service ${i + 1} Name`}</FieldLabel>
                <button
                  type="button"
                  title="Remove service"
                  onClick={() => change({ bottomServices: data.bottomServices.filter((_, idx) => idx !== i) })}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <Textarea value={service.label} onChange={(v) => setService(i, { label: v })} placeholder={"Design\nConsultancy"} rows={2} noLimit={true} />
            </div>
            <div>
              <FieldLabel required>{`Service ${i + 1} Link`}</FieldLabel>
              <TextInput value={service.href} onChange={(v) => setService(i, { href: v })} placeholder="/services" hideLimit={true} />
            </div>
            <div className="md:col-span-2">
              <ImageWithAltField
                label={`Service ${i + 1} Icon (Upload)`}
                image={service.icon}
                alt={service.iconAlt}
                onImageChange={(v) => setService(i, { icon: v })}
                onAltChange={(v) => setService(i, { iconAlt: v })}
                altLabel="Icon Alt Text"
                altPlaceholder="e.g. Design consultancy"
                folder="design-house/home-hero"
              />
            </div>
          </div>
        ))}
        {data.bottomServices.length < MAX_SERVICES && (
          <button
            type="button"
            onClick={() => change({ bottomServices: [...data.bottomServices, { label: "", href: "/services", icon: "", iconAlt: "" }] })}
            className="inline-flex w-fit items-center gap-1 text-[10.5px] font-semibold text-[#0A2B5E] hover:underline"
          >
            <Plus className="h-3 w-3" /> Add bottom service
          </button>
        )}
      </Card>
    </div>
  );
}
