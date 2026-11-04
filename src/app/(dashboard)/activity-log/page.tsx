"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { animate, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Download,
  Eye,
  FilePen,
  FilePlus2,
  History,
  LogIn,
  LogOut,
  Monitor,
  RefreshCw,
  Search,
  ShieldAlert,
  Smartphone,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Pager from "@/components/ui/Pager";
import { ApiRequestError } from "@/lib/api";
import { activityLogApi, type ActivityChange, type ActivityLogEntry, type ActivityLogFilters, type ActivityLogPage } from "@/lib/activityLogApi";
import typography from "@/app/(dashboard)/pages/PagesTypography.module.css";

/*
 * Activity Log: who signed in when, and who added, changed or deleted what in the admin panel, from which page,
 * IP and device. The backend records it all by itself (backend/src/middleware/activityLog.middleware.js); this
 * page only reads. A link can open it filtered with ?action= / ?status= / ?user= / ?module=.
 * Same look as the Contact Us Messages page: the website's navy and orange.
 */

const PAGE_SIZE = 20;
const NAVY = "#0A2B5E";
const ORANGE = "#fd6e15";

const inputClass =
  "h-[30px] w-full rounded-[5px] border border-[#e5e6e2] bg-white px-[9px] text-[9.5px] font-medium text-[#414b5e] outline-none placeholder:text-[#9aa0aa] focus:border-[#134698]";
const selectClass =
  "h-[30px] max-w-[170px] cursor-pointer appearance-none truncate rounded-[5px] border border-[#e5e6e2] bg-white pl-[9px] pr-[24px] text-[9.5px] font-medium text-[#414b5e] outline-none focus:border-[#134698]";
const th = "px-[10px] py-[6px] whitespace-nowrap text-[7.5px] font-bold uppercase tracking-wide text-white";

const ACTION_STYLE: Record<string, { tone: string; icon: LucideIcon; label: string }> = {
  Login: { tone: "border-indigo-200 bg-indigo-50 text-indigo-700", icon: LogIn, label: "Login" },
  Logout: { tone: "border-slate-200 bg-slate-50 text-slate-600", icon: LogOut, label: "Logout" },
  Created: { tone: "border-emerald-200 bg-emerald-50 text-emerald-700", icon: FilePlus2, label: "Created" },
  Updated: { tone: "border-sky-200 bg-sky-50 text-sky-700", icon: FilePen, label: "Updated" },
  Deleted: { tone: "border-rose-200 bg-rose-50 text-rose-700", icon: Trash2, label: "Deleted" },
};
const actionStyle = (action: string) => ACTION_STYLE[action] ?? { tone: "border-amber-200 bg-amber-50 text-amber-700", icon: Activity, label: action };

const toneClass = {
  navy: "bg-[#eef3fb] text-[#0A2B5E] ring-[#c3d3ee]",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  blue: "bg-sky-50 text-sky-700 ring-sky-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
} as const;

/** 08 Oct 2026, 12:18 PM */
const formatWhen = (iso: string) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${date}, ${time}`;
};
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

/** "just now", "12 min ago", "3 hr ago", "2 days ago" */
const timeAgo = (iso: string) => {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
};

/** "Chrome · Windows" from the browser's user agent */
const deviceOf = (ua?: string) => {
  if (!ua) return { label: "", mobile: false };
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Browser";
  const system = /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iPhone" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "";
  return { label: system ? `${browser} · ${system}` : browser, mobile: /Android|iPhone|iPad|Mobile/.test(ua) };
};

const initials = (name: string) =>
  name
    .split(/[\s._@-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

// Each person keeps the same avatar colour
const AVATAR_COLOURS = ["#0A2B5E", "#134698", "#fd6e15", "#0f766e", "#7c3aed", "#be123c", "#b45309", "#0369a1"];
const avatarColour = (name: string) => AVATAR_COLOURS[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % AVATAR_COLOURS.length];

const errorText = (err: unknown) => (err instanceof ApiRequestError ? err.message : "Could not load the activity log.");
const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const controls = animate(from.current, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => {
        from.current = v;
        setDisplay(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [value]);
  return <>{display.toLocaleString("en-IN")}</>;
}

function FilterSelect({ value, onChange, label, children }: { value: string; onChange: (v: string) => void; label: string; children: React.ReactNode }) {
  return (
    <div className="relative shrink-0">
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className={selectClass}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-[7px] top-1/2 h-[11px] w-[11px] -translate-y-1/2 text-[#64748b]" />
    </div>
  );
}

function Avatar({ name, size = 26 }: { name: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold text-white shadow-xs"
      style={{ width: size, height: size, background: avatarColour(name), fontSize: size * 0.36 }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

function ActionBadge({ action }: { action: string }) {
  const style = actionStyle(action);
  const Icon = style.icon;
  return (
    <span className={`inline-flex h-[20px] items-center gap-[4px] whitespace-nowrap rounded-[4px] border px-[7px] text-[7.5px] font-bold ${style.tone}`}>
      <Icon className="h-[10px] w-[10px]" />
      {style.label}
    </span>
  );
}

/* ── What changed: old → new values of each record the action touched ── */

// "homeSection" → "Home Section", "seo_title" → "Seo Title"
// A path like "faqs › <question> › answer" keeps the question as it was written; only field names are tidied
const tidyName = (key: string) =>
  /\s/.test(key)
    ? key
    : key
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .trim()
        .replace(/^\w/, (c) => c.toUpperCase());
const fieldLabel = (key: string) => key.split(" › ").map(tidyName).join(" › ");

/** A stored value as readable text */
const showValue = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "(empty)";
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (Array.isArray(value) && value.every((item) => typeof item !== "object" || item === null)) return value.length ? value.join(", ") : "(empty list)";
  return JSON.stringify(value, null, 2);
};

const OPERATION_STYLE: Record<ActivityChange["operation"], { label: string; tone: string }> = {
  created: { label: "Added", tone: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  updated: { label: "Updated", tone: "border-sky-200 bg-sky-50 text-sky-700" },
  deleted: { label: "Deleted", tone: "border-rose-200 bg-rose-50 text-rose-700" },
};

const changedFields = (change: ActivityChange) => [...new Set([...Object.keys(change.before ?? {}), ...Object.keys(change.after ?? {})])].filter((key) => key !== "_id");

function ChangesView({ changes }: { changes: ActivityChange[] }) {
  if (!changes.length) {
    return (
      <p className="rounded-[4px] border border-dashed border-[#d8dce2] px-3 py-2 text-[10.5px] text-[#64748b]">
        No field changes were recorded for this action. (Changes are recorded from now on; older entries and logins have none.)
      </p>
    );
  }
  return (
    <div className="space-y-2.5">
      <p className="text-[9px] font-bold uppercase tracking-wide" style={{ color: NAVY }}>
        What changed
      </p>
      {changes.map((change, i) => {
        const keys = changedFields(change);
        const style = OPERATION_STYLE[change.operation] ?? OPERATION_STYLE.updated;
        const showOld = change.operation !== "created";
        const showNew = change.operation !== "deleted";
        return (
          <div key={`${change.entityId}-${i}`} className="overflow-hidden rounded-[6px] border border-[#e4e7eb]">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#e4e7eb] bg-[#f3f7fd] px-3 py-1.5">
              <span className={`rounded-[4px] border px-1.5 py-0.5 text-[9px] font-bold ${style.tone}`}>{style.label}</span>
              <span className="text-[11px] font-bold" style={{ color: NAVY }}>
                {fieldLabel(change.entity)}
              </span>
              <span className="text-[9.5px] font-medium text-[#64748b]">
                · {keys.length} field{keys.length === 1 ? "" : "s"}
              </span>
              {change.entityId && <span className="ml-auto font-mono text-[9px] text-[#94a3b8]">#{change.entityId.slice(-8)}</span>}
            </div>
            <div className="max-h-[340px] overflow-auto">
              <table className="w-full table-fixed border-collapse text-left text-[10.5px]">
                <thead>
                  <tr className="text-[8.5px] uppercase tracking-wide text-white" style={{ background: NAVY }}>
                    <th className="w-[24%] px-3 py-1.5 font-semibold">Field</th>
                    {showOld && <th className="px-3 py-1.5 font-semibold">{change.operation === "deleted" ? "Value (deleted)" : "Old value"}</th>}
                    {showNew && <th className="px-3 py-1.5 font-semibold">{change.operation === "created" ? "Value" : "New value"}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {keys.map((key) => (
                    <tr key={key} className="align-top">
                      <td className="px-3 py-1.5 font-semibold text-[#334155]">{fieldLabel(key)}</td>
                      {showOld && <td className="whitespace-pre-wrap break-words bg-rose-50/50 px-3 py-1.5 text-[#9f1239]">{showValue(change.before?.[key])}</td>}
                      {showNew && <td className="whitespace-pre-wrap break-words bg-emerald-50/50 px-3 py-1.5 text-[#166534]">{showValue(change.after?.[key])}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="min-w-0 rounded-[4px] border border-[#e4e7eb] bg-[#f8fafc] px-2.5 py-1.5">
      <p className="text-[8.5px] font-semibold uppercase tracking-wide text-[#94a3b8]">{label}</p>
      <p className="break-words text-[11px] font-medium text-[#1e293b]">{value === undefined || value === "" ? "—" : value}</p>
    </div>
  );
}

interface StatCard {
  title: string;
  value: number;
  icon: LucideIcon;
  tone: keyof typeof toneClass;
  gradient: string;
  borderColor: string;
  numColor: string;
  footer: string;
  onClick: () => void;
}

type TabKey = "all" | "Login" | "Created" | "Updated" | "Deleted" | "failed";

function ActivityLogView({ initial }: { initial: ActivityLogFilters }) {
  const [filters, setFilters] = useState<ActivityLogFilters>(initial);
  const [searchInput, setSearchInput] = useState(initial.q ?? "");
  const [page, setPage] = useState(1);
  const [reloadTick, setReloadTick] = useState(0);
  const [data, setData] = useState<ActivityLogPage | null>(null);
  const [loadedKey, setLoadedKey] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<ActivityLogEntry | null>(null);
  const [exporting, setExporting] = useState(false);

  const requestKey = JSON.stringify({ filters, page, reloadTick });
  const loading = loadedKey !== requestKey;

  // Search waits for a pause in typing
  useEffect(() => {
    const id = setTimeout(() => {
      const q = searchInput.trim();
      if ((filters.q ?? "") === q) return;
      setFilters((f) => ({ ...f, q }));
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput, filters.q]);

  useEffect(() => {
    let cancelled = false;
    activityLogApi
      .list({ ...filters, page, limit: PAGE_SIZE })
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setError("");
      })
      .catch((err) => !cancelled && setError(errorText(err)))
      .finally(() => !cancelled && setLoadedKey(requestKey));
    return () => {
      cancelled = true;
    };
  }, [filters, page, requestKey]);

  const setFilter = (key: keyof ActivityLogFilters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value || undefined }));
    setPage(1);
  };
  const showOnly = (next: ActivityLogFilters) => {
    setFilters({ ...next, q: filters.q });
    setPage(1);
  };
  const clearAll = () => {
    setFilters({});
    setSearchInput("");
    setPage(1);
  };
  const hasFilters = Object.values(filters).some(Boolean);

  const tab: TabKey = filters.status === "Failed" ? "failed" : ((["Created", "Updated", "Deleted", "Login"].includes(filters.action ?? "") ? filters.action : "all") as TabKey);
  const openTab = (key: TabKey) => {
    setFilters((f) => ({
      ...f,
      action: key === "all" || key === "failed" ? undefined : key,
      status: key === "failed" ? "Failed" : undefined,
    }));
    setPage(1);
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const all = await activityLogApi.list({ ...filters, page: 1, limit: 5000 });
      const header = ["Date & Time", "User", "Email", "Role", "Action", "Module", "Details", "Admin Page", "IP Address", "Device", "Status"];
      const rows = (all.items ?? []).map((l) => [formatWhen(l.createdAt), l.userName, l.userEmail, l.userRole, l.action, l.module, l.details, l.url, l.ip, deviceOf(l.userAgent).label, l.status]);
      const csv = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
      const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `activity-log-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setExporting(false);
    }
  };

  const stats = data?.stats;
  const items = Array.isArray(data?.items) ? data.items : [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;
  const first = (page - 1) * PAGE_SIZE;

  const statCards: StatCard[] = [
    {
      title: "TOTAL ACTIVITY",
      value: stats?.total ?? 0,
      icon: Activity,
      tone: "navy",
      gradient: "linear-gradient(135deg, #f3f7fd 0%, #d9e5f7 100%)",
      borderColor: "#c3d3ee",
      numColor: NAVY,
      footer: `${stats?.today ?? 0} today · View all`,
      onClick: clearAll,
    },
    {
      title: "LOGINS",
      value: stats?.logins ?? 0,
      icon: LogIn,
      tone: "indigo",
      gradient: "linear-gradient(135deg, #f3f4ff 0%, #dcdffd 100%)",
      borderColor: "#c7cbf8",
      numColor: "#4338ca",
      footer: `${stats?.activeUsersToday ?? 0} active today`,
      onClick: () => showOnly({ action: "Login" }),
    },
    {
      title: "CREATED",
      value: stats?.created ?? 0,
      icon: FilePlus2,
      tone: "emerald",
      gradient: "linear-gradient(135deg, #effdf5 0%, #c9f3dc 100%)",
      borderColor: "#a7e9c4",
      numColor: "#15803d",
      footer: "Records added",
      onClick: () => showOnly({ action: "Created" }),
    },
    {
      title: "UPDATED",
      value: stats?.updated ?? 0,
      icon: FilePen,
      tone: "blue",
      gradient: "linear-gradient(135deg, #f0f9ff 0%, #cdeafd 100%)",
      borderColor: "#a9dcfb",
      numColor: "#0369a1",
      footer: "Records edited",
      onClick: () => showOnly({ action: "Updated" }),
    },
    {
      title: "DELETED",
      value: stats?.deleted ?? 0,
      icon: Trash2,
      tone: "amber",
      gradient: "linear-gradient(135deg, #fff4ea 0%, #ffdcbf 100%)",
      borderColor: "#fdc89c",
      numColor: "#c2410c",
      footer: "Records removed",
      onClick: () => showOnly({ action: "Deleted" }),
    },
    {
      title: "FAILED",
      value: stats?.failed ?? 0,
      icon: ShieldAlert,
      tone: "rose",
      gradient: "linear-gradient(135deg, #fff1f3 0%, #ffd3da 100%)",
      borderColor: "#fdb5c1",
      numColor: "#be123c",
      footer: "Wrong logins & errors",
      onClick: () => showOnly({ status: "Failed" }),
    },
  ];

  const tabs: [TabKey, string, number | undefined][] = [
    ["all", "All Activity", stats?.total],
    ["Login", "Logins", stats?.logins],
    ["Created", "Created", stats?.created],
    ["Updated", "Updated", stats?.updated],
    ["Deleted", "Deleted", stats?.deleted],
    ["failed", "Failed", stats?.failed],
  ];

  const selectedDevice = deviceOf(selected?.userAgent);

  return (
    <div className={`${typography.pages} min-h-[calc(100vh-100px)] w-full bg-white text-[#18233b]`}>
      <div className="flex min-h-full flex-col px-[18px] pb-[16px] pt-[14px]">
        {/* HEADER */}
        <div className="mb-[14px] flex flex-wrap items-end justify-between gap-[10px] border-b-[2px] border-[#293681] pb-[10px]">
          <div>
            <h1 className="text-[19px] font-bold leading-[1.15] tracking-[-0.018em]" style={{ color: NAVY }}>
              Activity Log
            </h1>
            <p className="mt-0.5 text-[9px] font-medium text-black">Who signed in and when, and who added, edited or deleted what in the admin panel, with the page, IP address and device.</p>
          </div>
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={() => setReloadTick((n) => n + 1)}
              className="flex h-[30px] items-center gap-[5px] whitespace-nowrap rounded-[5px] border border-[#d8dce2] bg-white px-[10px] text-[9.5px] font-semibold text-[#334155] transition hover:bg-slate-50"
            >
              <RefreshCw className={`h-[11px] w-[11px] ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={exporting || total === 0}
              className="flex h-[30px] items-center gap-[5px] whitespace-nowrap rounded-[5px] px-[12px] text-[9.5px] font-semibold text-white shadow-[0_2px_6px_rgba(253,110,21,0.25)] transition hover:brightness-95 disabled:opacity-40"
              style={{ background: ORANGE }}
            >
              <Download className="h-[11px] w-[11px]" /> {exporting ? "Exporting…" : "Export CSV"}
            </button>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="mb-[12px] grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
          {statCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                className="relative flex h-[82px] flex-col overflow-hidden rounded-[10px] border bg-white p-1.5 !pb-4.5 transition-all hover:translate-y-[-1px]"
                style={{ background: item.gradient, borderColor: item.borderColor, boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px" }}
              >
                <div className="flex items-start gap-1.5">
                  <div className={`grid h-[24px] w-[24px] shrink-0 place-items-center rounded-full bg-white/80 shadow-xs ring-1 ${toneClass[item.tone]}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[7px] tracking-[0.01em]" style={{ fontWeight: 600, color: "#0f172a" }}>
                      {item.title}
                    </p>
                    <span className="mt-1 block text-[16px] leading-none tracking-[-0.04em]" style={{ color: item.numColor, fontWeight: 600 }}>
                      {stats ? <CountUp value={item.value} /> : "–"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={item.onClick}
                  className="absolute bottom-1 left-1.5 right-1.5 flex cursor-pointer items-center justify-center gap-1 text-[7px] font-semibold text-[#293957] transition hover:text-[#fd6e15]"
                >
                  {item.footer}
                  <ArrowRight className="h-2.5 w-2.5" />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* TABLE CARD */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[7px] border border-[#e8e5df] bg-white">
          {/* TABS */}
          <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[4px] border-b border-[#e8e5df] px-[16px] pt-[11px]">
            {tabs.map(([key, label, count]) => (
              <button
                key={key}
                type="button"
                onClick={() => openTab(key)}
                className={`relative pb-[9px] text-[10px] font-bold transition-colors ${tab === key ? "" : "text-[#6c7587] hover:text-[#18233b]"}`}
                style={tab === key ? { color: NAVY } : undefined}
              >
                {label} ({count ?? 0})
                {tab === key && <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full" style={{ background: ORANGE }} />}
              </button>
            ))}
          </div>

          {/* FILTER BAR */}
          <div className="flex items-center gap-[8px] overflow-x-auto border-b border-[#f0f0ec] px-[16px] py-[10px]">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-[9px] top-1/2 h-[12px] w-[12px] -translate-y-1/2 text-[#9aa0aa]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by user, email, module, details, page or IP..."
                className={`${inputClass} pl-[26px]`}
              />
            </div>
            <FilterSelect label="User" value={filters.user ?? ""} onChange={(v) => setFilter("user", v)}>
              <option value="">All users</option>
              {data?.filters?.users?.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Module" value={filters.module ?? ""} onChange={(v) => setFilter("module", v)}>
              <option value="">All modules</option>
              {data?.filters?.modules?.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </FilterSelect>
            <div className="flex h-[30px] shrink-0 items-center gap-[4px] rounded-[5px] border border-[#e5e6e2] bg-white px-[8px] text-[9.5px] font-medium text-[#414b5e] focus-within:border-[#134698]">
              <CalendarDays className="h-[12px] w-[12px] shrink-0 text-[#9aa0aa]" />
              <input type="date" value={filters.from ?? ""} max={filters.to || undefined} onChange={(e) => setFilter("from", e.target.value)} aria-label="From date" className="w-[92px] bg-transparent outline-none" />
              <span className="text-[#9aa0aa]">to</span>
              <input type="date" value={filters.to ?? ""} min={filters.from || undefined} onChange={(e) => setFilter("to", e.target.value)} aria-label="To date" className="w-[92px] bg-transparent outline-none" />
            </div>
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="flex h-[30px] shrink-0 items-center whitespace-nowrap rounded-[5px] border border-[#fdc89c] bg-[#fff4ea] px-[10px] text-[9.5px] font-semibold text-[#c2410c] transition hover:bg-[#ffe9d6]"
              >
                Clear ✕
              </button>
            )}
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] border-collapse text-left">
              <thead>
                <tr className="h-[32px] border-b border-[#e8e5df]" style={{ background: NAVY }}>
                  <th className={`${th} w-[44px] pl-[14px]`}>S.No</th>
                  <th className={`${th} w-[170px]`}>User</th>
                  <th className={`${th} w-[92px]`}>Action</th>
                  <th className={`${th} w-[130px]`}>Module</th>
                  <th className={th}>Details</th>
                  <th className={`${th} w-[150px]`}>Page &amp; IP</th>
                  <th className={`${th} w-[120px]`}>Device</th>
                  <th className={`${th} w-[72px]`}>Status</th>
                  <th className={`${th} w-[112px]`}>Date &amp; Time</th>
                  <th className={`${th} w-[56px] pr-[14px] text-right`}>View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0ec]">
                {loading && !data ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-[10px] text-[#6c7587]">
                      Loading activity…
                    </td>
                  </tr>
                ) : error && !data ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-[10px] font-semibold text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-14">
                      <div className="flex flex-col items-center text-center">
                        <span className="mb-[8px] grid h-[38px] w-[38px] place-items-center rounded-full bg-[#eef3fb]" style={{ color: NAVY }}>
                          <History className="h-[17px] w-[17px]" />
                        </span>
                        <p className="text-[11px] font-bold text-[#263148]">{hasFilters ? "No activity matches your filters" : "No activity yet"}</p>
                        <p className="mt-[3px] max-w-[360px] text-[9px] font-medium leading-snug text-[#6c7587]">
                          {hasFilters ? "Try another tab, user, module or date range." : "Every login, add, edit and delete in the admin panel will be listed here."}
                        </p>
                        {hasFilters && (
                          <button type="button" onClick={clearAll} className="mt-[8px] text-[9.5px] font-bold hover:underline" style={{ color: ORANGE }}>
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((log, index) => {
                    const device = deviceOf(log.userAgent);
                    const DeviceIcon = device.mobile ? Smartphone : Monitor;
                    return (
                      <tr key={log._id} className={`cursor-pointer align-middle transition hover:bg-[#f5f8fd] ${loading ? "opacity-60" : ""}`} onClick={() => setSelected(log)}>
                        <td className="py-[8px] pl-[14px] pr-[6px] text-[8px] font-semibold text-[#64748b]">{first + index + 1}</td>
                        <td className="px-[10px] py-[8px]">
                          <div className="flex min-w-0 items-center gap-[7px]">
                            <Avatar name={log.userName} />
                            <div className="min-w-0">
                              <span className="block truncate text-[8.5px] font-bold" style={{ color: NAVY }} title={log.userName}>
                                {log.userName}
                              </span>
                              <span className="block truncate text-[7px] font-medium text-[#9aa0aa]" title={log.userEmail}>
                                {log.userRole || log.userEmail || "Admin"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-[10px] py-[8px]">
                          <ActionBadge action={log.action} />
                        </td>
                        <td className="truncate px-[10px] py-[8px] text-[8px] font-bold text-[#334155]" title={log.module}>
                          {log.module}
                        </td>
                        <td className="max-w-0 px-[10px] py-[8px]">
                          <span className="block truncate text-[8px] font-medium text-[#334155]" title={log.details}>
                            {log.details}
                          </span>
                          {log.changes?.length ? (
                            <span className="mt-[2px] block truncate text-[7px] font-semibold text-[#c2410c]">
                              {log.changes.reduce((sum, change) => sum + changedFields(change).length, 0)} field(s) changed · click to see old → new
                            </span>
                          ) : null}
                        </td>
                        <td className="px-[10px] py-[8px]">
                          <span className="block truncate font-mono text-[7.5px] text-[#475569]" title={log.url}>
                            {log.url || "—"}
                          </span>
                          <span className="block truncate font-mono text-[7px] text-[#9aa0aa]">{log.ip || "—"}</span>
                        </td>
                        <td className="px-[10px] py-[8px]">
                          {device.label ? (
                            <span className="flex items-center gap-[4px] truncate text-[7.5px] font-medium text-[#475569]" title={log.userAgent}>
                              <DeviceIcon className="h-[10px] w-[10px] shrink-0 text-[#9aa0aa]" />
                              {device.label}
                            </span>
                          ) : (
                            <span className="text-[7.5px] text-[#9aa0aa]">—</span>
                          )}
                        </td>
                        <td className="px-[10px] py-[8px]">
                          <span
                            className={`inline-flex h-[20px] items-center rounded-[4px] border px-[6px] text-[7px] font-bold ${
                              log.status === "Failed" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {log.status === "Failed" ? "Failed" : "Success"}
                          </span>
                        </td>
                        <td className="px-[10px] py-[8px]" title={formatWhen(log.createdAt)}>
                          <span className="block truncate text-[8px] font-semibold text-[#334155]">{formatDate(log.createdAt)}</span>
                          <span className="block truncate text-[7px] font-medium text-[#9aa0aa]">
                            {formatTime(log.createdAt)} · {timeAgo(log.createdAt)}
                          </span>
                        </td>
                        <td className="py-[8px] pl-[6px] pr-[14px] text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelected(log);
                            }}
                            aria-label="View details"
                            className="ml-auto flex h-[25px] w-[25px] items-center justify-center rounded-[6px] border border-orange-400/30 bg-orange-500/10 text-orange-600 shadow-[0_2px_6px_rgba(249,115,22,0.12)] transition hover:bg-orange-500/20"
                          >
                            <Eye className="h-[12px] w-[12px]" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {error && data && <p className="border-t border-[#f0f0ec] px-[12px] py-[6px] text-[8px] font-semibold text-red-600">{error}</p>}

          {total > 0 && (
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-[#e8e5df] bg-[#fafafa] px-[12px] py-[8px] text-[8px]">
              <span className="font-semibold text-[#5f6a7c]">
                Showing {first + 1} to {Math.min(first + PAGE_SIZE, total)} of {total} activities
              </span>
              <Pager page={page} pages={pages} onPage={setPage} />
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={selected !== null} onClose={() => setSelected(null)} title="Activity Details" size="lg">
        {selected && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-[6px] border border-[#e4e7eb] bg-[#f8fafc] px-3 py-2.5">
              <Avatar name={selected.userName} size={34} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-bold" style={{ color: NAVY }}>
                  {selected.userName}
                </p>
                <p className="truncate text-[10px] text-[#64748b]">{[selected.userRole, selected.userEmail].filter(Boolean).join(" · ") || "Admin"}</p>
              </div>
              <ActionBadge action={selected.action} />
            </div>
            <p className="rounded-[4px] border border-[#e4e7eb] bg-white px-3 py-2 text-[11.5px] font-medium leading-relaxed text-[#1e293b]">{selected.details || "—"}</p>
            <ChangesView changes={selected.changes ?? []} />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <Detail label="Date & Time" value={`${formatWhen(selected.createdAt)} (${timeAgo(selected.createdAt)})`} />
              <Detail label="Module" value={selected.module} />
              <Detail label="Status" value={selected.status === "Failed" ? `Failed (${selected.statusCode})` : "Success"} />
              <Detail label="Admin Page" value={selected.url} />
              <Detail label="IP Address" value={selected.ip} />
              <Detail label="Device" value={selectedDevice.label} />
              <Detail label="Request" value={selected.method ? `${selected.method} ${selected.apiPath}` : undefined} />
              <Detail label="Record ID" value={selected.entityId} />
              <Detail label="Time Taken" value={selected.durationMs !== undefined ? `${selected.durationMs} ms` : undefined} />
            </div>
            {selected.userAgent && <Detail label="Browser (full)" value={selected.userAgent} />}
          </div>
        )}
      </Modal>
    </div>
  );
}

function ActivityLogPageInner() {
  const searchParams = useSearchParams();
  const pick = (key: string) => searchParams.get(key) ?? undefined;
  const initial: ActivityLogFilters = { action: pick("action"), status: pick("status"), user: pick("user"), module: pick("module") };
  // Remount when a link changes the query (e.g. ?action=Login)
  return <ActivityLogView key={searchParams.toString()} initial={initial} />;
}

export default function ActivityLogPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-text-secondary">Loading…</div>}>
      <ActivityLogPageInner />
    </Suspense>
  );
}
