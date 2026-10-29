import type { MsmeApplication } from "@/lib/msmeApi";

import { daysAgo, pick } from "./common";

/* MSME applications: small manufacturers applying for stalls in the MSME pavilion Design House builds at trade fairs */

const ENTERPRISES = [
  { name: "Shree Ganesh Woodcrafts", activity: "Manufacturing", category: "Micro", district: "Saharanpur", state: "Uttar Pradesh", owner: "Ramesh Kumar" },
  { name: "Lumiere Lighting Works", activity: "Manufacturing", category: "Small", district: "Noida", state: "Uttar Pradesh", owner: "Ankit Bansal" },
  { name: "Kutch Handloom Collective", activity: "Manufacturing", category: "Micro", district: "Kutch", state: "Gujarat", owner: "Hetal Patel" },
  { name: "Metalart Fixtures", activity: "Manufacturing", category: "Small", district: "Moradabad", state: "Uttar Pradesh", owner: "Imran Qureshi" },
  { name: "Green Ply Laminates", activity: "Trading", category: "Small", district: "Yamunanagar", state: "Haryana", owner: "Gurpreet Singh" },
  { name: "Jaipur Stone Studio", activity: "Manufacturing", category: "Micro", district: "Jaipur", state: "Rajasthan", owner: "Kavya Sharma" },
  { name: "Acrylica Display Systems", activity: "Manufacturing", category: "Small", district: "Ghaziabad", state: "Uttar Pradesh", owner: "Deepak Chauhan" },
  { name: "Bamboo Home Decor", activity: "Manufacturing", category: "Micro", district: "Guwahati", state: "Assam", owner: "Ritu Baruah" },
];

const STATUSES: MsmeApplication["status"][] = ["SUBMITTED", "SUBMITTED", "PAYMENT_PENDING", "SUBMITTED", "PARTICIPATION_SAVED", "SUBMITTED", "ENTERPRISE_SAVED", "PAYMENT_FAILED"];
const REVIEWS: NonNullable<MsmeApplication["reviewStatus"]>[] = ["APPROVED", "PENDING_REVIEW", "PENDING_REVIEW", "NEEDS_INFO", "PENDING_REVIEW", "APPROVED", "PENDING_REVIEW", "REJECTED"];

export const MSME_APPLICATIONS: MsmeApplication[] = ENTERPRISES.map((e, i) => {
  const created = daysAgo(i * 3 + 1, 11);
  const status = STATUSES[i] ?? "DRAFT";
  const paid = status === "SUBMITTED";
  const slug = e.name.toLowerCase().replace(/[^a-z]+/g, "");
  return {
    _id: `msme-${i + 1}`,
    applicationId: `DH-MSME-2026-${String(301 + i)}`,
    status,
    eligibility: { checked: true, eligible: i !== 7, category: e.category, supportPercentage: e.category === "Micro" ? 80 : 60, checkedAt: created },
    enterprise: {
      udyamNumber: `UDYAM-${e.state.slice(0, 2).toUpperCase()}-${String(10 + i)}-00${4410 + i * 37}`,
      enterpriseName: e.name,
      enterpriseType: e.category,
      majorActivity: e.activity,
      constitution: i % 2 ? "Partnership" : "Proprietorship",
      category: pick(["General", "OBC", "Women", "SC"], i),
      dateOfIncorporation: daysAgo(900 + i * 200).slice(0, 10),
      address: `Plot ${20 + i}, Industrial Estate`,
      state: e.state,
      district: e.district,
      pincode: `2${String(10000 + i * 1234).slice(0, 5)}`,
      gstin: `09AAB${String(1000 + i)}M1Z${i}`,
      pan: `AAB${String(1000 + i)}M`,
      bank: { accountHolderName: e.name, accountNumber: `XXXXXX${4400 + i}`, ifsc: `SBIN000${1200 + i}`, bankName: "State Bank of India", branch: e.district },
      mobile: `98${String(76540000 + i * 1111)}`,
      email: `info@${slug}.in`,
    },
    participation: {
      stallType: pick(["Shell Scheme", "Bare Space"], i),
      stallSize: pick(["9 sqm", "12 sqm", "18 sqm"], i),
      stallLocation: "MSME Pavilion — Hall 5",
      contactPerson: { name: e.owner, designation: "Proprietor", mobile: `98${String(76540000 + i * 1111)}`, email: `${e.owner.split(" ")[0]!.toLowerCase()}@${slug}.in` },
    },
    payment: { amount: 18000 + (i % 3) * 6000, currency: "INR", status: paid ? "PAID" : status === "PAYMENT_FAILED" ? "FAILED" : "PENDING", paidAt: paid ? created : undefined },
    reviewStatus: REVIEWS[i],
    reviewNote: REVIEWS[i] === "NEEDS_INFO" ? "Please upload the latest Udyam certificate." : undefined,
    reviewedBy: REVIEWS[i] === "PENDING_REVIEW" ? undefined : "Vipin Sharma",
    reviewedAt: REVIEWS[i] === "PENDING_REVIEW" ? undefined : daysAgo(i, 16),
    submittedAt: paid ? created : undefined,
    createdAt: created,
    updatedAt: created,
  };
});
