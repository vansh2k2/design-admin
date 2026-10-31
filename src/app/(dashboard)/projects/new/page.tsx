"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import typography from "../../pages/PagesTypography.module.css";
import Swal from "sweetalert2";
import {
  projectsApi,
  type ProjectItem,
  DEFAULT_PROJECT_CATEGORIES,
  DEFAULT_PROJECT_LOCATIONS,
} from "@/lib/projectsApi";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  Eye,
  Globe,
  Image as ImageIcon,
  MapPin,
  Save,
  Trash2,
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
  { label: "P1: Reception Lobby", src: "/newproject/p1.png" },
  { label: "P2: Axis Reception", src: "/newproject/p2.png" },
  { label: "P3: DLF Corporate", src: "/newproject/p3.png" },
  { label: "P4: Trends Retail", src: "/newproject/p4.png" },
  { label: "P5: The Palate", src: "/newproject/p5.png" },
  { label: "P6: Organic Expo", src: "/newproject/p6.png" },
  { label: "P7: Mall Kiosk", src: "/newproject/p7.png" },
  { label: "P8: Corporate Signage", src: "/newproject/p8.png" },
  { label: "P9: Office Fit-Out", src: "/newproject/p9.png" },
  { label: "P10: Hotel Interiors", src: "/newproject/p10.png" },
  { label: "P11: Luxury Residence", src: "/newproject/p11.png" },
  { label: "P12: City Lounge", src: "/newproject/p12.png" },
  { label: "PB: Diverse Spaces", src: "/newproject/pb.png" },
];

function AddEditProjectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Corporate Interiors",
    location: "Gurugram, Haryana",
    href: "",
    description: "",
    content: "",
    image: "/newproject/p1.png",
    imageAlt: "",
    status: "Published",
    featured: false,
    author: "Design House Team",
    views: 1200,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  const [isLoading, setIsLoading] = useState(Boolean(editId));
  const [isSaving, setIsSaving] = useState(false);
  const [isHrefDetached, setIsHrefDetached] = useState(false);

  // Load existing project if editing
  useEffect(() => {
    if (!editId) {
      setIsLoading(false);
      return;
    }

    projectsApi
      .get(editId)
      .then((project) => {
        if (project) {
          setFormData({
            title: project.title || "",
            category: project.category || "Corporate Interiors",
            location: project.location || "Delhi NCR",
            href: project.href || "",
            description: project.description || "",
            content: project.content || "",
            image: project.image || "/newproject/p1.png",
            imageAlt: project.imageAlt || "",
            status: project.status || "Published",
            featured: Boolean(project.featured),
            author: project.author || "Design House Team",
            views: project.views || 0,
            metaTitle: project.metaTitle || project.title || "",
            metaDescription: project.metaDescription || project.description || "",
            metaKeywords: project.metaKeywords || "",
          });
          setIsHrefDetached(true);
        } else {
          showError("Project not found");
        }
      })
      .catch((err) => {
        console.error("Error loading project:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [editId]);

  // Auto-generate target URL from title if not detached
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isHrefDetached) {
      const slugPart = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const catSlug = formData.category.toLowerCase().includes("retail")
        ? "retail-interior"
        : formData.category.toLowerCase().includes("restaurant")
        ? "restaurant-interior"
        : formData.category.toLowerCase().includes("kiosk")
        ? "kiosk-images"
        : formData.category.toLowerCase().includes("signage")
        ? "signage-portfolio"
        : "corporate-interior";

      setFormData((prev) => ({
        ...prev,
        title: val,
        href: `/portfolio/interior/${catSlug}`,
        metaTitle: val ? `${val} | Design House India Pvt Ltd` : "",
        imageAlt: val ? `${val} turnkey interior execution` : "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showWarning("Please provide a Project Title.");
      return;
    }

    try {
      setIsSaving(true);
      if (editId) {
        await projectsApi.update(editId, {
          title: formData.title.trim(),
          category: formData.category,
          location: formData.location,
          href: formData.href.trim() || `/portfolio/interior/corporate-interior`,
          description: formData.description.trim(),
          content: formData.content.trim(),
          image: formData.image,
          imageAlt: formData.imageAlt.trim(),
          status: formData.status as "Published" | "Draft" | "Scheduled",
          featured: formData.featured,
          author: formData.author.trim(),
          views: Number(formData.views) || 0,
          metaTitle: formData.metaTitle.trim(),
          metaDescription: formData.metaDescription.trim(),
          metaKeywords: formData.metaKeywords.trim(),
        });
        showSuccess("Project updated successfully!");
      } else {
        await projectsApi.create({
          title: formData.title.trim(),
          category: formData.category,
          location: formData.location,
          href: formData.href.trim() || `/portfolio/interior/corporate-interior`,
          description: formData.description.trim(),
          content: formData.content.trim(),
          image: formData.image,
          imageAlt: formData.imageAlt.trim(),
          status: formData.status as "Published" | "Draft" | "Scheduled",
          featured: formData.featured,
          author: formData.author.trim(),
          views: Number(formData.views) || 0,
          metaTitle: formData.metaTitle.trim(),
          metaDescription: formData.metaDescription.trim(),
          metaKeywords: formData.metaKeywords.trim(),
        });
        showSuccess("New project added successfully!");
      }

      setTimeout(() => {
        router.push("/projects");
      }, 700);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 text-[12px] font-semibold text-slate-500">
        Loading project details...
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
              href="/projects"
              className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-[19px] font-bold leading-[1.15] tracking-[-0.018em] text-[#23471d]">
                {editId ? "Edit Project" : "Add New Project"}
              </h1>
              <p className="mt-0.5 text-[9px] font-medium text-[#6c7587]">
                Configure project metadata, category, location, photo gallery &amp; live links.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[10px]">
            <Link
              href="/projects"
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
              {isSaving ? "Saving..." : editId ? "Update Project" : "Publish Project"}
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
                Project Information
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. DLF Corporate Office, Trends – Retail Store"
                    className="h-[34px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] font-medium text-slate-800 outline-none transition focus:border-[#134698]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Project Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="h-[34px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] font-medium text-slate-800 outline-none transition focus:border-[#134698] cursor-pointer"
                    >
                      {DEFAULT_PROJECT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Project Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="h-[34px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] font-medium text-slate-800 outline-none transition focus:border-[#134698] cursor-pointer"
                    >
                      {DEFAULT_PROJECT_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Website Target Link / Route
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.href}
                      onChange={(e) => {
                        setIsHrefDetached(true);
                        setFormData({ ...formData, href: e.target.value });
                      }}
                      placeholder="/portfolio/interior/corporate-interior"
                      className="h-[34px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] font-medium text-slate-800 outline-none transition focus:border-[#134698]"
                    />
                  </div>
                  <p className="mt-1 text-[7.5px] text-slate-500">
                    URL to open when clicking the project card on the live frontend.
                  </p>
                </div>

                <div>
                  <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Project Summary / Scope of Work
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the design, architectural elements, turnkey fabrication and execution scope..."
                    className="w-full rounded-[6px] border border-slate-300 bg-white p-3 text-[11px] font-medium text-slate-800 outline-none transition focus:border-[#134698]"
                  />
                </div>
              </div>
            </div>

            {/* CARD 2: PROJECT IMAGE & PRESETS */}
            <div className="rounded-[7px] border border-[#e8e5df] bg-white p-[14px] shadow-xs">
              <h2 className="mb-3 border-b border-[#e8e5df] pb-2 text-[10px] font-bold uppercase tracking-wide text-[#233D4D]">
                Project Showcase Image
              </h2>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative h-[90px] w-[140px] shrink-0 rounded-[6px] border border-slate-300 bg-slate-50 overflow-hidden shadow-xs">
                    <img
                      src={formData.image}
                      alt={formData.title || "Project Preview"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/newproject/p1.png";
                      }}
                    />
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
                        placeholder="/newproject/p3.png"
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
                    Or select from Design House Projects Library:
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
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
                    placeholder="DLF Corporate Office interior lounge and reception"
                    className="h-[32px] w-full rounded-[6px] border border-slate-300 bg-white px-3 text-[11px] text-slate-800 outline-none focus:border-[#134698]"
                  />
                </div>
              </div>
            </div>

            {/* CARD 3: DETAILED SPECIFICATIONS */}
            <div className="rounded-[7px] border border-[#e8e5df] bg-white p-[14px] shadow-xs">
              <h2 className="mb-3 border-b border-[#e8e5df] pb-2 text-[10px] font-bold uppercase tracking-wide text-[#233D4D]">
                Detailed Project Specifications
              </h2>

              <div>
                <label className="block text-[8.5px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Scope, Materials &amp; Turnkey Execution Notes
                </label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter in-depth project details, client deliverables, modular partitions, ceiling specifications, lighting fixtures, and execution timeframe..."
                  className="w-full rounded-[6px] border border-slate-300 bg-white p-3 text-[11px] font-medium text-slate-800 outline-none transition focus:border-[#134698]"
                />
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

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-[#134698] focus:ring-[#134698] cursor-pointer"
                  />
                  <label htmlFor="featuredCheckbox" className="text-[10.5px] font-semibold text-slate-800 cursor-pointer">
                    Showcase in Featured Spotlight
                  </label>
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
                  {isSaving ? "Saving Project..." : editId ? "Save Changes" : "Create Project"}
                </button>
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
                    placeholder="DLF Corporate Office | Design House India"
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
                    placeholder="Turnkey interior design and fit-out execution by Design House India Pvt Ltd..."
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
                    placeholder="corporate interiors, office fitouts, gurugram, turnkey execution"
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

export default function AddEditProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center p-8 text-[12px] font-semibold text-slate-500">
          Loading project editor...
        </div>
      }
    >
      <AddEditProjectContent />
    </Suspense>
  );
}
