"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import typography from "../pages/PagesTypography.module.css";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  ExternalLink,
  Eye,
  FileText,
  FolderClosed,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  projectsApi,
  type ProjectItem,
  type ProjectStatus,
  DEFAULT_PROJECT_CATEGORIES,
  DEFAULT_PROJECT_LOCATIONS,
} from "@/lib/projectsApi";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const toneClass = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  teal: "bg-teal-50 text-teal-700 ring-teal-200",
} as const;

export default function ProjectsManagementPage() {
  const router = useRouter();
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      const list = await projectsApi.list();
      setProjectsList(list);
    } catch (e) {
      console.error("Failed to load projects:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDeleteProject = async (projectId: string | number, projectTitle: string) => {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: `Are you sure you want to permanently delete "${projectTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        await projectsApi.delete(projectId);
        setProjectsList((prev) =>
          prev.filter((p) => String(p.id) !== String(projectId) && String(p._id) !== String(projectId))
        );
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Project removed successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err instanceof Error ? err.message : "Could not delete project",
        });
      }
    }
  };

  const handleResetDefaults = async () => {
    const result = await Swal.fire({
      title: "Reset to Website Defaults?",
      text: "This will restore all 9 original showcase projects from Design House India Pvt Ltd.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#134698",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Reset All",
    });

    if (result.isConfirmed) {
      const reset = await projectsApi.resetDefaults();
      setProjectsList(reset);
      Swal.fire({
        icon: "success",
        title: "Reset Successful",
        text: "Projects restored to default 9 showcase entries.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projectsList.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedLocation && p.location !== selectedLocation) return false;
      if (selectedStatus && p.status !== selectedStatus) return false;
      if (q) {
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesLoc = p.location.toLowerCase().includes(q);
        const matchesDesc = (p.description || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesLoc && !matchesDesc) return false;
      }
      return true;
    });
  }, [projectsList, searchQuery, selectedCategory, selectedLocation, selectedStatus]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = projectsList.length;
    const published = projectsList.filter((p) => p.status === "Published").length;
    const drafts = projectsList.filter((p) => p.status === "Draft").length;
    const views = projectsList.reduce((acc, p) => acc + (p.views || 0), 0);
    const uniqueCategories = new Set(projectsList.map((p) => p.category)).size;
    const uniqueLocations = new Set(projectsList.map((p) => p.location)).size;
    return { total, published, drafts, views, uniqueCategories, uniqueLocations };
  }, [projectsList]);

  const statCards = useMemo(
    () => [
      {
        title: "TOTAL PROJECTS",
        value: stats.total,
        suffix: "",
        icon: Building2,
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
        footer: "Live on /projects",
      },
      {
        title: "TOTAL VIEWS",
        value: stats.views > 0 ? stats.views : 16610,
        suffix: "+24.8%",
        icon: Eye,
        tone: "blue" as const,
        gradient: "linear-gradient(135deg, #ffffff 0%, #ffffff 42%, #bae6fd 100%)",
        borderColor: "#bae6fd",
        numColor: "#0284c7",
        footer: "Traffic on portfolio",
      },
      {
        title: "CATEGORIES",
        value: stats.uniqueCategories || 9,
        suffix: "",
        icon: FolderClosed,
        tone: "violet" as const,
        gradient: "linear-gradient(135deg, #ffffff 0%, #ffffff 42%, #ddd6fe 100%)",
        borderColor: "#ddd6fe",
        numColor: "#6d28d9",
        footer: "Corporate to Retail",
      },
      {
        title: "LOCATIONS",
        value: stats.uniqueLocations || 6,
        suffix: "",
        icon: MapPin,
        tone: "amber" as const,
        gradient: "linear-gradient(135deg, #ffffff 0%, #ffffff 42%, #fed7aa 100%)",
        borderColor: "#fed7aa",
        numColor: "#c2410c",
        footer: "Pan-India presence",
      },
    ],
    [stats]
  );

  return (
    <main
      className={`${typography.pages} h-full min-h-0 w-full overflow-y-auto overflow-x-hidden bg-[#fffefb] px-[18px] py-[14px] text-[#142347] [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300`}
    >
      <div className="min-h-full w-full">
        {/* TOP HEADING — Same style as Blogs */}
        <div className="mb-[18px] flex shrink-0 items-center justify-between border-b-[2px] border-[#293681] pb-[8px]">
          <div>
            <h1
              className="text-[19px] font-bold leading-[1.15] tracking-[-0.018em] text-[#23471d]"
              style={{ color: "#23471d" }}
            >
              Our Projects &amp; Portfolio
            </h1>
            <p className="mt-0.5 text-[9px] font-medium text-[#6c7587]">
              Super Admin — manage turnkey interior projects, exhibitions, retail showrooms &amp; kiosks.
            </p>
          </div>

          <div className="flex items-center gap-[10px]">
            <a
              href="http://localhost:3010/projects"
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
              title="Reset projects to original 9 website entries"
              className="flex h-[30px] items-center justify-center gap-[5px] rounded-[6px] border border-[#fed7aa] bg-[#fff7ed] px-[14px] text-[8.5px] font-semibold text-[#ea580c] transition hover:bg-[#ffedd5] shadow-sm"
            >
              <RotateCcw className="h-[12px] w-[12px] text-[#ea580c]" strokeWidth={1.7} />
              Reset Defaults
            </button>

            <button
              type="button"
              onClick={() => router.push("/projects/new")}
              className="flex h-[30px] items-center justify-center gap-[5px] rounded-[6px] bg-[#4B1426] px-[14px] text-[8.5px] font-semibold text-white shadow-[0_5px_12px_rgba(75,20,38,0.25)] transition hover:bg-[#3a0f1d]"
            >
              <Plus className="h-[12px] w-[12px]" strokeWidth={1.7} />
              Add New Project
            </button>
          </div>
        </div>

        {/* METRIC STATS CARDS (Matching Blogs KPI 5 Cards) */}
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
              placeholder="Search projects by title, category, or location..."
              className="h-[32px] w-full rounded-[6px] border border-[#d9dee6] bg-[#fafafa] pl-8 pr-3 text-[11px] text-[#1e293b] outline-none transition focus:border-[#134698] focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by Category"
              className="h-[32px] rounded-[6px] border border-[#d9dee6] bg-white px-2.5 text-[10.5px] font-semibold text-[#1e293b] outline-none cursor-pointer focus:border-[#134698]"
            >
              <option value="">All Categories ({DEFAULT_PROJECT_CATEGORIES.length})</option>
              {DEFAULT_PROJECT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label="Filter by Location"
              className="h-[32px] rounded-[6px] border border-[#d9dee6] bg-white px-2.5 text-[10.5px] font-semibold text-[#1e293b] outline-none cursor-pointer focus:border-[#134698]"
            >
              <option value="">All Locations ({DEFAULT_PROJECT_LOCATIONS.length})</option>
              {DEFAULT_PROJECT_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
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

            {(searchQuery || selectedCategory || selectedLocation || selectedStatus) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("");
                  setSelectedLocation("");
                  setSelectedStatus("");
                }}
                className="h-[32px] rounded-[6px] border border-red-200 bg-red-50 px-3 text-[10px] font-bold text-red-600 hover:bg-red-100 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* MAIN TWO COLUMN SECTION: RECENT PROJECTS TABLE + FEATURED SHOWCASE */}
        <div className="mt-[14px] grid items-start gap-[14px] xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.95fr)]">
          {/* DELIVERED PROJECTS TABLE */}
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
                  <Building2 className="h-[12px] w-[12px]" />
                </span>
                <h2 className="text-[10px] font-bold text-[#233D4D] uppercase tracking-wide">
                  Delivered Projects Portfolio
                </h2>
              </div>
              <button
                onClick={loadProjects}
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
                      Project Title &amp; Details
                    </th>
                    <th className="px-[12px] py-[6px] whitespace-nowrap text-[8.5px] font-bold text-white uppercase tracking-wider">
                      Location
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
                        Loading projects...
                      </td>
                    </tr>
                  ) : filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[12px] font-medium text-slate-500">
                        No projects match your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        className="transition hover:bg-slate-50/80 cursor-pointer"
                      >
                        {/* Title + Thumbnail */}
                        <td className="px-[12px] py-[8px]">
                          <div className="flex min-w-[260px] items-center gap-[10px]">
                            <div className="relative flex h-[36px] w-[54px] shrink-0 items-center justify-center rounded-[4px] border border-[#e4e7eb] bg-white p-0.5 shadow-xs overflow-hidden">
                              <img
                                src={project.image}
                                alt={project.title}
                                className="h-full w-full object-cover rounded-[3px]"
                                onError={(e) => {
                                  // Fallback to placeholder if not loaded
                                  (e.target as HTMLImageElement).src = "/newproject/p1.png";
                                }}
                              />
                            </div>
                            <div className="min-w-0 overflow-hidden">
                              <span
                                onClick={() => router.push(`/projects/new?id=${project._id || project.id}`)}
                                className="truncate text-[8.5px] font-semibold text-[#4B1426] block hover:text-[#075b33] transition"
                              >
                                {project.title}
                              </span>
                              <div className="flex items-center gap-1 mt-[2px] flex-wrap">
                                <span className="inline-block rounded-[3px] bg-[#f0f4f8] px-[5px] py-[1px] font-mono text-[7px] font-semibold text-[#233D4D]">
                                  #{String(project._id || project.id).slice(-6)}
                                </span>
                                {project.category && (
                                  <span className="inline-block rounded-[3px] bg-slate-100 border border-slate-200 text-slate-700 px-[4px] py-[1px] text-[7px] font-semibold">
                                    {project.category}
                                  </span>
                                )}
                                {project.featured && (
                                  <span className="inline-block rounded-[3px] bg-amber-100 border border-amber-300 text-amber-800 px-[4px] py-[1px] text-[7px] font-bold">
                                    ⭐ Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-[12px] py-[8px] whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[7.5px] font-medium text-slate-700">
                            <MapPin className="h-2.5 w-2.5 text-[#134698]" />
                            {project.location}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-[12px] py-[8px] whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-[4px] px-[8px] py-[2px] text-[7.5px] font-bold shadow-xs ${
                              project.status === "Published"
                                ? "bg-[#e8f5e9] text-[#23714a] border border-[#a5d6a7]"
                                : project.status === "Scheduled"
                                ? "bg-[#fef3c7] text-[#b45309] border border-[#fde68a]"
                                : "bg-[#ffebee] text-[#c62828] border border-[#ef9a9a]"
                            }`}
                          >
                            {project.status === "Scheduled" ? "⏰ Scheduled" : project.status}
                          </span>
                        </td>

                        {/* Views */}
                        <td className="px-[12px] py-[8px] whitespace-nowrap">
                          <span className="text-[8px] font-semibold text-[#293681]">
                            {project.views ? project.views.toLocaleString() : "0"}
                          </span>
                        </td>

                        {/* Updated By */}
                        <td className="px-[12px] py-[8px] whitespace-nowrap">
                          <div className="flex flex-col gap-[2px]">
                            <span className="text-[7.5px] font-semibold text-[#1e293b] leading-tight">
                              {project.dateTime || project.date || "—"}
                            </span>
                            <span className="text-[7px] font-medium text-[#075b33] flex items-center gap-[3px]">
                              <span>👤</span>
                              {project.author || "Admin"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-[12px] py-[8px] text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              title="View Project on Website"
                              onClick={() => {
                                const targetUrl = project.href.startsWith("http")
                                  ? project.href
                                  : `http://localhost:3010${project.href}`;
                                window.open(targetUrl, "_blank");
                              }}
                              className="flex h-[25px] w-[25px] items-center justify-center rounded-[6px] bg-orange-500/10 text-orange-600 backdrop-blur-md border border-orange-400/30 shadow-[0_2px_6px_rgba(249,115,22,0.12)] transition-all hover:bg-orange-500/20 hover:border-orange-400/50 hover:shadow-[0_3px_10px_rgba(249,115,22,0.25)] hover:scale-105 active:scale-95"
                            >
                              <Eye className="h-[12px] w-[12px] text-orange-600" />
                            </button>

                            <button
                              type="button"
                              title="Edit Project"
                              onClick={() => router.push(`/projects/new?id=${project._id || project.id}`)}
                              className="flex h-[25px] w-[25px] items-center justify-center rounded-[6px] bg-blue-500/10 text-blue-600 backdrop-blur-md border border-blue-400/30 shadow-[0_2px_6px_rgba(37,99,235,0.12)] transition-all hover:bg-blue-500/20 hover:border-blue-400/50 hover:shadow-[0_3px_10px_rgba(37,99,235,0.25)] hover:scale-105 active:scale-95"
                            >
                              <Pencil className="h-[12px] w-[12px] text-blue-600" />
                            </button>

                            <button
                              type="button"
                              title="Delete Project"
                              onClick={() => handleDeleteProject(project._id || project.id, project.title)}
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
                Total Projects: <strong className="font-bold text-[#1d4ed8]">{stats.total}</strong> (Showing{" "}
                {filteredProjects.length})
              </span>
              <button
                onClick={loadProjects}
                className="inline-flex items-center gap-1 font-bold text-[#075b33] hover:underline"
              >
                Refresh <ArrowRight className="h-[11px] w-[11px]" />
              </button>
            </div>
          </section>

          {/* FEATURED SPOTLIGHT SHOWCASES */}
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
                  <Sparkles className="h-[12px] w-[12px]" />
                </span>
                <h2 className="text-[10px] font-bold text-[#233D4D] uppercase tracking-wide">
                  Featured Project Showcases
                </h2>
              </div>
              <span className="text-[8px] font-bold text-amber-600">Spotlight</span>
            </div>

            {/* List */}
            <div className="divide-y divide-[#f0f0ec] px-[12px]">
              {[
                {
                  title: "Axis Business Park",
                  category: "Corporate Interior",
                  location: "Gurugram, Haryana",
                  image: "/newproject/p2.png",
                  status: "Hero Featured",
                  href: "http://localhost:3010/portfolio/interior/corporate-interior",
                },
                {
                  title: "DLF Corporate Office",
                  category: "Corporate Interiors",
                  location: "Gurugram, Haryana",
                  image: "/newproject/p3.png",
                  status: "Showcase",
                  href: "http://localhost:3010/portfolio/interior/corporate-interior",
                },
                {
                  title: "Trends – Retail Store",
                  category: "Retail Showrooms",
                  location: "Noida, Uttar Pradesh",
                  image: "/newproject/p4.png",
                  status: "Showcase",
                  href: "http://localhost:3010/portfolio/interior/retail-interior",
                },
                {
                  title: "The Palate Restaurant",
                  category: "Restaurant Interiors",
                  location: "Delhi NCR",
                  image: "/newproject/p5.png",
                  status: "Showcase",
                  href: "http://localhost:3010/portfolio/interior/restaurant-interior",
                },
              ].map((feat) => (
                <div
                  key={feat.title}
                  onClick={() => window.open(feat.href, "_blank")}
                  className="grid min-h-[54px] grid-cols-[36px_minmax(0,1fr)_auto_16px] items-center gap-[10px] py-[7px] cursor-pointer hover:bg-slate-50 transition"
                >
                  <div className="relative h-[34px] w-[34px] rounded-[6px] overflow-hidden border border-slate-200 shadow-2xs">
                    <img src={feat.image} alt={feat.title} className="h-full w-full object-cover" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[8.5px] font-semibold text-[#19274a]">
                      {feat.title}
                    </p>
                    <p className="mt-[2px] whitespace-nowrap text-[7.5px] font-medium text-[#68758d]">
                      {feat.category} • {feat.location}
                    </p>
                  </div>

                  <span
                    className={`rounded-[4px] px-[8px] py-[2px] text-[7.5px] font-bold shadow-xs ${
                      feat.status === "Hero Featured"
                        ? "bg-[#e0f2fe] text-[#0369a1] border border-[#7dd3fc]"
                        : "bg-[#e8f5e9] text-[#23714a] border border-[#a5d6a7]"
                    }`}
                  >
                    {feat.status}
                  </span>

                  <ChevronRight className="h-[12px] w-[12px] text-[#8c98a9]" />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-[#e8e5df] bg-[#fafafa] px-[12px] py-[6px]">
              <button
                onClick={() => router.push("/projects/new")}
                className="flex h-[28px] w-full items-center justify-center gap-1.5 rounded-[5px] border border-[#fed7aa] bg-[#fff7ed] text-[8.5px] font-bold text-[#ea580c] transition hover:bg-[#ffedd5] shadow-2xs"
              >
                <Plus className="h-[12px] w-[12px]" strokeWidth={1.8} />
                Add Another Project
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
                { icon: Plus, label: "Add Project", action: () => router.push("/projects/new") },
                { icon: ExternalLink, label: "Live Gallery", action: () => window.open("http://localhost:3010/projects", "_blank") },
                { icon: FolderClosed, label: "Categories", action: () => setSelectedCategory("") },
                { icon: MapPin, label: "Locations", action: () => setSelectedLocation("") },
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

          {/* PROJECT SECTOR BREAKDOWN */}
          <section
            className="flex flex-col justify-between rounded-[7px] bg-white border border-[#e8e5df] p-[14px]"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
            }}
          >
            <div className="flex items-center justify-between border-b border-[#e8e5df] pb-2">
              <h2 className="text-[10px] font-bold text-[#233D4D] uppercase tracking-wide">
                Key Sectors &amp; Impact
              </h2>
              <span className="text-[7.5px] font-semibold text-emerald-700 font-mono">Pan-India Delivery</span>
            </div>

            <div className="mt-[12px] grid grid-cols-4 gap-[12px]">
              {[
                { title: "Corporate", count: "500+ Projects", sub: "Offices & Parks", color: "#15803d" },
                { title: "Retail & Kiosk", count: "250+ Outlets", sub: "High Footfall", color: "#0f766e" },
                { title: "Exhibitions", count: "180+ Pavilions", sub: "Pragati Maidan & more", color: "#6d28d9" },
                { title: "Hospitality", count: "90+ Venues", sub: "Dining & Hotels", color: "#c2410c" },
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
