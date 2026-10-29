import type { MockRoute } from "../http";
import { currentAdmin } from "../fixtures/admin";
import { APPLICATIONS_BOARD, CAREER_OPTIONS, HR_SETTINGS, JOBS, careerDashboard } from "../fixtures/careers";
import { defineCollection } from "../store";

type Rows = Record<string, unknown>[];

defineCollection("/careers/admin/jobs", JOBS as unknown as Rows);

const events: Record<string, { _id: string; oldStatus?: string; newStatus: string; changedBy?: string; note?: string; createdAt: string }[]> = {};

/** Careers dashboard, AI-screened applications, HR forwarding and dropdown options */
export const careerRoutes: MockRoute[] = [
  { method: "GET", match: /^\/careers\/admin\/dashboard$/, handle: ({ query }) => careerDashboard(query.get("range") ?? "30d") },
  { method: "GET", match: /^\/careers\/admin\/applications-board$/, handle: () => APPLICATIONS_BOARD },
  {
    method: "GET",
    match: /^\/careers\/admin\/applications\/([^/]+)$/,
    handle: ({ params }) => ({ events: events[params[0] ?? ""] ?? [{ _id: "ev-0", newStatus: "Submitted", changedBy: "Candidate", createdAt: new Date(Date.now() - 86_400_000).toISOString() }] }),
  },
  {
    method: "PATCH",
    match: /^\/careers\/admin\/applications\/([^/]+)\/hr$/,
    handle: ({ params, body }) => {
      const id = params[0] ?? "";
      const update = body as { hrStatus?: string; note?: string; forward?: { recipients: string[] } };
      const app = APPLICATIONS_BOARD.find((a) => a.id === id);
      if (app && update.hrStatus) {
        (events[id] ??= []).unshift({ _id: `ev-${Date.now()}`, oldStatus: app.hrStatus, newStatus: update.hrStatus, changedBy: currentAdmin().name, note: update.note, createdAt: new Date().toISOString() });
        (app as { hrStatus: string }).hrStatus = update.hrStatus;
        app.updatedByHrOn = new Date().toISOString();
      }
      return update.forward
        ? { email: HR_SETTINGS.notifyHr ? { sent: true } : { sent: false, skipped: true }, recipients: { to: update.forward.recipients, cc: [], bcc: [] } }
        : { email: null, recipients: null };
    },
  },
  {
    method: "POST",
    match: /^\/careers\/admin\/applications\/([^/]+)\/notes$/,
    handle: ({ params, body }) => {
      const app = APPLICATIONS_BOARD.find((a) => a.id === params[0]);
      if (app) app.notes = String((body as { note?: string })?.note ?? "");
      return { success: true };
    },
  },
  {
    match: /^\/careers\/admin\/hr-settings$/,
    handle: ({ method, body }) => {
      if (method === "PUT" && body) Object.assign(HR_SETTINGS, body, { updatedAt: new Date().toISOString() });
      return HR_SETTINGS;
    },
  },
  { method: "GET", match: /^\/careers\/admin\/options$/, handle: ({ query }) => CAREER_OPTIONS.filter((o) => o.type === query.get("type")) },
  {
    method: "POST",
    match: /^\/careers\/admin\/jobs\/generate-description$/,
    handle: ({ body }) => {
      const { title = "Interior Designer", department = "Design" } = (body ?? {}) as { title?: string; department?: string };
      return {
        opportunity: `Design House is hiring a ${title} for its ${department} team to deliver retail, corporate and exhibition projects across India.`,
        keyResponsibilities: ["Prepare layouts, drawings and 3D views.", "Coordinate with factory, vendors and site teams.", "Ensure quality and on-time handover."],
        whoCanApply: ["Relevant degree or diploma.", "Hands-on project experience.", "Willing to visit project sites."],
        requiredSkills: ["AutoCAD", "SketchUp", "Client communication"],
        preferredSkills: ["3ds Max / V-Ray", "BOQ preparation"],
        targetIndustrySegments: ["Retail", "Corporate", "Hospitality", "Exhibitions"],
        specificExperience: "Turnkey interior or exhibition projects.",
        reportingTo: "Senior Manager — Projects",
        kras: [{ label: "Project delivery", result: "Projects handed over on schedule" }],
        kpis: [{ label: "On-time handover", measurement: "% of projects delivered by the agreed date" }],
        referenceIndustries: ["Interior Design", "Retail Fit-out", "Exhibitions"],
        screeningQuestions: ["Share a project you are most proud of.", "What is your notice period?"],
      };
    },
  },
];
