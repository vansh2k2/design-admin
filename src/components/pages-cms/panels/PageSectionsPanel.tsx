import { ChevronRight } from "lucide-react";
import { SectionFieldsEditor, SectionItemsEditor, SectionTitle } from "../section-editor";
import { schemaSectionFor } from "../section-editor/SectionFieldsEditor";
import { Toggle } from "../fields";
import type { CmsRecord } from "@/lib/cmsJson";

export function PageSectionsPanel({
  sectionsDraft,
  setSectionsDraft,
  openSectionIndices,
  setOpenSectionIndices,
  toggleSectionAccordion,
  updateSectionField,
  updateSectionItem,
  addSectionItem,
  removeSectionItem,
  resetToWebsiteDefaults,
}: {
  sectionsDraft: Array<CmsRecord>;
  setSectionsDraft: React.Dispatch<React.SetStateAction<Array<CmsRecord>>>;
  openSectionIndices: Set<number>;
  setOpenSectionIndices: React.Dispatch<React.SetStateAction<Set<number>>>;
  toggleSectionAccordion: (index: number) => void;
  updateSectionField: (sectionIndex: number, key: string, value: unknown) => void;
  updateSectionItem: (sectionIndex: number, itemIndex: number, key: string, value: unknown) => void;
  addSectionItem: (sectionIndex: number) => void;
  removeSectionItem: (sectionIndex: number, itemIndex: number) => void;
  resetToWebsiteDefaults: () => void;
}) {
  return (
    <section
      className="
        flex
        shrink-0
        flex-col
        shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_0_0_1px_rgba(27,31,35,0.15)]
        bg-white
        px-[16px]
        py-[9px]
      "
    >
      <div
        className="
          flex
          shrink-0
          items-start
          justify-between
        "
      >
        <SectionTitle
          number={2}
          title="Page Sections"
        />

        <span className="text-[9.5px] font-semibold text-[#4B1426]">
          {sectionsDraft.length} sections
        </span>
      </div>

      {/* EXPAND / COLLAPSE GLOBAL ACTIONS */}
      <div className="mt-[10px] flex items-center justify-between border-b border-[#f1f5f9] pb-[8px] mb-[12px]">
        <span className="text-[10.5px] font-bold text-[#1e293b]">
          Page Landing Sections ({sectionsDraft.length})
        </span>
        <div className="flex items-center gap-[6px]">
          <button
            type="button"
            onClick={() => setOpenSectionIndices(new Set(sectionsDraft.map((_, i) => i)))}
            className="text-[9.5px] font-semibold text-[#4B1426] hover:underline"
          >
            Expand All
          </button>
          <span className="text-[#cbd5e1]">|</span>
          <button
            type="button"
            onClick={() => setOpenSectionIndices(new Set())}
            className="text-[9.5px] font-semibold text-[#64748b] hover:underline"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* INDIVIDUAL COLLAPSIBLE SECTION CARDS */}
      {sectionsDraft.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-center my-3">
          <p className="text-[12px] font-semibold text-amber-800 mb-2">No sections currently loaded for this page.</p>
          <button
            type="button"
            onClick={resetToWebsiteDefaults}
            className="px-4 py-1.5 bg-[#4B1426] text-white text-[11px] font-bold rounded hover:bg-[#380e1c] transition-colors shadow-sm"
          >
            Load Live Website Defaults
          </button>
        </div>
      )}
      <div className="flex flex-col gap-[10px]">
        {sectionsDraft.map((section, sectionIndex) => {
          const isOpen = openSectionIndices.has(sectionIndex);

          return (
            <div
              key={section._id ?? section.key ?? sectionIndex}
              className={`rounded-[6px] border transition ${isOpen ? "border-[#4B1426] bg-[#fbfbfa]" : "border-[#cbd5e1] bg-white hover:border-[#94a3b8]"
                }`}
            >
              {/* SECTION CARD HEADER */}
              <div
                onClick={() => toggleSectionAccordion(sectionIndex)}
                className={`flex cursor-pointer items-center justify-between px-[14px] py-[10px] transition ${isOpen ? "bg-[#fdf2f4] border-b border-[#f5d0d6]" : "bg-[#f8fafc]"
                  }`}
              >
                <div className="flex items-center gap-[8px]">
                  <ChevronRight
                    className={`h-4 w-4 text-[#4B1426] transition-transform ${isOpen ? "rotate-90 text-[#3b0f1e]" : ""
                      }`}
                  />
                  <span className="font-mono text-[10px] font-bold text-[#64748b]">
                    {sectionIndex + 1}.
                  </span>
                  <span className="text-[12px] font-bold text-[#4B1426]">
                    {section.name ?? section.key}
                  </span>
                  {section.enabled === false && (
                    <span className="rounded-[4px] bg-rose-50 border border-rose-200 px-[6px] py-[1px] text-[8px] font-bold text-rose-600">
                      Disabled
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-[10px]" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-[6px]">
                    <span
                      className={`text-[9.5px] font-bold ${section.enabled !== false ? "text-[#16a34a]" : "text-[#dc2626]"
                        }`}
                    >
                      {section.enabled !== false ? "Enabled" : "Disabled"}
                    </span>
                    <Toggle
                      checked={section.enabled !== false}
                      onChange={(value) => updateSectionField(sectionIndex, "enabled", value)}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION BODY (ONLY RENDERED WHEN OPEN) */}
              {isOpen && (
                <div className="flex flex-col gap-[12px] p-[14px] bg-[#fbfbfa]">
                  <SectionFieldsEditor
                    section={section}
                    onFieldChange={(key, value) => updateSectionField(sectionIndex, key, value)}
                  />

                  {/* The home hero has its own editor (HomeHeroFields) */}
                  {Array.isArray(section.slides) && !(section.key === "hero" && section.name === "Hero Carousel Slides") && (
                    <div className="flex flex-col gap-[8px]">
                      <SectionItemsEditor
                        items={section.slides}
                        onChangeItem={(itemIndex, key, value) => {
                          setSectionsDraft((previous) =>
                            previous.map((sec, i) => {
                              if (i !== sectionIndex) return sec;
                              const slides = [...(sec.slides ?? [])];
                              const currentSlide = slides[itemIndex] || {};
                              const updatedSlide = { ...currentSlide, [key]: value };
                              if (key === "image") updatedSlide.img = value;
                              if (key === "img") updatedSlide.image = value;
                              if (key === "headingLine1") updatedSlide.titlePrimary = value;
                              if (key === "titlePrimary") updatedSlide.headingLine1 = value;
                              if (key === "headingLine2") updatedSlide.titleSecondary = value;
                              if (key === "titleSecondary") updatedSlide.headingLine2 = value;
                              if (key === "headingLine3") updatedSlide.titleTertiary = value;
                              if (key === "titleTertiary") updatedSlide.headingLine3 = value;
                              if (key === "desc") updatedSlide.description = value;
                              if (key === "description") updatedSlide.desc = value;
                              if (key === "button1Text") updatedSlide.buttonLabel = value;
                              if (key === "buttonLabel") updatedSlide.button1Text = value;
                              if (key === "button1Href") updatedSlide.buttonHref = value;
                              if (key === "buttonHref") updatedSlide.button1Href = value;
                              if (key === "button2Text") updatedSlide.secondaryButtonLabel = value;
                              if (key === "secondaryButtonLabel") updatedSlide.button2Text = value;
                              if (key === "button2Href") updatedSlide.secondaryButtonHref = value;
                              if (key === "secondaryButtonHref") updatedSlide.button2Href = value;
                              slides[itemIndex] = updatedSlide;
                              return { ...sec, slides };
                            }),
                          );
                        }}
                        onAddItem={() => {
                          setSectionsDraft((previous) =>
                            previous.map((sec, i) => {
                              if (i !== sectionIndex) return sec;
                              const slides = [...(sec.slides ?? [])];
                              const blank = {
                                navLabel: `Slide ${slides.length + 1}`,
                                alt: "Design House interior and display solutions banner",
                                image: "/images/slider-1.jpg",
                                img: "/images/slider-1.jpg",
                                tagline: "Design • Manufacturing • Execution",
                                headingLine1: "Crafting Spaces",
                                headingLine1Accent: false,
                                headingLine2: "That Inspire",
                                headingLine2Accent: true,
                                headingLine3: "Brand Excellence.",
                                headingLine3Accent: false,
                                titlePrimary: "Crafting Spaces",
                                titleSecondary: "That Inspire",
                                titleTertiary: "Brand Excellence.",
                                desc: "<p>Innovative retail, corporate and commercial interiors designed and executed to perfection across India.</p>",
                                description: "<p>Innovative retail, corporate and commercial interiors designed and executed to perfection across India.</p>",
                                button1Text: "Discuss Your Project",
                                button1Href: "/contact",
                                button2Text: "Explore Our Work",
                                button2Href: "/portfolio",
                                buttonLabel: "Discuss Your Project",
                                buttonHref: "/contact",
                                secondaryButtonLabel: "Explore Our Work",
                                secondaryButtonHref: "/portfolio",
                                underline: true,
                                uppercaseTitle: false,
                                compact: true,
                                badge: "",
                                layout: "default",
                                feature1Label: "",
                                feature1Icon: "",
                                feature2Label: "",
                                feature2Icon: "",
                                feature3Label: "",
                                feature3Icon: "",
                                feature4Label: "",
                                feature4Icon: "",
                                service1Label: "Retail\nInteriors",
                                service1Href: "/services/retail-interior",
                                service1Icon: "/assets/icon/icon1.png",
                                service2Label: "Display\nSolutions",
                                service2Href: "/services/retail-kiosk",
                                service2Icon: "/assets/icon/icon2.png",
                                service3Label: "Corporate\nInteriors",
                                service3Href: "/services/corporate-interior",
                                service3Icon: "/assets/icon/icon3.png",
                                service4Label: "Exhibition\nStalls",
                                service4Href: "/services/exhibitions",
                                service4Icon: "/assets/icon/icon4.png",
                                service5Label: "Manufacturing\n& Execution",
                                service5Href: "/services",
                                service5Icon: "/assets/icon/icon5.png",
                              };
                              return { ...sec, slides: [...slides, blank] };
                            }),
                          );
                        }}
                        onRemoveItem={(itemIndex) => {
                          setSectionsDraft((previous) =>
                            previous.map((sec, i) => {
                              if (i !== sectionIndex) return sec;
                              const slides = (sec.slides ?? []).filter((_: unknown, idx: number) => idx !== itemIndex);
                              return { ...sec, slides };
                            }),
                          );
                        }}
                        sectionId={section.key}
                      />
                    </div>
                  )}

                  {Array.isArray(section.items) && section.key !== "hero" && !(section.key === "what-we-do" && section.name === "What We Do (Turnkey Spaces)") && !(section.key === "our-achievements" && section.name === "Our Achievements (Trust & Numbers)") && !(section.key === "our-projects" && section.name === "Our Projects (Portfolio Grid)") && !schemaSectionFor(section) && section.key !== "introduction-section" && section.key !== "why-participate" && section.key !== "conference-section" && section.key !== "sponsors-attend" && section.key !== "testimonials-section" && (
                    <SectionItemsEditor
                      items={section.items}
                      onChangeItem={(itemIndex, key, value) => updateSectionItem(sectionIndex, itemIndex, key, value)}
                      onAddItem={() => addSectionItem(sectionIndex)}
                      onRemoveItem={(itemIndex) => removeSectionItem(sectionIndex, itemIndex)}
                      sectionId={section.key}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
