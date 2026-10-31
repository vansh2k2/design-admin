import type { CmsPage } from "@/lib/cmsPages";
import { DH_PAGE_DEFINITIONS } from "@/lib/designHouseCmsContent";

// "Select Template" choices: the website's pages, same list and order as the Pages screen
export const WEBSITE_PAGE_TEMPLATES: string[] = DH_PAGE_DEFINITIONS.map(([, title]) => title);

export function getTemplateForPage(p: { type?: string; configKey?: string; title: string }): string {
  return DH_PAGE_DEFINITIONS.find(([key]) => key === p.configKey)?.[1] ?? p.title;
}

export function getPageForTemplate(templateName: string, allPages: CmsPage[]): CmsPage | undefined {
  const configKey = DH_PAGE_DEFINITIONS.find(([, title]) => title.toLowerCase() === templateName.toLowerCase())?.[0];
  if (configKey) return allPages.find((p) => p.configKey === configKey);
  return allPages.find((p) => p.title.toLowerCase() === templateName.toLowerCase());
}
