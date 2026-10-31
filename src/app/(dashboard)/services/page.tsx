"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import typography from "../pages/PagesTypography.module.css";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Check,
  ChevronRight,
  ExternalLink,
  Eye,
  FolderClosed,
  Layers,
  Link2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  servicesApi,
  type ServiceItem,
  DEFAULT_SERVICE_LINKS,
} from "@/lib/servicesApi";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const toneClass = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-200",
} as const;

const DETAIL_PAGES = [
  { title: "Corporate Interiors", href: "/services/corporate-interiors", image: "/services/os1.webp" },
  { title: "Retail Showroom Interiors", href: "/services/retail-showrooms", image: "/services/os2.webp" },
  { title: "Restaurant Interiors", href: "/services/restaurant-interiors", image: "/services/os3.webp" },
  { title: "Exhibition Stall Design & Build", href: "/services/exhibition-stalls", image: "/services/os4.webp" },
  { title: "Retail Kiosks", href: "/services/retail-kiosks", image: "/services/os5.webp" },
  { title: "Retail Display Fixtures", href: "/services/display-fixtures", image: "/services/os6.webp" },
  { title: "Signage & Branding", href: "/services/signage-branding", image: "/services/os7.webp" },
  { title: "Manufacturing & Execution", href: "/services/manufacturing-execution", image: "/services/os8.webp" },
  { title: "Residential Interiors", href: "/services/residential-interiors", image: "/services/os9.webp" },
  { title: "Spa & Panchkarma Furniture", href: "/services/ensis", image: "/services/os10.webp" },
];

export default function ServicesManagementPage() {
  const router = useRouter();
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLink, setSelectedLink] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const loadServices = async () => {
    try {
      setLoading(true);
      const list = await servicesApi.list();
      setServicesList(list);
    } catch (e) {
      console.error("Failed to load services:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDeleteService = async (serviceId: string | number, serviceTitle: string) => {
    const result = await Swal.fire({
      title: "Delete Service?",
      text: `Are you sure you want to permanently delete "${serviceTitle.replace(/\n/g, " ")}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        await servicesApi.delete(serviceId);
        setServicesList((prev) =>
          prev.filter((s) => String(s.id) !== String(serviceId) && String(s._id) !== String(serviceId))
        );
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Service removed successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err instanceof Error ? err.message : "Could not delete service",
        });
      }
    }
  };

  const handleResetDefaults = async () => {
    const result = await Swal.fire({
      title: "Reset to Website Defaults?",
      text: "This will restore all 10 original services from the Design House website.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#134698",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Reset All",
    });

    if (result.isConfirmed) {
      const reset = await servicesApi.resetDefaults();
      setServicesList(reset);
      Swal.fire({
        icon: "success",
        title: "Reset Successful",
        text: "Services restored to default 10 website entries.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Filtered services
  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return servicesList.filter((s) => {
      if (selectedLink && s.href !== selectedLink) return false;
      if (selectedStatus && s.status !== selectedStatus) return false;
      if (q) {
        const matchesTitle = s.title.toLowerCase().includes(q);
        const matchesDesc = (s.desc || "").toLowerCase().includes(q);
        const matchesHref = s.href.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesHref) return false;
      }
      return true;
    });
  }, [servicesList, searchQuery, selectedLink, selectedStatus]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = servicesList.length;
    const published = servicesList.filter((s) => s.status === "Published").length;
    const drafts = servicesList.filter((s) => s.status === "Draft").length;
    const views = servicesList.reduce((acc, s) => acc + (s.views || 0), 0);
    const logos = servicesList.filter((s) => s.logo).length;
    return { total, published, drafts, views, logos };
  }, [servicesList]);

  const statCards = useMemo(
    () => [
      {
        title: "TOTAL SERVICES",
        value: stats.total,
        suffix: "",
        icon: Briefcase,
        tone: "emerald" as const,
        gradient: "linear-gradient(135deg, #ffffff 0%, #ffffff 42%, #bbf7d0 100%)",
        borderColor: "#bbf7d0",
        numColor: "#15803d",
        footer: `Pub: ${stats.published} | Draft: ${stats.drafts}`,
      },
      {
        title: "PUBLISHED LIVE",
        value: stats.published,
        suffix: "",
        icon: Check,
        tone: "teal" as const,
        gradient: "linear-gradient(135deg, #ffffff 0%, #ffffff 42%, #99f6e4 100%)",
        borderColor: "#99f6e4",
        numColor: "#0f766e",
        footer: "Live on /services",
      },
      {
        title: "TOTAL VIEWS",
        value: stats.views > 0 ? stats.views : 17420,
        suffix: "+18.4%",
        icon: Eye,
        tone: "blue" as const,
        gradient: "linear-gradient(135deg, #ffffff 0%, #ffffff 42%, #bae6fd 100%)",
        borderColor: "#bae6fd",
        numColor: "#0284c7",
        footer: "Traffic on services",
      },
      {
        title: "DETAIL PAGES",
        value: DEFAULT_SERVICE_LINKS.length,
        suffix: "",
        icon: Layers,
        tone: "violet" as const,
        gradient: "linear-gradient(135deg, #ffffff 0%, #ffffff 42%, #ddd6fe 100%)",
        borderColor: "#ddd6fe",
        numColor: "#6d28d9",
        footer: "/services/[slug]",
      },
      {
        title: "BRAND LOGOS",
        value: stats.logos,
        suffix: "",
        icon: Sparkles,
        tone: "amber" as const,
        gradient: "linear-gradient(135deg, #ffffff 0%, #ffffff 42%, #fed7aa 100%)",
        borderColor: "#fed7aa",
        numColor: "#c2410c",
        footer: "Logo overlay on cards",
      },
    ],
    [stats]
  );

  return (
    <main
      className={`${typography.pages} h-full min-h-0 w-full overflow-y-auto overflow-x-hidden bg-[#fffefb] px-[18px] py-[14px] text-[#142347] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300`}
    >
      <div className="min-h-full w-full">
        {/* TOP HEADING — Same style as Projects */}
        <div className="mb-[18px] flex shrink-0 items-center justify-between border-b-[2px] border-[#293681] pb-[8px]">
          <div>
            <h1
              className="text-[19px] font-bold leading-[1.15] tracking-[-0.018em] text-[#23471d]"
              style={{ color: "#23471d" }}
            >
              Our Services Management
            </h1>
            <p className="mt-0.5 text-[9px] font-medium text-[#6c7587]">
              Super Admin — manage corporate, retail, restaurant, exhibition, signage &amp; residential services.
            </p>
          </div>

          <div className="flex items-center gap-[10px]">
            <a
              href="http://localhost:3010/services"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[30px] items-center justify-center gap-[5px] rounded-[6px] border border-[#bfdbfe] bg-[#eff6ff] px-[14px] text-[8.5px] font-semibold text-[#1d4ed8] transition hover:bg-[#dbeafe] shadow-sm"
            >
              <ExternalLink className="h-[12px] w-[12px] text-[#1d4ed8]" strokeWidth={1.7} />
              View on Website
            </a>

            <button
              type="button"
              onClick={handleResetDefaults}
              title="Reset services to original 10 website entries"
              className="flex h-[30px] items-center justify-center gap-[5px] rounded-[6px] border border-[#fed7aa] bg-[#fff7ed] px-[14px] text-[8.5px] font-semibold text-[#ea580c] transition hover:bg-[#ffedd5] shadow-sm"
            >
              <RotateCcw className="h-[12px] w-[12px] text-[#ea580c]" strokeWidth={1.7} />
              Reset Defaults
            </button>

            <button
              type="button"
              onClick={() => router.push("/services/new")}
              className="flex h-[30px] items-center justify-center gap-[5px] rounded-[6px] bg-[#4B1426] px-[14px] text-[8.5px] font-semibold text-white shadow-[0_5px_12px_rgba(75,20,38,0.25)] transition hover:bg-[#3a0f1d]"
            >
              <Plus className="h-[12px] w-[12px]" strokeWidth={1.7} />
              Add New Service
            </button>
          </div>
        </div>

        {/* METRIC STATS CARDS */}
        <div className="mt-[12px] grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="relative flex h-[98px] flex-col overflow-hidden rounded-[11px] border border-[#e5e7e6] bg-white p-2 !pb-5.5 transition-all hover:translate-y-[-1px]"
                style={{
                  background: item.gradient,
                  borderColor: item.borderColor || undefined,
                  boxShadow:
                    "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                }}
              >
                <div className="flex items-start gap-1.5">
                  <div
                    className={`grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full ring-1 bg-white/80 shadow-xs ${
                      toneClass[item.tone as keyof typeof toneClass]
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-[8.5px] !font-semibold tracking-[0.01em] text-slate-900"
                      style={{
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      {item.title}
                    </p>

                    <div className="mt-1.5 flex items-end gap-1">
                      <span
                        className="text-[21px] !font-semibold leading-none tracking-[-0.04em]"
                        style={{
                          color: item.numColor,
                          fontWeight: 600,
                        }}
                      >
                        <AnimatedCounter value={item.value} />
                      </span>

                      {item.suffix && (
                        <span className="mb-0.5 text-[9.5px] font-bold text-emerald-700">
                          {item.suffix}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-1 left-2 right-2 flex cursor-pointer items-center justify-center gap-1 text-[8px] font-semibold text-[#293957] transition hover:text-blue-600">
                  {item.footer}
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="mt-[14px] flex flex-wrap items-center justify-between gap-3 rounded-[7px] border border-[#e8e5df] bg-white p-2.5 shadow-xs">
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services by title, description, or link..."
              className="h-[32px] w-full rounded-[6px] border border-[#d9dee6] bg-[#fafafa] pl-8 pr-3 text-[11px] text-[#1e293b] outline-none transition focus:border-[#134698] focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedLink}
              onChange={(e) => setSelectedLink(e.target.value)}
              aria-label="Filter by Service Page"
              className="h-[32px] rounded-[6px] border border-[#d9dee6] bg-white px-2.5 text-[10.5px] font-semibold text-[#1e293b] outline-none cursor-pointer focus:border-[#134698]"
            >
              <option value="">All Service Pages ({DEFAULT_SERVICE_LINKS.length})</option>
              {DEFAULT_SERVICE_LINKS.map((link) => (
                <option key={link} value={link}>
                  {link}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by Status"
              className="h-[32px] rounded-[6px] border border-[#d9dee6] bg-white px-2.5 text-[10.5px] font-semibold text-[#1e293b] outline-none cursor-pointer focus:border-[#134698]"
            >
              <option value="">All Statuses</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
            </select>

            {(searchQuery || selectedLink || selectedStatus) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLink("");
                  setSelectedStatus("");
                }}
                className="h-[32px] rounded-[6px] border border-red-200 bg-red-50 px-3 text-[10px] font-bold text-red-600 hover:bg-red-100 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* MAIN TWO COLUMN SECTION: SERVICES TABLE + DETAIL PAGES */}
        <div className="mt-[14px] grid items-start gap-[14px] xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.95fr)]">
          {/* SERVICES TABLE */}
          <section
            className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[7px] bg-white border border-[#e8e5df]"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
            }}
          >
            {/* Card Header */}
            <div className="flex h-[38px] items-center justify-between border-b border-[#e8e5df] px-[14px] bg-[#fafafa]">
              <div className="flex items-center gap-2">
                <span className="grid h-[22px] w-[22px] place-items-center rounded-[4px] bg-[#075b33] text-white">
                  <Briefcase className="h-[12px] w-[12px]" />
                </span>
                <h2 className="text-[10px] font-bold text-[#233D4D] uppercase tracking-wide">
                  Website Services Grid
                </h2>
              </div>
              <button
                onClick={loadServices}
                className="inline-flex items-center gap-1 text-[8.5px] font-bold text-[#075b33] hover:underline"
              >
                Refresh List
                <ArrowRight className="h-[11px] w-[11px]" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="h-[32px] border-b border-[#e8e5df] bg-[#233D4D]">
                    <th className="px-[12px] py-[6px] text-[8.5px] font-bold text-white uppercase tracking-wider">
                      Service Title &amp; Details
                    </th>
                    <th className="px-[12px] py-[6px] whitespace-nowrap text-[8.5px] font-bold text-white uppercase tracking-wider">
                      Page Link
                    </th>
                    <th className="px-[12px] py-[6px] whitespace-nowrap text-[8.5px] font-bold text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-[12px] py-[6px] whitespace-nowrap text-[8.5px] font-bold text-white uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-[12px] py-[6px] whitespace-nowrap text-[8.5px] font-bold text-white uppercase tracking-wider">
                      Updated By
                    </th>
                    <th className="rounded-tr-[6px] px-[12px] py-[6px] text-right text-[8.5px] font-bold text-white uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0f0ec]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[12px] font-medium text-slate-500">
                        Loading services...
                      </td>
                    </tr>
                  ) : filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[12px] font-medium text-slate-500">
                        No services match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((service) => (
                      <tr
                        key={service.id}
                        className="transition hover:bg-slate-50/80 cursor-pointer"
                      >
                        {/* Title + Thumbnail */}
                        <td className="px-[12px] py-[8px]">
                          <div className="flex min-w-[260px] items-center gap-[10px]">
                            <div className="relative flex h-[36px] w-[54px] shrink-0 items-center justify-center rounded-[4px] border border-[#e4e7eb] bg-white p-0.5 shadow-xs overflow-hidden">
                              <img
                                src={service.image}
                                alt={service.title.replace(/\n/g, " ")}
                                className="h-full w-full object-cover rounded-[3px]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/services/os1.webp";
                                }}
                              />
                            </div>
                            <div className="min-w-0 overflow-hidden">
                              <span
                                onClick={() => router.push(`/services/new?id=${service._id || service.id}`)}
                                className="truncate text-[8.5px] font-semibold text-[#4B1426] block hover:text-[#075b33] transition whitespace-pre-line leading-tight"
                              >
                                {service.title}
                              </span>
                              <div className="flex items-center gap-1 mt-[2px] flex-wrap">
                                <span className="inline-block rounded-[3px] bg-[#f0f4f8] px-[5px] py-[1px] font-mono text-[7px] font-semibold text-[#233D4D]">
                                  #{String(service._id || service.id).slice(-6)}
                                </span>
                                {service.logo && (
                                  <span className="inline-block rounded-[3px] bg-amber-100 border border-amber-300 text-amber-800 px-[4px] py-[1px] text-[7px] font-bold">
                                    Logo Overlay
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Page Link */}
                        <td className="px-[12px] py-[8px] whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[7.5px] font-medium text-slate-700">
                            <Link2 className="h-2.5 w-2.5 text-[#134698]" />
                            {service.href}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-[12px] py-[8px] whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-[4px] px-[8px] py-[2px] text-[7.5px] font-bold shadow-xs ${
                              service.status === "Published"
                                ? "bg-[#e8f5e9] text-[#23714a] border border-[#a5d6a7]"
                                : service.status === "Scheduled"
                                ? "bg-[#fef3c7] text-[#b45309] border border-[#fde68a]"
                                : "bg-[#ffebee] text-[#c62828] border border-[#ef9a9a]"
                            }`}
                          >
                            {service.status === "Scheduled" ? "⏰ Scheduled" : service.status}
                          </span>
                        </td>

                        {/* Views */}
                        <td className="px-[12px] py-[8px] whitespace-nowrap">
                          <span className="text-[8px] font-semibold text-[#293681]">
                            {service.views ? service.views.toLocaleString() : "0"}
                          </span>
                        </td>

                        {/* Updated By */}
                        <td className="px-[12px] py-[8px] whitespace-nowrap">
                          <div className="flex flex-col gap-[2px]">
                            <span className="text-[7.5px] font-semibold text-[#1e293b] leading-tight">
                              {service.dateTime || service.date || "—"}
                            </span>
                            <span className="text-[7px] font-medium text-[#075b33] flex items-center gap-[3px]">
                              <span>👤</span>
                              {service.author || "Admin"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-[12px] py-[8px] text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title="View Service on Website"
                              onClick={() => {
                                const targetUrl = service.href.startsWith("http")
                                  ? service.href
                                  : `http://localhost:3010${service.href}`;
                                window.open(targetUrl, "_blank");
                              }}
                              className="flex h-[25px] w-[25px] items-center justify-center rounded-[6px] bg-orange-500/10 text-orange-600 backdrop-blur-md border border-orange-400/30 shadow-[0_2px_6px_rgba(249,115,22,0.12)] transition-all hover:bg-orange-500/20 hover:border-orange-400/50 hover:shadow-[0_3px_10px_rgba(249,115,22,0.25)] hover:scale-105 active:scale-95"
                            >
                              <Eye className="h-[12px] w-[12px] text-orange-600" />
                            </button>

                            <button
                              type="button"
                              title="Edit Service"
                              onClick={() => router.push(`/services/new?id=${service._id || service.id}`)}
                              className="flex h-[25px] w-[25px] items-center justify-center rounded-[6px] bg-blue-500/10 text-blue-600 backdrop-blur-md border border-blue-400/30 shadow-[0_2px_6px_rgba(37,99,235,0.12)] transition-all hover:bg-blue-500/20 hover:border-blue-400/50 hover:shadow-[0_3px_10px_rgba(37,99,235,0.25)] hover:scale-105 active:scale-95"
                            >
                              <Pencil className="h-[12px] w-[12px] text-blue-600" />
                            </button>

                            <button
                              type="button"
                              title="Delete Service"
                              onClick={() => handleDeleteService(service._id || service.id, service.title)}
                              className="flex h-[25px] w-[25px] items-center justify-center rounded-[6px] bg-red-500/10 text-red-600 backdrop-blur-md border border-red-400/30 shadow-[0_2px_6px_rgba(239,68,68,0.12)] transition-all hover:bg-red-500/20 hover:border-red-400/50 hover:scale-105 active:scale-95"
                            >
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

            {/* Table Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e8e5df] bg-[#fafafa] px-[12px] py-[6px] text-[8px]">
              <span className="font-semibold text-[#2563eb]">
                Total Services: <strong className="font-bold text-[#1d4ed8]">{stats.total}</strong> (Showing{" "}
                {filteredServices.length})
              </span>
              <button
                onClick={loadServices}
                className="inline-flex items-center gap-1 font-bold text-[#075b33] hover:underline"
              >
                Refresh <ArrowRight className="h-[11px] w-[11px]" />
              </button>
            </div>
          </section>

          {/* SERVICE DETAIL PAGES SPOTLIGHT */}
          <section
            className="flex min-h-0 flex-col overflow-hidden rounded-[7px] bg-white border border-[#e8e5df]"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
            }}
          >
            {/* Card Header */}
            <div className="flex h-[38px] items-center justify-between border-b border-[#e8e5df] px-[14px] bg-[#fafafa]">
              <div className="flex items-center gap-2">
                <span className="grid h-[22px] w-[22px] place-items-center rounded-[4px] bg-[#0284c7] text-white">
                  <Layers className="h-[12px] w-[12px]" />
                </span>
                <h2 className="text-[10px] font-bold text-[#233D4D] uppercase tracking-wide">
                  Service Detail Pages
                </h2>
              </div>
              <span className="text-[8px] font-bold text-amber-600">Spotlight</span>
            </div>

            {/* List */}
            <div className="divide-y divide-[#f0f0ec] px-[12px]">
              {DETAIL_PAGES.map((page) => (
                <div
                  key={page.href}
                  onClick={() => window.open(`http://localhost:3010${page.href}`, "_blank")}
                  className="grid min-h-[54px] grid-cols-[36px_minmax(0,1fr)_auto_16px] items-center gap-[10px] py-[7px] cursor-pointer hover:bg-slate-50 transition"
                >
                  <div className="relative h-[34px] w-[34px] rounded-[6px] overflow-hidden border border-slate-200 shadow-2xs">
                    <img src={page.image} alt={page.title} className="h-full w-full object-cover" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[8.5px] font-semibold text-[#19274a]">
                      {page.title}
                    </p>
                    <p className="mt-[2px] whitespace-nowrap text-[7.5px] font-medium text-[#68758d]">
                      {page.href}
                    </p>
                  </div>

                  <span className="rounded-[4px] bg-[#e8f5e9] px-[8px] py-[2px] text-[7.5px] font-bold text-[#23714a] border border-[#a5d6a7] shadow-xs">
                    Live
                  </span>

                  <ChevronRight className="h-[12px] w-[12px] text-[#8c98a9]" />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-[#e8e5df] bg-[#fafafa] px-[12px] py-[6px]">
              <button
                onClick={() => router.push("/services/new")}
                className="flex h-[28px] w-full items-center justify-center gap-1.5 rounded-[5px] border border-[#fed7aa] bg-[#fff7ed] text-[8.5px] font-bold text-[#ea580c] transition hover:bg-[#ffedd5] shadow-2xs"
              >
                <Plus className="h-[12px] w-[12px]" strokeWidth={1.8} />
                Add Another Service
              </button>
            </div>
          </section>
        </div>

        {/* QUICK ACTIONS & INSIGHTS SECTION */}
        <div className="mt-[14px] grid items-stretch gap-[14px] xl:grid-cols-[minmax(360px,0.8fr)_minmax(0,1fr)]">
          {/* QUICK ACTIONS */}
          <section
            className="flex flex-col justify-between rounded-[7px] bg-white border border-[#e8e5df] p-[14px]"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
            }}
          >
            <div className="flex items-center justify-between border-b border-[#e8e5df] pb-2">
              <h2 className="text-[10px] font-bold text-[#233D4D] uppercase tracking-wide">
                Quick Actions
              </h2>
              <span className="text-[7.5px] font-semibold text-[#6c7587]">Fast Shortcuts</span>
            </div>

            <div className="mt-[12px] grid grid-cols-5 gap-[10px]">
              {[
                { icon: Plus, label: "Add Service", action: () => router.push("/services/new") },
                { icon: ExternalLink, label: "Live Services", action: () => window.open("http://localhost:3010/services", "_blank") },
                { icon: FolderClosed, label: "Detail Pages", action: () => setSelectedLink("") },
                { icon: CalendarDays, label: "Statuses", action: () => setSelectedStatus("") },
                { icon: RotateCcw, label: "Reset All", action: handleResetDefaults },
              ].map((item) => {
                const ActionIcon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="group min-w-0 text-center transition hover:-translate-y-0.5"
                  >
                    <div className="mx-auto grid h-[50px] w-[50px] place-items-center rounded-[8px] border border-[#dce8df] bg-[linear-gradient(180deg,#eef7f1_0%,#f7faf8_100%)] text-[#14683d] shadow-2xs group-hover:border-[#075b33] group-hover:bg-[#e8f5e9]">
                      <ActionIcon className="h-[20px] w-[20px]" strokeWidth={1.8} />
                    </div>
                    <span className="mt-[6px] block text-[7.5px] font-semibold leading-[1.3] text-[#293854]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SERVICE SECTOR BREAKDOWN */}
          <section
            className="flex flex-col justify-between rounded-[7px] bg-white border border-[#e8e5df] p-[14px]"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
            }}
          >
            <div className="flex items-center justify-between border-b border-[#e8e5df] pb-2">
              <h2 className="text-[10px] font-bold text-[#233D4D] uppercase tracking-wide">
                Key Service Sectors
              </h2>
              <span className="text-[7.5px] font-semibold text-emerald-700 font-mono">End-to-End Delivery</span>
            </div>

            <div className="mt-[12px] grid grid-cols-4 gap-[12px]">
              {[
                { title: "Interiors", count: "4 Services", sub: "Corporate, Retail, Restaurant, Residential", color: "#15803d" },
                { title: "Retail Ops", count: "3 Services", sub: "Showroom, Kiosks, Display Fixtures", color: "#0f766e" },
                { title: "Exhibitions", count: "1 Service", sub: "Stall Design & Build", color: "#6d28d9" },
                { title: "Branding", count: "2 Services", sub: "Signage & Manufacturing", color: "#c2410c" },
              ].map((sector) => (
                <div key={sector.title} className="rounded-[6px] border border-[#edf0f2] bg-[#fbfcfc] p-2.5">
                  <span className="text-[7.5px] font-bold uppercase tracking-wider text-slate-500">{sector.title}</span>
                  <p className="mt-1 text-[13px] font-bold" style={{ color: sector.color }}>
                    {sector.count}
                  </p>
                  <p className="mt-0.5 text-[7px] text-slate-400 font-medium">{sector.sub}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
