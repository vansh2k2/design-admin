import type { MockRoute } from "../http";
import { currentAdmin } from "../fixtures/admin";
import { ACTIVITY_LOGS, API_LIMITS } from "../fixtures/security";

/** IP block limits and the activity log (filtered and paginated like the backend) */
export const securityRoutes: MockRoute[] = [
  { method: "GET", match: /^\/api-limits\/admin$/, handle: () => API_LIMITS },
  {
    method: "PUT",
    match: /^\/api-limits\/admin$/,
    handle: ({ body }) => {
      for (const update of (body as { rules?: { key: string }[] })?.rules ?? []) {
        const rule = API_LIMITS.rules.find((r) => r.key === update.key);
        if (rule) Object.assign(rule, update);
      }
      API_LIMITS.stats.protectedOn = API_LIMITS.rules.filter((r) => r.enabled).length;
      return API_LIMITS;
    },
  },
  {
    method: "POST",
    match: /^\/api-limits\/admin\/unblock$/,
    handle: ({ body }) => {
      const { ip, api } = body as { ip: string; api?: string };
      for (const block of API_LIMITS.blocks) {
        if (block.ip === ip && (!api || block.api === api) && block.status === "Blocked") {
          Object.assign(block, { status: "Unblocked", liftedAt: new Date().toISOString(), liftedBy: currentAdmin().name });
        }
      }
      API_LIMITS.stats.blockedNow = API_LIMITS.blocks.filter((b) => b.status === "Blocked").length;
      return { success: true };
    },
  },
  {
    method: "GET",
    match: /^\/activity-logs$/,
    handle: ({ query }) => {
      const q = (query.get("q") ?? "").toLowerCase();
      const from = query.get("from");
      const to = query.get("to");
      const rows = ACTIVITY_LOGS.filter((log) => {
        if (q && ![log.userName, log.details, log.module, log.ip].some((v) => v.toLowerCase().includes(q))) return false;
        if (query.get("user") && log.userName !== query.get("user")) return false;
        if (query.get("module") && log.module !== query.get("module")) return false;
        if (query.get("action") && log.action !== query.get("action")) return false;
        if (query.get("status") && log.status !== query.get("status")) return false;
        if (from && log.createdAt.slice(0, 10) < from) return false;
        if (to && log.createdAt.slice(0, 10) > to) return false;
        return true;
      });
      const limit = Number(query.get("limit") ?? 20);
      const page = Number(query.get("page") ?? 1);
      const today = new Date().toISOString().slice(0, 10);
      const count = (action: string) => ACTIVITY_LOGS.filter((l) => l.action === action).length;
      return {
        items: rows.slice((page - 1) * limit, page * limit),
        total: rows.length,
        page,
        pages: Math.max(1, Math.ceil(rows.length / limit)),
        stats: {
          total: ACTIVITY_LOGS.length,
          today: ACTIVITY_LOGS.filter((l) => l.createdAt.slice(0, 10) === today).length,
          created: count("Created"),
          updated: count("Updated"),
          deleted: count("Deleted"),
          logins: count("Login"),
          failed: ACTIVITY_LOGS.filter((l) => l.status === "Failed").length,
        },
        filters: {
          users: [...new Set(ACTIVITY_LOGS.map((l) => l.userName))],
          modules: [...new Set(ACTIVITY_LOGS.map((l) => l.module))],
          actions: [...new Set(ACTIVITY_LOGS.map((l) => l.action))],
        },
      };
    },
  },
];
