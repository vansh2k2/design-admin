import { api } from "@/lib/api";
import type { SectionsDraft, SetSectionsDraft } from "./types";
import type { CmsRecord } from "@/lib/cmsJson";

// Downloads page hero banner: stored in the backend (/api/page-sections/downloads-hero), read by the
// website. Its title + highlighted word form the page's H1.
const HERO_ENDPOINT = "/page-sections/downloads-hero";
const isHero = (sec: CmsRecord) => sec.key === "downloads-hero";

type DownloadsHero = {
  enabled?: boolean;
  eyebrow?: string;
  title?: string;
  highlightedWord?: string;
  description?: string;
  image?: string;
  alt?: string;
  heroWords?: string;
};

export function syncDownloadsSectionsFromLiveApi(setSectionsDraft: SetSectionsDraft): void {
  api
    .get<DownloadsHero>(HERO_ENDPOINT)
    .then((data) => {
      if (!data || Array.isArray(data)) return;
      setSectionsDraft((prev) =>
        prev.map((sec) =>
          isHero(sec)
            ? {
                ...sec,
                enabled: data.enabled ?? sec.enabled,
                eyebrow: data.eyebrow ?? sec.eyebrow,
                title: data.title ?? sec.title,
                highlightedWord: data.highlightedWord ?? sec.highlightedWord,
                description: data.description ?? sec.description,
                // Empty on the server = the website's built-in banner; keep the editor's preview path then
                image: data.image || sec.image,
                alt: data.alt ?? sec.alt,
                heroWords: data.heroWords ?? sec.heroWords,
              }
            : sec,
        ),
      );
    })
    .catch(() => {});
}

export async function saveDownloadsSections(sectionsDraft: SectionsDraft): Promise<void> {
  const hero = sectionsDraft.find(isHero);
  if (!hero) return;
  const image = String(hero.image || "");
  await api.put(HERO_ENDPOINT, {
    enabled: hero.enabled !== false,
    eyebrow: hero.eyebrow || "",
    title: hero.title || "",
    highlightedWord: hero.highlightedWord || "",
    description: hero.description || "",
    // Only uploaded (Cloudinary) images are saved; the editor's built-in "/assets/..." preview path is not a URL
    image: /^https?:\/\//.test(image) ? image : "",
    alt: hero.alt || "",
    heroWords: hero.heroWords || "",
  });
}
