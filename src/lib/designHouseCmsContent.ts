import type { CmsRecord } from "./cmsJson";

/*
 * Pages & CMS for www.designhouse.co.in — every page of the website with its sections, filled with
 * the content currently on the site. These are the defaults the editor starts from; saved changes
 * are merged on top (see components/pages-cms/page-strategies).
 */

type Section = CmsRecord;

const img = {
  hero1: "/images/dh/hero/hero-1773296085826-894992248.webp",
  heroRestaurant: "/images/dh/hero/hero-1773296129159-840124339.webp",
  heroRetail: "/images/dh/hero/hero-1773296107624-949760441.webp",
  heroCorporate: "/images/dh/hero/hero-1775978647638-459487117.webp",
  heroExhibition: "/images/dh/hero/hero-1775978829612-194861506.jpg",
  heroKiosk: "/images/dh/hero/hero-1775978934542-241150198.jpg",
  about: "/images/dh/1770894541753.jpg",
  logo: "/logobg.png",
  project: (file: string) => `/images/dh/projects/${file}`,
  service: (file: string) => `/images/dh/services/${file}`,
  step: (file: string) => `/images/dh/how-we-work/${file}`,
  counter: (file: string) => `/images/dh/stats-counter/${file}`,
  team: (file: string) => `/images/dh/team/${file}`,
  client: (file: string) => `/images/dh/clients/${file}`,
};

const CONTACT = {
  phone: "+91 96549 00525",
  whatsapp: "+91 80767 50278",
  email: "info@designhouse.co.in",
  address: "12/29, Site-II, Loni Road Industrial Area, Mohan Nagar, Ghaziabad, Uttar Pradesh 201007",
};

// ---------------------------------------------------------------------------------------------
// Shared sections (same on every page of the website)
// ---------------------------------------------------------------------------------------------

const topbarSection: Section = {
  key: "topbar",
  name: "Topbar & Header Contact",
  enabled: true,
  title: "Design House India Pvt. Ltd.",
  marqueeText: "5000+ PROJECTS DELIVERED • PAN-INDIA EXECUTION • RETAIL | RESTAURANT | KIOSK | CORPORATE | EXHIBITION EXPERTS",
  phoneNumber: CONTACT.phone,
  contactEmail: CONTACT.email,
};

const navbarSection: Section = {
  key: "navbar",
  name: "Header Navigation",
  enabled: true,
  title: "Design House",
  logoImage: img.logo,
  buttonLabel: "Book a Meeting",
  buttonHref: "/#book-meeting",
  items: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/portfolio" },
    { label: "Clients", href: "/clients" },
    { label: "Career", href: "/career" },
    { label: "Blogs", href: "/blogs" },
    { label: "Downloads", href: "/downloads" },
    { label: "Contact", href: "/contact" },
  ],
};

const footerSection: Section = {
  key: "footer",
  name: "Footer & Social Links",
  enabled: true,
  title: "Let's Build Together",
  description:
    "Design House India Private Limited is a premier manufacturer of retail display solutions with nationwide reach — display merchandising, events, exhibitions, retail kiosks and turnkey interior projects.",
  logoImage: img.logo,
  phoneNumber: CONTACT.phone,
  contactEmail: CONTACT.email,
  contactAddress: CONTACT.address,
  quickLinksTitle: "Quick Links",
  servicesTitle: "Our Services",
  contactTitle: "Our Presence",
  youtubeUrl: "https://www.youtube.com/@designhouseindia",
  items: [
    { label: "Retail Interiors", href: "/services/retail-interior" },
    { label: "Corporate Interiors", href: "/services/corporate-interior" },
    { label: "Restaurant Interior", href: "/services/restaurant-interior" },
    { label: "Shop In Shops", href: "/services/shop-in-shop" },
    { label: "Retail Display Merchandising", href: "/services/retail-display" },
    { label: "Retail Kiosk", href: "/services/retail-kiosk" },
    { label: "Exhibition & Events", href: "/services/exhibitions" },
  ],
};

const ctaSection = (title = "Let's Build Together", description = "Tell us about your space — our team will get back within one working day with ideas and a quotation."): Section => ({
  key: "cta-banner",
  name: "Call to Action Banner",
  enabled: true,
  title,
  description,
  image: img.project("brand-store-facade.webp"),
  buttonLabel: "Get Free Consultation",
  buttonHref: "/contact",
  secondaryButtonLabel: "Call Us",
  secondaryButtonHref: `tel:${CONTACT.phone.replace(/\s/g, "")}`,
});

const pageHero = (title: string, highlight: string, description: string, image: string): Section => ({
  key: "page-hero",
  name: "Page Hero Banner",
  enabled: true,
  eyebrow: "DESIGN HOUSE",
  title,
  highlightedText: highlight,
  description,
  image,
  imageAlt: `${title} ${highlight}`.trim(),
});

const PROCESS_STEPS = [
  { step: "01.", title: "Initial Consultation", description: "We begin by understanding your vision, goals, and needs through detailed discussions and comprehensive site analysis.", image: img.step("11--1--11zon-1773296151606-901598783.webp"), icon: "Users" },
  { step: "02.", title: "Design & Planning", description: "Our creative team develops detailed architectural designs and plans that perfectly reflect your unique requirements.", image: img.step("12-11zon-1773296157125-947285028.webp"), icon: "PenTool" },
  { step: "03.", title: "Implementation", description: "With carefully selected contractors and premium materials, we manage every construction phase ensuring quality.", image: img.step("13-11zon-1773296163346-888572927.webp"), icon: "Hammer" },
  { step: "04.", title: "Project Handover", description: "Upon completion, we conduct thorough reviews and quality checks, ensuring every detail meets our standards.", image: img.step("55-11zon-1773296170108-643309082.webp"), icon: "CheckCircle" },
];

const howWeWorkSection: Section = {
  key: "how-we-work",
  name: "How We Work",
  enabled: true,
  eyebrow: "HOW WE WORK",
  title: "Architecture Process For Exceptional Results.",
  description:
    "Our process is alive — adapting, refining, and growing with your vision. Every space we design balances aesthetics with functionality, and from concept to completion we focus on materials, lighting, and textures that elevate everyday living.",
  quote: "Excellence in architecture is a journey of continuous refinement.",
  items: PROCESS_STEPS,
};

const FAQS = [
  { question: "Can you provide a sustainable or eco-friendly interior design?", answer: "Absolutely! We can prioritize sustainable materials like recycled wood, low-VOC paints, energy-efficient lighting, and ethically sourced textiles to create a beautiful space that is also kind to the environment." },
  { question: "Do I need to move out during the home renovation?", answer: "For minor renovations, you can usually stay. For major structural changes or full-home renovations with significant dust and noise, we recommend moving out temporarily for your comfort and safety." },
  { question: "How involved do I need to be in the design process?", answer: "We tailor our collaboration to your preference. We handle all the heavy lifting and typically have weekly check-ins to get your approval on key materials and designs." },
  { question: "Do you execute projects outside Delhi NCR?", answer: "Yes. We have delivered 5000+ projects across 40+ cities in India with our own manufacturing and installation teams." },
  { question: "How long does a typical retail store take?", answer: "A 1,500–2,500 sq ft store usually takes 4–6 weeks from design approval to handover." },
];

const faqSection: Section = { key: "faqs", name: "FAQs", enabled: true, eyebrow: "FAQS", title: "Frequently Asked Questions", items: FAQS };

const clientsSection: Section = {
  key: "clients-marquee",
  name: "Our Clients (Logo Strip)",
  enabled: true,
  eyebrow: "OUR CLIENTS",
  title: "Trusted By Premium Brands",
  items: [
    ["Domino's Pizza", "logo11.webp"], ["L'Oréal", "logo41.png"], ["LG", "logo39.png"], ["HP", "logo30.png"], ["Nestlé", "logo50.png"], ["Maruti Suzuki", "logo43.png"],
    ["Tommy Hilfiger", "logo71.png"], ["Barbeque Nation", "logo1.png"], ["Taco Bell", "logo67.jpg"], ["Lakmé", "logo37.png"], ["Chaayos", "logo7.png"], ["Hindware", "logo29.png"],
  ].map(([name, file]) => ({ name, image: img.client(file!), href: "" })),
};

const testimonialsSection: Section = {
  key: "testimonials-carousel",
  name: "Testimonials",
  enabled: true,
  eyebrow: "TESTIMONIALS",
  title: "What Our Clients Say",
  items: [
    { name: "Vansh Chaudhary", role: "CEO, Vana Tech Labs", quote: "Design House transformed our flagship store into a stunning retail experience. Their attention to detail and creative vision exceeded all our expectations.", rating: 5 },
    { name: "Sadhana Chaudhary", role: "Director, Tech Innovations", quote: "The corporate office they designed for us perfectly balances functionality with aesthetics. Our team loves coming to work now.", rating: 5 },
    { name: "Nitin Kumar", role: "Owner, Gourmet Kitchen", quote: "Our restaurant's new interior has become a talking point among our guests.", rating: 5 },
    { name: "Anjali Chaudhary", role: "Director, Vana Tech Labs", quote: "They delivered our retail kiosk project on time and within budget. Highly recommended!", rating: 5 },
  ],
};

const statsSection: Section = {
  key: "stats-counter",
  name: "Stats Counter",
  enabled: true,
  items: [
    { value: "850", label: "Happy Clients", description: "Trusted partnerships nationwide", icon: "Users", image: img.counter("counter-1773296258339-687232700.webp") },
    { value: "5000", label: "Projects Completed", description: "Delivering excellence every time", icon: "Briefcase", image: img.counter("counter-1773296271111-237414885.webp") },
    { value: "98", label: "Client Satisfaction (%)", description: "Quality guaranteed", icon: "TrendingUp", image: img.counter("counter-1773296279647-6042072.webp") },
    { value: "40", label: "Cities Covered", description: "Pan-India execution", icon: "Award", image: img.counter("counter-1773296288351-375512524.webp") },
  ],
};

const locationSection: Section = {
  key: "locations",
  name: "Our Presence (Offices & Map)",
  enabled: true,
  eyebrow: "OUR PRESENCE",
  title: "Visit Our Offices",
  mapEmbedUrl: "https://maps.app.goo.gl/yhZmpyd3nzd9WHnR8",
  items: [
    { title: "Head Office", location: "Ghaziabad, Uttar Pradesh", description: "12/29, Site-II, Loni Road Industrial Area, Mohan Nagar — 201007" },
    { title: "Delhi Branch", location: "New Delhi", description: "Ground Floor, Main Market, E-1, opposite KFC, Kalkaji — 110019" },
    { title: "Mumbai Branch", location: "Mumbai, Maharashtra", description: "212 Bussa Industrial Estate, Lower Parel — 400013" },
  ],
};

// ---------------------------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------------------------

const HERO_SLIDES = [
  { tagline: "Transforming Spaces into Experiences", titlePrimary: "India's Leading Turnkey Interior &", titleSecondary: "Exhibition Solutions Company", description: "Successfully delivering 5000+ projects with excellence across pan-India locations. Retail | Restaurant | Kiosk | Corporate | Exhibition Expert", image: img.hero1, buttonLabel: "Get Free Consultation", buttonHref: "/contact", secondaryButtonLabel: "View Our Projects", secondaryButtonHref: "/portfolio" },
  { tagline: "Designing Experiences That Customers Remember", titlePrimary: "Restaurant & Café Interiors", titleSecondary: "That Stand Out", description: "We create immersive dining environments that elevate customer experience and strengthen your brand identity. Restaurants | Cafés | QSR | Fine Dining | Food Courts", image: img.heroRestaurant, buttonLabel: "View Hospitality Projects", buttonHref: "/portfolio/interior/restaurant-interior", secondaryButtonLabel: "Get Free Consultation", secondaryButtonHref: "/contact" },
  { tagline: "Creating High-Impact Retail Experiences", titlePrimary: "From concept to execution — we design and build", titleSecondary: "stores that attract, engage, and convert customers.", description: "We design and execute retail spaces that enhance brand visibility and convert footfall into revenue. Showrooms | Malls | High-Street Stores | Brand Outlets", image: img.heroRetail, buttonLabel: "Explore Retail Projects", buttonHref: "/portfolio/interior/retail-interior", secondaryButtonLabel: "Get Free Consultation", secondaryButtonHref: "/contact" },
  { tagline: "Smart Spaces for Modern Workplaces", titlePrimary: "Corporate Interiors That", titleSecondary: "Inspire Productivity", description: "We design functional and future-ready workspaces that boost efficiency, collaboration, and growth. Offices | Co-working Spaces | Corporate HQ | Commercial Spaces", image: img.heroCorporate, buttonLabel: "Explore Corporate Projects", buttonHref: "/portfolio/interior/corporate-interior", secondaryButtonLabel: "", secondaryButtonHref: "" },
  { tagline: "Make Your Brand the Center of Attention", titlePrimary: "Exhibition Stalls That", titleSecondary: "Capture & Convert", description: "Innovative stall designs with flawless execution to maximize brand visibility and generate quality leads. Exhibition Stalls | Trade Shows | Expo Booths | Event Setups", image: img.heroExhibition, buttonLabel: "View Exhibition Work", buttonHref: "/portfolio/signage/exhibition-events-portfolio", secondaryButtonLabel: "", secondaryButtonHref: "" },
  { tagline: "Designed to Attract. Built to Perform.", titlePrimary: "Custom Kiosk Design &", titleSecondary: "Manufacturing Solutions", description: "We design, fabricate, and install high-impact kiosks tailored for every business category and location. Mall Kiosks | Retail Carts | F&B Kiosks | Pop-up Stores | Display Units", image: img.heroKiosk, buttonLabel: "Explore Kiosk Projects", buttonHref: "/portfolio/kiosk/kiosk-images", secondaryButtonLabel: "", secondaryButtonHref: "" },
].map((slide) => ({ ...slide, title: `${slide.titlePrimary} ${slide.titleSecondary}`.trim(), subtitle: slide.tagline, alt: slide.titleSecondary }));

const aboutSection: Section = {
  key: "about",
  name: "About Us",
  enabled: true,
  eyebrow: "ABOUT US",
  title: "Crafting Exceptional Spaces Since 2004",
  description:
    "Design House India Private Limited is a premier manufacturer of retail display solutions with nationwide reach. Our efficient production and distribution network delivers seamless solutions across India.\n\nAs a leading interior design company in Delhi, we specialize in Display Merchandising, Events, Exhibitions, Retail Kiosks, and Turnkey Projects with a team of qualified professionals.",
  image: img.about,
  imageAlt: "Design House project",
  videoUrl: "https://www.youtube.com/embed/y_iRs4lFkUg",
  buttonLabel: "Know More",
  buttonHref: "/about",
  items: [
    { title: "Mission", description: "Deliver innovative designs that exceed expectations and create lasting value for our clients through exceptional craftsmanship." },
    { title: "Vision", description: "To be the most trusted interior design partner, transforming spaces into inspiring environments that elevate brands and lifestyles." },
  ],
};

const FEATURED_SERVICES = [
  { num: "01", title: "Retail Kiosk", description: "Industry-leading retail kiosk solutions that blend innovation with functionality to create exceptional customer experiences.", image: img.service("service-1773296194261-324659476.webp"), icon: "ShoppingBag", href: "/services/retail-kiosk" },
  { num: "02", title: "Retail Display Merchandising", description: "Strategic visual merchandising solutions that captivate customers and drive engagement through expert design.", image: img.service("service-1773296202770-57270881.webp"), icon: "Store", href: "/services/retail-display" },
  { num: "03", title: "Modular Restaurant Furniture", description: "Premium modular furniture that transforms dining spaces into memorable experiences with perfect aesthetics.", image: img.service("service-1773296211354-324603922.webp"), icon: "Utensils", href: "/services/restaurant-interior" },
  { num: "04", title: "Retail & Corporate Interior", description: "Sophisticated interior solutions that elevate your brand identity and create inspiring professional environments.", image: img.service("service-1773296228195-425495051.webp"), icon: "Building", href: "/services/corporate-interior" },
  { num: "05", title: "Branding & Signages", description: "Comprehensive branding solutions that communicate your story with clarity, impact, and lasting visual identity.", image: img.service("service-1773296238967-886806710.webp"), icon: "Megaphone", href: "/services/signage" },
  { num: "06", title: "Exhibition & Events", description: "Innovative exhibition designs that command attention and showcase your excellence at every event.", image: img.service("service-1773296247763-953879891.webp"), icon: "ShoppingBag", href: "/services/exhibitions" },
];

const featuredServicesSection: Section = {
  key: "featured-services",
  name: "Featured Services Carousel",
  enabled: true,
  eyebrow: "SERVICES WE DO",
  title: "Our Featured Services & Transformations",
  items: FEATURED_SERVICES,
};

const recentArticlesSection: Section = {
  key: "recent-articles",
  name: "Recent Articles (Blog)",
  enabled: true,
  eyebrow: "OUR BLOGS",
  title: "Recent Articles",
  description: "Latest published posts are shown automatically from Blog & Insights.",
  buttonLabel: "View All Blogs",
  buttonHref: "/blogs",
};

export const dhHomeSections: Section[] = [
  topbarSection,
  navbarSection,
  { key: "hero", name: "Hero Carousel Slides", enabled: true, slides: HERO_SLIDES },
  aboutSection,
  featuredServicesSection,
  howWeWorkSection,
  statsSection,
  clientsSection,
  testimonialsSection,
  faqSection,
  recentArticlesSection,
  locationSection,
  footerSection,
];

// ---------------------------------------------------------------------------------------------
// About pages
// ---------------------------------------------------------------------------------------------

const whyChooseSection: Section = {
  key: "why-choose-us",
  name: "Why Choose Us",
  enabled: true,
  eyebrow: "WHY CHOOSE US",
  title: "Why We're India's Leading Interior Design",
  description:
    "Welcome to Design House India Private Limited, a distinguished name in retail interior design and execution, celebrating two decades of excellence in the heart of Delhi. Since our inception in 2004, we have been at the forefront of transforming spaces and creating bespoke interiors.",
  image: img.about,
  items: [
    { title: "Innovative Designs", description: "Cutting-edge designs blending aesthetics with functional brilliance" },
    { title: "Expert Team", description: "150+ certified designers, architects, and craftsmen delivering perfection" },
    { title: "Timely Delivery", description: "Strict adherence to deadlines with 98% on-time project completion" },
    { title: "Award-Winning", description: "Multiple national awards for excellence in interior design" },
    { title: "Client-Centric", description: "5000+ satisfied clients with 95% repeat business rate" },
    { title: "Nationwide Service", description: "Strategic presence across major cities with seamless project execution" },
  ],
};

const teamSection: Section = {
  key: "our-team",
  name: "Our Team",
  enabled: true,
  eyebrow: "OUR TEAM",
  title: "Guiding Visionary Spaces",
  description: "Decades of expertise in crafting premium interiors and architectural excellence.",
  quote: "Our leadership's commitment to excellence ensures that each project reflects the highest standards of luxury and innovation.",
  buttonLabel: "Work With Us",
  buttonHref: "/contact",
  items: [
    { name: "Mr. Vijay Sharma", role: "Managing Director", image: img.team("member-1770966833568-905181984.jpg") },
    { name: "Mr. Dinesh Rathore", role: "Director", image: img.team("member-1770966868628-771484728.jpg") },
    { name: "Mr. Vipin Sharma", role: "Senior Manager", image: img.team("member-1770966897670-298975281.jpg") },
  ],
};

export const dhAboutSections: Section[] = [
  pageHero("About", "Design House", "Crafting exceptional spaces since 2004 — interiors, retail display, kiosks and exhibitions across India.", img.project("corporate-office-lounge.jpg")),
  aboutSection,
  whyChooseSection,
  statsSection,
  teamSection,
  ctaSection(),
  footerSection,
];

export const dhTeamSections: Section[] = [pageHero("Our", "Team", "The people behind 5000+ projects.", img.project("team-review.webp")), teamSection, ctaSection(), footerSection];

export const dhAssociatesSections: Section[] = [
  pageHero("Our", "Associates", "Partners and associate companies that help us deliver end-to-end projects.", img.project("team-planning.webp")),
  { key: "associates", name: "Associate Companies", enabled: true, eyebrow: "OUR ASSOCIATES", title: "Working Together", items: [{ title: "Ensis Panchakarma", description: "Spa and wellness interiors partner.", image: "/images/dh/projects/residential-living-room.jpg" }, { title: "Lumina LED Systems", description: "Architectural and display lighting.", image: "/images/dh/projects/retail-luxury-display.jpg" }] },
  footerSection,
];

export const dhBrandApproachSections: Section[] = [
  pageHero("Brand Conscious", "Approach", "Every space we design starts with your brand — its story, customers and goals.", img.project("retail-footwear-store.jpg")),
  { key: "brand-approach", name: "Brand Conscious Approach", enabled: true, eyebrow: "OUR APPROACH", title: "Design That Builds Brands", description: "We translate brand guidelines into materials, lighting, fixtures and customer journeys so every store looks and feels on-brand.", items: [{ title: "Understand the brand", description: "Workshops with your brand and retail teams." }, { title: "Design the journey", description: "Layouts that guide customers to hero products." }, { title: "Build consistently", description: "Master designs and modular fixtures for every rollout." }] },
  ctaSection(),
  footerSection,
];

export const dhInfrastructureSections: Section[] = [
  pageHero("Facility &", "Infrastructure", "In-house manufacturing for retail fixtures, kiosks, furniture and exhibition stalls.", img.project("team-3d-modelling.webp")),
  { key: "facility", name: "Facility & Infrastructure", enabled: true, eyebrow: "OUR FACTORY", title: "Built In-House", description: "Our Ghaziabad facility houses woodworking, metal fabrication, acrylic, paint and assembly units with dedicated quality control.", items: [{ title: "Woodworking", description: "CNC panel saws, edge banding and pressing lines." }, { title: "Metal Fabrication", description: "Cutting, bending, welding and powder coating." }, { title: "Acrylic & Signage", description: "Laser cutting, routing and LED assembly." }, { title: "Quality Control", description: "Pre-dispatch checks for every fixture." }] },
  statsSection,
  footerSection,
];

// ---------------------------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------------------------

export const dhServicesSections: Section[] = [
  pageHero("Our", "Services", "Comprehensive design solutions — interiors, retail display, kiosks, signage and exhibitions.", img.project("retail-wooden-shelving.jpg")),
  {
    key: "what-we-do",
    name: "What We Do",
    enabled: true,
    eyebrow: "WHAT WE DO",
    title: "Our Expertise",
    description: "Comprehensive Design Solutions",
    items: [
      { title: "Retail Display Merchandising", description: "Transform your retail space with strategic merchandising solutions that drive sales and enhance customer experience.", icon: "Package", features: ["Strategic product placement & visual merchandising", "Custom fixture design & fabrication", "Seasonal display concepts & execution", "Brand consistency across multiple locations"], image: "/images/dh/whatwedo/1770963781533.jpg" },
      { title: "Corporate Interior", description: "Design workspaces that inspire productivity and reflect your company culture.", icon: "Building2", features: ["Space planning & ergonomic design", "Reception areas & executive offices", "Meeting rooms & collaborative spaces", "Breakout zones & amenity spaces"], image: img.project("corporate-office-open-plan.jpg") },
      { title: "Branding & Signage", description: "Premium signage solutions that elevate your brand visibility.", icon: "PenTool", features: ["LED & backlit signboard design", "Wayfinding & directional signage", "3D acrylic & metal fabrication"], image: img.project("brand-store-facade.webp") },
      { title: "Exhibition & Events", description: "Exhibition stands and event setups that captivate audiences.", icon: "Users", features: ["Custom exhibition booth design", "Trade show & conference setups", "Modular & portable display systems", "Product launch event spaces"], image: img.project("exhibition-stall-custom.png") },
    ],
  },
  featuredServicesSection,
  howWeWorkSection,
  ctaSection(),
  footerSection,
];

interface ServiceSeed {
  title: string;
  highlight: string;
  intro: string;
  image: string;
  offerings: string[];
  gallery: string[];
}

function servicePage(seed: ServiceSeed): Section[] {
  return [
    pageHero(seed.title, seed.highlight, seed.intro, seed.image),
    {
      key: "service-intro",
      name: "Service Introduction",
      enabled: true,
      eyebrow: "WHAT WE OFFER",
      title: `${seed.title} ${seed.highlight}`.trim(),
      description: seed.intro,
      image: seed.image,
      buttonLabel: "Get Free Consultation",
      buttonHref: "/contact",
    },
    { key: "offerings", name: "Our Offerings", enabled: true, eyebrow: "OUR OFFERINGS", title: "What's Included", items: seed.offerings.map((title) => ({ title, description: "" })) },
    howWeWorkSection,
    { key: "project-gallery", name: "Recent Projects Gallery", enabled: true, eyebrow: "RECENT WORK", title: "Projects We've Delivered", items: seed.gallery.map((file) => ({ title: file.replace(/\.[a-z]+$/, "").replace(/-/g, " "), image: img.project(file) })) },
    faqSection,
    ctaSection(),
    footerSection,
  ];
}

export const dhServicePages: Record<string, Section[]> = {
  retailInteriorPage: servicePage({ title: "Retail", highlight: "Interior", intro: "We design and execute retail spaces that enhance brand visibility and convert footfall into revenue — showrooms, malls, high-street stores and brand outlets.", image: img.heroRetail, offerings: ["Store layout & customer journey", "Custom fixtures & display walls", "Lighting & ceiling design", "Facade & signage", "Multi-store rollouts"], gallery: ["retail-fashion-store.jpg", "retail-footwear-store.jpg", "retail-wooden-shelving.jpg", "retail-luxury-display.jpg"] }),
  corporateInteriorPage: servicePage({ title: "Corporate", highlight: "Interior", intro: "Functional, future-ready workspaces that boost efficiency, collaboration and growth — offices, co-working spaces and corporate HQs.", image: img.heroCorporate, offerings: ["Space planning", "Workstations & cabins", "Meeting & conference rooms", "Breakout & amenity zones", "MEP & civil works"], gallery: ["corporate-office-open-plan.jpg", "corporate-office-lounge.jpg", "office-workstations.jpg", "md-cabin-executive.jpg"] }),
  restaurantInteriorPage: servicePage({ title: "Restaurant", highlight: "Interior", intro: "Immersive dining environments that elevate customer experience and strengthen your brand — restaurants, cafes, QSRs, fine dining and food courts.", image: img.heroRestaurant, offerings: ["Concept & theme design", "Seating & bar counters", "Kitchen planning", "Ambient & accent lighting", "Modular restaurant furniture"], gallery: ["restaurant-dining-hall.jpg", "restaurant-warm-interior.webp"] }),
  shopInShopPage: servicePage({ title: "Shop in", highlight: "Shop", intro: "Branded shop-in-shop counters and displays for department stores and multi-brand outlets, built to your brand guidelines.", image: img.project("retail-luxury-display.jpg"), offerings: ["Brand counters", "Wall bays & gondolas", "Backlit graphics", "Rollout across stores"], gallery: ["retail-luxury-display.jpg", "retail-display-gondolas.jpg"] }),
  retailDisplayPage: servicePage({ title: "Retail Display", highlight: "Merchandising", intro: "Strategic visual merchandising, gondolas, wall bays and custom fixtures that drive sales.", image: "/images/dh/whatwedo/1770963781533.jpg", offerings: ["Gondolas & wall bays", "Acrylic displays", "Window displays", "Seasonal display concepts"], gallery: ["retail-display-gondolas.jpg", "retail-wooden-shelving.jpg", "brand-store-facade.webp"] }),
  retailKioskPage: servicePage({ title: "Retail", highlight: "Kiosk", intro: "We design, fabricate and install high-impact kiosks for every business category — mall kiosks, retail carts, F&B kiosks, pop-up stores and display units.", image: img.heroKiosk, offerings: ["Mall kiosks", "Retail carts", "F&B kiosks", "Pop-up stores", "Mobile booths"], gallery: ["retail-display-gondolas.jpg", "retail-luxury-display.jpg"] }),
  exhibitionsPage: servicePage({ title: "Exhibitions &", highlight: "Events", intro: "Innovative stall designs with flawless execution to maximize brand visibility and generate quality leads — exhibition stalls, trade shows, expo booths and event setups.", image: img.heroExhibition, offerings: ["Custom & island stalls", "Double-decker stalls", "Graphics & lighting", "On-site installation & dismantling", "Product launch events"], gallery: ["exhibition-stall-custom.png", "exhibition-stall-island.png", "exhibition-hall.png", "exhibition-pavilion.webp"] }),
  signagePage: servicePage({ title: "Branding &", highlight: "Signage", intro: "LED and backlit signboards, wayfinding, 3D acrylic and metal lettering that make your brand visible.", image: img.project("brand-store-facade.webp"), offerings: ["LED & backlit signboards", "Wayfinding signage", "3D acrylic & metal letters", "Facade branding"], gallery: ["brand-store-facade.webp"] }),
  officeInteriorPage: servicePage({ title: "Office", highlight: "Interior", intro: "Modular workstations, MD cabins and office chairs designed and manufactured in-house.", image: img.project("md-cabin-executive.jpg"), offerings: ["Modular workstations", "MD cabins", "Office chairs", "Storage & filing"], gallery: ["office-workstations.jpg", "md-cabin-executive.jpg", "office-lounge-seating.webp"] }),
};

// ---------------------------------------------------------------------------------------------
// Other pages
// ---------------------------------------------------------------------------------------------

export const dhPortfolioSections: Section[] = [
  pageHero("Our", "Portfolio", "Retail, corporate, restaurant, kiosk and exhibition projects delivered across India.", img.project("retail-fashion-store.jpg")),
  {
    key: "portfolio-categories",
    name: "Portfolio Categories",
    enabled: true,
    eyebrow: "PROJECTS",
    title: "Explore Our Work",
    items: [
      { title: "Interiors Portfolio", href: "/portfolio/interior/retail-interior", image: img.project("retail-fashion-store.jpg") },
      { title: "Merchandising Portfolio", href: "/portfolio/merchandising/merchandising-images", image: img.project("retail-display-gondolas.jpg") },
      { title: "Kiosk Portfolio", href: "/portfolio/kiosk/kiosk-images", image: img.project("retail-luxury-display.jpg") },
      { title: "Exhibition & Events Portfolio", href: "/portfolio/signage/exhibition-events-portfolio", image: img.project("exhibition-stall-custom.png") },
      { title: "Office Interior Portfolio", href: "/portfolio/office-interior/modular-images", image: img.project("office-workstations.jpg") },
      { title: "Furniture Portfolio", href: "/portfolio/furniture/kitchen-images", image: img.project("modular-kitchen-white.jpg") },
    ],
  },
  { key: "portfolio-videos", name: "Project Videos", enabled: true, title: "Videos", description: "Videos are managed in Video Highlights.", buttonLabel: "Watch Videos", buttonHref: "/portfolio/videos" },
  ctaSection(),
  footerSection,
];

export const dhGallerySections: Section[] = [
  pageHero("Project", "Gallery", "Photos from our recent projects — managed in the Media Library.", img.project("restaurant-dining-hall.jpg")),
  { key: "gallery-intro", name: "Gallery Introduction", enabled: true, title: "Our Work in Pictures", description: "Images are picked from the Media Library by category." },
  footerSection,
];

export const dhClientsSections: Section[] = [
  pageHero("Trusted By", "Premium Brands", "Leading brands across retail, QSR, FMCG and lifestyle trust Design House.", img.project("brand-store-facade.webp")),
  clientsSection,
  testimonialsSection,
  footerSection,
];

export const dhTestimonialsSections: Section[] = [pageHero("Client", "Testimonials", "What our clients say about working with us.", img.project("corporate-office-lounge.jpg")), testimonialsSection, ctaSection(), footerSection];

export const dhBlogSections: Section[] = [
  pageHero("Our", "Blogs", "Interior design ideas, retail trends and project insights.", img.project("residential-living-room.jpg")),
  { key: "blog-listing", name: "Blog Listing", enabled: true, title: "Latest Articles", description: "Posts are managed in Blog & Insights.", buttonLabel: "Load More", buttonHref: "" },
  footerSection,
];

export const dhCareerSections: Section[] = [
  { key: "career-hero", name: "Career Hero", enabled: true, eyebrow: "CAREERS", title: "Join Our Team", highlightedText: "Build Innovative Work", description: "Shape spaces that inspire. Grow with a team that has delivered 5000+ projects across India.", image: "/images/dh/projects/team-planning.webp", items: [{ title: "Growth-Focused Culture" }, { title: "Real-World Projects" }, { title: "Supportive Team" }, { title: "Learning & Development" }] },
  { key: "current-openings", name: "Current Openings", enabled: true, eyebrow: "CURRENT OPENINGS", title: "Find Your Next Role", description: "Openings are managed in Job Postings." },
  { key: "why-work-with-us", name: "Why Work With Us", enabled: true, eyebrow: "WHY WORK WITH US", title: "More Than a Job", items: [{ title: "Learning", description: "Work on retail, corporate and exhibition projects." }, { title: "Real-World Impact", description: "See your designs built and used." }, { title: "Supportive Team", description: "Mentors across design, projects and sales." }, { title: "Growth", description: "Clear paths from designer to project lead." }] },
  { key: "life-at-design-house", name: "Life at Design House", enabled: true, title: "Life at Design House", items: [{ image: img.project("team-designer.webp") }, { image: img.project("team-review.webp") }, { image: img.project("team-3d-modelling.webp") }, { image: img.project("team-planning.webp") }] },
  ctaSection("Be Part of Something Great", "Upload your CV on any opening — our AI screening shows how well you match the role."),
  footerSection,
];

export const dhDownloadsSections: Section[] = [
  pageHero("", "Downloads", "Company profile, e-brochures and newsletters.", img.project("office-lounge-seating.webp")),
  {
    key: "downloads",
    name: "Downloads",
    enabled: true,
    title: "Brochures & Documents",
    items: [
      { title: "Company Profile", category: "Company Profile", href: "/downloads/company-profile.pdf" },
      { title: "Corporate Presentation", category: "Company Profile", href: "/downloads/corporate-presentation.pdf" },
      { title: "Infrastructure Overview", category: "Company Profile", href: "/downloads/infrastructure.pdf" },
      { title: "Modular Furniture", category: "E-Brochure", href: "/downloads/ebrochures/Modular Furniture.pdf" },
      { title: "Office Furniture", category: "E-Brochure", href: "/downloads/ebrochures/office furniture.pdf" },
      { title: "Modular Kitchen", category: "E-Brochure", href: "/downloads/ebrochures/Modular Kitchen.pdf" },
      { title: "Corporate Interior Newsletter", category: "Newsletter", href: "/downloads/newsletter/corprate_nov.pdf" },
      { title: "Residential Interior Newsletter", category: "Newsletter", href: "/downloads/newsletter/residential_nov.pdf" },
    ],
  },
  footerSection,
];

export const dhContactSections: Section[] = [
  pageHero("Contact", "Us", "Get a free consultation — we reply within one working day.", img.project("corporate-office-lounge.jpg")),
  {
    key: "contact-form",
    name: "Contact Form",
    enabled: true,
    eyebrow: "GET IN TOUCH",
    title: "Let's Discuss Your Project",
    phoneNumber: CONTACT.phone,
    altPhoneNumber: CONTACT.whatsapp,
    contactEmail: CONTACT.email,
    contactAddress: CONTACT.address,
    submitLabel: "Send Message",
    successMessage: "Thank you! Our team will contact you shortly.",
  },
  locationSection,
  footerSection,
];

const legalPage = (title: string, intro: string, points: [string, string][]): Section[] => [
  pageHero("", title, intro, img.project("office-lounge-seating.webp")),
  { key: "legal-content", name: `${title} Content`, enabled: true, title, description: intro, items: points.map(([heading, text]) => ({ title: heading, description: text })) },
  footerSection,
];

export const dhPrivacySections = legalPage("Privacy Policy", "How Design House India Pvt. Ltd. collects, uses and protects your information.", [
  ["Information We Collect", "Name, phone, email and project details you share through our forms, chat or calls."],
  ["How We Use It", "To respond to enquiries, prepare quotations, process job applications and improve our services."],
  ["Sharing", "We do not sell your data. We share it only with service providers who help us run the website and our business."],
  ["Your Choices", `Write to ${CONTACT.email} to access, correct or delete your information.`],
]);

export const dhTermsSections = legalPage("Terms & Conditions", "Terms that apply to using the Design House website and services.", [
  ["Use of the Website", "Content is for general information about our services and may change without notice."],
  ["Quotations", "Prices shared on the website or chat are indicative; a written quotation is final."],
  ["Intellectual Property", "Designs, images and content on this website belong to Design House India Pvt. Ltd."],
  ["Governing Law", "These terms are governed by the laws of India; courts at Ghaziabad have jurisdiction."],
]);

// ---------------------------------------------------------------------------------------------
// Page list and lookup
// ---------------------------------------------------------------------------------------------

/** [configKey, title, slug, type] — page ids are list positions, so append new pages at the end */
export const DH_PAGE_DEFINITIONS = [
  ["landingPage", "Home", "/", "home"],
  ["aboutPage", "About Us", "/about", "page"],
  ["teamPage", "Our Team", "/about/team", "page"],
  ["associatesPage", "Our Associates", "/about/associates", "page"],
  ["brandApproachPage", "Brand Conscious Approach", "/about/brand-approach", "page"],
  ["infrastructurePage", "Facility & Infrastructure", "/about/infrastructure", "page"],
  ["servicesPage", "Services", "/services", "page"],
  ["retailInteriorPage", "Retail Interior", "/services/retail-interior", "page"],
  ["corporateInteriorPage", "Corporate Interior", "/services/corporate-interior", "page"],
  ["restaurantInteriorPage", "Restaurant Interior", "/services/restaurant-interior", "page"],
  ["shopInShopPage", "Shop in Shop", "/services/shop-in-shop", "page"],
  ["retailDisplayPage", "Retail Display Merchandising", "/services/retail-display", "page"],
  ["retailKioskPage", "Retail Kiosk", "/services/retail-kiosk", "page"],
  ["exhibitionsPage", "Exhibitions & Events", "/services/exhibitions", "page"],
  ["signagePage", "Branding & Signage", "/services/signage", "page"],
  ["officeInteriorPage", "Office Interior", "/services/office-interior", "page"],
  ["portfolioPage", "Portfolio", "/portfolio", "page"],
  ["galleryPage", "Project Gallery", "/gallery", "page"],
  ["clientsPage", "Our Clients", "/clients", "page"],
  ["testimonialsPage", "Testimonials", "/testimonials", "page"],
  ["blogPage", "Blogs", "/blogs", "page"],
  ["careersPage", "Career", "/career", "page"],
  ["downloadsPage", "Downloads", "/downloads", "page"],
  ["contactPage", "Contact Us", "/contact", "page"],
  ["privacyPolicyPage", "Privacy Policy", "/privacy-policy", "page"],
  ["termsAndConditionsPage", "Terms & Conditions", "/terms-and-conditions", "page"],
] as const;

export const DH_DEFAULT_SECTIONS: Record<string, Section[]> = {
  landingPage: dhHomeSections,
  aboutPage: dhAboutSections,
  teamPage: dhTeamSections,
  associatesPage: dhAssociatesSections,
  brandApproachPage: dhBrandApproachSections,
  infrastructurePage: dhInfrastructureSections,
  servicesPage: dhServicesSections,
  ...dhServicePages,
  portfolioPage: dhPortfolioSections,
  galleryPage: dhGallerySections,
  clientsPage: dhClientsSections,
  testimonialsPage: dhTestimonialsSections,
  blogPage: dhBlogSections,
  careersPage: dhCareerSections,
  downloadsPage: dhDownloadsSections,
  contactPage: dhContactSections,
  privacyPolicyPage: dhPrivacySections,
  termsAndConditionsPage: dhTermsSections,
};
