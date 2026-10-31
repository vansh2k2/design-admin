"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import typography from "../../pages/PagesTypography.module.css";
import Swal from "sweetalert2";
import {
  servicesApi,
  type ServiceItem,
  type ServiceDetailData,
  DEFAULT_SERVICE_LINKS,
} from "@/lib/servicesApi";
import { emptyServiceDetail } from "@/lib/servicesDetailSeed";
import {
  ArrowLeft,
  Eye,
  Link2,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import {
  Activity,
  Armchair,
  BadgeCheck,
  Box,
  Boxes,
  Building,
  Building2,
  Car,
  ChefHat,
  Clock,
  Coffee,
  Cpu,
  Diamond,
  Dumbbell,
  Factory,
  Flower2,
  Gem,
  GraduationCap,
  Hammer,
  Headset,
  HeartPulse,
  Home,
  Hospital,
  Hotel,
  Lamp,
  Laptop,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  LayoutPanelTop,
  Leaf,
  Lightbulb,
  Monitor,
  Palette,
  PencilRuler,
  Pill,
  Presentation,
  Ruler,
  Settings,
  Shapes,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  SignpostBig,
  Smartphone,
  Sofa,
  Sparkles,
  Store,
  Target,
  Trees,
  Truck,
  UtensilsCrossed,
  Users,
  Warehouse,
  Wine,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#1e2433",
  color: "#e2e8f0",
  iconColor: "#4ade80",
});

function showSuccess(msg: string) {
  Toast.fire({ icon: "success", title: msg });
}

function showError(msg: string) {
  Toast.fire({ icon: "error", title: msg, iconColor: "#f87171" });
}

function showWarning(msg: string) {
  Swal.fire({
    icon: "warning",
    title: "Missing Required Field",
    text: msg,
    confirmButtonColor: "#134698",
    background: "#ffffff",
  });
}

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  Armchair,
  BadgeCheck,
  Box,
  Boxes,
  Building,
  Building2,
  Car,
  ChefHat,
  Clock,
  Coffee,
  Cpu,
  Diamond,
  Dumbbell,
  Factory,
  Flower2,
  Gem,
  GraduationCap,
  Hammer,
  Headset,
  HeartPulse,
  Home,
  Hospital,
  Hotel,
  Lamp,
  Laptop,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  LayoutPanelTop,
  Leaf,
  Lightbulb,
  Monitor,
  Palette,
  PencilRuler,
  Pill,
  Presentation,
  Ruler,
  Settings,
  Shapes,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  SignpostBig,
  Smartphone,
  Sofa,
  Sparkles,
  Store,
  Target,
  Trees,
  Truck,
  UtensilsCrossed,
  Users,
  Warehouse,
  Wine,
  Wrench,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

const AVAILABLE_IMAGES = [
  { label: "OS1: Corporate", src: "/services/os1.webp" },
  { label: "OS2: Showroom", src: "/services/os2.webp" },
  { label: "OS3: Restaurant", src: "/services/os3.webp" },
  { label: "OS4: Exhibition", src: "/services/os4.webp" },
  { label: "OS5: Kiosks", src: "/services/os5.webp" },
  { label: "OS6: Fixtures", src: "/services/os6.webp" },
  { label: "OS7: Signage", src: "/services/os7.webp" },
  { label: "OS8: Manufacturing", src: "/services/os8.webp" },
  { label: "OS9: Residential", src: "/services/os9.webp" },
  { label: "OS10: Spa Furniture", src: "/services/os10.webp" },
];

const AVAILABLE_LOGOS = [
  { label: "No Logo Overlay", src: "" },
  { label: "ENSIS", src: "/services/ensis.jpeg" },
];

const slugify = (val: string) =>
  val
    .replace(/\n/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const labelInput =
  "block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider mb-1";
const inputCls =
  "h-[32px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] font-medium text-slate-800 outline-none transition focus:border-[#134698]";
const textareaCls =
  "w-full rounded-[6px] border border-slate-300 bg-white p-2.5 text-[11px] font-medium text-slate-800 outline-none transition focus:border-[#134698] whitespace-pre-line";
const selectCls =
  "h-[32px] w-full rounded-[6px] border border-slate-300 bg-white px-2 text-[11px] font-medium text-slate-800 outline-none cursor-pointer focus:border-[#134698]";
const cardCls = "rounded-[7px] border border-[#e8e5df] bg-white p-[14px] shadow-xs";
const cardTitleCls =
  "mb-3 border-b border-[#e8e5df] pb-2 text-[10px] font-bold uppercase tracking-wide text-[#233D4D]";
const addBtnCls =
  "inline-flex h-[26px] items-center gap-1 rounded-[5px] border border-[#bfdbfe] bg-[#eff6ff] px-2.5 text-[8px] font-bold text-[#1d4ed8] transition hover:bg-[#dbeafe]";
const delBtnCls =
  "flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[5px] border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100";

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-center justify-between border-b-[2px] border-[#293681] pb-[8px]">
      <div>
        <h2 className="text-[13px] font-bold tracking-[-0.01em] text-[#23471d]">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[8.5px] font-medium text-[#6c7587]">{subtitle}</p>}
      </div>
    </div>
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const Preview = ICON_MAP[value];
  return (
    <div className="flex items-center gap-1.5">
      <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[5px] border border-slate-200 bg-slate-50 text-[#134698]">
        {Preview ? <Preview className="h-3.5 w-3.5" /> : <Shapes className="h-3.5 w-3.5" />}
      </span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {ICON_OPTIONS.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  previewH = "h-[70px]",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  previewH?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className={labelInput}>{label}</label>
      <div className="flex items-start gap-3">
        <div className={`relative ${previewH} w-[110px] shrink-0 overflow-hidden rounded-[6px] border border-slate-300 bg-slate-50 shadow-xs`}>
          <img
            src={value}
            alt={label}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/services/os1.webp";
            }}
          />
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/services/detail/b2.webp"
            className={inputCls}
          />
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => onChange((ev.target?.result as string) || "");
                reader.readAsDataURL(file);
              }
            }}
          />
          <button type="button" onClick={() => fileRef.current?.click()} className={`h-[26px] ${addBtnCls}`}>
            <Upload className="h-3 w-3" /> Upload
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {AVAILABLE_IMAGES.map((img) => (
          <button
            type="button"
            key={img.src}
            onClick={() => onChange(img.src)}
            title={img.label}
            className={`h-[30px] overflow-hidden rounded-[4px] border transition ${
              value === img.src
                ? "border-[#134698] ring-2 ring-[#134698]/30"
                : "border-slate-200 opacity-75 hover:opacity-100"
            }`}
          >
            <img src={img.src} alt={img.label} className="h-full w-[44px] object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function AddEditServiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    href: "",
    image: "/services/os1.webp",
    imageAlt: "",
    logo: "",
    status: "Published",
    author: "Design House Team",
    views: 500,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    detail: emptyServiceDetail(""),
  });

  const [isLoading, setIsLoading] = useState(Boolean(editId));
  const [isSaving, setIsSaving] = useState(false);
  const [isHrefDetached, setIsHrefDetached] = useState(false);

  const setDetail = (patch: Partial<ServiceDetailData>) =>
    setFormData((prev) => ({ ...prev, detail: { ...prev.detail, ...patch } }));

  const setHero = (patch: Partial<ServiceDetailData["hero"]>) =>
    setFormData((prev) => ({ ...prev, detail: { ...prev.detail, hero: { ...prev.detail.hero, ...patch } } }));

  const setWhy = (patch: Partial<ServiceDetailData["why"]>) =>
    setFormData((prev) => ({ ...prev, detail: { ...prev.detail, why: { ...prev.detail.why, ...patch } } }));

  const setProcess = (patch: Partial<ServiceDetailData["process"]>) =>
    setFormData((prev) => ({ ...prev, detail: { ...prev.detail, process: { ...prev.detail.process, ...patch } } }));

  const setProjects = (patch: Partial<ServiceDetailData["projects"]>) =>
    setFormData((prev) => ({ ...prev, detail: { ...prev.detail, projects: { ...prev.detail.projects, ...patch } } }));

  const setIdealFor = (patch: Partial<ServiceDetailData["idealFor"]>) =>
    setFormData((prev) => ({ ...prev, detail: { ...prev.detail, idealFor: { ...prev.detail.idealFor, ...patch } } }));

  // Load existing service if editing
  useEffect(() => {
    if (!editId) {
      setIsLoading(false);
      return;
    }

    servicesApi
      .get(editId)
      .then((service) => {
        if (service) {
          setFormData({
            title: service.title || "",
            desc: service.desc || "",
            href: service.href || "",
            image: service.image || "/services/os1.webp",
            imageAlt: service.imageAlt || "",
            logo: service.logo || "",
            status: service.status || "Published",
            author: service.author || "Design House Team",
            views: service.views || 0,
            metaTitle: service.metaTitle || service.title.replace(/\n/g, " ") || "",
            metaDescription: service.metaDescription || service.desc.replace(/\n/g, " ") || "",
            metaKeywords: service.metaKeywords || "",
            detail: service.detail || emptyServiceDetail(service.title.replace(/\n/g, " ")),
          });
          setIsHrefDetached(true);
        } else {
          showError("Service not found");
        }
      })
      .catch((err) => {
        console.error("Error loading service:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [editId]);

  // Auto-generate target URL from title if not detached
  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!isHrefDetached) {
      const plainTitle = val.replace(/\n/g, " ");
      const slugPart = slugify(val);
      setFormData((prev) => ({
        ...prev,
        title: val,
        href: slugPart ? `/services/${slugPart}` : "",
        metaTitle: plainTitle ? `${plainTitle} | Design House India` : "",
        imageAlt: plainTitle ? plainTitle : "",
        detail: { ...prev.detail, name: prev.detail.name || plainTitle },
      }));
    } else {
      setFormData((prev) => ({ ...prev, title: val }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setFormData((prev) => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setFormData((prev) => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showWarning("Please provide a Service Title.");
      return;
    }

    try {
      setIsSaving(true);
      const payload: Partial<ServiceItem> = {
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        href: formData.href.trim() || `/services/${slugify(formData.title) || "new-service"}`,
        image: formData.image,
        imageAlt: formData.imageAlt.trim() || formData.title.replace(/\n/g, " "),
        logo: formData.logo,
        status: formData.status as "Published" | "Draft" | "Scheduled",
        author: formData.author.trim(),
        views: Number(formData.views) || 0,
        metaTitle: formData.metaTitle.trim(),
        metaDescription: formData.metaDescription.trim(),
        metaKeywords: formData.metaKeywords.trim(),
        detail: {
          ...formData.detail,
          name: formData.detail.name.trim() || formData.title.replace(/\n/g, " "),
        },
      };

      if (editId) {
        await servicesApi.update(editId, payload);
        showSuccess("Service updated successfully!");
      } else {
        await servicesApi.create(payload);
        showSuccess("New service added successfully!");
      }

      setTimeout(() => {
        router.push("/services");
      }, 700);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 text-[12px] font-semibold text-slate-500">
        Loading service details...
      </div>
    );
  }

  const detail = formData.detail;

  return (
    <main
      className={`${typography.pages} h-full min-h-0 w-full overflow-y-auto overflow-x-hidden bg-[#fffefb] px-[18px] py-[14px] text-[#142347] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300`}
    >
      <form onSubmit={handleSubmit} className="min-h-full w-full">
        {/* TOP BAR */}
        <div className="mb-[18px] flex shrink-0 items-center justify-between border-b-[2px] border-[#293681] pb-[8px]">
          <div className="flex items-center gap-3">
            <Link
              href="/services"
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-[19px] font-bold leading-[1.15] tracking-[-0.018em] text-[#23471d]">
                {editId ? "Edit Service" : "Add New Service"}
              </h1>
              <p className="mt-0.5 text-[9px] font-medium text-[#6c7587]">
                Edit the service card and the full detail page — hero, why choose us, process, projects, ideal-for, FAQs &amp; CTA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[10px]">
            <Link
              href="/services"
              className="flex h-[30px] items-center justify-center rounded-[6px] border border-slate-300 bg-white px-[14px] text-[8.5px] font-semibold text-slate-700 transition hover:bg-slate-50 shadow-xs"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="flex h-[30px] items-center justify-center gap-[5px] rounded-[6px] bg-[#4B1426] px-[16px] text-[8.5px] font-semibold text-white shadow-[0_5px_12px_rgba(75,20,38,0.25)] transition hover:bg-[#3a0f1d] disabled:opacity-50"
            >
              <Save className="h-[12px] w-[12px]" strokeWidth={1.8} />
              {isSaving ? "Saving..." : editId ? "Update Service" : "Publish Service"}
            </button>
          </div>
        </div>

        {/* TWO COLUMN GRID */}
        <div className="grid grid-cols-1 items-start gap-[16px] xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,0.9fr)]">
          {/* LEFT COLUMN: MAIN FIELDS */}
          <div className="space-y-[14px]">
            {/* CARD 1: PRIMARY INFORMATION */}
            <div className={cardCls}>
              <h2 className={cardTitleCls}>Service Information (Website Card)</h2>

              <div className="space-y-3">
                <div>
                  <label className={labelInput}>
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder={"Corporate Interiors\n(use line breaks like the website)"}
                    className={textareaCls}
                  />
                  <p className="mt-1 text-[7.5px] text-slate-500">
                    Line breaks are allowed — same format as the website cards (e.g. &quot;Retail Showroom{"\n"}Interiors&quot;).
                  </p>
                </div>

                <div>
                  <label className={labelInput}>Service Description</label>
                  <textarea
                    rows={4}
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    placeholder={"Workspaces designed for\nproductivity, brand identity\nand growth."}
                    className={textareaCls}
                  />
                </div>

                <div>
                  <label className={labelInput}>Detail Page Link / Route</label>
                  <input
                    type="text"
                    value={formData.href}
                    onChange={(e) => {
                      setIsHrefDetached(true);
                      setFormData({ ...formData, href: e.target.value });
                    }}
                    placeholder="/services/corporate-interiors"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelInput}>Detail Page Name (breadcrumb / metadata)</label>
                  <input
                    type="text"
                    value={detail.name}
                    onChange={(e) => setDetail({ name: e.target.value })}
                    placeholder="Corporate Interiors"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: SERVICE IMAGE & PRESETS */}
            <div className={cardCls}>
              <h2 className={cardTitleCls}>Service Card Image</h2>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative h-[90px] w-[140px] shrink-0 rounded-[6px] border border-slate-300 bg-slate-50 overflow-hidden shadow-xs">
                    <img
                      src={formData.image}
                      alt={formData.title.replace(/\n/g, " ") || "Service Preview"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/services/os1.webp";
                      }}
                    />
                    {formData.logo && (
                      <div className="absolute inset-x-0 bottom-0 flex h-[22px] items-center justify-center bg-white/95">
                        <img src={formData.logo} alt="Logo Overlay" className="max-h-[18px] max-w-[70%] object-contain" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div>
                      <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1">
                        Image URL / File Path
                      </label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="/services/os1.webp"
                        className={inputCls}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex h-[28px] items-center gap-1.5 rounded-[5px] border border-slate-300 bg-slate-50 px-3 text-[8.5px] font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Upload className="h-3 w-3" /> Upload Custom Image
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1.5">
                    Or select from Design House Services Library:
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {AVAILABLE_IMAGES.map((img) => (
                      <button
                        type="button"
                        key={img.src}
                        onClick={() => setFormData({ ...formData, image: img.src })}
                        className={`group relative h-[48px] rounded-[5px] overflow-hidden border transition ${
                          formData.image === img.src
                            ? "border-[#134698] ring-2 ring-[#134698]/30 shadow-xs"
                            : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 py-0.5 text-[6.5px] font-bold text-white text-center truncate">
                          {img.label.split(":")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelInput}>Image Alt Text</label>
                  <input
                    type="text"
                    value={formData.imageAlt}
                    onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                    placeholder="Corporate Interiors workspace"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* CARD 3: LOGO OVERLAY */}
            <div className={cardCls}>
              <h2 className={cardTitleCls}>
                Brand Logo Overlay <span className="text-[8px] font-semibold text-slate-400 normal-case">(optional)</span>
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="relative grid h-[54px] w-[90px] shrink-0 place-items-center rounded-[6px] border border-slate-300 bg-slate-50 shadow-xs overflow-hidden">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Logo Preview" className="max-h-[40px] max-w-[80%] object-contain" />
                    ) : (
                      <span className="text-[8px] font-medium text-slate-400">No Logo</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="text"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="/services/ensis.jpeg"
                      className={inputCls}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={logoInputRef}
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="inline-flex h-[28px] items-center gap-1.5 rounded-[5px] border border-slate-300 bg-slate-50 px-3 text-[8.5px] font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Upload className="h-3 w-3" /> Upload Logo
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1.5">
                    Quick Logo Presets:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_LOGOS.map((logo) => (
                      <button
                        type="button"
                        key={logo.src || "none"}
                        onClick={() => setFormData({ ...formData, logo: logo.src })}
                        className={`inline-flex h-[34px] items-center gap-1.5 rounded-[5px] border px-3 text-[8.5px] font-bold transition ${
                          formData.logo === logo.src
                            ? "border-[#134698] bg-[#eff6ff] text-[#134698] ring-2 ring-[#134698]/20"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400"
                        }`}
                      >
                        {logo.src && (
                          <img src={logo.src} alt={logo.label} className="max-h-[18px] max-w-[40px] object-contain" />
                        )}
                        {logo.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PUBLISHING & SEO */}
          <div className="space-y-[14px]">
            {/* PUBLISHING CONTROLS */}
            <div className={cardCls}>
              <h2 className={cardTitleCls}>Publishing Status</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={selectCls}
                  >
                    <option value="Published">Published (Live on Website)</option>
                    <option value="Draft">Draft (Internal Only)</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1">
                    Managed / Updated By
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1">
                    Estimated Views
                  </label>
                  <input
                    type="number"
                    value={formData.views}
                    onChange={(e) => setFormData({ ...formData, views: Number(e.target.value) })}
                    className={inputCls}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="mt-2 flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#134698] text-[9.5px] font-bold text-white shadow-xs transition hover:bg-[#0c2e68] disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  {isSaving ? "Saving Service..." : editId ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </div>

            {/* WEBSITE LINK REFERENCE */}
            <div className={cardCls}>
              <h2 className={cardTitleCls}>Website Reference Links</h2>

              <div className="space-y-2">
                <a
                  href="http://localhost:3010/services"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[30px] items-center justify-center gap-1.5 rounded-[5px] border border-[#bfdbfe] bg-[#eff6ff] text-[8.5px] font-bold text-[#1d4ed8] transition hover:bg-[#dbeafe]"
                >
                  <Eye className="h-3 w-3" /> Open /services on Website
                </a>
                {formData.href && (
                  <a
                    href={`http://localhost:3010${formData.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[30px] items-center justify-center gap-1.5 rounded-[5px] border border-[#e2e8f0] bg-slate-50 text-[8.5px] font-bold text-slate-600 transition hover:bg-slate-100 truncate px-3"
                  >
                    <Link2 className="h-3 w-3 shrink-0" /> {formData.href}
                  </a>
                )}
                <div className="mt-2 rounded-[5px] border border-[#edf0f2] bg-[#fbfcfc] p-2.5">
                  <p className="text-[7.5px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Existing Detail Pages
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {DEFAULT_SERVICE_LINKS.map((link) => (
                      <span
                        key={link}
                        className="inline-block rounded-[3px] bg-slate-100 border border-slate-200 px-[5px] py-[1px] text-[7px] font-semibold text-slate-600"
                      >
                        {link.replace("/services/", "")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SEO SETTINGS */}
            <div className={cardCls}>
              <h2 className={cardTitleCls}>SEO Meta Tags</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="Corporate Interiors | Design House India"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Workspaces designed for productivity, brand identity and growth..."
                    className={textareaCls}
                  />
                </div>

                <div>
                  <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.metaKeywords}
                    onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                    placeholder="corporate interiors, office design, turnkey execution"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SERVICE DETAIL PAGE CONTENT ================= */}
        <div className="mt-[18px] space-y-[14px]">
          <SectionHeading
            title="Service Detail Page Content (/services/...)"
            subtitle="Everything shown on the detail page — hero banner, why choose us, our process, featured projects, ideal for, FAQs and the bottom CTA."
          />

          {/* HERO */}
          <div className={cardCls}>
            <h2 className={cardTitleCls}>1. Hero Banner</h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div>
                <label className={labelInput}>Eyebrow (small label)</label>
                <input
                  type="text"
                  value={detail.hero.eyebrow || ""}
                  onChange={(e) => setHero({ eyebrow: e.target.value })}
                  placeholder="Our Services"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>Photo Style</label>
                <select
                  value={detail.hero.photoStyle || "fade"}
                  onChange={(e) => setHero({ photoStyle: e.target.value as "fade" | "cut" })}
                  className={selectCls}
                >
                  <option value="fade">Fade (photo fades into white)</option>
                  <option value="cut">Cut (diagonal edge + gold band)</option>
                </select>
              </div>
              <div>
                <label className={labelInput}>Title Line 1</label>
                <input
                  type="text"
                  value={detail.hero.title[0]}
                  onChange={(e) => setHero({ title: [e.target.value, detail.hero.title[1]] })}
                  placeholder="Corporate"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>
                  Title Line 2 <span className="normal-case text-slate-400">(shown in gold)</span>
                </label>
                <input
                  type="text"
                  value={detail.hero.title[1]}
                  onChange={(e) => setHero({ title: [detail.hero.title[0], e.target.value] })}
                  placeholder="Interiors"
                  className={inputCls}
                />
              </div>
              <div className="lg:col-span-2">
                <label className={labelInput}>Tagline</label>
                <input
                  type="text"
                  value={detail.hero.tagline || ""}
                  onChange={(e) => setHero({ tagline: e.target.value })}
                  placeholder="Workspaces Designed for Productivity, Brand Identity and Growth."
                  className={inputCls}
                />
              </div>
              <div className="lg:col-span-2">
                <label className={labelInput}>Hero Text</label>
                <textarea
                  rows={3}
                  value={detail.hero.text}
                  onChange={(e) => setHero({ text: e.target.value })}
                  placeholder="We create modern, functional and inspiring corporate spaces..."
                  className={textareaCls}
                />
              </div>
              <div className="lg:col-span-2">
                <ImageField
                  label="Hero Image"
                  value={detail.hero.image}
                  onChange={(v) => setHero({ image: v })}
                />
              </div>
              <div>
                <label className={labelInput}>Photo Words (stacked on photo, comma separated)</label>
                <input
                  type="text"
                  value={(detail.hero.photoWords || []).join(", ")}
                  onChange={(e) =>
                    setHero({
                      photoWords: e.target.value
                        .split(",")
                        .map((w) => w.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="Brands, People, Spaces"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>Secondary CTA Button</label>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="secondaryCta"
                    checked={Boolean(detail.hero.secondaryCta)}
                    onChange={(e) => setHero({ secondaryCta: e.target.checked })}
                    className="h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="secondaryCta" className="text-[10px] font-semibold text-slate-700 cursor-pointer">
                    Show &quot;View Projects&quot; outlined button
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelInput}>Primary CTA Label</label>
                  <input
                    type="text"
                    value={detail.hero.primaryCta?.label || ""}
                    onChange={(e) =>
                      setHero({
                        primaryCta: { label: e.target.value, href: detail.hero.primaryCta?.href || "/contact" },
                      })
                    }
                    placeholder="Enquire Now"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelInput}>Primary CTA Link</label>
                  <input
                    type="text"
                    value={detail.hero.primaryCta?.href || ""}
                    onChange={(e) =>
                      setHero({
                        primaryCta: { label: detail.hero.primaryCta?.label || "Enquire Now", href: e.target.value },
                      })
                    }
                    placeholder="/contact"
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelInput}>Secondary Link Label</label>
                  <input
                    type="text"
                    value={detail.hero.secondaryCtaLink?.label || ""}
                    onChange={(e) =>
                      setHero({
                        secondaryCtaLink: { label: e.target.value, href: detail.hero.secondaryCtaLink?.href || "/portfolio" },
                      })
                    }
                    placeholder="View Projects"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelInput}>Secondary Link URL</label>
                  <input
                    type="text"
                    value={detail.hero.secondaryCtaLink?.href || ""}
                    onChange={(e) =>
                      setHero({
                        secondaryCtaLink: { label: detail.hero.secondaryCtaLink?.label || "View Projects", href: e.target.value },
                      })
                    }
                    placeholder="/portfolio"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Brand logo above title (ENSIS style) */}
              <div className="lg:col-span-2 rounded-[6px] border border-[#edf0f2] bg-[#fbfcfc] p-3">
                <p className="mb-2 text-[8px] font-bold uppercase tracking-wider text-slate-500">
                  Brand Logo Above Title (optional — used by ENSIS)
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <input
                    type="text"
                    value={detail.hero.brandLogo?.src || ""}
                    onChange={(e) =>
                      setHero({
                        brandLogo: {
                          src: e.target.value,
                          alt: detail.hero.brandLogo?.alt || "",
                          width: detail.hero.brandLogo?.width || 472,
                          height: detail.hero.brandLogo?.height || 193,
                          tagline: detail.hero.brandLogo?.tagline || "",
                        },
                      })
                    }
                    placeholder="/Ensis Panchakarma.png"
                    className={inputCls}
                  />
                  <input
                    type="text"
                    value={detail.hero.brandLogo?.alt || ""}
                    onChange={(e) =>
                      setHero({
                        brandLogo: {
                          src: detail.hero.brandLogo?.src || "",
                          alt: e.target.value,
                          width: detail.hero.brandLogo?.width || 472,
                          height: detail.hero.brandLogo?.height || 193,
                          tagline: detail.hero.brandLogo?.tagline || "",
                        },
                      })
                    }
                    placeholder="Logo alt text"
                    className={inputCls}
                  />
                  <input
                    type="text"
                    value={detail.hero.brandLogo?.tagline || ""}
                    onChange={(e) =>
                      setHero({
                        brandLogo: {
                          src: detail.hero.brandLogo?.src || "",
                          alt: detail.hero.brandLogo?.alt || "",
                          width: detail.hero.brandLogo?.width || 472,
                          height: detail.hero.brandLogo?.height || 193,
                          tagline: e.target.value,
                        },
                      })
                    }
                    placeholder="Logo tagline"
                    className={inputCls}
                  />
                  <button
                    type="button"
                    onClick={() => setHero({ brandLogo: undefined })}
                    className="h-[32px] rounded-[6px] border border-red-200 bg-red-50 text-[9px] font-bold text-red-600 hover:bg-red-100 transition"
                  >
                    Remove Logo
                  </button>
                </div>
              </div>
            </div>

            {/* HERO FEATURES */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider">
                  Hero Feature Strip ({detail.hero.features.length})
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setHero({ features: [...detail.hero.features, { icon: "Sparkles", label: "New Feature", text: "" }] })
                  }
                  className={addBtnCls}
                >
                  <Plus className="h-3 w-3" /> Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {detail.hero.features.map((f, i) => (
                  <div key={i} className="grid grid-cols-1 gap-2 rounded-[6px] border border-[#edf0f2] bg-[#fbfcfc] p-2 sm:grid-cols-[150px_1fr_1fr_24px]">
                    <IconPicker
                      value={f.icon}
                      onChange={(v) => {
                        const next = [...detail.hero.features];
                        next[i] = { ...f, icon: v };
                        setHero({ features: next });
                      }}
                    />
                    <input
                      type="text"
                      value={f.label}
                      onChange={(e) => {
                        const next = [...detail.hero.features];
                        next[i] = { ...f, label: e.target.value };
                        setHero({ features: next });
                      }}
                      placeholder="Workspace&#10;Planning"
                      className={inputCls}
                    />
                    <input
                      type="text"
                      value={f.text || ""}
                      onChange={(e) => {
                        const next = [...detail.hero.features];
                        next[i] = { ...f, text: e.target.value };
                        setHero({ features: next });
                      }}
                      placeholder="Feature text (optional)"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => setHero({ features: detail.hero.features.filter((_, idx) => idx !== i) })}
                      className={delBtnCls}
                      title="Remove"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {detail.hero.features.length === 0 && (
                  <p className="text-[9px] text-slate-400">No features yet. Add the strip items shown under the hero banner.</p>
                )}
              </div>
            </div>
          </div>

          {/* WHY */}
          <div className={cardCls}>
            <h2 className={cardTitleCls}>2. Why Choose Us</h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div>
                <label className={labelInput}>Eyebrow</label>
                <input
                  type="text"
                  value={detail.why.eyebrow || ""}
                  onChange={(e) => setWhy({ eyebrow: e.target.value })}
                  placeholder="Why Choose Us"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>Layout</label>
                <select
                  value={detail.why.layout || "split"}
                  onChange={(e) => setWhy({ layout: e.target.value as "split" | "overview" })}
                  className={selectCls}
                >
                  <option value="split">Split (edge-to-edge photo + points beside)</option>
                  <option value="overview">Overview (inset photo, points below)</option>
                </select>
              </div>
              <div>
                <label className={labelInput}>Title Line 1</label>
                <input
                  type="text"
                  value={detail.why.title[0]}
                  onChange={(e) => setWhy({ title: [e.target.value, detail.why.title[1]] })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>Title Line 2</label>
                <input
                  type="text"
                  value={detail.why.title[1]}
                  onChange={(e) => setWhy({ title: [detail.why.title[0], e.target.value] })}
                  className={inputCls}
                />
              </div>
              <div className="lg:col-span-2">
                <label className={labelInput}>Section Text</label>
                <textarea
                  rows={3}
                  value={detail.why.text}
                  onChange={(e) => setWhy({ text: e.target.value })}
                  className={textareaCls}
                />
              </div>
              <div className="lg:col-span-2">
                <ImageField label="Section Image" value={detail.why.image} onChange={(v) => setWhy({ image: v })} />
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider">
                  Why Points ({detail.why.points.length})
                </label>
                <button
                  type="button"
                  onClick={() => setWhy({ points: [...detail.why.points, { icon: "BadgeCheck", title: "New Point", text: "" }] })}
                  className={addBtnCls}
                >
                  <Plus className="h-3 w-3" /> Add Point
                </button>
              </div>
              <div className="space-y-2">
                {detail.why.points.map((p, i) => (
                  <div key={i} className="grid grid-cols-1 gap-2 rounded-[6px] border border-[#edf0f2] bg-[#fbfcfc] p-2 sm:grid-cols-[150px_1fr_1fr_24px]">
                    <IconPicker
                      value={p.icon}
                      onChange={(v) => {
                        const next = [...detail.why.points];
                        next[i] = { ...p, icon: v };
                        setWhy({ points: next });
                      }}
                    />
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => {
                        const next = [...detail.why.points];
                        next[i] = { ...p, title: e.target.value };
                        setWhy({ points: next });
                      }}
                      className={inputCls}
                    />
                    <input
                      type="text"
                      value={p.text}
                      onChange={(e) => {
                        const next = [...detail.why.points];
                        next[i] = { ...p, text: e.target.value };
                        setWhy({ points: next });
                      }}
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => setWhy({ points: detail.why.points.filter((_, idx) => idx !== i) })}
                      className={delBtnCls}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {detail.why.points.length === 0 && (
                  <p className="text-[9px] text-slate-400">No points yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* PROCESS */}
          <div className={cardCls}>
            <h2 className={cardTitleCls}>3. Our Process</h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div>
                <label className={labelInput}>Title</label>
                <input
                  type="text"
                  value={detail.process.title}
                  onChange={(e) => setProcess({ title: e.target.value })}
                  placeholder="From Planning to Possession"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>Tone</label>
                <select
                  value={detail.process.tone || "white"}
                  onChange={(e) => setProcess({ tone: e.target.value as "white" | "warm" })}
                  className={selectCls}
                >
                  <option value="white">White</option>
                  <option value="warm">Warm</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className={labelInput}>Subtitle Text</label>
                <input
                  type="text"
                  value={detail.process.text}
                  onChange={(e) => setProcess({ text: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider">
                  Process Steps ({detail.process.steps.length})
                </label>
                <button
                  type="button"
                  onClick={() => setProcess({ steps: [...detail.process.steps, { title: "New Step", text: "" }] })}
                  className={addBtnCls}
                >
                  <Plus className="h-3 w-3" /> Add Step
                </button>
              </div>
              <div className="space-y-2">
                {detail.process.steps.map((s, i) => (
                  <div key={i} className="grid grid-cols-1 gap-2 rounded-[6px] border border-[#edf0f2] bg-[#fbfcfc] p-2 sm:grid-cols-[1fr_1.5fr_24px]">
                    <input
                      type="text"
                      value={s.title}
                      onChange={(e) => {
                        const next = [...detail.process.steps];
                        next[i] = { ...s, title: e.target.value };
                        setProcess({ steps: next });
                      }}
                      placeholder={`Step ${i + 1} title`}
                      className={inputCls}
                    />
                    <input
                      type="text"
                      value={s.text}
                      onChange={(e) => {
                        const next = [...detail.process.steps];
                        next[i] = { ...s, text: e.target.value };
                        setProcess({ steps: next });
                      }}
                      placeholder="Step description"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => setProcess({ steps: detail.process.steps.filter((_, idx) => idx !== i) })}
                      className={delBtnCls}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {detail.process.steps.length === 0 && <p className="text-[9px] text-slate-400">No steps yet.</p>}
              </div>
            </div>
          </div>

          {/* FEATURED PROJECTS */}
          <div className={cardCls}>
            <h2 className={cardTitleCls}>4. Featured Projects / Products</h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div>
                <label className={labelInput}>Eyebrow (default: Featured Projects)</label>
                <input
                  type="text"
                  value={detail.projects.eyebrow || ""}
                  onChange={(e) => setProjects({ eyebrow: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>Link Label (default: View All Projects)</label>
                <input
                  type="text"
                  value={detail.projects.linkLabel || ""}
                  onChange={(e) => setProjects({ linkLabel: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>Title</label>
                <input
                  type="text"
                  value={detail.projects.title}
                  onChange={(e) => setProjects({ title: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>Link Style</label>
                <select
                  value={detail.projects.linkStyle || "button"}
                  onChange={(e) => setProjects({ linkStyle: e.target.value as "button" | "text" })}
                  className={selectCls}
                >
                  <option value="button">Gold Button</option>
                  <option value="text">Text Link</option>
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className={labelInput}>Subtitle Text</label>
                <input
                  type="text"
                  value={detail.projects.text || ""}
                  onChange={(e) => setProjects({ text: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider">
                  Project Cards ({detail.projects.items.length})
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setProjects({ items: [...detail.projects.items, { title: "New Project", place: "", image: "/services/os1.webp" }] })
                  }
                  className={addBtnCls}
                >
                  <Plus className="h-3 w-3" /> Add Project
                </button>
              </div>
              <div className="space-y-3">
                {detail.projects.items.map((item, i) => (
                  <div key={i} className="rounded-[6px] border border-[#edf0f2] bg-[#fbfcfc] p-2">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_24px]">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const next = [...detail.projects.items];
                          next[i] = { ...item, title: e.target.value };
                          setProjects({ items: next });
                        }}
                        placeholder="Project title"
                        className={inputCls}
                      />
                      <input
                        type="text"
                        value={item.place}
                        onChange={(e) => {
                          const next = [...detail.projects.items];
                          next[i] = { ...item, place: e.target.value };
                          setProjects({ items: next });
                        }}
                        placeholder="Place / location"
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={() => setProjects({ items: detail.projects.items.filter((_, idx) => idx !== i) })}
                        className={delBtnCls}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-[38px] w-[60px] shrink-0 overflow-hidden rounded-[4px] border border-slate-200 bg-white">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          onError={(e) => ((e.target as HTMLImageElement).src = "/services/os1.webp")}
                        />
                      </div>
                      <input
                        type="text"
                        value={item.image}
                        onChange={(e) => {
                          const next = [...detail.projects.items];
                          next[i] = { ...item, image: e.target.value };
                          setProjects({ items: next });
                        }}
                        placeholder="/services/detail/b2.webp"
                        className={inputCls}
                      />
                    </div>
                  </div>
                ))}
                {detail.projects.items.length === 0 && (
                  <p className="text-[9px] text-slate-400">No project cards yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* IDEAL FOR */}
          <div className={cardCls}>
            <h2 className={cardTitleCls}>5. Ideal For</h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div>
                <label className={labelInput}>Title (one line per row)</label>
                <textarea
                  rows={2}
                  value={(detail.idealFor.title || []).join("\n")}
                  onChange={(e) => setIdealFor({ title: e.target.value.split("\n") })}
                  className={textareaCls}
                />
              </div>
              <div>
                <label className={labelInput}>Subtitle Text</label>
                <textarea
                  rows={2}
                  value={detail.idealFor.text || ""}
                  onChange={(e) => setIdealFor({ text: e.target.value })}
                  className={textareaCls}
                />
              </div>
              <div>
                <label className={labelInput}>Checklist Items (one per row — list layout)</label>
                <textarea
                  rows={7}
                  value={(detail.idealFor.items || []).join("\n")}
                  onChange={(e) =>
                    setIdealFor({
                      items: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                    })
                  }
                  placeholder={"IT & ITES Companies\nConsulting Firms\nAnd More..."}
                  className={textareaCls}
                />
                <p className="mt-1 text-[7.5px] text-slate-500">
                  Used with the photo layout (Corporate look). Leave empty to use icon tiles.
                </p>
              </div>
              <div>
                <label className={labelInput}>Section Image (list layout)</label>
                <ImageField label="" value={detail.idealFor.image || ""} onChange={(v) => setIdealFor({ image: v })} />
              </div>
              <div>
                <label className={labelInput}>Icon Tone (tile layout)</label>
                <select
                  value={detail.idealFor.iconTone || "gold"}
                  onChange={(e) => setIdealFor({ iconTone: e.target.value as "gold" | "navy" })}
                  className={selectCls}
                >
                  <option value="gold">Gold</option>
                  <option value="navy">Navy</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider">
                  Icon Tiles ({detail.idealFor.tiles?.length || 0})
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setIdealFor({ tiles: [...(detail.idealFor.tiles || []), { icon: "Sparkles", label: "New Tile" }] })
                  }
                  className={addBtnCls}
                >
                  <Plus className="h-3 w-3" /> Add Tile
                </button>
              </div>
              <div className="space-y-2">
                {(detail.idealFor.tiles || []).map((t, i) => (
                  <div key={i} className="grid grid-cols-1 gap-2 rounded-[6px] border border-[#edf0f2] bg-[#fbfcfc] p-2 sm:grid-cols-[150px_1fr_24px]">
                    <IconPicker
                      value={t.icon}
                      onChange={(v) => {
                        const next = [...(detail.idealFor.tiles || [])];
                        next[i] = { ...t, icon: v };
                        setIdealFor({ tiles: next });
                      }}
                    />
                    <input
                      type="text"
                      value={t.label}
                      onChange={(e) => {
                        const next = [...(detail.idealFor.tiles || [])];
                        next[i] = { ...t, label: e.target.value };
                        setIdealFor({ tiles: next });
                      }}
                      className={`${inputCls} whitespace-pre-line`}
                    />
                    <button
                      type="button"
                      onClick={() => setIdealFor({ tiles: (detail.idealFor.tiles || []).filter((_, idx) => idx !== i) })}
                      className={delBtnCls}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQS */}
          <div className={cardCls}>
            <h2 className={cardTitleCls}>6. Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div>
                <label className={labelInput}>FAQ Heading Title</label>
                <input
                  type="text"
                  value={detail.faqHeading?.title || ""}
                  onChange={(e) =>
                    setDetail({
                      faqHeading: { title: e.target.value, text: detail.faqHeading?.text || "" },
                    })
                  }
                  placeholder="Frequently Asked Questions"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>FAQ Heading Text</label>
                <input
                  type="text"
                  value={detail.faqHeading?.text || ""}
                  onChange={(e) =>
                    setDetail({
                      faqHeading: { title: detail.faqHeading?.title || "Frequently Asked Questions", text: e.target.value },
                    })
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>FAQ Style</label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(detail.faqStyle?.numbered)}
                      onChange={(e) => setDetail({ faqStyle: { ...detail.faqStyle, numbered: e.target.checked } })}
                      className="h-3.5 w-3.5"
                    />
                    Numbered
                  </label>
                  <select
                    value={detail.faqStyle?.tone || "white"}
                    onChange={(e) => setDetail({ faqStyle: { ...detail.faqStyle, tone: e.target.value as "white" | "blue" } })}
                    className="h-[28px] w-[110px] rounded-[6px] border border-slate-300 bg-white px-2 text-[10px] font-semibold outline-none cursor-pointer"
                  >
                    <option value="white">White tone</option>
                    <option value="blue">Blue tone</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider">
                  FAQ Items ({detail.faqs.length})
                </label>
                <button
                  type="button"
                  onClick={() => setDetail({ faqs: [...detail.faqs, { q: "", a: "" }] })}
                  className={addBtnCls}
                >
                  <Plus className="h-3 w-3" /> Add FAQ
                </button>
              </div>
              <div className="space-y-3">
                {detail.faqs.map((f, i) => (
                  <div key={i} className="rounded-[6px] border border-[#edf0f2] bg-[#fbfcfc] p-2">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_24px]">
                      <input
                        type="text"
                        value={f.q}
                        onChange={(e) => {
                          const next = [...detail.faqs];
                          next[i] = { ...f, q: e.target.value };
                          setDetail({ faqs: next });
                        }}
                        placeholder="Question"
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={() => setDetail({ faqs: detail.faqs.filter((_, idx) => idx !== i) })}
                        className={delBtnCls}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={f.a}
                      onChange={(e) => {
                        const next = [...detail.faqs];
                        next[i] = { ...f, a: e.target.value };
                        setDetail({ faqs: next });
                      }}
                      placeholder="Answer"
                      className={`${textareaCls} mt-2`}
                    />
                  </div>
                ))}
                {detail.faqs.length === 0 && <p className="text-[9px] text-slate-400">No FAQs yet.</p>}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className={cardCls}>
            <h2 className={cardTitleCls}>7. Bottom CTA Banner</h2>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div>
                <label className={labelInput}>Eyebrow (default: Let&apos;s Build Together)</label>
                <input
                  type="text"
                  value={detail.ctaEyebrow || ""}
                  onChange={(e) => setDetail({ ctaEyebrow: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>Subtitle (default: Get in touch with our team...)</label>
                <input
                  type="text"
                  value={detail.ctaSubtitle || ""}
                  onChange={(e) => setDetail({ ctaSubtitle: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>CTA Title Line 1</label>
                <input
                  type="text"
                  value={detail.ctaTitle[0]}
                  onChange={(e) => setDetail({ ctaTitle: [e.target.value, detail.ctaTitle[1]] })}
                  placeholder="Let's Discuss"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelInput}>
                  CTA Title Line 2 <span className="normal-case text-slate-400">(shown in gold)</span>
                </label>
                <input
                  type="text"
                  value={detail.ctaTitle[1]}
                  onChange={(e) => setDetail({ ctaTitle: [detail.ctaTitle[0], e.target.value] })}
                  placeholder="Your Workspace Project"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* BOTTOM SAVE */}
          <div className="flex items-center justify-end gap-[10px] pb-2">
            <Link
              href="/services"
              className="flex h-[32px] items-center justify-center rounded-[6px] border border-slate-300 bg-white px-[16px] text-[9px] font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex h-[32px] items-center justify-center gap-1.5 rounded-[6px] bg-[#4B1426] px-[18px] text-[9px] font-semibold text-white shadow-[0_5px_12px_rgba(75,20,38,0.25)] transition hover:bg-[#3a0f1d] disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" strokeWidth={1.8} />
              {isSaving ? "Saving..." : editId ? "Update Service & Detail Page" : "Publish Service"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default function AddEditServicePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center p-8 text-[12px] font-semibold text-slate-500">
          Loading service editor...
        </div>
      }
    >
      <AddEditServiceContent />
    </Suspense>
  );
}
