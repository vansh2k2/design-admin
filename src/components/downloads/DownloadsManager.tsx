"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Grid,
  Image as ImageIcon,
  List,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

import { api } from "@/lib/api";
import { uploadApi } from "@/lib/uploadApi";
import { SITE } from "@/config/site";
import Modal from "@/components/ui/Modal";
import { Input, Label, Textarea } from "@/components/ui/Input";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import typography from "@/app/(dashboard)/pages/PagesTypography.module.css";

/* Downloads Management: the cards on the website's Downloads page (company profile, e-brochures,
   newsletters). Same layout as Testimonials Management. Data: /api/downloads/admin; files and card
   images are uploaded to Cloudinary. */

export type DownloadStatus = "Active" | "Coming Soon" | "Inactive";

export interface DownloadRecord {
  _id: string;
  title: string;
  coverTitle: string;
  desc: string;
  fileUrl: string;
  fileSize: string;
  cardImage: string;
  imageAlt: string;
  action: string;
  category: string;
  status: DownloadStatus;
  accent: boolean;
  ensis: boolean;
  order: number;
  downloadsCount?: number;
  updatedBy?: string;
  updatedAt?: string;
}

type FormState = Omit<DownloadRecord, "_id" | "downloadsCount" | "updatedBy" | "updatedAt">;

const EMPTY_FORM: FormState = {
  title: "",
  coverTitle: "",
  desc: "",
  fileUrl: "",
  fileSize: "",
  cardImage: "",
  imageAlt: "",
  action: "Download Brochure",
  category: "E-Brochure",
  status: "Active",
  accent: false,
  ensis: false,
  order: 0,
};

const BASE_CATEGORIES = ["Company Profile", "E-Brochure", "Newsletter", "Coming Soon"];
const WEBSITE_DOWNLOADS_URL = `${(process.env.NEXT_PUBLIC_SITE_URL || SITE.websiteUrl).replace(/\/$/, "")}/downloads`;

// ─── Toasts (same dark style as Testimonials) ───
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  background: "#1e2433",
  color: "#e2e8f0",
  iconColor: "#4ade80",
  didOpen: (toast) => {
    toast.style.boxShadow = "none";
  },
});
const showSuccess = (title: string) => Toast.fire({ icon: "success", title });
const showError = (title: string) => Toast.fire({ icon: "error", title, iconColor: "#f87171" });

const toneClass = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-200",
} as const;

const STATUS_STYLES: Record<DownloadStatus, string> = {
  Active: "bg-[#e8f5e9] text-[#23714a] border border-[#a5d6a7]",
  "Coming Soon": "bg-[#fff8e1] text-[#b78103] border border-[#ffe082]",
  Inactive: "bg-[#ffebee] text-[#c62828] border border-[#ef9a9a]",
};
const SELECT_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
};

const formatBytes = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

// "/downloads/ebrochures/office furniture.pdf" → "office furniture.pdf"; Cloudinary files → "Uploaded PDF"
const fileLabel = (url: string) => {
  if (!url) return "";
  if (/res\.cloudinary\.com/.test(url)) return "Uploaded PDF (Cloudinary)";
  return decodeURIComponent(url.split("/").pop() || url);
};

// Website files are relative to the site; uploaded ones are full URLs
const fileHref = (url: string) => (/^https?:\/\//.test(url) ? url : `${WEBSITE_DOWNLOADS_URL.replace(/\/downloads$/, "")}${encodeURI(url)}`);

/* Card cover like the website's: photo with the navy panel and the cover title */
function CoverPreview({ item, height = 140 }: { item: Pick<DownloadRecord, "cardImage" | "imageAlt" | "coverTitle" | "accent" | "ensis">; height?: number }) {
  return (
    <div className="relative w-full overflow-hidden rounded-[6px] bg-slate-100" style={{ height }}>
      {item.cardImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.cardImage} alt={item.imageAlt || ""} className="absolute inset-0 h-full w-full object-cover object-right" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          <ImageIcon className="h-6 w-6" />
        </div>
      )}
      {item.ensis ? (
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 via-45% to-transparent to-70% p-3">
          <p className="text-[20px] font-bold leading-none text-[#0E6B6B]">ENSIS</p>
          <p className="mt-1.5 whitespace-pre-line text-[8px] font-medium uppercase text-[#1F2D44]">{item.coverTitle}</p>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1E4A] to-[#10306E] [clip-path:polygon(0_0,64%_0,38%_100%,0_100%)]" />
          <div className="absolute inset-0 p-3">
            <p className="text-[10px] font-extrabold leading-none text-white">DESIGN HOUSE</p>
            <p className="mt-[2px] pl-[10px] text-[5px] font-bold tracking-[0.18em] text-white/85">INDIA PVT. LTD.</p>
            <p className={`mt-3 whitespace-pre-line uppercase leading-[1.15] ${item.accent ? "text-[12px] text-[#fd6e15]" : "text-[10px] text-white"}`}>
              {item.coverTitle}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function StatusSelect({ value, onChange, compact = false }: { value: DownloadStatus; onChange: (s: DownloadStatus) => void; compact?: boolean }) {
  return (
    <select
      value={value}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as DownloadStatus)}
      className={`cursor-pointer appearance-none rounded-[4px] font-bold outline-none bg-no-repeat shadow-xs transition ${STATUS_STYLES[value]} ${
        compact ? "h-[24px] px-[8px] pr-[22px] text-[8px] bg-[right_6px_center]" : "h-[38px] w-full px-[12px] pr-[28px] text-[11px] bg-[right_10px_center]"
      }`}
      style={{ backgroundImage: SELECT_ARROW }}
    >
      <option value="Active" className="bg-white text-[#23714a]">Active</option>
      <option value="Coming Soon" className="bg-white text-[#b78103]">Coming Soon</option>
      <option value="Inactive" className="bg-white text-[#c62828]">Inactive (Hidden)</option>
    </select>
  );
}

export default function DownloadsManager() {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All Status");
  const [category, setCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await api.get<DownloadRecord[]>("/downloads/admin");
      const list = Array.isArray(data) ? data : [];
      setDownloads(list);
      setSelectedId((prev) => prev ?? list[0]?._id ?? null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Could not load downloads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads once on mount
    void load();
  }, []);

  // ─── Derived data ───
  const sorted = useMemo(() => [...downloads].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [downloads]);
  const categories = useMemo(
    () => Array.from(new Set([...BASE_CATEGORIES, ...downloads.map((d) => d.category).filter(Boolean)])),
    [downloads],
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((d) => {
      if (status !== "All Status" && d.status !== status) return false;
      if (category !== "All Categories" && d.category !== category) return false;
      if (!q) return true;
      return [d.title, d.desc, d.category, d.coverTitle, d.imageAlt, d.fileUrl].some((v) => (v || "").toLowerCase().includes(q));
    });
  }, [sorted, query, status, category]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);
  const selected = downloads.find((d) => d._id === selectedId) || null;

  const count = (s: DownloadStatus) => downloads.filter((d) => d.status === s).length;
  const totalClicks = downloads.reduce((sum, d) => sum + (d.downloadsCount || 0), 0);

  const clearFilters = () => {
    setQuery("");
    setStatus("All Status");
    setCategory("All Categories");
    setCurrentPage(1);
  };
  const filterStatus = (s: string) => {
    setStatus(s);
    setCurrentPage(1);
  };

  const statCards = [
    { title: "TOTAL DOWNLOADS", value: downloads.length, icon: FileText, tone: "emerald" as const, gradient: "#bbf7d0", numColor: "#15803d", footer: "View all downloads", onClick: clearFilters },
    { title: "ACTIVE DOWNLOADS", value: count("Active"), icon: Download, tone: "violet" as const, gradient: "#ddd6fe", numColor: "#6d28d9", footer: "View active", onClick: () => filterStatus("Active") },
    { title: "COMING SOON", value: count("Coming Soon"), icon: Clock3, tone: "amber" as const, gradient: "#fed7aa", numColor: "#c2410c", footer: "View coming soon", onClick: () => filterStatus("Coming Soon") },
    { title: "TOTAL DOWNLOAD CLICKS", value: totalClicks, icon: Eye, tone: "blue" as const, gradient: "#bae6fd", numColor: "#0284c7", footer: "Counted on the website", onClick: clearFilters },
    { title: "INACTIVE DOWNLOADS", value: count("Inactive"), icon: EyeOff, tone: "rose" as const, gradient: "#fecdd3", numColor: "#be123c", footer: "View hidden", onClick: () => filterStatus("Inactive") },
    { title: "WEBSITE STATUS", value: "Live", icon: Globe, tone: "teal" as const, gradient: "#99f6e4", numColor: "#0f766e", footer: "Live on website", onClick: () => window.open(WEBSITE_DOWNLOADS_URL, "_blank") },
  ];

  // ─── Mutations ───
  const replaceInList = (updated: DownloadRecord) => setDownloads((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));

  const handleStatusChange = async (item: DownloadRecord, next: DownloadStatus) => {
    if (next === "Active" && !item.fileUrl) {
      showError("Add a PDF file before making this download Active.");
      return;
    }
    try {
      const updated = await api.put<DownloadRecord>(`/downloads/admin/${item._id}`, {
        status: next,
        // "Coming Soon" cards show a "Coming Soon" button; switching back needs a real label
        ...(next === "Coming Soon" ? { action: "Coming Soon" } : item.action === "Coming Soon" ? { action: "Download" } : {}),
      });
      replaceInList(updated);
      showSuccess(`Status updated to ${next}`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Could not update the status");
    }
  };

  const deleteItems = async (items: DownloadRecord[]) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: items.length === 1 ? `"${items[0].title}" will be deleted from the website.` : `${items.length} downloads will be deleted from the website.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });
    if (!result.isConfirmed) return;

    const deleted: string[] = [];
    for (const item of items) {
      try {
        await api.delete(`/downloads/admin/${item._id}`);
        deleted.push(item._id);
      } catch (err) {
        showError(`"${item.title}": ${err instanceof Error ? err.message : "could not delete"}`);
      }
    }
    if (deleted.length) {
      setDownloads((prev) => prev.filter((d) => !deleted.includes(d._id)));
      setSelectedIds((prev) => prev.filter((id) => !deleted.includes(id)));
      if (selectedId && deleted.includes(selectedId)) setSelectedId(null);
      showSuccess(deleted.length === 1 ? "Download deleted" : `${deleted.length} downloads deleted`);
    }
  };

  const openAdd = () => {
    const nextOrder = downloads.reduce((max, d) => Math.max(max, d.order || 0), 0) + 1;
    setEditingId(null);
    setForm({ ...EMPTY_FORM, order: nextOrder });
    setIsModalOpen(true);
  };

  const openEdit = (item: DownloadRecord) => {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      coverTitle: item.coverTitle || "",
      desc: item.desc || "",
      fileUrl: item.fileUrl || "",
      fileSize: item.fileSize || "",
      cardImage: item.cardImage || "",
      imageAlt: item.imageAlt || "",
      action: item.action || "",
      category: item.category || "E-Brochure",
      status: item.status || "Active",
      accent: Boolean(item.accent),
      ensis: Boolean(item.ensis),
      order: item.order ?? 0,
    });
    setIsModalOpen(true);
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileUpload = async (file?: File) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      showError("Please choose a PDF file.");
      return;
    }
    setUploadingFile(true);
    try {
      const res = await uploadApi.file(file, "design-house/downloads/files");
      setForm((prev) => ({ ...prev, fileUrl: res.url, fileSize: formatBytes(file.size) }));
      showSuccess("PDF uploaded to Cloudinary");
    } catch (err) {
      showError(err instanceof Error ? err.message : "PDF upload failed");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleImageUpload = async (file?: File) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadApi.file(file, "design-house/downloads/covers");
      setForm((prev) => ({ ...prev, cardImage: res.url, imageAlt: prev.imageAlt || prev.title }));
      showSuccess("Card image uploaded to Cloudinary");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return showError("Title is required.");
    if (form.status === "Active" && !form.fileUrl.trim()) return showError("Active downloads need a PDF file (or set the status to Coming Soon).");
    if (form.cardImage && !form.imageAlt.trim()) return showError("Add alt text for the card image.");

    const payload = {
      ...form,
      title: form.title.trim(),
      coverTitle: form.coverTitle.trim() || form.title.trim(),
      action: form.status === "Coming Soon" ? "Coming Soon" : form.action.trim() || "Download",
    };

    setSaving(true);
    try {
      if (editingId) {
        const updated = await api.put<DownloadRecord>(`/downloads/admin/${editingId}`, payload);
        replaceInList(updated);
        showSuccess(`"${updated.title}" updated`);
      } else {
        const created = await api.post<DownloadRecord>("/downloads/admin", payload);
        setDownloads((prev) => [...prev, created]);
        setSelectedId(created._id);
        showSuccess(`"${created.title}" added`);
      }
      setIsModalOpen(false);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Could not save the download");
    } finally {
      setSaving(false);
    }
  };

  const allOnPageSelected = paginatedRows.length > 0 && paginatedRows.every((r) => selectedIds.includes(r._id));
  const toggleSelectAll = () =>
    setSelectedIds((prev) => (allOnPageSelected ? prev.filter((id) => !paginatedRows.some((r) => r._id === id)) : Array.from(new Set([...prev, ...paginatedRows.map((r) => r._id)]))));
  const toggleRow = (id: string) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const selectClass = "h-[40px] rounded-[6px] border border-[#dfe4e8] bg-white px-[10px] text-[10px] font-semibold text-[#2a3855] outline-none cursor-pointer";
  const iconBtn = (tone: "orange" | "blue" | "red") =>
    `flex h-[25px] w-[25px] items-center justify-center rounded-[6px] border backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${
      tone === "orange"
        ? "bg-orange-500/10 border-orange-400/30 hover:bg-orange-500/20"
        : tone === "blue"
          ? "bg-blue-500/10 border-blue-400/30 hover:bg-blue-500/20"
          : "bg-red-500/10 border-red-400/30 hover:bg-red-500/20"
    }`;

  return (
    <main
      className={`${typography.pages} h-full min-h-0 w-full overflow-y-auto overflow-x-hidden bg-[#fffefb] px-[18px] py-[14px] text-[#142347] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300`}
    >
      <div className="min-h-full w-full">
        {/* TOP HEADING */}
        <div className="mb-[18px] flex shrink-0 items-center justify-between border-b-[2px] border-[#293681] pb-[8px]">
          <div>
            <h1 className="text-[19px] font-bold leading-[1.15] tracking-[-0.018em]" style={{ color: "#23471d" }}>
              Downloads Management
            </h1>
            <p className="mt-0.5 text-[9px] font-medium text-[#6c7587]">
              Manage company profiles, e-brochures and newsletters shown on the website&apos;s Downloads page.
            </p>
          </div>

          <div className="flex items-center gap-[10px]">
            {loading && (
              <span className="flex items-center gap-1.5 rounded-[4px] border border-[#bae6fd] bg-[#e0f2fe] px-2.5 py-1 text-[9px] font-semibold text-[#006199] animate-pulse">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Loading...
              </span>
            )}
            <a
              href={WEBSITE_DOWNLOADS_URL}
              target="_blank"
              rel="noreferrer"
              className="flex h-[30px] items-center justify-center gap-[5px] rounded-[6px] border border-[#fed7aa] bg-[#fff7ed] px-[14px] text-[8.5px] font-semibold text-[#ea580c] shadow-sm transition hover:bg-[#ffedd5] active:scale-95"
            >
              <ExternalLink className="h-[12px] w-[12px]" strokeWidth={1.7} />
              View on Website
            </a>
            {/* Hero banner + SEO of the Downloads page live in Pages & CMS */}
            <Link
              href="/pages/downloads/edit"
              className="flex h-[30px] items-center justify-center gap-[5px] rounded-[6px] px-[14px] text-[8.5px] font-semibold shadow-sm transition hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#006199", color: "#ffffff" }}
            >
              <Settings className="h-[12px] w-[12px]" strokeWidth={1.7} />
              Page Settings
            </Link>
            <button
              type="button"
              onClick={openAdd}
              className="flex h-[30px] items-center justify-center gap-[5px] rounded-[6px] bg-[#4B1426] px-[14px] text-[8.5px] font-semibold text-white shadow-[0_5px_12px_rgba(75,20,38,0.25)] transition hover:bg-[#3a0f1d] active:scale-95 cursor-pointer"
            >
              <Plus className="h-[12px] w-[12px]" strokeWidth={1.7} />
              Add New Download
            </button>
          </div>
        </div>

        {loadError && (
          <div className="mb-3 flex items-center justify-between rounded-[6px] border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-semibold text-rose-700">
            <span>Could not load downloads: {loadError}</span>
            <button type="button" onClick={() => void load()} className="inline-flex items-center gap-1 font-bold underline cursor-pointer">
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </div>
        )}

        {/* METRIC STATS CARDS */}
        <div className="mt-[12px] grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="relative flex h-[98px] flex-col overflow-hidden rounded-[11px] border bg-white p-2 !pb-5.5 transition-all hover:translate-y-[-1px]"
                style={{
                  background: `linear-gradient(135deg, #ffffff 0%, #ffffff 42%, ${item.gradient} 100%)`,
                  borderColor: item.gradient,
                  boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                }}
              >
                <div className="flex items-start gap-1.5">
                  <div className={`grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-white/80 shadow-xs ring-1 ${toneClass[item.tone]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[8.5px] !font-semibold tracking-[0.01em]" style={{ fontWeight: 600, color: "#0f172a" }}>
                      {item.title}
                    </p>
                    <div className="mt-1.5 flex items-end gap-1">
                      <span className="text-[21px] !font-semibold leading-none tracking-[-0.04em]" style={{ color: item.numColor, fontWeight: 600 }}>
                        <AnimatedCounter value={item.value} />
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  onClick={item.onClick}
                  className="absolute bottom-1 left-2 right-2 flex cursor-pointer items-center justify-center gap-1 text-[8px] font-semibold text-[#293957] transition hover:text-blue-600"
                >
                  {item.footer}
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* MAIN SPLIT CONTENT */}
        <section className="mt-[14px] grid items-start gap-[14px] xl:grid-cols-[minmax(0,1fr)_310px]">
          {/* LEFT: FILTERS + TABLE / GRID */}
          <div className="min-w-0 overflow-hidden">
            <div className="flex flex-wrap items-center gap-[10px]">
              <label className="relative min-w-[200px] flex-1">
                <Search className="absolute right-[13px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#5d6b84]" />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search downloads by title, category, file or description..."
                  className="h-[40px] w-full rounded-[6px] border border-[#dfe4e8] bg-white px-[14px] pr-[40px] text-[10.5px] font-semibold text-[#273655] outline-none placeholder:text-[#8b95a7]"
                />
              </label>

              <select value={status} onChange={(e) => filterStatus(e.target.value)} className={`${selectClass} min-w-[110px]`}>
                <option value="All Status">All Status</option>
                <option value="Active">Active</option>
                <option value="Coming Soon">Coming Soon</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className={`${selectClass} min-w-[130px]`}
              >
                <option value="All Categories">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-[4px] rounded-[6px] border border-[#dfe4e8] bg-white p-[3px]">
                {(["table", "grid"] as const).map((mode) => {
                  const Icon = mode === "table" ? List : Grid;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      title={mode === "table" ? "Table View" : "Grid View"}
                      className={`flex h-[32px] w-[32px] items-center justify-center rounded-[4px] transition cursor-pointer ${
                        viewMode === mode ? "bg-[#233D4D] text-white shadow-xs" : "text-[#59657a] hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-[15px] w-[15px]" />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-[40px] shrink-0 items-center justify-center gap-[6px] rounded-[6px] border border-[#dfe4e8] bg-white px-[12px] text-[10px] font-semibold text-[#35445f] hover:bg-slate-50 cursor-pointer"
              >
                <RefreshCw className="h-[13px] w-[13px]" />
                Clear
              </button>

              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => void deleteItems(downloads.filter((d) => selectedIds.includes(d._id)))}
                  className="inline-flex h-[40px] shrink-0 items-center justify-center gap-[6px] rounded-[6px] border border-rose-200 bg-rose-50 px-[12px] text-[10px] font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                >
                  <Trash2 className="h-[13px] w-[13px]" />
                  Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>

            {viewMode === "table" ? (
              <div className="mt-[12px] flex min-h-0 flex-1 flex-col overflow-hidden rounded-[7px] border border-[#e8e5df] bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] border-collapse text-left">
                    <thead>
                      <tr className="h-[32px] border-b border-[#e8e5df] bg-[#233D4D]">
                        <th className="w-[42px] rounded-tl-[6px] px-[12px] py-[6px] text-center">
                          <input type="checkbox" className="accent-[#233D4D] cursor-pointer" checked={allOnPageSelected} onChange={toggleSelectAll} />
                        </th>
                        {["Order", "Download Item & Card", "Category", "File", "Downloads", "Updated By", "Status"].map((h) => (
                          <th key={h} className="whitespace-nowrap px-[12px] py-[6px] text-[8.5px] font-bold uppercase tracking-wider text-white">
                            {h}
                          </th>
                        ))}
                        <th className="rounded-tr-[6px] px-[12px] py-[6px] text-right text-[8.5px] font-bold uppercase tracking-wider text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0ec]">
                      {paginatedRows.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-xs font-medium text-slate-500">
                            {loading ? "Loading downloads..." : "No downloads match your filter criteria."}
                          </td>
                        </tr>
                      ) : (
                        paginatedRows.map((item) => (
                          <tr
                            key={item._id}
                            onClick={() => setSelectedId(item._id)}
                            className={`cursor-pointer transition hover:bg-slate-50/80 ${selectedId === item._id ? "bg-[#f4faf6]" : ""}`}
                          >
                            <td className="px-[12px] py-[8px] text-center">
                              <input
                                type="checkbox"
                                className="accent-[#233D4D] cursor-pointer"
                                checked={selectedIds.includes(item._id)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => toggleRow(item._id)}
                              />
                            </td>
                            <td className="whitespace-nowrap px-[12px] py-[8px]">
                              <span className="text-[8px] font-semibold text-[#293681]">#{item.order}</span>
                            </td>
                            <td className="px-[12px] py-[8px]">
                              <div className="flex min-w-[230px] items-center gap-[10px]">
                                <div className="h-[34px] w-[46px] shrink-0 overflow-hidden rounded-[4px] border border-[#e4e7eb] bg-slate-100">
                                  {item.cardImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.cardImage} alt={item.imageAlt || ""} className="h-full w-full object-cover" />
                                  ) : (
                                    <ImageIcon className="m-auto mt-2 h-4 w-4 text-slate-400" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="flex items-center gap-1.5 truncate text-[10.5px] font-bold text-[#19274a]">
                                    {item.title}
                                    {item.accent && <span className="rounded-[3px] bg-orange-100 px-1 text-[7px] font-bold text-orange-700">Accent</span>}
                                    {item.ensis && <span className="rounded-[3px] bg-teal-100 px-1 text-[7px] font-bold text-teal-700">ENSIS</span>}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-[12px] py-[8px] text-[9px] font-bold text-[#0f766e]">{item.category}</td>
                            <td className="px-[12px] py-[8px]">
                              {item.fileUrl ? (
                                <div className="flex flex-col leading-tight">
                                  <span className="max-w-[150px] truncate text-[8.5px] font-semibold text-[#4B1426]">{fileLabel(item.fileUrl)}</span>
                                  <span className="mt-0.5 text-[8px] font-bold text-[#64748b]">{item.fileSize || "—"}</span>
                                </div>
                              ) : (
                                <span className="text-[8.5px] font-semibold text-[#b78103]">No file yet</span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-[12px] py-[8px] text-[9px] font-bold text-[#0284c7]">
                              {(item.downloadsCount || 0).toLocaleString("en-IN")}
                            </td>
                            <td className="whitespace-nowrap px-[12px] py-[8px]">
                              <div className="flex flex-col items-start leading-tight">
                                <span className="text-[9px] font-bold text-[#dc2626]">{item.updatedBy || "Admin User"}</span>
                                <span className="mt-0.5 text-[8px] font-medium text-[#64748b]">{formatDateTime(item.updatedAt)}</span>
                              </div>
                            </td>
                            <td className="px-[12px] py-[8px]">
                              <StatusSelect compact value={item.status} onChange={(s) => void handleStatusChange(item, s)} />
                            </td>
                            <td className="px-[12px] py-[8px] text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button type="button" title="View Details" onClick={(e) => { e.stopPropagation(); setSelectedId(item._id); }} className={iconBtn("orange")}>
                                  <Eye className="h-[12px] w-[12px] text-orange-600" />
                                </button>
                                <button type="button" title="Edit Download" onClick={(e) => { e.stopPropagation(); openEdit(item); }} className={iconBtn("blue")}>
                                  <Pencil className="h-[12px] w-[12px] text-blue-600" />
                                </button>
                                <button type="button" title="Delete Download" onClick={(e) => { e.stopPropagation(); void deleteItems([item]); }} className={iconBtn("red")}>
                                  <Trash2 className="h-[12px] w-[12px] text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer & pagination */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e8e5df] bg-[#fafafa] px-[12px] py-[6px] text-[8px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#2563eb]">
                      Total Downloads: <strong className="font-bold text-[#1d4ed8]">{filteredRows.length}</strong>
                    </span>
                    <span className="text-[7.5px] text-[#8a92a0]">
                      (Showing {filteredRows.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredRows.length)} of {filteredRows.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-[4px]">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setCurrentPage(page - 1)}
                      className="flex h-[22px] w-[22px] items-center justify-center rounded-[4px] border border-[#d8dce2] bg-white text-[#334155] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setCurrentPage(n)}
                        className={`flex h-[22px] min-w-[22px] items-center justify-center rounded-[4px] border px-1.5 text-[8px] font-bold transition cursor-pointer ${
                          page === n ? "border-[#233D4D] bg-[#233D4D] text-white shadow-xs" : "border-[#d8dce2] bg-white text-[#334155] hover:bg-slate-50"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => setCurrentPage(page + 1)}
                      className="flex h-[22px] w-[22px] items-center justify-center rounded-[4px] border border-[#d8dce2] bg-white text-[#334155] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </button>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="ml-2 h-[22px] rounded-[4px] border border-[#d8dce2] bg-white px-[6px] text-[8px] font-semibold text-[#334155] outline-none cursor-pointer"
                    >
                      <option value={10}>10 / page</option>
                      <option value={20}>20 / page</option>
                      <option value={50}>50 / page</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-[12px] grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {paginatedRows.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => setSelectedId(item._id)}
                    className={`group relative flex cursor-pointer flex-col rounded-[12px] border bg-white p-3 shadow-sm transition-all ${
                      selectedId === item._id ? "border-[#1b5e20] shadow-md ring-2 ring-[#1b5e20]/25" : "border-[#e4e7eb] hover:border-slate-300"
                    }`}
                  >
                    <CoverPreview item={item} height={110} />
                    <div className="mt-2.5 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-bold text-[#19274a]">{item.title}</p>
                        <p className="text-[8.5px] font-semibold text-[#0f766e]">{item.category}</p>
                      </div>
                      <span className={`shrink-0 rounded-[3px] px-1.5 py-0.5 text-[7.5px] font-bold ${STATUS_STYLES[item.status]}`}>{item.status}</span>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[8.5px] font-medium leading-relaxed text-[#475569]">{item.desc}</p>
                    <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[8px]">
                      <span className="font-bold text-[#64748b]">{item.fileSize || "No file"}</span>
                      <span className="font-bold text-[#0284c7]">{(item.downloadsCount || 0).toLocaleString("en-IN")} downloads</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: DOWNLOAD DETAILS */}
          <aside className="space-y-[12px]">
            <section
              className="bg-white px-[14px] py-[13px]"
              style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset" }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[12px] font-bold text-[#19274a]">Download Details</h2>
                <ChevronDown className="h-[14px] w-[14px] rotate-180 text-[#59657a]" />
              </div>

              {selected ? (
                <div className="mt-[12px]">
                  <CoverPreview item={selected} />
                  <p className="mt-2.5 text-[12px] font-bold text-[#19274a]">{selected.title}</p>
                  <p className="mt-0.5 text-[8.5px] font-medium leading-[1.45] text-[#475569]">{selected.desc}</p>

                  <div className="mt-[10px] flex items-center justify-between gap-[8px]">
                    <span className="text-[8.5px] font-semibold text-[#475569]">Website Card</span>
                    <span className={`shrink-0 rounded-[4px] px-[8px] py-[2px] text-[8.5px] font-bold ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>
                  </div>

                  <div className="mt-[12px] space-y-[7px] text-[9px]">
                    {[
                      ["Category:", selected.category],
                      ["File size:", selected.fileSize || "—"],
                      ["Downloads:", (selected.downloadsCount || 0).toLocaleString("en-IN")],
                      ["Display order:", `#${selected.order}`],
                      ["Button label:", selected.action],
                      ["Image alt:", selected.imageAlt || "Missing"],
                      ["Updated on:", formatDateTime(selected.updatedAt)],
                      ["Updated by:", selected.updatedBy || "Admin User"],
                    ].map(([k, v]) => (
                      <p key={k} className="flex items-start justify-between gap-3">
                        <span className="shrink-0 font-semibold text-[#69758c]">{k}</span>
                        <span className={`text-right font-bold ${k === "Image alt:" && !selected.imageAlt ? "text-rose-600" : "text-[#1f2d44]"}`}>{v}</span>
                      </p>
                    ))}
                  </div>

                  {selected.fileUrl && (
                    <a
                      href={fileHref(selected.fileUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-[10px] flex items-center justify-center gap-1.5 rounded-[4px] border border-[#bae6fd] bg-[#f0f9ff] py-1.5 text-[8.5px] font-bold text-[#0369a1] hover:bg-[#e0f2fe]"
                    >
                      <FileText className="h-3 w-3" />
                      Open File
                    </a>
                  )}

                  <div className="mt-[14px] flex items-center gap-2 border-t border-[#f0f2f5] pt-3">
                    <button
                      type="button"
                      onClick={() => openEdit(selected)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[4px] border border-[#d8dce2] bg-white py-1.5 text-[8.5px] font-bold text-[#334155] shadow-xs transition hover:bg-slate-50 cursor-pointer"
                    >
                      <Pencil className="h-3 w-3 text-blue-600" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleStatusChange(selected, selected.status === "Inactive" ? (selected.fileUrl ? "Active" : "Coming Soon") : "Inactive")}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[4px] border border-[#d8dce2] bg-white py-1.5 text-[8.5px] font-bold text-[#334155] shadow-xs transition hover:bg-slate-50 cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3 text-emerald-600" />
                      {selected.status === "Inactive" ? "Show" : "Hide"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteItems([selected])}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-[4px] border border-rose-200 bg-rose-50 py-1.5 text-[8.5px] font-bold text-rose-700 shadow-xs transition hover:bg-rose-100 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3 text-rose-600" />
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-[12px] flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <p className="text-[11px] font-bold text-[#19274a]">No Download Selected</p>
                  <p className="mt-1 max-w-[210px] text-[8.5px] leading-relaxed text-[#69758c]">
                    Select a download from the table to view its card, file and status.
                  </p>
                </div>
              )}
            </section>
          </aside>
        </section>

        {/* ADD / EDIT MODAL */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? "Edit Download" : "Add New Download"}
          size="lg"
          footer={
            <>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex h-[32px] items-center gap-1.5 px-[14px] text-[12px] font-semibold text-red-600 transition-all hover:bg-red-100 active:scale-95 cursor-pointer"
                style={{ background: "#fff1f2", borderRadius: "4px", boxShadow: "rgba(220,38,38,0.15) 0px 0px 0px 1px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving || uploadingFile || uploadingImage}
                className="inline-flex h-[32px] items-center gap-1.5 px-[14px] text-[12px] font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer"
                style={{ background: "#16a34a", borderRadius: "4px", boxShadow: "rgba(22,163,74,0.2) 0px 0px 0px 1px" }}
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Download"}
              </button>
            </>
          }
        >
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Title" required value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g. Modular Kitchen" />
              <div>
                <Label required>Status</Label>
                <StatusSelect value={form.status} onChange={(s) => setField("status", s)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className="h-[38px] w-full rounded-[4px] border border-[#cbd5e1] bg-white px-[10px] text-[12px] font-semibold text-[#1e293b] outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Button Label"
                value={form.status === "Coming Soon" ? "Coming Soon" : form.action}
                disabled={form.status === "Coming Soon"}
                onChange={(e) => setField("action", e.target.value)}
                placeholder="Download Brochure"
              />
              <Input label="Display Order" type="number" min={0} value={String(form.order)} onChange={(e) => setField("order", Number(e.target.value) || 0)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Textarea
                label="Cover Title"
                rows={3}
                value={form.coverTitle}
                onChange={(e) => setField("coverTitle", e.target.value)}
                placeholder={"Modular\nKitchen"}
                hint="Printed on the card cover. Press Enter for a new line."
              />
              <Textarea
                label="Description"
                rows={3}
                value={form.desc}
                onChange={(e) => setField("desc", e.target.value)}
                placeholder="Functional and elegant modular kitchen designs."
              />
            </div>

            {/* PDF FILE */}
            <div className="rounded-[6px] border border-[#e2e8f0] bg-[#f8fafc] p-3">
              <div className="mb-2 flex items-center justify-between">
                <Label required={form.status === "Active"}>PDF File</Label>
                {form.fileSize && <span className="text-[10px] font-bold text-slate-500">{form.fileSize}</span>}
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={form.fileUrl}
                  onChange={(e) => setField("fileUrl", e.target.value)}
                  placeholder="Upload a PDF, or a path such as /downloads/ebrochures/file.pdf"
                  className="h-[36px] min-w-0 flex-1 rounded-[4px] border border-[#cbd5e1] bg-white px-[10px] text-[11px] text-[#1e293b] outline-none"
                />
                <label className="inline-flex h-[36px] shrink-0 cursor-pointer items-center gap-1.5 rounded-[4px] bg-[#006199] px-3 text-[11px] font-semibold text-white hover:bg-[#005180]">
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingFile ? "Uploading..." : "Upload PDF"}
                  <input type="file" accept="application/pdf,.pdf" className="hidden" disabled={uploadingFile} onChange={(e) => { void handleFileUpload(e.target.files?.[0]); e.target.value = ""; }} />
                </label>
                {form.fileUrl && (
                  <button type="button" title="Remove file" onClick={() => setForm((prev) => ({ ...prev, fileUrl: "", fileSize: "" }))} className="flex h-[36px] w-[36px] items-center justify-center rounded-[4px] border border-rose-200 bg-rose-50 text-rose-600 cursor-pointer">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Input label="File Size" value={form.fileSize} onChange={(e) => setField("fileSize", e.target.value)} placeholder="e.g. 3.2 MB (filled in on upload)" />
                <p className="self-end pb-2 text-[10px] text-slate-500">Uploaded PDFs are stored on Cloudinary.</p>
              </div>
            </div>

            {/* CARD IMAGE */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[6px] border border-[#e2e8f0] bg-[#f8fafc] p-3">
                <Label>Card Preview</Label>
                <CoverPreview item={form} height={120} />
              </div>
              <div className="flex flex-col gap-2.5 rounded-[6px] border border-[#e2e8f0] bg-[#f8fafc] p-3">
                <div>
                  <Label>Card Image</Label>
                  <label className="inline-flex h-[34px] cursor-pointer items-center gap-1.5 rounded-[4px] border border-[#cbd5e1] bg-white px-3 text-[11px] font-semibold text-[#334155] hover:bg-slate-50">
                    <Upload className="h-3.5 w-3.5" />
                    {uploadingImage ? "Uploading..." : form.cardImage ? "Replace Image" : "Upload Image"}
                    <input type="file" accept="image/*" className="hidden" disabled={uploadingImage} onChange={(e) => { void handleImageUpload(e.target.files?.[0]); e.target.value = ""; }} />
                  </label>
                </div>
                <Input
                  label="Image Alt Text"
                  required={Boolean(form.cardImage)}
                  value={form.imageAlt}
                  onChange={(e) => setField("imageAlt", e.target.value)}
                  placeholder="e.g. Modular Kitchen Brochure"
                />
                <label className="flex cursor-pointer items-center gap-2 text-[11px] font-semibold text-[#334155]">
                  <input type="checkbox" checked={form.accent} onChange={(e) => setField("accent", e.target.checked)} className="accent-[#ea580c]" />
                  Orange cover title (main company profile)
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-[11px] font-semibold text-[#334155]">
                  <input type="checkbox" checked={form.ensis} onChange={(e) => setField("ensis", e.target.checked)} className="accent-[#0E6B6B]" />
                  ENSIS cover style
                </label>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
}
