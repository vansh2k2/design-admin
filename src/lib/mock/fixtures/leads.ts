import type { AdvisoryNomination } from "@/lib/advisoryNominationsApi";
import type { BuyerEnquiry } from "@/lib/buyerEnquiryApi";
import type { ContactEnquiry } from "@/lib/contactEnquiryApi";
import type { ExhibitorRegistration } from "@/lib/exhibitorRegistrationApi";
import type { WebsiteFeedback } from "@/lib/feedbackApi";
import type { AwardNomination } from "@/lib/nominationsApi";
import type { PartnershipEnquiry } from "@/lib/partnershipEnquiryApi";
import type { Enquiry, NewsletterSubscriber } from "@/lib/types";
import type { VisitorRegistration } from "@/lib/visitorRegistrationApi";

import { CITIES, CONTACTS, EVENTS, SERVICES, STAFF, daysAgo, pick } from "./common";

/* Website forms and registrations — fictional Design House prospects */

const MESSAGES: Record<string, string> = {
  "Retail Interior": "We are planning a new flagship store of about 2,200 sq ft and need complete design and turnkey execution.",
  "Corporate Interior": "Our team is moving to a 12,000 sq ft office. Looking for space planning, workstations and a full fit-out.",
  "Restaurant Interior": "We want to redesign our 90-seat restaurant with a new bar counter and better kitchen flow.",
  "Shop in Shop": "Need shop-in-shop counters for 25 department stores with our brand guidelines.",
  "Retail Display Merchandising": "Looking for gondola racks, wall bays and window displays for 10 stores.",
  "Retail Kiosk": "Need a 10×8 ft mall kiosk for our accessories brand at DLF Mall of India.",
  "Exhibitions & Events": "Require a custom 54 sqm stall design and fabrication for an upcoming trade fair at Pragati Maidan.",
  "Branding & Signage": "Need ACP signage with LED letters for our showroom facade and in-store wayfinding.",
  "Office Interior": "Looking for MD cabin and conference room interiors with modular furniture.",
  "Modular Furniture": "Need modular kitchen and wardrobes for 40 apartments in our residential project.",
};

const messageFor = (service: string) => MESSAGES[service] ?? "Please share your company profile and a quotation.";

// ---- General enquiries (/enquiries/admin): contact + partner (csr) + partnership categories ----
export const ENQUIRIES: Enquiry[] = Array.from({ length: 22 }, (_, i) => {
  const c = pick(CONTACTS, i);
  const category: Enquiry["category"] = i % 5 === 3 ? "csr" : i % 7 === 5 ? "partnership" : "contact";
  const service = pick(SERVICES, i);
  return {
    _id: `enq-${i + 1}`,
    name: c.name,
    phone: c.phone,
    email: c.email,
    message:
      category === "csr"
        ? "We would like to co-brand our store-launch campaign with Design House and sponsor your design-awareness event."
        : category === "partnership"
          ? "We manufacture LED lighting and acrylic displays and would like to become an empanelled vendor."
          : messageFor(service),
    category,
    organization: c.company,
    designation: c.designation,
    interest: category === "csr" ? "Brand Sponsorship" : category === "partnership" ? "Vendor Empanelment" : service,
    city: c.city,
    status: (["new", "contacted", "new", "closed"] as const)[i % 4],
    createdAt: daysAgo(Math.floor(i * 1.3), 9 + (i % 8), (i * 11) % 60),
  };
});

// ---- Contact Us messages (/contact-enquiry) ----
export const CONTACT_ENQUIRIES: ContactEnquiry[] = Array.from({ length: 26 }, (_, i) => {
  const c = pick(CONTACTS, i + 2);
  const service = pick(SERVICES, i + 1);
  const created = daysAgo(Math.floor(i * 0.9), 10 + (i % 8), (i * 7) % 60);
  return {
    _id: `ce-${i + 1}`,
    name: c.name,
    email: c.email,
    phone: c.phone.replace("+91 ", "").replace(/\s/g, ""),
    service,
    location: c.city,
    message: messageFor(service),
    status: (["pending", "contacted", "pending", "resolved", "contacted"] as const)[i % 5],
    createdAt: created,
    updatedAt: created,
  };
});

// ---- Buyer enquiries: bulk display, fixture and kiosk orders ----
const BUYER_TYPES = ["Retail Chain", "Franchise Owner", "Distributor", "Brand Marketing Team", "Mall Developer"];
const BUYER_ABOUT = ["Retail display fixtures", "Mall kiosks", "Shop-in-shop counters", "Acrylic display stands", "Gondola racks", "Window display props"];
export const BUYER_ENQUIRIES: BuyerEnquiry[] = Array.from({ length: 14 }, (_, i) => {
  const c = pick(CONTACTS, i + 5);
  const created = daysAgo(i, 11 + (i % 6), (i * 9) % 60);
  const about = pick(BUYER_ABOUT, i);
  return {
    _id: `be-${i + 1}`,
    name: c.name,
    company: c.company,
    phone: c.phone.replace("+91 ", "").replace(/\s/g, ""),
    email: c.email,
    city: c.city,
    country: i % 6 === 4 ? "United Arab Emirates" : "India",
    buyerType: pick(BUYER_TYPES, i),
    enquiryAbout: about,
    message: `Looking for a quote on ${about.toLowerCase()} for ${8 + (i % 5) * 4} stores. Please share catalogue and lead time.`,
    status: (["pending", "contacted", "resolved"] as const)[i % 3],
    createdAt: created,
    updatedAt: created,
  };
});

// ---- Partnership enquiries: vendors, architects and channel partners ----
const PARTNER_CATEGORIES = ["Fabrication Vendor", "Lighting Supplier", "Architect / Consultant", "Channel Partner", "Signage Manufacturer", "Logistics Partner"];
const PARTNER_ORGS = ["Lumina LED Systems", "Acrylix Fabricators", "Studio Arc Architects", "Northline Interiors (Channel Partner)", "Brightway Signages", "SwiftMove Logistics", "Plyco Boards Pvt. Ltd.", "Metalcraft Engineering"];
export const PARTNERSHIP_ENQUIRIES: PartnershipEnquiry[] = Array.from({ length: 10 }, (_, i) => {
  const c = pick(CONTACTS, i + 8);
  const created = daysAgo(i * 2, 12, (i * 13) % 60);
  return {
    _id: `pe-${i + 1}`,
    name: c.name,
    organization: pick(PARTNER_ORGS, i),
    email: c.email,
    phone: c.phone.replace("+91 ", "").replace(/\s/g, ""),
    category: pick(PARTNER_CATEGORIES, i),
    message: "We would like to partner with Design House on upcoming retail and exhibition projects. Company profile attached.",
    status: (["pending", "contacted", "resolved", "pending"] as const)[i % 4],
    createdAt: created,
    updatedAt: created,
  };
});

// ---- Website feedback from clients after handover ----
const FEEDBACK_NOTES = [
  "The site team was disciplined and the store opened two days ahead of schedule.",
  "Excellent finishing on the display fixtures; our footfall improved after the revamp.",
  "Stall looked premium and got lots of attention at the fair.",
  "Very responsive project manager, clear daily updates.",
  "Good design options; would like faster 3D revisions next time.",
];
export const FEEDBACK: WebsiteFeedback[] = Array.from({ length: 10 }, (_, i) => {
  const c = pick(CONTACTS, i + 3);
  const created = daysAgo(i * 3, 15, (i * 5) % 60);
  const overall = 5 - (i % 3 === 2 ? 1 : 0);
  return {
    _id: `fb-${i + 1}`,
    role: pick(["Client", "Client", "Franchise Owner", "Brand Manager"], i),
    name: c.name,
    company: c.company,
    designation: c.designation,
    phone: c.phone.replace("+91 ", "").replace(/\s/g, ""),
    email: c.email,
    edition: pick(SERVICES, i + 2),
    ratings: { overall, networking: 4 + (i % 2), quality: overall, management: 4 + ((i + 1) % 2) },
    valuable: pick(FEEDBACK_NOTES, i),
    improve: i % 3 === 0 ? "Share a detailed handover checklist at the end of the project." : undefined,
    consentToFeature: i % 2 === 0,
    wantsContact: i % 4 === 1,
    status: (["new", "reviewed", "contacted"] as const)[i % 3],
    createdAt: created,
    updatedAt: created,
  };
});

export const NEWSLETTER: NewsletterSubscriber[] = Array.from({ length: 24 }, (_, i) => {
  const c = pick(CONTACTS, i);
  return { _id: `nl-${i + 1}`, email: i < CONTACTS.length ? c.email : `subscriber${i + 1}@gmail.com`, source: pick(["Website Footer", "Blog Page", "Contact Page", "Career Page"], i), createdAt: daysAgo(i * 2, 10 + (i % 9)) };
});

// ---- Book a Stand: exhibition stall design & fabrication bookings ----
const STALL_TYPES = ["Bare Space — Custom Stall", "Island Stall", "Corner Stall", "Double-Decker Stall"];
const INTERNATIONAL = [
  { company: "Gulf Retail Fixtures LLC", city: "Dubai", country: "United Arab Emirates", name: "Faisal Rahman" },
  { company: "Lanka Home Decor (Pvt) Ltd", city: "Colombo", country: "Sri Lanka", name: "Nuwan Perera" },
  { company: "Himalaya Crafts Export", city: "Kathmandu", country: "Nepal", name: "Sujan Shrestha" },
  { company: "Singapura Lifestyle Pte Ltd", city: "Singapore", country: "Singapore", name: "Melissa Tan" },
];
export const EXHIBITOR_REGISTRATIONS: ExhibitorRegistration[] = [
  ...Array.from({ length: 12 }, (_, i): ExhibitorRegistration => {
    const c = pick(CONTACTS, i + 1);
    const area = [36, 54, 72, 18, 48, 96][i % 6] ?? 36;
    const rate = 9500;
    const net = Math.round(area * rate * 1.18);
    const paid = i % 3 === 0 ? net : i % 3 === 1 ? Math.round(net * 0.5) : 0;
    const created = daysAgo(i * 2, 11, (i * 9) % 60);
    const [first = c.name, ...rest] = c.name.split(" ");
    return {
      _id: `ex-${i + 1}`,
      registrationNo: `DH-STL-2026-${String(101 + i).padStart(4, "0")}`,
      category: "domestic",
      eventName: pick(EVENTS, i),
      exhibitorName: c.company,
      fasciaName: c.company.replace(/ Pvt\. Ltd\.| Ltd\./, "").toUpperCase(),
      typeOfBusiness: "Private Limited Company",
      natureOfBusiness: "Manufacturer / Brand",
      industrySector: pick(["Home Decor", "Food & Beverages", "Consumer Electronics", "Fashion & Lifestyle", "Automotive"], i),
      website: `https://www.${c.email.split("@")[1]}`,
      address: `${12 + i}, Industrial Area Phase ${1 + (i % 3)}`,
      country: "India",
      state: pick(["Delhi", "Haryana", "Maharashtra", "Uttar Pradesh", "Karnataka"], i),
      city: c.city,
      pincode: `1100${10 + i}`,
      gstNo: `07AABCD${1200 + i}F1Z${i % 9}`,
      contact1: { title: "Mr./Ms.", firstName: first, lastName: rest.join(" "), email: c.email, designation: c.designation, mobile: c.phone },
      stallNumber: `H${1 + (i % 5)}-${String.fromCharCode(65 + (i % 6))}${10 + i}`,
      hall: `Hall ${1 + (i % 5)}`,
      stallType: pick(STALL_TYPES, i),
      stallArea: area,
      plScheme: "Design + Fabrication + Installation",
      currency: "INR",
      ratePerSqm: rate,
      paymentPlanLabel: i % 3 === 1 ? "50% advance, 50% before installation" : "100% advance",
      netPayable: net,
      amountDueNow: net - paid,
      amountPaid: paid,
      balanceAmount: net - paid,
      paymentStatus: paid >= net ? "paid" : paid > 0 ? "pending" : "pending",
      paidAt: paid ? created : undefined,
      status: paid >= net ? "confirmed" : i % 7 === 6 ? "cancelled" : "pending",
      statusUpdatedBy: paid ? pick(STAFF, i).name : undefined,
      statusUpdatedAt: paid ? created : undefined,
      details: { designBrief: "Open stall with product display wall, meeting counter and storage.", graphics: "Client to share artwork 10 days before the fair." },
      createdAt: created,
      updatedAt: created,
    };
  }),
  ...INTERNATIONAL.map((intl, i): ExhibitorRegistration => {
    const area = [36, 54, 27, 72][i] ?? 36;
    const net = Math.round(area * 130);
    const created = daysAgo(i * 4 + 1, 14);
    const [first = intl.name, ...rest] = intl.name.split(" ");
    return {
      _id: `exi-${i + 1}`,
      registrationNo: `DH-STL-INT-2026-${String(11 + i).padStart(3, "0")}`,
      category: "international",
      eventName: pick(EVENTS, i + 1),
      exhibitorName: intl.company,
      fasciaName: intl.company.toUpperCase(),
      typeOfBusiness: "Company",
      natureOfBusiness: "Importer / Brand",
      industrySector: pick(["Home Decor", "Handicrafts", "Lifestyle"], i),
      address: `${100 + i} Trade Centre Road`,
      country: intl.country,
      city: intl.city,
      contact1: { firstName: first, lastName: rest.join(" "), email: `${first.toLowerCase()}@${intl.company.split(" ")[0]!.toLowerCase()}.com`, designation: "Director", mobile: "+971 50 123 45" + (60 + i) },
      stallNumber: `H${2 + i}-INT${20 + i}`,
      hall: `Hall ${2 + i}`,
      stallType: pick(STALL_TYPES, i + 1),
      stallArea: area,
      plScheme: "Design + Fabrication + Installation",
      currency: "USD",
      ratePerSqm: 130,
      netPayable: net,
      amountDueNow: i === 0 ? 0 : net,
      amountPaid: i === 0 ? net : 0,
      balanceAmount: i === 0 ? 0 : net,
      paymentStatus: i === 0 ? "paid" : "pending",
      status: i === 0 ? "confirmed" : "pending",
      createdAt: created,
      updatedAt: created,
    };
  }),
];

// ---- Visitor registrations: Experience Centre open house ----
const VISIT_EVENT = "Design House Experience Centre — Open House 2026";
export const VISITOR_REGISTRATIONS: VisitorRegistration[] = [
  ...Array.from({ length: 12 }, (_, i): VisitorRegistration => {
    const c = pick(CONTACTS, i + 4);
    const [first = c.name, ...rest] = c.name.split(" ");
    const created = daysAgo(i, 10 + (i % 7));
    return {
      _id: `vr-${i + 1}`,
      registrationNo: `DH-VIS-2026-${String(201 + i).padStart(4, "0")}`,
      category: "domestic",
      subType: i % 3 === 0 ? "general" : "corporate",
      eventName: VISIT_EVENT,
      name: c.name,
      email: c.email,
      mobile: c.phone,
      companyName: c.company,
      designation: c.designation,
      country: "India",
      state: "Delhi",
      city: c.city,
      nationality: "Indian",
      persons: [{ firstName: first, lastName: rest.join(" "), designation: c.designation, email: c.email, mobile: c.phone }],
      status: (["confirmed", "pending", "confirmed", "cancelled"] as const)[i % 4],
      createdAt: created,
      updatedAt: created,
    };
  }),
  ...INTERNATIONAL.map((intl, i): VisitorRegistration => {
    const [first = intl.name, ...rest] = intl.name.split(" ");
    const created = daysAgo(i * 3 + 2, 13);
    return {
      _id: `vri-${i + 1}`,
      registrationNo: `DH-VIS-INT-2026-${String(31 + i).padStart(3, "0")}`,
      category: "international",
      subType: "corporate",
      eventName: VISIT_EVENT,
      name: intl.name,
      email: `${first.toLowerCase()}@${intl.company.split(" ")[0]!.toLowerCase()}.com`,
      mobile: "+971 50 987 65" + (40 + i),
      companyName: intl.company,
      designation: "Director",
      country: intl.country,
      city: intl.city,
      nationality: intl.country,
      persons: [{ firstName: first, lastName: rest.join(" "), designation: "Director" }],
      status: i % 2 ? "pending" : "confirmed",
      createdAt: created,
      updatedAt: created,
    };
  }),
  ...Array.from({ length: 5 }, (_, i): VisitorRegistration => {
    const c = pick(CONTACTS, i + 9);
    const created = daysAgo(i * 2 + 1, 12);
    const team = Array.from({ length: 3 + (i % 3) }, (_, n) => ({ firstName: ["Rakesh", "Sunita", "Imran", "Divya", "Gaurav"][n] ?? "Guest", lastName: ["Kumar", "Rao", "Khan", "Menon", "Bhatia"][n] ?? "", designation: n === 0 ? c.designation : "Team Member" }));
    return {
      _id: `vrg-${i + 1}`,
      registrationNo: `DH-GRP-2026-${String(51 + i).padStart(3, "0")}`,
      category: "group",
      subType: "corporate",
      eventName: VISIT_EVENT,
      name: c.name,
      email: c.email,
      mobile: c.phone,
      companyName: c.company,
      designation: c.designation,
      country: "India",
      city: c.city,
      persons: team,
      status: i % 3 === 2 ? "pending" : "confirmed",
      createdAt: created,
      updatedAt: created,
    };
  }),
];

// ---- Advisory panel nominations ----
const EXPERTS = [
  { name: "Ar. Meenakshi Rao", designation: "Principal Architect", organisation: "Rao & Associates", industry: "Architecture", expertise: "Retail store planning" },
  { name: "Sandeep Bhalla", designation: "VP — Retail Expansion", organisation: "StyleMart India", industry: "Retail", expertise: "Multi-city store rollouts" },
  { name: "Farah Siddiqui", designation: "Visual Merchandising Head", organisation: "Luxe Lifestyle Brands", industry: "Fashion Retail", expertise: "Visual merchandising" },
  { name: "Prof. Alok Dixit", designation: "Dean, School of Design", organisation: "National Design Institute", industry: "Education", expertise: "Sustainable materials" },
  { name: "Gaurav Sethi", designation: "Founder", organisation: "Expo Matrix Events", industry: "Events & Exhibitions", expertise: "Trade fair experiences" },
];
export const ADVISORY_NOMINATIONS: AdvisoryNomination[] = EXPERTS.map((expert, i) => {
  const nominator = pick(CONTACTS, i + 6);
  const created = daysAgo(i * 4 + 2, 12);
  return {
    _id: `adv-${i + 1}`,
    nominee: { name: expert.name, designation: expert.designation, organisation: expert.organisation, email: `${expert.name.split(" ").slice(-1)[0]!.toLowerCase()}@example.com`, phone: "+91 98100 4" + String(1000 + i * 37).slice(0, 4), industry: expert.industry, linkedin: "https://www.linkedin.com/" },
    expertiseArea: expert.expertise,
    achievements: "20+ years of experience; led award-winning retail and workplace projects across India.",
    reason: "Brings strong industry insight that can guide Design House's design standards and client experience.",
    nominator: { name: nominator.name, designation: nominator.designation, organisation: nominator.company, email: nominator.email, phone: nominator.phone },
    relationship: "Industry colleague",
    selfNomination: i === 3,
    additionalInfo: "",
    declaration: true,
    eventName: "Design House Advisory Panel 2026",
    status: (["pending", "shortlisted", "approved", "pending", "rejected"] as const)[i % 5],
    adminNote: i === 1 ? "Schedule an introductory call with the MD." : "",
    createdAt: created,
    updatedAt: created,
  };
});

// ---- Design excellence award nominations (projects nominated by clients) ----
const AWARD_CATEGORIES = ["Best Retail Store Design", "Best Corporate Workspace", "Best Exhibition Stall", "Best Restaurant Interior", "Best Retail Kiosk"];
export const AWARD_NOMINATIONS: AwardNomination[] = Array.from({ length: 8 }, (_, i) => {
  const c = pick(CONTACTS, i);
  const created = daysAgo(i * 3 + 1, 16);
  return {
    _id: `awd-${i + 1}`,
    applicantType: i % 2 ? "Brand" : "Company",
    orgName: c.company,
    contactPerson: c.name,
    designation: c.designation,
    mobile: c.phone,
    email: c.email,
    website: `https://www.${c.email.split("@")[1]}`,
    city: c.city,
    stateCountry: "India",
    awardCategory: pick(AWARD_CATEGORIES, i),
    briefProfile: `${c.company} worked with Design House on a ${pick(SERVICES, i).toLowerCase()} project completed this year.`,
    yearsExperience: `${5 + i}`,
    teamSize: `${20 + i * 15}`,
    keyServices: pick(SERVICES, i),
    keyAchievements: "Opened on schedule; 18% higher footfall in the first quarter.",
    uniqueContribution: "Modular fixtures that can be reused across new stores.",
    impactCreated: "Consistent brand experience across locations.",
    innovation: "Energy-efficient lighting and recycled materials.",
    whyDeserve: "A great example of design that improved business results.",
    deckFile: "",
    certFile: "",
    mediaFile: "",
    deckFileName: "project-presentation.pdf",
    certFileName: "",
    mediaFileName: "",
    socialLink: "",
    declaration: true,
    mobileVerified: true,
    emailVerified: i % 3 !== 2,
    status: (["pending", "shortlisted", "approved", "rejected"] as const)[i % 4],
    createdAt: created,
    updatedAt: created,
  };
});

export const LEAD_CITIES = CITIES;
