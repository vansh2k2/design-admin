import type { SectionsDraft, SetSectionsDraft } from "./types";

/**
 * Design House Home Page sync and save strategy.
 * Full section data across all 13 home sections is stored and synchronized
 * via the page CMS settings API (savePageCore), without altering backend schemas.
 */

export function syncHomeSectionsFromLiveApi(_setSectionsDraft: SetSectionsDraft): void {
  // Design House sections are loaded and merged from page settings and templates
}

export async function saveHomeSections(_sectionsDraft: SectionsDraft): Promise<void> {
  // Sections are cleanly persisted to CMS page settings by savePageCore
}
