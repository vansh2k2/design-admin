"use client";

import { useCallback, useEffect, useState } from "react";
import { Globe2, Loader2, Play, Trash2 } from "lucide-react";
import { seoAuditApi, type SeoCompetitor, type SeoCompetitorComparison } from "@/lib/seoAuditApi";
import { errorMessage } from "@/lib/errorMessage";

const num = (v: unknown) => (typeof v === "number" ? v : "Not available");

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 px-2.5 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

/** Competitors the admin tracks: each public site is crawled and only what the crawl observed is compared. */
export default function CompetitorsPanel() {
  const [competitors, setCompetitors] = useState<SeoCompetitor[]>([]);
  const [comparison, setComparison] = useState<SeoCompetitorComparison | null>(null);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [list, cmp] = await Promise.all([seoAuditApi.competitors(), seoAuditApi.competitorComparison().catch(() => null)]);
      setCompetitors(list);
      setComparison(cmp);
      setError(null);
    } catch (e) {
      setError((errorMessage(e) || "Could not load competitors"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([seoAuditApi.competitors(), seoAuditApi.competitorComparison().catch(() => null)])
      .then(([list, cmp]) => {
        if (!alive) return;
        setCompetitors(list);
        setComparison(cmp);
      })
      .catch((e) => alive && setError(errorMessage(e) || "Could not load competitors"))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const add = async () => {
    setAdding(true);
    try {
      await seoAuditApi.addCompetitor({ label: label.trim(), url: url.trim() });
      setLabel("");
      setUrl("");
      await load();
    } catch (e) {
      setError((errorMessage(e) || "Could not add competitor"));
    } finally {
      setAdding(false);
    }
  };

  const crawl = async (id: string) => {
    setBusyId(id);
    try {
      await seoAuditApi.auditCompetitor(id);
      await load();
    } catch (e) {
      setError((errorMessage(e) || "Could not crawl this competitor"));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      await seoAuditApi.deleteCompetitor(id);
      await load();
    } catch (e) {
      setError((errorMessage(e) || "Could not remove this competitor"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-3 text-xs text-slate-600">
      <p>Only facts observed from each public website crawl are shown. Traffic, backlinks, search volume and live rankings are not inferred.</p>
      {error && <p className="rounded border border-rose-200 bg-rose-50 px-2.5 py-2 text-rose-700">{error}</p>}

      <div className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Competitor name" className="rounded border border-slate-300 px-2.5 py-2 text-xs" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} type="url" placeholder="https://example.com" className="rounded border border-slate-300 px-2.5 py-2 text-xs" />
        <button
          type="button"
          disabled={adding || !label.trim() || !url.trim()}
          onClick={() => void add()}
          className="inline-flex items-center justify-center gap-1.5 rounded bg-teal-700 px-3 py-2 font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe2 className="h-3.5 w-3.5" />} Add competitor
        </button>
      </div>

      {loading ? (
        <p className="flex items-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading competitors…</p>
      ) : competitors.length === 0 ? (
        <p>No competitors configured.</p>
      ) : (
        competitors.map((c) => {
          const profile = comparison?.competitors.find((p) => p.siteId === c.id);
          const busy = busyId === c.id;
          return (
            <div key={c.id} className="rounded border border-slate-200 p-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{c.label}</p>
                  <p className="text-[10px] text-slate-500">{c.url}</p>
                </div>
                <div className="flex gap-2">
                  <button type="button" disabled={busy} onClick={() => void crawl(c.id)} className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-2.5 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-50">
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />} Crawl
                  </button>
                  <button type="button" disabled={busy} onClick={() => void remove(c.id)} className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-2.5 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-50">
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
              {profile ? (
                <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-5">
                  <Metric label="Pages" value={num(profile.observed.pagesCrawled)} />
                  <Metric label="Indexable" value={num(profile.observed.indexablePages)} />
                  <Metric label="Avg words" value={num(profile.observed.averageWordCount)} />
                  <Metric label="With schema" value={num(profile.observed.pagesWithSchema)} />
                  <Metric label="SEO score" value={profile.scores?.overall ?? "Not available"} />
                </div>
              ) : (
                <p className="mt-2 text-[11px] text-slate-500">Run the first crawl to populate observed metrics.</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
