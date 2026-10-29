import type { Asset, AssetDetail, Certificate, Connection, Dashboard, InfraAlert, InfraSettings, ProviderCatalogueEntry, RenewalItem, Subscription, SubscriptionRow } from "@/components/infrastructure/types";
import type { DomainAnalytics, FleetResponse, FleetRow, MetricsSeries, MonitoringStatus, RangeKey } from "@/components/infrastructure/monitoring-types";

import { daysAgo, daysAhead } from "./common";

/* Servers, domains, SSL and billing behind designhouse.co.in (sample values) */

const DAY = 86_400_000;
const daysUntil = (iso: string) => Math.round((new Date(iso).getTime() - Date.now()) / DAY);

const subscription = (id: string, kind: string, label: string, providerName: string, cycle: Subscription["cycle"], amount: number, currency: string, nextDueDays: number): Subscription => ({
  id,
  kind,
  label,
  providerName,
  cycle,
  customIntervalMonths: null,
  autoRenew: "ENABLED",
  lastPaymentDate: daysAgo(cycle === "MONTHLY" ? 30 - nextDueDays : 365 - nextDueDays),
  nextDueDate: daysAhead(nextDueDays),
  renewalDate: daysAhead(nextDueDays),
  expirationDate: null,
  graceDays: 7,
  dateSources: { nextDueDate: { source: "manual", verifiedAt: daysAgo(10) } },
  currency,
  amount,
  paymentStatus: "PAID",
  invoiceRef: `INV-${id.toUpperCase()}`,
  billingAccount: "accounts@designhouse.co.in",
  notes: null,
});

const certificate = (id: string, assetId: string, hostname: string, validToDays: number): Certificate => ({
  id,
  assetId,
  hostname,
  port: 443,
  commonName: hostname,
  sans: [hostname],
  issuer: "Let's Encrypt (R11)",
  validFrom: daysAgo(90 - validToDays),
  validTo: daysAhead(validToDays),
  daysRemaining: validToDays,
  state: validToDays < 15 ? "EXPIRING" : "VALID",
  trusted: true,
  verifyError: null,
  autoRenew: "ENABLED",
  lastCheckedAt: daysAgo(0, 6),
  lastSuccessAt: daysAgo(0, 6),
  lastError: null,
});

const server = (id: string, name: string, technicalId: string, environment: Asset["environment"], provider: string, plan: string, ip: string, vcpu: number, ramMb: number, storageGb: number, sub: Subscription, certs: Certificate[]): Asset => ({
  id,
  type: "SERVER",
  name,
  technicalId,
  environment,
  provider,
  connection: provider === "AWS" ? { id: "conn-aws", provider: "aws", label: "Design House AWS" } : null,
  remoteId: provider === "AWS" ? `i-0${id.replace(/\D/g, "")}a7c4e9b21f3d` : null,
  source: provider === "AWS" ? "provider_api" : "manual",
  client: null,
  shared: false,
  ownerName: "Karan Mehta",
  ownerEmail: "karan.mehta@designhouse.co.in",
  tags: [environment.toLowerCase(), "website"],
  notes: null,
  archivedAt: null,
  createdAt: daysAgo(300),
  updatedAt: daysAgo(1),
  server: {
    serverType: "VPS",
    planName: plan,
    hostname: technicalId,
    ipv4: ip,
    ipv6: null,
    additionalIps: [],
    region: provider === "AWS" ? "ap-south-1 (Mumbai)" : "India",
    datacenter: provider === "AWS" ? "ap-south-1a" : "Mumbai",
    operatingSystem: "Ubuntu 24.04 LTS",
    vcpu,
    ramMb,
    storageGb,
    storageType: "SSD",
    networkInfo: null,
    providerStatus: "running",
    providerSuspended: false,
    providerCreatedAt: daysAgo(300),
    lastSyncedAt: daysAgo(0, 7),
    syncState: "ok",
  },
  domain: null,
  certificates: certs,
  subscriptions: [sub],
});

const domain = (id: string, fqdn: string, registrar: string, expiresDays: number, sub: Subscription, certs: Certificate[]): Asset => ({
  id,
  type: "DOMAIN",
  name: fqdn,
  technicalId: fqdn,
  environment: "PRODUCTION",
  provider: registrar,
  connection: null,
  remoteId: null,
  source: "manual",
  client: null,
  shared: false,
  ownerName: "Vijay Sharma",
  ownerEmail: "vijay@designhouse.co.in",
  tags: ["brand"],
  notes: null,
  archivedAt: null,
  createdAt: daysAgo(2000),
  updatedAt: daysAgo(2),
  server: null,
  domain: {
    fqdn,
    unicodeName: null,
    tld: fqdn.split(".").slice(1).join("."),
    registrar,
    registeredAt: daysAgo(4000),
    registryExpiresAt: daysAhead(expiresDays),
    registrarExpiresAt: daysAhead(expiresDays),
    rdapUpdatedAt: daysAgo(40),
    statuses: ["client transfer prohibited"],
    nameservers: ["ns1.cloudflare.com", "ns2.cloudflare.com"],
    dnssec: false,
    rdapSource: "rdap",
    rdapState: "ok",
    rdapError: null,
    rdapCheckedAt: daysAgo(0, 5),
    dnsState: "ok",
    dnsError: null,
    dnsCheckedAt: daysAgo(0, 5),
    alertsEnabled: true,
    effectiveExpiry: { date: daysAhead(expiresDays), source: "rdap", verified: true },
  },
  certificates: certs,
  subscriptions: [sub],
});

const certWeb = certificate("crt-1", "srv-1", "www.designhouse.co.in", 54);
const certApi = certificate("crt-2", "srv-2", "api.designhouse.co.in", 54);
const certAdmin = certificate("crt-3", "srv-1", "admin.designhouse.co.in", 11);

export const ASSETS: Asset[] = [
  server("srv-1", "Website & Admin (Production)", "dh-web-prod", "PRODUCTION", "AWS", "t3.medium", "13.234.118.20", 2, 4096, 60, subscription("sub-aws-web", "HOSTING", "EC2 t3.medium", "Amazon Web Services", "MONTHLY", 3450, "INR", 12), [certWeb, certAdmin]),
  server("srv-2", "API Server (Production)", "dh-api-prod", "PRODUCTION", "AWS", "t3.small", "13.234.96.41", 2, 2048, 40, subscription("sub-aws-api", "HOSTING", "EC2 t3.small", "Amazon Web Services", "MONTHLY", 1720, "INR", 12), [certApi]),
  server("srv-3", "Staging Server", "dh-staging", "STAGING", "Hostinger", "KVM 2", "82.112.236.15", 2, 8192, 100, subscription("sub-hst", "HOSTING", "VPS KVM 2", "Hostinger", "YEARLY", 8388, "INR", 140), []),
  domain("dom-1", "designhouse.co.in", "GoDaddy", 18, subscription("sub-dom-1", "DOMAIN", "Domain renewal", "GoDaddy", "YEARLY", 899, "INR", 18), [certWeb]),
  domain("dom-2", "designhouseindia.com", "GoDaddy", 212, subscription("sub-dom-2", "DOMAIN", "Domain renewal", "GoDaddy", "YEARLY", 1299, "INR", 212), []),
];

const servers = ASSETS.filter((a) => a.type === "SERVER");
const domains = ASSETS.filter((a) => a.type === "DOMAIN");

export const CERTIFICATES: Certificate[] = [certWeb, certApi, certAdmin].map((c) => ({ ...c, asset: { id: c.assetId ?? "", name: ASSETS.find((a) => a.id === c.assetId)?.name ?? "", client: null } }));

export const SUBSCRIPTION_ROWS: SubscriptionRow[] = [
  ...ASSETS.flatMap((asset) =>
    asset.subscriptions.map((s): SubscriptionRow => ({ ...s, assetId: asset.id, assetName: asset.name, assetType: asset.type, client: "Design House", provider: s.providerName, currency: s.currency ?? "INR", amount: s.amount, paymentStatus: s.paymentStatus ?? "PAID" })),
  ),
  { id: "sub-gws", assetId: "dom-1", assetName: "designhouse.co.in", assetType: "DOMAIN", client: "Design House", provider: "Google Workspace", kind: "EMAIL", label: "Google Workspace (12 users)", cycle: "MONTHLY", customIntervalMonths: null, autoRenew: "ENABLED", lastPaymentDate: daysAgo(20), nextDueDate: daysAhead(10), renewalDate: daysAhead(10), expirationDate: null, dateSources: {}, currency: "INR", amount: 1656, paymentStatus: "PAID" },
];

export function renewals(): RenewalItem[] {
  const items: RenewalItem[] = SUBSCRIPTION_ROWS.map((s) => ({
    key: `pay-${s.id}`,
    assetId: s.assetId,
    assetName: s.assetName,
    assetType: s.assetType,
    kind: "payment_due",
    date: s.nextDueDate ?? daysAhead(30),
    daysRemaining: daysUntil(s.nextDueDate ?? daysAhead(30)),
    source: "manual",
    verified: true,
    label: s.label ?? s.kind,
    subscriptionId: s.id,
    amount: s.amount ?? null,
    currency: s.currency ?? "INR",
    paymentStatus: s.paymentStatus ?? null,
  }));
  for (const c of CERTIFICATES) {
    items.push({ key: `ssl-${c.id}`, assetId: c.assetId ?? "", assetName: c.hostname, assetType: "SSL_CERTIFICATE", kind: "ssl_expiry", date: c.validTo ?? daysAhead(30), daysRemaining: c.daysRemaining ?? 30, source: "tls_probe", verified: true, label: `SSL — ${c.hostname}`, subscriptionId: null, amount: null, currency: null, paymentStatus: null });
  }
  for (const d of domains) {
    const date = d.domain?.registryExpiresAt ?? daysAhead(60);
    items.push({ key: `dom-${d.id}`, assetId: d.id, assetName: d.name, assetType: "DOMAIN", kind: "domain_expiry", date, daysRemaining: daysUntil(date), source: "rdap", verified: true, label: `Domain — ${d.name}`, subscriptionId: null, amount: null, currency: null, paymentStatus: null });
  }
  return items.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

export const ALERTS: InfraAlert[] = [
  { id: "alr-1", kind: "ssl_expiry", state: "OPEN", severity: "warning", title: "SSL for admin.designhouse.co.in expires in 11 days", message: "Auto-renew is enabled; check that certbot ran successfully.", thresholdDays: 14, targetDate: daysAhead(11), raisedAt: daysAgo(3, 6), acknowledgedAt: null, snoozedUntil: null, resolvedAt: null, delivery: { deliveredAt: daysAgo(3, 6), attempts: 1, error: null, summary: null }, asset: { id: "srv-1", name: "Website & Admin (Production)", type: "SERVER", technicalId: "dh-web-prod" } },
  { id: "alr-2", kind: "payment_due", state: "OPEN", severity: "warning", title: "AWS EC2 payment due in 12 days", message: "Monthly hosting for dh-web-prod and dh-api-prod.", thresholdDays: 14, targetDate: daysAhead(12), raisedAt: daysAgo(2, 9), acknowledgedAt: null, snoozedUntil: null, resolvedAt: null, delivery: { deliveredAt: daysAgo(2, 9), attempts: 1, error: null, summary: null }, asset: { id: "srv-1", name: "Website & Admin (Production)", type: "SERVER", technicalId: "dh-web-prod" } },
  { id: "alr-3", kind: "domain_expiry", state: "ACKNOWLEDGED", severity: "info", title: "designhouse.co.in renews in 18 days", message: "Auto-renew is on at GoDaddy.", thresholdDays: 30, targetDate: daysAhead(18), raisedAt: daysAgo(12, 9), acknowledgedAt: daysAgo(11, 10), snoozedUntil: null, resolvedAt: null, delivery: { deliveredAt: daysAgo(12, 9), attempts: 1, error: null, summary: null }, asset: { id: "dom-1", name: "designhouse.co.in", type: "DOMAIN", technicalId: "designhouse.co.in" } },
];

export function infraDashboard(): Dashboard {
  const upcoming = renewals();
  return {
    generatedAt: new Date().toISOString(),
    totals: {
      servers: servers.length,
      domains: domains.length,
      sslCertificates: CERTIFICATES.length,
      hostingSubscriptions: 3,
      connectedProviders: 1,
      expiringWithin7Days: upcoming.filter((u) => u.daysRemaining <= 7).length,
      expiringWithin30Days: upcoming.filter((u) => u.daysRemaining <= 30).length,
      overdueOrExpired: 0,
      unknownRenewalDates: 0,
      openAlerts: ALERTS.filter((a) => a.state === "OPEN").length,
      runningServers: servers.length,
      monitoredServers: 2,
      serversNeedingAttention: 0,
    },
    upcoming: upcoming.slice(0, 8),
    domainExpiryTimeline: Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() + i);
      return { month: d.toISOString().slice(0, 7), count: i === 0 ? 1 : i === 7 ? 1 : 0 };
    }),
    serverDistribution: { byProvider: [{ provider: "AWS", count: 2 }, { provider: "Hostinger", count: 1 }], byEnvironment: [{ environment: "PRODUCTION", count: 2 }, { environment: "STAGING", count: 1 }] },
    inventory: { total: ASSETS.length, imported: 2, manual: 3 },
    alerts: ALERTS.filter((a) => a.state === "OPEN").map(({ id, kind, state, severity, title, raisedAt, asset }) => ({ id, kind, state, severity, title, raisedAt, asset })),
    recentSync: [{ id: "sync-1", kind: "provider_sync", status: "success", trigger: "schedule", startedAt: daysAgo(0, 7), finishedAt: daysAgo(0, 7, 1), error: null }],
    failedChecks: [],
    certificateStates: { VALID: 2, EXPIRING: 1, EXPIRED: 0, UNKNOWN: 0 },
    byClient: [{ clientId: null, name: "Design House", servers: servers.length, domains: domains.length, certificates: CERTIFICATES.length, monthlyCost: [{ currency: "INR", amount: 7745 }] }],
    billing: {
      monthlyEquivalent: [{ currency: "INR", amount: 7745 }],
      yearlyEquivalent: [{ currency: "INR", amount: 92940 }],
      upcomingPayments30Days: [{ currency: "INR", amount: 7725 }],
      monthlyProjection: Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() + i);
        return { month: d.toISOString().slice(0, 7), totals: [{ currency: "INR", amount: i === 0 ? 7725 : 6826 }] };
      }),
      byProvider: [
        { provider: "Amazon Web Services", monthly: [{ currency: "INR", amount: 5170 }] },
        { provider: "Google Workspace", monthly: [{ currency: "INR", amount: 1656 }] },
        { provider: "Hostinger", monthly: [{ currency: "INR", amount: 699 }] },
        { provider: "GoDaddy", monthly: [{ currency: "INR", amount: 183 }] },
      ],
      excluded: { unknownAmount: 0, unknownCycle: 0, unknownNextDue: 0 },
      note: "Amounts are converted to a monthly equivalent for comparison.",
    },
  };
}

export function assetDetail(id: string): AssetDetail | null {
  const asset = ASSETS.find((a) => a.id === id);
  if (!asset) return null;
  return {
    ...asset,
    relations: asset.type === "DOMAIN" ? [{ id: "rel-1", kind: "points_to", direction: "out", asset: { id: "srv-1", name: "Website & Admin (Production)", type: "SERVER", technicalId: "dh-web-prod" } }] : [],
    linkedWebsites: [{ clientId: "dh", clientName: "Design House", url: "https://www.designhouse.co.in" }],
    dnsPosture:
      asset.type === "DOMAIN"
        ? { spf: { present: true, qualifier: "softfail" }, dmarc: { present: true, policy: "quarantine" }, caa: { present: false, issuers: 0 }, mx: { present: true }, dkim: { checked: false, note: "DKIM selectors are not checked automatically." } }
        : null,
    dnsHistory: [],
    syncHistory: [{ id: "sh-1", kind: "rdap", status: "success", trigger: "schedule", startedAt: daysAgo(0, 5), finishedAt: daysAgo(0, 5, 1), stats: null, error: null }],
    activity: [{ id: "act-1", action: "Asset updated", outcome: "success", actor: "Karan Mehta", at: daysAgo(4, 15) }],
    billingHistory: asset.subscriptions.map((s, i) => ({ id: `bh-${i}`, kind: "payment", coversDueDate: s.lastPaymentDate, paidAt: s.lastPaymentDate, amount: s.amount ?? 0, currency: s.currency ?? "INR", invoiceRef: s.invoiceRef, note: null, source: "manual", createdAt: s.lastPaymentDate ?? daysAgo(30) })),
  };
}

export const PROVIDERS: { connections: Connection[]; providers: ProviderCatalogueEntry[] } = {
  connections: [
    { id: "conn-aws", provider: "aws", providerLabel: "Amazon Web Services", label: "Design House AWS", status: "CONNECTED", credentialsSaved: true, credentialHint: { accessKeyId: "AKIA…7Q2D" }, capabilities: { inventory: "automatic_api", configuration: "automatic_api", networking: "automatic_api", billing: "manual", utilization: "automatic_api" }, importedAssets: 2, lastTestedAt: daysAgo(0, 7), lastSyncAt: daysAgo(0, 7), lastSuccessfulSyncAt: daysAgo(0, 7), lastErrorCode: null, lastError: null, disconnectedAt: null, createdAt: daysAgo(200) },
  ],
  providers: [
    { key: "aws", label: "Amazon Web Services", live: true, capabilities: { inventory: "automatic_api", configuration: "automatic_api", networking: "automatic_api", billing: "manual", utilization: "automatic_api" }, credentialFields: [{ key: "accessKeyId", label: "Access key ID", secret: false }, { key: "secretAccessKey", label: "Secret access key", secret: true }], docsUrl: "https://docs.aws.amazon.com/" },
    { key: "hostinger", label: "Hostinger", live: true, capabilities: { inventory: "automatic_api", configuration: "manual", networking: "manual", billing: "manual", utilization: "unsupported" }, credentialFields: [{ key: "apiToken", label: "API token", secret: true }], docsUrl: "https://developers.hostinger.com/" },
    { key: "digitalocean", label: "DigitalOcean", live: true, capabilities: { inventory: "automatic_api", configuration: "automatic_api", networking: "automatic_api", billing: "automatic_api", utilization: "automatic_api" }, credentialFields: [{ key: "token", label: "Personal access token", secret: true }], docsUrl: "https://docs.digitalocean.com/" },
  ],
};

export const INFRA_SETTINGS: InfraSettings = {
  thresholdDays: [30, 14, 7, 1],
  inAppEnabled: true,
  emailEnabled: true,
  extraRecipients: ["it.support@designhouse.co.in"],
  emailTransportConfigured: true,
  quietHours: { supported: false },
  whatsapp: { supported: false, reason: "WhatsApp alerts are not available for infrastructure yet." },
};

const usage: Record<string, [number, number, number]> = { "srv-1": [34, 61, 48], "srv-2": [22, 54, 37], "srv-3": [8, 29, 21] };

export function fleet(): FleetResponse {
  const items: FleetRow[] = servers.map((s) => {
    const [cpu, mem, disk] = usage[s.id] ?? [10, 30, 20];
    const monitored = s.environment === "PRODUCTION";
    const due = s.subscriptions[0]?.nextDueDate ?? null;
    return {
      id: s.id,
      name: s.name,
      technicalId: s.technicalId,
      environment: s.environment,
      provider: s.provider,
      imported: s.source === "provider_api",
      client: null,
      clientId: null,
      providerStatus: "running",
      providerSuspended: false,
      region: s.server?.region ?? null,
      ipv4: s.server?.ipv4 ?? null,
      plan: s.server?.planName ?? null,
      vcpu: s.server?.vcpu ?? null,
      ramMb: s.server?.ramMb ?? null,
      storageGb: s.server?.storageGb ?? null,
      lastSyncedAt: daysAgo(0, 7),
      syncState: "ok",
      monitoring: monitored ? "online" : "not_configured",
      cpuPct: monitored ? cpu : null,
      memPct: monitored ? mem : null,
      diskPct: monitored ? disk : null,
      lastMetricsAt: monitored ? new Date().toISOString() : null,
      openAlerts: s.id === "srv-1" ? 2 : 0,
      nextRenewal: due ? { date: due, daysRemaining: daysUntil(due), kind: "payment_due" } : null,
    };
  });
  return {
    summary: {
      total: items.length,
      running: items.length,
      stopped: 0,
      otherStatus: 0,
      noStatus: 0,
      monitored: 2,
      pendingSetup: 0,
      unmonitored: 1,
      collectorOffline: 0,
      needingAttention: 0,
      cpuPressure: 0,
      memoryPressure: 0,
      diskPressure: 0,
      renewalsWithin30Days: 2,
      byProvider: [{ label: "AWS", value: 2 }, { label: "Hostinger", value: 1 }],
      byRegion: [{ label: "ap-south-1 (Mumbai)", value: 2 }, { label: "India", value: 1 }],
      byStatus: [{ label: "running", value: 3 }],
    },
    items,
    total: items.length,
    page: 1,
    limit: 50,
  };
}

const RANGE_SECONDS: Record<RangeKey, number> = { "1h": 3600, "6h": 21600, "24h": 86400, "7d": 604800, "30d": 2592000 };

export function metrics(range: RangeKey, base: [number, number, number] = [30, 55, 42]): MetricsSeries {
  const total = RANGE_SECONDS[range] ?? 86400;
  const count = 48;
  const bucket = Math.round(total / count);
  const now = Math.floor(Date.now() / 1000);
  return {
    range,
    bucketSeconds: bucket,
    bucketsWithData: count,
    bucketsTotal: count,
    serversReporting: 2,
    points: Array.from({ length: count }, (_, i) => {
      const wave = Math.sin(i / 5) * 8;
      return { t: (now - (count - i) * bucket) * 1000, samples: 6, cpuPct: Math.max(2, base[0] + wave), memUsedPct: base[1] + wave / 3, diskMaxUsedPct: base[2] + i / 100, netRxBps: 180_000 + wave * 9_000, netTxBps: 420_000 + wave * 15_000, load1: 0.6 + wave / 20 };
    }),
  };
}

export function monitoringStatus(id: string): MonitoringStatus {
  const s = servers.find((a) => a.id === id);
  const [cpu, mem, disk] = usage[id] ?? [10, 30, 20];
  const online = s?.environment === "PRODUCTION";
  return {
    assetId: id,
    state: online ? "online" : "not_configured",
    collector: online ? { configured: true, revoked: false, tokenHint: "dhc_…9f2a", label: s?.technicalId ?? null, agentVersion: "1.4.2", createdAt: daysAgo(120), rotatedAt: null, lastSeenAt: new Date().toISOString(), lastSampleAt: new Date().toISOString(), rejectedSamples: 0, sampleAgeSeconds: 24 } : null,
    host: online ? { hostname: s?.technicalId ?? null, os: "Ubuntu 24.04 LTS", kernel: "6.8.0-1015-aws", arch: "x86_64", bootTime: daysAgo(21), cpuCores: s?.server?.vcpu ?? 2 } : null,
    latest: online
      ? { at: new Date().toISOString(), cpuPct: cpu, cpuUserPct: cpu * 0.7, cpuSystemPct: cpu * 0.2, cpuIowaitPct: 0.4, cpuStealPct: 0.1, load: [0.62, 0.55, 0.48], memTotalBytes: (s?.server?.ramMb ?? 2048) * 1048576, memAvailBytes: (s?.server?.ramMb ?? 2048) * 1048576 * (1 - mem / 100), memCachedBytes: 400 * 1048576, swapTotalBytes: 0, swapUsedBytes: 0, memUsedPct: mem, swapUsedPct: 0, diskMaxUsedPct: disk, filesystems: [{ mount: "/", fstype: "ext4", totalBytes: (s?.server?.storageGb ?? 40) * 1073741824, usedBytes: (s?.server?.storageGb ?? 40) * 1073741824 * (disk / 100), usedPct: disk, inodesUsedPct: 12, readOnly: false }], diskReadBps: 120_000, diskWriteBps: 340_000, netRxBps: 190_000, netTxBps: 450_000, netErrPerSec: 0, netDropPerSec: 0, uptimeSec: 21 * 86400 }
      : null,
    report: online ? { containers: [], services: [{ name: "nginx", state: "running" }, { name: "pm2-ubuntu", state: "running" }], security: { rebootRequired: false, pendingUpdates: 6, securityUpdates: 2, firewall: "ufw active", listeningPorts: [{ port: 22, proto: "tcp" }, { port: 80, proto: "tcp" }, { port: 443, proto: "tcp" }] } } : null,
    health: { overall: online ? "ok" : "unknown", confidence: online ? "high" : "low", dimensions: [{ key: "cpu", label: "CPU", status: online ? "ok" : "unknown", reason: online ? `${cpu}% average` : "No collector" }, { key: "memory", label: "Memory", status: online ? "ok" : "unknown", reason: online ? `${mem}% used` : "No collector" }, { key: "disk", label: "Disk", status: online ? "ok" : "unknown", reason: online ? `${disk}% used` : "No collector" }], collectorState: online ? "online" : "not_configured" },
    thresholds: { cpuPct: 85, memUsedPct: 90, diskMaxUsedPct: 85 },
    alerts: ALERTS.filter((a) => a.asset.id === id).map(({ id: alertId, kind, state, severity, title, raisedAt }) => ({ id: alertId, kind, state, severity, title, raisedAt })),
    nextBilling: s?.subscriptions[0]?.nextDueDate ? { date: s.subscriptions[0].nextDueDate, daysRemaining: daysUntil(s.subscriptions[0].nextDueDate), kind: "payment_due", verified: true } : null,
  };
}

export const DOMAIN_ANALYTICS: DomainAnalytics = {
  totals: { domains: domains.length, withKnownExpiry: domains.length, unknownExpiry: 0, dnssecSigned: 0, dnssecUnsigned: domains.length },
  expiryWindows: [{ label: "≤ 30 days", value: 1 }, { label: "31–90 days", value: 0 }, { label: "91–365 days", value: 1 }, { label: "> 1 year", value: 0 }],
  registrars: [{ label: "GoDaddy", value: 2 }],
  portfolioGrowth: Array.from({ length: 6 }, (_, i) => ({ month: daysAgo((5 - i) * 30).slice(0, 7), added: 0, total: 2 })),
  checkHistory: Array.from({ length: 14 }, (_, i) => ({ day: daysAgo(13 - i).slice(0, 10), dnsOk: 2, dnsFailed: 0, rdapOk: 2, rdapFailed: 0 })),
  dnsChanges: [],
  certificates: { VALID: 2, EXPIRING: 1, EXPIRED: 0, UNKNOWN: 0 },
};
