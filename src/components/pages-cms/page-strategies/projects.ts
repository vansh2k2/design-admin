import type { SectionsDraft, SetSectionsDraft } from "./types";

/**
 * Design House Projects Page sync and save strategy.
 * Full section data across Projects Hero, Featured Showcase, Portfolio Grid,
 * Diverse Spaces, Impact Metrics, 4-Stage Process, and Enquiry CTA is stored and
 * synchronized via the page CMS settings API (savePageCore), without altering backend schemas.
 */

export function syncProjectsSectionsFromLiveApi(_setSectionsDraft: SetSectionsDraft): void {
  // Projects sections are loaded and merged from page settings and templates
}

export async function saveProjectsSections(_sectionsDraft: SectionsDraft): Promise<void> {
  // Sections are cleanly persisted to CMS page settings by savePageCore
}
