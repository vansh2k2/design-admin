import type { CareerDashboard } from "@/lib/careerDashboardApi";
import type { CareerOption } from "@/lib/careerOptionsApi";
import type { JobPosting } from "@/lib/careersApi";
import type { HrSettings } from "@/lib/hrSettings";

import { CITIES, daysAgo, daysAhead, pick } from "./common";

/* Careers: the openings on designhouse.co.in/career, AI-screened candidates and HR settings */

const ABOUT =
  "Design House India Pvt. Ltd. is a turnkey interior, retail display and exhibition solutions company with 5000+ projects delivered across India since 2004.";

interface JobSeed {
  title: string;
  department: string;
  description: string;
  experience: [number, number];
  education: string;
  ctc: [number, number];
  skills: string[];
  status: JobPosting["status"];
  openings: number;
  views: number;
  applications: number;
  location?: string;
}

const SEEDS: JobSeed[] = [
  { title: "Architectural Designer", department: "Design", description: "Create innovative and sustainable design solutions for diverse infrastructure and building projects.", experience: [2, 5], education: "B.Arch / M.Arch", ctc: [4.5, 8], skills: ["AutoCAD", "SketchUp", "3ds Max", "V-Ray", "Space Planning"], status: "OPEN", openings: 2, views: 1240, applications: 38 },
  { title: "Project Manager", department: "Projects", description: "Lead and manage end-to-end project execution, coordination and stakeholder engagement.", experience: [5, 8], education: "B.E. / B.Tech / B.Arch", ctc: [9, 14], skills: ["Project Planning", "MS Project", "Vendor Management", "BOQ", "Site Coordination"], status: "OPEN", openings: 1, views: 980, applications: 26 },
  { title: "Construction Manager", department: "Projects", description: "Oversee construction activities, ensure quality, safety and timely delivery of projects.", experience: [5, 10], education: "B.E. / B.Tech (Civil)", ctc: [10, 16], skills: ["Civil Works", "Quality Control", "Safety Compliance", "Billing", "Team Leadership"], status: "OPEN", openings: 1, views: 760, applications: 17 },
  { title: "BIM Specialist", department: "Design", description: "Develop and manage BIM models to support design coordination and project execution.", experience: [2, 5], education: "B.Arch / B.E. / B.Tech", ctc: [5, 9], skills: ["Revit", "Navisworks", "BIM 360", "Clash Detection", "AutoCAD"], status: "OPEN", openings: 1, views: 640, applications: 14 },
  { title: "Retail Interior Designer", department: "Design", description: "Design retail stores and shop-in-shops that reflect brand guidelines and drive sales.", experience: [1, 4], education: "B.Des / Diploma in Interior Design", ctc: [3.6, 6.5], skills: ["AutoCAD", "SketchUp", "Visual Merchandising", "Material Selection"], status: "DRAFT", openings: 2, views: 0, applications: 0 },
  { title: "Business Development Executive", department: "Sales", description: "Generate leads for retail, corporate and exhibition projects and convert them into orders.", experience: [1, 3], education: "Graduate / MBA (Marketing)", ctc: [3.5, 6], skills: ["B2B Sales", "Client Meetings", "CRM", "Negotiation"], status: "CLOSED", openings: 3, views: 1510, applications: 64, location: "Mumbai" },
];

export const JOBS: JobPosting[] = SEEDS.map((seed, index) => {
  const created = daysAgo(40 - index * 6, 11);
  const slug = seed.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    _id: `job-${index + 1}`,
    title: seed.title,
    slug,
    designation: seed.title,
    company: "Design House India Pvt. Ltd.",
    department: seed.department,
    jobCode: `DH-${seed.department.slice(0, 3).toUpperCase()}-${String(101 + index)}`,
    location: seed.location ?? "Delhi NCR",
    employmentType: "Full Time",
    workplaceType: "On-site",
    totalOpenings: seed.openings,
    experienceMin: seed.experience[0],
    experienceMax: seed.experience[1],
    educationRequirements: seed.education,
    ctcMin: seed.ctc[0] * 100000,
    ctcMax: seed.ctc[1] * 100000,
    salaryType: "Annual CTC",
    salary: `₹${seed.ctc[0]}–${seed.ctc[1]} LPA`,
    description: seed.description,
    aboutCompany: ABOUT,
    roleObjective: seed.description,
    skills: seed.skills,
    preferredSkills: ["Client presentations", "Site experience"],
    targetIndustrySegments: ["Retail", "Corporate", "Hospitality", "Exhibitions"],
    responsibilities: [
      "Prepare layouts, working drawings and 3D views for client approval.",
      "Coordinate with the factory, vendors and site teams for smooth execution.",
      "Visit sites for measurements, progress checks and quality inspections.",
      "Maintain timelines, budgets and handover documentation.",
    ],
    requirements: [`${seed.education}.`, `${seed.experience[0]}–${seed.experience[1]} years of relevant experience.`, `Working knowledge of ${seed.skills.slice(0, 3).join(", ")}.`, "Good communication and team skills."],
    reportingTo: seed.department === "Sales" ? "Sales Manager" : "Senior Manager — Projects",
    screeningQuestions: ["Share a project you are most proud of.", "What is your notice period?"],
    acceptOnlineApplications: seed.status === "OPEN",
    aiCvScreening: true,
    cvUploadMandatory: true,
    eligibilityThreshold: 70,
    partialMatchMin: 50,
    partialMatchMax: 69,
    showMatchScoreToCandidate: true,
    featuredJob: index < 2,
    applicationOpenDate: created,
    applicationClosingDate: daysAhead(30 + index * 5),
    tags: [seed.department, "Full Time"],
    views: seed.views,
    applicationsCount: seed.applications,
    status: seed.status,
    publishedAt: seed.status === "DRAFT" ? undefined : created,
    closedAt: seed.status === "CLOSED" ? daysAgo(3) : undefined,
    createdAt: created,
    updatedAt: daysAgo(index, 15),
  };
});

const CANDIDATES = [
  { name: "Aditi Sharma", company: "Studio Forma", designation: "Junior Architect", exp: "3", jobIndex: 0, score: 86, city: "New Delhi" },
  { name: "Mohit Rawat", company: "BuildRight Infra", designation: "Assistant Project Manager", exp: "6", jobIndex: 1, score: 78, city: "Noida" },
  { name: "Saurabh Tiwari", company: "Larsen Interiors", designation: "Site Engineer", exp: "7", jobIndex: 2, score: 64, city: "Ghaziabad" },
  { name: "Neeraj Bisht", company: "Archigrid Consultants", designation: "BIM Modeller", exp: "4", jobIndex: 3, score: 91, city: "Gurugram" },
  { name: "Riya Kapoor", company: "Freelance", designation: "Interior Designer", exp: "2", jobIndex: 0, score: 58, city: "New Delhi" },
  { name: "Kunal Arora", company: "Skyline Fitouts", designation: "Project Coordinator", exp: "5", jobIndex: 1, score: 72, city: "Gurugram" },
  { name: "Farhan Ali", company: "Metro Constructions", designation: "Construction Supervisor", exp: "9", jobIndex: 2, score: 81, city: "Faridabad" },
  { name: "Tanya Gupta", company: "DesignCraft Studio", designation: "Architectural Assistant", exp: "1", jobIndex: 0, score: 41, city: "Noida" },
  { name: "Vivek Pandey", company: "Infra BIM Labs", designation: "Revit Technician", exp: "3", jobIndex: 3, score: 69, city: "New Delhi" },
  { name: "Sakshi Jain", company: "Urban Habitat", designation: "Project Engineer", exp: "5", jobIndex: 1, score: 47, city: "Delhi" },
];

const resultFor = (score: number) => (score >= 70 ? "Eligible" : score >= 50 ? "Partial Match" : "Not Eligible") as "Eligible" | "Partial Match" | "Not Eligible";

export const APPLICATIONS_BOARD = CANDIDATES.map((c, index) => {
  const job = JOBS[c.jobIndex] ?? JOBS[0]!;
  const applied = new Date(daysAgo(index, 10 + (index % 7), (index * 11) % 60));
  const cvOnly = index === 7;
  const hrStatuses = ["Shortlisted", "Under Review", "Interview", "Sent to HR", "Not Forwarded", "On Hold", "Selected", "Rejected", "Under Review", "Rejected"] as const;
  const result = resultFor(c.score);
  return {
    id: `app-${index + 1}`,
    name: c.name,
    avatar: c.name.split(" ").map((p) => p[0]).join(""),
    experienceYrs: c.exp,
    position: job.title,
    department: job.department,
    phone: `98${String(10234567 + index * 7919).slice(0, 8)}`,
    email: `${c.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
    aiScore: c.score,
    aiResult: result,
    aiAnalysisSummary:
      result === "Eligible"
        ? `Strong match for ${job.title}: relevant experience at ${c.company} and most required skills (${job.skills.slice(0, 3).join(", ")}).`
        : result === "Partial Match"
          ? `Partly matches ${job.title}: good fundamentals but limited hands-on experience with ${job.skills[1] ?? "key tools"}.`
          : `Does not meet the minimum experience and skill requirements for ${job.title}.`,
    stage: cvOnly ? "CV Uploaded" : "Submitted",
    hrStatus: cvOnly ? "Not Forwarded" : hrStatuses[index],
    appliedOn: applied.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    appliedTime: applied.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    jobCode: job.jobCode ?? "",
    location: c.city,
    currentCompany: c.company,
    currentCtc: `₹${(3 + Number(c.exp) * 0.9).toFixed(1)} LPA`,
    expectedCtc: `₹${(4 + Number(c.exp) * 1.1).toFixed(1)} LPA`,
    noticePeriod: pick(["Immediate", "15 Days", "30 Days", "60 Days"], index),
    joiningAvailability: pick(["Within 2 weeks", "Within 1 month", "Within 2 months"], index),
    willingToRelocate: index % 3 ? "Yes" : "No",
    updatedByHrOn: index < 4 ? daysAgo(index, 17) : undefined,
    source: cvOnly ? "cv" : "application",
    currentDesignation: c.designation,
    skills: job.skills.slice(0, 4),
    strengths: ["Relevant industry experience", `Hands-on with ${job.skills[0]}`],
    gaps: result === "Eligible" ? [] : [`Limited exposure to ${job.skills[2] ?? "large projects"}`],
    cvUrl: "",
    cvFileName: `${c.name.replace(/\s+/g, "_")}_CV.pdf`,
    cvFileSize: 182_000 + index * 9_500,
    whyInterested: "Design House's retail and exhibition projects match the work I want to grow in.",
    notes: index === 0 ? "Strong portfolio — schedule interview with the MD." : "",
  };
});

export function careerDashboard(range: string): CareerDashboard {
  const today = new Date();
  const points = range === "7d" ? 7 : 12;
  const latest = APPLICATIONS_BOARD.slice(0, 6);
  return {
    range,
    from: daysAgo(range === "7d" ? 7 : 30),
    to: today.toISOString(),
    granularity: range === "7d" || range === "30d" ? "daily" : "monthly",
    activeJobs: JOBS.filter((job) => job.status === "OPEN").length,
    current: { pageViews: 6840, jobViews: 3620, applyClicks: 412, cvUploads: 168, aiChecked: 161, eligible: 74, partial: 52, notEligible: 35, submitted: 121 },
    trends: { pageViews: 12.4, jobViews: 9.8, applyClicks: 15.1, cvUploads: 8.7, aiChecked: 8.2, eligible: 11.3, partial: 4.6, notEligible: -3.2, submitted: 10.4 },
    series: Array.from({ length: points }, (_, i) => ({ label: daysAgo(points - 1 - i).slice(5, 10), pageViews: 420 + ((i * 67) % 260), applyClicks: 24 + ((i * 13) % 22), cvUploads: 9 + ((i * 7) % 11) })),
    topLocations: CITIES.slice(0, 6).map((city, i) => ({ city, count: 48 - i * 7 })),
    latestApplications: latest.map((app) => ({
      id: app.id,
      applicationId: `DH-APP-${app.id.split("-")[1]?.padStart(4, "0")}`,
      name: app.name,
      position: app.position,
      appliedOn: app.appliedOn,
      matchScore: app.aiScore,
      result: app.aiResult,
      status: app.source === "cv" ? "Not Applied" : "Completed",
      source: "Careers page",
    })),
  };
}

export const HR_SETTINGS: HrSettings = {
  recipients: [
    { id: "hr-1", name: "Sneha Joshi", designation: "HR Executive", email: "hr@designhouse.co.in", type: "to", active: true },
    { id: "hr-2", name: "Vipin Sharma", designation: "Senior Manager", email: "vipin@designhouse.co.in", type: "cc", active: true },
    { id: "hr-3", name: "Vijay Sharma", designation: "Managing Director", email: "vijay@designhouse.co.in", type: "bcc", active: false },
  ],
  manualForward: true,
  notifyHr: true,
  updatedAt: daysAgo(6, 12),
};

const option = (type: CareerOption["type"], label: string, order: number): CareerOption => ({
  _id: `${type}-${order}`,
  type,
  label,
  order,
  isActive: true,
  createdAt: daysAgo(60),
  updatedAt: daysAgo(60),
});

export const CAREER_OPTIONS: CareerOption[] = [
  ...["Immediate", "15 Days", "30 Days", "60 Days", "90 Days"].map((l, i) => option("notice_period", l, i + 1)),
  ...["Within 1 week", "Within 2 weeks", "Within 1 month", "Within 2 months"].map((l, i) => option("joining_period", l, i + 1)),
  ...["Up to ₹3 LPA", "₹3–5 LPA", "₹5–8 LPA", "₹8–12 LPA", "₹12–18 LPA", "Above ₹18 LPA"].map((l, i) => option("expected_ctc", l, i + 1)),
];
