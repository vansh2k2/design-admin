"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import {
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  Clock,
  Cpu,
  Database,
  FileText,
  FileUp,
  Globe,
  Hand,
  Headset,
  Link as LinkIcon,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Maximize,
  MessageCircle,
  Mic,
  MicOff,
  MessagesSquare,
  NotebookPen,
  PartyPopper,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  ScrollText,
  Search,
  Send,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import typography from "../../pages/PagesTypography.module.css";
import {
  chatTrainingApi,
  type ChatbotSettings,
  type ContactDetails,
  type GreetingLines,
  type KnowledgeOverview,
  type TrainingItem,
  type TrainingOverview,
  type TrainingTestReply,
} from "@/lib/chatbotApi";

/* Chatbot → AI Training. Everything DH Assist works with, n8n style: the workflow at the top (drag the nodes, drag the
   empty space to move around, Ctrl + scroll to zoom) and, below, the settings of the node you click: its greeting, what
   it already knows and what you teach it, its instructions, the contact details it gives, its ending message, the
   website pages it has read and its model. Changes work from the next message on. */

type Panel = "greeting" | "knowledge" | "instructions" | "contact" | "ending" | "website" | "model";
type Run = (action: () => Promise<unknown>, done: string) => Promise<boolean>;

/* While the test chat runs, the workflow shows it, n8n style: the node working now pulses, the connection it came along
   flows, and the nodes done get a green tick. */
type Flow = { active: NodeId | null; from: NodeId | null; done: NodeId[]; thinking: boolean };
const IDLE: Flow = { active: null, from: null, done: [], thinking: false };
const STEP_MS = 650;
// What the test chat says it is doing, by node
const STATUS: Partial<Record<NodeId, string>> = {
  trigger: "Message received",
  greeting: "Saying the greeting",
  agent: "Thinking…",
  website: "Searching the website…",
  knowledge: "Reading your notes & files…",
  contact: "Giving the contact details…",
  tools: "Sending a file or page…",
  decide: "Checking: do they want a quote?",
  lead: "Lead to the team (test: not sent)",
  reply: "Replying",
  ending: "Saying goodbye",
};
const THINKERS: NodeId[] = ["model", "memory", "instructions"];

const PANELS: { key: Panel; label: string; icon: typeof ScrollText }[] = [
  { key: "greeting", label: "Greeting", icon: PartyPopper },
  { key: "knowledge", label: "Knowledge", icon: BookOpen },
  { key: "instructions", label: "Instructions", icon: ScrollText },
  { key: "contact", label: "Contact details", icon: Phone },
  { key: "ending", label: "Ending message", icon: LogOut },
  { key: "website", label: "Website", icon: Globe },
  { key: "model", label: "Chat Model", icon: Cpu },
];

const EXAMPLE_INSTRUCTIONS = [
  "Always offer a free site visit for projects in Delhi NCR.",
  "If someone asks about prices, give a rough range only if it is in our notes, and offer a free quote from the team.",
  "Mention that we have our own manufacturing unit when people ask about quality or timelines.",
];

const fileSize = (bytes?: number) => (!bytes ? "" : bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`);
const when = (value?: string) => (value ? new Date(value).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "numeric", minute: "2-digit", hour12: true }) : "");
const short = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

export default function AiTrainingPage() {
  const [data, setData] = useState<TrainingOverview | null>(null);
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [know, setKnow] = useState<KnowledgeOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel>("greeting");
  const [testOpen, setTestOpen] = useState(false);
  const [toast, setToast] = useState<{ text: string; tone: "ok" | "error" } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [flow, setFlow] = useState<Flow>(IDLE);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Lights the nodes up one after another. hold: the last one stays working (the agent while it thinks).
  const play = useCallback((steps: NodeId[], { reset = false, hold = false }: { reset?: boolean; hold?: boolean } = {}) => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (reset) setFlow(IDLE);
    const subs = SUBS as NodeId[];
    steps.forEach((id, i) => {
      timersRef.current.push(
        setTimeout(() => {
          setFlow((f) => {
            const last = f.active;
            // A part of the agent hangs from the agent; after one, the flow carries on from the agent
            const from = !last ? null : subs.includes(id) || subs.includes(last) ? "agent" : id === "reply" && last === "lead" ? null : last;
            return { active: id, from, done: last && !f.done.includes(last) ? [...f.done, last] : f.done, thinking: hold && i === steps.length - 1 };
          });
        }, i * STEP_MS),
      );
    });
    if (!hold) {
      timersRef.current.push(
        setTimeout(() => setFlow((f) => ({ active: null, from: null, thinking: false, done: f.active && !f.done.includes(f.active) ? [...f.done, f.active] : f.done })), steps.length * STEP_MS + 900),
      );
    }
  }, []);
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  const flowApi = useMemo(
    () => ({
      greeting: () => play(["trigger", "greeting"], { reset: true }),
      thinking: () => play(["trigger", "agent"], { reset: true, hold: true }),
      // The steps after the agent (the trace starts with trigger, agent)
      replied: (trace: string[]) => play(trace.filter((id) => id !== "trigger" && id !== "agent") as NodeId[]),
      failed: () => play([], { reset: true }),
    }),
    [play],
  );

  const load = useCallback(() => {
    Promise.all([chatTrainingApi.get(), chatTrainingApi.settings(), chatTrainingApi.knowledge()])
      .then(([overview, lines, known]) => {
        setData(overview);
        setSettings(lines);
        setKnow(known);
        setError(null);
      })
      .catch((e: Error) => setError(e.message || "Could not load the AI training"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = (text: string, tone: "ok" | "error" = "ok") => setToast({ text, tone });

  // Runs a change, then reloads everything
  const run: Run = async (action, done) => {
    try {
      await action();
      notify(done);
      load();
      return true;
    } catch (e) {
      notify((e as Error).message || "That didn't work", "error");
      return false;
    }
  };

  const openTest = () => {
    setTestOpen(true);
    requestAnimationFrame(() => canvasRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const open = (next: Panel) => {
    setPanel(next);
    requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const items = data?.items ?? [];
  const instructions = items.filter((i) => i.kind === "instruction");
  const taught = items.filter((i) => i.kind !== "instruction");
  const counts: Record<Panel, number | null> = {
    greeting: null,
    knowledge: taught.length + (know?.basics.length ?? 0),
    instructions: instructions.length,
    contact: settings ? settings.contact.phones.length + settings.contact.emails.length : null,
    ending: null,
    website: know?.pages.length ?? data?.counts.website ?? 0,
    model: null,
  };

  return (
    <div className={`${typography.pages} min-h-[calc(100vh-100px)] w-full bg-white text-[#18233b]`}>
      <div className={`flex flex-col px-[18px] pb-[24px] pt-[14px] transition-[padding] ${testOpen ? "lg:pr-[418px]" : ""}`}>
        {/* HEADER */}
        <div className="mb-[12px] flex flex-wrap items-end justify-between gap-[10px] border-b-[2px] border-[#293681] pb-[10px]">
          <div className="flex items-center gap-[10px]">
            <div className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-gradient-to-br from-[#0A2B5E] to-[#134698] text-white shadow-[0_6px_14px_-4px_rgba(10,43,94,0.45)] ring-2 ring-[#fd6e15]/40">
              <BrainCircuit className="h-[19px] w-[19px]" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold leading-[1.15] tracking-[-0.018em] text-[#0A2B5E]">AI Training</h1>
              <p className="mt-0.5 text-[9px] font-medium text-[#6c7587]">
                Everything DH Assist says and knows · click a node to change it · it uses changes from the next message
              </p>
            </div>
          </div>
          <div className="flex items-center gap-[8px]">
            {data && (
              <span className={`flex items-center gap-[5px] rounded-full px-[9px] py-[3px] text-[8.5px] font-bold ${data.aiReady ? "bg-[#e8f8ee] text-[#15803d]" : "bg-red-50 text-red-600"}`}>
                <span className={`h-[6px] w-[6px] rounded-full ${data.aiReady ? "bg-[#22c55e]" : "bg-red-500"}`} />
                {data.aiReady ? "AI connected" : "No OpenAI key on the server"}
              </span>
            )}
            <button
              type="button"
              onClick={openTest}
              className="flex h-[30px] items-center gap-[6px] rounded-full bg-[#fd6e15] px-[13px] text-[9.5px] font-bold text-white shadow-[0_4px_10px_rgba(253,110,21,0.35)] transition hover:bg-[#e85a05]"
            >
              <MessageCircle className="h-[13px] w-[13px]" /> Test chat
            </button>
          </div>
        </div>

        {error && <div className="mb-[10px] rounded-[7px] border border-red-200 bg-red-50 px-[12px] py-[8px] text-[10px] font-medium text-red-700">{error}</div>}

        {/* WORKFLOW */}
        <div ref={canvasRef} className="scroll-mt-[80px]">
          <WorkflowCanvas data={data} settings={settings} know={know} panel={panel} flow={flow} compact={testOpen} onOpen={open} onTest={openTest} />
        </div>

        {/* SETTINGS OF THE CHOSEN NODE */}
        <div ref={panelRef} className="mt-[14px] scroll-mt-[90px]">
          <div className="mb-[10px] flex flex-wrap gap-[6px]">
            {PANELS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setPanel(key)}
                className={`flex h-[32px] items-center gap-[6px] rounded-full border px-[13px] text-[10px] font-semibold transition ${
                  panel === key ? "border-[#0A2B5E] bg-[#0A2B5E] text-white" : "border-[#e2e8f0] bg-white text-[#475569] hover:border-[#134698]/40"
                }`}
              >
                <Icon className="h-[13px] w-[13px]" />
                {label}
                {counts[key] !== null && (
                  <span className={`grid h-[16px] min-w-[16px] place-items-center rounded-full px-[4px] text-[8px] font-bold ${panel === key ? "bg-white text-[#0A2B5E]" : "bg-[#fd6e15] text-white"}`}>
                    {counts[key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {!data || !settings || !know ? (
            error ? (
              <Empty icon={<X className="h-[22px] w-[22px]" />} text="Couldn't load the AI training" hint="Check that the backend is running and you are logged in, then refresh the page." />
            ) : (
              <div className="flex items-center gap-2 rounded-[10px] border border-[#e6ebf2] p-[20px] text-[10px] text-[#64748b]">
                <Loader2 className="h-[14px] w-[14px] animate-spin" /> Loading…
              </div>
            )
          ) : panel === "greeting" ? (
            <GreetingPanel settings={settings} run={run} />
          ) : panel === "knowledge" ? (
            <KnowledgePanel items={taught} know={know} run={run} onWebsite={() => setPanel("website")} />
          ) : panel === "instructions" ? (
            <InstructionsPanel items={instructions} data={data} know={know} run={run} />
          ) : panel === "contact" ? (
            <ContactPanel settings={settings} run={run} />
          ) : panel === "ending" ? (
            <EndingPanel settings={settings} run={run} />
          ) : panel === "website" ? (
            <WebsitePanel data={data} know={know} run={run} />
          ) : (
            <ModelPanel data={data} />
          )}
        </div>
      </div>

      {testOpen && (
        <TestChat
          settings={settings}
          status={flow.thinking ? "Thinking…" : flow.active ? STATUS[flow.active] || "" : ""}
          flowApi={flowApi}
          onClose={() => {
            setTestOpen(false);
            flowApi.failed();
          }}
        />
      )}

      {toast && (
        <div
          className={`fixed right-[20px] top-[90px] z-[60] flex items-center gap-[7px] rounded-[10px] px-[14px] py-[9px] text-[10px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(10,30,74,0.45)] ${
            toast.tone === "ok" ? "bg-[#15803d]" : "bg-red-600"
          }`}
        >
          {toast.tone === "ok" ? <Check className="h-[13px] w-[13px]" /> : <X className="h-[13px] w-[13px]" />}
          {toast.text}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── The workflow (n8n style) ───────────────────────── */

type NodeId = "trigger" | "greeting" | "agent" | "decide" | "lead" | "reply" | "ending" | "model" | "memory" | "instructions" | "knowledge" | "contact" | "website" | "tools";
type Point = { x: number; y: number };
type Tone = "orange" | "grey" | "green" | "blue" | "navy";

const MAIN_SIZE: Partial<Record<NodeId, { w: number; h: number }>> = {
  trigger: { w: 180, h: 70 },
  greeting: { w: 190, h: 70 },
  agent: { w: 300, h: 90 },
  decide: { w: 160, h: 66 },
  lead: { w: 180, h: 66 },
  reply: { w: 180, h: 66 },
  ending: { w: 190, h: 66 },
};
const SUBS: NodeId[] = ["model", "memory", "instructions", "knowledge", "contact", "website", "tools"];
const SUB_W = 104;
const SUB_CIRCLE = 54;

const DEFAULT_POS: Record<NodeId, Point> = {
  trigger: { x: 30, y: 128 },
  greeting: { x: 250, y: 128 },
  agent: { x: 480, y: 118 },
  decide: { x: 850, y: 130 },
  lead: { x: 1070, y: 40 },
  reply: { x: 1070, y: 222 },
  ending: { x: 1310, y: 222 },
  model: { x: 300, y: 330 },
  memory: { x: 412, y: 330 },
  instructions: { x: 524, y: 330 },
  knowledge: { x: 636, y: 330 },
  contact: { x: 748, y: 330 },
  website: { x: 860, y: 330 },
  tools: { x: 972, y: 330 },
};
const EDGES: { from: NodeId; to: NodeId; label?: string }[] = [
  { from: "trigger", to: "greeting" },
  { from: "greeting", to: "agent" },
  { from: "agent", to: "decide" },
  { from: "decide", to: "lead", label: "yes" },
  { from: "decide", to: "reply", label: "no" },
  { from: "reply", to: "ending", label: "done" },
];
const LAYOUT_KEY = "dh_ai_workflow_layout_v1";
const CANVAS_H = 470;

const readLayout = (): Record<NodeId, Point> => {
  try {
    const saved = JSON.parse(localStorage.getItem(LAYOUT_KEY) || "null");
    if (saved && typeof saved === "object") return { ...DEFAULT_POS, ...saved };
  } catch {
    // no saved layout
  }
  return DEFAULT_POS;
};
const saveLayout = (pos: Record<NodeId, Point>) => {
  try {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(pos));
  } catch {
    // the layout just isn't remembered
  }
};

const sizeOf = (id: NodeId) => MAIN_SIZE[id] ?? { w: SUB_W, h: 96 };

function WorkflowCanvas({
  data,
  settings,
  know,
  panel,
  flow,
  compact,
  onOpen,
  onTest,
}: {
  data: TrainingOverview | null;
  settings: ChatbotSettings | null;
  know: KnowledgeOverview | null;
  panel: Panel;
  flow: Flow;
  compact: boolean;
  onOpen: (p: Panel) => void;
  onTest: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Record<NodeId, Point>>(DEFAULT_POS);
  const [view, setView] = useState({ x: 0, y: 0, z: 1 });
  const [dragging, setDragging] = useState<NodeId | "pan" | null>(null);
  const dragRef = useRef<{ id: NodeId | "pan"; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const posRef = useRef(pos);
  const viewRef = useRef(view);
  useEffect(() => {
    posRef.current = pos;
    viewRef.current = view;
  });

  const items = data?.items ?? [];
  const active = (kind: "instruction" | "taught") => items.filter((i) => (kind === "instruction" ? i.kind === "instruction" : i.kind !== "instruction") && i.enabled).length;

  // What each node shows, and the settings it opens
  const nodes: Record<NodeId, { icon: ReactNode; tone: Tone; title: string; detail: string; open?: Panel }> = {
    trigger: { icon: <MessagesSquare className="h-[17px] w-[17px]" />, tone: "orange", title: "Chat message received", detail: "website chat or call" },
    greeting: { icon: <PartyPopper className="h-[17px] w-[17px]" />, tone: "orange", title: "Greeting", detail: settings ? `“${short(settings.greeting.en.chat, 34)}”` : "welcome message", open: "greeting" },
    agent: { icon: <BrainCircuit className="h-[21px] w-[21px]" />, tone: "navy", title: "DH Assist · AI Agent", detail: "Understands the message, searches what it knows and replies", open: "instructions" },
    decide: { icon: <Sparkles className="h-[15px] w-[15px]" />, tone: "grey", title: "Wants a quote?", detail: "or a call back" },
    lead: { icon: <Headset className="h-[15px] w-[15px]" />, tone: "green", title: "Lead to the team", detail: "saved in Contact Us" },
    reply: { icon: <Send className="h-[15px] w-[15px]" />, tone: "blue", title: "Reply to visitor", detail: "text or voice, in their language" },
    ending: { icon: <LogOut className="h-[15px] w-[15px]" />, tone: "orange", title: "Ending message", detail: settings ? `“${short(settings.ending.en, 32)}”` : "goodbye", open: "ending" },
    model: { icon: <Cpu className="h-[18px] w-[18px]" />, tone: "grey", title: "Chat Model", detail: data?.model || "OpenAI", open: "model" },
    memory: { icon: <Database className="h-[18px] w-[18px]" />, tone: "grey", title: "Memory", detail: "last 16 messages" },
    instructions: { icon: <ScrollText className="h-[18px] w-[18px]" />, tone: "grey", title: "Instructions", detail: `${active("instruction")} yours · ${know?.rules.length ?? 4} built-in`, open: "instructions" },
    knowledge: { icon: <BookOpen className="h-[18px] w-[18px]" />, tone: "grey", title: "Knowledge", detail: `${active("taught")} yours · ${know?.basics.length ?? 0} built-in`, open: "knowledge" },
    contact: { icon: <Phone className="h-[18px] w-[18px]" />, tone: "grey", title: "Contact details", detail: settings?.contact.phones[0] || "phone · email", open: "contact" },
    website: { icon: <Globe className="h-[18px] w-[18px]" />, tone: "grey", title: "Website", detail: `${know?.pages.length ?? 0} pages read`, open: "website" },
    tools: { icon: <Zap className="h-[18px] w-[18px]" />, tone: "grey", title: "Tools", detail: "search · files · quote" },
  };

  // Fits every node in view
  const fit = useCallback((layout: Record<NodeId, Point>) => {
    const box = rootRef.current?.getBoundingClientRect();
    if (!box) return;
    const ids = Object.keys(layout) as NodeId[];
    const minX = Math.min(...ids.map((id) => layout[id].x));
    const minY = Math.min(...ids.map((id) => layout[id].y));
    const maxX = Math.max(...ids.map((id) => layout[id].x + sizeOf(id).w));
    const maxY = Math.max(...ids.map((id) => layout[id].y + sizeOf(id).h));
    const pad = 40;
    const z = Math.min(1.2, Math.max(0.4, Math.min((box.width - pad * 2) / (maxX - minX), (CANVAS_H - pad * 2 - 30) / (maxY - minY))));
    setView({ z, x: (box.width - (maxX - minX) * z) / 2 - minX * z, y: (CANVAS_H - 30 - (maxY - minY) * z) / 2 - minY * z });
  }, []);

  // The layout you left it in (this browser), then everything in view
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const layout = readLayout();
      setPos(layout);
      fit(layout);
    });
    return () => cancelAnimationFrame(frame);
  }, [fit]);

  // The test chat opens beside it: fit again in the narrower space
  useEffect(() => {
    const t = setTimeout(() => fit(posRef.current), 320);
    return () => clearTimeout(t);
  }, [compact, fit]);

  // Running now / done, for the test chat's steps
  const isActive = (id: NodeId) => flow.active === id || (flow.thinking && (id === "agent" || THINKERS.includes(id)));
  const isDone = (id: NodeId) => !isActive(id) && flow.done.includes(id);

  const zoomAt = useCallback((factor: number, cx?: number, cy?: number) => {
    const box = rootRef.current?.getBoundingClientRect();
    const v = viewRef.current;
    const z = Math.min(1.8, Math.max(0.35, v.z * factor));
    const px = cx ?? (box ? box.width / 2 : 0);
    const py = cy ?? CANVAS_H / 2;
    setView({ z, x: px - ((px - v.x) * z) / v.z, y: py - ((py - v.y) * z) / v.z });
  }, []);

  // Ctrl / ⌘ + scroll zooms around the pointer (a plain scroll still scrolls the page)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const box = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX - box.left, e.clientY - box.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  /* Dragging: a node moves it; the empty canvas moves the view. A press that doesn't move is a click. */
  const startDrag = (e: ReactPointerEvent, id: NodeId | "pan") => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const origin = id === "pan" ? viewRef.current : posRef.current[id];
    dragRef.current = { id, sx: e.clientX, sy: e.clientY, ox: origin.x, oy: origin.y, moved: false };
    rootRef.current?.setPointerCapture(e.pointerId);
    setDragging(id);
  };

  const onMove = (e: ReactPointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.sx;
    const dy = e.clientY - drag.sy;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
    drag.moved = true;
    if (drag.id === "pan") setView((v) => ({ ...v, x: drag.ox + dx, y: drag.oy + dy }));
    else {
      const z = viewRef.current.z;
      const id = drag.id;
      setPos((p) => ({ ...p, [id]: { x: Math.round(drag.ox + dx / z), y: Math.round(drag.oy + dy / z) } }));
    }
  };

  const endDrag = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    setDragging(null);
    if (!drag || drag.id === "pan") return;
    if (drag.moved) saveLayout(posRef.current);
    else if (nodes[drag.id].open) onOpen(nodes[drag.id].open as Panel);
  };

  const onKey = (e: ReactKeyboardEvent, id: NodeId) => {
    if ((e.key === "Enter" || e.key === " ") && nodes[id].open) {
      e.preventDefault();
      onOpen(nodes[id].open as Panel);
    }
  };

  const resetLayout = () => {
    setPos(DEFAULT_POS);
    saveLayout(DEFAULT_POS);
    fit(DEFAULT_POS);
  };

  // Connections: main ones from right side to left side; the agent's parts hang from its bottom (dashed)
  const right = (id: NodeId) => ({ x: pos[id].x + sizeOf(id).w, y: pos[id].y + sizeOf(id).h / 2 });
  const left = (id: NodeId) => ({ x: pos[id].x, y: pos[id].y + sizeOf(id).h / 2 });
  const curve = (a: Point, b: Point) => {
    const bend = Math.max(40, Math.abs(b.x - a.x) / 2);
    return `M${a.x},${a.y} C${a.x + bend},${a.y} ${b.x - bend},${b.y} ${b.x},${b.y}`;
  };
  const agentW = sizeOf("agent").w;
  const anchor = (i: number) => ({ x: pos.agent.x + 30 + (i * (agentW - 60)) / (SUBS.length - 1), y: pos.agent.y + sizeOf("agent").h });
  const subTop = (id: NodeId) => ({ x: pos[id].x + SUB_W / 2, y: pos[id].y });
  const drop = (a: Point, b: Point) => {
    const bend = Math.max(30, Math.abs(b.y - a.y) / 2);
    return `M${a.x},${a.y} C${a.x},${a.y + bend} ${b.x},${b.y - bend} ${b.x},${b.y}`;
  };

  return (
    <div
      ref={rootRef}
      className={`relative select-none overflow-hidden rounded-[12px] border border-[#e3e8ef] ${dragging === "pan" ? "cursor-grabbing" : "cursor-grab"}`}
      style={{
        height: CANVAS_H,
        backgroundColor: "#f8fafc",
        backgroundImage: "radial-gradient(#cdd6e4 1.1px, transparent 1.1px)",
        backgroundSize: `${20 * view.z}px ${20 * view.z}px`,
        backgroundPosition: `${view.x}px ${view.y}px`,
        touchAction: "none",
      }}
      onPointerDown={(e) => startDrag(e, "pan")}
      onPointerMove={onMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <style>{`
        @keyframes wfDash { to { stroke-dashoffset: -24; } }
        .wf-flow { stroke-dasharray: 7 5; animation: wfDash .55s linear infinite; }
        @keyframes wfPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(253,110,21,.55); } 60% { box-shadow: 0 0 0 12px rgba(253,110,21,0); } }
        .wf-active { animation: wfPulse 1.1s ease-out infinite; }
      `}</style>

      {/* The flow */}
      <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})` }}>
        <svg className="pointer-events-none absolute left-0 top-0 overflow-visible" width="1" height="1" aria-hidden="true">
          <defs>
            <marker id="wf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
            </marker>
            <marker id="wf-arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#fd6e15" />
            </marker>
          </defs>
          {EDGES.map(({ from, to, label }) => {
            const a = right(from);
            const b = left(to);
            const running = flow.from === from && flow.active === to;
            const ran = !running && flow.done.includes(from) && (flow.done.includes(to) || flow.active === to);
            return (
              <g key={`${from}-${to}`}>
                <path
                  d={curve(a, b)}
                  fill="none"
                  stroke={running ? "#fd6e15" : ran ? "#22c55e" : "#94a3b8"}
                  strokeWidth={running ? 2.6 : 1.7}
                  className={running ? "wf-flow" : ""}
                  markerEnd={running ? "url(#wf-arrow-on)" : "url(#wf-arrow)"}
                />
                {label && (
                  <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={label === "yes" ? "#15803d" : "#64748b"}>
                    {label}
                  </text>
                )}
              </g>
            );
          })}
          {SUBS.map((id, i) => (
            <g key={id}>
              <path
                d={drop(anchor(i), subTop(id))}
                fill="none"
                stroke={isActive(id) ? "#fd6e15" : isDone(id) ? "#22c55e" : "#a5b4cb"}
                strokeWidth={isActive(id) ? 2.4 : 1.5}
                strokeDasharray="5 4"
                className={isActive(id) ? "wf-flow" : ""}
              />
              <rect x={anchor(i).x - 4} y={anchor(i).y - 4} width="8" height="8" fill="#94a3b8" transform={`rotate(45 ${anchor(i).x} ${anchor(i).y})`} />
            </g>
          ))}
        </svg>

        {(Object.keys(MAIN_SIZE) as NodeId[]).map((id) => {
          const n = nodes[id];
          const { w, h } = sizeOf(id);
          const isOpen = n.open && n.open === panel;
          const agent = id === "agent";
          return (
            <div
              key={id}
              role={n.open ? "button" : undefined}
              tabIndex={n.open ? 0 : undefined}
              onKeyDown={(e) => onKey(e, id)}
              onPointerDown={(e) => startDrag(e, id)}
              className={`group absolute flex items-center gap-[10px] rounded-[12px] bg-white px-[12px] transition-shadow ${
                dragging === id ? "cursor-grabbing shadow-[0_18px_34px_-14px_rgba(10,43,94,0.55)]" : "cursor-grab shadow-[0_6px_16px_-12px_rgba(10,30,74,0.5)] hover:shadow-[0_12px_24px_-14px_rgba(10,30,74,0.55)]"
              } ${isActive(id) ? "wf-active border-2 border-[#fd6e15]" : isDone(id) ? "border-2 border-[#22c55e]" : agent ? "border-2 border-[#134698]" : "border border-[#cbd5e1]"} ${isOpen && !isActive(id) ? "ring-[3px] ring-[#fd6e15]/50" : ""}`}
              style={{ left: pos[id].x, top: pos[id].y, width: w, height: h }}
            >
              <StepBadge active={isActive(id)} done={isDone(id)} />
              <span className={`relative grid shrink-0 place-items-center rounded-[10px] ${agent ? "h-[46px] w-[46px]" : "h-[36px] w-[36px]"} ${TONE[n.tone]}`}>
                {n.icon}
                {id === "trigger" && (
                  <span className="absolute -left-[6px] -top-[6px] grid h-[16px] w-[16px] place-items-center rounded-full bg-[#fd6e15] text-white">
                    <Zap className="h-[10px] w-[10px]" />
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <span className={`block font-bold leading-[1.2] text-[#0A2B5E] ${agent ? "text-[12.5px]" : "text-[10.5px]"}`}>{n.title}</span>
                <span className="mt-[1px] block text-[8.5px] leading-[1.3] text-[#64748b]">{n.detail}</span>
              </span>
              {/* n8n-style connection handles */}
              {id !== "trigger" && <span className="absolute -left-[6px] top-1/2 h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 border-[#94a3b8] bg-white" />}
              <span className="absolute -right-[6px] top-1/2 h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 border-[#94a3b8] bg-white" />
              {n.open && (
                <span className="pointer-events-none absolute -top-[9px] right-[10px] hidden rounded-full bg-[#fd6e15] px-[7px] py-[1px] text-[7.5px] font-bold uppercase tracking-wide text-white group-hover:block">Click to edit</span>
              )}
            </div>
          );
        })}

        {SUBS.map((id) => {
          const n = nodes[id];
          const isOpen = n.open && n.open === panel;
          return (
            <div
              key={id}
              role={n.open ? "button" : undefined}
              tabIndex={n.open ? 0 : undefined}
              onKeyDown={(e) => onKey(e, id)}
              onPointerDown={(e) => startDrag(e, id)}
              className={`group absolute flex flex-col items-center text-center ${dragging === id ? "cursor-grabbing" : "cursor-grab"}`}
              style={{ left: pos[id].x, top: pos[id].y, width: SUB_W }}
            >
              <span
                className={`relative grid place-items-center rounded-full border-2 bg-white transition ${
                  isActive(id)
                    ? "wf-active border-[#fd6e15] text-[#e85a05]"
                    : isDone(id)
                      ? "border-[#22c55e] text-[#15803d]"
                      : isOpen
                        ? "border-[#fd6e15] text-[#e85a05] shadow-[0_0_0_4px_rgba(253,110,21,0.15)]"
                        : "border-[#cbd5e1] text-[#475569] group-hover:border-[#134698] group-hover:text-[#134698]"
                }`}
                style={{ width: SUB_CIRCLE, height: SUB_CIRCLE }}
              >
                {n.icon}
                <StepBadge active={isActive(id)} done={isDone(id)} />
              </span>
              <span className={`mt-[5px] text-[10px] font-bold ${isOpen ? "text-[#e85a05]" : "text-[#0A2B5E]"}`}>{n.title}</span>
              <span className="text-[8px] leading-[1.25] text-[#64748b]">{n.detail}</span>
            </div>
          );
        })}
      </div>

      {/* Top: the workflow's name, like n8n */}
      <div className="pointer-events-none absolute left-[12px] top-[10px] flex items-center gap-[7px] rounded-[9px] bg-white/90 px-[10px] py-[5px] shadow-sm ring-1 ring-[#e2e8f0]">
        <BrainCircuit className="h-[13px] w-[13px] text-[#134698]" />
        <span className="text-[10px] font-bold text-[#0A2B5E]">DH Assist · Website chat</span>
        <span className="flex items-center gap-[4px] rounded-full bg-[#e8f8ee] px-[7px] py-[1px] text-[8px] font-bold text-[#15803d]">
          <span className="h-[5px] w-[5px] rounded-full bg-[#22c55e]" /> Active
        </span>
      </div>
      <div className="pointer-events-none absolute right-[12px] top-[10px] hidden items-center gap-[5px] rounded-[9px] bg-white/90 px-[10px] py-[5px] text-[8.5px] text-[#64748b] shadow-sm ring-1 ring-[#e2e8f0] md:flex">
        <Hand className="h-[11px] w-[11px]" /> Drag nodes to move · drag empty space to pan · Ctrl + scroll to zoom
      </div>

      {/* Bottom left: zoom controls */}
      <div className="absolute bottom-[12px] left-[12px] flex gap-[4px]" onPointerDown={(e) => e.stopPropagation()}>
        <CanvasButton label="Fit to view" onClick={() => fit(pos)}>
          <Maximize className="h-[13px] w-[13px]" />
        </CanvasButton>
        <CanvasButton label="Zoom in" onClick={() => zoomAt(1.2)}>
          <ZoomIn className="h-[13px] w-[13px]" />
        </CanvasButton>
        <CanvasButton label="Zoom out" onClick={() => zoomAt(1 / 1.2)}>
          <ZoomOut className="h-[13px] w-[13px]" />
        </CanvasButton>
        <CanvasButton label="Reset layout" onClick={resetLayout}>
          <RotateCcw className="h-[13px] w-[13px]" />
        </CanvasButton>
        <span className="ml-[4px] self-center rounded-[6px] bg-white/90 px-[6px] py-[2px] text-[8.5px] font-semibold text-[#64748b] ring-1 ring-[#e2e8f0]">{Math.round(view.z * 100)}%</span>
      </div>

      {/* Bottom centre: chat with it, like n8n */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onTest}
        className="absolute bottom-[12px] left-1/2 flex h-[30px] -translate-x-1/2 items-center gap-[5px] rounded-[8px] bg-[#fd6e15] px-[14px] text-[10px] font-bold text-white shadow-[0_4px_10px_rgba(253,110,21,0.35)] transition hover:bg-[#e85a05]"
      >
        <MessageCircle className="h-[13px] w-[13px]" /> Chat
      </button>
    </div>
  );
}

const TONE: Record<Tone, string> = {
  orange: "bg-[#fff1e6] text-[#e85a05]",
  grey: "bg-[#f1f5f9] text-[#475569]",
  green: "bg-[#e8f8ee] text-[#15803d]",
  blue: "bg-[#eef3fb] text-[#134698]",
  navy: "bg-gradient-to-br from-[#134698] to-[#0A2B5E] text-white",
};

// Top right of a node: spinning while it works, a green tick once done (like an n8n run)
function StepBadge({ active, done }: { active: boolean; done: boolean }) {
  if (!active && !done) return null;
  return (
    <span className={`absolute -right-[7px] -top-[7px] z-10 grid h-[18px] w-[18px] place-items-center rounded-full text-white shadow ${active ? "bg-[#fd6e15]" : "bg-[#22c55e]"}`}>
      {active ? <Loader2 className="h-[11px] w-[11px] animate-spin" /> : <Check className="h-[11px] w-[11px]" />}
    </span>
  );
}

function CanvasButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} title={label} aria-label={label} className="grid h-[30px] w-[30px] place-items-center rounded-[8px] bg-white text-[#475569] shadow-sm ring-1 ring-[#e2e8f0] transition hover:text-[#0A2B5E] hover:ring-[#134698]/40">
      {children}
    </button>
  );
}

/* ───────────────────────── Greeting ───────────────────────── */

const GREETING_FIELDS: { key: keyof GreetingLines; label: string; hint: string; rows: number }[] = [
  { key: "title", label: "Title", hint: "bold line above the welcome in the chat window", rows: 1 },
  { key: "chat", label: "Chat welcome", hint: "shown when someone opens the typed chat", rows: 2 },
  { key: "call", label: "Call welcome", hint: "said when a call starts: asks whether they'd like to talk or type", rows: 2 },
  { key: "again", label: "Welcome back (chat)", hint: "for a visitor whose name we know; {name} becomes their name", rows: 2 },
  { key: "callAgain", label: "Welcome back (call)", hint: "the same, said in a call; {name} becomes their name", rows: 2 },
];

function GreetingPanel({ settings, run }: { settings: ChatbotSettings; run: Run }) {
  const [lines, setLines] = useState(settings.greeting);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [busy, setBusy] = useState(false);
  const changed = JSON.stringify(lines) !== JSON.stringify(settings.greeting);

  const set = (key: keyof GreetingLines, value: string) => setLines((prev) => ({ ...prev, [lang]: { ...prev[lang], [key]: value } }));

  return (
    <div className="grid gap-[14px] lg:grid-cols-[1fr_minmax(0,360px)]">
      <Card icon={<PartyPopper className="h-[14px] w-[14px]" />} title="Greeting" hint="What DH Assist says first. The chat writes Hindi in Roman letters (Hinglish), the way people type it.">
        <SavedBadge saved={settings.saved.greeting} settings={settings} />
        <div>
          <LangSwitch lang={lang} onChange={setLang} />
        </div>
        <div className="mt-[10px] flex flex-col gap-[10px]">
          {GREETING_FIELDS.map((f) => (
            <Field key={f.key} label={f.label} hint={f.hint}>
              <textarea value={lines[lang][f.key]} onChange={(e) => set(f.key, e.target.value)} rows={f.rows} maxLength={600} className={`${inputCls} h-auto resize-y py-[8px] leading-[1.5]`} />
            </Field>
          ))}
        </div>
        <SaveRow
          busy={busy}
          changed={changed}
          onSave={async () => {
            setBusy(true);
            await run(() => chatTrainingApi.saveSettings({ greeting: lines }), "Greeting saved");
            setBusy(false);
          }}
          onReset={
            settings.saved.greeting
              ? async () => {
                  if (!window.confirm("Go back to the built-in greeting?")) return;
                  setBusy(true);
                  await run(() => chatTrainingApi.saveSettings({ greeting: null }), "Greeting reset");
                  setLines(settings.defaults.greeting);
                  setBusy(false);
                }
              : undefined
          }
        />
      </Card>
      <Preview title="Preview" lines={[{ bold: lines[lang].title, text: lines[lang].chat }, { text: lines[lang].again.split("{name}").join("Priya") }]} />
    </div>
  );
}

/* ───────────────────────── Ending message ───────────────────────── */

function EndingPanel({ settings, run }: { settings: ChatbotSettings; run: Run }) {
  const [lines, setLines] = useState(settings.ending);
  const [busy, setBusy] = useState(false);
  const changed = JSON.stringify(lines) !== JSON.stringify(settings.ending);

  return (
    <div className="grid gap-[14px] lg:grid-cols-[1fr_minmax(0,360px)]">
      <Card icon={<LogOut className="h-[14px] w-[14px]" />} title="Ending message" hint="Said when the visitor is done (“thanks, that's all”), in the chat and in calls. In other languages DH Assist says the same in that language.">
        <SavedBadge saved={settings.saved.ending} settings={settings} />
        <div className="flex flex-col gap-[10px]">
          <Field label="English" hint="">
            <textarea value={lines.en} onChange={(e) => setLines({ ...lines, en: e.target.value })} rows={2} maxLength={600} className={`${inputCls} h-auto resize-y py-[8px] leading-[1.5]`} />
          </Field>
          <Field label="Hindi (Hinglish)" hint="">
            <textarea value={lines.hi} onChange={(e) => setLines({ ...lines, hi: e.target.value })} rows={2} maxLength={600} className={`${inputCls} h-auto resize-y py-[8px] leading-[1.5]`} />
          </Field>
        </div>
        <SaveRow
          busy={busy}
          changed={changed}
          onSave={async () => {
            setBusy(true);
            await run(() => chatTrainingApi.saveSettings({ ending: lines }), "Ending message saved");
            setBusy(false);
          }}
          onReset={
            settings.saved.ending
              ? async () => {
                  if (!window.confirm("Go back to the built-in ending message?")) return;
                  setBusy(true);
                  await run(() => chatTrainingApi.saveSettings({ ending: null }), "Ending message reset");
                  setLines(settings.defaults.ending);
                  setBusy(false);
                }
              : undefined
          }
        />
      </Card>
      <Preview title="Preview" lines={[{ text: lines.en }, { text: lines.hi }]} />
    </div>
  );
}

/* ───────────────────────── Contact details ───────────────────────── */

function ContactPanel({ settings, run }: { settings: ChatbotSettings; run: Run }) {
  const [c, setC] = useState<ContactDetails>(settings.contact);
  const [busy, setBusy] = useState(false);
  const changed = JSON.stringify(c) !== JSON.stringify(settings.contact) || !settings.saved.contact;

  const listField = (key: "phones" | "emails", icon: ReactNode, placeholder: string) => (
    <div className="flex flex-col gap-[6px]">
      {c[key].map((value, i) => (
        <div key={i} className="flex items-center gap-[6px]">
          <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[8px] bg-[#eef3fb] text-[#134698]">{icon}</span>
          <input value={value} onChange={(e) => setC({ ...c, [key]: c[key].map((v, j) => (j === i ? e.target.value : v)) })} placeholder={placeholder} className={inputCls} />
          <button
            type="button"
            onClick={() => setC({ ...c, [key]: c[key].filter((_, j) => j !== i) })}
            aria-label="Remove"
            className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[8px] text-[#94a3b8] ring-1 ring-[#e2e8f0] hover:text-red-600"
          >
            <X className="h-[13px] w-[13px]" />
          </button>
        </div>
      ))}
      {c[key].length < 6 && (
        <button type="button" onClick={() => setC({ ...c, [key]: [...c[key], ""] })} className={`${ghostBtn} w-fit`}>
          <Plus className="h-[11px] w-[11px]" /> Add {key === "phones" ? "phone number" : "email"}
        </button>
      )}
    </div>
  );

  return (
    <Card
      icon={<Phone className="h-[14px] w-[14px]" />}
      title="Contact details"
      hint="What DH Assist gives when someone asks how to reach us. The first phone and email are also in its “please call us” lines. Filled in from the website's Contact page until you save your own."
    >
      <SavedBadge saved={settings.saved.contact} settings={settings} unsavedText="From the website's Contact page (not saved here yet)" />
      <div className="grid gap-[12px] lg:grid-cols-2">
        <Field label="Phone numbers" hint="">
          {listField("phones", <Phone className="h-[13px] w-[13px]" />, "+91 98765 43210")}
        </Field>
        <Field label="Email addresses" hint="">
          {listField("emails", <Mail className="h-[13px] w-[13px]" />, "info@designhouse.co.in")}
        </Field>
        <Field label="WhatsApp number" hint="">
          <IconInput icon={<MessageCircle className="h-[13px] w-[13px]" />} value={c.whatsapp} onChange={(v) => setC({ ...c, whatsapp: v })} placeholder="+91 98765 43210" />
        </Field>
        <Field label="Website" hint="">
          <IconInput icon={<LinkIcon className="h-[13px] w-[13px]" />} value={c.website} onChange={(v) => setC({ ...c, website: v })} placeholder="https://www.designhouse.co.in" />
        </Field>
        <Field label="Address" hint="">
          <div className="flex gap-[6px]">
            <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[8px] bg-[#eef3fb] text-[#134698]">
              <MapPin className="h-[13px] w-[13px]" />
            </span>
            <textarea value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} rows={3} maxLength={400} className={`${inputCls} h-auto resize-y py-[8px] leading-[1.5]`} />
          </div>
        </Field>
        <Field label="Working hours" hint="">
          <IconInput icon={<Clock className="h-[13px] w-[13px]" />} value={c.hours} onChange={(v) => setC({ ...c, hours: v })} placeholder="Monday – Saturday: 9:00 AM – 6:00 PM. Sunday: Closed" />
        </Field>
      </div>
      <SaveRow
        busy={busy}
        changed={changed}
        onSave={async () => {
          setBusy(true);
          await run(() => chatTrainingApi.saveSettings({ contact: c }), "Contact details saved");
          setBusy(false);
        }}
        onReset={
          settings.saved.contact
            ? async () => {
                if (!window.confirm("Use the website Contact page's details again?")) return;
                setBusy(true);
                await run(() => chatTrainingApi.saveSettings({ contact: null }), "Contact details reset");
                setC(settings.defaults.contact);
                setBusy(false);
              }
            : undefined
        }
      />
    </Card>
  );
}

/* ───────────────────────── Knowledge: what it knows, and what you teach it ───────────────────────── */

function KnowledgePanel({ items, know, run, onWebsite }: { items: TrainingItem[]; know: KnowledgeOverview; run: Run; onWebsite: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [always, setAlways] = useState(false);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState("");
  const [fileAlways, setFileAlways] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addNote = async () => {
    if (!content.trim()) return;
    setBusy(true);
    const ok = await run(() => chatTrainingApi.add({ kind: "note", title, content, always }), "Note learned");
    setBusy(false);
    if (ok) {
      setTitle("");
      setContent("");
      setAlways(false);
    }
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    const ok = await run(() => chatTrainingApi.upload(file, fileTitle, fileAlways), `${file.name} learned`);
    setUploading(false);
    if (ok) {
      setFile(null);
      setFileTitle("");
      setFileAlways(false);
    }
  };

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Already known */}
      <section>
        <SectionTitle icon={<BookOpen className="h-[13px] w-[13px]" />} title="What DH Assist already knows" hint="Built in, and read from the website by itself. To change it, change the website, or add your own note below (yours come on top)." />
        <div className="grid gap-[8px] xl:grid-cols-2">
          {know.basics.map((b) => (
            <Expandable key={b.title} icon={<Sparkles className="h-[14px] w-[14px]" />} title={b.title} meta={b.url ? `from ${b.url}` : "always known"} text={b.text} />
          ))}
        </div>
        <div className="mt-[10px] grid gap-[10px] lg:grid-cols-2">
          <div className="rounded-[12px] bg-[#f8fafc] p-[12px] ring-1 ring-[#e6ebf2]">
            <p className="mb-[7px] text-[9.5px] font-bold text-[#0A2B5E]">Our services ({know.services.length})</p>
            <div className="flex flex-wrap gap-[5px]">
              {know.services.map((s) => (
                <span key={s} className="rounded-full bg-white px-[9px] py-[3px] text-[9px] font-semibold text-[#134698] ring-1 ring-[#dbe4f3]">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[12px] bg-[#f8fafc] p-[12px] ring-1 ring-[#e6ebf2]">
            <p className="mb-[7px] text-[9.5px] font-bold text-[#0A2B5E]">PDFs it can send ({know.documents.length})</p>
            {know.documents.length ? (
              <ul className="flex flex-col gap-[4px]">
                {know.documents.map((d) => (
                  <li key={d.title} className="flex items-center gap-[6px] text-[9.5px] text-[#334155]">
                    <FileText className="h-[12px] w-[12px] shrink-0 text-red-500" />
                    <span className="truncate">{d.title}</span>
                    <span className="shrink-0 text-[8.5px] text-[#94a3b8]">{[d.category, d.fileSize].filter(Boolean).join(" · ")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[9px] text-[#94a3b8]">None yet (Content → Downloads)</p>
            )}
            <button type="button" onClick={onWebsite} className="mt-[8px] flex items-center gap-[3px] text-[9px] font-bold text-[#e85a05] hover:underline">
              And {know.pages.length} website pages it has read <ChevronRight className="h-[11px] w-[11px]" />
            </button>
          </div>
        </div>
      </section>

      {/* Taught by you */}
      <section>
        <SectionTitle icon={<NotebookPen className="h-[13px] w-[13px]" />} title="Taught by you" hint="Notes and files DH Assist answers from, on top of the website." />
        <div className="grid gap-[14px] lg:grid-cols-2">
          <Card icon={<NotebookPen className="h-[14px] w-[14px]" />} title="Write a note" hint="Offers, prices, project details, policies, anything about Design House.">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title, e.g. Kiosk prices" maxLength={120} className={inputCls} />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              maxLength={20000}
              placeholder="e.g. Our retail kiosks start from ₹1.5 lakh for a 6×4 ft kiosk. Delivery takes about 3 weeks after the design is approved."
              className={`${inputCls} mt-[8px] h-auto resize-y py-[8px] leading-[1.5]`}
            />
            <AlwaysToggle checked={always} onChange={setAlways} />
            <button type="button" onClick={addNote} disabled={busy || !content.trim()} className={`${primaryBtn} mt-[10px] w-full`}>
              {busy ? <Loader2 className="h-[13px] w-[13px] animate-spin" /> : <Plus className="h-[13px] w-[13px]" />} Teach this note
            </button>
          </Card>

          <Card icon={<FileUp className="h-[14px] w-[14px]" />} title="Upload a file" hint="PDF, Word (.docx), .txt, .md or .csv, up to 20 MB. Its text is read once and DH Assist answers from it.">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const dropped = e.dataTransfer.files?.[0];
                if (dropped) setFile(dropped);
              }}
              className="flex w-full flex-col items-center justify-center gap-[6px] rounded-[10px] border-2 border-dashed border-[#cbd5e1] bg-[#f8fafc] px-[12px] py-[18px] text-center transition hover:border-[#134698]/50"
            >
              <FileUp className="h-[22px] w-[22px] text-[#134698]" />
              {file ? (
                <>
                  <span className="text-[10px] font-bold text-[#0A2B5E]">{file.name}</span>
                  <span className="text-[8.5px] text-[#64748b]">{fileSize(file.size)} · click to choose another</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-bold text-[#0A2B5E]">Drop a file here, or click to choose</span>
                  <span className="text-[8.5px] text-[#64748b]">Company profile, price list, project details, policies…</span>
                </>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.txt,.md,.csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/csv"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
            <input value={fileTitle} onChange={(e) => setFileTitle(e.target.value)} placeholder="Title (optional: the file's name is used)" maxLength={120} className={`${inputCls} mt-[8px]`} />
            <AlwaysToggle checked={fileAlways} onChange={setFileAlways} />
            <button type="button" onClick={upload} disabled={uploading || !file} className={`${primaryBtn} mt-[10px] w-full`}>
              {uploading ? <Loader2 className="h-[13px] w-[13px] animate-spin" /> : <Sparkles className="h-[13px] w-[13px]" />}
              {uploading ? "Reading and learning…" : "Upload and teach"}
            </button>
          </Card>
        </div>

        <div className="mt-[10px]">
          {items.length === 0 ? (
            <Empty icon={<NotebookPen className="h-[22px] w-[22px]" />} text="Nothing taught yet" hint="Write a note or upload a PDF: DH Assist starts using it straight away." />
          ) : (
            <div className="grid gap-[8px] xl:grid-cols-2">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} run={run} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function AlwaysToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="mt-[8px] flex cursor-pointer items-start gap-[7px] rounded-[8px] bg-[#fff7f0] px-[9px] py-[7px] ring-1 ring-[#fcd3b5]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-[1px] h-[13px] w-[13px] accent-[#fd6e15]" />
      <span className="text-[9px] leading-[1.4] text-[#7c2d12]">
        <b>Always remember</b>: for short, important facts (an offer, a phone number). Off: it is found by search when a visitor asks about it, best for long text and files.
      </span>
    </label>
  );
}

/* ───────────────────────── Instructions ───────────────────────── */

function InstructionsPanel({ items, data, know, run }: { items: TrainingItem[]; data: TrainingOverview; know: KnowledgeOverview; run: Run }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const used = Math.min(100, Math.round((data.rulesChars / data.maxRulesChars) * 100));

  const add = async () => {
    if (!content.trim()) return;
    setBusy(true);
    const ok = await run(() => chatTrainingApi.add({ kind: "instruction", title, content }), "Instruction added: DH Assist follows it from the next message");
    setBusy(false);
    if (ok) {
      setTitle("");
      setContent("");
    }
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="grid gap-[14px] lg:grid-cols-[minmax(0,380px)_1fr]">
        <Card icon={<ScrollText className="h-[14px] w-[14px]" />} title="Add an instruction" hint="How DH Assist should behave or what it should say. It follows these in every chat and call.">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional), e.g. Site visits" maxLength={120} className={inputCls} />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            maxLength={20000}
            placeholder="e.g. Always offer a free site visit for projects in Delhi NCR."
            className={`${inputCls} mt-[8px] h-auto resize-y py-[8px] leading-[1.5]`}
          />
          <p className="mt-[8px] text-[8.5px] font-semibold uppercase tracking-[0.06em] text-[#94a3b8]">Examples</p>
          <div className="mt-[4px] flex flex-col gap-[4px]">
            {EXAMPLE_INSTRUCTIONS.map((example) => (
              <button key={example} type="button" onClick={() => setContent(example)} className="rounded-[7px] bg-[#f8fafc] px-[8px] py-[5px] text-left text-[9px] text-[#475569] ring-1 ring-[#e6ebf2] transition hover:ring-[#134698]/30">
                {example}
              </button>
            ))}
          </div>
          <button type="button" onClick={add} disabled={busy || !content.trim()} className={`${primaryBtn} mt-[10px] w-full`}>
            {busy ? <Loader2 className="h-[13px] w-[13px] animate-spin" /> : <Plus className="h-[13px] w-[13px]" />} Add instruction
          </button>
        </Card>

        <div>
          <div className="mb-[8px] rounded-[10px] bg-[#f8fafc] px-[12px] py-[8px] ring-1 ring-[#e6ebf2]">
            <div className="flex items-center justify-between text-[9px] font-semibold text-[#475569]">
              <span>Space used by your instructions, “always remember” notes and contact details</span>
              <span className={used > 90 ? "text-red-600" : "text-[#0A2B5E]"}>
                {data.rulesChars.toLocaleString()} / {data.maxRulesChars.toLocaleString()}
              </span>
            </div>
            <div className="mt-[5px] h-[5px] overflow-hidden rounded-full bg-[#e2e8f0]">
              <div className={`h-full rounded-full ${used > 90 ? "bg-red-500" : "bg-gradient-to-r from-[#134698] to-[#fd6e15]"}`} style={{ width: `${used}%` }} />
            </div>
          </div>
          {items.length === 0 ? (
            <Empty icon={<ScrollText className="h-[22px] w-[22px]" />} text="No instructions of yours yet" hint="Add how DH Assist should talk, what to offer, or what to avoid. Its built-in rules are below." />
          ) : (
            <div className="flex flex-col gap-[8px]">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} run={run} />
              ))}
            </div>
          )}
        </div>
      </div>

      <section>
        <SectionTitle icon={<BrainCircuit className="h-[13px] w-[13px]" />} title="Built-in rules (always on)" hint="How DH Assist is set up to behave. Read-only: your instructions above come on top of these." />
        <div className="grid gap-[8px] xl:grid-cols-2">
          {know.rules.map((r) => (
            <Expandable key={r.title} icon={<ScrollText className="h-[14px] w-[14px]" />} title={r.title} meta={`${r.text.length.toLocaleString()} characters`} text={r.text} />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── One instruction, note or file ── */
function ItemCard({ item, run }: { item: TrainingItem; run: Run }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [showText, setShowText] = useState(false);
  const [busy, setBusy] = useState(false);

  const save = async (change: Parameters<typeof chatTrainingApi.update>[1], done: string) => {
    setBusy(true);
    const ok = await run(() => chatTrainingApi.update(item._id, change), done);
    setBusy(false);
    return ok;
  };

  const remove = () => {
    if (!window.confirm(`Delete "${item.title || "this item"}"? DH Assist will forget it.`)) return;
    void run(() => chatTrainingApi.remove(item._id), "Deleted");
  };

  const Icon = item.kind === "instruction" ? ScrollText : item.kind === "file" ? FileText : NotebookPen;
  const meta = [
    item.kind === "file" ? [item.file?.name, item.file?.pages ? `${item.file.pages} pages` : "", fileSize(item.file?.size)].filter(Boolean).join(" · ") : "",
    `${item.chars.toLocaleString()} characters`,
    item.kind !== "instruction" && !item.always ? `${item.passages} searchable passages` : "",
    `${item.updatedBy || item.createdBy || "admin"} · ${when(item.updatedAt)}`,
  ].filter(Boolean);

  return (
    <div className={`rounded-[12px] border bg-white p-[11px] transition ${item.enabled ? "border-[#e2e8f0]" : "border-dashed border-[#cbd5e1] opacity-70"}`}>
      <div className="flex items-start gap-[9px]">
        <span className={`grid h-[32px] w-[32px] shrink-0 place-items-center rounded-[9px] ${item.kind === "instruction" ? "bg-[#eef3fb] text-[#134698]" : item.kind === "file" ? "bg-red-50 text-red-600" : "bg-[#fff1e6] text-[#e85a05]"}`}>
          <Icon className="h-[15px] w-[15px]" />
        </span>
        <div className="min-w-0 flex-1">
          {editing ? (
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className={`${inputCls} h-[30px]`} placeholder="Title" />
          ) : (
            <div className="flex flex-wrap items-center gap-[6px]">
              <p className="truncate text-[11px] font-bold text-[#0A2B5E]">{item.title || (item.kind === "instruction" ? "Instruction" : "Note")}</p>
              {item.kind !== "instruction" && (
                <span className={`rounded-full px-[7px] py-[1px] text-[7.5px] font-bold uppercase tracking-wide ${item.always ? "bg-[#fff1e6] text-[#e85a05]" : "bg-[#eef3fb] text-[#134698]"}`}>
                  {item.always ? "Always remembered" : "Found by search"}
                </span>
              )}
              {!item.enabled && <span className="rounded-full bg-[#f1f5f9] px-[7px] py-[1px] text-[7.5px] font-bold uppercase tracking-wide text-[#64748b]">Off</span>}
            </div>
          )}
          <p className="mt-[2px] text-[8px] text-[#94a3b8]">{meta.join(" · ")}</p>
        </div>
        <Switch checked={item.enabled} disabled={busy} onChange={(on) => void save({ enabled: on }, on ? "Turned on" : "Turned off: DH Assist ignores it")} />
      </div>

      {editing ? (
        item.kind !== "file" && <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5} maxLength={20000} className={`${inputCls} mt-[8px] h-auto resize-y py-[8px] leading-[1.5]`} />
      ) : item.kind === "file" ? (
        showText && <pre className="mt-[8px] max-h-[220px] overflow-auto whitespace-pre-wrap rounded-[8px] bg-[#f8fafc] p-[9px] font-sans text-[9px] leading-[1.5] text-[#334155] ring-1 ring-[#e6ebf2]">{item.content}</pre>
      ) : (
        <p className="mt-[8px] line-clamp-4 whitespace-pre-wrap text-[10px] leading-[1.5] text-[#334155]">{item.content}</p>
      )}

      <div className="mt-[9px] flex flex-wrap items-center gap-[6px]">
        {editing ? (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={async () => {
                const change = item.kind === "file" ? { title } : { title, content };
                if (await save(change, "Saved")) setEditing(false);
              }}
              className={`${primaryBtn} h-[26px] px-[11px]`}
            >
              {busy ? <Loader2 className="h-[11px] w-[11px] animate-spin" /> : <Check className="h-[11px] w-[11px]" />} Save
            </button>
            <button type="button" onClick={() => setEditing(false)} className={ghostBtn}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => setEditing(true)} className={ghostBtn}>
              <Pencil className="h-[11px] w-[11px]" /> Edit
            </button>
            {item.kind === "file" && (
              <button type="button" onClick={() => setShowText((v) => !v)} className={ghostBtn}>
                <FileText className="h-[11px] w-[11px]" /> {showText ? "Hide text" : "View text read"}
              </button>
            )}
            {item.kind !== "instruction" && (
              <button type="button" disabled={busy} onClick={() => void save({ always: !item.always }, item.always ? "Now found by search" : "Now always remembered")} className={ghostBtn}>
                <BrainCircuit className="h-[11px] w-[11px]" /> {item.always ? "Find by search instead" : "Always remember"}
              </button>
            )}
            <button type="button" onClick={remove} className={`${ghostBtn} ml-auto text-red-600 hover:border-red-300 hover:bg-red-50`}>
              <Trash2 className="h-[11px] w-[11px]" /> Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Website ───────────────────────── */

function WebsitePanel({ data, know, run }: { data: TrainingOverview; know: KnowledgeOverview; run: Run }) {
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const pages = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? know.pages.filter((p) => `${p.title} ${p.url} ${p.text}`.toLowerCase().includes(q)) : know.pages;
  }, [know.pages, query]);

  return (
    <div className="flex flex-col gap-[14px]">
      <Card icon={<Globe className="h-[14px] w-[14px]" />} title="Website knowledge" hint="DH Assist reads the website by itself once a day: every page, the FAQs, job openings, downloads and contact details.">
        <div className="grid gap-[8px] sm:grid-cols-4">
          <Stat label="Pages read" value={know.pages.length.toLocaleString()} />
          <Stat label="Website passages" value={data.counts.website.toLocaleString()} />
          <Stat label="From your notes & files" value={data.counts.taught.toLocaleString()} />
          <Stat label="Re-read" value="Every 24 hours" />
        </div>
        <div className="mt-[10px] flex flex-wrap items-center gap-[10px]">
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await run(() => chatTrainingApi.reindex(), "Website read again");
              setBusy(false);
            }}
            className={primaryBtn}
          >
            {busy ? <Loader2 className="h-[13px] w-[13px] animate-spin" /> : <RefreshCw className="h-[13px] w-[13px]" />}
            {busy ? "Reading the website…" : "Re-read website now"}
          </button>
          <p className="text-[9px] text-[#64748b]">Changed something on the website? Re-read it so DH Assist knows now. It takes a minute or two.</p>
        </div>
      </Card>

      <section>
        <div className="mb-[8px] flex flex-wrap items-center justify-between gap-[8px]">
          <SectionTitle icon={<Globe className="h-[13px] w-[13px]" />} title={`Pages DH Assist has read (${pages.length})`} hint="Click a page to see the text it learned from it." />
          <div className="relative w-full max-w-[280px]">
            <Search className="pointer-events-none absolute left-[10px] top-1/2 h-[12px] w-[12px] -translate-y-1/2 text-[#94a3b8]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pages or text" className={`${inputCls} pl-[28px]`} />
          </div>
        </div>
        <div className="grid gap-[8px] xl:grid-cols-2">
          {pages.slice(0, 120).map((p) => (
            <Expandable
              key={`${p.url}|${p.title}`}
              icon={<FileText className="h-[14px] w-[14px]" />}
              title={p.title || p.url || "Website"}
              meta={`${p.url || "—"} · ${p.passages} passage${p.passages === 1 ? "" : "s"} · checked ${when(p.checkedAt)}`}
              text={p.text}
            />
          ))}
        </div>
        {pages.length > 120 && <p className="mt-[8px] text-center text-[9px] text-[#94a3b8]">Showing 120 of {pages.length}: search to find the others.</p>}
      </section>
    </div>
  );
}

function ModelPanel({ data }: { data: TrainingOverview }) {
  return (
    <Card icon={<Cpu className="h-[14px] w-[14px]" />} title="Chat model" hint="The OpenAI models behind DH Assist. They are set on the server (.env), not here.">
      <div className="grid gap-[8px] sm:grid-cols-3">
        <Stat label="Typed chat" value={data.model} />
        <Stat label="Voice calls" value={data.voiceModel} />
        <Stat label="Status" value={data.aiReady ? "Connected" : "No OpenAI key"} />
      </div>
      <p className="mt-[10px] text-[9.5px] leading-[1.5] text-[#475569]">
        Nothing here retrains the model itself. What you set on this page is given to DH Assist with every message, so a change works from the next message on, and can be turned off or deleted any time.
      </p>
    </Card>
  );
}

/* ───────────────────────── Test chat ───────────────────────── */

/* Talk to DH Assist as a visitor would, typing or by voice, with everything on this page. The workflow lights up the
   steps it takes. Nothing is saved: no chat, no lead, no warning. Voice: the browser writes down what you say (Chrome or
   Edge) and the reply is read out in DH Assist's own voice. */
type TestMessage = { role: "user" | "assistant"; content: string; searched?: TrainingTestReply["searched"]; error?: boolean; note?: string };
type FlowApi = { greeting: () => void; thinking: () => void; replied: (trace: string[]) => void; failed: () => void };

// The browser's speech recognition (Chrome, Edge); not in every browser's types
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
const speechRecognition = (): (new () => Recognition) | undefined => {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
};

function TestChat({ settings, status, flowApi, onClose }: { settings: ChatbotSettings | null; status: string; flowApi: FlowApi; onClose: () => void }) {
  const greetingText = settings ? [settings.greeting.en.title, settings.greeting.en.chat].filter(Boolean).join("\n") : "";
  const [messages, setMessages] = useState<TestMessage[]>(() => (greetingText ? [{ role: "assistant", content: greetingText, note: "Greeting" }] : []));
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(true);
  const [voiceLang, setVoiceLang] = useState<"en-IN" | "hi-IN">("en-IN");
  const [note, setNote] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<Recognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  });

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const stopAudio = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setSpeaking(false);
  };

  // Read out in DH Assist's voice
  const speak = async (text: string) => {
    stopAudio();
    try {
      setSpeaking(true);
      const blob = await chatTrainingApi.speak(text);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setSpeaking(false);
        URL.revokeObjectURL(url);
      };
      await audio.play();
    } catch {
      setSpeaking(false);
    }
  };

  // Opening it: the greeting, as a visitor sees it
  useEffect(() => {
    flowApi.greeting();
    if (greetingText && speakReplies) void speak(greetingText.replace(/\n/g, ". "));
    return () => {
      recRef.current?.abort();
      audioRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(""), 5000);
    return () => clearTimeout(t);
  }, [note]);

  const send = async (said?: string) => {
    const text = (said ?? draft).trim();
    if (!text || busy) return;
    setDraft("");
    stopAudio();
    const history = messagesRef.current.filter((m) => !m.error).map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setBusy(true);
    flowApi.thinking();
    try {
      const reply = await chatTrainingApi.test(text, history);
      flowApi.replied(reply.trace || []);
      const answer = reply.text || "(no reply)";
      setMessages((prev) => [...prev, { role: "assistant", content: answer, searched: reply.searched, note: reply.finished ? "Ending message" : undefined }]);
      if (speakReplies) void speak(answer);
    } catch (e) {
      flowApi.failed();
      setMessages((prev) => [...prev, { role: "assistant", content: (e as Error).message || "The test didn't work", error: true }]);
    } finally {
      setBusy(false);
    }
  };

  // Speak instead of typing: what you say is written down, then sent
  const listen = () => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const Ctor = speechRecognition();
    if (!Ctor) {
      setNote("Voice input works in Chrome or Edge. You can still type.");
      return;
    }
    stopAudio();
    const rec = new Ctor();
    rec.lang = voiceLang;
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      finalText = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setDraft(`${finalText} ${interim}`.trim());
    };
    rec.onerror = (e) => {
      setNote(e.error === "not-allowed" ? "The microphone is blocked: allow it from the address bar." : e.error === "no-speech" ? "I didn't hear anything. Tap the mic and speak." : "");
    };
    rec.onend = () => {
      setListening(false);
      recRef.current = null;
      if (finalText.trim()) void send(finalText);
    };
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const headerStatus = listening ? "Listening… speak now" : speaking ? "Speaking…" : status || (busy ? "Thinking…" : "Ready");

  return (
    <aside className="fixed bottom-0 right-0 top-0 z-[55] flex w-full max-w-[400px] flex-col border-l border-[#e2e8f0] bg-white shadow-[-12px_0_30px_-12px_rgba(10,30,74,0.35)]">
      <div className="flex items-center gap-[10px] border-b border-[#e8ecf2] bg-gradient-to-r from-[#0A2050] to-[#134698] px-[14px] py-[11px] text-white">
        <span className="relative grid h-[34px] w-[34px] place-items-center rounded-full bg-white/15">
          <BrainCircuit className="h-[17px] w-[17px]" />
          <span className={`absolute -bottom-px -right-px h-[10px] w-[10px] rounded-full border-2 border-[#134698] ${busy || listening || speaking ? "animate-pulse bg-[#fd6e15]" : "bg-[#22c55e]"}`} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold">Test DH Assist</p>
          <p className="truncate text-[8.5px] text-white/80">{headerStatus}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (speakReplies) stopAudio();
            setSpeakReplies((v) => !v);
          }}
          title={speakReplies ? "Replies are read out" : "Replies are not read out"}
          aria-label={speakReplies ? "Turn off voice replies" : "Turn on voice replies"}
          className={`grid h-[28px] w-[28px] place-items-center rounded-full ${speakReplies ? "bg-white text-[#134698]" : "bg-white/15 text-white"}`}
        >
          {speakReplies ? <Volume2 className="h-[14px] w-[14px]" /> : <VolumeX className="h-[14px] w-[14px]" />}
        </button>
        {messages.length > 1 && (
          <button
            type="button"
            onClick={() => {
              stopAudio();
              setMessages(greetingText ? [{ role: "assistant", content: greetingText, note: "Greeting" }] : []);
              flowApi.greeting();
            }}
            className="rounded-full bg-white/15 px-[9px] py-[3px] text-[8.5px] font-bold hover:bg-white/25"
          >
            Restart
          </button>
        )}
        <button type="button" onClick={onClose} aria-label="Close" className="grid h-[28px] w-[28px] place-items-center rounded-full bg-white/15 hover:bg-white/25">
          <X className="h-[14px] w-[14px]" />
        </button>
      </div>
      <div className="flex items-center gap-[6px] border-b border-[#e8ecf2] bg-[#fff7f0] px-[12px] py-[5px] text-[8.5px] text-[#9a3412]">
        <Sparkles className="h-[11px] w-[11px] shrink-0" /> Test only: nothing is saved, no lead is sent. Watch the workflow light up as it works.
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto bg-[#eaf0f8] px-[12px] py-[12px]" style={{ backgroundImage: "url(/chat-doodle.svg)", backgroundSize: "360px 360px" }}>
        <div className="flex flex-col gap-[10px]">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="ml-auto max-w-[82%] whitespace-pre-wrap rounded-[12px] rounded-br-[3px] bg-gradient-to-br from-[#134698] to-[#0A2B5E] px-[11px] py-[8px] text-[10.5px] leading-[1.5] text-white">
                {m.content}
              </div>
            ) : (
              <div key={i} className="max-w-[88%]">
                {m.note && <p className="mb-[2px] pl-[2px] text-[7.5px] font-bold uppercase tracking-wide text-[#e85a05]">{m.note}</p>}
                <div className={`whitespace-pre-wrap rounded-[12px] rounded-bl-[3px] px-[11px] py-[8px] text-[10.5px] leading-[1.5] shadow-sm ring-1 ${m.error ? "bg-red-50 text-red-700 ring-red-200" : "bg-white text-[#1e293b] ring-black/5"}`}>
                  {m.content}
                </div>
                {m.searched?.map((s, k) => (
                  <details key={k} className="mt-[4px] rounded-[8px] bg-white/80 px-[8px] py-[4px] text-[8.5px] text-[#475569] ring-1 ring-[#e2e8f0]">
                    <summary className="flex cursor-pointer items-center gap-[4px] font-semibold text-[#134698]">
                      <Search className="h-[10px] w-[10px]" /> Searched “{s.query}” · {s.results.length} found
                    </summary>
                    <ul className="mt-[4px] flex flex-col gap-[3px]">
                      {s.results.map((r, j) => (
                        <li key={j}>
                          <b className="text-[#0A2B5E]">{r.title || "Website"}</b>
                          {r.url ? <span className="text-[#94a3b8]"> {r.url}</span> : <span className="text-[#e85a05]"> (your note / file)</span>}
                          <span className="block text-[#64748b]">{r.text}…</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            ),
          )}
          {busy && (
            <div className="flex w-fit items-center gap-[6px] rounded-[12px] bg-white px-[11px] py-[8px] text-[9.5px] text-[#64748b] shadow-sm ring-1 ring-black/5">
              <Loader2 className="h-[12px] w-[12px] animate-spin" /> {status || "Thinking…"}
            </div>
          )}
        </div>
      </div>

      {note && <p className="border-t border-[#fde2cc] bg-[#fff7f0] px-[12px] py-[5px] text-[9px] font-semibold text-[#b45309]">{note}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="flex items-end gap-[6px] border-t border-[#e8ecf2] bg-[#f6f8fc] p-[10px]"
      >
        <div className="flex flex-col items-center gap-[3px]">
          <button
            type="button"
            onClick={listen}
            disabled={busy}
            title={listening ? "Stop listening" : "Speak"}
            aria-label={listening ? "Stop listening" : "Speak"}
            className={`relative grid h-[38px] w-[38px] place-items-center rounded-full transition disabled:opacity-50 ${listening ? "bg-red-500 text-white" : "bg-white text-[#134698] ring-1 ring-[#dbe4f3] hover:bg-[#eef3fb]"}`}
          >
            {listening && <span className="absolute inset-0 animate-ping rounded-full bg-red-400/40" />}
            {listening ? <MicOff className="relative h-[16px] w-[16px]" /> : <Mic className="h-[16px] w-[16px]" />}
          </button>
          <button
            type="button"
            onClick={() => setVoiceLang((l) => (l === "en-IN" ? "hi-IN" : "en-IN"))}
            title="The language you will speak in"
            className="rounded-full bg-white px-[6px] text-[7.5px] font-bold text-[#475569] ring-1 ring-[#e2e8f0]"
          >
            {voiceLang === "en-IN" ? "EN" : "हिं"}
          </button>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          rows={1}
          placeholder={listening ? "Listening…" : "Type or tap the mic, e.g. kiosk ka price kya hai?"}
          className="max-h-[90px] min-h-[38px] flex-1 resize-none rounded-[10px] bg-white px-[11px] py-[10px] text-[10.5px] text-[#111b21] outline-none ring-1 ring-[#e3e9f2] focus:ring-[#134698]/30"
        />
        <button type="submit" disabled={!draft.trim() || busy} aria-label="Send" className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] bg-[#fd6e15] text-white transition hover:bg-[#e85a05] disabled:bg-[#fdb98f]">
          <Send className="h-[15px] w-[15px]" />
        </button>
      </form>
    </aside>
  );
}

/* ───────────────────────── Small pieces ───────────────────────── */

const inputCls =
  "h-[34px] w-full rounded-[8px] border border-[#e2e8f0] bg-white px-[10px] text-[10.5px] text-[#1e293b] outline-none transition placeholder:text-[#94a3b8] focus:border-[#134698]/40 focus:ring-2 focus:ring-[#134698]/10";
const primaryBtn =
  "flex h-[32px] items-center justify-center gap-[6px] rounded-[8px] bg-[#0A2B5E] px-[14px] text-[10px] font-bold text-white transition hover:bg-[#134698] disabled:cursor-not-allowed disabled:opacity-50";
const ghostBtn =
  "flex h-[26px] items-center gap-[4px] rounded-[7px] border border-[#e2e8f0] bg-white px-[9px] text-[9px] font-semibold text-[#475569] transition hover:border-[#134698]/40 hover:text-[#0A2B5E] disabled:opacity-50";

function Card({ icon, title, hint, children }: { icon: ReactNode; title: string; hint: string; children: ReactNode }) {
  return (
    <div className="rounded-[12px] border border-[#e2e8f0] bg-white p-[14px]" style={{ boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.08) 0px 0px 0px 1px" }}>
      <div className="mb-[10px] flex items-start gap-[8px]">
        <span className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-[8px] bg-[#fff1e6] text-[#e85a05]">{icon}</span>
        <div>
          <p className="text-[11.5px] font-bold text-[#0A2B5E]">{title}</p>
          <p className="text-[9px] leading-[1.45] text-[#64748b]">{hint}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title, hint }: { icon: ReactNode; title: string; hint: string }) {
  return (
    <div className="mb-[8px] flex items-start gap-[7px]">
      <span className="mt-[1px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[6px] bg-[#0A2B5E] text-white">{icon}</span>
      <div>
        <p className="text-[11.5px] font-bold text-[#0A2B5E]">{title}</p>
        {hint && <p className="text-[9px] text-[#64748b]">{hint}</p>}
      </div>
    </div>
  );
}

function Expandable({ icon, title, meta, text }: { icon: ReactNode; title: string; meta: string; text: string }) {
  return (
    <details className="group rounded-[12px] border border-[#e2e8f0] bg-white p-[10px] open:shadow-[0_8px_20px_-14px_rgba(10,30,74,0.4)]">
      <summary className="flex cursor-pointer list-none items-center gap-[9px]">
        <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[8px] bg-[#eef3fb] text-[#134698]">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[10.5px] font-bold text-[#0A2B5E]">{title}</span>
          <span className="block truncate text-[8px] text-[#94a3b8]">{meta}</span>
        </span>
        <ChevronRight className="h-[14px] w-[14px] shrink-0 text-[#94a3b8] transition group-open:rotate-90" />
      </summary>
      <pre className="mt-[8px] max-h-[260px] overflow-auto whitespace-pre-wrap rounded-[8px] bg-[#f8fafc] p-[9px] font-sans text-[9.5px] leading-[1.55] text-[#334155] ring-1 ring-[#e6ebf2]">{text}</pre>
    </details>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-[4px] text-[9.5px] font-bold text-[#0A2B5E]">
        {label}
        {hint && <span className="ml-[6px] font-normal text-[#94a3b8]">{hint}</span>}
      </p>
      {children}
    </div>
  );
}

function IconInput({ icon, value, onChange, placeholder }: { icon: ReactNode; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex gap-[6px]">
      <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[8px] bg-[#eef3fb] text-[#134698]">{icon}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    </div>
  );
}

function LangSwitch({ lang, onChange }: { lang: "en" | "hi"; onChange: (l: "en" | "hi") => void }) {
  return (
    <div className="inline-flex rounded-full bg-[#f1f5f9] p-[3px]">
      {(["en", "hi"] as const).map((l) => (
        <button key={l} type="button" onClick={() => onChange(l)} className={`rounded-full px-[12px] py-[4px] text-[9.5px] font-bold transition ${lang === l ? "bg-[#0A2B5E] text-white shadow" : "text-[#475569]"}`}>
          {l === "en" ? "English" : "Hindi (Hinglish)"}
        </button>
      ))}
    </div>
  );
}

function SavedBadge({ saved, settings, unsavedText = "Built-in lines (not changed yet)" }: { saved: boolean; settings: ChatbotSettings; unsavedText?: string }) {
  return (
    <p className={`mb-[10px] inline-flex items-center gap-[5px] rounded-full px-[9px] py-[3px] text-[8.5px] font-semibold ${saved ? "bg-[#e8f8ee] text-[#15803d]" : "bg-[#f1f5f9] text-[#64748b]"}`}>
      {saved ? <Check className="h-[10px] w-[10px]" /> : <Sparkles className="h-[10px] w-[10px]" />}
      {saved ? `Saved${settings.updatedBy ? ` by ${settings.updatedBy}` : ""}${settings.updatedAt ? ` · ${when(settings.updatedAt)}` : ""}` : unsavedText}
    </p>
  );
}

function SaveRow({ busy, changed, onSave, onReset }: { busy: boolean; changed: boolean; onSave: () => void; onReset?: () => void }) {
  return (
    <div className="mt-[12px] flex flex-wrap items-center gap-[8px]">
      <button type="button" onClick={onSave} disabled={busy || !changed} className={primaryBtn}>
        {busy ? <Loader2 className="h-[13px] w-[13px] animate-spin" /> : <Check className="h-[13px] w-[13px]" />} Save
      </button>
      {onReset && (
        <button type="button" onClick={onReset} disabled={busy} className={ghostBtn}>
          <RotateCcw className="h-[11px] w-[11px]" /> Reset to default
        </button>
      )}
      {!changed && <span className="text-[8.5px] text-[#94a3b8]">No changes</span>}
    </div>
  );
}

function Preview({ title, lines }: { title: string; lines: { bold?: string; text: string }[] }) {
  return (
    <div className="h-fit rounded-[14px] p-[12px] ring-1 ring-[#e2e8f0]" style={{ backgroundColor: "#eaf0f8", backgroundImage: "url(/chat-doodle.svg)", backgroundSize: "360px 360px" }}>
      <p className="mb-[8px] text-[8.5px] font-bold uppercase tracking-[0.08em] text-[#64748b]">{title}</p>
      <div className="flex flex-col gap-[8px]">
        {lines
          .filter((l) => l.text || l.bold)
          .map((l, i) => (
            <div key={i} className="flex items-start gap-[7px]">
              <span className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#134698] to-[#0A2B5E] text-white">
                <BrainCircuit className="h-[13px] w-[13px]" />
              </span>
              <div className="max-w-[260px] rounded-[12px] rounded-tl-[3px] bg-white px-[10px] py-[7px] text-[10px] leading-[1.5] text-[#1e293b] shadow-sm ring-1 ring-black/5">
                {l.bold && <p className="font-bold text-[#0A2B5E]">{l.bold}</p>}
                <p className="whitespace-pre-wrap">{l.text}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function Empty({ icon, text, hint }: { icon: ReactNode; text: string; hint: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[6px] rounded-[12px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-[24px] text-center text-[#94a3b8]">
      {icon}
      <p className="text-[10.5px] font-bold text-[#475569]">{text}</p>
      <p className="max-w-[320px] text-[9px]">{hint}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] bg-[#f8fafc] px-[11px] py-[8px] ring-1 ring-[#e6ebf2]">
      <p className="text-[8px] font-semibold uppercase tracking-[0.06em] text-[#94a3b8]">{label}</p>
      <p className="mt-[2px] truncate text-[12px] font-bold text-[#0A2B5E]">{value}</p>
    </div>
  );
}

function Switch({ checked, onChange, disabled }: { checked: boolean; onChange: (on: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      title={checked ? "On: DH Assist uses this" : "Off: DH Assist ignores this"}
      className={`relative h-[20px] w-[36px] shrink-0 rounded-full transition ${checked ? "bg-[#22c55e]" : "bg-[#cbd5e1]"} disabled:opacity-60`}
    >
      <span className={`absolute top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-[2px]"}`} />
    </button>
  );
}
