"use client";

import React, { useRef, useState } from "react";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { FieldLabel, ImageUploadField, ImageWithAltField, SelectField, TextInput, Textarea, Toggle, VideoUploadField } from "../fields";
import RichTextEditor from "@/components/RichTextEditor";
import { IMAGE_KEY_PATTERN, LONG_TEXT_KEY_PATTERN, RICH_TEXT_KEY_PATTERN, VIDEO_KEY_PATTERN, humanizeKey } from "./sectionFieldHelpers";
import type { CmsRecord } from "@/lib/cmsJson";

/* =========================================================
   GENERIC SECTION ITEMS EDITOR
   Handles the repeatable "items" list every section can have (stat
   cards, FAQ entries, links, ...) — add / remove / edit each item's
   own scalar fields generically.
========================================================= */

export function SectionItemsEditor({
  items,
  onChangeItem,
  onAddItem,
  onRemoveItem,
  sectionId,
}: {
  items: Array<CmsRecord>;
  onChangeItem: (index: number, key: string, value: unknown) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  sectionId?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggle = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
      setTimeout(() => {
        itemRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    }
  };

  const FIELD_ORDER_PRIORITY: Record<string, number> = {
    navLabel: 0.6,
    iconImage: 0.8,
    image: 0.9,
    img: 0.95,
    alt: 1.0,
    imageAlt: 1.05,
    tagline: 1.2,
    headingLine1: 2.0,
    headingLine1Accent: 2.05,
    headingLine2: 2.1,
    headingLine2Accent: 2.15,
    headingLine3: 2.2,
    headingLine3Accent: 2.25,
    titlePrimary: 2.3,
    titleSecondary: 2.4,
    titleTertiary: 2.5,
    title1: 3.1,
    title2: 3.2,
    title: 4,
    subtitle: 4.5,
    name: 6,
    main: 6.2,
    sub: 6.4,
    label: 7,
    desc: 7.9,
    description: 8,
    shortDescription: 8,
    button1Text: 8.01,
    button1Href: 8.02,
    button2Text: 8.03,
    button2Href: 8.04,
    buttonLabel: 8.05,
    buttonHref: 8.06,
    secondaryButtonLabel: 8.07,
    secondaryButtonHref: 8.08,
    underline: 8.1,
    uppercaseTitle: 8.15,
    compact: 8.2,
    badge: 8.25,
    layout: 8.3,
    feature1Label: 8.31,
    feature1Icon: 8.32,
    feature2Label: 8.33,
    feature2Icon: 8.34,
    feature3Label: 8.35,
    feature3Icon: 8.36,
    feature4Label: 8.37,
    feature4Icon: 8.38,
    service1Label: 8.41,
    service1Href: 8.42,
    service1Icon: 8.43,
    service2Label: 8.44,
    service2Href: 8.45,
    service2Icon: 8.46,
    service3Label: 8.47,
    service3Href: 8.48,
    service3Icon: 8.49,
    service4Label: 8.50,
    service4Href: 8.51,
    service4Icon: 8.52,
    service5Label: 8.53,
    service5Href: 8.54,
    service5Icon: 8.55,
    keyPoint1: 8.61,
    keyPoint2: 8.62,
    keyPoint3: 8.63,
    keyPoint4: 8.64,
    feature1: 8.71,
    feature2: 8.72,
    feature3: 8.73,
    features: 8.74,
    points: 8.75,
    num: 8.8,
    date: 9,
    location: 10,
    icon: 18,
  };

  const getSectionAddLabel = () => {
    if (sectionId === "hero") return "Add Hero Slide";
    if (sectionId === "navbar") return "Add Header Navigation Link";
    if (sectionId === "what-we-do") return "Add Service Card";
    if (sectionId === "our-achievements" || sectionId === "achievements") return "Add Achievement Stat Card";
    if (sectionId === "our-projects") return "Add Project Showcase";
    if (sectionId === "why-choose-us") return "Add Reason Card";
    if (sectionId === "capabilities") return "Add Capability Step";
    if (sectionId === "our-approach" || sectionId === "approach") return "Add Process Step";
    if (sectionId === "featured-projects") return "Add Featured Project";
    if (sectionId === "our-strengths" || sectionId === "strengths") return "Add Strength Card";
    if (sectionId === "get-in-touch") return "Add Office / Location";
    if (sectionId === "featured-services") return "Add Featured Service";
    if (sectionId === "how-we-work") return "Add Process Step";
    if (sectionId === "stats-counter") return "Add Statistic Counter";
    if (sectionId === "clients-marquee") return "Add Client Partner Logo";
    if (sectionId === "testimonials-carousel") return "Add Review / Testimonial";
    if (sectionId === "faqs") return "Add FAQ";
    if (sectionId === "recent-articles") return "Add Article / Post";
    if (sectionId === "locations") return "Add Location Card";
    if (sectionId === "exhibition-hero") return "Add Feature";
    if (sectionId === "nominate-hero") return "Add Feature";
    if (sectionId === "why-exhibit-hero") return "Add Hero Highlight Block";
    if (sectionId === "why-visit-hero") return "Add Impact Stat Counter";
    if (sectionId === "why-visit-matters") return "Add Opportunity Card";
    if (sectionId === "audience-strip") return "Add Target Audience Group";
    if (sectionId === "introduction-section") return "Add Feature Highlight";
    if (sectionId === "global-platform") return "Add Platform Metric / Highlight";
    if (sectionId === "why-participate") return "Add Exhibitor Benefit";
    if (sectionId === "conference-section") return "Add Seminar / Workshop Session";
    if (sectionId === "expo-categories") return "Add Exhibition Category Sector";
    if (sectionId === "beyond-exhibition") return "Add Excellence Award Category";
    if (sectionId === "sponsorship-categories") return "Add Sponsorship Package Tier";
    if (sectionId === "buyer-seller-meet") return "Add B2B Matchmaking Feature";
    if (sectionId === "career-hero") return "Add Hero Highlight";
    if (sectionId === "why-work-with-us") return "Add Value Card";
    if (sectionId === "life-at-design-house") return "Add Workplace Photo";
    if (sectionId === "footer") return "Add Footer Link / Information";
    return "Add New Section Block";
  };

  const getItemLabel = (item: CmsRecord, index: number) => {
    const mainTitle =
      item.name ||
      item.title ||
      item.city ||
      item.author ||
      item.label ||
      item.step ||
      (item.titlePrimary ? `${item.titlePrimary} ${item.titleSecondary || ""}`.trim() : null) ||
      item.question ||
      item.tagline ||
      (item.title1 ? `${item.title1} ${item.title2 || ""}`.trim() : null) ||
      item.companyName1;
    if (mainTitle) return String(mainTitle);
    if (sectionId === "what-we-do") return `Service ${index + 1}`;
    if (sectionId === "our-achievements" || sectionId === "achievements") return `Achievement ${index + 1}`;
    if (sectionId === "our-projects") return `Project ${index + 1}`;
    if (sectionId === "why-choose-us") return `Reason ${index + 1}`;
    if (sectionId === "capabilities") return `Capability ${index + 1}`;
    if (sectionId === "our-approach" || sectionId === "approach") return `Step ${index + 1}`;
    if (sectionId === "featured-projects") return `Featured Project ${index + 1}`;
    if (sectionId === "our-strengths" || sectionId === "strengths") return `Strength ${index + 1}`;
    if (sectionId === "get-in-touch") return `Office ${index + 1}`;
    if (sectionId === "featured-services") return `Service ${index + 1}`;
    if (sectionId === "how-we-work") return `Step ${index + 1}`;
    if (sectionId === "stats-counter") return `Stat ${index + 1}`;
    if (sectionId === "clients-marquee") return `Client ${index + 1}`;
    if (sectionId === "testimonials-carousel") return `Testimonial ${index + 1}`;
    if (sectionId === "faqs") return `FAQ ${index + 1}`;
    if (sectionId === "recent-articles") return `Article ${index + 1}`;
    if (sectionId === "locations") return `Location ${index + 1}`;
    if (sectionId === "why-exhibit-hero") return item.main ? `${item.main} ${item.sub || ""}`.trim() : `Highlight Block ${index + 1}`;
    if (sectionId === "why-visit-hero") return item.label ? `${item.val || ""} ${item.label}`.trim() : `Stat Counter ${index + 1}`;
    if (sectionId === "why-visit-matters") return item.title ? String(item.title) : `Opportunity Card ${index + 1}`;
    if (sectionId === "reasons-to-exhibit") return item.title1 ? `${item.title1} ${item.title2 || ""}`.trim() : `Reason Block ${index + 1}`;
    if (sectionId === "hero") {
      const heading = item.headingLine1 || item.titlePrimary || item.navLabel || "";
      return heading ? `Hero Slide ${index + 1}: ${heading}` : `Hero Slide ${index + 1}`;
    }
    if (sectionId === "audience-strip") return `Audience Group ${index + 1}`;
    if (sectionId === "conference-section") return `Session ${index + 1}`;
    if (sectionId === "expo-categories") return `Sector ${index + 1}`;
    if (sectionId === "beyond-exhibition") return `Award Category ${index + 1}`;
    if (sectionId === "sponsorship-categories") return `Sponsorship Tier ${index + 1}`;
    if (sectionId === "career-hero") return item.label || item.title ? `Highlight: ${String(item.label || item.title).replace(/\n/g, " ")}` : `Highlight ${index + 1}`;
    if (sectionId === "why-work-with-us") return item.title ? String(item.title) : `Value Card ${index + 1}`;
    if (sectionId === "life-at-design-house") return item.title ? String(item.title) : `Workplace Photo ${index + 1}`;
    if (sectionId === "navbar" || sectionId === "footer") return `Link ${index + 1}`;
    return `Block ${index + 1}`;
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-[8px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[11px] font-bold text-[#1e40af]">
            {sectionId === "hero" ? "Hero Carousel Slides" :
              sectionId === "career-hero" ? "Hero Highlight Points (Icons & Labels)" :
              sectionId === "why-work-with-us" ? "Why Work With Us Cards (Icons, Titles & Texts)" :
              sectionId === "life-at-design-house" ? "Workplace Photo Gallery (Photos & Alt Tags)" :
              sectionId === "navbar" ? "Header Navigation Links" :
              sectionId === "what-we-do" ? "Turnkey Service Cards" :
              sectionId === "our-achievements" || sectionId === "achievements" ? "Key Achievement Stat Cards" :
              sectionId === "our-projects" ? "Project Showcase Portfolio Cards" :
              sectionId === "why-choose-us" ? "Reasons & Value Proposition Cards" :
              sectionId === "capabilities" ? "Manufacturing Capability Process Steps" :
              sectionId === "our-approach" || sectionId === "approach" ? "5-Stage Turnkey Process Steps" :
              sectionId === "featured-projects" ? "Landmark Featured Project Cards" :
              sectionId === "our-strengths" || sectionId === "strengths" ? "Infrastructure, Team & Measurable Strengths" :
              sectionId === "get-in-touch" ? "Offices & Regional Presence Locations" :
              sectionId === "featured-services" ? "Featured Services List" :
              sectionId === "how-we-work" ? "Process Steps (How We Work)" :
              sectionId === "stats-counter" ? "Key Milestone Statistics" :
              sectionId === "clients-marquee" ? "Client & Partner Logos" :
              sectionId === "testimonials-carousel" ? "Client Testimonials & Reviews" :
              sectionId === "faqs" ? "Frequently Asked Questions" :
              sectionId === "recent-articles" ? "Recent News & Insight Articles" :
              sectionId === "locations" ? "Regional & Branch Locations" :
              sectionId === "audience-strip" ? "Target Audience List" :
                sectionId === "introduction-section" ? "Key Feature Cards" :
                  sectionId === "global-platform" ? "Platform Highlights & Deals" :
                    sectionId === "why-participate" ? "Exhibitor Benefits List" :
                      sectionId === "conference-section" ? "Seminar & Workshop Sessions" :
                        sectionId === "expo-categories" ? "Exhibition Category Cards" :
                          sectionId === "beyond-exhibition" ? "Event Highlights & Awards" :
                            sectionId === "sponsorship-categories" ? "Sponsorship Packages & Tiers" :
                              sectionId === "buyer-seller-meet" ? "Matchmaking Process Steps" :
                                sectionId === "exhibition-hero" ? "Hero Features (Stats Bar)" :
                                  sectionId === "nominate-hero" ? "Hero Features (Icon Row)" :
                                    sectionId === "footer" ? "Footer Quick Links" : "Section Content Blocks"}
          </span>
          <span className="rounded-full bg-blue-50 border border-blue-200 px-[7px] py-[1px] text-[8.5px] font-bold text-blue-700">
            {items.length} Total
          </span>
        </div>

        {sectionId !== "audience-strip" && sectionId !== "beyond-exhibition" && sectionId !== "reasons-to-exhibit" && sectionId !== "industry-segments" && (
          <button
            type="button"
            onClick={onAddItem}
            className="flex h-[24px] items-center gap-[4px] rounded-[4px] border border-blue-200 bg-white px-[8px] text-[9px] font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-[10px] w-[10px]" />
            {getSectionAddLabel()}
          </button>
        )}
      </div>

      {items.length === 0 && (
        <p className="text-[10px] font-medium text-[#8b929c]">No items added yet.</p>
      )}

      <div className="space-y-3 pt-1">
        {items.map((item, index) => {
          let itemToEdit = { ...item };
          if (sectionId === "expo-categories") {
            delete itemToEdit.icon;
            delete itemToEdit.desc;
            delete itemToEdit.color;
            delete itemToEdit.imageAlt;
            if (itemToEdit.description === undefined) itemToEdit.description = item.desc || "";
            if (itemToEdit.image === undefined) itemToEdit.image = "";
            if (!itemToEdit.exploreText) itemToEdit.exploreText = "Explore";
            if (!itemToEdit.href) itemToEdit.href = item.link || "/exhibition-categories";
          } else if (sectionId === "beyond-exhibition") {
            delete itemToEdit.subtitle;
            delete itemToEdit.title2;
            delete itemToEdit.color;
            delete itemToEdit.image;
            delete itemToEdit.imageAlt;
            if (itemToEdit.description === undefined) itemToEdit.description = item.subtitle || "";
            if (!itemToEdit.icon) itemToEdit.icon = "Users";
          } else if (sectionId === "why-exhibit-hero") {
            delete itemToEdit.icon;
            delete itemToEdit.img;
            const defaultImg = `/uploads/icons/x${(index % 4) + 1}.png`;
            if (!itemToEdit.image) {
              itemToEdit.image = item.img || defaultImg;
            }
          } else if (sectionId === "reasons-to-exhibit") {
            delete itemToEdit.icon;
            delete itemToEdit.img;
            delete itemToEdit.descLines;
            delete itemToEdit.points;
            delete itemToEdit.features;

            const defaultIcons = [
              "/uploads/icons/11og.webp",
              "/uploads/icons/12og.webp",
              "/uploads/icons/13og.webp",
              "/uploads/icons/14og.webp",
              "/uploads/icons/15og.webp",
              "/uploads/icons/i6.png",
            ];
            const defaultDescs = [
              "Meet thousands of qualified buyers, importers, distributors and decision-makers from around the world.",
              "Showcase your brand to a highly targeted audience and stand out in the competitive market.",
              "Build valuable connections with industry leaders, partners and potential collaborators.",
              "Introduce new organic products, technologies and solutions to the right audience.",
              "Pre-scheduled B2B meetings to generate quality leads and new business.",
              "Explore new markets, increase exports and drive long-term business growth.",
            ];
            const defaultFeatures = [
              ["Access new global markets", "Connect with key buyers", "Increase international reach"],
              ["High brand recall", "Media & PR exposure", "Digital promotions"],
              ["New partnerships", "Business alliances", "Long-term relationships"],
              ["Product launches", "Live demonstrations", "Market validation"],
              ["One-to-one meetings", "Targeted matchmaking", "Better conversions"],
              ["Increase revenue", "Expand customer base", "Sustainable growth"],
            ];

            const defaultImg = defaultIcons[index % defaultIcons.length];
            if (!itemToEdit.image) {
              itemToEdit.image = item.img || item.image || defaultImg;
            }
            if (itemToEdit.description === undefined) {
              itemToEdit.description = item.description || defaultDescs[index % defaultDescs.length];
            }
            const currentFeatures = Array.isArray(item.features) && item.features.length > 0
              ? item.features
              : Array.isArray(item.points) && item.points.length > 0
              ? item.points
              : defaultFeatures[index % defaultFeatures.length];

            if (itemToEdit.feature1 === undefined) itemToEdit.feature1 = item.feature1 ?? currentFeatures[0] ?? "";
            if (itemToEdit.feature2 === undefined) itemToEdit.feature2 = item.feature2 ?? currentFeatures[1] ?? "";
            if (itemToEdit.feature3 === undefined) itemToEdit.feature3 = item.feature3 ?? currentFeatures[2] ?? "";
          } else if (sectionId === "why-visit-matters") {
            delete itemToEdit.icon;
            delete itemToEdit.img;
            delete itemToEdit.desc;
            const defaultImgs = [
              "/uploads/icons/v1og.png",
              "/uploads/icons/v2og.png",
              "/uploads/icons/v3og.png",
              "/uploads/icons/v4og.png",
              "/uploads/icons/v5og.png",
              "/uploads/icons/v6og.png",
            ];
            if (!itemToEdit.image) {
              itemToEdit.image = item.img || item.image || defaultImgs[index % defaultImgs.length];
            }
            if (itemToEdit.description === undefined) {
              itemToEdit.description = item.description || item.desc || "";
            }
            if (itemToEdit.num === undefined) {
              itemToEdit.num = item.num || `0${index + 1}`;
            }
          } else if (sectionId === "industry-segments") {
            delete itemToEdit.icon;
            delete itemToEdit.color;
            delete itemToEdit.imageAlt;
            delete itemToEdit.desc;
            delete itemToEdit.description;
            const defaultBgImgs = [
              "/uploads/icons/x1.webp",
              "/uploads/icons/x2.webp",
              "/uploads/icons/x3.webp",
              "/uploads/icons/x4.webp",
              "/uploads/icons/x5.webp",
              "/uploads/icons/x6.webp",
            ];
            const defaultIconImgs = [
              "/uploads/icons/x1og.png",
              "/uploads/icons/x2og.png",
              "/uploads/icons/x3og.png",
              "/uploads/icons/x4og.png",
              "/uploads/icons/x5og.png",
              "/uploads/icons/x6og.png",
            ];
            if (!itemToEdit.iconImage) {
              itemToEdit.iconImage = item.iconImage || item.iconImg || defaultIconImgs[index % defaultIconImgs.length];
            }
            if (!itemToEdit.image) {
              itemToEdit.image = item.image || defaultBgImgs[index % defaultBgImgs.length];
            }
            if (itemToEdit.subtitle === undefined) itemToEdit.subtitle = item.subtitle || item.items || "";
          } else if (sectionId === "global-platform") {
            delete itemToEdit.icon;
            if (itemToEdit.image === undefined) itemToEdit.image = item.image || "";
            if (itemToEdit.imageAlt === undefined) itemToEdit.imageAlt = item.imageAlt || "";
          } else if (sectionId === "gallery-counters") {
            delete itemToEdit.icon;
            delete itemToEdit.iconKey;
            const galDefaultImgs = [
              "/uploads/icons/gal1.png",
              "/uploads/icons/gal2.png",
              "/uploads/icons/gal3.png",
              "/uploads/icons/gal4.png",
              "/uploads/icons/gal5.png",
              "/uploads/icons/gal6.png",
            ];
            if (!itemToEdit.image) {
              itemToEdit.image = item.image || galDefaultImgs[index % galDefaultImgs.length];
            }
          } else {
            let defaultIcon = "";
            if (!item.icon) {
              const text = (item.title || "") + " " + (item.label || "");
              const textUpper = text.toUpperCase();
              if (textUpper.includes("HELPLINE")) defaultIcon = "users";
              else if (textUpper.includes("REGION")) defaultIcon = "building";
              else if (textUpper.includes("VOLUNTEER")) defaultIcon = "heart-hands";
              else if (textUpper.includes("SUPPORT")) defaultIcon = "heart-hands";
              else if (text.toUpperCase().includes("GIVE")) defaultIcon = "give-icon";
              else if (text.toUpperCase().includes("SERVE")) defaultIcon = "serve-icon";
              else if (text.toUpperCase().includes("PARTNER")) defaultIcon = "partner-icon";
            }
            itemToEdit = ("label" in item || "title" in item) && (!("icon" in item) || item.icon === "")
              ? { ...item, icon: defaultIcon }
              : item;
          }

          if (sectionId === "hero") {
            // Strip legacy Ensis fields and internal keys
            delete itemToEdit.showLutus;
            delete itemToEdit.isCenter;
            delete itemToEdit.listItems;
            delete itemToEdit.features;
            delete itemToEdit.points;
            delete itemToEdit.highlight;
            delete itemToEdit.id;
            delete itemToEdit._id;
            delete itemToEdit.headingLine1Accent;
            delete itemToEdit.headingLine2Accent;
            delete itemToEdit.headingLine3Accent;
            delete itemToEdit.underline;
            delete itemToEdit.uppercaseTitle;
            delete itemToEdit.compact;
            delete itemToEdit.badge;
            delete itemToEdit.layout;

            // 1. Heading lines: normalize to headingLine1, headingLine2, headingLine3 and delete aliases
            itemToEdit.headingLine1 = item.headingLine1 ?? item.titlePrimary ?? "";
            itemToEdit.headingLine2 = item.headingLine2 ?? item.titleSecondary ?? "";
            itemToEdit.headingLine3 = item.headingLine3 ?? item.titleTertiary ?? "";
            delete itemToEdit.titlePrimary;
            delete itemToEdit.titleSecondary;
            delete itemToEdit.titleTertiary;

            // 2. Description: normalize to description and delete desc alias
            itemToEdit.description = item.description ?? item.desc ?? "";
            delete itemToEdit.desc;

            // 3. Image: normalize to image and delete img alias
            itemToEdit.image = item.image ?? item.img ?? "";
            delete itemToEdit.img;

            // 4. Primary Button: normalize to button1Text & button1Href and delete aliases
            itemToEdit.button1Text = item.button1Text ?? item.buttonLabel ?? item.primaryButtonText ?? item.buttonText ?? "";
            itemToEdit.button1Href = item.button1Href ?? item.buttonHref ?? item.primaryButtonHref ?? item.href ?? "";
            delete itemToEdit.buttonLabel;
            delete itemToEdit.buttonHref;
            delete itemToEdit.primaryButtonText;
            delete itemToEdit.primaryButtonHref;
            delete itemToEdit.buttonText;
            delete itemToEdit.href;

            // 5. Secondary Button: normalize to button2Text & button2Href and delete aliases
            itemToEdit.button2Text = item.button2Text ?? item.secondaryButtonLabel ?? item.secondaryButtonText ?? "";
            itemToEdit.button2Href = item.button2Href ?? item.secondaryButtonHref ?? "";
            delete itemToEdit.secondaryButtonLabel;
            delete itemToEdit.secondaryButtonHref;
            delete itemToEdit.secondaryButtonText;

            // Ensure every slide has the 4 custom slide features
            if (itemToEdit.feature1Label === undefined) itemToEdit.feature1Label = item.feature1Label || "";
            if (itemToEdit.feature1Icon === undefined) itemToEdit.feature1Icon = item.feature1Icon || "";
            if (itemToEdit.feature2Label === undefined) itemToEdit.feature2Label = item.feature2Label || "";
            if (itemToEdit.feature2Icon === undefined) itemToEdit.feature2Icon = item.feature2Icon || "";
            if (itemToEdit.feature3Label === undefined) itemToEdit.feature3Label = item.feature3Label || "";
            if (itemToEdit.feature3Icon === undefined) itemToEdit.feature3Icon = item.feature3Icon || "";
            if (itemToEdit.feature4Label === undefined) itemToEdit.feature4Label = item.feature4Label || "";
            if (itemToEdit.feature4Icon === undefined) itemToEdit.feature4Icon = item.feature4Icon || "";

            // Ensure every slide has the 5 bottom services
            if (!itemToEdit.service1Label) itemToEdit.service1Label = item.service1Label || "Retail\nInteriors";
            if (!itemToEdit.service1Href) itemToEdit.service1Href = item.service1Href || "/services/retail-interior";
            if (!itemToEdit.service1Icon) itemToEdit.service1Icon = item.service1Icon || "/assets/icon/icon1.png";

            if (!itemToEdit.service2Label) itemToEdit.service2Label = item.service2Label || "Display\nSolutions";
            if (!itemToEdit.service2Href) itemToEdit.service2Href = item.service2Href || "/services/retail-kiosk";
            if (!itemToEdit.service2Icon) itemToEdit.service2Icon = item.service2Icon || "/assets/icon/icon2.png";

            if (!itemToEdit.service3Label) itemToEdit.service3Label = item.service3Label || "Corporate\nInteriors";
            if (!itemToEdit.service3Href) itemToEdit.service3Href = item.service3Href || "/services/corporate-interior";
            if (!itemToEdit.service3Icon) itemToEdit.service3Icon = item.service3Icon || "/assets/icon/icon3.png";

            if (!itemToEdit.service4Label) itemToEdit.service4Label = item.service4Label || "Exhibition\nStalls";
            if (!itemToEdit.service4Href) itemToEdit.service4Href = item.service4Href || "/services/exhibitions";
            if (!itemToEdit.service4Icon) itemToEdit.service4Icon = item.service4Icon || "/assets/icon/icon4.png";

            if (!itemToEdit.service5Label) itemToEdit.service5Label = item.service5Label || "Manufacturing\n& Execution";
            if (!itemToEdit.service5Href) itemToEdit.service5Href = item.service5Href || "/services";
            if (!itemToEdit.service5Icon) itemToEdit.service5Icon = item.service5Icon || "/assets/icon/icon5.png";

            // Alt tags for slide features
            if (itemToEdit.feature1IconAlt === undefined) itemToEdit.feature1IconAlt = item.feature1IconAlt || `${itemToEdit.feature1Label || "Feature 1"} Icon`;
            if (itemToEdit.feature2IconAlt === undefined) itemToEdit.feature2IconAlt = item.feature2IconAlt || `${itemToEdit.feature2Label || "Feature 2"} Icon`;
            if (itemToEdit.feature3IconAlt === undefined) itemToEdit.feature3IconAlt = item.feature3IconAlt || `${itemToEdit.feature3Label || "Feature 3"} Icon`;
            if (itemToEdit.feature4IconAlt === undefined) itemToEdit.feature4IconAlt = item.feature4IconAlt || `${itemToEdit.feature4Label || "Feature 4"} Icon`;

            // Alt tags for bottom services
            if (itemToEdit.service1IconAlt === undefined) itemToEdit.service1IconAlt = item.service1IconAlt || `${itemToEdit.service1Label?.replace(/\n/g, " ") || "Retail Interiors"} Icon`;
            if (itemToEdit.service2IconAlt === undefined) itemToEdit.service2IconAlt = item.service2IconAlt || `${itemToEdit.service2Label?.replace(/\n/g, " ") || "Display Solutions"} Icon`;
            if (itemToEdit.service3IconAlt === undefined) itemToEdit.service3IconAlt = item.service3IconAlt || `${itemToEdit.service3Label?.replace(/\n/g, " ") || "Corporate Interiors"} Icon`;
            if (itemToEdit.service4IconAlt === undefined) itemToEdit.service4IconAlt = item.service4IconAlt || `${itemToEdit.service4Label?.replace(/\n/g, " ") || "Exhibition Stalls"} Icon`;
            if (itemToEdit.service5IconAlt === undefined) itemToEdit.service5IconAlt = item.service5IconAlt || `${itemToEdit.service5Label?.replace(/\n/g, " ") || "Manufacturing & Execution"} Icon`;

            // Alt tag for slide main background image
            if (itemToEdit.imageAlt === undefined) itemToEdit.imageAlt = item.imageAlt || `${itemToEdit.title1 || "Design House"} Slide Banner`;
          }

          const fieldEntries = Object.entries(itemToEdit)
            .filter(
              ([key, value]) =>
                key !== "_id" &&
                key !== "status" &&
                !(key === "img" && ("image" in itemToEdit)) &&
                !(key === "imageAlt" && ("image" in itemToEdit || "img" in itemToEdit)) &&
                !(key === "iconAlt" && ("icon" in itemToEdit || "iconImage" in itemToEdit)) &&
                !(key.endsWith("Alt") && key.slice(0, -3) in itemToEdit) &&
                !(sectionId === "hero" && (
                  key === "titlePrimary" ||
                  key === "titleSecondary" ||
                  key === "titleTertiary" ||
                  key === "desc" ||
                  key === "img" ||
                  key === "buttonLabel" ||
                  key === "buttonHref" ||
                  key === "secondaryButtonLabel" ||
                  key === "secondaryButtonHref" ||
                  key === "primaryButtonText" ||
                  key === "primaryButtonHref" ||
                  key === "secondaryButtonText" ||
                  key === "buttonText" ||
                  key === "href" ||
                  key === "showLutus" ||
                  key === "isCenter" ||
                  key === "listItems" ||
                  key === "features" ||
                  key === "points" ||
                  key === "id" ||
                  key === "headingLine1Accent" ||
                  key === "headingLine2Accent" ||
                  key === "headingLine3Accent" ||
                  key === "underline" ||
                  key === "uppercaseTitle" ||
                  key === "compact" ||
                  key === "badge" ||
                  key === "layout"
                )) &&
                !(sectionId === "why-exhibit-hero" && key === "icon") &&
                !(sectionId === "expo-categories" && key === "icon") &&
                !(sectionId === "industry-segments" && key === "icon") &&
                !(sectionId === "why-visit-matters" && key === "icon") &&
                !(sectionId === "awards-health-camp" && key === "icon") &&
                !(sectionId === "awards-categories" && (key === "icon" || key === "description" || key === "shortDescription" || key === "cardBg" || key === "points" || key === "items")) &&
                !(sectionId === "awards-grand-awards" && (key === "icon" || key === "description" || key === "shortDescription" || key === "label")) &&
                !(sectionId === "awards-process" && key === "icon") &&
                !(sectionId === "four-pillars" && key === "subtitle") &&
                !(sectionId === "gallery-counters" && (key === "icon" || key === "iconKey")) &&
                (typeof value === "string" ||
                  typeof value === "number" ||
                  typeof value === "boolean" ||
                  (Array.isArray(value) && value.every((entry) => typeof entry === "string")))
            )
            .sort(([a], [b]) => (FIELD_ORDER_PRIORITY[a] || 99) - (FIELD_ORDER_PRIORITY[b] || 99));

          const isOpen = openIndex === index;

          return (
            <div
              key={item._id ?? index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="bg-white border border-[#e2e8f0] rounded-[6px] overflow-hidden shadow-2xs transition"
            >
              <div
                onClick={() => handleToggle(index)}
                className="flex cursor-pointer items-center justify-between bg-[#f8fafc] px-[12px] py-[8px] border-b border-[#f1f5f9] hover:bg-[#f1f5f9] transition"
              >
                <div className="flex items-center gap-[6px]">
                  <ChevronRight className={`h-3.5 w-3.5 text-[#64748b] transition-transform ${isOpen ? "rotate-90 text-[#1e40af]" : ""}`} />
                  <span className="text-[11px] font-bold text-[#1e40af]">
                    {getItemLabel(item, index)}
                    {item.value ? <span className="ml-[6px] font-semibold text-[#1e293b]">({item.value})</span> : ""}
                  </span>
                </div>

                {sectionId !== "reasons-to-exhibit" && sectionId !== "industry-segments" && (
                  <div className="flex items-center gap-[8px]" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(index)}
                      className="flex items-center gap-[3px] text-[9.5px] font-semibold text-[#dc2626] hover:underline"
                    >
                      <Trash2 className="h-[11px] w-[11px]" />
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {isOpen && (
                <div className="p-[12px] grid grid-cols-2 gap-[10px] bg-white">
                  {fieldEntries.map(([key, value]) => {
                    const isImageKey = IMAGE_KEY_PATTERN.test(key) && key !== "imageAlt";
                    const isVideoKey = VIDEO_KEY_PATTERN.test(key);
                    const isLong = (LONG_TEXT_KEY_PATTERN.test(key) || Array.isArray(value)) && !key.startsWith("feature");
                    return (
                      <React.Fragment key={key}>
                        {sectionId === "hero" && key === "feature1Label" && (
                          <div className="col-span-2 pt-3 pb-1 border-t-2 border-blue-100 mt-1">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">★</span>
                              <span className="text-[12px] font-bold text-blue-900 uppercase tracking-wide">
                                Slide Features (Icons & Labels for this Slide)
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Add icons (upload image) and feature labels to display on this specific hero carousel slide.
                            </p>
                          </div>
                        )}

                        {sectionId === "hero" && key === "service1Label" && (
                          <div className="col-span-2 pt-3 pb-1 border-t-2 border-orange-100 mt-2">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fd6e15] text-white text-[10px] font-bold">✓</span>
                              <span className="text-[12px] font-bold text-[#0c1e3a] uppercase tracking-wide">
                                Bottom 5 Services Strip (Icons, Labels & Links for this Slide)
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              Configure the 5 core bottom services (Retail Interiors, Display Solutions, Corporate Interiors, Exhibition Stalls, Manufacturing & Execution) with custom icon uploads, labels and links.
                            </p>
                          </div>
                        )}

                        <div className={isImageKey || isVideoKey || isLong ? "col-span-2 w-full" : "col-span-1"}>
                          {!isImageKey && (
                            <FieldLabel>
                              {sectionId === "industry-segments" && key === "image"
                                ? "Main Image (Upload / URL)"
                                : sectionId === "industry-segments" && key === "iconImage"
                                  ? "Top Image / Icon (Upload / URL)"
                                  : sectionId === "awards-categories" && key === "image"
                                    ? "Category Icon / Image (Upload / URL)"
                                    : sectionId === "awards-grand-awards" && key === "image"
                                      ? "Award Icon / Image (Upload / URL)"
                                      : sectionId === "awards-process" && key === "image"
                                        ? "Process Icon / Image (Upload / URL)"
                                        : sectionId === "global-platform" && key === "image"
                                          ? "Highlight Icon / Image (Upload)"
                                          : sectionId === "global-platform" && key === "imageAlt"
                                            ? "Image Alt Text"
                                            : sectionId === "exhibition-hero" && key === "title"
                                              ? "Feature Value (e.g. 200+)"
                                              : sectionId === "exhibition-hero" && key === "subtitle"
                                                ? "Feature Label (e.g. Exhibitors Expected)"
                                                : sectionId === "nominate-hero" && key === "title"
                                                  ? "Feature Label (e.g. Expertise)"
                                                  : sectionId === "career-hero" && key === "label"
                                                    ? "Highlight Label (e.g. Innovative Work)"
                                                    : sectionId === "why-work-with-us" && key === "title"
                                                      ? "Card Title (e.g. Purpose-Driven Work)"
                                                      : sectionId === "why-work-with-us" && key === "text"
                                                        ? "Card Description Text"
                                                        : sectionId === "life-at-design-house" && key === "title"
                                                          ? "Photo Caption / Title"
                                                          : humanizeKey(key)}
                            </FieldLabel>
                          )}

                          {key === "icon" && sectionId !== "journey-glimpse" ? (
                            String(value).includes("/") || /\.(png|webp|jpe?g|svg)$/i.test(String(value)) ? (
                              <div className="flex flex-col gap-1 w-full">
                                <ImageWithAltField
                                  label={
                                    sectionId === "career-hero"
                                      ? "Highlight Icon (Upload / URL)"
                                      : sectionId === "why-work-with-us"
                                        ? "Card Icon (Upload / URL)"
                                        : "Icon Image (Upload / URL)"
                                  }
                                  image={String(value)}
                                  alt={String(item.iconAlt ?? item.alt ?? "")}
                                  onImageChange={(next) => onChangeItem(index, key, next)}
                                  onAltChange={(next) => {
                                    onChangeItem(index, "iconAlt", next);
                                    onChangeItem(index, "alt", next);
                                  }}
                                  altLabel="Alt Tag"
                                  altPlaceholder={`e.g. ${item.title || item.name || item.label || "Service"} Icon`}
                                />
                                <button
                                  type="button"
                                  onClick={() => onChangeItem(index, key, "Users")}
                                  className="text-[10px] text-[#1e40af] hover:underline self-start font-medium mt-0.5"
                                >
                                  Switch to Lucide Icon selector
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1 w-full">
                                <SelectField
                                  value={String(value)}
                                  options={[
                                    { label: "None", value: "" },
                                    { label: "Group of People (Users)", value: "Users" },
                                    { label: "Store / Exhibitor", value: "Store" },
                                    { label: "Presentation / Speaker", value: "Presentation" },
                                    { label: "Building / Company (Building2)", value: "Building2" },
                                    { label: "Globe / International", value: "Globe" },
                                    { label: "Leaf / Organic", value: "Leaf" },
                                    { label: "Graduation Cap / Academic", value: "GraduationCap" },
                                    { label: "Stethoscope / Healthcare", value: "Stethoscope" },
                                    { label: "Landmark / Government", value: "Landmark" },
                                    { label: "Shield Check / Verified", value: "ShieldCheck" },
                                    { label: "Handshake / Partnership", value: "Handshake" },
                                    { label: "Target / Vision", value: "Target" },
                                    { label: "Trending Up / Growth", value: "TrendingUp" },
                                    { label: "Award / Achievement", value: "Award" },
                                    { label: "Medal / Honour", value: "Medal" },
                                    { label: "Lightbulb / Innovation", value: "Lightbulb" },
                                    { label: "Mic / Speaker", value: "Mic" },
                                    { label: "Calendar / Dates", value: "CalendarDays" },
                                    { label: "Eye / View", value: "Eye" },
                                    { label: "Sprout / Plant", value: "Sprout" },
                                    { label: "Heart Pulse / Health", value: "HeartPulse" },
                                    { label: "Trophy / Winner", value: "Trophy" },
                                    { label: "Megaphone / Visibility", value: "Megaphone" },
                                    { label: "User Check / Verified User", value: "UserCheck" },
                                    { label: "Briefcase / Business", value: "Briefcase" },
                                    { label: "Sparkles / Magic", value: "Sparkles" },
                                    { label: "Zap / Fast", value: "Zap" },
                                    { label: "ID Card / Lanyard", value: "IdCard" },
                                    { label: "Plug / Charging", value: "Plug" },
                                    { label: "Contact / Badge", value: "Contact" },
                                    { label: "Wi-Fi / Internet", value: "Wifi" },
                                    { label: "Shopping Bag / Visitor Bag", value: "ShoppingBag" },
                                    { label: "Coffee / Refreshment", value: "Coffee" },
                                    { label: "Newspaper / Press", value: "Newspaper" },
                                    { label: "File Text / Print", value: "FileText" },
                                    { label: "Camera / Media", value: "Camera" },
                                    { label: "Headphones / Support", value: "Headphones" },
                                    { label: "Message Circle / Chat", value: "MessageCircle" },
                                    { label: "Clock / Time", value: "Clock" },
                                    { label: "Phone", value: "Phone" },
                                    { label: "Mail", value: "Mail" },
                                    { label: "Map Pin", value: "MapPin" },
                                    { label: "Heart", value: "Heart" },
                                    { label: "Star", value: "Star" },
                                    { label: "Check Circle", value: "CheckCircle" },
                                    { label: "Info", value: "Info" },
                                  ]}
                                  onChange={(next) => onChangeItem(index, key, next)}
                                />
                                <button
                                  type="button"
                                  onClick={() => onChangeItem(index, key, "/assets/icon/icon1.png")}
                                  className="text-[10px] text-[#1e40af] hover:underline self-start font-medium"
                                >
                                  Or Upload Custom Icon Image
                                </button>
                              </div>
                            )
                          ) : isVideoKey ? (
                            <VideoUploadField
                              value={String(value)}
                              onChange={(next) => onChangeItem(index, key, next)}
                            />
                          ) : isImageKey ? (
                            <div className="col-span-2 w-full">
                              <ImageWithAltField
                                label={
                                  sectionId === "life-at-design-house" && (key === "image" || key === "img")
                                    ? "Workplace Photo (Upload / URL)"
                                    : sectionId === "career-hero" && (key === "icon" || key === "iconImage")
                                      ? "Highlight Icon (Upload / URL)"
                                      : sectionId === "why-work-with-us" && (key === "icon" || key === "iconImage")
                                        ? "Card Icon (Upload / URL)"
                                        : humanizeKey(key)
                                }
                                image={String(value)}
                                alt={String(
                                  item[`${key}Alt`] ??
                                    (key === "image" || key === "img"
                                      ? (item.imageAlt ?? item.alt ?? "")
                                      : key === "icon" || key === "iconImage"
                                      ? (item.iconAlt ?? item.alt ?? "")
                                      : (item[`${key}Alt`] ?? ""))
                                )}
                                onImageChange={(next) => onChangeItem(index, key, next)}
                                onAltChange={(next) => {
                                  onChangeItem(index, `${key}Alt`, next);
                                  if (key === "image" || key === "img") {
                                    onChangeItem(index, "imageAlt", next);
                                    onChangeItem(index, "alt", next);
                                  }
                                  if (key === "icon" || key === "iconImage") {
                                    onChangeItem(index, "iconAlt", next);
                                    onChangeItem(index, "alt", next);
                                  }
                                }}
                                altLabel="Alt Tag"
                                altPlaceholder={`e.g. ${item.title || item.name || item.label || "Design House"} ${key.toLowerCase().includes("icon") ? "Icon" : "Image"}`}
                                defaultValue={
                                  sectionId === "why-exhibit-hero"
                                    ? `/uploads/icons/x${(index % 4) + 1}.png`
                                    : sectionId === "reasons-to-exhibit"
                                      ? [
                                          "/uploads/icons/11og.webp",
                                          "/uploads/icons/12og.webp",
                                          "/uploads/icons/13og.webp",
                                          "/uploads/icons/14og.webp",
                                          "/uploads/icons/15og.webp",
                                          "/uploads/icons/i6.png",
                                        ][index % 6]
                                      : sectionId === "why-visit-matters"
                                        ? [
                                            "/uploads/icons/v1og.png",
                                            "/uploads/icons/v2og.png",
                                            "/uploads/icons/v3og.png",
                                            "/uploads/icons/v4og.png",
                                            "/uploads/icons/v5og.png",
                                            "/uploads/icons/v6og.png",
                                          ][index % 6]
                                        : undefined
                                }
                              />
                            </div>
                          ) : Array.isArray(value) ? (
                            <TextInput
                              value={value.join(", ")}
                              onChange={(next) =>
                                onChangeItem(
                                  index,
                                  key,
                                  next.split(",").map((entry) => entry.trim()).filter(Boolean),
                                )
                              }
                              placeholder="comma, separated, values"
                            />
                          ) : key === "color" ? (
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <TextInput
                                  value={String(value)}
                                  onChange={(next) => onChangeItem(index, key, next)}
                                  placeholder="e.g. #facc15 or text-orange-500"
                                />
                              </div>
                              <input
                                type="color"
                                value={
                                  String(value).startsWith("#") && String(value).length === 7
                                    ? String(value)
                                    : "#facc15"
                                }
                                onChange={(e) => onChangeItem(index, key, e.target.value)}
                                className="h-[34px] w-[38px] cursor-pointer rounded border border-[#cbd5e1] p-0.5 bg-white shrink-0"
                                title="Pick a color"
                              />
                            </div>
                          ) : typeof value === "boolean" ? (
                            <Toggle checked={value} onChange={(next) => onChangeItem(index, key, next)} />
                          ) : RICH_TEXT_KEY_PATTERN.test(key) ? (
                            <RichTextEditor
                              value={String(value || "")}
                              onChange={(next) => onChangeItem(index, key, next)}
                              minHeight="100px"
                              placeholder={`Enter ${humanizeKey(key).toLowerCase()}...`}
                            />
                          ) : isLong ? (
                            <Textarea
                              value={String(value || "")}
                              onChange={(next) => onChangeItem(index, key, next)}
                              rows={3}
                              noLimit={true}
                            />
                          ) : (
                            <TextInput
                              value={String(value || "")}
                              onChange={(next) => onChangeItem(index, key, next)}
                              hideLimit={true}
                            />
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
