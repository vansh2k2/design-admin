import { FieldLabel, ImageUploadField, ImageWithAltField, PdfUploadField, TextInput, Textarea, Toggle, VideoUploadField } from "../fields";
import RichTextEditor from "@/components/RichTextEditor";
import { TopbarContactFields } from "./TopbarContactFields";
import {
  IMAGE_KEY_PATTERN,
  LONG_TEXT_KEY_PATTERN,
  RICH_TEXT_KEY_PATTERN,
  SECTION_SKIP_KEYS,
  VIDEO_KEY_PATTERN,
  humanizeKey,
} from "./sectionFieldHelpers";
import type { CmsRecord } from "@/lib/cmsJson";

export function SectionFieldsEditor({
  section,
  onFieldChange,
}: {
  section: CmsRecord;
  onFieldChange: (key: string, value: unknown) => void;
}) {
  if (section.key === "topbar" || section.name === "Topbar & Header Contact") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Topbar Brand, Contact & Ensis Logo Settings</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <FieldLabel>Company Title</FieldLabel>
            <TextInput
              value={String(section.title || "Design House India Pvt. Ltd.")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Design House India Pvt. Ltd."
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Marquee Text</FieldLabel>
            <TextInput
              value={String(section.marqueeText || "")}
              onChange={(next) => onFieldChange("marqueeText", next)}
              placeholder="5000+ PROJECTS DELIVERED • PAN-INDIA EXECUTION • RETAIL | RESTAURANT | KIOSK | CORPORATE | EXHIBITION EXPERTS"
              hideLimit={true}
            />
          </div>
          {/* Phone numbers, email and quick links: saved to the backend, live on the website */}
          <div className="md:col-span-2">
            <TopbarContactFields />
          </div>
          <div className="md:col-span-2 border-t border-gray-100 pt-2.5">
            <ImageWithAltField
              label="Ensis Logo (Upload Image)"
              image={String(section.ensisLogo || section.logoImage || "/ensis.jpeg")}
              alt={String(section.ensisLogoAlt || section.logoAlt || "Ensis Spa and Panchkarma Furniture")}
              onImageChange={(next) => {
                onFieldChange("ensisLogo", next);
                onFieldChange("logoImage", next);
              }}
              onAltChange={(next) => {
                onFieldChange("ensisLogoAlt", next);
                onFieldChange("logoAlt", next);
              }}
              altLabel="Alt Tag"
              altPlaceholder="e.g. Ensis Spa and Wellness Furniture Solutions"
            />
          </div>
          <div>
            <FieldLabel>Ensis Partner Website URL</FieldLabel>
            <TextInput
              value={String(section.externalLinkUrl || "https://ensis.in/")}
              onChange={(next) => onFieldChange("externalLinkUrl", next)}
              placeholder="https://ensis.in/"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Ensis Tooltip / Sub-label</FieldLabel>
            <TextInput
              value={String(section.externalLinkText || "Panchkarma Solution")}
              onChange={(next) => onFieldChange("externalLinkText", next)}
              placeholder="Panchkarma Solution"
              hideLimit={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (
    section.key === "clients-marquee" ||
    section.key === "clients" ||
    section.key === "partners-brands" ||
    section.name === "Our Clients (Logo Strip)"
  ) {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Our Clients Section Settings</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Section Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "OUR CLIENTS")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="OUR CLIENTS"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Title (Prefix)</FieldLabel>
            <TextInput
              value={String(section.title || "Trusted by")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Trusted by"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Highlighted Accent Word</FieldLabel>
            <TextInput
              value={String(section.highlightedWord || "Leading Brands")}
              onChange={(next) => onFieldChange("highlightedWord", next)}
              placeholder="Leading Brands"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Button Text</FieldLabel>
            <TextInput
              value={String(section.buttonLabel || "VIEW ALL CLIENTS")}
              onChange={(next) => onFieldChange("buttonLabel", next)}
              placeholder="VIEW ALL CLIENTS"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Button Link</FieldLabel>
            <TextInput
              value={String(section.buttonHref || "/clients")}
              onChange={(next) => onFieldChange("buttonHref", next)}
              placeholder="/clients"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel required>Section Description / Sub-heading (e.g. Partnering with industry leaders...)</FieldLabel>
            <RichTextEditor
              value={String(section.description || "Partnering with industry leaders to create exceptional spaces")}
              onChange={(next) => onFieldChange("description", next)}
              minHeight="100px"
              placeholder="Partnering with industry leaders to create exceptional spaces"
            />
          </div>
          <div>
            <FieldLabel>Stat 1 Value</FieldLabel>
            <TextInput
              value={String(section.stat1Value || "850+")}
              onChange={(next) => onFieldChange("stat1Value", next)}
              placeholder="850+"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Stat 1 Label</FieldLabel>
            <TextInput
              value={String(section.stat1Label || "Happy Clients")}
              onChange={(next) => onFieldChange("stat1Label", next)}
              placeholder="Happy Clients"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Stat 2 Value</FieldLabel>
            <TextInput
              value={String(section.stat2Value || "5000+")}
              onChange={(next) => onFieldChange("stat2Value", next)}
              placeholder="5000+"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Stat 2 Label</FieldLabel>
            <TextInput
              value={String(section.stat2Label || "Projects Completed")}
              onChange={(next) => onFieldChange("stat2Label", next)}
              placeholder="Projects Completed"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Stat 3 Value</FieldLabel>
            <TextInput
              value={String(section.stat3Value || "22+")}
              onChange={(next) => onFieldChange("stat3Value", next)}
              placeholder="22+"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Stat 3 Label</FieldLabel>
            <TextInput
              value={String(section.stat3Label || "Years Experience")}
              onChange={(next) => onFieldChange("stat3Label", next)}
              placeholder="Years Experience"
              hideLimit={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (
    section.key === "about" ||
    section.key === "about-us" ||
    section.name === "About Us" ||
    section.name === "About"
  ) {
    // If title has "Since" glued into it (e.g. "Crafting Exceptional SpacesSince 19822"), extract title and highlight
    let currentTitle = String(section.title || "Crafting Exceptional Spaces");
    let currentHighlight = String(section.highlightedWord || "");
    if (currentTitle.includes("Since") && (!currentHighlight || currentHighlight === "Since 2004")) {
      const parts = currentTitle.split(/(?=Since)/i);
      currentTitle = parts[0].trim();
      currentHighlight = parts.slice(1).join("").trim();
    }

    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>About Us Section Settings</span>
          <span className="text-[10px] text-gray-500 font-normal">Headline, Highlight Accent & Overview</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Section Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "ABOUT US")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="ABOUT US"
              hideLimit={true}
            />
          </div>

          <div>
            <FieldLabel required>Main Title (Headline)</FieldLabel>
            <TextInput
              value={currentTitle}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Crafting Exceptional Spaces"
              hideLimit={true}
            />
          </div>

          <div className="md:col-span-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/80 p-3 rounded-[6px]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#DE802B]"></span>
                <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wide">
                  Highlight Content / Accent Text (Alag Se Highlight)
                </span>
              </div>
              <span className="text-[9px] font-semibold text-[#DE802B] bg-white px-2 py-0.5 rounded border border-orange-200">
                Accent Highlight
              </span>
            </div>
            <TextInput
              value={currentHighlight}
              onChange={(next) => onFieldChange("highlightedWord", next)}
              placeholder="Since 1982"
              hideLimit={true}
            />
            <p className="text-[10px] text-amber-900/80 mt-1.5 leading-relaxed">
              Ye content main title ke aage stylish orange / accent color me alag se display hota hai (jaise: <strong>Since 1982</strong> ya <strong>Since 2004</strong>). Isko title me mix karne ki zaroorat nahi hai.
            </p>
          </div>

          <div className="md:col-span-2">
            <FieldLabel required>Company Story & Overview (Description)</FieldLabel>
            <RichTextEditor
              value={String(section.description || "")}
              onChange={(next) => onFieldChange("description", next)}
              minHeight="140px"
              placeholder="Enter comprehensive company background, credentials, and achievements..."
            />
          </div>

          <div>
            <FieldLabel>Mission Box Title</FieldLabel>
            <TextInput
              value={String(section.missionTitle || "Our Mission")}
              onChange={(next) => onFieldChange("missionTitle", next)}
              placeholder="Our Mission"
              hideLimit={true}
            />
          </div>

          <div>
            <FieldLabel>Vision Box Title</FieldLabel>
            <TextInput
              value={String(section.visionTitle || "Our Vision")}
              onChange={(next) => onFieldChange("visionTitle", next)}
              placeholder="Our Vision"
              hideLimit={true}
            />
          </div>

          <div className="md:col-span-1">
            <FieldLabel>Mission Content</FieldLabel>
            <RichTextEditor
              value={String(section.missionContent || "")}
              onChange={(next) => onFieldChange("missionContent", next)}
              minHeight="100px"
              placeholder="Deliver innovative designs that exceed expectations..."
            />
          </div>

          <div className="md:col-span-1">
            <FieldLabel>Vision Content</FieldLabel>
            <RichTextEditor
              value={String(section.visionContent || "")}
              onChange={(next) => onFieldChange("visionContent", next)}
              minHeight="100px"
              placeholder="To be the most trusted interior design partner..."
            />
          </div>

          <div>
            <FieldLabel>Button Label</FieldLabel>
            <TextInput
              value={String(section.buttonLabel || "Know More")}
              onChange={(next) => onFieldChange("buttonLabel", next)}
              placeholder="Know More"
              hideLimit={true}
            />
          </div>

          <div>
            <FieldLabel>Button Link URL</FieldLabel>
            <TextInput
              value={String(section.buttonHref || "/about")}
              onChange={(next) => onFieldChange("buttonHref", next)}
              placeholder="/about"
              hideLimit={true}
            />
          </div>

          <div className="md:col-span-2 border-t border-gray-100 pt-2">
            <span className="text-[11px] font-bold text-slate-800 block mb-2">About Collage Grid Images (4 Photos)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              <div>
                <ImageWithAltField
                  label="Photo 1"
                  image={String(section.image1 || "")}
                  alt={String(section.image1Alt || section.alt1 || "Design House Turnkey Interior 1")}
                  onImageChange={(next) => onFieldChange("image1", next)}
                  onAltChange={(next) => {
                    onFieldChange("image1Alt", next);
                    onFieldChange("alt1", next);
                  }}
                  altLabel="Alt Tag"
                  layout="stacked"
                />
              </div>
              <div>
                <ImageWithAltField
                  label="Photo 2"
                  image={String(section.image2 || "")}
                  alt={String(section.image2Alt || section.alt2 || "Design House Office Space 2")}
                  onImageChange={(next) => onFieldChange("image2", next)}
                  onAltChange={(next) => {
                    onFieldChange("image2Alt", next);
                    onFieldChange("alt2", next);
                  }}
                  altLabel="Alt Tag"
                  layout="stacked"
                />
              </div>
              <div>
                <ImageWithAltField
                  label="Photo 3"
                  image={String(section.image3 || "")}
                  alt={String(section.image3Alt || section.alt3 || "Design House Retail Display 3")}
                  onImageChange={(next) => onFieldChange("image3", next)}
                  onAltChange={(next) => {
                    onFieldChange("image3Alt", next);
                    onFieldChange("alt3", next);
                  }}
                  altLabel="Alt Tag"
                  layout="stacked"
                />
              </div>
              <div>
                <ImageWithAltField
                  label="Photo 4"
                  image={String(section.image4 || "")}
                  alt={String(section.image4Alt || section.alt4 || "Design House Exhibition Stall 4")}
                  onImageChange={(next) => onFieldChange("image4", next)}
                  onAltChange={(next) => {
                    onFieldChange("image4Alt", next);
                    onFieldChange("alt4", next);
                  }}
                  altLabel="Alt Tag"
                  layout="stacked"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "contact-hero" || section.name === "Contact Hero Banner") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Contact Us Hero Banner & Tagline</span>
          <span className="text-[10px] text-gray-500 font-normal">Header Title, Subtitle & Banner Background</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <FieldLabel>Breadcrumb / Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Contact Us")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Contact Us"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel required>Main Headline (H1)</FieldLabel>
            <Textarea
              value={String(section.headline ?? [section.title, section.highlightedWord ? `*${section.highlightedWord}*` : ""].filter(Boolean).join("\n"))}
              onChange={(next) => onFieldChange("headline", next)}
              placeholder={"Let's Build\nYour *Next Space*"}
              rows={2}
              noLimit={true}
            />
            <p className="mt-1 text-[10px] text-slate-500">
              The page&apos;s only H1. Press Enter for a new line; put words between *stars* to show them in orange.
            </p>
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Subtitle / Description</FieldLabel>
            <TextInput
              value={String(section.description || "From concept to completion, our team is here to understand your requirements and create the right solution for your brand.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="From concept to completion, our team is here to understand your requirements and create the right solution for your brand."
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2 border-t border-gray-100 pt-2.5">
            <ImageWithAltField
              label="Hero Banner Image (Upload / URL)"
              image={String(section.image || "/assets/banner/contact.webp")}
              alt={String(section.imageAlt || "Design House India reception and office")}
              onImageChange={(next) => onFieldChange("image", next)}
              onAltChange={(next) => onFieldChange("imageAlt", next)}
              altLabel="Banner Image Alt Tag"
              altPlaceholder="e.g. Design House India reception and office"
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "contact-info" || section.name === "Direct Contact Information") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Direct Contact Information & Operating Hours</span>
          <span className="text-[10px] text-gray-500 font-normal">Phone Numbers, Email & Business Timings</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Section Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Get in Touch")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Get in Touch"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Heading Title</FieldLabel>
            <TextInput
              value={String(section.title || "We're Here to Help")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="We're Here to Help"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Section Subtitle</FieldLabel>
            <TextInput
              value={String(section.description || "Have a project in mind or need expert advice? Our team will be happy to assist you with design, manufacturing and execution tailored to your requirements.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="Have a project in mind or need expert advice? Our team will be happy to assist you with design, manufacturing and execution tailored to your requirements."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Primary Phone Number</FieldLabel>
            <TextInput
              value={String(section.phoneNumber1 || "+91 9654900525")}
              onChange={(next) => onFieldChange("phoneNumber1", next)}
              placeholder="+91 96549 00525"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Secondary / WhatsApp Phone</FieldLabel>
            <TextInput
              value={String(section.phoneNumber2 || "+91 9810247319")}
              onChange={(next) => onFieldChange("phoneNumber2", next)}
              placeholder="+91 98102 47319"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel required>Contact Email</FieldLabel>
            <TextInput
              value={String(section.contactEmail || "info@designhouse.co.in")}
              onChange={(next) => onFieldChange("contactEmail", next)}
              placeholder="info@designhouse.co.in"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Weekday Working Hours</FieldLabel>
            <TextInput
              value={String(section.workingHoursWeekday || "Monday – Saturday: 9:00 AM – 6:00 PM")}
              onChange={(next) => onFieldChange("workingHoursWeekday", next)}
              placeholder="Monday – Saturday: 9:00 AM – 6:00 PM"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Weekend Working Hours</FieldLabel>
            <TextInput
              value={String(section.workingHoursWeekend || "Sunday: Closed")}
              onChange={(next) => onFieldChange("workingHoursWeekend", next)}
              placeholder="Sunday: Closed"
              hideLimit={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "contact-form" || section.name === "Contact & Enquiry Form" || section.name === "Contact Form") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Contact & Enquiry Form Settings</span>
          <span className="text-[10px] text-gray-500 font-normal">Headings, Labels, Button & Confirmation Messages</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Form Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Send Us a Message")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Send Us a Message"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Form Title</FieldLabel>
            <TextInput
              value={String(section.title || "Enquire Now")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Enquire Now"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Form Subtitle / Lead Text</FieldLabel>
            <TextInput
              value={String(section.description || "Share your requirements and we will get back to you shortly.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="Share your requirements and we will get back to you shortly."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Submit Button Text</FieldLabel>
            <TextInput
              value={String(section.submitLabel || "Send Enquiry")}
              onChange={(next) => onFieldChange("submitLabel", next)}
              placeholder="Send Enquiry"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Security & Trust Note</FieldLabel>
            <TextInput
              value={String(section.securityNote || "Your information is safe with us. We typically respond during business hours.")}
              onChange={(next) => onFieldChange("securityNote", next)}
              placeholder="Your information is safe with us..."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Success Modal Title</FieldLabel>
            <TextInput
              value={String(section.successTitle || "Enquiry Sent!")}
              onChange={(next) => onFieldChange("successTitle", next)}
              placeholder="Enquiry Sent!"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Success Confirmation Message</FieldLabel>
            <TextInput
              value={String(section.successMessage || "Thank you for contacting us. Our team will get back to you within 24 hours.")}
              onChange={(next) => onFieldChange("successMessage", next)}
              placeholder="Thank you for contacting us..."
              hideLimit={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "offices" || section.key === "contact-offices" || section.name === "Our Regional Offices") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Our Regional Offices & Branches Settings</span>
          <span className="text-[10px] text-gray-500 font-normal">Headings (Office Cards are managed in the items list below)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Section Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Our Offices")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Our Offices"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Section Title</FieldLabel>
            <TextInput
              value={String(section.title || "Visit Us")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Visit Us"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <TextInput
              value={String(section.description || "Meet our team at any of our locations or get in touch to schedule a discussion.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="Meet our team at any of our locations..."
              hideLimit={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "contact-map" || section.name === "Find Us on Map & Directions" || section.name === "Find Us on Map") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Interactive Google Map & Directions</span>
          <span className="text-[10px] text-gray-500 font-normal">Map Embed Iframe, Coordinates & Direction Links</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Section Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Our Location")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Our Location"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Section Title</FieldLabel>
            <TextInput
              value={String(section.title || "Find Us on Map")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Find Us on Map"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <TextInput
              value={String(section.description || "Our head office is located in Ghaziabad, with branch offices in New Delhi and Mumbai.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="Our head office is located in Ghaziabad..."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Button Text</FieldLabel>
            <TextInput
              value={String(section.buttonLabel || "Open in Google Maps")}
              onChange={(next) => onFieldChange("buttonLabel", next)}
              placeholder="Open in Google Maps"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Google Maps Search / Directions Link</FieldLabel>
            <TextInput
              value={String(section.buttonHref || "https://www.google.com/maps/search/?api=1&query=Design+House+India+Pvt+Ltd%2C+Plot+No.+12%2F29%2C+Site-II+Industrial+Area%2C+Loni+Road%2C+Mohan+Nagar%2C+Ghaziabad+201007")}
              onChange={(next) => onFieldChange("buttonHref", next)}
              placeholder="https://www.google.com/maps/search/?api=1&query=..."
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel required>Google Map (Iframe embed code or URL)</FieldLabel>
            <Textarea
              value={String(section.mapEmbedUrl || "https://maps.google.com/maps?q=Design+House+India+Pvt+Ltd%2C+Mohan+Nagar%2C+Ghaziabad&z=15&output=embed")}
              onChange={(next) => onFieldChange("mapEmbedUrl", next)}
              placeholder={'<iframe src="https://www.google.com/maps/embed?pb=..."></iframe>'}
              rows={3}
              mono={true}
              noLimit={true}
            />
            <p className="text-[10px] text-slate-500 mt-1">
              In Google Maps: Share → Embed a map → Copy HTML, and paste it here (or paste just the embed link).
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "services-hero" || section.name === "Services Hero Banner") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Services Hero Banner & Headline</span>
          <span className="text-[10px] text-gray-500 font-normal">Title, Eyebrow, Gold Accent & Reception Banner</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <FieldLabel>Eyebrow Label</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Our Services")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Our Services"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Main Title (Line 1)</FieldLabel>
            <TextInput
              value={String(section.title || "Spaces")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Spaces"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Title Line 2 (Gold Accent)</FieldLabel>
            <TextInput
              value={String(section.titleLine2 || "That Work Better")}
              onChange={(next) => {
                onFieldChange("titleLine2", next);
                onFieldChange("highlightedWord", next);
              }}
              placeholder="That Work Better"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Tagline / Motto</FieldLabel>
            <TextInput
              value={String(section.tagline || "Design. Build. Deliver.")}
              onChange={(next) => onFieldChange("tagline", next)}
              placeholder="Design. Build. Deliver."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Gold Accent Word</FieldLabel>
            <TextInput
              value={String(section.highlightedWord || "That Work Better")}
              onChange={(next) => onFieldChange("highlightedWord", next)}
              placeholder="That Work Better"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <TextInput
              value={String(section.description || "A complete range of interior, design, manufacturing and turnkey solutions for modern businesses and homes.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="A complete range of interior, design, manufacturing and turnkey solutions..."
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2 border-t border-gray-100 pt-2.5">
            <ImageWithAltField
              label="Services Reception Banner (Upload / URL)"
              image={String(section.image || "/assets/banner/services.webp")}
              alt={String(section.imageAlt || "Design House India Services Reception Banner")}
              onImageChange={(next) => onFieldChange("image", next)}
              onAltChange={(next) => onFieldChange("imageAlt", next)}
              altLabel="Banner Image Alt Tag"
              altPlaceholder="e.g. Design House India Services Reception Banner"
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "services-intro" || section.name === "Concept to Completion Intro") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>From Concept to Completion Intro</span>
          <span className="text-[10px] text-gray-500 font-normal">Left text intro (4 highlight pillars in items below)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Eyebrow Label</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Our Services")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Our Services"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Section Heading</FieldLabel>
            <TextInput
              value={String(section.title || "From Concept to Completion")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="From Concept to Completion"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Golden Subheading</FieldLabel>
            <TextInput
              value={String(section.subtitle || "Designing Spaces for Businesses and Homes")}
              onChange={(next) => onFieldChange("subtitle", next)}
              placeholder="Designing Spaces for Businesses and Homes"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Intro Narrative</FieldLabel>
            <Textarea
              value={String(section.description || "At Design House India Pvt. Ltd., we offer end-to-end interior, design, manufacturing and turnkey solutions. With innovative ideas, in-house manufacturing and expert execution, we create functional, aesthetic and future-ready spaces for corporate, retail, hospitality, residential and wellness environments.")}
              onChange={(next) => onFieldChange("description", next)}
              rows={3}
              noLimit={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "services-grid" || section.name === "Our Services (Intro & Filter)") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Our Services Grid Header</span>
          <span className="text-[10px] text-gray-500 font-normal">Section Heading & Overview Text (Service cards are managed from services route)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <FieldLabel required>Section Title</FieldLabel>
            <TextInput
              value={String(section.title || "Our Services")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Our Services"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Section Description</FieldLabel>
            <Textarea
              value={String(section.description || "Explore our complete range of services designed to create functional, inspiring and future-ready spaces. Click on any service to view our projects.")}
              onChange={(next) => onFieldChange("description", next)}
              rows={2}
              noLimit={true}
            />
          </div>
          <div className="md:col-span-2 bg-[#f8fafc] border border-slate-200 rounded p-2.5">
            <p className="text-[10px] text-slate-600 font-medium">
              ℹ️ Individual turnkey service cards link directly to service detail routes and portfolio projects.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (
    section.key === "services-cta" ||
    section.key === "cta-banner" ||
    section.key === "cta" ||
    section.key === "project-cta" ||
    section.name === "Discuss Your Project CTA" ||
    section.name === "Call to Action Banner" ||
    (typeof section.eyebrow === "string" && section.eyebrow.toLowerCase().includes("build together")) ||
    (typeof section.title === "string" && (
      section.title.toLowerCase().includes("discuss your project") ||
      section.title.toLowerCase().includes("build together") ||
      section.title.toLowerCase().includes("project in mind")
    ))
  ) {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Discuss Your Project CTA Banner</span>
          <span className="text-[10px] text-gray-500 font-normal">Call to Action Heading, Subtitle & Button Link</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Eyebrow Label</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Let's Build Together")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Let's Build Together"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Main Title</FieldLabel>
            <TextInput
              value={String(section.title || "Let's Discuss Your Project")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Let's Discuss Your Project"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Highlighted Accent Word</FieldLabel>
            <TextInput
              value={String(section.highlightedWord || "Your Project")}
              onChange={(next) => onFieldChange("highlightedWord", next)}
              placeholder="Your Project"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Subtitle</FieldLabel>
            <TextInput
              value={String(section.subtitle || "Get in touch with our team for a customized solution.")}
              onChange={(next) => onFieldChange("subtitle", next)}
              placeholder="Get in touch with our team for a customized solution."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Button Label</FieldLabel>
            <TextInput
              value={String(section.buttonLabel || "Enquire Now")}
              onChange={(next) => onFieldChange("buttonLabel", next)}
              placeholder="Enquire Now"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Button Link</FieldLabel>
            <TextInput
              value={String(section.buttonHref || "/contact")}
              onChange={(next) => onFieldChange("buttonHref", next)}
              placeholder="/contact"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2 border-t border-gray-100 pt-2.5">
            <ImageWithAltField
              label="CTA Background / Diagonal Image (Upload / URL)"
              image={String(section.image || "/assets/image/t2.webp")}
              alt={String(section.imageAlt || "Let's Discuss Your Project Banner")}
              onImageChange={(next) => onFieldChange("image", next)}
              onAltChange={(next) => onFieldChange("imageAlt", next)}
              altLabel="Banner Image Alt Tag"
              altPlaceholder="e.g. Let's Discuss Your Project Consultation Lounge"
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "projects-hero" || section.name === "Projects Hero Banner") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Projects Hero Banner & Headline</span>
          <span className="text-[10px] text-gray-500 font-normal">Title, Eyebrow, Subtitle & Banner Photo</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <FieldLabel>Eyebrow Label</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Our Projects")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Our Projects"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Main Title (Line 1)</FieldLabel>
            <TextInput
              value={String(section.title || "Spaces")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Spaces"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Title Line 2 Prefix</FieldLabel>
            <TextInput
              value={String(section.titleLine2 || "That")}
              onChange={(next) => onFieldChange("titleLine2", next)}
              placeholder="That"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Gold Accent Word</FieldLabel>
            <TextInput
              value={String(section.highlightedWord || "Inspire")}
              onChange={(next) => onFieldChange("highlightedWord", next)}
              placeholder="Inspire"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Tagline / Subtitle</FieldLabel>
            <TextInput
              value={String(section.tagline || "From Vision to Reality")}
              onChange={(next) => onFieldChange("tagline", next)}
              placeholder="From Vision to Reality"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <TextInput
              value={String(section.description || "Explore our portfolio of thoughtfully designed and expertly executed spaces across industries. Each project reflects our commitment to functionality, aesthetics and long-term value.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="Explore our portfolio of thoughtfully designed..."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>CTA Button Text</FieldLabel>
            <TextInput
              value={String(section.buttonLabel || "Discuss Your Project")}
              onChange={(next) => onFieldChange("buttonLabel", next)}
              placeholder="Discuss Your Project"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>CTA Button Link</FieldLabel>
            <TextInput
              value={String(section.buttonHref || "/contact")}
              onChange={(next) => onFieldChange("buttonHref", next)}
              placeholder="/contact"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2 border-t border-gray-100 pt-2.5">
            <ImageWithAltField
              label="Hero Banner Reception Image (Upload / URL)"
              image={String(section.image || "/newproject/p1.png")}
              alt={String(section.imageAlt || "Design House India reception lobby")}
              onImageChange={(next) => onFieldChange("image", next)}
              onAltChange={(next) => onFieldChange("imageAlt", next)}
              altLabel="Banner Image Alt Tag"
              altPlaceholder="e.g. Design House India reception lobby"
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "projects-featured" || section.name === "Featured Project Showcase") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Featured Project Showcase & Slider</span>
          <span className="text-[10px] text-gray-500 font-normal">Headings, Metadata, Link & Showcase Photo (Slides in items below)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Section Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Featured Project")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Featured Project"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Main Project Title</FieldLabel>
            <TextInput
              value={String(section.title || "Axis Business Park")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Axis Business Park"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Project Category</FieldLabel>
            <TextInput
              value={String(section.category || "Corporate Interior")}
              onChange={(next) => onFieldChange("category", next)}
              placeholder="Corporate Interior"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Project Location</FieldLabel>
            <TextInput
              value={String(section.location || "Gurugram, Haryana")}
              onChange={(next) => onFieldChange("location", next)}
              placeholder="Gurugram, Haryana"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <TextInput
              value={String(section.description || "A modern and functional workspace designed to enhance collaboration, productivity and brand identity. Clean lines, premium finishes and thoughtful spatial planning create an inspiring work environment.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="A modern and functional workspace designed..."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Button Label</FieldLabel>
            <TextInput
              value={String(section.buttonLabel || "View Project Details")}
              onChange={(next) => onFieldChange("buttonLabel", next)}
              placeholder="View Project Details"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Button Link</FieldLabel>
            <TextInput
              value={String(section.buttonHref || "/portfolio/interior/corporate-interior")}
              onChange={(next) => onFieldChange("buttonHref", next)}
              placeholder="/portfolio/interior/corporate-interior"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2 border-t border-gray-100 pt-2.5">
            <ImageWithAltField
              label="Featured Project Image (Upload / URL)"
              image={String(section.image || "/newproject/p2.png")}
              alt={String(section.imageAlt || "Axis Business Park Reception")}
              onImageChange={(next) => onFieldChange("image", next)}
              onAltChange={(next) => onFieldChange("imageAlt", next)}
              altLabel="Image Alt Tag"
              altPlaceholder="e.g. Axis Business Park Reception"
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "projects-gallery" || section.name === "Our Projects (Header & Search)") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Our Projects Grid Section Header</span>
          <span className="text-[10px] text-gray-500 font-normal">Search Header & Category Filter Intro</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Section Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Explore Our Work")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Explore Our Work"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Section Title</FieldLabel>
            <TextInput
              value={String(section.title || "Our Projects")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Our Projects"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description / Subtitle</FieldLabel>
            <TextInput
              value={String(section.description || "Browse our delivered projects across corporate, retail, hospitality, exhibition, and residential spaces.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="Browse our delivered projects..."
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2 bg-[#f8fafc] border border-blue-100 rounded-md p-3 text-[11px] text-blue-900 leading-relaxed">
            <span className="font-bold">Portfolio Database Integration:</span> Project filter cards (DLF Corporate Office, Trends, The Palate, Bharat Organic Expo, Mall Kiosk, Signage, Office Fit-Out, Hotel Interiors, Luxury Residence) are managed automatically by the portfolio module with live category search filters.
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "diverse-spaces" || section.name === "Diverse Spaces Banner") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Diverse Spaces. Endless Possibilities.</span>
          <span className="text-[10px] text-gray-500 font-normal">Headings, Description, CTA & Lounge Banner</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Diverse Spaces")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Diverse Spaces"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Main Title (Line 1)</FieldLabel>
            <TextInput
              value={String(section.title || "Diverse Spaces.")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Diverse Spaces."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Title Line 2 Subtitle</FieldLabel>
            <TextInput
              value={String(section.subtitle || "Endless Possibilities.")}
              onChange={(next) => onFieldChange("subtitle", next)}
              placeholder="Endless Possibilities."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Orange Accent Word</FieldLabel>
            <TextInput
              value={String(section.highlightedWord || "Possibilities")}
              onChange={(next) => onFieldChange("highlightedWord", next)}
              placeholder="Possibilities"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <TextInput
              value={String(section.description || "From corporate offices to retail environments, restaurants to residential spaces, we create environments that reflect your vision and deliver lasting impact.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="From corporate offices to retail environments..."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Button Text</FieldLabel>
            <TextInput
              value={String(section.buttonLabel || "Start a Conversation")}
              onChange={(next) => onFieldChange("buttonLabel", next)}
              placeholder="Start a Conversation"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Button Link</FieldLabel>
            <TextInput
              value={String(section.buttonHref || "/contact")}
              onChange={(next) => onFieldChange("buttonHref", next)}
              placeholder="/contact"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2 border-t border-gray-100 pt-2.5">
            <ImageWithAltField
              label="Diverse Spaces Banner Image (Upload / URL)"
              image={String(section.image || "/newproject/pb.png")}
              alt={String(section.imageAlt || "Diverse Spaces lounge with city view")}
              onImageChange={(next) => onFieldChange("image", next)}
              onAltChange={(next) => onFieldChange("imageAlt", next)}
              altLabel="Image Alt Tag"
              altPlaceholder="e.g. Diverse Spaces lounge with city view"
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "projects-impact" || section.name === "Our Impact & Track Record") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Our Impact & Numbers That Reflect Trust</span>
          <span className="text-[10px] text-gray-500 font-normal">Headings (Stat counters are managed in the items list below)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Section Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Our Impact")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Our Impact"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Section Title</FieldLabel>
            <TextInput
              value={String(section.title || "Delivering Measurable Impact Across India")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Delivering Measurable Impact Across India"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <TextInput
              value={String(section.description || "Numbers that represent our commitment to quality execution and client partnerships.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="Numbers that represent our commitment..."
              hideLimit={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "projects-process" || section.name === "Our 4-Stage Process") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Our 4-Stage Process (From Concept to Completion)</span>
          <span className="text-[10px] text-gray-500 font-normal">Headings & Subtitle (Process steps are managed in the items list below)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Section Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Our Process")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Our Process"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Main Title</FieldLabel>
            <TextInput
              value={String(section.title || "From Concept to Completion")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="From Concept to Completion"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description / Subtitle</FieldLabel>
            <TextInput
              value={String(section.description || "A streamlined approach that ensures quality, efficiency and on-time delivery.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="A streamlined approach that ensures quality, efficiency and on-time delivery."
              hideLimit={true}
            />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === "projects-cta" || section.name === "Projects CTA Band") {
    return (
      <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
        <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
          <span>Have a Project in Mind? Collaboration CTA</span>
          <span className="text-[10px] text-gray-500 font-normal">Headings, CTA Button & Diagonal Lounge Photo</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <TextInput
              value={String(section.eyebrow || "Let's Work Together")}
              onChange={(next) => onFieldChange("eyebrow", next)}
              placeholder="Let's Work Together"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel required>Headline Title</FieldLabel>
            <TextInput
              value={String(section.title || "Have a Project in Mind?")}
              onChange={(next) => onFieldChange("title", next)}
              placeholder="Have a Project in Mind?"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Subtitle / Description</FieldLabel>
            <TextInput
              value={String(section.description || "Share your requirements with our team for a customized solution.")}
              onChange={(next) => onFieldChange("description", next)}
              placeholder="Share your requirements with our team..."
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Button Text</FieldLabel>
            <TextInput
              value={String(section.buttonLabel || "Enquire Now")}
              onChange={(next) => onFieldChange("buttonLabel", next)}
              placeholder="Enquire Now"
              hideLimit={true}
            />
          </div>
          <div>
            <FieldLabel>Button Link</FieldLabel>
            <TextInput
              value={String(section.buttonHref || "/contact")}
              onChange={(next) => onFieldChange("buttonHref", next)}
              placeholder="/contact"
              hideLimit={true}
            />
          </div>
          <div className="md:col-span-2 border-t border-gray-100 pt-2.5">
            <ImageWithAltField
              label="CTA Lounge Photo (Upload / URL)"
              image={String(section.image || "/newproject/p12.png")}
              alt={String(section.imageAlt || "Luxury city lounge consultation")}
              onImageChange={(next) => onFieldChange("image", next)}
              onAltChange={(next) => onFieldChange("imageAlt", next)}
              altLabel="Image Alt Tag"
              altPlaceholder="e.g. Luxury city lounge consultation"
            />
          </div>
        </div>
      </div>
    );
  }


  if (section.key === "footer" || section.name === "Footer & Contact Band" || section.name === "Footer & Social Links") {
    return (
      <div className="flex flex-col gap-4">
        {/* CTA BAND (Top Banner in Footer) */}
        <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
          <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
            <span>Call To Action (CTA) Collaboration Band</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <FieldLabel>CTA Eyebrow</FieldLabel>
              <TextInput
                value={String(section.ctaEyebrow || "")}
                onChange={(next) => onFieldChange("ctaEyebrow", next)}
                placeholder="LET'S COLLABORATE"
                hideLimit={true}
              />
            </div>
            <div>
              <FieldLabel>CTA Headline</FieldLabel>
              <TextInput
                value={String(section.ctaTitle || "")}
                onChange={(next) => onFieldChange("ctaTitle", next)}
                placeholder="READY TO BUILD YOUR NEXT BIG IDEA?"
                hideLimit={true}
              />
            </div>
            <div>
              <FieldLabel>CTA Button Label</FieldLabel>
              <TextInput
                value={String(section.ctaButtonLabel || "")}
                onChange={(next) => onFieldChange("ctaButtonLabel", next)}
                placeholder="SCHEDULE A CONSULTATION"
                hideLimit={true}
              />
            </div>
            <div>
              <FieldLabel>CTA Button Link</FieldLabel>
              <TextInput
                value={String(section.ctaButtonHref || "")}
                onChange={(next) => onFieldChange("ctaButtonHref", next)}
                placeholder="/contact"
                hideLimit={true}
              />
            </div>
            <div className="md:col-span-2">
              <ImageWithAltField
                label="CTA Banner Background Artwork"
                image={String(section.ctaBannerImage || "")}
                alt={String(section.ctaBannerImageAlt || section.ctaBannerAlt || "Design House India CTA Banner")}
                onImageChange={(next) => onFieldChange("ctaBannerImage", next)}
                onAltChange={(next) => {
                  onFieldChange("ctaBannerImageAlt", next);
                  onFieldChange("ctaBannerAlt", next);
                }}
                altLabel="Alt Tag"
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>CTA Description</FieldLabel>
              <RichTextEditor
                value={String(section.ctaDescription || "")}
                onChange={(next) => onFieldChange("ctaDescription", next)}
                minHeight="110px"
                placeholder="Connect with our turnkey interior, retail, and experiential design experts..."
              />
            </div>
          </div>
        </div>

        {/* MAIN FOOTER BRAND & DESCRIPTION */}
        <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
          <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center justify-between">
            <span>Footer Brand & Company Overview</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <ImageWithAltField
                label="Main Company Logo"
                image={String(section.logoImage || "")}
                alt={String(section.logoAlt || section.logoImageAlt || "Design House India Pvt Ltd Logo")}
                onImageChange={(next) => onFieldChange("logoImage", next)}
                onAltChange={(next) => {
                  onFieldChange("logoAlt", next);
                  onFieldChange("logoImageAlt", next);
                }}
                altLabel="Alt Tag"
              />
            </div>
            <div className="md:col-span-2">
              <ImageWithAltField
                label="Footer Background Texture"
                image={String(section.footBgImage || "")}
                alt={String(section.footBgImageAlt || section.footBgAlt || "Design House Footer Background Pattern")}
                onImageChange={(next) => onFieldChange("footBgImage", next)}
                onAltChange={(next) => {
                  onFieldChange("footBgImageAlt", next);
                  onFieldChange("footBgAlt", next);
                }}
                altLabel="Alt Tag"
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel required>Company Summary / About Description</FieldLabel>
              <RichTextEditor
                value={String(section.description || "")}
                onChange={(next) => onFieldChange("description", next)}
                minHeight="120px"
                placeholder="Design House India Private Limited is a premier design, fabrication..."
              />
            </div>
          </div>
        </div>

        {/* CONTACT INFORMATION */}
        <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
          <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center gap-2">
            <span>Get In Touch (Contact Information)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Phone Number</FieldLabel>
              <TextInput
                value={String(section.phoneNumber || "")}
                onChange={(next) => onFieldChange("phoneNumber", next)}
                placeholder="+91 96549 00525"
                hideLimit={true}
              />
            </div>
            <div>
              <FieldLabel>Alternative Phone / Helpline</FieldLabel>
              <TextInput
                value={String(section.altPhoneNumber || "")}
                onChange={(next) => onFieldChange("altPhoneNumber", next)}
                placeholder="+91 98183 53841"
                hideLimit={true}
              />
            </div>
            <div>
              <FieldLabel required>Contact Email</FieldLabel>
              <TextInput
                value={String(section.contactEmail || "")}
                onChange={(next) => onFieldChange("contactEmail", next)}
                placeholder="info@designhouse.co.in"
                hideLimit={true}
              />
            </div>
            <div>
              <FieldLabel required>Website URL</FieldLabel>
              <TextInput
                value={String(section.websiteUrl || "")}
                onChange={(next) => onFieldChange("websiteUrl", next)}
                placeholder="www.designhouse.co.in"
                hideLimit={true}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel required>Office & Works Address</FieldLabel>
              <TextInput
                value={String(section.contactAddress || "")}
                onChange={(next) => onFieldChange("contactAddress", next)}
                placeholder="12/29, Site-II, Loni Road Industrial Area, Mohan Nagar, Ghaziabad, UP – 201007"
                hideLimit={true}
              />
            </div>
          </div>
        </div>

        {/* SOCIAL MEDIA CHANNELS */}
        <div className="bg-white p-3 border border-[#e2e8f0] rounded-[6px] flex flex-col gap-3">
          <div className="text-[11px] font-bold text-[#1e40af] border-b border-gray-100 pb-1.5 flex items-center gap-2">
            <span>Connect With Us (Social Media Links)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <FieldLabel>Facebook URL</FieldLabel>
              <TextInput
                value={String(section.facebookUrl || "")}
                onChange={(next) => onFieldChange("facebookUrl", next)}
                placeholder="https://facebook.com/designhouseindia"
                hideLimit={true}
              />
            </div>
            <div>
              <FieldLabel>Instagram URL</FieldLabel>
              <TextInput
                value={String(section.instagramUrl || "")}
                onChange={(next) => onFieldChange("instagramUrl", next)}
                placeholder="https://instagram.com/designhouseindia"
                hideLimit={true}
              />
            </div>
            <div>
              <FieldLabel>Twitter / X URL</FieldLabel>
              <TextInput
                value={String(section.twitterUrl || "")}
                onChange={(next) => onFieldChange("twitterUrl", next)}
                placeholder="https://x.com/designhouseindia"
                hideLimit={true}
              />
            </div>
            <div>
              <FieldLabel>YouTube URL</FieldLabel>
              <TextInput
                value={String(section.youtubeUrl || "")}
                onChange={(next) => onFieldChange("youtubeUrl", next)}
                placeholder="https://youtube.com/@designhouseindia"
                hideLimit={true}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>LinkedIn URL</FieldLabel>
              <TextInput
                value={String(section.linkedinUrl || "")}
                onChange={(next) => onFieldChange("linkedinUrl", next)}
                placeholder="https://linkedin.com/company/designhouseindia"
                hideLimit={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  const entries = Object.entries(section).filter(
    ([key, value]) => {
      if (SECTION_SKIP_KEYS.has(key)) return false;
      if ((section.key === "audience-strip" || section.name === "AudienceStrip") && key === "title") return false;
      if (
        (section.key === "global-platform" || section.name === "GlobalPlatform") &&
        (key === "subtitle" || key === "title" || key === "image" || key === "imageAlt")
      ) {
        return false;
      }
      if (
        (section.key === "why-participate" || section.name === "WhyParticipate") &&
        (key === "subtitle" || key === "title")
      ) {
        return false;
      }
      if (
        (section.key === "conference-section" || section.name === "ConferenceSection") &&
        (key === "subtitle" || key === "title")
      ) {
        return false;
      }
      if (
        (section.key === "expo-categories" || section.name === "ExpoCategories") &&
        (key === "image" || key === "imageAlt" || key === "title" || key === "subtitle")
      ) {
        return false;
      }
      if (
        (section.key === "beyond-exhibition" || section.name === "BeyondExhibition") &&
        (key === "title" || key === "subtitle")
      ) {
        return false;
      }
      if (
        (section.key === "sponsors-attend" || section.name === "SponsorsAndAttend") &&
        (key === "title" || key === "subtitle" || key === "rightTitle" || key === "rightBottomText" || key === "centerText1" || key === "centerText2" || key === "centerText3")
      ) {
        return false;
      }
      if (
        section.key === "why-exhibit-hero" &&
        (key === "date" || key === "location")
      ) {
        return false;
      }
      if (
        (section.key === "industry-segments" || section.name === "IndustrySegments") &&
        (key === "description" || key === "shortDescription" || key === "buttonLabel" || key === "buttonHref")
      ) {
        return false;
      }
      if (
        (section.key === "why-visit-matters" || section.name === "WhyVisitMatters") &&
        key === "eyebrow"
      ) {
        return false;
      }
      if (
        (section.key === "testimonials-section" || section.name === "TestimonialsSection") &&
        (key === "subtitle" || key === "description" || key === "shortDescription")
      ) {
        return false;
      }
      if (
        (section.key === "awards-hero" || section.name === "Awards Hero Banner") &&
        key === "shortDescription"
      ) {
        return false;
      }
      if (
        (section.key === "awards-stats" || section.name === "Key Statistics Strip") &&
        (key === "eyebrow" || key === "title")
      ) {
        return false;
      }
      if (
        (section.key === "awards-about" || section.name === "About the Awards") &&
        (key === "image" || key === "imageAlt")
      ) {
        return false;
      }
      if (
        (section.key === "awards-categories" || section.name === "Award Sector Categories") &&
        (key === "description" || key === "shortDescription")
      ) {
        return false;
      }
      if (
        (section.key === "awards-grand-awards" || section.name === "Prestigious Grand Awards") &&
        (key === "description" || key === "shortDescription")
      ) {
        return false;
      }
      if (
        (section.key === "awards-process" || section.name === "Our Evaluation Process") &&
        (key === "description" || key === "shortDescription")
      ) {
        return false;
      }
      if (
        (section.key === "gallery-hero" || section.name === "HeroSection") &&
        (key === "shortDescription" || key === "rightImage")
      ) {
        return false;
      }
      if (
        (section.key === "about-hero" || section.name === "AboutHero") &&
        key === "secondaryImage"
      ) {
        return false;
      }
      if (
        (section.key === "home-about" || section.name === "HomeAbout (Who We Are)") &&
        key === "secondaryImage"
      ) {
        return false;
      }
      if (
        (section.key === "advisory-hero" || section.name === "AdvisoryHero") &&
        key === "secondaryImage"
      ) {
        return false;
      }
      if (
        (section.key === "msme-pms-banner" || section.name === "MsmePmsBanner") &&
        (key === "logoImage" || key === "secondaryImage")
      ) {
        return false;
      }
      if (/alt$/i.test(key)) {
        const baseKey = key.replace(/alt$/i, "");
        if (baseKey && (baseKey in section || `${baseKey}Image` in section)) {
          return false;
        }
        if (key === "imageAlt" && ("image" in section || "img" in section)) {
          return false;
        }
      }
      return typeof value === "string" || typeof value === "boolean";
    },
  );

  if (!entries.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-x-[16px] gap-y-[10px]">
      {entries.map(([key, value]) => {
        const isLong = LONG_TEXT_KEY_PATTERN.test(key) || key === "mapEmbedUrl";
        const isImage = IMAGE_KEY_PATTERN.test(key) && !/alt/i.test(key);
        const isVideo = VIDEO_KEY_PATTERN.test(key) && key !== "mapEmbedUrl";
        const isPdf =
          (section.key === "why-participate" && key === "secondaryButtonHref") ||
          /brochure|pdf/i.test(key) ||
          (typeof value === "string" && /\.pdf$/i.test(value));
        const isDate =
          section.key !== "awards-hero" &&
          section.key !== "awards-nomination-hero" &&
          section.key !== "msme-pms-banner" &&
          section.key !== "buyer-seller-meet" &&
          section.key !== "buyer-seller-meet-hero" &&
          section.key !== "exhibitors-hero" &&
          section.key !== "partnership-page-hero" &&
          section.key !== "sub-partnership-hero" &&
          key !== "timerTitle" &&
          /date|time/i.test(key) &&
          typeof value === "string";
        const fieldLimit = isLong ? 450 : 140;
        const label =
          (section.key === "about-hero" || section.name === "AboutHero") && key === "image"
            ? "Background Image (Upload)"
            : (section.key === "home-about" || section.name === "HomeAbout (Who We Are)") && key === "image"
              ? "Left Image (Upload)"
              : (section.key === "advisory-hero" || section.name === "AdvisoryHero") && key === "image"
                ? "Background Image (Upload)"
                : (section.key === "sponsorship-hero" || section.name === "Sponsorship Hero & Key Stats") && key === "image"
                  ? "Background Image (Upload)"
                  : (section.key === "msme-pms-banner" || section.name === "MsmePmsBanner") && key === "image"
                    ? "Background Image (Upload)"
                    : (section.key === "msme-pms-banner" || section.name === "MsmePmsBanner") && key === "imageAlt"
                      ? "Background Image Alt Text"
                      : (section.key === "career-hero" || section.key === "careers-hero" || section.key === "career-cta" || section.key === "careers-bottom-banner") && key === "image"
                        ? "Banner Artwork / Background Image (Upload)"
                      : (section.key === "career-hero" || section.key === "careers-hero" || section.key === "career-cta" || section.key === "careers-bottom-banner") && key === "imageAlt"
                        ? "Banner Image Alt Text"
                      : (section.key === "career-hero" || section.key === "careers-hero") && key === "title"
                        ? "H1 Title"
                      : (section.key === "career-hero" || section.key === "careers-hero") && key === "badgeText"
                        ? "Badge Text"
                      : (section.key === "current-openings" || section.key === "careers-openings") && key === "quote"
                        ? "Motivational Quote"
                      : (section.key === "current-openings" || section.key === "careers-openings") && key === "emptyTitle"
                        ? "No Openings: Title"
                      : (section.key === "current-openings" || section.key === "careers-openings") && key === "emptyDescription"
                        ? "No Openings: Description"
                      : (section.key === "current-openings" || section.key === "careers-openings") && key === "emptyNote"
                        ? "No Openings: Note"
                      : section.key === "introduction-section" && key === "title"
                        ? "H1 Title"
                      : (section.key === "about-hero" || section.key === "advisory-hero" || section.key === "exhibition-hero" || section.key === "why-exhibit-hero" || section.key === "nominate-hero" || section.key === "blog-hero" || section.key === "exhibitors-hero" || section.key === "why-visit-hero" || section.key === "sponsorship-hero" || section.key === "epromotion-hero" || section.key === "partnership-page-hero" || section.key === "sub-partnership-hero" || section.key === "contact-hero") && key === "title"
                        ? "H1 Title"
                      : section.key === "sub-partnership-hero" && key === "subtitle"
                        ? "Short Description (under H1)"
                      : section.key === "sub-partnership-hero" && key === "description"
                        ? "Description"
                      : section.key === "sub-partnership-hero" && key === "image"
                        ? "Background Image (Upload)"
                      : section.key === "sub-partnership-hero" && key === "imageAlt"
                        ? "Background Image Alt Text"
                      : section.key === "sub-partnership-hero" && key === "date"
                        ? "Event Date"
                      : section.key === "sub-partnership-hero" && key === "location"
                        ? "Event Location"
                      : section.key === "partnership-page-hero" && key === "image"
                        ? "Background Image (Upload)"
                      : section.key === "partnership-page-hero" && key === "imageAlt"
                        ? "Background Image Alt Text"
                      : section.key === "partnership-page-hero" && key === "date"
                        ? "Event Date"
                      : section.key === "partnership-page-hero" && key === "location"
                        ? "Event Location"
                      : section.key === "epromotion-hero" && key === "image"
                        ? "Background Image (Upload)"
                      : section.key === "epromotion-hero" && key === "imageAlt"
                        ? "Background Image Alt Text"
                      : section.key === "sponsorship-hero" && key === "imageAlt"
                        ? "Background Image Alt Text"
                      : section.key === "exhibitors-hero" && key === "image"
                        ? "Background Image (Upload)"
                      : section.key === "exhibitors-hero" && key === "imageAlt"
                        ? "Background Image Alt Text"
                      : section.key === "exhibitors-hero" && key === "date"
                        ? "Event Date"
                      : section.key === "exhibitors-hero" && key === "location"
                        ? "Event Location"
                      : section.key === "blog-hero" && key === "image"
                        ? "Background Image (Upload)"
                      : section.key === "blog-hero" && key === "imageAlt"
                        ? "Background Image Alt Text"
                      : section.key === "nominate-hero" && key === "image"
                        ? "Background Image (Upload)"
                      : section.key === "nominate-hero" && key === "imageAlt"
                        ? "Background Image Alt Text"
                      : section.key === "exhibition-hero" && key === "image"
                        ? "Background Image (Upload)"
                      : section.key === "awards-hero" && key === "title"
                        ? "H1 Title"
                      : section.key === "awards-hero" && key === "image"
                        ? "Background Image (Upload)"
                      : section.key === "awards-hero" && key === "imageAlt"
                        ? "Background Image Alt Text"
                      : section.key === "awards-nomination-hero" && key === "title"
                        ? "H1 Title"
                      : section.key === "awards-nomination-hero" && key === "image"
                        ? "Background Image (Upload)"
                      : section.key === "awards-nomination-hero" && key === "imageAlt"
                        ? "Background Image Alt Text"
                      : section.key === "buyer-seller-meet-hero" && key === "title"
                        ? "H1 Title"
                      : section.key === "buyer-seller-meet-hero" && key === "image"
                        ? "Background Image (Upload)"
                      : section.key === "buyer-seller-meet-hero" && key === "imageAlt"
                        ? "Background Image Alt Text"
                      : section.key === "buyer-seller-meet-hero" && key === "date"
                        ? "Event Date"
                      : section.key === "buyer-seller-meet-hero" && key === "location"
                        ? "Event Location"
                      : section.key === "msme-director-message" && key === "videoUrl"
                        ? "Video (Upload / YouTube Link / Instagram Link)"
                      : section.key === "msme-director-message" && key === "thumbnailImage"
                        ? "Video Thumbnail (Custom Cover Image - optional)"
                      : section.key === "msme-director-message" && key === "thumbnailAlt"
                        ? "Video Thumbnail Alt Text"
                      : section.key === "terms-page-hero" && key === "image"
                        ? "Background Image (Upload)"
                        : section.key === "terms-page-hero" && key === "imageAlt"
                          ? "Background Image Alt Text"
                          : humanizeKey(key);

        const isRich = RICH_TEXT_KEY_PATTERN.test(key);

        return (
          <div
            key={key}
            className={isRich || isLong || isImage || isVideo || isPdf || typeof value === "boolean" || /^keyPoint/i.test(key) || /alt/i.test(key) ? "col-span-2" : ""}
          >
            <FieldLabel>{label}</FieldLabel>

            {typeof value === "boolean" ? (
              <Toggle checked={value} onChange={(next: boolean) => onFieldChange(key, next)} />
            ) : isVideo ? (
              <VideoUploadField
                value={String(value)}
                onChange={(next: string) => onFieldChange(key, next)}
              />
            ) : isImage ? (
              <ImageWithAltField
                image={String(value)}
                alt={String(
                  section[`${key}Alt`] ??
                    (key === "image" ? (section.imageAlt ?? section.alt ?? "") : (section[`${key}Alt`] ?? ""))
                )}
                onImageChange={(next: string) => onFieldChange(key, next)}
                onAltChange={(next: string) => {
                  onFieldChange(`${key}Alt`, next);
                  if (key === "image" || key === "img") {
                    onFieldChange("imageAlt", next);
                    onFieldChange("alt", next);
                  }
                }}
                altLabel="Alt Tag"
                altPlaceholder={`e.g. ${section.title || section.name || "Design House"} ${label}`}
              />
            ) : isPdf ? (
              <PdfUploadField
                value={String(value)}
                onChange={(next: string) => onFieldChange(key, next)}
              />
            ) : isDate ? (
              <div className="flex items-center gap-2">
                <input
                  type="datetime-local"
                  value={
                    String(value).includes("T")
                      ? String(value).slice(0, 16)
                      : String(value)
                  }
                  onChange={(e) => onFieldChange(key, e.target.value)}
                  className="h-[34px] rounded border border-[#cbd5e1] px-2.5 text-[12px] bg-white text-[#1e293b] focus:border-[#0f766e] focus:outline-none"
                />
                <span className="text-[10px] text-[#64748b]">Select date and time for live countdown timer</span>
              </div>
            ) : isRich ? (
              <RichTextEditor
                value={String(value || "")}
                onChange={(next: string) => onFieldChange(key, next)}
                minHeight="130px"
                placeholder={`Enter ${label.toLowerCase()}...`}
              />
            ) : isLong ? (
              <>
                <Textarea
                  value={String(value)}
                  onChange={(next: string) => onFieldChange(key, next)}
                  rows={key === "mapEmbedUrl" ? 2 : 3}
                  noLimit={section.key === "why-visit-matters" || key === "mapEmbedUrl"}
                />
                {key === "mapEmbedUrl" && (
                  <p className="mt-1 text-[9px] text-[#64748b]">
                    Google Maps → Share → Embed a map → paste the full &lt;iframe&gt; code or just the src link here.
                  </p>
                )}
              </>
            ) : (
              <TextInput
                value={String(value)}
                onChange={(next: string) => onFieldChange(key, next)}
                maxLength={section.key === "why-visit-matters" ? 5000 : 120}
                hideLimit={section.key === "why-visit-matters"}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
