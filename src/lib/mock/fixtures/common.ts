/*
 * Shared Design House sample data. Names, companies and numbers are fictional; company details
 * (offices, services, team) are taken from the Design House website.
 */

export const COMPANY = {
  name: "Design House",
  legalName: "Design House India Pvt. Ltd.",
  website: "https://www.designhouse.co.in",
  domain: "designhouse.co.in",
  email: "info@designhouse.co.in",
  phone: "+91 96549 00525",
  whatsapp: "+91 80767 50278",
  headOffice: "12/29, Site-II, Loni Road Industrial Area, Mohan Nagar, Ghaziabad, Uttar Pradesh 201007",
  offices: [
    { title: "Head Office", city: "Ghaziabad", state: "Uttar Pradesh", address: "12/29, Site-II, Loni Road Industrial Area, Mohan Nagar", zipCode: "201007" },
    { title: "Delhi Branch", city: "New Delhi", state: "Delhi", address: "Ground Floor, Main Market, E-1, opposite KFC, Kalkaji", zipCode: "110019" },
    { title: "Mumbai Branch", city: "Mumbai", state: "Maharashtra", address: "212 Bussa Industrial Estate, Lower Parel", zipCode: "400013" },
  ],
} as const;

export const SERVICES = [
  "Retail Interior",
  "Corporate Interior",
  "Restaurant Interior",
  "Shop in Shop",
  "Retail Display Merchandising",
  "Retail Kiosk",
  "Exhibitions & Events",
  "Branding & Signage",
  "Office Interior",
  "Modular Furniture",
] as const;

export const CITIES = ["New Delhi", "Gurugram", "Noida", "Ghaziabad", "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Jaipur", "Lucknow", "Chandigarh", "Ahmedabad", "Kolkata", "Chennai"] as const;

export const STAFF = [
  { name: "Vijay Sharma", role: "Managing Director", email: "vijay@designhouse.co.in", team: "Management" },
  { name: "Dinesh Rathore", role: "Director", email: "dinesh@designhouse.co.in", team: "Management" },
  { name: "Vipin Sharma", role: "Senior Manager", email: "vipin@designhouse.co.in", team: "Projects" },
  { name: "Neha Kapoor", role: "Sales Manager", email: "neha.kapoor@designhouse.co.in", team: "Sales" },
  { name: "Rahul Verma", role: "Business Development Executive", email: "rahul.verma@designhouse.co.in", team: "Sales" },
  { name: "Pooja Malhotra", role: "Lead Interior Designer", email: "pooja.malhotra@designhouse.co.in", team: "Design" },
  { name: "Amit Yadav", role: "Project Coordinator", email: "amit.yadav@designhouse.co.in", team: "Projects" },
  { name: "Sneha Joshi", role: "HR Executive", email: "hr@designhouse.co.in", team: "HR" },
  { name: "Karan Mehta", role: "Digital Marketing Executive", email: "karan.mehta@designhouse.co.in", team: "Marketing" },
] as const;

/** Prospects and clients who write in through the website (fictional) */
export const CONTACTS = [
  { name: "Rohit Mehta", company: "UrbanCart Retail Pvt. Ltd.", designation: "Head of Store Expansion", city: "Gurugram", email: "rohit.mehta@urbancart.in", phone: "+91 98110 23456" },
  { name: "Neha Bansal", company: "FinEdge Capital", designation: "Admin Manager", city: "Noida", email: "neha.bansal@finedgecapital.com", phone: "+91 98731 44521" },
  { name: "Amit Khanna", company: "Spice Bowl Restaurants", designation: "Founder", city: "New Delhi", email: "amit@spicebowl.co.in", phone: "+91 99104 87213" },
  { name: "Sonal Verma", company: "Glow Cosmetics", designation: "Retail Operations Lead", city: "Mumbai", email: "sonal.verma@glowcosmetics.in", phone: "+91 98201 33908" },
  { name: "Karan Arora", company: "Arora Homes", designation: "Managing Partner", city: "Chandigarh", email: "karan@arorahomes.in", phone: "+91 98154 22019" },
  { name: "Priya Nair", company: "BrewTown Cafe", designation: "Co-founder", city: "Bengaluru", email: "priya@brewtown.cafe", phone: "+91 99860 51274" },
  { name: "Manish Gupta", company: "TechNova Solutions", designation: "Facility Head", city: "Pune", email: "manish.gupta@technova.io", phone: "+91 98220 61835" },
  { name: "Ritu Saxena", company: "Saxena Jewellers", designation: "Director", city: "Lucknow", email: "ritu@saxenajewellers.com", phone: "+91 94150 77302" },
  { name: "Arjun Singh", company: "FitZone Gyms", designation: "Expansion Manager", city: "Jaipur", email: "arjun.singh@fitzone.in", phone: "+91 98290 45127" },
  { name: "Kavita Reddy", company: "Mobiplus Telecom", designation: "Brand Manager", city: "Hyderabad", email: "kavita.reddy@mobiplus.in", phone: "+91 98480 26391" },
  { name: "Sanjay Jain", company: "Jain Electronics Mart", designation: "Owner", city: "Ahmedabad", email: "sanjay@jainelectronics.in", phone: "+91 98250 39184" },
  { name: "Ananya Das", company: "Kolkata Book House", designation: "Store Manager", city: "Kolkata", email: "ananya@kolkatabookhouse.in", phone: "+91 98300 51627" },
  { name: "Vikram Malhotra", company: "Velocity Motors", designation: "Marketing Head", city: "New Delhi", email: "vikram.m@velocitymotors.in", phone: "+91 98111 70245" },
  { name: "Shweta Kulkarni", company: "Aroma Organic Foods", designation: "Event Manager", city: "Mumbai", email: "shweta@aromafoods.in", phone: "+91 98197 66014" },
  { name: "Deepak Chauhan", company: "Chauhan Furnishings", designation: "Proprietor", city: "Ghaziabad", email: "deepak@chauhanfurnishings.in", phone: "+91 98186 35270" },
  { name: "Meera Iyer", company: "LearnSphere Academy", designation: "Operations Director", city: "Chennai", email: "meera.iyer@learnsphere.in", phone: "+91 98400 81936" },
  { name: "Harsh Vardhan", company: "Peak Sportswear", designation: "Retail Head", city: "Noida", email: "harsh@peaksportswear.in", phone: "+91 98717 24680" },
  { name: "Simran Kaur", company: "Punjab Grill House", designation: "Owner", city: "Chandigarh", email: "simran@punjabgrillhouse.in", phone: "+91 98760 13579" },
] as const;

/** Trade fairs where clients book Design House for stall design and fabrication */
export const EVENTS = [
  "IHGF Delhi Fair (Autumn) 2026",
  "India International Trade Fair 2026",
  "Aahar International Food Fair 2027",
  "Auto Expo Components 2027",
  "India Mobile Congress 2026",
  "Acetech Mumbai 2026",
] as const;

const DAY = 24 * 60 * 60 * 1000;

/** ISO time `days` days ago at the given hour and minute (local time) */
export function daysAgo(days: number, hour = 11, minute = 0): string {
  const date = new Date(Date.now() - days * DAY);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function daysAhead(days: number, hour = 11, minute = 0): string {
  return daysAgo(-days, hour, minute);
}

/** Deterministic pick so lists look varied but stay stable between reloads */
export function pick<T>(list: readonly T[], index: number): T {
  return list[((index % list.length) + list.length) % list.length];
}
