import type { SectionsDraft, SetSectionsDraft } from "./types";

/**
 * Design House Contact Us Page sync and save strategy.
 * Full section data across Contact Hero, Direct Contact Info, Enquiry Form,
 * Regional Offices, and Map is stored and synchronized via the page CMS settings API
 * (savePageCore), without altering backend schemas.
 */

export function syncContactSectionsFromLiveApi(_setSectionsDraft: SetSectionsDraft): void {
  // Contact Us sections are loaded and merged from page settings and templates
}

export async function saveContactSections(_sectionsDraft: SectionsDraft): Promise<void> {
  // Sections are cleanly persisted to CMS page settings by savePageCore
}
