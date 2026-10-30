"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Download,
  Upload,
  Plus,
  Trash2,
  Pencil,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Eye,
  AlertCircle,
  FileCheck,
  RefreshCw,
  X,
  Filter,
  Image as ImageIcon,
  Tag,
  ArrowDownToLine,
  SlidersHorizontal,
  MoreVertical,
  HeartHandshake,
} from "lucide-react";
import Swal from "sweetalert2";
import { api, getBackendUrl } from "@/lib/api";
import { uploadApi } from "@/lib/uploadApi";

export interface DownloadItemRecord {
  _id?: string;
  id?: string;
  title: string;
  coverTitle: string;
  desc: string;
  fileUrl: string;
  fileSize: string;
  cardImage: string;
  imageAlt: string;
  action: string;
  category: string;
  status: "Active" | "Coming Soon" | "Inactive";
  accent: boolean;
  ensis: boolean;
  order: number;
  downloadsCount?: number;
}

const INITIAL_DOWNLOADS: DownloadItemRecord[] = [
  {
    id: "1",
    title: "Company Profile",
    coverTitle: "Company\nProfile",
    desc: "Complete overview of our company, capabilities and business verticals.",
    fileUrl: "/downloads/dhipl-profile.pdf",
    fileSize: "13.4 MB",
    cardImage: "/assets/image/vision.webp",
    imageAlt: "Design House India Company Profile",
    action: "Download Profile",
    accent: true,
    ensis: false,
    category: "Company Profile",
    status: "Active",
    order: 1,
    downloadsCount: 1420,
  },
  {
    id: "2",
    title: "Office Furniture",
    coverTitle: "Office\nFurniture",
    desc: "Workstations, cabins and seating solutions for modern offices.",
    fileUrl: "/downloads/ebrochures/office furniture.pdf",
    fileSize: "15.9 MB",
    cardImage: "/assets/7.jpg",
    imageAlt: "Office Furniture Brochure",
    action: "Download Brochure",
    accent: false,
    ensis: false,
    category: "E-Brochure",
    status: "Active",
    order: 2,
    downloadsCount: 840,
  },
  {
    id: "3",
    title: "Modular Furniture",
    coverTitle: "Modular\nFurniture",
    desc: "Modular furniture designed for everyday function and style.",
    fileUrl: "/downloads/ebrochures/Modular Furniture.pdf",
    fileSize: "1.4 MB",
    cardImage: "/assets/hero-interior-1.jpg",
    imageAlt: "Modular Furniture Brochure",
    action: "Download Brochure",
    accent: false,
    ensis: false,
    category: "E-Brochure",
    status: "Active",
    order: 3,
    downloadsCount: 512,
  },
  {
    id: "4",
    title: "Modular Kitchen",
    coverTitle: "Modular\nKitchen",
    desc: "Functional and elegant modular kitchen designs.",
    fileUrl: "/downloads/ebrochures/Modular Kitchen.pdf",
    fileSize: "1.2 MB",
    cardImage: "/assets/cara1.jpg",
    imageAlt: "Modular Kitchen Brochure",
    action: "Download Brochure",
    accent: false,
    ensis: false,
    category: "E-Brochure",
    status: "Active",
    order: 4,
    downloadsCount: 395,
  },
  {
    id: "5",
    title: "ENSIS Brochure",
    coverTitle: "Spa & Panchkarma\nFurniture",
    desc: "Premium spa and Panchkarma furniture solutions.",
    fileUrl: "/downloads/ebrochures/e-broucher.pdf",
    fileSize: "3.2 MB",
    cardImage: "/assets/about1.webp",
    imageAlt: "ENSIS Spa and Panchkarma Furniture Brochure",
    action: "Download Brochure",
    accent: false,
    ensis: true,
    category: "E-Brochure",
    status: "Active",
    order: 5,
    downloadsCount: 478,
  },
  {
    id: "6",
    title: "Corporate Interior Newsletter",
    coverTitle: "Corporate\nInteriors",
    desc: "Highlights from our corporate interior projects.",
    fileUrl: "/downloads/newsletter/corprate_nov.pdf",
    fileSize: "303 KB",
    cardImage: "/assets/hero-corporate-1.jpg",
    imageAlt: "Corporate Interior Newsletter",
    action: "Download Newsletter",
    accent: false,
    ensis: false,
    category: "Newsletter",
    status: "Active",
    order: 6,
    downloadsCount: 284,
  },
  {
    id: "7",
    title: "Residential Interior Newsletter",
    coverTitle: "Residential\nInteriors",
    desc: "Highlights from our residential interior projects.",
    fileUrl: "/downloads/newsletter/residential_nov.pdf",
    fileSize: "1.8 MB",
    cardImage: "/assets/about2.webp",
    imageAlt: "Residential Interior Newsletter",
    action: "Download Newsletter",
    accent: false,
    ensis: false,
    category: "Newsletter",
    status: "Active",
    order: 7,
    downloadsCount: 215,
  },
  {
    id: "8",
    title: "Retail Showroom Interiors",
    coverTitle: "Retail\nShowroom\nInteriors",
    desc: "Design and build solutions for retail stores and showrooms.",
    fileUrl: "",
    fileSize: "",
    cardImage: "/assets/image/b1.webp",
    imageAlt: "Retail Showroom Interiors",
    action: "Coming Soon",
    accent: false,
    ensis: false,
    category: "Coming Soon",
    status: "Coming Soon",
    order: 8,
    downloadsCount: 68,
  },
  {
    id: "9",
    title: "Restaurant & Hospitality",
    coverTitle: "Restaurant &\nHospitality\nInteriors",
    desc: "Creating memorable dining and hospitality experiences.",
    fileUrl: "",
    fileSize: "",
    cardImage: "/assets/image/b3.webp",
    imageAlt: "Restaurant and Hospitality Interiors",
    action: "Coming Soon",
    accent: false,
    ensis: false,
    category: "Coming Soon",
    status: "Coming Soon",
    order: 9,
    downloadsCount: 54,
  },
  {
    id: "10",
    title: "Exhibition Stall Design",
    coverTitle: "Exhibition\nStall Design\n& Build",
    desc: "Innovative exhibition stalls and brand environments.",
    fileUrl: "",
    fileSize: "",
    cardImage: "/assets/image/b4.webp",
    imageAlt: "Exhibition Stall Design and Build",
    action: "Coming Soon",
    accent: false,
    ensis: false,
    category: "Coming Soon",
    status: "Coming Soon",
    order: 10,
    downloadsCount: 42,
  },
];

const categoryTone: Record<string, string> = {
  "Company Profile": "bg-blue-50 text-blue-600",
  "E-Brochure": "bg-emerald-50 text-emerald-600",
  "Newsletter": "bg-violet-50 text-violet-600",
  "Coming Soon": "bg-amber-50 text-amber-600",
};

function MetricCard({
  icon: Icon,
  tone,
  surface,
  valueTone,
  label,
  value,
  note,
}: {
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  tone: string;
  surface: string;
  valueTone: string;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div
      className={`relative flex h-[56px] min-w-0 items-center gap-[10px] overflow-hidden rounded-[7px] border px-[12px] py-[7px] shadow-[0_1px_2px_rgba(15,23,42,0.02)] ${surface}`}
    >
      <span
        className={`grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-white/80 ring-1 ring-inset ring-black/5 ${tone}`}
      >
        <Icon size={16} strokeWidth={1.8} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden">
        <p className="break-words text-[9px] font-semibold leading-[11px] text-slate-800">
          {label}
        </p>
        <div className="mt-[2px] flex items-baseline gap-[6px]">
          <span
            className={`text-[17px] font-semibold leading-none tracking-[-.03em] ${valueTone}`}
          >
            {value}
          </span>
          <span
            className={`truncate text-[8.5px] font-semibold leading-none ${
              note.startsWith("↑") ? "text-emerald-700" : "text-[#536987]"
            }`}
          >
            {note}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DownloadsManagementPage() {
  const [downloads, setDownloads] = useState<DownloadItemRecord[]>(INITIAL_DOWNLOADS);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DownloadItemRecord | null>(null);
  const [formData, setFormData] = useState<Partial<DownloadItemRecord>>({
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
    order: 1,
  });

  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);

  // Fetch from backend
  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const res = await api.get("/downloads");
      const resAny = res as Record<string, unknown>;
      const list = (resAny?.data as Record<string, unknown>)?.data || resAny?.data || res;
      if (Array.isArray(list) && list.length > 0) {
        setDownloads(list as DownloadItemRecord[]);
      } else {
        setDownloads(INITIAL_DOWNLOADS);
      }
    } catch {
      // Fallback to local default data
      setDownloads(INITIAL_DOWNLOADS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  // Filtered rows
  const rows = useMemo(() => {
    return downloads.filter((item) => {
      const matchQ = `${item.title} ${item.desc} ${item.category} ${item.imageAlt}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchStatus =
        statusFilter === "All Status" || item.status === statusFilter;
      const matchCat =
        categoryFilter === "All Categories" || item.category === categoryFilter;
      return matchQ && matchStatus && matchCat;
    });
  }, [downloads, query, statusFilter, categoryFilter]);

  const clearFilters = () => {
    setQuery("");
    setStatusFilter("All Status");
    setCategoryFilter("All Categories");
  };

  // Metrics
  const totalCount = downloads.length;
  const activeCount = downloads.filter((d) => d.status === "Active").length;
  const comingSoonCount = downloads.filter((d) => d.status === "Coming Soon").length;
  const inactiveCount = downloads.filter((d) => d.status === "Inactive").length;
  const totalDownloadsSum = downloads.reduce(
    (acc, curr) => acc + (curr.downloadsCount || (curr.order * 142 + 230)),
    0
  );

  const activePercent = totalCount ? Math.round((activeCount / totalCount) * 100) : 0;
  const comingSoonPercent = totalCount ? Math.round((comingSoonCount / totalCount) * 100) : 0;
  const inactivePercent = totalCount ? Math.round((inactiveCount / totalCount) * 100) : 0;

  // Top downloads
  const topDownloads = useMemo(() => {
    return [...downloads]
      .sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0))
      .slice(0, 3);
  }, [downloads]);

  // Open Add Modal
  const openNewModal = () => {
    setEditingItem(null);
    setFormData({
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
      order: downloads.length + 1,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (item: DownloadItemRecord) => {
    setEditingItem(item);
    setFormData({
      ...item,
    });
    setIsModalOpen(true);
  };

  // Delete
  const handleDelete = async (item: DownloadItemRecord) => {
    const res = await Swal.fire({
      title: "Delete Download?",
      text: `Are you sure you want to remove "${item.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#075D3D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete",
    });

    if (res.isConfirmed) {
      try {
        if (item._id) {
          await api.delete(`/downloads/${item._id}`);
        }
        setDownloads((prev) =>
          prev.filter((d) => (d._id || d.id) !== (item._id || item.id))
        );
        Swal.fire({
          title: "Deleted!",
          text: "Download item has been removed.",
          icon: "success",
          timer: 1500,
          confirmButtonColor: "#075D3D",
        });
      } catch {
        setDownloads((prev) =>
          prev.filter((d) => (d._id || d.id) !== (item._id || item.id))
        );
        Swal.fire({
          title: "Removed",
          text: "Item removed locally.",
          icon: "success",
          timer: 1500,
          confirmButtonColor: "#075D3D",
        });
      }
    }
  };

  // Handle Document Upload
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
    setUploadingDoc(true);
    try {
      const res = (await uploadApi.file(file, "design-house/downloads")) as unknown as Record<string, unknown>;
      const url = (res?.url || (res?.data as Record<string, unknown>)?.url) as string | undefined;
      if (url) {
        setFormData((prev) => ({
          ...prev,
          fileUrl: url,
          fileSize: sizeInMb,
        }));
      }
    } catch {
      // Local fallback simulation
      const localUrl = `/downloads/${file.name}`;
      setFormData((prev) => ({
        ...prev,
        fileUrl: localUrl,
        fileSize: sizeInMb,
      }));
    } finally {
      setUploadingDoc(false);
    }
  };

  // Handle Card Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    try {
      const res = (await uploadApi.file(file, "design-house/downloads/cards")) as unknown as Record<string, unknown>;
      const url = (res?.url || (res?.data as Record<string, unknown>)?.url) as string | undefined;
      if (url) {
        setFormData((prev) => ({
          ...prev,
          cardImage: url,
        }));
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        cardImage: localUrl,
      }));
    } finally {
      setUploadingImg(false);
    }
  };

  // Save Modal
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      Swal.fire("Validation Error", "Title is required", "error");
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      coverTitle: formData.coverTitle || formData.title,
      imageAlt: formData.imageAlt || `${formData.title} Brochure`,
      order: Number(formData.order) || downloads.length + 1,
    };

    try {
      if (editingItem?._id) {
        const res = (await api.put(`/downloads/${editingItem._id}`, payload)) as Record<string, unknown>;
        const updated = ((res?.data as Record<string, unknown>)?.data || res?.data || payload) as DownloadItemRecord;
        setDownloads((prev) =>
          prev.map((d) => (d._id === editingItem._id ? { ...d, ...updated } : d))
        );
      } else if (editingItem?.id) {
        setDownloads((prev) =>
          prev.map((d) =>
            d.id === editingItem.id ? ({ ...d, ...payload } as DownloadItemRecord) : d
          )
        );
      } else {
        try {
          const res = (await api.post("/downloads", payload)) as Record<string, unknown>;
          const created = ((res?.data as Record<string, unknown>)?.data || res?.data || payload) as DownloadItemRecord;
          setDownloads((prev) => [...prev, created]);
        } catch {
          const newItem = {
            ...payload,
            id: String(Date.now()),
          } as DownloadItemRecord;
          setDownloads((prev) => [...prev, newItem]);
        }
      }

      setIsModalOpen(false);
      Swal.fire({
        title: "Saved!",
        text: `Download item "${payload.title}" saved successfully.`,
        icon: "success",
        timer: 1800,
        confirmButtonColor: "#075D3D",
      });
    } catch (err) {
      Swal.fire(
        "Save Failed",
        err instanceof Error ? err.message : "Could not save download",
        "error"
      );
    }
  };

  return (
    <div
      style={{
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
      className="min-h-screen bg-[#F8FAF9] px-4 pb-8 pt-3 text-slate-800 antialiased sm:px-5"
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Top Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold leading-none tracking-[-.03em] text-[#123E2D]">
              Downloads Management
            </h1>
            <div className="mt-2 flex items-center gap-1.5 text-[9.5px] font-semibold text-slate-500">
              <span>Dashboard</span>
              <ChevronRight size={10} />
              <span>Content Management</span>
              <ChevronRight size={10} />
              <span className="text-slate-700">Downloads</span>
            </div>
          </div>
          <button
            type="button"
            onClick={openNewModal}
            className="inline-flex min-h-9 items-center gap-2 rounded-md bg-[#075D3D] px-4 text-[11px] font-semibold text-white shadow-sm hover:bg-[#064B32] transition-colors"
          >
            <Plus size={14} /> Add New Download
          </button>
        </div>

        {/* 5 Metric Cards matching Services layout */}
        <div className="mt-2 grid w-full items-stretch gap-1.5 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            icon={Download}
            tone="text-emerald-700"
            surface="border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/55"
            valueTone="text-emerald-800"
            label="Total Downloads"
            value={String(totalCount)}
            note={`Published: ${activeCount}`}
          />
          <MetricCard
            icon={FileCheck}
            tone="text-blue-600"
            surface="border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-100/60"
            valueTone="text-blue-800"
            label="Active Downloads"
            value={String(activeCount)}
            note="Visible on Website"
          />
          <MetricCard
            icon={Eye}
            tone="text-amber-600"
            surface="border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-100/70"
            valueTone="text-amber-800"
            label="Total Views"
            value="3,248"
            note="↑ 18.6% this month"
          />
          <MetricCard
            icon={ArrowDownToLine}
            tone="text-violet-600"
            surface="border-violet-200 bg-gradient-to-br from-violet-50 via-white to-violet-100/65"
            valueTone="text-violet-800"
            label="Total Requests"
            value="1,156"
            note="↑ 24.3% this month"
          />
          <MetricCard
            icon={Clock}
            tone="text-orange-600"
            surface="border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-100/70"
            valueTone="text-orange-800"
            label="Inactive Downloads"
            value={String(comingSoonCount)}
            note="Hidden from Website"
          />
        </div>

        {/* Two-Column Grid identical to Services View */}
        <div className="mt-1.5 grid gap-1.5 text-[11px] xl:grid-cols-[minmax(0,1fr)_280px] [&_input]:!text-[11.5px] [&_select]:!text-[11.5px] [&_button]:!text-[10.5px] [&_thead]:!text-[9.5px] [&_tbody]:!text-[10.5px] [&_tbody_p]:!text-[10.5px] [&_aside_h2]:!text-[11.5px] [&_aside_p]:!text-[10px]">
          {/* Main Column */}
          <div className="min-w-0 overflow-hidden">
            {/* Filter Bar */}
            <div className="mb-1.5 grid items-center gap-1.5 sm:grid-cols-[minmax(230px,1fr)_130px_145px_auto_auto]">
              <label className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search downloads by title, category, or keyword..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-[11px] outline-none focus:border-emerald-500"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={13} />
                  </button>
                )}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[10.5px] font-semibold outline-none"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Coming Soon</option>
                <option>Inactive</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-[10.5px] font-semibold outline-none"
              >
                <option>All Categories</option>
                <option>Company Profile</option>
                <option>E-Brochure</option>
                <option>Newsletter</option>
                <option>Coming Soon</option>
              </select>
              <button
                type="button"
                onClick={() => {}}
                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 text-[10.5px] font-semibold text-emerald-700 hover:bg-emerald-50/50"
              >
                <Filter size={14} /> More Filters
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[10.5px] font-semibold hover:bg-slate-50"
              >
                <RefreshCw size={13} /> Clear
              </button>
            </div>

            {/* Table Card */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[940px] border-collapse text-left">
                  <thead>
                    <tr className="h-10 border-b border-slate-200 bg-slate-50/80 text-[8.5px] font-semibold uppercase tracking-[.06em] text-slate-500">
                      <th className="w-10 px-3 text-center">
                        <input type="checkbox" />
                      </th>
                      <th className="px-2">Download Item &amp; Card</th>
                      <th className="px-2 whitespace-nowrap">Category</th>
                      <th className="px-2">Image Alt Text</th>
                      <th className="px-2 whitespace-nowrap">Status</th>
                      <th className="px-2 text-center">File Size</th>
                      <th className="px-2 text-center">Downloads</th>
                      <th className="px-2 text-center">Order</th>
                      <th className="px-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((item) => (
                      <tr
                        key={item._id || item.id}
                        className="h-[64px] border-b border-slate-100 align-middle last:border-0 hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="px-3 text-center">
                          <input type="checkbox" />
                        </td>
                        <td className="px-2">
                          <div className="flex min-w-[240px] items-center gap-2.5">
                            <div className="relative h-10 w-[54px] shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.cardImage || "/assets/image/vision.webp"}
                                alt={item.imageAlt || item.title}
                                className="h-full w-full object-cover"
                              />
                              {item.accent && (
                                <span className="absolute bottom-0 right-0 rounded-tl bg-amber-500 px-1 text-[7px] font-bold text-white leading-tight">
                                  Accent
                                </span>
                              )}
                              {item.ensis && (
                                <span className="absolute bottom-0 right-0 rounded-tl bg-emerald-600 px-1 text-[7px] font-bold text-white leading-tight">
                                  ENSIS
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold leading-tight text-slate-900 truncate">
                                {item.title}
                              </p>
                              <p className="mt-0.5 max-w-[210px] text-[8.5px] leading-[1.3] text-slate-500 line-clamp-1">
                                {item.desc}
                              </p>
                              {item.fileUrl && (
                                <a
                                  href={item.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-0.5 inline-flex items-center gap-1 text-[8px] font-semibold text-[#075D3D] hover:underline"
                                >
                                  <FileText size={9} />
                                  <span className="truncate max-w-[160px]">
                                    {item.fileUrl.split("/").pop()}
                                  </span>
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 whitespace-nowrap">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-md px-2 py-1 text-[8.5px] font-semibold ${
                              categoryTone[item.category] || "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="px-2">
                          <div
                            className="max-w-[170px] truncate rounded bg-amber-50/80 px-1.5 py-0.5 text-[8.5px] font-medium text-amber-800 border border-amber-200/60"
                            title={item.imageAlt}
                          >
                            alt: &ldquo;{item.imageAlt || item.title}&rdquo;
                          </div>
                        </td>
                        <td className="px-2 whitespace-nowrap">
                          <span
                            className={`inline-flex whitespace-nowrap items-center gap-1 rounded-md px-2 py-1 text-[8.5px] font-semibold ${
                              item.status === "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.status === "Coming Soon"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                item.status === "Active"
                                  ? "bg-emerald-500"
                                  : item.status === "Coming Soon"
                                  ? "bg-amber-500"
                                  : "bg-slate-400"
                              }`}
                            />
                            {item.status}
                          </span>
                        </td>
                        <td className="px-2 text-center text-[9.5px] font-semibold text-slate-600 tabular-nums">
                          {item.fileSize || "—"}
                        </td>
                        <td className="px-2 text-center text-[9.5px] font-semibold tabular-nums text-slate-700">
                          {(
                            item.downloadsCount ||
                            item.order * 142 + 230
                          ).toLocaleString()}
                        </td>
                        <td className="px-2 text-center text-[9.5px] font-semibold tabular-nums text-slate-500">
                          {item.order || 1}
                        </td>
                        <td className="px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              title="Edit Download"
                              className="grid size-7 place-items-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                            >
                              <Pencil size={11} />
                            </button>
                            {item.fileUrl ? (
                              <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Preview File"
                                className="grid size-7 place-items-center rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                              >
                                <Eye size={11} />
                              </a>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="grid size-7 place-items-center rounded-md border border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed"
                              >
                                <Eye size={11} />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              title="Delete Download"
                              className="grid size-7 place-items-center rounded-md border border-slate-200 bg-white hover:bg-red-50 text-red-600 transition-colors"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-[9.5px] text-slate-500">
                <span>
                  Showing 1 to {rows.length} of {downloads.length} downloads
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="grid size-8 place-items-center rounded-md border border-slate-200 hover:bg-slate-50"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <button
                    type="button"
                    className="grid size-8 place-items-center rounded-md bg-[#075D3D] font-semibold text-white"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="grid size-8 place-items-center rounded-md border border-slate-200 font-semibold hover:bg-slate-50"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="grid size-8 place-items-center rounded-md border border-slate-200 hover:bg-slate-50"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
                <select className="h-8 rounded-md border border-slate-200 bg-white px-3 text-[9.5px] font-semibold outline-none">
                  <option>10 / page</option>
                  <option>20 / page</option>
                  <option>50 / page</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) identical to Services */}
          <aside className="space-y-1.5">
            {/* Overview Donut */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-[11px] font-semibold text-slate-900">
                Downloads Overview
              </h2>
              <div className="mt-4 flex items-center gap-5">
                <div
                  className="grid size-24 shrink-0 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(#087345 0 ${activePercent}%, #f59e0b ${activePercent}% ${
                      activePercent + comingSoonPercent
                    }%, #94a3b8 ${activePercent + comingSoonPercent}% 100%)`,
                  }}
                >
                  <div className="grid size-[68px] place-items-center rounded-full bg-white text-center shadow-inner">
                    <div>
                      <span className="block text-lg font-bold text-slate-950 leading-none">
                        {downloads.length}
                      </span>
                      <span className="text-[8px] font-medium text-slate-500">
                        Total Files
                      </span>
                    </div>
                  </div>
                </div>
                <div className="min-w-0 flex-1 space-y-2.5 text-[9px]">
                  <p className="flex items-center justify-between gap-2">
                    <span className="text-slate-700">
                      <i className="mr-2 inline-block size-2 rounded-full bg-emerald-600" />
                      Active ({activeCount})
                    </span>
                    <span className="font-semibold text-slate-900">
                      {activePercent}%
                    </span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-slate-700">
                      <i className="mr-2 inline-block size-2 rounded-full bg-amber-500" />
                      Coming Soon ({comingSoonCount})
                    </span>
                    <span className="font-semibold text-slate-900">
                      {comingSoonPercent}%
                    </span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="text-slate-700">
                      <i className="mr-2 inline-block size-2 rounded-full bg-slate-400" />
                      Inactive ({inactiveCount})
                    </span>
                    <span className="font-semibold text-slate-900">
                      {inactivePercent}%
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <h2 className="mb-2 text-[10.5px] font-semibold text-slate-900">
                Quick Actions
              </h2>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={openNewModal}
                  className="flex h-8 w-full items-center gap-2 rounded-md border border-slate-200 px-3 text-[9.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Plus size={12} className="text-emerald-700" /> Add New Download
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter("E-Brochure")}
                  className="flex h-8 w-full items-center gap-2 rounded-md border border-slate-200 px-3 text-[9.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Tag size={12} className="text-blue-600" /> View E-Brochures
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter("Newsletter")}
                  className="flex h-8 w-full items-center gap-2 rounded-md border border-slate-200 px-3 text-[9.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileText size={12} className="text-violet-600" /> View Newsletters
                </button>
                <button
                  type="button"
                  onClick={() =>
                    window.open("http://localhost:3010/downloads", "_blank")
                  }
                  className="flex h-8 w-full items-center gap-2 rounded-md border border-slate-200 px-3 text-[9.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ExternalLink size={12} className="text-emerald-700" /> View Live Website Downloads
                </button>
              </div>
            </section>

            {/* Top Performing Downloads */}
            <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <h2 className="mb-2 text-[10.5px] font-semibold text-slate-900">
                Top Performing Downloads
              </h2>
              {topDownloads.map((item, index) => (
                <div
                  key={item._id || item.id}
                  className="flex items-center gap-2 py-1.5 text-[9px] border-b border-slate-100 last:border-0"
                >
                  <span className="text-[12px] font-bold text-slate-400 w-4">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold text-slate-800">
                    {item.title}
                  </span>
                  <ArrowDownToLine size={10} className="text-slate-400 shrink-0" />
                  <span className="tabular-nums font-semibold text-slate-600">
                    {(
                      item.downloadsCount ||
                      1420 - index * 260
                    ).toLocaleString()}
                  </span>
                </div>
              ))}
            </section>

            {/* Bottom Callout Banner */}
            <section className="relative min-h-[92px] overflow-hidden rounded-xl bg-[#075D3D] px-4 py-3 text-white shadow-sm">
              <p className="max-w-[185px] text-[10.5px] font-semibold leading-4">
                Upload latest company profiles, e-brochures &amp; newsletters for your clients.
              </p>
              <button
                type="button"
                onClick={openNewModal}
                className="mt-2 rounded-md bg-white px-3 py-1.5 text-[9px] font-semibold text-[#075D3D] hover:bg-slate-100 transition-colors"
              >
                Add New Download →
              </button>
              <Download
                className="absolute -bottom-3 right-2 text-emerald-300/30"
                size={62}
              />
            </section>
          </aside>
        </div>
      </div>

      {/* Edit / Add Modal with Dedicated Image ALT Text */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3">
              <div>
                <h3 className="text-sm font-bold text-[#123E2D]">
                  {editingItem ? "Edit Download & Brochure" : "Add New Download"}
                </h3>
                <p className="text-[10px] text-slate-500">
                  Upload file, cover image, and configure SEO image alt tags
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="grid size-7 place-items-center rounded-md text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="max-h-[80vh] overflow-y-auto p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Title */}
                <div>
                  <label className="mb-1 block text-[10.5px] font-semibold text-slate-700">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Office Furniture"
                    className="h-9 w-full rounded-md border border-slate-300 px-3 text-[11px] outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Cover Title */}
                <div>
                  <label className="mb-1 block text-[10.5px] font-semibold text-slate-700">
                    Card Cover Title (Use \n for line-break)
                  </label>
                  <input
                    type="text"
                    value={formData.coverTitle || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, coverTitle: e.target.value })
                    }
                    placeholder="e.g. Office\nFurniture"
                    className="h-9 w-full rounded-md border border-slate-300 px-3 text-[11px] outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1 block text-[10.5px] font-semibold text-slate-700">
                    Category *
                  </label>
                  <select
                    value={formData.category || "E-Brochure"}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="h-9 w-full rounded-md border border-slate-300 px-2.5 text-[11px] font-medium outline-none focus:border-emerald-600"
                  >
                    <option value="Company Profile">Company Profile</option>
                    <option value="E-Brochure">E-Brochure</option>
                    <option value="Newsletter">Newsletter</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1 block text-[10.5px] font-semibold text-slate-700">
                    Status *
                  </label>
                  <select
                    value={formData.status || "Active"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "Active" | "Coming Soon" | "Inactive",
                      })
                    }
                    className="h-9 w-full rounded-md border border-slate-300 px-2.5 text-[11px] font-medium outline-none focus:border-emerald-600"
                  >
                    <option value="Active">Active (Live on Website)</option>
                    <option value="Coming Soon">Coming Soon</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                {/* Action button label */}
                <div>
                  <label className="mb-1 block text-[10.5px] font-semibold text-slate-700">
                    Button Action Text
                  </label>
                  <input
                    type="text"
                    value={formData.action || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, action: e.target.value })
                    }
                    placeholder="e.g. Download Brochure"
                    className="h-9 w-full rounded-md border border-slate-300 px-3 text-[11px] outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="mb-1 block text-[10.5px] font-semibold text-slate-700">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order || 1}
                    onChange={(e) =>
                      setFormData({ ...formData, order: Number(e.target.value) })
                    }
                    className="h-9 w-full rounded-md border border-slate-300 px-3 text-[11px] outline-none focus:border-emerald-600"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-[10.5px] font-semibold text-slate-700">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.desc || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, desc: e.target.value })
                    }
                    placeholder="Short description of the brochure/vertical..."
                    className="w-full rounded-md border border-slate-300 p-2.5 text-[11px] outline-none focus:border-emerald-600"
                  />
                </div>

                {/* File Upload Section */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-slate-800">
                        Document / PDF File
                      </h4>
                      <p className="text-[9px] text-slate-500">
                        Upload PDF/DOC file or paste public URL
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => docInputRef.current?.click()}
                      disabled={uploadingDoc}
                      className="inline-flex items-center gap-1.5 rounded-md bg-white border border-slate-300 px-3 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      <Upload size={12} />
                      {uploadingDoc ? "Uploading..." : "Upload PDF"}
                    </button>
                    <input
                      ref={docInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_120px]">
                    <input
                      type="text"
                      value={formData.fileUrl || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, fileUrl: e.target.value })
                      }
                      placeholder="File URL (e.g. /downloads/ebrochures/office.pdf)"
                      className="h-8 w-full rounded-md border border-slate-300 bg-white px-2.5 text-[10.5px] outline-none focus:border-emerald-600"
                    />
                    <input
                      type="text"
                      value={formData.fileSize || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, fileSize: e.target.value })
                      }
                      placeholder="Size (e.g. 15.9 MB)"
                      className="h-8 w-full rounded-md border border-slate-300 bg-white px-2.5 text-[10.5px] outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Card Image & Image ALT Section */}
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/30 p-3 sm:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold text-[#075D3D]">
                        Card Cover Image &amp; SEO Alt Tag
                      </h4>
                      <p className="text-[9px] text-slate-500">
                        Card thumbnail image that visitors see before downloading
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => imgInputRef.current?.click()}
                      disabled={uploadingImg}
                      className="inline-flex items-center gap-1.5 rounded-md bg-[#075D3D] px-3 py-1.5 text-[10px] font-semibold text-white shadow-sm hover:bg-[#064B32]"
                    >
                      <ImageIcon size={12} />
                      {uploadingImg ? "Uploading..." : "Upload Card Image"}
                    </button>
                    <input
                      ref={imgInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.cardImage || "/assets/image/vision.webp"}
                        alt={formData.imageAlt || "Card preview"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label className="mb-0.5 block text-[9.5px] font-semibold text-slate-700">
                        Card Image URL
                      </label>
                      <input
                        type="text"
                        value={formData.cardImage || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, cardImage: e.target.value })
                        }
                        placeholder="Image URL (e.g. /assets/image/vision.webp)"
                        className="h-8 w-full rounded-md border border-slate-300 bg-white px-2.5 text-[10.5px] outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* DEDICATED IMAGE ALT TEXT INPUT */}
                  <div className="border-t border-emerald-200/60 pt-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold text-slate-800 flex items-center gap-1">
                        <span>Card Image Alt Text (SEO &amp; Accessibility)</span>
                        <span className="text-red-500 font-bold">*</span>
                      </label>
                      <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                        Alt Tag Required
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.imageAlt || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, imageAlt: e.target.value })
                      }
                      placeholder="e.g. Design House India Office Furniture Brochure 2026"
                      className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-[11px] font-medium text-slate-900 outline-none focus:border-emerald-600 shadow-sm"
                    />
                    <p className="mt-1 text-[8.5px] text-slate-500">
                      This alt tag is rendered directly in the HTML &lt;img alt=&quot;...&quot; /&gt; tag for Google image indexing.
                    </p>
                  </div>
                </div>

                {/* Styling Options */}
                <div className="flex items-center gap-6 sm:col-span-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[10.5px] font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.accent)}
                      onChange={(e) =>
                        setFormData({ ...formData, accent: e.target.checked })
                      }
                      className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Highlight with Gold Accent Card styling</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[10.5px] font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.ensis)}
                      onChange={(e) =>
                        setFormData({ ...formData, ensis: e.target.checked })
                      }
                      className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>ENSIS Spa Theme styling</span>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#075D3D] px-5 py-2 text-[11px] font-semibold text-white shadow hover:bg-[#064B32]"
                >
                  {editingItem ? "Update Download" : "Save Download"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
