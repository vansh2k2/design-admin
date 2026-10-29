import type { RangeKey } from "@/components/infrastructure/monitoring-types";

import { MockHttpError, type MockRoute } from "../http";
import {
  ALERTS,
  ASSETS,
  CERTIFICATES,
  DOMAIN_ANALYTICS,
  INFRA_SETTINGS,
  PROVIDERS,
  SUBSCRIPTION_ROWS,
  assetDetail,
  fleet,
  infraDashboard,
  metrics,
  monitoringStatus,
  renewals,
} from "../fixtures/infrastructure";

const BASE = "^\/v1\/infrastructure";
const r = (path: string) => new RegExp(`${BASE}${path}$`);

const paged = <T,>(items: T[]) => ({ items, total: items.length, page: 1, limit: 50 });

/** Infrastructure module: servers, domains, certificates, billing, providers, alerts, monitoring */
export const infrastructureRoutes: MockRoute[] = [
  { method: "GET", match: r("\/dashboard"), handle: () => infraDashboard() },
  { method: "GET", match: r("\/capabilities"), handle: () => ({ billingRead: true, sensitiveDns: true, encryptionConfigured: true, permissions: { manage: true, billingRead: true, billingWrite: true, integrationsRead: true, integrationsWrite: true } }) },
  { method: "GET", match: r("\/servers\/fleet"), handle: () => fleet() },
  { method: "GET", match: r("\/servers"), handle: () => paged(ASSETS.filter((a) => a.type === "SERVER")) },
  { method: "GET", match: r("\/domains\/analytics"), handle: () => DOMAIN_ANALYTICS },
  { method: "GET", match: r("\/domains"), handle: () => paged(ASSETS.filter((a) => a.type === "DOMAIN")) },
  { method: "GET", match: r("\/metrics\/fleet"), handle: ({ query }) => metrics((query.get("range") as RangeKey) ?? "24h") },
  { method: "GET", match: r("\/assets\/([^/]+)\/monitoring"), handle: ({ params }) => monitoringStatus(params[0] ?? "") },
  { method: "GET", match: r("\/assets\/([^/]+)\/metrics"), handle: ({ query }) => metrics((query.get("range") as RangeKey) ?? "24h", [34, 61, 48]) },
  { method: "GET", match: r("\/assets\/([^/]+)\/provider-details"), handle: () => ({ available: false, reason: "not_supported", message: "Snapshots are not tracked for this server.", snapshots: [], audits: [], errors: [] }) },
  {
    method: "GET",
    match: r("\/assets\/([^/]+)"),
    handle: ({ params }) => {
      const detail = assetDetail(params[0] ?? "");
      if (!detail) throw new MockHttpError(404, "Asset not found");
      return detail;
    },
  },
  { method: "GET", match: r("\/certificates"), handle: () => CERTIFICATES },
  { method: "GET", match: r("\/subscriptions"), handle: () => SUBSCRIPTION_ROWS },
  { method: "GET", match: r("\/renewals"), handle: () => { const items = renewals(); return { generatedAt: new Date().toISOString(), items, total: items.length }; } },
  { method: "GET", match: r("\/billing\/payments"), handle: () => Array.from({ length: 6 }, (_, i) => { const d = new Date(); d.setMonth(d.getMonth() - (5 - i)); return { month: d.toISOString().slice(0, 7), totals: [{ currency: "INR", amount: i % 6 === 2 ? 15114 : 6826 }] }; }) },
  { method: "GET", match: r("\/providers"), handle: () => PROVIDERS },
  { method: "GET", match: r("\/alerts"), handle: () => ({ ...paged(ALERTS), openCount: ALERTS.filter((a) => a.state === "OPEN").length }) },
  {
    method: "POST",
    match: r("\/alerts\/([^/]+)\/action"),
    handle: ({ params, body }) => {
      const alert = ALERTS.find((a) => a.id === params[0]);
      const action = (body as { action?: string })?.action;
      if (alert) alert.state = action === "resolve" ? "RESOLVED" : action === "snooze" ? "SNOOZED" : "ACKNOWLEDGED";
      return { id: params[0], state: alert?.state ?? "ACKNOWLEDGED" };
    },
  },
  {
    match: r("\/settings"),
    handle: ({ method, body }) => {
      if (method === "PUT" && body) Object.assign(INFRA_SETTINGS, body);
      return INFRA_SETTINGS;
    },
  },
  { method: "GET", match: r("\/monitoring\/thresholds"), handle: () => ({ cpuPct: 85, memUsedPct: 90, diskMaxUsedPct: 85 }) },
  // Writes (create, link, refresh, sync…) succeed without changing the sample inventory
  { method: ["POST", "PUT", "PATCH", "DELETE"], match: r("\/.*"), handle: ({ params }) => ({ id: params[0] ?? "ok", queued: 1, created: 0, updated: 0, seen: 0, status: "success", errors: [] }) },
];
