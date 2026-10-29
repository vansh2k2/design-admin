/* Offline sample data the Bharat admin returned when its backend was unreachable.
 * Kept as the last fallback of the mock router for endpoints without their own fixture. */

export function getMockDataForPath(path: string, method: string = "GET"): unknown {
  const p = path.toLowerCase();
  
  if (p.includes("/system-services/access/requirements")) {
    return {
      expiresInMinutes: 60,
      requiredRoles: ["self"],
      requester: {
        id: "admin-1",
        name: "Expo Super Admin",
        email: "admin@designhouse.co.in",
        twoFactorEnabled: true
      },
      approvers: []
    };
  }

  if (p.includes("/system-services/access/status")) {
    return {
      valid: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  if (p.includes("/system-services/access/verify")) {
    return {
      token: "mock-system-services-grant-token",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      expiresInMinutes: 1440
    };
  }

  if (p.includes("/system-services")) {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    return [
      {
        _id: "svc-1",
        category: "DOMAIN",
        name: "Design House Domain (designhouse.co.in)",
        provider: "GoDaddy Inc",
        accountIdentifier: "DH-DOM-2026",
        loginUrl: "https://godaddy.com",
        startDate: new Date(now - 340 * day).toISOString(),
        expiryDate: new Date(now + 18 * day + 4 * 3600 * 1000).toISOString(),
        autoRenews: true,
        remindersEnabled: true,
        pricingType: "PAID",
        costAmount: 2499,
        currency: "INR",
        billingCycle: "YEARLY",
        details: {
          domainName: "designhouse.co.in",
          registrar: "GoDaddy",
          dnsProvider: "Cloudflare",
          nameservers: "ns1.cloudflare.com, ns2.cloudflare.com"
        },
        createdAt: "2025-09-01T10:00:00Z"
      },
      {
        _id: "svc-2",
        category: "HOSTING",
        name: "Production Server (AWS Mumbai)",
        provider: "Amazon Web Services (AWS)",
        accountIdentifier: "AWS-DH-PROD",
        loginUrl: "https://aws.amazon.com",
        startDate: new Date(now - 300 * day).toISOString(),
        expiryDate: new Date(now + 12 * day + 6 * 3600 * 1000).toISOString(),
        autoRenews: true,
        remindersEnabled: true,
        pricingType: "PAID",
        costAmount: 18500,
        currency: "INR",
        billingCycle: "MONTHLY",
        details: {
          serverType: "VPS / Dedicated",
          publicIp: "203.0.113.42",
          region: "ap-south-1 (Mumbai)",
          operatingSystem: "Ubuntu 24.04 LTS"
        },
        createdAt: "2025-10-01T10:00:00Z"
      },
      {
        _id: "svc-3",
        category: "SSL_CERTIFICATE",
        name: "Wildcard SSL Certificate (*.designhouse.co.in)",
        provider: "Let's Encrypt",
        accountIdentifier: "SSL-DH-WILD",
        loginUrl: "https://letsencrypt.org",
        startDate: new Date(now - 60 * day).toISOString(),
        expiryDate: new Date(now + 45 * day).toISOString(),
        autoRenews: true,
        remindersEnabled: true,
        pricingType: "FREE",
        details: {
          coveredDomains: "designhouse.co.in, *.designhouse.co.in",
          issuer: "Let's Encrypt Authority"
        },
        createdAt: "2026-01-01T10:00:00Z"
      },
      {
        _id: "svc-4",
        category: "PAYMENT_GATEWAY",
        name: "Razorpay Corporate Payment Gateway",
        provider: "Razorpay Software Pvt Ltd",
        accountIdentifier: "RZP-MID-DH2026",
        loginUrl: "https://dashboard.razorpay.com",
        startDate: new Date(now - 200 * day).toISOString(),
        expiryDate: new Date(now + 120 * day).toISOString(),
        autoRenews: true,
        remindersEnabled: true,
        pricingType: "PAID",
        costAmount: 0,
        currency: "INR",
        billingCycle: "ONE_TIME",
        details: {
          merchantId: "RZP_MID_DH2026",
          environment: "Live Production"
        },
        createdAt: "2026-01-15T10:00:00Z"
      },
      {
        _id: "svc-5",
        category: "SMS_WHATSAPP",
        name: "Meta WhatsApp Business API",
        provider: "AiSensy / Meta Cloud",
        accountIdentifier: "WABA-987654321",
        loginUrl: "https://aisensy.com",
        startDate: new Date(now - 150 * day).toISOString(),
        expiryDate: new Date(now + 90 * day).toISOString(),
        autoRenews: true,
        remindersEnabled: true,
        pricingType: "PAID",
        costAmount: 4500,
        currency: "INR",
        billingCycle: "MONTHLY",
        details: {
          phoneNumber: "+91 98765 43210",
          wabaId: "WABA-987654321",
          phoneNumberId: "PNID-887766"
        },
        createdAt: "2026-02-01T10:00:00Z"
      }
    ];
  }

  if (p.includes("/newsletter")) {
    return [
      { _id: "nl-1", email: "info@greenearthorganics.in", source: "Website Footer", createdAt: "2026-09-01T10:00:00Z" },
      { _id: "nl-2", email: "exports@organicworld.org", source: "Exhibitor Modal", createdAt: "2026-09-02T14:30:00Z" },
      { _id: "nl-3", email: "buyer@dubaitrade.ae", source: "Buyer Registration", createdAt: "2026-09-05T09:15:00Z" },
      { _id: "nl-4", email: "contact@ayushherbs.in", source: "Homepage Form", createdAt: "2026-09-07T11:45:00Z" },
    ];
  }
  
  if (p.includes("/blogs")) {
    return [
      {
        _id: "blog-1",
        title: "Design House: India's Largest Organic & Herbal Event",
        slug: "bharat-organic-expo-2027-event",
        excerpt: "Join global industry leaders and organic producers at Pragati Maidan, New Delhi.",
        content: "<p>Welcome to Design House...</p>",
        author: "Admin Team",
        tags: ["Organic Food", "Exhibition", "Delhi"],
        isPublished: true,
        publishedAt: "2026-08-01T10:00:00Z",
        createdAt: "2026-08-01T10:00:00Z"
      }
    ];
  }
  
  if (p.includes("/enquiries") || p.includes("/contacts")) {
    return [
      {
        _id: "enq-1",
        name: "Rajesh Kumar",
        phone: "+91 9876543210",
        email: "rajesh@natureorganic.com",
        message: "Interested in stall booking options in Hall 1 for organic spices.",
        category: "contact",
        organization: "Saxena Jewellers",
        designation: "Marketing Director",
        interest: "Stall Booking Hall 1",
        status: "new",
        createdAt: "2026-09-07T12:00:00Z"
      },
      {
        _id: "enq-2",
        name: "Priya Sharma",
        phone: "+91 9811223344",
        email: "psharma@greenearthcsr.org",
        message: "Requesting CSR sponsorship details for Organic Farmer Pavilion.",
        category: "csr",
        organization: "Lumina LED Systems",
        designation: "CSR Head",
        interest: "Farmer Pavilion Sponsorship",
        status: "new",
        createdAt: "2026-09-06T15:30:00Z"
      },
      {
        _id: "enq-3",
        name: "Tariq Mansoor",
        phone: "+971 50 123 4567",
        email: "tariq@dubaiimports.ae",
        message: "Looking for B2B buyer lounge access and VIP delegation entry.",
        category: "partnership",
        organization: "Gulf Retail Fixtures LLC",
        designation: "Procurement Manager",
        interest: "B2B Trade Buyer Lounge",
        status: "contacted",
        createdAt: "2026-09-05T10:15:00Z"
      },
      {
        _id: "enq-4",
        name: "Dr. Ananya Roy",
        phone: "+91 9717001122",
        email: "aroy@herbalresearch.in",
        message: "Proposal to host a technical workshop on organic certification.",
        category: "csr",
        organization: "National Herbal Research Council",
        designation: "Chief Scientist",
        interest: "Workshop & Seminar Partner",
        status: "contacted",
        createdAt: "2026-09-04T16:45:00Z"
      },
      {
        _id: "enq-5",
        name: "Sanjay Gupta",
        phone: "+91 9988776655",
        email: "sanjay@bioagro.co.in",
        message: "Sponsorship enquiry for Eco-Friendly Packaging Pavilion.",
        category: "csr",
        organization: "BioAgro Tech Ltd",
        designation: "VP Business Development",
        interest: "Eco Pavilion Sponsorship",
        status: "closed",
        createdAt: "2026-09-02T11:20:00Z"
      }
    ];
  }

  if (p.includes("/requests")) {
    return [
      {
        _id: "req-101",
        requestNo: "EXPO-2027-001",
        type: "EMERGENCY",
        status: "SUBMITTED",
        priority: "HIGH",
        requester: {
          name: "Ramesh Sharma",
          phone: "+91 9810192837",
          email: "ramesh.sharma@natureherbs.in",
          relation: "Exhibitor"
        },
        deceased: {
          name: "Nature Herbs & Organics Pvt Ltd",
          gender: "CORPORATE",
          age: "12 Years",
          dateOfPassing: "2026-09-07T00:00:00Z",
          placeOfPassing: "Pragati Maidan Hall 1",
          isUnclaimed: false
        },
        location: {
          address: "Sector 25, Dwarka",
          city: "New Delhi",
          state: "Delhi",
          pincode: "110077"
        },
        assistanceTypes: ["Stall Booking", "36 Sqm Island Stall"],
        notes: "Urgent stall allocation required near main entrada entrance for organic tea & spices.",
        createdAt: "2026-09-07T10:30:00Z"
      },
      {
        _id: "req-102",
        requestNo: "EXPO-2027-002",
        type: "NORMAL",
        status: "SUBMITTED",
        priority: "NORMAL",
        requester: {
          name: "Priya Kapoor",
          phone: "+91 9899112233",
          email: "priya@greenharvest.com",
          relation: "Buyer Delegate"
        },
        deceased: {
          name: "Green Harvest Global Ltd",
          gender: "CORPORATE",
          age: "8 Years",
          dateOfPassing: "2026-09-06T00:00:00Z",
          placeOfPassing: "B2B Lounge Hall 2",
          isUnclaimed: false
        },
        location: {
          address: "Bandra Kurla Complex",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400051"
        },
        assistanceTypes: ["B2B Buyer Pass", "VIP Lounge Access"],
        notes: "Registered international buyer delegation of 5 representatives.",
        createdAt: "2026-09-06T14:15:00Z"
      },
      {
        _id: "req-103",
        requestNo: "EXPO-2027-003",
        type: "NORMAL",
        status: "CONVERTED",
        priority: "HIGH",
        requester: {
          name: "Ankit Nair",
          phone: "+91 9744556677",
          email: "ankit@keralaorganics.co.in",
          relation: "Exhibitor"
        },
        deceased: {
          name: "Kerala Organic Farmers Federation",
          gender: "COOPERATIVE",
          age: "15 Years",
          dateOfPassing: "2026-09-05T00:00:00Z",
          placeOfPassing: "State Pavilion Hall 3",
          isUnclaimed: false
        },
        location: {
          address: "MG Road",
          city: "Kochi",
          state: "Kerala",
          pincode: "682016"
        },
        assistanceTypes: ["State Pavilion", "Bare Space 54 Sqm"],
        notes: "Confirmed stall allocation for 18 farmer co-operatives.",
        createdAt: "2026-09-05T09:45:00Z"
      },
      {
        _id: "req-104",
        requestNo: "EXPO-2027-004",
        type: "EMERGENCY",
        status: "SUBMITTED",
        priority: "CRITICAL",
        requester: {
          name: "Sunita Chauhan",
          phone: "+91 9650011223",
          email: "sunita@biofertilizers.in",
          relation: "Sponsor"
        },
        deceased: {
          name: "BioFertilizers India Corp",
          gender: "CORPORATE",
          age: "20 Years",
          dateOfPassing: "2026-09-04T00:00:00Z",
          placeOfPassing: "Main Convention Centre",
          isUnclaimed: false
        },
        location: {
          address: "Sector 62",
          city: "Noida",
          state: "Uttar Pradesh",
          pincode: "201301"
        },
        assistanceTypes: ["Gold Sponsor", "Lanyard Branding"],
        notes: "Sponsorship agreement finalization for main plenary session.",
        createdAt: "2026-09-04T16:20:00Z"
      },
      {
        _id: "req-105",
        requestNo: "EXPO-2027-005",
        type: "NORMAL",
        status: "REJECTED",
        priority: "LOW",
        requester: {
          name: "Meera Das",
          phone: "+91 9830044556",
          email: "meera@pureayurveda.com",
          relation: "Exhibitor"
        },
        deceased: {
          name: "Pure Ayurveda Remedies",
          gender: "FIRM",
          age: "3 Years",
          dateOfPassing: "2026-09-03T00:00:00Z",
          placeOfPassing: "Hall 1",
          isUnclaimed: false
        },
        location: {
          address: "Salt Lake Sector V",
          city: "Kolkata",
          state: "West Bengal",
          pincode: "700091"
        },
        assistanceTypes: ["Shell Scheme 9 Sqm"],
        notes: "Duplicate submission - merged with request EXPO-2027-001.",
        duplicateOfRequestId: "req-101",
        createdAt: "2026-09-03T11:10:00Z"
      }
    ];
  }

  if (p.includes("/partners")) {
    return [
      {
        _id: "part-1",
        name: "APEDA (Ministry of Commerce & Industry)",
        type: "MUNICIPAL",
        status: "ACTIVE",
        contactPerson: "Dr. V. K. Sharma",
        contactPhone: "+91 11 23456789",
        contactEmail: "support@apeda.gov.in",
        createdAt: "2026-01-10T10:00:00Z"
      }
    ];
  }

  if (p.includes("/faqs")) {
    return [
      {
        _id: "faq-1",
        question: "What are the dates for Design House?",
        answer: "The expo will be held at Pragati Maidan (IICC), Dwarka, New Delhi.",
        category: "General",
        order: 1,
        isActive: true,
        createdAt: "2026-01-01T10:00:00Z"
      }
    ];
  }

  if (p.includes("/gallery")) {
    return [
      {
        _id: "gal-1",
        type: "image",
        url: "/images/hero-bg.jpg",
        caption: "Design House Pavilion",
        category: "Expo",
        isActive: true,
        createdAt: "2026-01-01T10:00:00Z"
      }
    ];
  }

  if (p.includes("/settings")) {
    return {
      _id: "settings-1",
      siteName: "Design House",
      helplineNumber: "+91 11 4567 8900",
      whatsappNumber: "+91 9876543210",
      supportEmail: "info@designhouse.co.in",
      address: "Pragati Maidan (IICC), Dwarka, Sector 25, New Delhi",
      banners: [],
      socialLinks: []
    };
  }

  // Staff and Roles have a real backend — no mock fallback

  if (p.includes("/seo/backlinks") || p.includes("/backlinks")) {
    const items = [
      {
        _id: "bl-1",
        targetUrl: "https://www.designhouse.co.in",
        sourceUrl: "https://apeda.gov.in/organic/bharat-organic-expo",
        anchorText: "Design House",
        type: "dofollow",
        daScore: 72,
        status: "active",
        notes: "APEDA official partner listing",
        createdAt: "2026-09-15T10:00:00Z",
        updatedAt: "2026-10-01T10:00:00Z",
      },
      {
        _id: "bl-2",
        targetUrl: "https://www.designhouse.co.in/exhibitors",
        sourceUrl: "https://trademagazine.in/organic-expo-india",
        anchorText: "exhibitor registration organic expo",
        type: "dofollow",
        daScore: 54,
        status: "active",
        notes: "Trade magazine feature article",
        createdAt: "2026-09-20T10:00:00Z",
        updatedAt: "2026-10-05T10:00:00Z",
      },
      {
        _id: "bl-3",
        targetUrl: "https://www.designhouse.co.in/visit",
        sourceUrl: "https://delhitourism.gov.in/events",
        anchorText: "Pragati Maidan organic event",
        type: "nofollow",
        daScore: 65,
        status: "active",
        notes: "Government events listing",
        createdAt: "2026-09-25T10:00:00Z",
        updatedAt: "2026-10-10T10:00:00Z",
      },
      {
        _id: "bl-4",
        targetUrl: "https://www.designhouse.co.in",
        sourceUrl: "https://organic-blogspot.com/bharat-organic-2027",
        anchorText: "Design House",
        type: "dofollow",
        daScore: 31,
        status: "lost",
        notes: "Blog removed the backlink",
        createdAt: "2026-08-10T10:00:00Z",
        updatedAt: "2026-10-12T10:00:00Z",
      },
      {
        _id: "bl-5",
        targetUrl: "https://www.designhouse.co.in/register",
        sourceUrl: "https://old-directory.in/listing/organic-expo",
        anchorText: "Register for organic expo",
        type: "dofollow",
        daScore: 22,
        status: "broken",
        notes: "Source page returning 404",
        createdAt: "2026-07-05T10:00:00Z",
        updatedAt: "2026-10-14T10:00:00Z",
      },
      {
        _id: "bl-6",
        targetUrl: "https://www.designhouse.co.in/blogs",
        sourceUrl: "https://healthline-india.in/superfoods-organic",
        anchorText: "organic superfoods expo",
        type: "dofollow",
        daScore: 48,
        status: "active",
        notes: "Health blog sponsored post",
        createdAt: "2026-09-01T10:00:00Z",
        updatedAt: "2026-10-08T10:00:00Z",
      },
    ];
    const total = items.length;
    const active = items.filter((i) => i.status === "active").length;
    const lost = items.filter((i) => i.status === "lost").length;
    const broken = items.filter((i) => i.status === "broken").length;
    const dofollow = items.filter((i) => i.type === "dofollow").length;
    const nofollow = items.filter((i) => i.type === "nofollow").length;
    return {
      items,
      meta: { total, page: 1, limit: 50, totalPages: 1 },
      stats: { total, active, lost, broken, dofollow, nofollow },
    };
  }

  if (p.includes("/redirects") || p.includes("/audit")) {
    return [];
  }

  // No static /seo/pages payload: the SEO client falls back to the real
  // real route inventory in lib/seoCheckupData.ts so page rows are never invented.
  if (p.includes("/seo") && !p.includes("/seo-settings") && !p.includes("/seo/pages") && !p.includes("/seo/overview") && !p.includes("/seo/broken-links") && !p.includes("/seo/score")) {
    return {
      score: 98,
      status: "good",
      checks: []
    };
  }

  if (method !== "GET") {
    return { _id: "mock-id-" + Date.now(), success: true, message: "Operation completed successfully (Static Mock)" };
  }

  return [];
}
