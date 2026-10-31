import type { Dispatch, RefObject, SetStateAction } from "react";
import { api, ApiRequestError } from "@/lib/api";
import { settingsApi } from "@/lib/settingsApi";
import type { CmsPage } from "@/lib/cmsPages";
import type { FormState } from "../types";
import type { SectionsDraft } from "./types";
import type { CmsJson, CmsRecord } from "@/lib/cmsJson";

// The live website: canonical URLs always point here (never to localhost)
export const LIVE_SITE_URL = "https://www.designhouse.co.in";

/** "/", "/contact", "/services/corporate-interiors" — the key the website reads SEO with */
export const seoPagePath = (page: CmsPage) => {
  const slug = (page.slug || "/").trim();
  if (!slug || slug === "/") return "/";
  return (slug.startsWith("/") ? slug : `/${slug}`).replace(/\/+$/, "");
};

export const autoCanonicalUrl = (page: CmsPage) => `${LIVE_SITE_URL}${seoPagePath(page) === "/" ? "/" : seoPagePath(page)}`;

interface PageSeoRecord {
  page: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  openGraphTags: string;
  schemaMarkup: string;
  canonicalTag: string;
  ogImage: string;
  isActive: boolean;
  exists: boolean;
}

/** Fills the SEO form with the page's live SEO record (the one the website uses). */
export function syncPageSeoFromLiveApi(
  page: CmsPage,
  setForm: Dispatch<SetStateAction<FormState>>,
  canonicalEditorRef: RefObject<HTMLDivElement | null>,
): void {
  api
    .get<PageSeoRecord>(`/page-seo?page=${encodeURIComponent(seoPagePath(page))}`)
    .then((seo) => {
      if (!seo) return;
      // Canonical is generated from the page URL unless one was saved
      const canonical = seo.canonicalTag || autoCanonicalUrl(page);
      setForm((prev) => ({
        ...prev,
        metaTitle: seo.metaTitle || prev.metaTitle,
        metaDescription: seo.metaDescription || prev.metaDescription,
        metaKeywords: seo.metaKeywords || prev.metaKeywords,
        canonicalUrl: canonical,
        canonicalTag: canonical,
        openGraphTags: seo.openGraphTags || prev.openGraphTags,
        schemaMarkup: seo.schemaMarkup || prev.schemaMarkup,
        ogImage: seo.ogImage || prev.ogImage,
        isActive: seo.isActive,
      }));
      if (canonicalEditorRef.current) canonicalEditorRef.current.innerText = canonical;
    })
    .catch(() => {
      // The form keeps the page's saved settings; saving reports any connection problem
    });
}

/**
 * Persists the page's settings-doc fields (sections, publish info,
 * status, SEO block) and syncs the SEO record to the backend.
 * Returns the raw updated settings object for the caller to apply
 * to its own state (setSettings / setPages / setActiveConfigKey).
 */
export async function savePageCore({
  savingKey,
  sectionsDraft,
  form,
  settings,
  currentAdmin,
  page,
  canonicalEditorRef,
  setForm,
}: {
  savingKey: string;
  sectionsDraft: SectionsDraft;
  form: FormState;
  settings: CmsRecord | null;
  currentAdmin: { name?: string; email?: string } | null | undefined;
  page: CmsPage;
  canonicalEditorRef: RefObject<HTMLDivElement | null>;
  setForm: Dispatch<SetStateAction<FormState>>;
}): Promise<CmsRecord> {
  const current = settings?.[savingKey] ?? {};
  const now = new Date().toISOString();
  const adminName = currentAdmin?.name || currentAdmin?.email || "Admin User";
  const finalPublishDate = form.publishedAt || current.publishedAt || now;

  const updated = await settingsApi.update({
    [savingKey]: {
      ...current,
      sections: sectionsDraft.length ? sectionsDraft : current.sections,
      publishedAt: finalPublishDate,
      lastUpdated: now,
      updatedBy: adminName,
      status: form.status,
      visibility: form.visibility,
      seo: {
        ...current.seo,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        metaKeywords: form.metaKeywords,
        canonicalUrl: form.canonicalUrl || form.canonicalTag,
        canonicalTag: form.canonicalTag || form.canonicalUrl,
        openGraphTags: form.openGraphTags,
        ogTitle: form.ogTitle,
        ogDescription: form.ogDescription,
        ogImage: form.ogImage,
        h1Tag: form.h1Tag,
        breadcrumbName: form.breadcrumbName,
        schemaMarkup: form.schemaMarkup,
        robotsIndex: form.robotsIndex,
        robotsFollow: form.robotsFollow,
      },
    },
  } as CmsJson);

  setForm((prev) => ({
    ...prev,
    publishedAt: finalPublishDate,
    lastUpdated: now,
    updatedBy: adminName,
  }));

  // SEO goes to the backend record the website reads for this page's <head>
  const editorText = canonicalEditorRef.current?.innerText?.trim();
  try {
    await api.put("/page-seo", {
      page: seoPagePath(page),
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      metaKeywords: form.metaKeywords,
      // Empty = generated from the page URL on the live site
      canonicalTag: editorText || form.canonicalTag || form.canonicalUrl || autoCanonicalUrl(page),
      openGraphTags: form.openGraphTags,
      schemaMarkup: form.schemaMarkup,
      ogImage: form.ogImage,
      isActive: form.isActive,
      updatedBy: adminName,
    });
  } catch (seoErr) {
    const reason = seoErr instanceof ApiRequestError ? seoErr.message : "Could not reach the server.";
    throw new Error(`SEO was not saved: ${reason}`);
  }

  return updated;
}
