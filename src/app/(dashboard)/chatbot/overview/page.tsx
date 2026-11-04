"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Info,
  Mail,
  MessageCircleQuestion,
  MessagesSquare,
  RefreshCw,
  Settings,
  ThumbsUp,
  TrendingUp,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { chatbotApi, type ChatStats, type ChatSummary } from "@/lib/chatbotApi";
import { daysInRange, resolveRange, type RangeKey } from "@/components/chatbot/DateRangeFilter";
import { initials, pagePath, timeAgo, visitorLabel } from "@/components/chatbot/chatbotUtils";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

/*
 * Chatbot Overview — live numbers from /admin/chats/stats and /admin/chats (chats are saved
 * under the visitor's IP until the mobile number is verified). "Team Follow-up" and each
 * conversation's team status come from the Inbox & Leads workflow saved on the chats.
 *
 * Styled like the Dashboard and Blog & Awareness pages: gradient KPI cards with the shared
 * ring shadow, white panels with a #fafafa header bar (coloured icon + uppercase title) and a
 * navy table header. Text sizes use the same classes as those pages, which the layout's
 * AdminContentScale remaps (e.g. text-[8.5px] shows at 12px).
 */

const PUBLIC_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002").replace(/\/$/, "");

const RANGES = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "All Time", "Custom"] as const;
// No date inputs on this page, so "Custom" shows everything like "All Time"
const RANGE_KEY: Record<(typeof RANGES)[number], RangeKey> = {
  Today: "today",
  Yesterday: "yesterday",
  "Last 7 Days": "7d",
  "Last 30 Days": "30d",
  "All Time": "all",
  Custom: "all",
};

const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

const ExclamationIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" className={className} aria-hidden="true">
    <path d="M12 5v9M12 19h.01" />
  </svg>
);

const WhatsAppIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d={WHATSAPP_PATH} />
  </svg>
);

// ─── Cards (values come from the API) ────────────────────────────────────────

type StatCard = {
  title: string;
  value: string;
  footer: string;
  href: string;
  icon: LucideIcon | typeof WhatsAppIcon;
  tone: keyof typeof toneClass;
  gradient: string;
  borderColor: string;
  numColor: string;
};

// Icon circle colours in the Design House brand: navy, orange and blue
const toneClass = {
  navy: "bg-[#eef3fb] text-[#0A2B5E] ring-[#c9d6ec]",
  orange: "bg-[#fff4ea] text-[#e85a05] ring-[#fdc89c]",
  blue: "bg-[#eaf2fd] text-[#134698] ring-[#bcd3f3]",
} as const;

const gradientTo = (tint: string) => `linear-gradient(135deg, #ffffff 0%, #ffffff 42%, ${tint} 100%)`;

const STATS: StatCard[] = [
  { title: "TOTAL CHATS", value: "128", footer: "View chats", href: "/chatbot/conversations", icon: MessagesSquare, tone: "navy", gradient: gradientTo("#d6e2f5"), borderColor: "#c3d3ee", numColor: "#0A2B5E" },
  { title: "LEADS CAPTURED", value: "32", footer: "View leads", href: "/chatbot/leads", icon: UserRound, tone: "orange", gradient: gradientTo("#ffdcbf"), borderColor: "#fdc89c", numColor: "#e85a05" },
  { title: "QUESTIONS ASKED", value: "512", footer: "Review questions", href: "/chatbot/conversations", icon: MessageCircleQuestion, tone: "blue", gradient: gradientTo("#cfe2fb"), borderColor: "#b3cdf3", numColor: "#134698" },
  { title: "BOT REPLIES", value: "487", footer: "View replies", href: "/chatbot/conversations", icon: Bot, tone: "navy", gradient: gradientTo("#d6e2f5"), borderColor: "#c3d3ee", numColor: "#0A2B5E" },
  { title: "AVG. QUESTIONS / CHAT", value: "4.0", footer: "Chat engagement", href: "/chatbot/conversations", icon: TrendingUp, tone: "orange", gradient: gradientTo("#ffdcbf"), borderColor: "#fdc89c", numColor: "#e85a05" },
  { title: "WHATSAPP DELIVERED", value: "18", footer: "View delivery", href: "/chatbot/leads", icon: WhatsAppIcon, tone: "blue", gradient: gradientTo("#cfe2fb"), borderColor: "#b3cdf3", numColor: "#134698" },
];

const percent = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "—");

const performanceRows = (t?: ChatStats["totals"]) => {
  const answered = t ? Math.max(0, t.questions - t.unanswered) : 0;
  const rated = t ? t.feedbackYes + t.feedbackNo : 0;
  return [
  {
    label: "Answered questions",
    value: t ? `${answered} / ${t.questions}` : "—",
    icon: Check,
    iconClass: "bg-[#0A2B5E] text-white",
    extra: <span className="text-[8.5px] font-semibold text-[#68758d]">{t ? percent(answered, t.questions) : "—"}</span>,
  },
  {
    label: "Unanswered questions",
    value: t ? String(t.unanswered) : "—",
    icon: ExclamationIcon,
    iconClass: "bg-[#dc2626] text-white",
    extra: (
      <Link
        href="/chatbot/conversations"
        className="inline-flex items-center gap-1 rounded-[4px] border border-[#ef9a9a] bg-[#ffebee] px-[8px] py-[2px] text-[7.5px] font-bold text-[#c62828] shadow-xs transition hover:bg-[#ffdde2]"
      >
        Review <ArrowRight className="h-[11px] w-[11px]" />
      </Link>
    ),
  },
  {
    label: "Helpful ratings",
    value: (
      <>
        {t ? percent(t.feedbackYes, rated) : "—"}{" "}
        <span className="ml-1 text-[7.5px] font-medium text-[#68758d]">({t ? `${t.feedbackYes} / ${rated}` : "—"})</span>
      </>
    ),
    icon: ThumbsUp,
    iconClass: "bg-[#eaf2fd] text-[#134698]",
  },
  { label: "Returning visitors", value: t ? String(t.returningVisitors) : "—", icon: Users, iconClass: "bg-[#fff4ea] text-[#e85a05]" },
  { label: "Team handovers", value: t ? String(t.handovers) : "—", icon: UserRound, iconClass: "bg-[#eef3fb] text-[#0A2B5E]" },
  ];
};

const TOP_PAGE_BARS = ["bg-[#0A2B5E]", "bg-[#134698]", "bg-[#fd6e15]", "bg-[#ffa76b]"];

/** "/registration/book-a-stand" → "Book A Stand", "/" → "Home" */
const pageName = (url: string) => {
  const path = pagePath(url);
  if (path === "—") return "Unknown";
  const last = path.split("/").filter(Boolean).pop();
  return last ? last.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Home";
};

/** The team's current queue (Inbox & Leads), from /admin/chats/stats */
const followUps = (f: ChatStats["followUp"] | undefined) => [
  { label: "Unassigned chats", count: f?.unassigned, icon: Mail, iconClass: "text-[#e85a05]", countClass: "bg-[#ffebee] text-[#c62828] border-[#ef9a9a]" },
  { label: "Overdue replies", count: f?.overdue, icon: Clock3, iconClass: "text-[#e85a05]", countClass: "bg-[#ffebee] text-[#c62828] border-[#ef9a9a]" },
  { label: "Follow-ups today", count: f?.dueToday, icon: CalendarDays, iconClass: "text-[#e85a05]", countClass: "bg-[#fef3c7] text-[#b45309] border-[#fde68a]" },
  { label: "Open complaints", count: f?.openComplaints, icon: AlertTriangle, iconClass: "text-[#e85a05]", countClass: "bg-[#ffebee] text-[#c62828] border-[#ef9a9a]" },
];

/** "02 Oct 2026" */
const longDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

type Conversation = {
  id?: string;
  name: string;
  initials: string;
  avatar: string;
  returning: boolean;
  topic: string;
  outcome: { label: string; icon: LucideIcon };
  status: { label: string; className: string };
  lastActivity: string;
  action: "View" | "Review";
};

const AVATAR_CLASSES = ["bg-[#0A2B5E]", "bg-[#fd6e15]", "bg-[#134698]", "bg-[#e85a05]", "bg-[#2563eb]"];

/** One row of "Recent Conversations" from a saved chat */
const toConversation = (c: ChatSummary, returning: boolean): Conversation => {
  const name = visitorLabel(c);
  const request = c.requests?.[c.requests.length - 1];
  const unanswered = c.questionCount > 0 && c.lastMessage?.role === "user";
  const question = c.firstQuestion?.content || "";
  const topic = request
    ? request.type === "sales-callback"
      ? "Callback Request"
      : "Stall Booking"
    : question
      ? question.length > 28
        ? `${question.slice(0, 28)}…`
        : question
      : "General";
  const seed = c.lead?.phone || c._id;
  return {
    id: c._id,
    name,
    initials: initials(name),
    avatar: AVATAR_CLASSES[[...seed].reduce((h, ch) => h + ch.charCodeAt(0), 0) % AVATAR_CLASSES.length],
    returning,
    topic,
    outcome: request
      ? { label: "Team handover", icon: Bot }
      : unanswered
        ? { label: "Unanswered", icon: MessageCircleQuestion }
        : c.questionCount > 0
          ? { label: "Answered", icon: MessagesSquare }
          : { label: "Browsing", icon: MessagesSquare },
    status: c.workflow?.status
      ? c.workflow.status === "Resolved"
        ? { label: "Resolved", className: "bg-[#e8f5e9] text-[#23714a] border-[#a5d6a7]" }
        : c.workflow.followUpKind === "date" && c.workflow.followUpAt && new Date(c.workflow.followUpAt).getTime() < Date.now()
          ? { label: "Overdue", className: "bg-[#ffebee] text-[#c62828] border-[#ef9a9a]" }
          : c.workflow.assignedTo && c.workflow.assignedTo !== "Unassigned"
            ? { label: `${c.workflow.status} • ${c.workflow.assignedTo}`, className: "bg-[#e3f2fd] text-[#1565c0] border-[#90caf9]" }
            : { label: c.workflow.team ? `${c.workflow.team} • unassigned` : "Unassigned", className: "bg-[#fef3c7] text-[#b45309] border-[#fde68a]" }
      : unanswered
      ? { label: "Needs review", className: "bg-[#ffebee] text-[#c62828] border-[#ef9a9a]" }
      : c.phoneVerifiedAt
        ? { label: "Verified lead", className: "bg-[#e8f5e9] text-[#23714a] border-[#a5d6a7]" }
        : { label: "No action needed", className: "bg-[#e3f2fd] text-[#1565c0] border-[#90caf9]" },
    lastActivity: timeAgo(c.updatedAt),
    action: unanswered ? "Review" : "View",
  };
};

// ─── Page ────────────────────────────────────────────────────────────────────

// Shared with the Dashboard / Blog & Awareness pages
const RING_SHADOW = "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px";
const panel = "flex min-h-0 flex-col overflow-hidden rounded-[7px] border border-[#e8e5df] bg-white";
const rowText = "text-[8.5px] font-semibold text-[#19274a]";
const mutedText = "text-[7.5px] font-medium text-[#68758d]";

/** Panel header bar: coloured icon square + uppercase title, optional link on the right */
const PanelHeader = ({ icon: Icon, iconBg, title, sub, link }: {
  icon: LucideIcon;
  iconBg: string;
  title: ReactNode;
  sub?: ReactNode;
  link?: { href: string; label: string };
}) => (
  <div className="flex h-[38px] shrink-0 items-center justify-between gap-2 border-b border-[#e8e5df] bg-[#fafafa] px-[14px]">
    <div className="flex min-w-0 items-center gap-2">
      <span className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[4px] text-white ${iconBg}`}>
        <Icon className="h-[12px] w-[12px]" />
      </span>
      <h2 className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-[#0A2B5E]">{title}</h2>
      {sub && <span className={`min-w-0 truncate ${mutedText}`}>· {sub}</span>}
    </div>
    {link && (
      <Link href={link.href} className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[8.5px] font-bold text-[#e85a05] hover:underline">
        {link.label} <ArrowRight className="h-[11px] w-[11px]" />
      </Link>
    )}
  </div>
);

export default function ChatbotOverviewPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("Last 7 Days");
  const [reloadKey, setReloadKey] = useState(0);
  // Spinning = the numbers on screen are not for the current range / refresh yet
  const queryKey = `${range}|${reloadKey}`;
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const spin = loadedKey !== queryKey;
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [chats, setChats] = useState<ChatSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const q = resolveRange({ key: RANGE_KEY[range] });
    Promise.all([chatbotApi.stats(q), chatbotApi.list({ ...q, limit: 200 })])
      .then(([st, list]) => {
        if (cancelled) return;
        setStats(st);
        setChats(list.chats);
      })
      .catch(() => {
        if (cancelled) return;
        setStats(null);
        setChats(null);
      })
      .finally(() => !cancelled && setLoadedKey(queryKey));
    return () => {
      cancelled = true;
    };
  }, [range, queryKey]);

  const refresh = () => setReloadKey((k) => k + 1);

  const t = stats?.totals;
  const statValue: Record<string, string> = {
    "TOTAL CHATS": t ? String(t.chats) : "—",
    "LEADS CAPTURED": t ? String(t.leads) : "—",
    "QUESTIONS ASKED": t ? String(t.questions) : "—",
    "BOT REPLIES": t ? String(t.replies) : "—",
    "AVG. QUESTIONS / CHAT": t ? (t.chats ? (t.questions / t.chats).toFixed(1) : "0.0") : "—",
    "WHATSAPP DELIVERED": t ? String(t.whatsappSent) : "—",
  };

  const dailyCounts = new Map((stats?.daily || []).map((d) => [d.date, d]));
  const daily = daysInRange({ key: RANGE_KEY[range] }, stats?.daily?.[0]?.date).map((date) => ({
    day: new Date(`${date}T00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
    Chats: dailyCounts.get(date)?.chats || 0,
    Questions: dailyCounts.get(date)?.questions || 0,
  }));
  // Five ticks from 0 up to a round number above the busiest day
  const peak = Math.max(0, ...daily.map((d) => Math.max(d.Chats, d.Questions)));
  const yStep = peak <= 4 ? 1 : Math.ceil(peak / 4 / 5) * 5;
  const yTicks = [0, 1, 2, 3, 4].map((i) => i * yStep);

  const performance = performanceRows(t);

  const topPages = (stats?.topPages || []).slice(0, 4).map((p, i) => ({ page: pageName(p.pageUrl), chats: p.chats, bar: TOP_PAGE_BARS[i] }));
  const topMax = Math.max(1, ...topPages.map((p) => p.chats));

  const popular = (stats?.popularQuestions || []).slice(0, 3).map((p) => ({ q: p.question, count: p.count }));

  // "Returning" = this number started more than one chat in the loaded range
  const phoneCounts = new Map<string, number>();
  (chats || []).forEach((c) => {
    if (c.lead?.phone) phoneCounts.set(c.lead.phone, (phoneCounts.get(c.lead.phone) || 0) + 1);
  });
  const recent = chats
    ? chats.slice(0, 3).map((c) => toConversation(c, !!c.lead?.phone && (phoneCounts.get(c.lead.phone) || 0) > 1))
    : [];

  return (
    <div className="flex min-h-full w-full flex-col bg-white px-[16px] pt-[10px] text-[#0f172a]">
      {/* ── Header (as on Blog & Awareness) ── */}
      <div className="mb-[14px] flex shrink-0 flex-wrap items-center justify-between gap-3 border-b-[2px] border-[#293681] pb-[8px]">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-[10px]">
            <h1 className="text-[19px] font-bold leading-[1.15] tracking-[-0.018em] text-[#0A2B5E]" style={{ color: "#0A2B5E" }}>
              Chatbot Overview
            </h1>
            <span
              title="Live chatbot data, including the team follow-up from Inbox & Leads."
              className="inline-flex shrink-0 items-center gap-[5px] whitespace-nowrap rounded-[4px] border border-[#c9d6ec] bg-[#eef3fb] px-[8px] py-[2px] text-[7.5px] font-bold text-[#0A2B5E] shadow-xs"
            >
              <span className="h-[6px] w-[6px] rounded-full bg-[#fd6e15]" /> Live data <Info className="h-[11px] w-[11px]" />
            </span>
          </div>
          <p className="mt-0.5 truncate text-[9px] font-medium text-[#6c7587]">DH Assist — chatbot performance &amp; team follow-up</p>
        </div>

        <div className="flex shrink-0 items-center gap-[8px]">
          <div className="flex items-center gap-[2px] rounded-[6px] border border-[#e8e5df] bg-[#fafafa] p-[3px]" style={{ boxShadow: RING_SHADOW }}>
            {RANGES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`whitespace-nowrap rounded-[5px] px-[9px] py-[4px] text-[8.5px] font-semibold transition ${
                  range === r ? "bg-[#0A2B5E] text-white shadow-[0_3px_8px_rgba(10,43,94,0.25)]" : "text-[#334155] hover:bg-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={refresh}
            aria-label="Refresh"
            className="grid h-[30px] w-[30px] place-items-center rounded-[6px] border border-[#e8e5df] bg-white text-[#334155] shadow-sm transition hover:border-[#fd6e15] hover:text-[#e85a05]"
          >
            <RefreshCw className={`h-[13px] w-[13px] ${spin ? "animate-spin" : ""}`} />
          </button>
          <Link
            href="/chatbot/conversations"
            className="flex h-[30px] shrink-0 items-center justify-center gap-[5px] rounded-[6px] bg-[#fd6e15] px-[14px] text-[8.5px] font-semibold text-white shadow-[0_5px_12px_rgba(253,110,21,0.3)] transition hover:bg-[#e85a05]"
          >
            <Settings className="h-[12px] w-[12px]" strokeWidth={1.7} /> Manage Chatbot
          </Link>
        </div>
      </div>

      {/* ── Stat cards (Dashboard / Blog & Awareness KPI cards) ── */}
      <div className="grid shrink-0 grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {STATS.map((s) => {
          const Icon = s.icon;
          const isWhatsApp = s.icon === WhatsAppIcon;
          const value = statValue[s.title] ?? s.value;
          return (
            <Link
              key={s.title}
              href={s.href}
              title={s.title}
              className="group relative flex h-[98px] min-w-0 flex-col overflow-hidden rounded-[11px] border p-2 !pb-5.5 transition-all hover:translate-y-[-1px] hover:shadow-md"
              style={{ background: s.gradient, borderColor: s.borderColor, boxShadow: RING_SHADOW }}
            >
              <div className="flex items-start gap-1.5">
                <div className={`grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-white/80 shadow-xs ring-1 ${toneClass[s.tone]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[8.5px] !font-semibold tracking-[0.01em] text-slate-900" style={{ fontWeight: 600, color: "#0f172a" }}>
                    {s.title}
                  </p>
                  <div className="mt-1.5 flex items-end gap-1">
                    <span className="text-[21px] !font-semibold leading-none tracking-[-0.04em]" style={{ color: s.numColor, fontWeight: 600 }}>
                      <AnimatedCounter value={value} />
                    </span>
                    {isWhatsApp && (
                      <span className="mb-0.5 flex items-center gap-[3px] text-[9.5px] font-bold text-[#134698]">
                        <Check className="h-[11px] w-[11px]" strokeWidth={3} /> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-1 left-2 right-2 flex items-center justify-center gap-1 text-[8px] font-semibold text-[#293957] transition group-hover:text-blue-600">
                <span className="truncate">{s.footer}</span>
                <ArrowRight className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Chart + performance ── */}
      <div className="mt-[14px] grid gap-[14px] xl:h-[250px] xl:grid-cols-[1.6fr_1fr]">
        <section className={panel} style={{ boxShadow: RING_SHADOW }}>
          <PanelHeader
            icon={TrendingUp}
            iconBg="bg-[#0A2B5E]"
            title="Day-wise Activity"
            sub="New chats and questions asked per day"
          />
          <div className="flex min-h-0 flex-1 flex-col px-[14px] pb-[6px] pt-[6px]">
            <div className="flex items-center justify-end gap-[16px] text-[8.5px] font-semibold text-[#334155]">
              <span className="flex items-center gap-[6px]">
                <span className="h-[8px] w-[8px] rounded-full bg-[#134698]" /> Chats
              </span>
              <span className="flex items-center gap-[6px]">
                <span className="h-[8px] w-[8px] rounded-full bg-[#fd6e15]" /> Questions
              </span>
            </div>
            <div className="relative h-[200px] xl:h-auto xl:flex-1">
              <div className="absolute inset-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={daily} margin={{ top: 16, right: 18, left: -14, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ovQuestions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fd6e15" stopOpacity={0.28} />
                        <stop offset="100%" stopColor="#fd6e15" stopOpacity={0.04} />
                      </linearGradient>
                      <linearGradient id="ovChats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#134698" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#134698" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#eef0f2" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#475569" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} dy={6} padding={{ left: 4, right: 4 }} />
                    <YAxis domain={[0, yTicks[4]]} ticks={yTicks} tick={{ fontSize: 11, fill: "#475569" }} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                    <Area type="monotone" dataKey="Questions" stroke="#fd6e15" strokeWidth={2.2} fill="url(#ovQuestions)" dot={{ r: 4, fill: "#fd6e15", stroke: "#fff", strokeWidth: 1.5 }} isAnimationActive={false}>
                      <LabelList dataKey="Questions" position="top" offset={9} style={{ fontSize: 10.5, fill: "#e85a05" }} />
                    </Area>
                    <Area type="monotone" dataKey="Chats" stroke="#134698" strokeWidth={2.2} fill="url(#ovChats)" dot={{ r: 4, fill: "#134698", stroke: "#fff", strokeWidth: 1.5 }} isAnimationActive={false}>
                      <LabelList dataKey="Chats" position="top" offset={9} style={{ fontSize: 10.5, fill: "#0A2B5E" }} />
                    </Area>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        <section className={panel} style={{ boxShadow: RING_SHADOW }}>
          <PanelHeader icon={ThumbsUp} iconBg="bg-[#fd6e15]" title="Answer & Feedback Performance" sub={range} />
          <div className="flex flex-1 flex-col justify-between divide-y divide-[#f0f0ec] px-[12px] py-[2px]">
            {performance.map((row) => {
              const Icon = row.icon;
              return (
                <div key={row.label} className="flex min-h-[30px] flex-1 items-center gap-[10px]">
                  <span className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[6px] ${row.iconClass}`}>
                    <Icon className="h-[12px] w-[12px]" strokeWidth={2.6} />
                  </span>
                  <span className={`w-[150px] shrink-0 ${mutedText} !text-[#334155]`}>{row.label}</span>
                  <span className={`min-w-0 flex-1 ${rowText}`}>{row.value}</span>
                  {row.extra ?? <ChevronRight className="h-[12px] w-[12px] text-[#8c98a9]" />}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Top pages · popular questions · team follow-up ── */}
      <div className="mt-[14px] grid gap-[14px] lg:grid-cols-3">
        <section className={panel} style={{ boxShadow: RING_SHADOW }}>
          <PanelHeader icon={FileText} iconBg="bg-[#134698]" title="Top Pages" sub={`${t ? t.chats : "—"} chats`} />
          <div className="flex flex-1 flex-col justify-around gap-[8px] px-[14px] py-[10px]">
            <p className={mutedText}>Where visitors started chatting</p>
            {topPages.length === 0 && <p className={mutedText}>No chats in this period yet.</p>}
            {topPages.map((p) => (
              <div key={p.page} className="flex items-center gap-[12px]">
                <span className={`w-[118px] shrink-0 truncate ${rowText}`}>{p.page}</span>
                <span className="h-[7px] flex-1 overflow-hidden rounded-full bg-[#edf2f8]">
                  <span className={`block h-full rounded-full ${p.bar}`} style={{ width: `${(p.chats / topMax) * 78}%` }} />
                </span>
                <span className={`w-[26px] text-right ${rowText}`}>{p.chats}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={panel} style={{ boxShadow: RING_SHADOW }}>
          <PanelHeader
            icon={MessageCircleQuestion}
            iconBg="bg-[#fd6e15]"
            title="Popular Questions"
            link={{ href: "/chatbot/conversations", label: "Review Answers" }}
          />
          <div className="flex flex-1 flex-col justify-around divide-y divide-[#f0f0ec] px-[12px]">
            {popular.length === 0 && <p className={`py-[8px] ${mutedText}`}>No questions in this period yet.</p>}
            {popular.map((item, i) => (
              <Link
                key={item.q}
                href="/chatbot/conversations"
                className="grid min-h-[40px] grid-cols-[24px_minmax(0,1fr)_auto_14px] items-center gap-[10px] py-[6px] transition hover:bg-slate-50/80"
              >
                <span className="grid h-[24px] w-[24px] place-items-center rounded-[6px] bg-[#eef3fb] text-[8.5px] font-bold text-[#0A2B5E] ring-1 ring-[#c9d6ec]/60">{i + 1}</span>
                <span className={`truncate ${rowText}`}>{item.q}</span>
                <span className="rounded-[4px] border border-[#fdc89c] bg-[#fff4ea] px-[8px] py-[2px] text-[7.5px] font-bold text-[#e85a05] shadow-xs">{item.count}</span>
                <ChevronRight className="h-[12px] w-[12px] text-[#8c98a9]" />
              </Link>
            ))}
          </div>
        </section>

        <section className={panel} style={{ boxShadow: RING_SHADOW }}>
          <PanelHeader icon={Users} iconBg="bg-[#0A2B5E]" title="Team Follow-up" link={{ href: "/chatbot/inbox", label: "Open Inbox" }} />
          <div className="flex flex-1 flex-col justify-around divide-y divide-[#f0f0ec] px-[12px]">
            {followUps(stats?.followUp).map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.label}
                  href="/chatbot/inbox"
                  className="grid min-h-[34px] grid-cols-[24px_minmax(0,1fr)_auto_14px] items-center gap-[10px] py-[4px] transition hover:bg-slate-50/80"
                >
                  <span className="grid h-[24px] w-[24px] place-items-center rounded-[6px] bg-[#fff4ea] ring-1 ring-[#fdc89c]/60">
                    <Icon className={`h-[13px] w-[13px] ${f.iconClass}`} />
                  </span>
                  <span className={rowText}>{f.label}</span>
                  <span className={`grid h-[18px] min-w-[22px] place-items-center rounded-[4px] border px-[6px] text-[7.5px] font-bold shadow-xs ${f.countClass}`}>
                    {f.count ?? "–"}
                  </span>
                  <ChevronRight className="h-[12px] w-[12px] text-[#8c98a9]" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Recent conversations (navy table header, as on Blog & Awareness) ── */}
      <section className={`${panel} mt-[14px] shrink-0`} style={{ boxShadow: RING_SHADOW }}>
        <PanelHeader
          icon={MessagesSquare}
          iconBg="bg-[#134698]"
          title="Recent Conversations"
          sub="Latest visitor conversations and their status"
          link={{ href: "/chatbot/conversations", label: "View all" }}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="h-[32px] border-b border-[#e8e5df] bg-[#0A2B5E]">
                {["Visitor", "Type", "Topic", "Bot Outcome", "Team Status", "Last Activity", "Action"].map((h, i, all) => (
                  <th
                    key={h}
                    className={`whitespace-nowrap px-[12px] py-[6px] text-[8.5px] font-bold uppercase tracking-wider text-white ${i === all.length - 1 ? "text-right" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0ec]">
              {!spin && recent.length === 0 && (
                <tr>
                  <td colSpan={7} className={`px-[12px] py-[10px] ${mutedText}`}>
                    {chats ? "No conversations in this period yet." : "Could not load conversations. Try Refresh."}
                  </td>
                </tr>
              )}
              {recent.map((c) => {
                const Outcome = c.outcome.icon;
                return (
                  <tr key={c.id || c.name} className="transition hover:bg-slate-50/80">
                    <td className="px-[12px] py-[8px]">
                      <span className="flex min-w-0 items-center gap-[10px]">
                        <span className={`grid h-[28px] w-[28px] shrink-0 place-items-center rounded-full text-[7.5px] font-bold text-white ${c.avatar}`}>{c.initials}</span>
                        <span className="min-w-0 leading-tight">
                          <span className={`block truncate ${rowText}`}>{c.name}</span>
                          <span className={`block truncate ${mutedText}`}>{c.returning ? "Returning Visitor" : "New Visitor"}</span>
                        </span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-[12px] py-[8px]">
                      <span
                        className={`inline-flex rounded-[4px] border px-[8px] py-[2px] text-[7.5px] font-bold shadow-xs ${
                          c.returning ? "border-[#fdc89c] bg-[#fff4ea] text-[#e85a05]" : "border-[#c9d6ec] bg-[#eef3fb] text-[#0A2B5E]"
                        }`}
                      >
                        {c.returning ? "Returning" : "New"}
                      </span>
                    </td>
                    <td className={`px-[12px] py-[8px] ${rowText}`}>{c.topic}</td>
                    <td className="px-[12px] py-[8px]">
                      <span className={`flex items-center gap-[8px] ${rowText}`}>
                        <Outcome className="h-[14px] w-[14px] text-[#fd6e15]" /> {c.outcome.label}
                      </span>
                    </td>
                    <td className="px-[12px] py-[8px]">
                      <span className={`inline-flex rounded-[4px] border px-[8px] py-[2px] text-[7.5px] font-bold shadow-xs ${c.status.className}`}>
                        {c.status.label}
                      </span>
                    </td>
                    <td className={`whitespace-nowrap px-[12px] py-[8px] ${mutedText}`}>{c.lastActivity}</td>
                    <td className="px-[12px] py-[8px] text-right">
                      <Link
                        href={c.id ? `/chatbot/conversations?id=${c.id}` : "/chatbot/conversations"}
                        className={`inline-flex h-[25px] min-w-[52px] items-center justify-center rounded-[6px] border px-[10px] text-[8.5px] font-semibold shadow-[0_2px_6px_rgba(15,23,42,0.06)] transition ${
                          c.action === "Review"
                            ? "border-red-400/30 bg-red-500/10 text-red-600 hover:bg-red-500/15"
                            : "border-[#134698]/30 bg-[#134698]/10 text-[#134698] hover:bg-[#134698]/15"
                        }`}
                      >
                        {c.action}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Status bar ── */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 pb-[8px] pt-[10px]">
        <div className="flex flex-wrap items-center gap-[12px]">
          <span className="flex items-center gap-[7px] text-[8.5px] font-bold text-[#0A2B5E]">
            <span className="h-[8px] w-[8px] rounded-full bg-[#22a447]" /> DH Assist Active
          </span>
          <span className="h-[14px] w-px bg-[#cbd5e1]" />
          <span className={mutedText}>
            Last content update: <span className="font-semibold text-[#19274a]">{stats?.contentUpdatedAt ? longDate(stats.contentUpdatedAt) : "Not published yet"}</span>
          </span>
          <span className="h-[14px] w-px bg-[#cbd5e1]" />
          <a href={PUBLIC_SITE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-[4px] text-[8.5px] font-bold text-[#e85a05] hover:underline">
            Preview Chatbot <ArrowUpRight className="h-[11px] w-[11px]" />
          </a>
        </div>
        <span className={mutedText}>All figures are live.</span>
      </div>
    </div>
  );
}
