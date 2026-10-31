"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { api, ApiRequestError } from "@/lib/api";
import { FieldLabel, TextInput } from "../fields";

interface TopbarLink {
  label: string;
  href: string;
}

interface TopbarData {
  phones: string[];
  email: string;
  links: TopbarLink[];
  updatedBy?: string;
  updatedAt?: string | null;
}

const MAX_PHONES = 3;
const MAX_LINKS = 5;

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
  background: "#1e2433",
  color: "#e2e8f0",
});

/**
 * Phone numbers, email and quick links shown in the website's Topbar.
 * Loaded from and saved straight to the backend (/topbar), so the website updates as soon as it is saved.
 */
export function TopbarContactFields() {
  const [data, setData] = useState<TopbarData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    api
      .get<TopbarData>("/topbar")
      .then((res) => setData({ phones: res.phones ?? [], email: res.email ?? "", links: res.links ?? [], updatedAt: res.updatedAt }))
      .catch((err) => setLoadError(err instanceof ApiRequestError ? err.message : "Could not load the topbar details."));
  }, []);

  const change = (next: Partial<TopbarData>) => {
    setData((d) => (d ? { ...d, ...next } : d));
    setDirty(true);
  };

  const setPhone = (i: number, value: string) => data && change({ phones: data.phones.map((p, idx) => (idx === i ? value : p)) });
  const setLink = (i: number, key: keyof TopbarLink, value: string) =>
    data && change({ links: data.links.map((l, idx) => (idx === i ? { ...l, [key]: value } : l)) });

  const save = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const saved = await api.put<TopbarData>("/topbar", { phones: data.phones, email: data.email, links: data.links });
      setData(saved);
      setDirty(false);
      Toast.fire({ icon: "success", iconColor: "#34d399", title: "Topbar saved — live on the website" });
    } catch (err) {
      Toast.fire({ icon: "error", iconColor: "#f87171", title: err instanceof ApiRequestError ? err.message : "Could not save the topbar." });
    } finally {
      setSaving(false);
    }
  };

  if (loadError) {
    return <p className="rounded-[4px] bg-red-50 px-2 py-1.5 text-[10px] font-semibold text-red-600">{loadError}</p>;
  }
  if (!data) {
    return (
      <p className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
        <Loader2 className="h-3 w-3 animate-spin" /> Loading website topbar…
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-[6px] border border-[#dbe4f3] bg-[#f8fafd] p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10.5px] font-bold text-[#0A2B5E]">Website Topbar — Phone, Email & Links</p>
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="inline-flex h-[26px] items-center gap-1.5 rounded-[4px] bg-[#0A2B5E] px-[10px] text-[10px] font-semibold text-white transition hover:bg-[#0d3a7d] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
          {saving ? "Saving…" : "Save Topbar"}
        </button>
      </div>

      {/* Phone numbers */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data.phones.map((phone, i) => (
          <div key={i}>
            <FieldLabel required={i === 0}>{`Phone Number ${i + 1}`}</FieldLabel>
            <div className="flex items-center gap-1.5">
              <div className="min-w-0 flex-1">
                <TextInput value={phone} onChange={(next) => setPhone(i, next)} placeholder="+91 96549 00525" hideLimit={true} />
              </div>
              {data.phones.length > 1 && (
                <button
                  type="button"
                  onClick={() => change({ phones: data.phones.filter((_, idx) => idx !== i) })}
                  title="Remove number"
                  className="grid h-[28px] w-[28px] shrink-0 place-items-center rounded-[4px] text-red-500 transition hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
        <div>
          <FieldLabel required>Contact Email</FieldLabel>
          <TextInput value={data.email} onChange={(next) => change({ email: next })} placeholder="info@designhouse.co.in" hideLimit={true} />
        </div>
      </div>
      {data.phones.length < MAX_PHONES && (
        <button
          type="button"
          onClick={() => change({ phones: [...data.phones, ""] })}
          className="inline-flex w-fit items-center gap-1 text-[10px] font-semibold text-[#0A2B5E] hover:underline"
        >
          <Plus className="h-3 w-3" /> Add phone number
        </button>
      )}

      {/* Quick links */}
      <div className="border-t border-[#e2e8f0] pt-2.5">
        <p className="mb-1.5 text-[10px] font-bold text-[#334155]">Quick Links (right side of the topbar)</p>
        <div className="flex flex-col gap-2">
          {data.links.map((link, i) => (
            <div key={i} className="grid grid-cols-[1fr_1.4fr_auto] items-end gap-2">
              <div>
                <FieldLabel>{`Link ${i + 1} Label`}</FieldLabel>
                <TextInput value={link.label} onChange={(next) => setLink(i, "label", next)} placeholder="Brochure" hideLimit={true} />
              </div>
              <div>
                <FieldLabel>{`Link ${i + 1} URL`}</FieldLabel>
                <TextInput value={link.href} onChange={(next) => setLink(i, "href", next)} placeholder="/downloads" hideLimit={true} />
              </div>
              <button
                type="button"
                onClick={() => change({ links: data.links.filter((_, idx) => idx !== i) })}
                title="Remove link"
                className="mb-[1px] grid h-[28px] w-[28px] place-items-center rounded-[4px] text-red-500 transition hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        {data.links.length < MAX_LINKS && (
          <button
            type="button"
            onClick={() => change({ links: [...data.links, { label: "", href: "" }] })}
            className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#0A2B5E] hover:underline"
          >
            <Plus className="h-3 w-3" /> Add link
          </button>
        )}
        <p className="mt-1.5 text-[9.5px] text-[#94a3b8]">Links can be a website page (/downloads) or a full address (https://…).</p>
      </div>
    </div>
  );
}
