import { MockHttpError, type MockRoute } from "../http";
import { currentAdmin } from "../fixtures/admin";
import { CHATS, KNOWLEDGE_SOURCES, MANAGER_DATA, REVIEW_QUEUE, chatStats, chatSummaries } from "../fixtures/chatbot";

/* Chat Visitors in demo mode: built from the sample chats; blocks and closes are kept in memory */
const demoBlocks = new Map<string, { reason?: string; by: string }>([["103.43.13.81", { reason: "Abusive messages", by: "system" }]]);
const demoClosed = new Set<string>(["103.45.15.83"]);

function demoVisitors() {
  const byIp = new Map<string, Record<string, unknown> & { ip: string; chats: number; messages: number; lastAt: string; firstAt: string }>();
  for (const chat of [...CHATS].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))) {
    const ip = chat.visitor?.ip;
    if (!ip) continue;
    const row = byIp.get(ip);
    const last = [...chat.messages].reverse().find((m) => m.content);
    if (!row) {
      byIp.set(ip, {
        ip,
        name: chat.lead?.name ?? "",
        phone: chat.lead?.phone ?? "",
        email: chat.lead?.email ?? "",
        userAgent: chat.visitor?.userAgent ?? "",
        pageUrl: chat.pageUrl ?? "",
        chats: 1,
        messages: chat.messages.length,
        firstAt: chat.createdAt,
        lastAt: chat.updatedAt,
        lastChatId: chat._id,
        lastMessage: last,
        chatOpen: !demoClosed.has(ip),
        status: demoBlocks.has(ip) ? "blocked" : "active",
        blockedForever: demoBlocks.has(ip),
        blockReason: demoBlocks.get(ip)?.reason,
        blockedBy: demoBlocks.get(ip)?.by,
        strikes: demoBlocks.has(ip) ? 4 : 0,
      });
    } else {
      row.chats += 1;
      row.messages += chat.messages.length;
      if (chat.createdAt < row.firstAt) row.firstAt = chat.createdAt;
    }
  }
  return [...byIp.values()];
}

const visitorRoutes: MockRoute[] = [
  {
    method: "GET",
    match: /^\/admin\/chats\/visitors$/,
    handle: ({ query }) => {
      let rows = demoVisitors();
      const today = new Date().toDateString();
      const counts = {
        all: rows.length,
        active: rows.filter((r) => r.status === "active").length,
        blocked: rows.filter((r) => r.status === "blocked").length,
        open: rows.filter((r) => r.chatOpen).length,
        closed: rows.filter((r) => !r.chatOpen).length,
        today: rows.filter((r) => new Date(r.lastAt).toDateString() === today).length,
      };
      const status = query.get("status") ?? "all";
      if (status === "active" || status === "blocked") rows = rows.filter((r) => r.status === status);
      if (status === "open") rows = rows.filter((r) => r.chatOpen);
      if (status === "closed") rows = rows.filter((r) => !r.chatOpen);
      const search = (query.get("search") ?? "").toLowerCase();
      if (search) rows = rows.filter((r) => [r.name, r.phone, r.email, r.ip].some((v) => String(v ?? "").toLowerCase().includes(search)));
      return { visitors: rows, counts };
    },
  },
  {
    method: "GET",
    match: /^\/admin\/chats\/visitors\/([^/]+)$/,
    handle: ({ params }) => {
      const ip = decodeURIComponent(params[0]);
      const chats = CHATS.filter((c) => c.visitor?.ip === ip);
      if (!chats.length) throw new MockHttpError(404, "No chats from this visitor");
      return {
        ip,
        status: demoBlocks.has(ip) ? "blocked" : "active",
        chats: chats.map((c) => ({ ...c, closed: demoClosed.has(ip) })),
      };
    },
  },
  {
    method: "POST",
    match: /^\/admin\/chats\/visitors\/([^/]+)\/block$/,
    handle: ({ params, body }) => {
      demoBlocks.set(decodeURIComponent(params[0]), { reason: (body as { reason?: string })?.reason, by: currentAdmin().name });
      return null;
    },
  },
  {
    method: "POST",
    match: /^\/admin\/chats\/visitors\/([^/]+)\/unblock$/,
    handle: ({ params }) => {
      demoBlocks.delete(decodeURIComponent(params[0]));
      return null;
    },
  },
  {
    method: "POST",
    match: /^\/admin\/chats\/visitors\/([^/]+)\/close$/,
    handle: ({ params }) => {
      demoClosed.add(decodeURIComponent(params[0]));
      return { closed: 1 };
    },
  },
  {
    method: "POST",
    match: /^\/admin\/chats\/visitors\/([^/]+)\/clear$/,
    handle: ({ params, query }) => {
      const ip = decodeURIComponent(params[0]);
      const mine = CHATS.filter((c) => c.visitor?.ip === ip).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      const emptied = query.get("scope") === "last" ? mine.slice(0, 1) : mine;
      for (const chat of emptied) chat.messages = [];
      return { cleared: emptied.length };
    },
  },
  {
    method: "DELETE",
    match: /^\/admin\/chats\/visitors\/([^/]+)\/history$/,
    handle: ({ params, query }) => {
      const ip = decodeURIComponent(params[0]);
      const mine = CHATS.filter((c) => c.visitor?.ip === ip).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      const doomed = query.get("scope") === "last" ? mine.slice(0, 1) : mine;
      for (const chat of doomed) CHATS.splice(CHATS.indexOf(chat), 1);
      return { deleted: doomed.length };
    },
  },
];

/** DH Assist chatbot: conversations, inbox workflow, manager drafts, knowledge sources */
export const chatbotRoutes: MockRoute[] = [
  ...visitorRoutes,
  { method: "GET", match: /^\/admin\/chats\/stats$/, handle: () => chatStats() },
  {
    method: "GET",
    match: /^\/admin\/chats$/,
    handle: ({ query }) => {
      const search = (query.get("search") ?? "").toLowerCase();
      const chats = chatSummaries().filter(
        (c) => !search || [c.lead?.name, c.lead?.phone, c.lead?.email, c.firstQuestion?.content].some((v) => v?.toLowerCase().includes(search)),
      );
      const limit = Number(query.get("limit") ?? 20);
      const page = Number(query.get("page") ?? 1);
      return { chats: chats.slice((page - 1) * limit, page * limit), total: chats.length, page, limit, totalPages: Math.max(1, Math.ceil(chats.length / limit)) };
    },
  },
  {
    method: "GET",
    match: /^\/admin\/chats\/([^/]+)$/,
    handle: ({ params }) => {
      const chat = CHATS.find((c) => c._id === params[0]);
      if (!chat) throw new MockHttpError(404, "Chat not found");
      return chat;
    },
  },
  {
    method: "PUT",
    match: /^\/admin\/chats\/workflow$/,
    handle: ({ body }) => {
      const items = (body as { items?: { id: string }[] })?.items ?? [];
      for (const { id, ...update } of items) {
        const chat = CHATS.find((c) => c._id === id);
        if (chat) chat.workflow = { ...chat.workflow, ...update, updatedAt: new Date().toISOString() };
      }
      return { matched: items.length, modified: items.length };
    },
  },
  { method: "POST", match: /^\/admin\/chats\/manual$/, handle: () => ({ id: `manual-${Date.now()}`, createdAt: new Date().toISOString() }) },
  { method: "GET", match: /^\/admin\/chatbot\/manager$/, handle: () => MANAGER_DATA },
  {
    method: "PUT",
    match: /^\/admin\/chatbot\/manager\/draft$/,
    handle: ({ body }) => {
      const { section, data } = body as { section: keyof typeof MANAGER_DATA.draft; data: unknown };
      MANAGER_DATA.draft[section] = data;
      MANAGER_DATA.pending = true;
      return { pending: true };
    },
  },
  { method: "POST", match: /^\/admin\/chatbot\/manager\/restore$/, handle: () => ({ draft: MANAGER_DATA.draft, pending: true }) },
  {
    method: "POST",
    match: /^\/admin\/chatbot\/manager\/publish$/,
    handle: ({ body }) => {
      const minor = (MANAGER_DATA.versions[0]?.minor ?? 0) + 1;
      MANAGER_DATA.versions.unshift({ minor, note: (body as { note?: string })?.note || "Published changes", by: currentAdmin().name, date: new Date().toISOString() });
      MANAGER_DATA.pending = false;
      return { versions: MANAGER_DATA.versions, pending: false };
    },
  },
  { method: "GET", match: /^\/admin\/chatbot\/sources$/, handle: () => KNOWLEDGE_SOURCES },
  { method: "POST", match: /^\/admin\/chatbot\/sources\/check$/, handle: () => ({ changed: 0, sources: KNOWLEDGE_SOURCES }) },
  {
    method: "POST",
    match: /^\/admin\/chatbot\/sources\/([^/]+)\/refresh$/,
    handle: ({ params }) => ({ changed: false, source: KNOWLEDGE_SOURCES.find((s) => s._id === params[0]) }),
  },
  {
    method: "POST",
    match: /^\/admin\/chatbot\/sources$/,
    handle: ({ body }) => {
      const src = (body instanceof FormData ? Object.fromEntries(body.entries()) : body) as Record<string, string>;
      const row: (typeof KNOWLEDGE_SOURCES)[number] = {
        _id: `src-${Date.now()}`,
        name: String(src.name ?? "New source"),
        kind: (src.kind as "web" | "pdf" | "manual") ?? "manual",
        url: src.url,
        topic: String(src.topic ?? "General"),
        owner: String(src.owner ?? currentAdmin().name),
        status: "Draft",
        checkedAt: new Date().toISOString(),
        chars: 1200,
        preview: String(src.text ?? src.answerEn ?? src.url ?? "New knowledge source"),
      };
      KNOWLEDGE_SOURCES.unshift(row);
      return row;
    },
  },
  {
    match: /^\/admin\/chatbot\/sources\/([^/]+)$/,
    handle: ({ method, params, body }) => {
      const index = KNOWLEDGE_SOURCES.findIndex((s) => s._id === params[0]);
      if (method === "DELETE") {
        if (index >= 0) KNOWLEDGE_SOURCES.splice(index, 1);
        return null;
      }
      const row = KNOWLEDGE_SOURCES[index];
      if (row) Object.assign(row, body, (body as { action?: string })?.action === "approve" ? { status: "Published", pendingChars: undefined } : {});
      return row;
    },
  },
  {
    method: "POST",
    match: /^\/admin\/chatbot\/test$/,
    handle: ({ body }) => {
      const question = String((body as { question?: string })?.question ?? "").toLowerCase();
      const found = /stall|exhibit|office|retail|store|kiosk|restaurant|cafe|price|cost|address|office|career/.test(question);
      return {
        found,
        text: found
          ? "Design House delivers turnkey interiors, retail display and exhibition stalls across India. Share your city, area and timeline and our team will send a detailed quotation."
          : "I don't have an approved answer for that yet. I've noted your question and our team will get back to you.",
      };
    },
  },
  { method: "GET", match: /^\/admin\/chatbot\/review$/, handle: () => REVIEW_QUEUE },
  { method: "POST", match: /^\/admin\/chatbot\/review\/dismiss$/, handle: () => null },

];
