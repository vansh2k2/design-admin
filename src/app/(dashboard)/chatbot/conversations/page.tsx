"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  CalendarClock,
  Check,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  Inbox,
  Loader2,
  Mail,
  MessageCircleQuestion,
  MessagesSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";
import typography from "../../pages/PagesTypography.module.css";
import DateRangeFilter, { rangeLabel, resolveRange, type DateRange } from "@/components/chatbot/DateRangeFilter";
import {
  avatarColor,
  dayLabel,
  formatDateTime,
  formatTime,
  initials,
  MessageText,
  pagePath,
  timeAgo,
  whatsappLink, visitorLabel } from "@/components/chatbot/chatbotUtils";
import { chatbotApi, type ChatDetail, type ChatSummary } from "@/lib/chatbotApi";

const PAGE_SIZE = 30;

export default function ChatbotConversationsPage() {
  return (
    <Suspense fallback={null}>
      <Conversations />
    </Suspense>
  );
}

function Conversations() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  const [range, setRange] = useState<DateRange>({ key: "all" });
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  // When the list was loaded: a chat updated within 15 minutes of it shows the green "online" dot
  const [listAt, setListAt] = useState(0);

  const [loadedDetail, setLoadedDetail] = useState<{ key: string; chat: ChatDetail | null } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Loading = the list on screen is not for the current filter / page yet
  const listKey = JSON.stringify([range, debounced, page, reloadKey]);
  const [loadedListKey, setLoadedListKey] = useState<string | null>(null);
  const loading = loadedListKey !== listKey;

  // Conversation list (first page replaces, "Load more" appends)
  useEffect(() => {
    let cancelled = false;
    chatbotApi
      .list({ ...resolveRange(range), search: debounced, page, limit: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setChats((prev) => (page === 1 ? res.chats : [...prev, ...res.chats]));
        setTotal(res.total);
        setListAt(Date.now());
        setError(null);
      })
      .catch((e: Error) => !cancelled && setError(e.message || "Could not load conversations"))
      .finally(() => !cancelled && setLoadedListKey(listKey));
    return () => {
      cancelled = true;
    };
  }, [range, debounced, page, listKey]);

  // Selected conversation
  const detailKey = selectedId ? `${selectedId}:${reloadKey}` : null;
  useEffect(() => {
    if (!selectedId || !detailKey) return;
    let cancelled = false;
    chatbotApi
      .get(selectedId)
      .then((d) => !cancelled && setLoadedDetail({ key: detailKey, chat: d }))
      .catch(() => !cancelled && setLoadedDetail({ key: detailKey, chat: null }));
    return () => {
      cancelled = true;
    };
  }, [selectedId, detailKey]);

  // Keep showing the current chat while it refreshes; switch only once the new one arrives
  const detailLoading = !!detailKey && loadedDetail?.key !== detailKey;
  const detail = selectedId && loadedDetail?.chat?._id === selectedId ? loadedDetail.chat : detailLoading ? null : (loadedDetail?.chat ?? null);

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [detail]);

  const resetList = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const select = (id: string | null) => router.replace(id ? `/chatbot/conversations?id=${id}` : "/chatbot/conversations", { scroll: false });

  const copy = (key: string, value?: string) => {
    if (!value) return;
    navigator.clipboard?.writeText(value).catch(() => undefined);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  // Group the transcript by day for date separators
  const groups = useMemo(() => {
    const out: { day: string; items: ChatDetail["messages"] }[] = [];
    for (const m of detail?.messages ?? []) {
      const day = new Date(m.createdAt).toDateString();
      if (!out.length || out[out.length - 1].day !== day) out.push({ day, items: [] });
      out[out.length - 1].items.push(m);
    }
    return out;
  }, [detail]);

  const questionCount = detail?.messages.filter((m) => m.role === "user").length ?? 0;

  return (
    <div className={`${typography.pages} min-h-[calc(100vh-100px)] w-full bg-white text-[#18233b]`}>
      <div className="flex min-h-full flex-col px-[18px] pb-[16px] pt-[14px]">
        {/* HEADER */}
        <div className="mb-[12px] flex flex-wrap items-end justify-between gap-[10px] border-b-[2px] border-[#293681] pb-[10px]">
          <div className="flex items-center gap-[10px]">
            <div className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-gradient-to-br from-[#0A2B5E] to-[#134698] text-white shadow-[0_6px_14px_-4px_rgba(10,43,94,0.45)] ring-2 ring-[#fd6e15]/40">
              <MessagesSquare className="h-[19px] w-[19px]" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold leading-[1.15] tracking-[-0.018em] text-[#0A2B5E]">Chat Conversations</h1>
              <p className="mt-0.5 text-[9px] font-medium text-[#6c7587]">
                Every DH Assist chat with the visitor&apos;s details · <span className="font-semibold text-[#e85a05]">{rangeLabel(range)}</span> ·{" "}
                {total} {total === 1 ? "chat" : "chats"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-[8px]">
            <DateRangeFilter value={range} onChange={(r) => resetList(() => setRange(r))} />
            <button
              type="button"
              onClick={() => resetList(() => setReloadKey((k) => k + 1))}
              aria-label="Refresh"
              className="grid h-[28px] w-[28px] place-items-center rounded-[6px] border border-[#e5e6e2] text-[#4b5563] transition hover:border-[#fd6e15] hover:text-[#e85a05]"
            >
              <RefreshCw className={`h-[13px] w-[13px] ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-[10px] rounded-[7px] border border-red-200 bg-red-50 px-[12px] py-[8px] text-[10px] font-medium text-red-700">{error}</div>
        )}

        {/* TWO-PANE INBOX */}
        <div
          className="flex h-[calc(100vh-190px)] min-h-[480px] overflow-hidden rounded-[12px] border border-[#e8e5df] bg-white"
          style={{ boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px" }}
        >
          {/* LIST */}
          <aside className={`w-full shrink-0 flex-col border-r border-[#e8e5df] md:flex md:w-[320px] ${selectedId ? "hidden" : "flex"}`}>
            <div className="border-b border-[#e8e5df] bg-gradient-to-r from-[#0A2050] to-[#134698] p-[10px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-[9px] top-1/2 h-[12px] w-[12px] -translate-y-1/2 text-[#9aa0aa]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => resetList(() => setSearch(e.target.value))}
                  placeholder="Search name, phone, email or message..."
                  className="h-[32px] w-full rounded-full border border-white/20 bg-white pl-[28px] pr-[12px] text-[10px] font-medium text-[#414b5e] outline-none placeholder:text-[#9aa0aa] focus:ring-2 focus:ring-[#fd6e15]/60"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!loading && chats.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-[8px] p-[20px] text-center">
                  <Inbox className="h-[26px] w-[26px] text-[#cbd5e1]" />
                  <p className="text-[10px] font-semibold text-[#6c7587]">No conversations found</p>
                  <p className="text-[8px] text-[#9aa0aa]">Try another date range or search.</p>
                </div>
              ) : (
                chats.map((c) => {
                  const active = c._id === selectedId;
                  return (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => select(c._id)}
                      className={`flex w-full items-start gap-[10px] border-b border-[#f4f4f0] px-[12px] py-[10px] text-left transition ${
                        active ? "bg-[#fff4ea] shadow-[inset_3px_0_0_#fd6e15]" : "hover:bg-[#f4f7fb]"
                      }`}
                    >
                      <span className="relative shrink-0">
                        <span
                          className="grid h-[38px] w-[38px] place-items-center rounded-full text-[10px] font-bold text-white ring-2 ring-white shadow-sm"
                          style={{ background: avatarColor(c.lead?.phone || c._id) }}
                        >
                          {initials(visitorLabel(c))}
                        </span>
                        {/* Chatted in the last 15 minutes: shown as online */}
                        {listAt - new Date(c.updatedAt).getTime() < 15 * 60 * 1000 && (
                          <span className="absolute -bottom-px -right-px h-[11px] w-[11px] rounded-full border-2 border-white bg-[#22c55e]" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-[10px] font-bold text-[#0A2B5E]">{visitorLabel(c)}</span>
                          <span className={`shrink-0 text-[8px] ${active ? "font-semibold text-[#e85a05]" : "text-[#9aa0aa]"}`}>{timeAgo(c.updatedAt)}</span>
                        </span>
                        <span className="block truncate text-[8px] text-[#6c7587]">{c.lead?.phone || c.lead?.email || "—"}</span>
                        <span className="mt-[3px] flex items-center justify-between gap-2">
                          <span className="truncate text-[9px] text-[#4b5563]">
                            {c.lastMessage ? (
                              <>
                                {c.lastMessage.role === "assistant" && <b className="font-semibold text-[#134698]">DH Assist: </b>}
                                {c.lastMessage.content}
                              </>
                            ) : (
                              "Filled details, no question yet"
                            )}
                          </span>
                          {c.questionCount > 0 && (
                            <span className="grid h-[17px] min-w-[17px] shrink-0 place-items-center rounded-full bg-[#fd6e15] px-[5px] text-[8px] font-bold text-white shadow-[0_2px_6px_rgba(253,110,21,0.35)]">{c.questionCount}</span>
                          )}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}

              {loading && (
                <div className="flex items-center justify-center gap-2 py-[14px] text-[9px] text-[#6c7587]">
                  <Loader2 className="h-[14px] w-[14px] animate-spin" /> Loading...
                </div>
              )}
              {!loading && chats.length < total && (
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="w-full py-[10px] text-[9px] font-bold text-[#e85a05] hover:bg-[#fff4ea]"
                >
                  Load more ({total - chats.length} more)
                </button>
              )}
            </div>
          </aside>

          {/* DETAIL */}
          <section className={`min-w-0 flex-1 flex-col ${selectedId ? "flex" : "hidden md:flex"}`}>
            {!selectedId ? (
              <div className="flex h-full flex-col items-center justify-center gap-[10px] bg-[#f4f7fb] p-[24px] text-center">
                <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-white shadow-[0_8px_20px_-8px_rgba(10,43,94,0.35)] ring-2 ring-[#fd6e15]/50">
                  <Image src="/logobg.png" alt="" width={44} height={44} className="h-[42px] w-[42px] object-contain" />
                </div>
                <p className="text-[12px] font-bold text-[#0A2B5E]">Select a conversation</p>
                <p className="max-w-[280px] text-[9px] text-[#6c7587]">Choose a chat on the left to read the full conversation between the visitor and DH Assist.</p>
              </div>
            ) : detailLoading && !detail ? (
              <div className="flex h-full items-center justify-center gap-2 text-[10px] text-[#6c7587]">
                <Loader2 className="h-[16px] w-[16px] animate-spin" /> Loading conversation...
              </div>
            ) : !detail ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <p className="text-[11px] font-semibold text-[#6c7587]">Conversation not found</p>
                <button type="button" onClick={() => select(null)} className="text-[9px] font-bold text-[#e85a05] hover:underline">
                  Back to list
                </button>
              </div>
            ) : (
              <>
                {/* Visitor header */}
                <div className="border-b-[3px] border-[#fd6e15] bg-gradient-to-r from-[#0A2050] via-[#0F2F6B] to-[#134698] px-[14px] py-[10px] text-white">
                  <div className="flex flex-wrap items-center gap-[10px]">
                    <button
                      type="button"
                      onClick={() => select(null)}
                      aria-label="Back to list"
                      className="grid h-[28px] w-[28px] place-items-center rounded-full text-white hover:bg-white/15 md:hidden"
                    >
                      <ArrowLeft className="h-[15px] w-[15px]" />
                    </button>
                    <span
                      className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full text-[12px] font-bold text-white ring-2 ring-[#fd6e15]/70"
                      style={{ background: avatarColor(detail.lead?.phone || detail._id) }}
                    >
                      {initials(visitorLabel(detail))}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-bold text-white">{visitorLabel(detail)}</p>
                      <div className="mt-[2px] flex flex-wrap items-center gap-x-[12px] gap-y-[2px] text-[9px] text-white/80">
                        {detail.lead?.phone && (
                          <button type="button" onClick={() => copy("phone", detail.lead?.phone)} className="flex items-center gap-[4px] hover:text-white">
                            <Phone className="h-[11px] w-[11px]" /> {detail.lead.phone}
                            {copied === "phone" ? <Check className="h-[10px] w-[10px] text-[#86efac]" /> : <Copy className="h-[10px] w-[10px] text-white/60" />}
                          </button>
                        )}
                        {detail.lead?.email && (
                          <button type="button" onClick={() => copy("email", detail.lead?.email)} className="flex items-center gap-[4px] hover:text-white">
                            <Mail className="h-[11px] w-[11px]" /> {detail.lead.email}
                            {copied === "email" ? <Check className="h-[10px] w-[10px] text-[#86efac]" /> : <Copy className="h-[10px] w-[10px] text-white/60" />}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      {detail.lead?.phone && (
                        <>
                          <a
                            href={`tel:${detail.lead.phone}`}
                            className="flex h-[30px] items-center gap-[5px] rounded-full bg-[#fd6e15] px-[12px] text-[9px] font-bold text-white shadow-[0_4px_10px_rgba(253,110,21,0.35)] transition hover:bg-[#e85a05]"
                          >
                            <Phone className="h-[12px] w-[12px]" /> Call
                          </a>
                          <a
                            href={whatsappLink(detail.lead.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-[30px] items-center gap-[5px] rounded-full bg-[#25D366] px-[12px] text-[9px] font-bold text-white transition hover:brightness-105"
                          >
                            <Send className="h-[12px] w-[12px]" /> WhatsApp
                          </a>
                        </>
                      )}
                      {detail.lead?.email && (
                        <a
                          href={`mailto:${detail.lead.email}`}
                          className="flex h-[30px] items-center gap-[5px] rounded-full border border-white/40 bg-white/10 px-[12px] text-[9px] font-bold text-white transition hover:bg-white/20"
                        >
                          <Mail className="h-[12px] w-[12px]" /> Email
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Info chips */}
                  <div className="mt-[8px] flex flex-wrap gap-[6px]">
                    <InfoChip icon={<CalendarClock className="h-[11px] w-[11px]" />} text={`Started ${formatDateTime(detail.createdAt)}`} />
                    <InfoChip icon={<MessageCircleQuestion className="h-[11px] w-[11px]" />} text={`${questionCount} ${questionCount === 1 ? "question" : "questions"}`} />
                    {detail.visitor?.ip && <InfoChip icon={<Globe className="h-[11px] w-[11px]" />} text={`IP ${detail.visitor.ip}`} />}
                    {detail.blocked && <InfoChip icon={<Ban className="h-[11px] w-[11px]" />} text="Blocked for abusive language" tone="red" />}
                    {detail.pageUrl && (
                      <a href={detail.pageUrl} target="_blank" rel="noopener noreferrer">
                        <InfoChip icon={<FileText className="h-[11px] w-[11px]" />} text={pagePath(detail.pageUrl)} trailing={<ExternalLink className="h-[9px] w-[9px]" />} />
                      </a>
                    )}
                    <InfoChip
                      icon={<Send className="h-[11px] w-[11px]" />}
                      text={detail.whatsappSentAt ? `WhatsApp sent ${timeAgo(detail.whatsappSentAt)}` : "WhatsApp not sent"}
                      tone={detail.whatsappSentAt ? "green" : "grey"}
                    />
                    {detail.enquiryId && (
                      <Link href="/contact-us">
                        <InfoChip icon={<Inbox className="h-[11px] w-[11px]" />} text="Saved in Contact Us" tone="green" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Transcript */}
                <div
                  ref={transcriptRef}
                  className="flex-1 overflow-y-auto bg-[#f4f7fb] bg-[radial-gradient(#d9e2ef_1px,transparent_1px)] bg-[size:18px_18px] px-[14px] py-[12px]"
                >
                  {detail.messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <p className="rounded-full bg-white px-[12px] py-[6px] text-[9px] font-medium text-[#6c7587] shadow-sm">
                        Visitor filled their details but hasn&apos;t asked anything yet.
                      </p>
                    </div>
                  ) : (
                    groups.map((g) => (
                      <div key={g.day} className="flex flex-col gap-[8px]">
                        <div className="my-[6px] flex justify-center">
                          <span className="rounded-full bg-[#0A2B5E] px-[10px] py-[3px] text-[8px] font-bold uppercase tracking-wide text-white shadow-sm">
                            {dayLabel(g.items[0].createdAt)}
                          </span>
                        </div>
                        {g.items.map((m, i) =>
                          m.role === "user" ? (
                            <div key={i} className="flex items-end gap-[6px]">
                              <span
                                className="grid h-[24px] w-[24px] shrink-0 place-items-center rounded-full text-[8px] font-bold text-white"
                                style={{ background: avatarColor(detail.lead?.phone || detail._id) }}
                              >
                                {initials(visitorLabel(detail))}
                              </span>
                              <div className={`max-w-[72%] rounded-[12px] rounded-bl-[3px] px-[11px] py-[7px] shadow-sm ring-1 ${m.flagged ? "bg-red-50 ring-red-200" : "bg-white ring-black/5"}`}>
                                <p className="whitespace-pre-wrap break-words text-[10px] text-[#18233b]">{m.content}</p>
                                <p className="mt-[3px] text-right text-[7px] text-[#9aa0aa]">
                                  {m.flagged && <span className="mr-[4px] font-bold text-red-600">Abusive ·</span>}
                                  {formatTime(m.createdAt)}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div key={i} className="flex items-end justify-end gap-[6px]">
                              <div className="max-w-[72%] rounded-[16px] rounded-br-[4px] bg-gradient-to-br from-[#134698] to-[#0A2B5E] px-[12px] py-[7px] text-white shadow-[0_2px_6px_rgba(10,43,94,0.25)]">
                                <div className="break-words text-[10px] leading-[1.5]">
                                  <MessageText text={m.content} linkClass="font-semibold text-[#ffd3b0] underline underline-offset-2 break-words" />
                                </div>
                                <p className="mt-[3px] text-right text-[7px] text-white/60">DH Assist · {formatTime(m.createdAt)}</p>
                              </div>
                              <span className="grid h-[26px] w-[26px] shrink-0 place-items-center overflow-hidden rounded-full bg-white p-[3px] shadow-sm ring-1 ring-[#fd6e15]/40">
                                <Image src="/logotransparent-sm.webp" alt="DH Assist" width={22} height={22} className="h-auto w-full object-contain" />
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoChip({ icon, text, trailing, tone = "grey" }: { icon: React.ReactNode; text: string; trailing?: React.ReactNode; tone?: "grey" | "green" | "red" }) {
  return (
    <span
      className={`inline-flex items-center gap-[4px] rounded-full px-[8px] py-[3px] text-[8px] font-semibold ${
        tone === "green" ? "bg-[#e8f5e9] text-[#166b40]" : tone === "red" ? "bg-red-50 text-red-700" : "bg-[#f1f5f9] text-[#475569]"
      }`}
    >
      {icon}
      {text}
      {trailing}
    </span>
  );
}
