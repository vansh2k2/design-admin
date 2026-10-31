import { api, ApiRequestError } from "@/lib/api";
import type { CmsRecord } from "@/lib/cmsJson";
import type { SectionsDraft, SetSectionsDraft } from "./types";

/**
 * Design House Contact Us page: the Hero, Direct Contact Information, Regional Offices and Map
 * sections are loaded from and saved to the backend (/contact-page), which the website reads.
 * The enquiry form itself is managed in Contact Us Messages, so its section is not shown here.
 */

interface ContactPageData {
  hero: { eyebrow: string; headline: string; description: string; image: string; imageAlt: string; highlights: string[] };
  contactInfo: {
    eyebrow: string;
    title: string;
    description: string;
    phones: string[];
    email: string;
    weekdayHours: string;
    weekendHours: string;
  };
  offices: {
    eyebrow: string;
    title: string;
    description: string;
    items: { label: string; city: string; address: string; mapQuery: string; image: string; imageAlt: string }[];
  };
  map: { eyebrow: string; title: string; description: string; buttonLabel: string; mapLink: string; embedUrl: string };
}

const HERO_ICONS = ["MapPin", "ClipboardPen", "MessageCircleMore"];

const str = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const list = (v: unknown): CmsRecord[] => (Array.isArray(v) ? (v as CmsRecord[]) : []);

export const isContactFormSection = (s: CmsRecord) =>
  s.key === "contact-form" || s.name === "Contact & Enquiry Form" || s.name === "Contact Form";

/** Backend data -> the editor's sections */
function applyToSection(section: CmsRecord, data: ContactPageData): CmsRecord {
  switch (section.key) {
    case "contact-hero":
      return {
        ...section,
        eyebrow: data.hero.eyebrow,
        headline: data.hero.headline,
        description: data.hero.description,
        image: data.hero.image,
        imageAlt: data.hero.imageAlt,
        items: data.hero.highlights.map((label, i) => ({ label, icon: list(section.items)[i]?.icon ?? HERO_ICONS[i] ?? "MapPin" })),
      };
    case "contact-info":
      return {
        ...section,
        eyebrow: data.contactInfo.eyebrow,
        title: data.contactInfo.title,
        description: data.contactInfo.description,
        phoneNumber1: data.contactInfo.phones[0] ?? "",
        phoneNumber2: data.contactInfo.phones[1] ?? "",
        contactEmail: data.contactInfo.email,
        workingHoursWeekday: data.contactInfo.weekdayHours,
        workingHoursWeekend: data.contactInfo.weekendHours,
      };
    case "offices":
    case "contact-offices":
      return {
        ...section,
        eyebrow: data.offices.eyebrow,
        title: data.offices.title,
        description: data.offices.description,
        items: data.offices.items.map((o) => ({
          label: o.label,
          city: o.city,
          lines: o.address,
          query: o.mapQuery,
          image: o.image,
          imageAlt: o.imageAlt,
        })),
      };
    case "contact-map":
      return {
        ...section,
        eyebrow: data.map.eyebrow,
        title: data.map.title,
        description: data.map.description,
        buttonLabel: data.map.buttonLabel,
        buttonHref: data.map.mapLink,
        mapEmbedUrl: data.map.embedUrl,
      };
    default:
      return section;
  }
}

export function syncContactSectionsFromLiveApi(setSectionsDraft: SetSectionsDraft): void {
  // Hide the enquiry form section straight away; fill the rest once the backend answers
  setSectionsDraft((prev) => prev.filter((s) => !isContactFormSection(s)));
  api
    .get<ContactPageData>("/contact-page")
    .then((data) => {
      setSectionsDraft((prev) => prev.filter((s) => !isContactFormSection(s)).map((s) => applyToSection(s, data)));
    })
    .catch(() => {
      // Keep the built-in content in the editor; saving reports any connection problem
    });
}

/** The editor's sections -> backend data */
export async function saveContactSections(sectionsDraft: SectionsDraft): Promise<void> {
  const find = (...keys: string[]) => sectionsDraft.find((s) => keys.includes(str(s.key))) ?? {};
  const hero = find("contact-hero");
  const info = find("contact-info");
  const offices = find("offices", "contact-offices");
  const map = find("contact-map");

  const payload: ContactPageData = {
    hero: {
      eyebrow: str(hero.eyebrow),
      // Older saved data had the headline in two fields
      headline: str(hero.headline) || [str(hero.title), hero.highlightedWord ? `*${str(hero.highlightedWord)}*` : ""].filter(Boolean).join("\n"),
      description: str(hero.description),
      image: str(hero.image),
      imageAlt: str(hero.imageAlt),
      highlights: list(hero.items).map((i) => str(i.label || i.title)).filter(Boolean),
    },
    contactInfo: {
      eyebrow: str(info.eyebrow),
      title: str(info.title),
      description: str(info.description),
      phones: [str(info.phoneNumber1), str(info.phoneNumber2)].filter((p) => p.trim()),
      email: str(info.contactEmail),
      weekdayHours: str(info.workingHoursWeekday),
      weekendHours: str(info.workingHoursWeekend),
    },
    offices: {
      eyebrow: str(offices.eyebrow),
      title: str(offices.title),
      description: str(offices.description),
      items: list(offices.items).map((o) => ({
        label: str(o.label),
        city: str(o.city),
        address: str(o.lines || o.address),
        mapQuery: str(o.query || o.mapQuery),
        image: str(o.image),
        imageAlt: str(o.imageAlt),
      })),
    },
    map: {
      eyebrow: str(map.eyebrow),
      title: str(map.title),
      description: str(map.description),
      buttonLabel: str(map.buttonLabel),
      mapLink: str(map.buttonHref),
      embedUrl: str(map.mapEmbedUrl),
    },
  };

  try {
    await api.put("/contact-page", payload);
  } catch (err) {
    const reason = err instanceof ApiRequestError ? err.message : "Could not reach the server.";
    throw new Error(`Contact page was not saved: ${reason}`);
  }
}
