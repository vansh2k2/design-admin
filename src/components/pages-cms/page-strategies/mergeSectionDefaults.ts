import type { CmsJson, CmsRecord } from "@/lib/cmsJson";
/**
 * Merges one fallback section template item with the corresponding
 * saved section (if any), applying per-section-key cleanup so the
 * editor never shows stale/renamed fields from older content shapes.
 */
export function mergeSectionWithSavedData(
  fallbackItem: CmsRecord,
  savedItem: CmsRecord | undefined,
): CmsRecord {
  if (!savedItem) return { ...fallbackItem };
  const merged: CmsRecord = {
    ...fallbackItem,
    ...savedItem,
    items: fallbackItem.items !== undefined ? (
      fallbackItem.items.map((item: CmsRecord, idx: number) => ({
        ...item,
        ...(savedItem.items?.[idx] || {}),
      }))
    ) : undefined,
  };

  if (Array.isArray(fallbackItem.slides)) {
    const savedSlides = Array.isArray(savedItem?.slides) && savedItem.slides.length > 0 ? savedItem.slides : fallbackItem.slides;
    merged.slides = savedSlides.map((slide: CmsRecord, idx: number) => {
      const fallbackSlide = fallbackItem.slides?.[idx] || fallbackItem.slides?.[0] || {};
      const combined = { ...fallbackSlide, ...slide };
      if (combined.image && !combined.img) combined.img = combined.image;
      if (combined.img && !combined.image) combined.image = combined.img;
      if (combined.description && !combined.desc) combined.desc = combined.description;
      if (combined.desc && !combined.description) combined.description = combined.desc;
      if (combined.titlePrimary && !combined.headingLine1) combined.headingLine1 = combined.titlePrimary;
      if (combined.titleSecondary && !combined.headingLine2) combined.headingLine2 = combined.titleSecondary;
      if (combined.titleTertiary && !combined.headingLine3) combined.headingLine3 = combined.titleTertiary;
      if (combined.buttonLabel && !combined.button1Text) combined.button1Text = combined.buttonLabel;
      if (combined.buttonHref && !combined.button1Href) combined.button1Href = combined.buttonHref;
      if (combined.secondaryButtonLabel && !combined.button2Text) combined.button2Text = combined.secondaryButtonLabel;
      if (combined.secondaryButtonHref && !combined.button2Href) combined.button2Href = combined.secondaryButtonHref;

      for (let s = 1; s <= 5; s++) {
        const lbl = `service${s}Label`;
        const hrf = `service${s}Href`;
        const icn = `service${s}Icon`;
        if (combined[lbl] === undefined) combined[lbl] = slide[lbl] || fallbackSlide[lbl] || fallbackItem[lbl] || (
          s === 1 ? "Retail\nInteriors" :
          s === 2 ? "Display\nSolutions" :
          s === 3 ? "Corporate\nInteriors" :
          s === 4 ? "Exhibition\nStalls" : "Manufacturing\n& Execution"
        );
        if (combined[hrf] === undefined) combined[hrf] = slide[hrf] || fallbackSlide[hrf] || fallbackItem[hrf] || (
          s === 1 ? "/services/retail-interior" :
          s === 2 ? "/services/retail-kiosk" :
          s === 3 ? "/services/corporate-interior" :
          s === 4 ? "/services/exhibitions" : "/services"
        );
        if (combined[icn] === undefined) combined[icn] = slide[icn] || fallbackSlide[icn] || fallbackItem[icn] || `/assets/icon/icon${s}.png`;
      }
      for (let f = 1; f <= 4; f++) {
        const flbl = `feature${f}Label`;
        const ficn = `feature${f}Icon`;
        if (combined[flbl] === undefined) combined[flbl] = slide[flbl] || fallbackSlide[flbl] || "";
        if (combined[ficn] === undefined) combined[ficn] = slide[ficn] || fallbackSlide[ficn] || "";
      }
      return combined;
    });
  }

  if (fallbackItem.key === "topbar" || merged.key === "topbar") {
    if (!merged.title) merged.title = fallbackItem.title || "Design House India Pvt. Ltd.";
    if (!merged.marqueeText) merged.marqueeText = fallbackItem.marqueeText || "5000+ PROJECTS DELIVERED • PAN-INDIA EXECUTION • RETAIL | RESTAURANT | KIOSK | CORPORATE | EXHIBITION EXPERTS";
    if (!merged.phoneNumber) merged.phoneNumber = fallbackItem.phoneNumber || "+91 96549 00525";
    if (!merged.contactEmail) merged.contactEmail = fallbackItem.contactEmail || "info@designhouse.co.in";
    if (!merged.ensisLogo && !merged.logoImage) {
      merged.ensisLogo = fallbackItem.ensisLogo || fallbackItem.logoImage || "/ensis.jpeg";
      merged.logoImage = merged.ensisLogo;
    } else if (merged.ensisLogo && !merged.logoImage) {
      merged.logoImage = merged.ensisLogo;
    } else if (merged.logoImage && !merged.ensisLogo) {
      merged.ensisLogo = merged.logoImage;
    }
    if (!merged.externalLinkUrl) merged.externalLinkUrl = fallbackItem.externalLinkUrl || "https://ensis.in/";
    if (!merged.externalLinkText) merged.externalLinkText = fallbackItem.externalLinkText || "Panchkarma Solution";
  }

  if (
    fallbackItem.key === "clients-marquee" ||
    merged.key === "clients-marquee" ||
    fallbackItem.key === "clients" ||
    merged.key === "clients" ||
    fallbackItem.key === "partners-brands" ||
    merged.key === "partners-brands" ||
    merged.name === "Our Clients (Logo Strip)" ||
    fallbackItem.name === "Our Clients (Logo Strip)"
  ) {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "OUR CLIENTS";
    if (!merged.title) merged.title = fallbackItem.title || "Trusted by";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Leading Brands";
    if (!merged.description || String(merged.description).trim() === "") {
      merged.description = fallbackItem.description || "Partnering with industry leaders to create exceptional spaces";
    }
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "VIEW ALL CLIENTS";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/clients";
  }

  if (fallbackItem.key === "hero" || merged.key === "hero") {
    for (let s = 1; s <= 5; s++) {
      const lbl = `service${s}Label`;
      const hrf = `service${s}Href`;
      const icn = `service${s}Icon`;
      if (!merged[lbl] && fallbackItem[lbl]) merged[lbl] = fallbackItem[lbl];
      if (!merged[hrf] && fallbackItem[hrf]) merged[hrf] = fallbackItem[hrf];
      if (!merged[icn] && fallbackItem[icn]) merged[icn] = fallbackItem[icn];
    }
  }

  if (fallbackItem.key === "featured-services" || merged.key === "featured-services") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "SERVICES WE DO";
    if (!merged.title) merged.title = fallbackItem.title || "Our Featured Services";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "& Transformations";
    if (!merged.description) merged.description = fallbackItem.description || "Explore our turnkey interior design, retail display merchandising, kiosk fabrication, and brand architectural execution capabilities.";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "View All Services";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/services";
  }

  if (fallbackItem.key === "how-we-work" || merged.key === "how-we-work") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "HOW WE WORK";
    if (!merged.title) merged.title = fallbackItem.title || "Architecture Process For";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Exceptional Results.";
    if (!merged.description) merged.description = fallbackItem.description || "Our process is alive — adapting, refining, and growing with your vision.";
    if (!merged.quote) merged.quote = fallbackItem.quote || "Excellence in architecture is a journey of continuous refinement.";
    if (!merged.backgroundImage) merged.backgroundImage = fallbackItem.backgroundImage || "/h1-bg01-1.webp";
  }

  if (fallbackItem.key === "stats-counter" || merged.key === "stats-counter") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "OUR TRACK RECORD";
    if (!merged.title) merged.title = fallbackItem.title || "Delivering Impact Across India";
    if (!merged.description) merged.description = fallbackItem.description || "Two decades of transforming commercial spaces with unmatched manufacturing precision.";
  }

  if (fallbackItem.key === "testimonials-carousel" || merged.key === "testimonials-carousel") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "TESTIMONIALS";
    if (!merged.title) merged.title = fallbackItem.title || "What";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "People Says";
    if (!merged.description) merged.description = fallbackItem.description || "Discover how we help leading enterprises and startups build spaces that leave lasting impressions.";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "View All Reviews";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/testimonials";
  }

  if (fallbackItem.key === "faqs" || merged.key === "faqs") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "FAQS";
    if (!merged.title) merged.title = fallbackItem.title || "Frequently Asked";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Questions";
    if (!merged.description) merged.description = fallbackItem.description || "Everything you need to know about our turnkey interior design, materials, execution process and timelines.";
  }

  if (fallbackItem.key === "recent-articles" || merged.key === "recent-articles") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "OUR BLOG";
    if (!merged.title) merged.title = fallbackItem.title || "Read Our Latest";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Articles";
    if (!merged.description) merged.description = fallbackItem.description || "Latest published posts and insights from our interior design, architectural execution, and retail fixture experts.";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "View All Articles";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/blogs";
  }

  if (fallbackItem.key === "about" || merged.key === "about") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "ABOUT US";
    if (typeof merged.title === "string" && merged.title.includes("Since")) {
      const parts = merged.title.split(/(?=Since)/i);
      if (parts.length > 1) {
        merged.title = parts[0].trim();
        if (!merged.highlightedWord || merged.highlightedWord === "Since 2004") {
          merged.highlightedWord = parts.slice(1).join("").trim();
        }
      }
    }
    if (!merged.title) merged.title = fallbackItem.title || "Crafting Exceptional Spaces";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Since 1982";
    if (!merged.image1) merged.image1 = fallbackItem.image1 || "/assets/3_11zon.webp";
    if (!merged.image2) merged.image2 = fallbackItem.image2 || "/assets/5.jpg_11zon.jpeg";
    if (!merged.image3) merged.image3 = fallbackItem.image3 || "/assets/about3_11zon.webp";
    if (!merged.image4) merged.image4 = fallbackItem.image4 || "/assets/8_11zon.jpg";
    if (!merged.missionTitle) merged.missionTitle = fallbackItem.missionTitle || "Our Mission";
    if (!merged.missionContent) merged.missionContent = fallbackItem.missionContent || "<p>Deliver innovative designs that exceed expectations.</p>";
    if (!merged.visionTitle) merged.visionTitle = fallbackItem.visionTitle || "Our Vision";
    if (!merged.visionContent) merged.visionContent = fallbackItem.visionContent || "<p>To be the most trusted interior design partner.</p>";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "Know More";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/about";
  }

  if (fallbackItem.key === "what-we-do" || merged.key === "what-we-do") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "WHAT WE DO";
    if (!merged.title) merged.title = fallbackItem.title || "Turnkey Spaces for";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Every Business";
    if (!merged.description) merged.description = fallbackItem.description || "<p>From concept to creation, we design and build impactful spaces that enhance your brand, engage your customers and deliver real business value.</p>";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "View All Services";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/services";
    if (!merged.stat1Value) merged.stat1Value = fallbackItem.stat1Value || "21";
    if (!merged.stat1Label) merged.stat1Label = fallbackItem.stat1Label || "Years of Experience";
    if (!merged.stat2Value) merged.stat2Value = fallbackItem.stat2Value || "5000";
    if (!merged.stat2Label) merged.stat2Label = fallbackItem.stat2Label || "Projects Delivered";
    if (!merged.stat3Value) merged.stat3Value = fallbackItem.stat3Value || "10";
    if (!merged.stat3Label) merged.stat3Label = fallbackItem.stat3Label || "Industry Categories";
    if (!merged.industriesTitle) merged.industriesTitle = fallbackItem.industriesTitle || "Industries We Serve";
    if (!merged.industriesList) merged.industriesList = fallbackItem.industriesList || "Corporate, Retail, Hospitality, Healthcare, Education, Exhibition, Wellness, Government, and More...";
  }

  if (fallbackItem.key === "our-achievements" || merged.key === "our-achievements" || fallbackItem.key === "achievements" || merged.key === "achievements") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "OUR ACHIEVEMENTS";
    if (!merged.title) merged.title = fallbackItem.title || "Numbers that Reflect";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Your Trust in Us";
    if (!merged.description) merged.description = fallbackItem.description || "<p>Over the years, we have delivered successful interior and exhibition solutions for leading brands across India.</p>";
    if (!merged.backgroundImage) merged.backgroundImage = fallbackItem.backgroundImage || "/assets/banner/hero2.webp";
  }

  if (fallbackItem.key === "our-projects" || merged.key === "our-projects") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "OUR PROJECTS";
    if (!merged.title) merged.title = fallbackItem.title || "Spaces We Have";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Brought to Life";
    if (!merged.description) merged.description = fallbackItem.description || "<p>From retail and corporate interiors to exhibition stalls and kiosks, explore some of our recently completed projects for leading brands across India.</p>";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "VIEW ALL PROJECTS";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/projects";
  }

  if (fallbackItem.key === "why-choose-us" || merged.key === "why-choose-us") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Why Choose Us";
    if (!merged.title) merged.title = fallbackItem.title || "Your Vision.";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Our Expertise.";
    if (!merged.description) merged.description = fallbackItem.description || "<p>We combine creative design, in-house manufacturing and trusted execution to deliver spaces that are functional, brand-driven and built to last.</p>";
    if (!merged.image) merged.image = fallbackItem.image || "/assets/image/vision.webp";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "Get a Free Consultation";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/contact";
    if (!merged.secondaryButtonLabel) merged.secondaryButtonLabel = fallbackItem.secondaryButtonLabel || "Download Company Profile";
    if (!merged.secondaryButtonHref) merged.secondaryButtonHref = fallbackItem.secondaryButtonHref || "/downloads";
  }

  if (fallbackItem.key === "capabilities" || merged.key === "capabilities") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Manufacturing & Execution Capabilities";
    if (!merged.title) merged.title = fallbackItem.title || "Built In-House.";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Delivered with Excellence.";
    if (!merged.description) merged.description = fallbackItem.description || "<p>Our in-house manufacturing facilities, skilled workforce and advanced machinery ensure superior quality, efficient execution and complete control from design to installation.</p>";
    if (!merged.image) merged.image = fallbackItem.image || "/assets/image/manu.webp";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "Explore Our Capabilities";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/about/infrastructure";
    if (!merged.stat1Value) merged.stat1Value = fallbackItem.stat1Value || "25,000+";
    if (!merged.stat1Label) merged.stat1Label = fallbackItem.stat1Label || "Sq. Ft. Facility";
    if (!merged.stat2Value) merged.stat2Value = fallbackItem.stat2Value || "100+";
    if (!merged.stat2Label) merged.stat2Label = fallbackItem.stat2Label || "Skilled Professionals";
    if (!merged.stat3Value) merged.stat3Value = fallbackItem.stat3Value || "Modern";
    if (!merged.stat3Label) merged.stat3Label = fallbackItem.stat3Label || "Machinery";
    if (!merged.stat4Value) merged.stat4Value = fallbackItem.stat4Value || "Quality";
    if (!merged.stat4Label) merged.stat4Label = fallbackItem.stat4Label || "Assurance";
  }

  if (fallbackItem.key === "our-approach" || merged.key === "our-approach" || fallbackItem.key === "approach" || merged.key === "approach") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Our Approach";
    if (!merged.title) merged.title = fallbackItem.title || "Ideas. Design. Build.";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Deliver.";
    if (!merged.description) merged.description = fallbackItem.description || "<p>A streamlined process that ensures creativity, quality and on-time delivery for spaces that elevate your brand.</p>";
    if (!merged.image) merged.image = fallbackItem.image || "/assets/image/approach.webp";
    if (!merged.tagline) merged.tagline = fallbackItem.tagline || "Your Vision, Our Expertise, Exceptional Spaces";
  }

  if (fallbackItem.key === "featured-projects" || merged.key === "featured-projects") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "FEATURED PROJECTS";
    if (!merged.title) merged.title = fallbackItem.title || "Spaces That Create";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Real Impact.";
    if (!merged.description) merged.description = fallbackItem.description || "<p>Explore our recent projects across corporate, retail, exhibition and hospitality spaces, designed and executed with creativity, precision and a focus on brand experience.</p>";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "View All Projects";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/projects";
    if (!merged.backgroundImage) merged.backgroundImage = fallbackItem.backgroundImage || "/assets/banner/bg-featured.webp";
  }

  if (fallbackItem.key === "our-strengths" || merged.key === "our-strengths" || fallbackItem.key === "strengths" || merged.key === "strengths") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Our Strengths";
    if (!merged.title) merged.title = fallbackItem.title || "Built on Experience.";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Driven by Excellence.";
    if (!merged.description) merged.description = fallbackItem.description || "<p>Our strength lies in a robust infrastructure, a skilled and passionate team, and measurable capabilities that enable us to deliver world-class interior and exhibition solutions across India.</p>";
    if (!merged.image) merged.image = fallbackItem.image || "/assets/image/strengths.webp";
    if (!merged.stat1Value) merged.stat1Value = fallbackItem.stat1Value || "5000+";
    if (!merged.stat1Label) merged.stat1Label = fallbackItem.stat1Label || "Projects Delivered";
    if (!merged.stat2Value) merged.stat2Value = fallbackItem.stat2Value || "500+";
    if (!merged.stat2Label) merged.stat2Label = fallbackItem.stat2Label || "Happy Clients";
    if (!merged.stat3Value) merged.stat3Value = fallbackItem.stat3Value || "21+";
    if (!merged.stat3Label) merged.stat3Label = fallbackItem.stat3Label || "Years of Experience";
    if (!merged.stat4Value) merged.stat4Value = fallbackItem.stat4Value || "Pan India";
    if (!merged.stat4Label) merged.stat4Label = fallbackItem.stat4Label || "Execution & Support";
  }

  if (fallbackItem.key === "get-in-touch" || merged.key === "get-in-touch") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Get In Touch";
    if (!merged.title) merged.title = fallbackItem.title || "Let's Discuss";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Your Project";
    if (!merged.description) merged.description = fallbackItem.description || "<p>Whether you're looking for turnkey interior execution, retail kiosks, or exhibition stalls, our team is ready to bring your vision to reality.</p>";
    if (!merged.phoneNumber1) merged.phoneNumber1 = fallbackItem.phoneNumber1 || "+91 96549 00525";
    if (!merged.phoneNumber2) merged.phoneNumber2 = fallbackItem.phoneNumber2 || "+91 98102 47319";
    if (!merged.contactEmail) merged.contactEmail = fallbackItem.contactEmail || "info@designhouse.co.in";
    if (!merged.backgroundImage) merged.backgroundImage = fallbackItem.backgroundImage || "/assets/banner/touch.webp";
    if (!merged.formTitle) merged.formTitle = fallbackItem.formTitle || "Request a Free Consultation";
    if (!merged.formSubtitle) merged.formSubtitle = fallbackItem.formSubtitle || "Fill out the form below and our team will get in touch within 24 hours.";
  }
  if (fallbackItem.key === "awards-hero" || merged.key === "awards-hero") {
    delete merged.shortDescription;
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt;
    if (!merged.date || merged.date.includes("T") || String(merged.date).trim().length < 5) {
      merged.date = "19 - 21 February 2027";
    }
  }
  if (fallbackItem.key === "awards-nomination-hero" || merged.key === "awards-nomination-hero") {
    if (merged.eyebrow === undefined) merged.eyebrow = fallbackItem.eyebrow;
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt;
    if (!merged.date || merged.date.includes("T") || String(merged.date).trim().length < 5) {
      merged.date = "19 - 21 February 2027";
    }
    if (!merged.location) {
      merged.location = "Hall 12, Bharat Mandapam, PRAGATI MAIDAN, NEW DELHI, INDIA";
    }
    if (!merged.title || merged.title === "SUBMIT YOUR AWARD NOMINATION") {
      merged.title = "Design House Excellence Awards 2027";
    }
    if (!merged.subtitle || merged.subtitle === "Celebrate your brand & enterprise innovation.") {
      merged.subtitle = "Celebrating Excellence • Innovation • Sustainability";
    }
    if (!merged.description || merged.description.includes("Fill out the nomination form below")) {
      merged.description = "Honouring the changemakers, organizations and innovations during india's organic, natural and sustainable future.";
    }
  }
  if (
    fallbackItem.key === "about-hero" || merged.key === "about-hero" ||
    fallbackItem.key === "advisory-hero" || merged.key === "advisory-hero" ||
    fallbackItem.key === "why-exhibit-hero" || merged.key === "why-exhibit-hero" ||
    fallbackItem.key === "blog-hero" || merged.key === "blog-hero"
  ) {
    // The two-part title (titlePrimary + titleSecondary) became a single H1 "title" field.
    const legacyTitle = [savedItem.titlePrimary, savedItem.titleSecondary]
      .filter((x) => typeof x === "string" && x.trim())
      .join(" ")
      .trim();
    if (legacyTitle && !savedItem.title) merged.title = legacyTitle;
    delete merged.titlePrimary;
    delete merged.titleSecondary;
  }
  if (fallbackItem.key === "exhibitors-hero" || merged.key === "exhibitors-hero") {
    // The old admin-only hero (subtitle + stats) never matched the live page.
    delete merged.subtitle;
    delete merged.items;
    if (!merged.title || merged.title === "Meet Leading Exhibitors at Design House") {
      merged.title = fallbackItem.title;
    }
    if (!merged.description || String(merged.description).startsWith("Browse our exhibitors across")) {
      merged.description = fallbackItem.description;
    }
    if (!merged.image) merged.image = fallbackItem.image;
  }
  if ((fallbackItem.key === "blog-hero" || merged.key === "blog-hero") && !merged.image) {
    merged.image = fallbackItem.image;
  }
  if (fallbackItem.key === "contact-hero" || merged.key === "contact-hero") {
    if (!merged.image || String(merged.image).includes("design-house/") || String(merged.image).includes("corporate-office-lounge")) {
      merged.image = fallbackItem.image || "/assets/banner/contact.webp";
    }
    if (!merged.imageAlt || merged.imageAlt === "Design House Contact Us Banner") {
      merged.imageAlt = fallbackItem.imageAlt || "Design House India reception and office";
    }
    if (!merged.eyebrow || merged.eyebrow === "HOME / CONTACT US") {
      merged.eyebrow = fallbackItem.eyebrow || "Contact Us";
    }
    if (!merged.title || merged.title === "Contact Us" || merged.title === "Connecting You to Exceptional Design & Build Solutions") {
      merged.title = fallbackItem.title || "Let's Build";
    }
    if (!merged.highlightedWord || merged.highlightedWord === "Connecting You") {
      merged.highlightedWord = fallbackItem.highlightedWord || "Your Next Space";
    }
    if (!merged.description || merged.description.includes("Get in touch with Design House India Pvt. Ltd. for turnkey")) {
      merged.description = fallbackItem.description || "From concept to completion, our team is here to understand your requirements and create the right solution for your brand.";
    }
    if (!merged.items || !Array.isArray(merged.items) || merged.items.length === 0 || merged.items[0]?.label === "New Highlight Point") {
      merged.items = fallbackItem.items;
    }
  }
  if (fallbackItem.key === "contact-info" || merged.key === "contact-info") {
    if (!merged.eyebrow || merged.eyebrow === "Reach Out") merged.eyebrow = fallbackItem.eyebrow || "Get in Touch";
    if (!merged.title || merged.title === "Get in Touch" || merged.title === "Contact Us") merged.title = fallbackItem.title || "We're Here to Help";
    if (!merged.description || merged.description.includes("Have a project in mind or need a quote")) {
      merged.description = fallbackItem.description || "Have a project in mind or need expert advice? Our team will be happy to assist you with design, manufacturing and execution tailored to your requirements.";
    }
    if (!merged.phoneNumber1) merged.phoneNumber1 = fallbackItem.phoneNumber1 || "+91 9654900525";
    if (!merged.phoneNumber2) merged.phoneNumber2 = fallbackItem.phoneNumber2 || "+91 9810247319";
    if (!merged.contactEmail) merged.contactEmail = fallbackItem.contactEmail || "info@designhouse.co.in";
    if (!merged.workingHoursWeekday) merged.workingHoursWeekday = fallbackItem.workingHoursWeekday || "Monday – Saturday: 9:00 AM – 6:00 PM";
    if (!merged.workingHoursWeekend) merged.workingHoursWeekend = fallbackItem.workingHoursWeekend || "Sunday: Closed";
  }
  if (fallbackItem.key === "contact-form" || merged.key === "contact-form") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Send Us a Message";
    if (!merged.title) merged.title = fallbackItem.title || "Enquire Now";
    if (!merged.description) merged.description = fallbackItem.description || "Share your requirements and we will get back to you shortly.";
    if (!merged.submitLabel) merged.submitLabel = fallbackItem.submitLabel || "Send Enquiry";
    if (!merged.securityNote) merged.securityNote = fallbackItem.securityNote || "Your information is safe with us. We typically respond during business hours.";
    if (!merged.successTitle) merged.successTitle = fallbackItem.successTitle || "Enquiry Sent!";
    if (!merged.successMessage) merged.successMessage = fallbackItem.successMessage || "Thank you for contacting us. Our team will get back to you within 24 hours.";
  }
  if (fallbackItem.key === "offices" || merged.key === "offices") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Our Offices";
    if (!merged.title) merged.title = fallbackItem.title || "Visit Us";
    if (!merged.description) merged.description = fallbackItem.description || "Meet our team at any of our locations or get in touch to schedule a discussion.";
    if (!merged.items || !Array.isArray(merged.items) || merged.items.length === 0 || !merged.items[0]?.city || merged.items[0]?.city === "City Name") {
      merged.items = fallbackItem.items;
    } else if (Array.isArray(fallbackItem.items) && fallbackItem.items.length > 0) {
      merged.items = fallbackItem.items.map((fbItem: CmsRecord, idx: number) => {
        const savedOffice = merged.items?.[idx] || {};
        return {
          ...fbItem,
          ...savedOffice,
          image: savedOffice.image || fbItem.image,
          imageAlt: savedOffice.imageAlt || fbItem.imageAlt,
        };
      });
    }
  }
  if (fallbackItem.key === "contact-map" || merged.key === "contact-map") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Our Location";
    if (!merged.title) merged.title = fallbackItem.title || "Find Us on Map";
    if (!merged.description) merged.description = fallbackItem.description || "Our head office is located in Ghaziabad, with branch offices in New Delhi and Mumbai.";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "Open in Google Maps";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "https://www.google.com/maps/search/?api=1&query=Design+House+India+Pvt+Ltd%2C+Plot+No.+12%2F29%2C+Site-II+Industrial+Area%2C+Loni+Road%2C+Mohan+Nagar%2C+Ghaziabad+201007";
    if (!merged.mapEmbedUrl) merged.mapEmbedUrl = fallbackItem.mapEmbedUrl || "https://maps.google.com/maps?q=Design+House+India+Pvt+Ltd%2C+Mohan+Nagar%2C+Ghaziabad&z=15&output=embed";
  }
  if (fallbackItem.key === "services-hero" || merged.key === "services-hero") {
    if (!merged.image) merged.image = fallbackItem.image || "/assets/banner/services.webp";
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt || "Design House India Services Reception Banner";
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Our Services";
    if (!merged.title) merged.title = fallbackItem.title || "Spaces";
    if (!merged.titleLine2) merged.titleLine2 = fallbackItem.titleLine2 || "That Work Better";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "That Work Better";
    if (!merged.tagline) merged.tagline = fallbackItem.tagline || "Design. Build. Deliver.";
    if (!merged.description) merged.description = fallbackItem.description || "A complete range of interior, design, manufacturing and turnkey solutions for modern businesses and homes.";
  }
  if (fallbackItem.key === "services-intro" || merged.key === "services-intro") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Our Services";
    if (!merged.title) merged.title = fallbackItem.title || "From Concept to Completion";
    if (!merged.subtitle) merged.subtitle = fallbackItem.subtitle || "Designing Spaces for Businesses and Homes";
    if (!merged.description) merged.description = fallbackItem.description || "At Design House India Pvt. Ltd., we offer end-to-end interior, design, manufacturing and turnkey solutions. With innovative ideas, in-house manufacturing and expert execution, we create functional, aesthetic and future-ready spaces for corporate, retail, hospitality, residential and wellness environments.";
    if (!merged.items || !Array.isArray(merged.items) || merged.items.length === 0) {
      merged.items = fallbackItem.items;
    }
  }
  if (fallbackItem.key === "services-grid" || merged.key === "services-grid") {
    if (!merged.title) merged.title = fallbackItem.title || "Our Services";
    if (!merged.description) merged.description = fallbackItem.description || "Explore our complete range of services designed to create functional, inspiring and future-ready spaces. Click on any service to view our projects.";
    delete merged.items;
  }
  if (fallbackItem.key === "services-cta" || merged.key === "services-cta") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Let's Build Together";
    if (!merged.title) merged.title = fallbackItem.title || "Let's Discuss Your Project";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Your Project";
    if (!merged.subtitle) merged.subtitle = fallbackItem.subtitle || "Get in touch with our team for a customized solution.";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "Enquire Now";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/contact";
    if (!merged.image) merged.image = fallbackItem.image || "/assets/image/t2.webp";
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt || "Let's Discuss Your Project Consultation Banner";
  }
  if (fallbackItem.key === "projects-hero" || merged.key === "projects-hero") {
    if (!merged.image) merged.image = fallbackItem.image || "/newproject/p1.png";
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt || "Design House India reception lobby";
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Our Projects";
    if (!merged.title) merged.title = fallbackItem.title || "Spaces";
    if (!merged.titleLine2) merged.titleLine2 = fallbackItem.titleLine2 || "That";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Inspire";
    if (!merged.tagline) merged.tagline = fallbackItem.tagline || "From Vision to Reality";
    if (!merged.description) merged.description = fallbackItem.description || "Explore our portfolio of thoughtfully designed and expertly executed spaces across industries. Each project reflects our commitment to functionality, aesthetics and long-term value.";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "Discuss Your Project";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/contact";
  }
  if (fallbackItem.key === "projects-featured" || merged.key === "projects-featured") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Featured Project";
    if (!merged.title) merged.title = fallbackItem.title || "Axis Business Park";
    if (!merged.category) merged.category = fallbackItem.category || "Corporate Interior";
    if (!merged.location) merged.location = fallbackItem.location || "Gurugram, Haryana";
    if (!merged.description) merged.description = fallbackItem.description;
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "View Project Details";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/portfolio/interior/corporate-interior";
    if (!merged.image) merged.image = fallbackItem.image || "/newproject/p2.png";
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt || "Axis Business Park Reception";
    if (!merged.items || !Array.isArray(merged.items) || merged.items.length === 0) {
      merged.items = fallbackItem.items;
    }
  }
  if (fallbackItem.key === "projects-gallery" || merged.key === "projects-gallery") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Explore Our Work";
    if (!merged.title) merged.title = fallbackItem.title || "Our Projects";
    if (!merged.description) merged.description = fallbackItem.description || "Browse our delivered projects across corporate, retail, hospitality, exhibition, and residential spaces.";
    delete merged.items;
  }
  if (fallbackItem.key === "diverse-spaces" || merged.key === "diverse-spaces") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Diverse Spaces";
    if (!merged.title) merged.title = fallbackItem.title || "Diverse Spaces.";
    if (!merged.subtitle) merged.subtitle = fallbackItem.subtitle || "Endless Possibilities.";
    if (!merged.highlightedWord) merged.highlightedWord = fallbackItem.highlightedWord || "Possibilities";
    if (!merged.description) merged.description = fallbackItem.description || "From corporate offices to retail environments, restaurants to residential spaces, we create environments that reflect your vision and deliver lasting impact.";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "Start a Conversation";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/contact";
    if (!merged.image) merged.image = fallbackItem.image || "/newproject/pb.png";
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt || "Diverse Spaces lounge with city view";
  }
  if (fallbackItem.key === "projects-impact" || merged.key === "projects-impact") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Our Impact";
    if (!merged.title) merged.title = fallbackItem.title || "Delivering Measurable Impact Across India";
    if (!merged.items || !Array.isArray(merged.items) || merged.items.length === 0) {
      merged.items = fallbackItem.items;
    }
  }
  if (fallbackItem.key === "projects-process" || merged.key === "projects-process") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Our Process";
    if (!merged.title) merged.title = fallbackItem.title || "From Concept to Completion";
    if (!merged.description) merged.description = fallbackItem.description || "A streamlined approach that ensures quality, efficiency and on-time delivery.";
    if (!merged.items || !Array.isArray(merged.items) || merged.items.length === 0) {
      merged.items = fallbackItem.items;
    }
  }
  if (fallbackItem.key === "projects-cta" || merged.key === "projects-cta") {
    if (!merged.eyebrow) merged.eyebrow = fallbackItem.eyebrow || "Let's Work Together";
    if (!merged.title) merged.title = fallbackItem.title || "Have a Project in Mind?";
    if (!merged.description) merged.description = fallbackItem.description || "Share your requirements with our team for a customized solution.";
    if (!merged.buttonLabel) merged.buttonLabel = fallbackItem.buttonLabel || "Enquire Now";
    if (!merged.buttonHref) merged.buttonHref = fallbackItem.buttonHref || "/contact";
    if (!merged.image) merged.image = fallbackItem.image || "/newproject/p12.png";
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt || "Luxury city lounge consultation";
  }
  if (fallbackItem.key === "sub-partnership-hero" || merged.key === "sub-partnership-hero") {
    // The old generic hero had fields the website never showed.
    delete merged.eyebrow;
    if (!merged.date || String(merged.date).includes("T")) merged.date = fallbackItem.date;
    if (typeof merged.image === "string" && merged.image.includes("og-banner.png")) merged.image = "";
    if (merged.title === "Official Expo Partner") merged.title = "";
    if (String(merged.subtitle || "").startsWith("Collaborate with Design House to expand")) merged.subtitle = "";
    if (String(merged.description || "").startsWith("Access direct networking, exclusive brand")) merged.description = "";
    if (merged.location === "Bharat Mandapam, New Delhi") merged.location = fallbackItem.location;
    if (merged.imageAlt === undefined) merged.imageAlt = "";
  }
  if (fallbackItem.key === "partnership-page-hero" || merged.key === "partnership-page-hero") {
    // The date was saved through a datetime picker that couldn't hold "19 – 21 February 2027".
    if (!merged.date || String(merged.date).includes("T")) merged.date = fallbackItem.date;
    // Old placeholders (another account's km.jpg, the OG banner) were never the real background.
    const img = typeof merged.image === "string" ? merged.image : "";
    if (!img || img.includes("design-house/assets/km.jpg") || img.includes("og-banner.png")) {
      merged.image = fallbackItem.image;
    }
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt;
  }
  if ((fallbackItem.key === "epromotion-hero" || merged.key === "epromotion-hero")) {
    if (!merged.image) merged.image = fallbackItem.image;
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt;
  }
  if (fallbackItem.key === "sponsorship-hero" || merged.key === "sponsorship-hero") {
    // Old placeholders (another account's km.jpg, the OG banner) were never the real
    // background; saving them would have replaced the live background.
    const img = typeof merged.image === "string" ? merged.image : "";
    if (!img || img.includes("design-house/assets/km.jpg") || img.includes("og-banner.png")) {
      merged.image = fallbackItem.image;
    }
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt;
  }
  if (fallbackItem.key === "why-visit-hero" || merged.key === "why-visit-hero") {
    // The three-part title (primary + secondary + highlight) became a single H1 "title".
    const legacyTitle = [savedItem.titlePrimary, savedItem.titleSecondary, savedItem.titleHighlight]
      .filter((x) => typeof x === "string" && x.trim())
      .join(" ")
      .trim();
    if (legacyTitle && !savedItem.title) merged.title = legacyTitle;
    delete merged.titlePrimary;
    delete merged.titleSecondary;
    delete merged.titleHighlight;
  }
  if (fallbackItem.key === "nominate-hero" || merged.key === "nominate-hero") {
    // Fields from the old hero layout that the website never showed; the old two-part
    // title (uppercase, never live) is dropped in favour of the website's own H1.
    for (const k of [
      "titlePrimary", "titleSecondary", "subtitle", "buttonLabel", "buttonHref",
      "secondaryButtonLabel", "secondaryButtonHref",
    ]) {
      delete merged[k];
    }
    if (!savedItem.title) merged.title = fallbackItem.title;
    if (!merged.image) merged.image = fallbackItem.image;
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt;
  }
  if (fallbackItem.key === "exhibition-hero" || merged.key === "exhibition-hero") {
    // Fields from the old hero layout that the website never showed.
    for (const k of [
      "eyebrow", "titlePrimary", "titleSecondary", "date", "location",
      "buttonLabel", "buttonHref", "secondaryButtonLabel", "secondaryButtonHref",
      // The background is a CSS image, which can't carry alt text.
      "imageAlt",
    ]) {
      delete merged[k];
    }
    if (!merged.title) merged.title = fallbackItem.title;
    if (!merged.image) merged.image = fallbackItem.image;
  }
  if (fallbackItem.key === "awards-stats" || merged.key === "awards-stats") {
    delete merged.eyebrow;
    delete merged.title;
  }
  if (fallbackItem.key === "awards-about" || merged.key === "awards-about") {
    delete merged.image;
    delete merged.imageAlt;
  }
  if (fallbackItem.key === "awards-categories" || merged.key === "awards-categories") {
    delete merged.description;
    delete merged.shortDescription;
  }
  if (fallbackItem.key === "awards-grand-awards" || merged.key === "awards-grand-awards") {
    delete merged.description;
    delete merged.shortDescription;
  }
  if (fallbackItem.key === "awards-process" || merged.key === "awards-process") {
    delete merged.description;
    delete merged.shortDescription;
  }
  if (fallbackItem.key === "why-exhibit-hero" || merged.key === "why-exhibit-hero") {
    delete merged.date;
    delete merged.location;
    if (merged.bgImage === undefined) merged.bgImage = "";
    if (Array.isArray(merged.items)) {
      merged.items = merged.items.map((it: CmsJson, idx: number) => {
        const copy = { ...it };
        delete copy.icon;
        return {
          ...copy,
          image: copy.image || copy.img || `/uploads/icons/x${(idx % 4) + 1}.png`,
        };
      });
    }
  }
  if (fallbackItem.key === "industry-segments" || merged.key === "industry-segments") {
    delete merged.description;
    delete merged.shortDescription;
    delete merged.buttonLabel;
    delete merged.buttonHref;
  }
  if (fallbackItem.key === "testimonials-section" || merged.key === "testimonials-section") {
    delete merged.subtitle;
    delete merged.items;
  }
  if (fallbackItem.key === "buyer-seller-meet" || merged.key === "buyer-seller-meet") {
    // Why Visit's Buyer-Seller Meet shows its date/venue as plain text; clear out
    // values left behind by the old datetime picker.
    if (fallbackItem.date !== undefined && (!merged.date || String(merged.date).includes("T"))) {
      merged.date = fallbackItem.date;
    }
    if (fallbackItem.location !== undefined && !merged.location) {
      merged.location = fallbackItem.location;
    }
    // The homepage Buyer-Seller Meet (no date field) no longer has a secondary button.
    if (fallbackItem.date === undefined) {
      delete merged.secondaryButtonLabel;
      delete merged.secondaryButtonHref;
    }
  }
  if (fallbackItem.key === "buyer-seller-meet-hero" || merged.key === "buyer-seller-meet-hero") {
    // Title Primary + Title Secondary are now one H1 "title" field.
    if (merged.titlePrimary || merged.titleSecondary) {
      const combined = [merged.titlePrimary, merged.titleSecondary].filter(Boolean).join(" ").trim();
      if (combined && (!savedItem.title || savedItem.title === fallbackItem.title)) merged.title = combined;
    }
    delete merged.titlePrimary;
    delete merged.titleSecondary;
    delete merged.logoImage;
    // Drop the old placeholder photo that was never a real background.
    if (typeof merged.image === "string" && merged.image.includes("design-house/assets/km.jpg")) merged.image = "";
    if (!merged.date) merged.date = fallbackItem.date;
    if (!merged.location) merged.location = fallbackItem.location;
    if (!merged.imageAlt) merged.imageAlt = fallbackItem.imageAlt;
  }
  if (fallbackItem.key === "msme-director-message" || merged.key === "msme-director-message") {
    // The right-hand media is a video now (upload / YouTube / Instagram), not images.
    delete merged.image;
    delete merged.imageAlt;
    delete merged.logoImage;
    delete merged.secondaryImage;
    if (!merged.messageTitle) merged.messageTitle = fallbackItem.messageTitle;
    if (merged.videoUrl === undefined) merged.videoUrl = fallbackItem.videoUrl;
  }
  if (fallbackItem.key === "audience-strip" || merged.key === "audience-strip") {
    delete merged.title;
  }
  if (fallbackItem.key === "introduction-section" || merged.key === "introduction-section") {
    delete merged.items;
    // Title Primary + Title Secondary are shown as one H1 "title" field now.
    if (merged.titlePrimary || merged.titleSecondary) {
      const combined = [merged.titlePrimary, merged.titleSecondary].filter(Boolean).join(" ").trim();
      if (combined && (!savedItem.title || savedItem.title === fallbackItem.title)) merged.title = combined;
    }
    delete merged.titlePrimary;
    delete merged.titleSecondary;
    if (!merged.description2) {
      merged.description2 =
        "Designed to foster business growth, knowledge sharing, innovation, and international collaboration, Design House serves as the perfect destination for discovering new products, building strategic partnerships, expanding global markets, and promoting a sustainable future.";
    }
    if (!merged.timerTitle) merged.timerTitle = "EVENT BEGINS IN";
    if (!merged.eventDate) merged.eventDate = "2027-02-19T00:00:00";
    if (merged.showTimer === undefined) merged.showTimer = true;
  }
  if (fallbackItem.key === "global-platform" || merged.key === "global-platform") {
    delete merged.subtitle;
    delete merged.title;
    delete merged.image;
    delete merged.imageAlt;
    if (!merged.keyPoint1) merged.keyPoint1 = "International Exhibitors & Global Brands";
    if (!merged.keyPoint2) merged.keyPoint2 = "Buyers, Distributors & Importers";
    if (!merged.keyPoint3) merged.keyPoint3 = "Research & Innovation | Startups";
    if (!merged.keyPoint4) merged.keyPoint4 = "Investors, Financial Institutions";
    if (!merged.keyPoint5) merged.keyPoint5 = "Government Bodies, Embassies & Policy Makers";
    merged.items = (merged.items || []).filter(
      (it: CmsJson) =>
        !/trusted brands|targeted audience|business growth/i.test(it.title || "")
    );
  }
  if (fallbackItem.key === "why-participate" || merged.key === "why-participate") {
    delete merged.subtitle;
    delete merged.title;
    delete merged.items;
    if (!merged.keyPoint1) merged.keyPoint1 = "Meet genuine buyers, distributors, retailers, and healthcare professionals";
    if (!merged.keyPoint2) merged.keyPoint2 = "Generate high-quality B2B & B2C leads with faster business conversions";
    if (!merged.keyPoint3) merged.keyPoint3 = "Launch new products with maximum visibility and market impact";
    if (!merged.keyPoint4) merged.keyPoint4 = "Expand your dealer, distributor, franchise, and export network";
    if (!merged.keyPoint5) merged.keyPoint5 = "Strengthen brand presence through live demos and media exposure";
    if (!merged.keyPoint6) merged.keyPoint6 = "Connect with investors, CEOs, doctors, and key decision-makers";
    if (!merged.keyPoint7) merged.keyPoint7 = "Achieve higher ROI with direct customer engagement and trust building";
    if (!merged.buttonLabel) merged.buttonLabel = "BOOK A STALL";
    if (!merged.buttonHref) merged.buttonHref = "/registration/book-a-stand";
    if (!merged.secondaryButtonLabel) merged.secondaryButtonLabel = "Download Brochure";
    if (!merged.secondaryButtonHref) merged.secondaryButtonHref = "/boe.pdf";
    if (!merged.tertiaryButtonLabel) merged.tertiaryButtonLabel = "Why Exhibit?";
    if (!merged.tertiaryButtonHref) merged.tertiaryButtonHref = "/why-exhibit";
  }
  if (fallbackItem.key === "conference-section" || merged.key === "conference-section") {
    delete merged.subtitle;
    delete merged.title;
    delete merged.items;
    if (!merged.eyebrow) merged.eyebrow = "GLOBAL CONFERENCE & SEMINARS";
    if (!merged.titlePrimary) merged.titlePrimary = "Where Knowledge Meets";
    if (!merged.titleSecondary) merged.titleSecondary = "the Future of Organic";
    if (!merged.description) merged.description = "Join expert-led sessions, panel discussions & thought leadership talks on the latest trends shaping the future of organic, natural and sustainable living.";
    if (!merged.buttonLabel) merged.buttonLabel = "View Conference Schedule";
    if (!merged.buttonHref) merged.buttonHref = "https://www.designhouse.co.in/";
    if (!merged.keyPoint1) merged.keyPoint1 = "Expert-led panel discussions & keynotes";
    if (!merged.keyPoint2) merged.keyPoint2 = "Emerging trends in organic farming & retail";
    if (!merged.keyPoint3) merged.keyPoint3 = "Sustainable business & growth strategies";
    if (!merged.stat1Title) merged.stat1Title = "19 – 21";
    if (!merged.stat1Sub) merged.stat1Sub = "FEBRUARY 2027";
    if (!merged.stat2Title) merged.stat2Title = "PRAGATI MAIDAN";
    if (!merged.stat2Sub) merged.stat2Sub = "NEW DELHI";
    if (!merged.stat3Title) merged.stat3Title = "INSIGHTS. IDEAS.";
    if (!merged.stat3Sub) merged.stat3Sub = "IMPACT.";
    if (!merged.stat4Title) merged.stat4Title = "150+ GLOBAL";
    if (!merged.stat4Sub) merged.stat4Sub = "SPEAKERS";
    if (!merged.stat5Title) merged.stat5Title = "20+ KEY";
    if (!merged.stat5Sub) merged.stat5Sub = "SESSIONS";
  }
  if (fallbackItem.key === "expo-categories" || merged.key === "expo-categories") {
    delete merged.image;
    delete merged.imageAlt;
    delete merged.title;
    delete merged.subtitle;
    if (!merged.sectionTag) merged.sectionTag = "Expo Categories";
    if (!merged.titleMain) merged.titleMain = "Explore Diverse";
    if (!merged.titleHighlight) merged.titleHighlight = "Exhibition Sectors";
    if (!merged.descriptionPrefix) merged.descriptionPrefix = "One Platform. Every Opportunity.";
    if (!merged.description) merged.description = "Design House brings together the entire organic ecosystem under one roof. Explore a wide range of sectors driving sustainable living, natural wellness, ethical production and global trade.";
    if (!merged.buttonText) merged.buttonText = "VIEW ALL CATEGORIES";
    if (!merged.buttonHref) merged.buttonHref = "/exhibition-categories";
    if (!merged.exploreText) merged.exploreText = "Explore";
    if (Array.isArray(merged.items)) {
      merged.items = merged.items.map((it: CmsJson) => {
        const clean = { ...it };
        delete clean.icon;
        delete clean.desc;
        delete clean.color;
        delete clean.imageAlt;
        if (clean.description === undefined) clean.description = it.desc || "";
        if (clean.image === undefined) clean.image = "";
        if (!clean.href) clean.href = it.link || "/exhibition-categories";
        if (!clean.exploreText) clean.exploreText = "Explore";
        return clean;
      });
    }
  }
  if (fallbackItem.key === "beyond-exhibition" || merged.key === "beyond-exhibition") {
    delete merged.title;
    delete merged.subtitle;
    if (!merged.sectionTag) merged.sectionTag = "Global Organic Platform";
    if (!merged.titleMain) merged.titleMain = "Beyond An";
    if (!merged.titleHighlight) merged.titleHighlight = "Exhibition";
    if (!merged.description) merged.description = "Join India's most powerful ecosystem for the organic industry. From high-impact B2B matchmaking and leadership summits to global networking, we provide everything you need to scale your business.";
    if (!merged.image) merged.image = "";
    if (!merged.imageAlt) merged.imageAlt = "Conferences & Seminars";
    if (Array.isArray(merged.items)) {
      merged.items = merged.items.map((it: CmsJson) => ({
        title: it.title || "",
        description: it.description || it.subtitle || "",
        icon: it.icon || "Users",
      }));
    }
  }
  if (fallbackItem.key === "sponsors-attend" || merged.key === "sponsors-attend") {
    delete merged.title;
    delete merged.subtitle;
    delete merged.rightTitle;
    delete merged.rightBottomText;
    delete merged.centerText1;
    delete merged.centerText2;
    delete merged.centerText3;
    delete merged.items;
    if (!merged.titlePrefix) merged.titlePrefix = "WHY";
    if (!merged.titleHighlight) merged.titleHighlight = "ATTEND?";
    if (!merged.description) merged.description = "Explore innovations, build connections and gain insights that drive better health and stronger businesses.";
    if (!merged.image) merged.image = "";
    if (!merged.imageAlt) merged.imageAlt = "Why Attend Expo";
    if (!merged.buttonLabel) merged.buttonLabel = "REGISTER AS VISITOR!";
    if (!merged.buttonHref) merged.buttonHref = "/registration/visitor-registration";
    if (!merged.feature1Title) merged.feature1Title = "DISCOVER";
    if (!merged.feature1Desc) merged.feature1Desc = "Explore the latest organic products and eco-friendly services driving a sustainable future.";
    if (!merged.feature2Title) merged.feature2Title = "LEARN";
    if (!merged.feature2Desc) merged.feature2Desc = "Attend seminars, workshops and live demos by organic agriculture and sustainability experts.";
    if (!merged.feature3Title) merged.feature3Title = "CONNECT";
    if (!merged.feature3Desc) merged.feature3Desc = "Meet leading organic brands, manufacturers and sustainable suppliers under one roof.";
    if (!merged.feature4Title) merged.feature4Title = "SOURCE";
    if (!merged.feature4Desc) merged.feature4Desc = "Find trusted organic suppliers, distributors and eco-franchise opportunities.";
    if (!merged.feature5Title) merged.feature5Title = "GROW";
    if (!merged.feature5Desc) merged.feature5Desc = "Unlock new green business opportunities, partnerships and eco-investment possibilities.";
    if (!merged.feature6Title) merged.feature6Title = "STAY AHEAD";
    if (!merged.feature6Desc) merged.feature6Desc = "Stay updated with market trends, conscious consumer insights and future organic industry developments.";
    if (!merged.keyPoint1) merged.keyPoint1 = "Organic Distributors, Wholesalers & Retailers";
    if (!merged.keyPoint2) merged.keyPoint2 = "Eco-Importers & Exporters";
    if (!merged.keyPoint3) merged.keyPoint3 = "Ayurvedic Institutions & Wellness Centers";
    if (!merged.keyPoint4) merged.keyPoint4 = "Nutritionists, Farmers & Wellness Experts";
    if (!merged.keyPoint5) merged.keyPoint5 = "Gym Owners, Spa & Eco-Fitness Professionals";
    if (!merged.keyPoint6) merged.keyPoint6 = "Organic Farming & Natural Product Buyers";
    if (!merged.keyPoint7) merged.keyPoint7 = "Sustainable Packaging & Eco-friendly Brands";
    if (!merged.keyPoint8) merged.keyPoint8 = "Investors, Franchise Seekers & Green Business";
    if (!merged.keyPoint9) merged.keyPoint9 = "Supermarkets & Organic Grocery Chains";
    if (!merged.keyPoint10) merged.keyPoint10 = "Health-Conscious Consumers & Eco-Enthusiasts";
  }
  if (fallbackItem.key === "footer" || merged.key === "footer") {
    if (fallbackItem.ctaTitle !== undefined || fallbackItem.footBgImage !== undefined) {
      if (!merged.ctaEyebrow) merged.ctaEyebrow = fallbackItem.ctaEyebrow;
      if (!merged.ctaTitle) merged.ctaTitle = fallbackItem.ctaTitle;
      if (!merged.ctaDescription) merged.ctaDescription = fallbackItem.ctaDescription;
      if (!merged.ctaButtonLabel) merged.ctaButtonLabel = fallbackItem.ctaButtonLabel;
      if (!merged.ctaButtonHref) merged.ctaButtonHref = fallbackItem.ctaButtonHref;
      if (!merged.ctaBannerImage) merged.ctaBannerImage = fallbackItem.ctaBannerImage;
      if (!merged.footBgImage) merged.footBgImage = fallbackItem.footBgImage;
      if (!merged.logoImage) merged.logoImage = fallbackItem.logoImage;
      if (!merged.phoneNumber) merged.phoneNumber = fallbackItem.phoneNumber;
      if (!merged.altPhoneNumber) merged.altPhoneNumber = fallbackItem.altPhoneNumber;
      if (!merged.contactEmail) merged.contactEmail = fallbackItem.contactEmail;
      if (!merged.contactAddress) merged.contactAddress = fallbackItem.contactAddress;
      if (!merged.websiteUrl) merged.websiteUrl = fallbackItem.websiteUrl;
      if (merged.description === undefined || String(merged.description).startsWith("A global platform uniting")) {
        merged.description = fallbackItem.description;
      }
      if (!merged.facebookUrl) merged.facebookUrl = fallbackItem.facebookUrl;
      if (!merged.instagramUrl) merged.instagramUrl = fallbackItem.instagramUrl;
      if (!merged.twitterUrl) merged.twitterUrl = fallbackItem.twitterUrl;
      if (!merged.youtubeUrl) merged.youtubeUrl = fallbackItem.youtubeUrl;
      if (!merged.linkedinUrl) merged.linkedinUrl = fallbackItem.linkedinUrl;
      return merged;
    }
    delete merged.title;
    delete merged.subtitle;
    delete merged.partnerLogoImage;
    delete merged.secondaryImage;
    delete merged.tertiaryImage;
    delete merged.altPhoneNumber;
    if (!merged.websiteUrl) merged.websiteUrl = "www.designhouse.co.in";
    if (merged.description === undefined || merged.description.startsWith("Showcasing certified products")) {
      merged.description =
        "A global platform uniting over 100+ exhibitors from across the organic value chain, showcasing certified products, advanced agritech, sustainable practices, and the rich heritage of traditional wellness. Discover organic living with conferences and B2B opportunities.";
    }
    if (merged.logoImage === undefined || merged.logoImage.includes("km.jpg")) {
      merged.logoImage = "";
    }
    if (merged.leafImage === undefined) {
      merged.leafImage = "";
    }
    if (merged.downImage === undefined) {
      merged.downImage = "";
    }
    if (merged.organisedByLogo === undefined) {
      merged.organisedByLogo = "";
    }
    if (merged.bottomBannerImage === undefined) {
      merged.bottomBannerImage = "";
    }
    if (merged.contactAddress === undefined) merged.contactAddress = "Hall 12, Pragati Maidan, New Delhi, India 110001";
    if (merged.phoneNumber === undefined) merged.phoneNumber = "+91 96549 00525";
    if (merged.conferenceHelpline === undefined) merged.conferenceHelpline = "+91 98183 53841";
    if (merged.contactEmail === undefined) merged.contactEmail = "info@designhouse.co.in";
    if (merged.facebookUrl === undefined) merged.facebookUrl = "https://facebook.com/designhouseindia";
    if (merged.twitterUrl === undefined) merged.twitterUrl = "https://x.com/designhouseindia";
    if (merged.linkedinUrl === undefined) merged.linkedinUrl = "https://linkedin.com/company/designhouseindia";
    if (merged.instagramUrl === undefined) merged.instagramUrl = "https://instagram.com/designhouseindia";
    if (merged.youtubeUrl === undefined) merged.youtubeUrl = "https://youtube.com/@designhouseindia";
    if (!merged.items || merged.items.length === 0) {
      merged.items = [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
        { label: "Exhibitor Registration", href: "/registration/book-a-stand" },
        { label: "Delegate Registration", href: "https://www.designhouse.co.in/" },
        { label: "Conference Tracks", href: "https://www.designhouse.co.in/" },
        { label: "Buyer Seller Meet", href: "/buyer-seller-meet" },
        { label: "Exhibitor List", href: "/exhibitors" },
        { label: "Blogs", href: "/blog" },
        { label: "Awards", href: "/awards" },
        { label: "Contact Us", href: "/contact" },
      ];
    }
  }
  return merged;
}
