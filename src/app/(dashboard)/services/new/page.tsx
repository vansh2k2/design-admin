"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import typography from "../../pages/PagesTypography.module.css";
import Swal from "sweetalert2";
import {
  servicesApi,
  type ServiceItem,
  DEFAULT_SERVICE_LINKS,
} from "@/lib/servicesApi";
import {
  ArrowLeft,
  Eye,
  Link2,
  Save,
  Upload,
} from "lucide-react";

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
  });

  const [isLoading, setIsLoading] = useState(Boolean(editId));
  const [isSaving, setIsSaving] = useState(false);
  const [isHrefDetached, setIsHrefDetached] = useState(false);

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
        metaTitle: plainTitle ? `${plainTitle.replace(/\n/g, " ")} | Design House India` : "",
        imageAlt: plainTitle ? plainTitle : "",
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
                Configure service card title, description, photo, logo overlay &amp; detail page link.
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
            <div className="rounded-[7px] border border-[#e8e5df] bg-white p-[14px] shadow-xs">
              <h2 className="mb-3 border-b border-[#e8e5df] pb-2 text-[10px] font-bold uppercase tracking-wide text-[#233D4D]">
                Service Information
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Service Title <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder={"Corporate Interiors\n(use line breaks like the website)"}
                    className="w-full rounded-[6px] border border-slate-300 bg-white px-3 py-2 text-[11px] font-medium text-slate-800 outline-none transition focus:border-[#134698] whitespace-pre-line"
                  />
                  <p className="mt-1 text-[7.5px] text-slate-500">
                    Line breaks are allowed — same format as the website cards (e.g. &quot;Retail Showroom{"\n"}Interiors&quot;).
                  </p>
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Service Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    placeholder={"Workspaces designed for\nproductivity, brand identity\nand growth."}
                    className="w-full rounded-[6px] border border-slate-300 bg-white p-3 text-[11px] font-medium text-slate-800 outline-none transition focus:border-[#134698] whitespace-pre-line"
                  />
                  <p className="mt-1 text-[7.5px] text-slate-500">
                    Keep line breaks to match the website card layout.
                  </p>
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Detail Page Link / Route
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.href}
                      onChange={(e) => {
                        setIsHrefDetached(true);
                        setFormData({ ...formData, href: e.target.value });
                      }}
                      placeholder="/services/corporate-interiors"
                      className="h-[34px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] font-medium text-slate-800 outline-none transition focus:border-[#134698]"
                    />
                  </div>
                  <p className="mt-1 text-[7.5px] text-slate-500">
                    URL opened when clicking the service card on the live website.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2: SERVICE IMAGE & PRESETS */}
            <div className="rounded-[7px] border border-[#e8e5df] bg-white p-[14px] shadow-xs">
              <h2 className="mb-3 border-b border-[#e8e5df] pb-2 text-[10px] font-bold uppercase tracking-wide text-[#233D4D]">
                Service Card Image
              </h2>

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
                        className="h-[32px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] text-slate-800 outline-none focus:border-[#134698]"
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

                {/* Quick Presets */}
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
                  <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.imageAlt}
                    onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                    placeholder="Corporate Interiors workspace"
                    className="h-[32px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] text-slate-800 outline-none focus:border-[#134698]"
                  />
                </div>
              </div>
            </div>

            {/* CARD 3: LOGO OVERLAY */}
            <div className="rounded-[7px] border border-[#e8e5df] bg-white p-[14px] shadow-xs">
              <h2 className="mb-3 border-b border-[#e8e5df] pb-2 text-[10px] font-bold uppercase tracking-wide text-[#233D4D]">
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
                      className="h-[32px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] text-slate-800 outline-none focus:border-[#134698]"
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
            <div className="rounded-[7px] border border-[#e8e5df] bg-white p-[14px] shadow-xs">
              <h2 className="mb-3 border-b border-[#e8e5df] pb-2 text-[10px] font-bold uppercase tracking-wide text-[#233D4D]">
                Publishing Status
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="h-[32px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] font-semibold text-slate-800 outline-none cursor-pointer focus:border-[#134698]"
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
                    className="h-[32px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] text-slate-800 outline-none focus:border-[#134698]"
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
                    className="h-[32px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] text-slate-800 outline-none focus:border-[#134698]"
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
            <div className="rounded-[7px] border border-[#e8e5df] bg-white p-[14px] shadow-xs">
              <h2 className="mb-3 border-b border-[#e8e5df] pb-2 text-[10px] font-bold uppercase tracking-wide text-[#233D4D]">
                Website Reference Links
              </h2>

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
            <div className="rounded-[7px] border border-[#e8e5df] bg-white p-[14px] shadow-xs">
              <h2 className="mb-3 border-b border-[#e8e5df] pb-2 text-[10px] font-bold uppercase tracking-wide text-[#233D4D]">
                SEO Meta Tags
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[8px] font-bold text-slate-600 uppercase mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="Corporate Interiors | Design House India"
                    className="h-[32px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] text-slate-800 outline-none focus:border-[#134698]"
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
                    className="w-full rounded-[6px] border border-slate-300 bg-white p-2.5 text-[11px] text-slate-800 outline-none focus:border-[#134698]"
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
                    className="h-[32px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] text-slate-800 outline-none focus:border-[#134698]"
                  />
                </div>
              </div>
            </div>
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
