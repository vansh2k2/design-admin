import type { ChatDetail, ChatMessage, ChatStats, ChatSummary, InboxPriority, InboxStatus } from "@/lib/chatbotApi";
import type { KnowledgeSourceRow, ManagerData, ReviewQueueItem } from "@/lib/chatbotManagerApi";

import { CONTACTS, STAFF, daysAgo, pick } from "./common";

/* DH Assist — the website chatbot. Conversations are fictional sample visitors. */

const CONVERSATIONS: { page: string; turns: [string, string][]; request?: ChatSummary["requests"] }[] = [
  {
    page: "/services/retail-interior",
    turns: [
      ["We are opening 6 new apparel stores in NCR. Do you handle complete retail interiors?", "Yes. Design House delivers turnkey retail interiors — design, fabrication, civil, electrical and installation — across India. For a 6-store rollout we create one master design and replicate it with consistent quality. Can I take your contact details so our retail team can call you?"],
      ["Sure, what is the usual timeline per store?", "A typical 1,500–2,500 sq ft store takes 4–6 weeks from design approval to handover. Rollouts can run stores in parallel."],
    ],
  },
  {
    page: "/services/exhibitions",
    turns: [
      ["Need a 36 sqm stall design for IHGF Delhi Fair. Can you quote?", "Absolutely. We design and fabricate custom exhibition stalls, including graphics, lighting and on-site installation. Please share your company name and preferred contact time and our exhibitions team will send a quotation."],
    ],
    request: [{ type: "stall-quotation", stallSize: "36 sqm", company: "Aroma Organic Foods", createdAt: daysAgo(1, 15, 20) }],
  },
  {
    page: "/services/corporate-interior",
    turns: [
      ["Do you design offices? We have 12,000 sq ft in Noida Sector 62.", "Yes — corporate interiors are one of our core services: space planning, workstations, cabins, meeting rooms, breakout zones and complete fit-outs. Would you like a site visit from our corporate team?"],
      ["Yes please, weekday mornings work.", "Noted. Our team will call you to schedule the site visit."],
    ],
    request: [{ type: "sales-callback", company: "TechNova Solutions", preferredTime: "Weekday 10–12 am", createdAt: daysAgo(2, 11, 5) }],
  },
  {
    page: "/services/retail-kiosk",
    turns: [["What is the price of a mall kiosk for mobile accessories?", "Kiosk pricing depends on size, materials and finishes. Most 8×6 ft mall kiosks fall in the ₹3.5–6 lakh range including fabrication and installation. Share your mall and brand guidelines and we will send an exact quote."]],
  },
  {
    page: "/services/restaurant-interior",
    turns: [["Can you redesign our cafe? It's about 900 sq ft.", "Yes. We create cafe and restaurant interiors that improve seating, kitchen flow and ambience. Would you like to see our hospitality projects?"]],
  },
  {
    page: "/career",
    turns: [["Are you hiring interior designers?", "Yes — current openings are listed on our Careers page. You can upload your CV there and our AI screening shows how well you match the role."]],
  },
  {
    page: "/contact",
    turns: [["Where is your office?", "Our head office is at Loni Road Industrial Area, Mohan Nagar, Ghaziabad, with branches in Kalkaji (New Delhi) and Lower Parel (Mumbai)."]],
  },
  {
    page: "/",
    turns: [["Do you work outside Delhi NCR?", "Yes, we execute projects pan-India — we have delivered 5000+ projects across 40+ cities."]],
  },
];

const STATUSES: InboxStatus[] = ["New", "In Progress", "Follow-up", "Assigned", "Waiting for Visitor", "Resolved"];
const PRIORITIES: InboxPriority[] = ["High", "Medium", "Low"];

function messagesFor(index: number, created: string): ChatMessage[] {
  const convo = pick(CONVERSATIONS, index);
  const start = new Date(created).getTime();
  return convo.turns.flatMap(([question, reply], turn) => [
    { role: "user" as const, content: question, createdAt: new Date(start + turn * 120_000).toISOString() },
    { role: "assistant" as const, content: reply, createdAt: new Date(start + turn * 120_000 + 4_000).toISOString() },
  ]);
}

function buildChat(index: number): ChatDetail {
  const contact = pick(CONTACTS, index);
  const convo = pick(CONVERSATIONS, index);
  const created = daysAgo(Math.floor(index / 2), 9 + (index % 9), (index * 13) % 60);
  const verified = index % 3 !== 2;
  const staff = pick(STAFF, index + 3);
  const status = pick(STATUSES, index);
  return {
    _id: `chat-${index + 1}`,
    sessionId: `dh-session-${(1000 + index).toString(36)}`,
    lead: verified ? { name: contact.name, email: contact.email, phone: contact.phone } : undefined,
    visitorName: verified ? undefined : `Visitor 103.${40 + index}.x.x`,
    visitor: { ip: `103.${40 + index}.${12 + index}.${80 + index}`, userAgent: index % 2 ? "Chrome on Android" : "Chrome on Windows" },
    phoneVerifiedAt: verified ? created : undefined,
    feedback: index % 4 === 0 ? "yes" : index % 7 === 0 ? "no" : undefined,
    requests: convo.request,
    pageUrl: `https://www.designhouse.co.in${convo.page}`,
    whatsappSentAt: verified ? created : undefined,
    source: "chat",
    workflow: {
      assignedTo: status === "New" ? undefined : staff.name,
      team: status === "New" ? undefined : staff.team,
      status,
      priority: pick(PRIORITIES, index),
      followUpKind: status === "Follow-up" ? "date" : "none",
      followUpAt: status === "Follow-up" ? daysAgo(-1, 11) : undefined,
      resolvedAt: status === "Resolved" ? daysAgo(0, 10) : undefined,
      activity: status === "New" ? [] : [{ kind: "note", text: "Called the visitor and shared our project portfolio.", by: staff.name, at: daysAgo(0, 10, 30) }],
    },
    createdAt: created,
    updatedAt: created,
    messages: messagesFor(index, created),
  };
}

export const CHATS: ChatDetail[] = Array.from({ length: 16 }, (_, index) => buildChat(index));

export function chatSummaries(): ChatSummary[] {
  return CHATS.map(({ messages, ...chat }) => ({
    ...chat,
    messageCount: messages.length,
    questionCount: messages.filter((m) => m.role === "user").length,
    firstQuestion: messages.find((m) => m.role === "user"),
    lastMessage: messages[messages.length - 1],
  }));
}

export function chatStats(): ChatStats {
  const summaries = chatSummaries();
  return {
    totals: {
      chats: 412,
      leads: 138,
      questions: 1186,
      replies: 1174,
      whatsappSent: 121,
      engaged: 296,
      verifiedLeads: 104,
      handovers: 47,
      feedbackYes: 182,
      feedbackNo: 14,
      unanswered: 9,
      returningVisitors: 63,
    },
    popularQuestions: [
      { question: "What is the cost of a retail store interior?", count: 64 },
      { question: "Do you design exhibition stalls?", count: 51 },
      { question: "How long does an office fit-out take?", count: 38 },
      { question: "Do you work outside Delhi NCR?", count: 33 },
      { question: "Can I see your restaurant projects?", count: 27 },
      { question: "Are you hiring interior designers?", count: 19 },
    ],
    followUp: { unassigned: 5, overdue: 2, dueToday: 3, openComplaints: 1 },
    contentUpdatedAt: daysAgo(3, 16),
    daily: Array.from({ length: 14 }, (_, i) => ({ date: daysAgo(13 - i).slice(0, 10), chats: 18 + ((i * 7) % 15), questions: 52 + ((i * 11) % 30) })),
    topPages: [
      { pageUrl: "https://www.designhouse.co.in/", chats: 141 },
      { pageUrl: "https://www.designhouse.co.in/services/retail-interior", chats: 74 },
      { pageUrl: "https://www.designhouse.co.in/services/exhibitions", chats: 58 },
      { pageUrl: "https://www.designhouse.co.in/services/corporate-interior", chats: 46 },
      { pageUrl: "https://www.designhouse.co.in/contact", chats: 39 },
    ],
    latestQuestions: summaries.slice(0, 8).map((chat) => ({
      _id: `${chat._id}-q`,
      chatId: chat._id,
      name: chat.lead?.name ?? chat.visitorName,
      content: chat.firstQuestion?.content ?? "",
      createdAt: chat.createdAt,
    })),
  };
}

export const MANAGER_DATA: ManagerData = {
  draft: {},
  pending: false,
  versions: [
    { minor: 3, note: "Added exhibition stall pricing answers", by: "Karan Mehta", date: daysAgo(3, 16) },
    { minor: 2, note: "Updated office addresses and timings", by: "Neha Kapoor", date: daysAgo(18, 12) },
    { minor: 1, note: "First version of DH Assist", by: "Vijay Sharma", date: daysAgo(45, 11) },
  ],
  changes: { buttons: 0, answers: 0, sources: 0, forms: 0, settings: 0 },
  ai: { configured: true, model: "claude-sonnet-5" },
};

export const KNOWLEDGE_SOURCES: KnowledgeSourceRow[] = [
  { _id: "src-1", name: "Design House website — Services", kind: "web", url: "https://www.designhouse.co.in/services", includeLinked: true, frequency: "Weekly", topic: "Services", owner: "Karan Mehta", status: "Published", checkedAt: daysAgo(2, 9), chars: 18640, preview: "Retail Interior, Corporate Interior, Restaurant Interior, Shop in Shop, Retail Display Merchandising, Retail Kiosk, Exhibitions & Events…" },
  { _id: "src-2", name: "About Design House", kind: "web", url: "https://www.designhouse.co.in/about", includeLinked: false, frequency: "Monthly", topic: "Company", owner: "Karan Mehta", status: "Published", checkedAt: daysAgo(6, 9), chars: 6210, preview: "Design House India Private Limited is a premier manufacturer of retail display solutions with nationwide reach…" },
  { _id: "src-3", name: "Company Profile 2026.pdf", kind: "pdf", topic: "Company", owner: "Neha Kapoor", status: "Published", checkedAt: daysAgo(20, 15), chars: 24410, preview: "5000+ projects · 40+ cities · Turnkey interiors, exhibitions and retail display manufacturing…" },
  { _id: "src-4", name: "Exhibition stall pricing guide", kind: "manual", topic: "Exhibitions", owner: "Rahul Verma", status: "Update pending", checkedAt: daysAgo(1, 17), chars: 2980, pendingChars: 3240, preview: "Shell scheme upgrades, custom stalls per sqm, double-decker stalls, graphics and lighting packages…" },
  { _id: "src-5", name: "Careers page", kind: "web", url: "https://www.designhouse.co.in/career", includeLinked: false, frequency: "Daily", topic: "Careers", owner: "Sneha Joshi", status: "Published", checkedAt: daysAgo(0, 8), chars: 4120, preview: "Architectural Designer · Project Manager · Construction Manager · BIM Specialist…" },
];

export const REVIEW_QUEUE: ReviewQueueItem[] = [
  { key: "warranty", question: "Do you give warranty on modular furniture?", asked: 7, visitorMessage: "what warranty on modular kitchen and wardrobes?", botReply: "I don't have warranty details yet. Our team will contact you.", lastAskedAt: daysAgo(0, 12) },
  { key: "emi", question: "Is EMI available for home interiors?", asked: 4, visitorMessage: "can i pay in emi", botReply: "I'm not sure about EMI options. Please leave your number.", lastAskedAt: daysAgo(1, 18) },
  { key: "dubai", question: "Do you execute projects in Dubai?", asked: 3, visitorMessage: "we need a stall at Gulfood Dubai, do you work there?", botReply: "Let me connect you with our exhibitions team.", lastAskedAt: daysAgo(2, 14) },
];
