import type { PartnersAndBrandsData, PartnerLogoItem } from "@/lib/trustedLeadersApi";

import { CLIENT_BRANDS } from "./clients";
import { CITIES, STAFF, daysAgo, pick } from "./common";

/* Website content managed from the admin: media library, videos, logos, team and testimonials */

const project = (file: string) => `/images/dh/projects/${file}`;

const stamp = (days: number) => {
  const d = new Date(daysAgo(days, 11, 30));
  return {
    date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    updatedAt: d.toISOString(),
  };
};

// ---- Media Library (website gallery) ----
export const GALLERY_CATEGORIES = [
  "Retail Interior",
  "Corporate Interior",
  "Restaurant Interior",
  "Retail Display",
  "Exhibitions & Events",
  "Residential & Furniture",
  "Our Team",
];

export const GALLERY_YEARS = ["2026", "2025", "2024", "2023", "2022"];

const GALLERY: { title: string; file: string; category: string; year: string; size: string }[] = [
  { title: "Fashion flagship store — Gurugram", file: "retail-fashion-store.jpg", category: "Retail Interior", year: "2026", size: "412 KB" },
  { title: "Footwear brand store — Select Citywalk", file: "retail-footwear-store.jpg", category: "Retail Interior", year: "2026", size: "388 KB" },
  { title: "Luxury accessories display wall", file: "retail-luxury-display.jpg", category: "Retail Display", year: "2025", size: "356 KB" },
  { title: "Wooden shelving — lifestyle store", file: "retail-wooden-shelving.jpg", category: "Retail Interior", year: "2025", size: "401 KB" },
  { title: "Brand store facade & signage", file: "brand-store-facade.webp", category: "Retail Display", year: "2026", size: "214 KB" },
  { title: "Gondola racks — beauty retail", file: "retail-display-gondolas.jpg", category: "Retail Display", year: "2025", size: "367 KB" },
  { title: "Open-plan office — Noida", file: "corporate-office-open-plan.jpg", category: "Corporate Interior", year: "2026", size: "445 KB" },
  { title: "Reception lounge — corporate HQ", file: "corporate-office-lounge.jpg", category: "Corporate Interior", year: "2026", size: "398 KB" },
  { title: "Workstations — IT company, Pune", file: "office-workstations.jpg", category: "Corporate Interior", year: "2025", size: "377 KB" },
  { title: "MD cabin — executive suite", file: "md-cabin-executive.jpg", category: "Corporate Interior", year: "2024", size: "352 KB" },
  { title: "Breakout lounge seating", file: "office-lounge-seating.webp", category: "Corporate Interior", year: "2025", size: "198 KB" },
  { title: "Fine-dining restaurant — Connaught Place", file: "restaurant-dining-hall.jpg", category: "Restaurant Interior", year: "2026", size: "433 KB" },
  { title: "Warm-lit family restaurant", file: "restaurant-warm-interior.webp", category: "Restaurant Interior", year: "2025", size: "221 KB" },
  { title: "Custom stall — IHGF Delhi Fair", file: "exhibition-stall-custom.png", category: "Exhibitions & Events", year: "2026", size: "1.2 MB" },
  { title: "Island stall — wellness expo", file: "exhibition-stall-island.png", category: "Exhibitions & Events", year: "2025", size: "1.4 MB" },
  { title: "Exhibition hall booths", file: "exhibition-hall.png", category: "Exhibitions & Events", year: "2025", size: "1.1 MB" },
  { title: "Outdoor pavilion structure", file: "exhibition-pavilion.webp", category: "Exhibitions & Events", year: "2024", size: "264 KB" },
  { title: "Trade fair visitors", file: "exhibition-visitors.webp", category: "Exhibitions & Events", year: "2024", size: "301 KB" },
  { title: "Modular kitchen — white finish", file: "modular-kitchen-white.jpg", category: "Residential & Furniture", year: "2026", size: "318 KB" },
  { title: "Modular kitchen — grey matte", file: "modular-kitchen-grey.jpg", category: "Residential & Furniture", year: "2025", size: "296 KB" },
  { title: "TV unit with backlit panels", file: "tv-unit-living.webp", category: "Residential & Furniture", year: "2025", size: "187 KB" },
  { title: "Dressing table unit", file: "dressing-table-unit.webp", category: "Residential & Furniture", year: "2024", size: "176 KB" },
  { title: "Living room — villa project", file: "residential-living-room.jpg", category: "Residential & Furniture", year: "2024", size: "341 KB" },
  { title: "Design team at work", file: "team-designer.webp", category: "Our Team", year: "2026", size: "143 KB" },
  { title: "3D visualisation desk", file: "team-3d-modelling.webp", category: "Our Team", year: "2026", size: "152 KB" },
  { title: "Site drawings review", file: "team-review.webp", category: "Our Team", year: "2025", size: "161 KB" },
];

export const GALLERY_ITEMS = GALLERY.map((item, index) => {
  const when = stamp(index);
  return {
    _id: `gal-${index + 1}`,
    order: GALLERY.length - index,
    title: item.title,
    imageAlt: `${item.title} by Design House`,
    year: item.year,
    category: item.category,
    size: item.size,
    uploadedBy: pick(STAFF, index + 8).name,
    date: when.date,
    time: when.time,
    status: index % 9 === 8 ? "Draft" : "Published",
    image: project(item.file),
  };
});

// ---- Video highlights ----
const VIDEO_ID = "y_iRs4lFkUg"; // company video saved on the website's About page
export const VIDEO_ITEMS = [
  { title: "Design House — company walkthrough", category: "Company", thumbnail: project("corporate-office-lounge.jpg") },
  { title: "Retail store rollout — time-lapse", category: "Retail Interior", thumbnail: project("retail-fashion-store.jpg") },
  { title: "Exhibition stall build at Pragati Maidan", category: "Exhibitions & Events", thumbnail: project("exhibition-stall-custom.png") },
  { title: "Corporate office handover — client walkthrough", category: "Corporate Interior", thumbnail: project("corporate-office-open-plan.jpg") },
  { title: "Restaurant interior reveal", category: "Restaurant Interior", thumbnail: project("restaurant-dining-hall.jpg") },
  { title: "Inside our manufacturing unit", category: "Company", thumbnail: project("team-review.webp") },
].map((video, index) => {
  const when = stamp(index * 5);
  return {
    _id: `vid-${index + 1}`,
    ...video,
    videoType: "youtube",
    videoUrl: `https://www.youtube.com/watch?v=${VIDEO_ID}`,
    order: index + 1,
    status: index === 5 ? "Draft" : "Published",
    uploadedBy: "Karan Mehta",
    date: when.date,
    time: when.time,
  };
});

// ---- Exhibitor List: brands whose exhibition stalls Design House designed ----
export const EXHIBITOR_LIST_HEADER = { title: "Brands We Have Built Stalls For", subtitle: "Exhibition stalls designed and fabricated by Design House at leading trade fairs." };

const EXHIBITOR_CATEGORY: Record<string, string> = {
  Restaurants: "FOOD & BEVERAGE", Cafe: "FOOD & BEVERAGE", QSR: "FOOD & BEVERAGE", Food: "FOOD & BEVERAGE", Beverages: "FOOD & BEVERAGE", FMCG: "FOOD & BEVERAGE",
  Fashion: "RETAIL & FASHION", "Fashion Accessories": "RETAIL & FASHION", "Fashion Retail": "RETAIL & FASHION", Sportswear: "RETAIL & FASHION", Footwear: "RETAIL & FASHION", Kidswear: "RETAIL & FASHION",
  Beauty: "BEAUTY & PERSONAL CARE", "Personal Care": "BEAUTY & PERSONAL CARE", Salon: "BEAUTY & PERSONAL CARE", Wellness: "BEAUTY & PERSONAL CARE",
  "Consumer Electronics": "CONSUMER ELECTRONICS", Technology: "CONSUMER ELECTRONICS", Audio: "CONSUMER ELECTRONICS", Imaging: "CONSUMER ELECTRONICS", "Consumer Durables": "CONSUMER ELECTRONICS",
  "Home Furnishing": "HOME & LIFESTYLE", Furniture: "HOME & LIFESTYLE", Lifestyle: "HOME & LIFESTYLE", "Home Improvement": "HOME & LIFESTYLE",
};

export const EXHIBITOR_LIST_ITEMS = CLIENT_BRANDS.slice(0, 32).map((brand, index) => ({
  _id: `exl-${index + 1}`,
  name: brand.name,
  category: EXHIBITOR_CATEGORY[brand.sector] ?? "OTHERS",
  location: pick(CITIES, index),
  order: index + 1,
  logo: brand.logo,
  altText: `${brand.name} logo`,
  websiteUrl: "",
  status: index % 11 === 10 ? "Draft" : "Published",
  updatedAt: daysAgo(index, 12),
  updatedBy: "Karan Mehta",
  fileSize: `${18 + (index % 30)}.4 KB`,
}));

// ---- Trusted Leaders & Brand Partners (home page logo strips) ----
const partner = (brand: (typeof CLIENT_BRANDS)[number], index: number, category: string): PartnerLogoItem => ({
  id: `ptn-${category.slice(0, 3).toLowerCase()}-${index + 1}`,
  name: brand.name,
  image: brand.logo,
  imageAlt: `${brand.name} logo`,
  category,
  order: index + 1,
  status: "Published",
  updatedAt: stamp(index).date,
  updatedBy: "Karan Mehta",
  fileSize: `${20 + index}.2 KB`,
});

const byName = (names: string[]) => CLIENT_BRANDS.filter((b) => names.includes(b.name));

export const PARTNERS_AND_BRANDS: PartnersAndBrandsData = {
  _id: "partners-brands",
  industryLeadersLogos: byName(["Domino's Pizza", "L'Oréal", "LG", "HP", "Nestlé", "Maruti Suzuki", "Unilever", "Tommy Hilfiger", "Jubilant FoodWorks", "Barbeque Nation", "Taco Bell", "Lakmé"]).map((b, i) => partner(b, i, "TRUSTED BY INDUSTRY LEADERS")),
  knowledgeLogos: byName(["Legrand", "Hindware", "Sheela Foam", "Nilkamal"]).map((b, i) => partner(b, i, "Knowledge Partners")),
  wellnessLogos: byName(["Sleepwell", "World of Sleep", "Florida Dress Your Home", "The Pillow Bar"]).map((b, i) => partner(b, i, "Material Partners")),
  supportingLogos: byName(["DS Group", "Jaypee Group", "RBA Hospitality & Hotels"]).map((b, i) => partner(b, i, "Industry Assoc.")),
  emergingBrandsLogos: byName(["Chaayos", "Nicobar", "The Coffee Vault", "MiArcus", "Givo", "Voi Jeans"]).map((b, i) => partner(b, i, "EMERGING D2C BRANDS")),
};

// ---- Leadership (Advisory Board Members screen) ----
export const ADVISORY_GRID_HEADER = { tagline: "OUR LEADERSHIP", title: "Guiding Visionary Spaces" };

export const ADVISORY_MEMBERS = [
  { name: "Mr. Vijay Sharma", designation: "Managing Director", image: "/images/dh/team/member-1770966833568-905181984.jpg" },
  { name: "Mr. Dinesh Rathore", designation: "Director", image: "/images/dh/team/member-1770966868628-771484728.jpg" },
  { name: "Mr. Vipin Sharma", designation: "Senior Manager", image: "/images/dh/team/member-1770966897670-298975281.jpg" },
  { name: "Ms. Pooja Malhotra", designation: "Lead Interior Designer", image: project("team-designer.webp") },
  { name: "Mr. Rahul Verma", designation: "Business Development", image: project("team-planning.webp") },
].map((member, index) => ({
  _id: `ldr-${index + 1}`,
  ...member,
  organization: "Design House India Pvt. Ltd.",
  location: index === 2 ? "Ghaziabad" : "New Delhi",
  order: index + 1,
  status: "Published",
  updatedAt: daysAgo(index * 6, 12),
  updatedBy: "Vijay Sharma",
  fileSize: `${42 + index * 3}.6 KB`,
  websiteUrl: "",
}));

// ---- Testimonials (home carousel) — client reviews published on the website ----
export const HOME_TESTIMONIALS = [
  { company1: "Vansh Chaudhary", company2: "CEO, Vana Tech Labs", location: "New Delhi", quote: "Design House transformed our flagship store into a stunning retail experience. Their attention to detail and creative vision exceeded all our expectations." },
  { company1: "Sadhana Chaudhary", company2: "Director, Tech Innovations", location: "Noida", quote: "The corporate office they designed for us perfectly balances functionality with aesthetics. Our team loves coming to work now. Truly exceptional work!" },
  { company1: "Nitin Kumar", company2: "Owner, Gourmet Kitchen", location: "Gurugram", quote: "Our restaurant's new interior has become a talking point among our guests. The ambiance they created perfectly complements our culinary experience." },
  { company1: "Anjali Chaudhary", company2: "Director, Vana Tech Labs", location: "New Delhi", quote: "Professional, creative, and highly skilled. They delivered our retail kiosk project on time and within budget. Highly recommended!" },
  { company1: "Rohit Mehta", company2: "Head of Store Expansion, UrbanCart Retail", location: "Gurugram", quote: "Six stores, one consistent look — the rollout ran exactly to plan." },
].map((t, index) => ({
  _id: `tst-${index + 1}`,
  ...t,
  rating: index === 4 ? 4 : 5,
  status: index === 4 ? "Pending Review" : "Published",
  createdAt: daysAgo(index * 9 + 3, 12),
  author: "Karan Mehta",
  color: ["#134698", "#de802b", "#0f766e", "#7c3aed", "#0284c7"][index],
}));

// ---- Exhibition client testimonials (Exhibitions service page) ----
export const EXHIBITION_TESTIMONIALS = [
  { company1: "Aroma Organic Foods", company2: "Event Manager", location: "Mumbai", quote: "Our stall at Aahar was the busiest in the hall. Design House handled design, fabrication and dismantling end to end." },
  { company1: "Velocity Motors", company2: "Marketing Head", location: "New Delhi", quote: "A double-decker stall delivered in four days — flawless finish and lighting." },
  { company1: "Jain Electronics Mart", company2: "Owner", location: "Ahmedabad", quote: "Great value for money and a very cooperative on-site team." },
  { company1: "Mobiplus Telecom", company2: "Brand Manager", location: "Hyderabad", quote: "They understood our brand guidelines perfectly. The stall drew huge footfall at India Mobile Congress." },
].map((t, index) => ({
  _id: `ext-${index + 1}`,
  ...t,
  rating: 5,
  status: "Published",
  createdAt: daysAgo(index * 12 + 5, 15),
  author: "Rahul Verma",
  color: ["#de802b", "#134698", "#0f766e", "#7c3aed"][index],
}));
