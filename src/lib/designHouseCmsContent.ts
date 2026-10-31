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
  phoneNumber: CONTACT.phone,
  contactEmail: CONTACT.email,
  marqueeText: "5000+ PROJECTS DELIVERED • PAN-INDIA EXECUTION • RETAIL | RESTAURANT | KIOSK | CORPORATE | EXHIBITION EXPERTS",
  ensisLogo: "/ensis.jpeg",
  logoImage: "/ensis.jpeg",
  externalLinkText: "Panchkarma Solution",
  externalLinkUrl: "https://ensis.in/",
};

const navbarSection: Section = {
  key: "navbar",
  name: "Header Navigation",
  enabled: true,
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
  ctaEyebrow: "Let's Build Together",
  ctaTitle: "Transforming Spaces. Delivering Impact.",
  ctaDescription: "<p>From retail environments to corporate spaces, we create functional, brand-driven and inspiring interiors across India.</p>",
  ctaButtonLabel: "Get Free Consultation",
  ctaButtonHref: "/contact",
  ctaBannerImage: "/assets/band.png",
  logoImage: img.logo,
  footBgImage: "/assets/icon/footb.png",
  description:
    "<p>Design House India Private Limited is a premier manufacturer of retail display solutions with nationwide reach — display merchandising, events, exhibitions, retail kiosks and turnkey interior projects.</p>",
  phoneNumber: "+91 93106 08427",
  altPhoneNumber: "+91 98102 47319",
  contactEmail: CONTACT.email,
  contactAddress: "Plot No. 12/29, Site-II Industrial Area, Loni Road, Mohan Nagar, Ghaziabad, Uttar Pradesh – 201007, India",
  websiteUrl: "www.designhouse.co.in",
  facebookUrl: "https://facebook.com/designhouseindia",
  instagramUrl: "https://instagram.com/designhouseindia",
  twitterUrl: "https://x.com/designhouseindia",
  youtubeUrl: "https://www.youtube.com/@designhouseindia",
  linkedinUrl: "https://linkedin.com/company/designhouseindia",
  items: [
    { label: "Corporate Interiors", href: "/services/corporate-interior" },
    { label: "Retail Showrooms", href: "/services/retail-interior" },
    { label: "Restaurant Interiors", href: "/services/restaurant-interior" },
    { label: "Exhibition Stalls", href: "/services/exhibitions" },
    { label: "Retail Kiosks", href: "/services/retail-kiosk" },
    { label: "Commercial Fit-Outs", href: "/services/office-interior" },
    { label: "Signage & Branding", href: "/services/signage" },
    { label: "Display Fixtures", href: "/services/retail-display" },
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
  { step: "01.", title: "Initial Consultation", description: "<p>We begin by understanding your vision, goals, and needs through detailed discussions and comprehensive site analysis.</p>", image: img.step("11--1--11zon-1773296151606-901598783.webp"), icon: "Users" },
  { step: "02.", title: "Design & Planning", description: "<p>Our creative team develops detailed architectural designs and plans that perfectly reflect your unique requirements.</p>", image: img.step("12-11zon-1773296157125-947285028.webp"), icon: "PenTool" },
  { step: "03.", title: "Implementation", description: "<p>With carefully selected contractors and premium materials, we manage every construction phase ensuring quality.</p>", image: img.step("13-11zon-1773296163346-888572927.webp"), icon: "Hammer" },
  { step: "04.", title: "Project Handover", description: "<p>Upon completion, we conduct thorough reviews and quality checks, ensuring every detail meets our standards.</p>", image: img.step("55-11zon-1773296170108-643309082.webp"), icon: "CheckCircle" },
];

const howWeWorkSection: Section = {
  key: "how-we-work",
  name: "How We Work",
  enabled: true,
  eyebrow: "HOW WE WORK",
  title: "Architecture Process For",
  highlightedWord: "Exceptional Results.",
  description:
    "<p>Our process is alive — adapting, refining, and growing with your vision. Every space we design balances aesthetics with functionality, and from concept to completion we focus on materials, lighting, and textures that elevate everyday living.</p>",
  quote: "Excellence in architecture is a journey of continuous refinement.",
  backgroundImage: "/h1-bg01-1.webp",
  items: PROCESS_STEPS,
};

const FAQS = [
  { question: "What services does Design House India provide?", answer: "<p>We offer end-to-end solutions for corporate interiors, retail showrooms, restaurant interiors, exhibition stall design and build, retail kiosks, and signage & branding. Our services include design, fabrication, manufacturing, installation and project management.</p>" },
  { question: "Do you have in-house manufacturing facilities?", answer: "<p>Yes. Our in-house manufacturing facility handles woodworking, metal fabrication, finishing, printing and signage, which lets us control quality and timelines from design through to installation.</p>" },
  { question: "How long does a typical project take to complete?", answer: "<p>Timelines depend on the size, scope and complexity of the project. Once we understand your requirements, we share a detailed schedule covering design, production and on-site execution.</p>" },
  { question: "Do you work across India?", answer: "<p>Yes. We execute and support projects across India, with our team managing production, logistics and on-site installation wherever your space is located.</p>" },
  { question: "Can you handle custom designs and brand-specific requirements?", answer: "<p>Absolutely. Every space we create is designed around your brand guidelines, functional needs and budget, from bespoke fixtures and furniture to custom signage and branding elements.</p>" },
  { question: "What information do you need to provide a quotation?", answer: "<p>Share the project type, location, approximate area, your design references or brand guidelines, the expected timeline and your budget range. Layouts or drawings, if available, help us quote more accurately.</p>" },
  { question: "Do you provide support after project completion?", answer: "<p>Yes. After handover we stay available for maintenance, repairs and any modifications, so your space keeps performing the way it should.</p>" },
];

const faqSection: Section = {
  key: "faqs",
  name: "Frequently Asked Questions",
  enabled: true,
  eyebrow: "FAQS",
  title: "Frequently",
  highlightedWord: "Asked Questions.",
  description: "<p>Find answers to common questions about our services, process, timelines and more. If you need further information, feel free to get in touch with our team.</p>",
  image: "/assets/image/faq.webp",
  helpBoxTitle: "Still Have Questions?",
  helpBoxDesc: "Our team is happy to help you with your project requirements.",
  helpButtonLabel: "Contact Us",
  helpButtonHref: "/contact",
  items: FAQS,
};

const clientsSection: Section = {
  key: "clients-marquee",
  name: "Our Clients (Trusted by Leading Brands)",
  enabled: true,
  eyebrow: "OUR CLIENTS",
  title: "Trusted by Leading Brands",
  highlightedWord: "Across India",
  description: "<p>We are proud to have partnered with reputed brands across diverse industries, delivering spaces that reflect their vision and values.</p>",
  buttonLabel: "View All Clients",
  buttonHref: "/clients",
  stat1Value: "850+",
  stat1Label: "Happy Clients",
  stat2Value: "5000+",
  stat2Label: "Projects Completed",
  stat3Value: "22+",
  stat3Label: "Years Experience",
  items: [
    { name: "Encodency Pvt. Ltd.", image: "/encodencylogo.jpeg", href: "/clients" },
    { name: "LG", image: img.client("logo39.png"), href: "/clients" },
    { name: "Nestlé", image: img.client("logo50.png"), href: "/clients" },
    { name: "Nokia", image: img.client("logo53.png"), href: "/clients" },
    { name: "L'Oréal", image: img.client("logo41.png"), href: "/clients" },
    { name: "Domino's Pizza", image: img.client("logo11.webp"), href: "/clients" },
    { name: "Dove", image: img.client("logo12.png"), href: "/clients" },
    { name: "Taco Bell", image: img.client("logo67.jpg"), href: "/clients" },
    { name: "FILA", image: img.client("logo20.png"), href: "/clients" },
    { name: "Hindware", image: img.client("logo29.png"), href: "/clients" },
    { name: "Keds", image: img.client("logo33.png"), href: "/clients" },
    { name: "Legrand", image: img.client("logo38.png"), href: "/clients" },
    { name: "Lipton", image: img.client("logo40.png"), href: "/clients" },
    { name: "McCain", image: img.client("logo45.png"), href: "/clients" },
    { name: "Revlon", image: img.client("logo58.png"), href: "/clients" },
    { name: "Trends", image: img.client("logo73.png"), href: "/clients" },
    { name: "Fastrack", image: img.client("logo17.png"), href: "/clients" },
    { name: "Barbeque Nation", image: img.client("logo1.png"), href: "/clients" },
    { name: "Chaayos", image: img.client("logo7.png"), href: "/clients" },
    { name: "Garnier", image: img.client("logo23.png"), href: "/clients" },
    { name: "Jubilant FoodWorks", image: img.client("logo32.jpg"), href: "/clients" },
    { name: "Sennheiser", image: img.client("logo60.webp"), href: "/clients" },
    { name: "Wahl", image: img.client("logo76.jpg"), href: "/clients" },
    { name: "DS Group", image: img.client("logo13.png"), href: "/clients" },
  ],
};

const testimonialsSection: Section = {
  key: "testimonials-carousel",
  name: "Testimonials (Client Reviews)",
  enabled: true,
  eyebrow: "TESTIMONIALS",
  title: "What Our Clients Say",
  highlightedWord: "About Us",
  description: "<p>Discover how we help leading enterprises and startups build spaces that leave lasting impressions.</p>",
  buttonLabel: "View All Reviews",
  buttonHref: "/testimonials",
  items: [
    { name: "Vansh Chaudhary", role: "CEO", company: "Vana Tech Labs", rating: "5", feedback: "<p>Design House transformed our flagship store into a stunning retail experience. Their attention to detail and creative vision exceeded all our expectations.</p>", image: "/assets/image/b2.webp" },
    { name: "Sadhana Chaudhary", role: "Director", company: "Tech Innovations", rating: "5", feedback: "<p>The corporate office they designed for us perfectly balances functionality with aesthetics. Our team loves coming to work now.</p>", image: "/assets/image/b1.webp" },
    { name: "Nitin Kumar", role: "Owner", company: "Gourmet Kitchen", rating: "5", feedback: "<p>Our restaurant's new interior has become a talking point among our guests. Exceptional workmanship and timely delivery.</p>", image: "/assets/image/b4.webp" },
    { name: "Anjali Chaudhary", role: "Director", company: "Vana Tech Labs", rating: "5", feedback: "<p>They delivered our retail kiosk project on time and within budget. Highly recommended for turnkey retail execution!</p>", image: "/assets/image/b5.webp" },
  ],
};

const statsSection: Section = {
  key: "stats-counter",
  name: "Stats Counter",
  enabled: true,
  eyebrow: "OUR TRACK RECORD",
  title: "Delivering Impact Across India",
  description: "<p>Two decades of transforming commercial spaces with unmatched manufacturing precision and pan-India project execution.</p>",
  items: [
    { value: "850", suffix: "+", label: "Happy Clients", description: "<p>Trusted partnerships nationwide across leading corporate and retail brands.</p>", icon: "Users", image: img.counter("counter-1773296258339-687232700.webp") },
    { value: "5000", suffix: "+", label: "Projects Completed", description: "<p>Delivering excellence every time in retail, corporate, and commercial sectors.</p>", icon: "Briefcase", image: img.counter("counter-1773296271111-237414885.webp") },
    { value: "98", suffix: "%", label: "Client Satisfaction", description: "<p>Quality guaranteed with rigorous craftsmanship and on-time handover.</p>", icon: "TrendingUp", image: img.counter("counter-1773296279647-6042072.webp") },
    { value: "40", suffix: "+", label: "Cities Covered", description: "<p>Pan-India execution network with dedicated fabrication facilities.</p>", icon: "Award", image: img.counter("counter-1773296288351-375512524.webp") },
  ],
};

const locationSection: Section = {
  key: "locations",
  name: "Our Presence (Offices & Map)",
  enabled: true,
  eyebrow: "OUR PRESENCE",
  title: "Visit Our Offices Across India",
  description: "<p>Visit our corporate headquarters, regional offices, or manufacturing units across Delhi-NCR and Mumbai.</p>",
  mapEmbedUrl: "https://maps.app.goo.gl/yhZmpyd3nzd9WHnR8",
  items: [
    { title: "Corporate Office", location: "Delhi-NCR, India", description: "<p>Plot No. 12/29, Site-II Industrial Area, Loni Road, Mohan Nagar, Ghaziabad, Uttar Pradesh – 201007, India</p>", image: "/assets/3_11zon.webp", buttonLabel: "Get Directions", buttonHref: "https://maps.app.goo.gl/yhZmpyd3nzd9WHnR8" },
    { title: "Regional Office", location: "Delhi, India", description: "<p>Ground Floor, E-1, Main Market, Opp. KFC, Kalkaji, New Delhi – 110019, India</p>", image: "/assets/5.jpg_11zon.jpeg", buttonLabel: "Get Directions", buttonHref: "https://maps.google.com" },
    { title: "Mumbai Branch Office", location: "Vasai-Virar, Mumbai", description: "<p>U/IT-II SR Compound, Plot No 49/459, Opp Dynamic Flow Company, Wakanpada Road, Vasai Phata, Vasai East – 401208, India</p>", image: "/assets/about3_11zon.webp", buttonLabel: "Get Directions", buttonHref: "https://maps.google.com" },
  ],
};

// ---------------------------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------------------------

const DEFAULT_HERO_SERVICES = {
  service1Label: "Retail\nInteriors",
  service1Href: "/services/retail-interior",
  service1Icon: "/assets/icon/icon1.png",
  service2Label: "Display\nSolutions",
  service2Href: "/services/retail-kiosk",
  service2Icon: "/assets/icon/icon2.png",
  service3Label: "Corporate\nInteriors",
  service3Href: "/services/corporate-interior",
  service3Icon: "/assets/icon/icon3.png",
  service4Label: "Exhibition\nStalls",
  service4Href: "/services/exhibitions",
  service4Icon: "/assets/icon/icon4.png",
  service5Label: "Manufacturing\n& Execution",
  service5Href: "/services",
  service5Icon: "/assets/icon/icon5.png",
};

const HERO_SLIDES = [
  {
    navLabel: "Retail Experiences",
    alt: "Retail store shelving and confectionery display fixtures by Design House",
    image: img.hero1,
    tagline: "Retail Interiors • Display Solutions • Turnkey Execution",
    headingLine1: "Designing",
    headingLine1Accent: false,
    headingLine2: "Retail Experiences",
    headingLine2Accent: true,
    headingLine3: "That Drive Sales.",
    headingLine3Accent: false,
    description: "<p>Innovative retail interiors and display solutions that attract customers and strengthen your brand.</p>",
    button1Text: "Discuss Your Retail Project",
    button1Href: "/contact",
    button2Text: "View Our Work",
    button2Href: "/portfolio",
    underline: true,
    uppercaseTitle: false,
    compact: true,
    badge: "",
    layout: "default",
    feature1Label: "",
    feature1Icon: "",
    feature2Label: "",
    feature2Icon: "",
    feature3Label: "",
    feature3Icon: "",
    feature4Label: "",
    feature4Icon: "",
    ...DEFAULT_HERO_SERVICES,
  },
  {
    navLabel: "Brand Spaces",
    alt: "Corporate interiors, office design and turnkey retail fit-outs by Design House",
    image: img.heroRestaurant,
    tagline: "Design • Manufacturing • Execution",
    headingLine1: "Spaces That",
    headingLine1Accent: false,
    headingLine2: "Build Brands",
    headingLine2Accent: true,
    headingLine3: "",
    headingLine3Accent: false,
    description: "<p>End-to-end interior, display and fit-out solutions for retail, corporate and commercial spaces across India.</p>",
    button1Text: "Discuss Your Project",
    button1Href: "/contact",
    button2Text: "Explore Our Work",
    button2Href: "/portfolio",
    underline: false,
    uppercaseTitle: true,
    compact: true,
    badge: "",
    layout: "default",
    feature1Label: "",
    feature1Icon: "",
    feature2Label: "",
    feature2Icon: "",
    feature3Label: "",
    feature3Icon: "",
    feature4Label: "",
    feature4Icon: "",
    ...DEFAULT_HERO_SERVICES,
  },
  {
    navLabel: "Retail Spaces",
    alt: "Premium watch store interior with glass display counters by Design House",
    image: img.heroRetail,
    tagline: "Retail Interiors • Display Solutions • Turnkey Execution",
    headingLine1: "Retail Spaces",
    headingLine1Accent: false,
    headingLine2: "That Sell.",
    headingLine2Accent: true,
    headingLine3: "",
    headingLine3Accent: false,
    description: "<p>Design, manufacturing and execution of premium retail interiors and display solutions for leading brands across India.</p>",
    button1Text: "Discuss Your Project",
    button1Href: "/contact",
    button2Text: "Explore Our Work",
    button2Href: "/portfolio",
    underline: true,
    uppercaseTitle: true,
    compact: true,
    badge: "",
    layout: "default",
    feature1Label: "",
    feature1Icon: "",
    feature2Label: "",
    feature2Icon: "",
    feature3Label: "",
    feature3Icon: "",
    feature4Label: "",
    feature4Icon: "",
    ...DEFAULT_HERO_SERVICES,
  },
  {
    navLabel: "Exhibition Stalls",
    alt: "Exhibition stall with wooden slat canopy, planters and reception counter, designed and built by Design House",
    image: img.heroExhibition,
    tagline: "Exhibition Stalls • Design • Fabrication",
    headingLine1: "Exhibition",
    headingLine1Accent: false,
    headingLine2: "Stall Design & Build",
    headingLine2Accent: true,
    headingLine3: "",
    headingLine3Accent: false,
    description: "<p>Showcase Your Brand. Create Impact. Build Business Connections.</p>",
    button1Text: "Discuss Your Stall Project",
    button1Href: "/contact",
    button2Text: "Explore Our Work",
    button2Href: "/services/exhibitions",
    underline: false,
    uppercaseTitle: true,
    compact: false,
    badge: "/assets/icon/icon4.png",
    layout: "top",
    feature1Label: "Custom Stall Design",
    feature1Icon: "/assets/icon/icon4.png",
    feature2Label: "Turnkey Fabrication",
    feature2Icon: "/assets/icon/icon5.png",
    feature3Label: "Pan-India Installation",
    feature3Icon: "/assets/icon/icon1.png",
    feature4Label: "Exhibitor Support",
    feature4Icon: "/assets/icon/icon3.png",
    ...DEFAULT_HERO_SERVICES,
  },
  {
    navLabel: "Retail Kiosks",
    alt: "Retail kiosk with wooden slat canopy and lit glass display counters in a shopping mall by Design House",
    image: img.heroKiosk,
    tagline: "Retail Kiosks • Design • Manufacturing",
    headingLine1: "Retail Kiosk",
    headingLine1Accent: false,
    headingLine2: "Design & Build",
    headingLine2Accent: true,
    headingLine3: "",
    headingLine3Accent: false,
    description: "<p>Smart Spaces for Stronger Brands</p>",
    button1Text: "Discuss Your Kiosk Project",
    button1Href: "/contact",
    button2Text: "Explore Our Work",
    button2Href: "/services/retail-kiosk",
    underline: true,
    uppercaseTitle: true,
    compact: false,
    badge: "",
    layout: "top",
    feature1Label: "Creative Designs",
    feature1Icon: "/assets/icon/icon1.png",
    feature2Label: "Functional Layouts",
    feature2Icon: "/assets/icon/icon2.png",
    feature3Label: "Quality Execution",
    feature3Icon: "/assets/icon/icon5.png",
    feature4Label: "Timely Delivery",
    feature4Icon: "/assets/icon/icon3.png",
    ...DEFAULT_HERO_SERVICES,
  },
  {
    navLabel: "Turnkey Interiors",
    alt: "Corporate interior design and turnkey fit-out by Design House",
    image: img.heroCorporate,
    tagline: "Corporate Interiors • Commercial Fit-Outs",
    headingLine1: "Exhibition Stall",
    headingLine1Accent: false,
    headingLine2: "Design & Build",
    headingLine2Accent: true,
    headingLine3: "",
    headingLine3Accent: false,
    description: "<p>Bringing your brand to life with innovative exhibition stands that inspire, engage and deliver results.</p>",
    button1Text: "Discuss Your Stall Project",
    button1Href: "/contact",
    button2Text: "Explore Our Work",
    button2Href: "/portfolio",
    underline: true,
    uppercaseTitle: true,
    compact: true,
    badge: "",
    layout: "default",
    feature1Label: "Creative Design Solutions",
    feature1Icon: "/assets/icon/icon4.png",
    feature2Label: "End-to-End Stall Fabrication",
    feature2Icon: "/assets/icon/icon5.png",
    feature3Label: "Customised Build Options",
    feature3Icon: "/assets/icon/icon2.png",
    feature4Label: "All Exhibitor Categories",
    feature4Icon: "/assets/icon/icon1.png",
    ...DEFAULT_HERO_SERVICES,
  },
];

const aboutSection: Section = {
  key: "about",
  name: "About Us",
  enabled: true,
  eyebrow: "ABOUT US",
  title: "Crafting Exceptional Spaces",
  highlightedWord: "Since 2004",
  description:
    "<p>Design House India Private Limited is a premier manufacturer of retail display solutions with nationwide reach. Our efficient production and distribution network delivers seamless solutions across India.</p><p>As a leading interior design company in Delhi, we specialize in Display Merchandising, Events, Exhibitions, Retail Kiosks, and Turnkey Projects with a team of qualified professionals.</p>",
  image1: "/assets/3_11zon.webp",
  image2: "/assets/5.jpg_11zon.jpeg",
  image3: "/assets/about3_11zon.webp",
  image4: "/assets/8_11zon.jpg",
  missionTitle: "Our Mission",
  missionContent:
    "<p>Deliver innovative designs that exceed expectations and create lasting value for our clients through exceptional craftsmanship.</p>",
  visionTitle: "Our Vision",
  visionContent:
    "<p>To be the most trusted interior design partner, transforming spaces into inspiring environments that elevate brands and lifestyles.</p>",
  buttonLabel: "Know More",
  buttonHref: "/about",
};

const FEATURED_SERVICES = [
  { num: "01", title: "Retail Kiosk", description: "<p>Industry-leading retail kiosk solutions that blend innovation with functionality to create exceptional customer experiences.</p>", image: img.service("service-1773296194261-324659476.webp"), icon: "ShoppingBag", href: "/services/retail-kiosk" },
  { num: "02", title: "Retail Display Merchandising", description: "<p>Strategic visual merchandising solutions that captivate customers and drive engagement through expert design.</p>", image: img.service("service-1773296202770-57270881.webp"), icon: "Store", href: "/services/retail-display" },
  { num: "03", title: "Modular Restaurant Furniture", description: "<p>Premium modular furniture that transforms dining spaces into memorable experiences with perfect aesthetics.</p>", image: img.service("service-1773296211354-324603922.webp"), icon: "Utensils", href: "/services/restaurant-interior" },
  { num: "04", title: "Retail & Corporate Interior", description: "<p>Sophisticated interior solutions that elevate your brand identity and create inspiring professional environments.</p>", image: img.service("service-1773296228195-425495051.webp"), icon: "Building", href: "/services/corporate-interior" },
  { num: "05", title: "Branding & Signages", description: "<p>Comprehensive branding solutions that communicate your story with clarity, impact, and lasting visual identity.</p>", image: img.service("service-1773296238967-886806710.webp"), icon: "Megaphone", href: "/services/signage" },
  { num: "06", title: "Exhibition & Events", description: "<p>Innovative exhibition designs that command attention and showcase your excellence at every event.</p>", image: img.service("service-1773296247763-953879891.webp"), icon: "Calendar", href: "/services/exhibitions" },
];

const featuredServicesSection: Section = {
  key: "featured-services",
  name: "Featured Services Carousel",
  enabled: true,
  eyebrow: "SERVICES WE DO",
  title: "Our Featured Services",
  highlightedWord: "& Transformations",
  description: "<p>Explore our turnkey interior design, retail display merchandising, kiosk fabrication, and brand architectural execution capabilities.</p>",
  buttonLabel: "View All Services",
  buttonHref: "/services",
  items: FEATURED_SERVICES,
};

const recentArticlesSection: Section = {
  key: "recent-articles",
  name: "Latest Blogs & Insights",
  enabled: true,
  eyebrow: "OUR BLOGS",
  title: "Read Our Latest",
  highlightedWord: "Articles",
  description: "<p>Latest published posts and insights from our interior design, architectural execution, and retail fixture experts.</p>",
  buttonLabel: "View All Articles",
  buttonHref: "/blogs",
  items: [
    { title: "How Thoughtful Office Interiors Boost Productivity", description: "<p>Discover how well-designed workspaces enhance employee focus, collaboration and overall performance.</p>", image: "/assets/image/b2.webp", date: "15 Oct 2026", category: "Corporate Interiors", href: "/blogs" },
    { title: "Key Elements of a Successful Retail Showroom Design", description: "<p>From layout to lighting, explore what makes a retail space attractive, functional and sales-driven.</p>", image: "/assets/image/b1.webp", date: "28 Sep 2026", category: "Retail Showrooms", href: "/blogs" },
    { title: "Tips for an Impactful Exhibition Stall Design", description: "<p>Learn how to create engaging exhibition spaces that attract visitors and strengthen brand presence.</p>", image: "/assets/image/b4.webp", date: "12 Sep 2026", category: "Exhibition Stalls", href: "/blogs" },
    { title: "Restaurant Interior Design Trends for 2026", description: "<p>Explore the latest design trends shaping modern dining spaces and elevating customer experiences.</p>", image: "/assets/image/b3.webp", date: "05 Sep 2026", category: "Restaurant Interiors", href: "/blogs" },
  ],
};

const whatWeDoSection: Section = {
  key: "what-we-do",
  name: "What We Do (Turnkey Spaces)",
  enabled: true,
  eyebrow: "WHAT WE DO",
  title: "Turnkey Spaces for",
  highlightedWord: "Every Business",
  description:
    "<p>From concept to creation, we design and build impactful spaces that enhance your brand, engage your customers and deliver real business value.</p>",
  buttonLabel: "View All Services",
  buttonHref: "/services",
  stat1Value: "21",
  stat1Suffix: "+",
  stat1Label: "Years of Experience",
  stat2Value: "5000",
  stat2Suffix: "+",
  stat2Label: "Projects Delivered",
  stat3Value: "10",
  stat3Suffix: "+",
  stat3Label: "Industry Categories",
  industriesTitle: "Industries We Serve",
  industriesList: "Corporate, Retail, Hospitality, Healthcare, Education, Exhibition, Wellness, Government, and More...",
  items: [
    {
      title: "Corporate Interiors",
      desc: "Workspaces that inspire performance.",
      image: "/assets/image/t1.webp",
      icon: "/assets/icon/z1.png",
      href: "/services/corporate-interior",
    },
    {
      title: "Retail Showroom Interiors",
      desc: "Engaging spaces that drive sales.",
      image: "/assets/image/t3.webp",
      icon: "/assets/icon/z2.png",
      href: "/services/retail-interior",
    },
    {
      title: "Restaurant Interiors",
      desc: "Inviting spaces for memorable experiences.",
      image: "/assets/image/t2.webp",
      icon: "/assets/icon/z3.png",
      href: "/services/restaurant-interior",
    },
    {
      title: "Exhibition Stall Design & Build",
      desc: "Custom stalls that make your brand stand out.",
      image: "/assets/image/t4.webp",
      icon: "/assets/icon/z4.png",
      href: "/services/exhibitions",
    },
    {
      title: "Retail Kiosks",
      desc: "Compact, high-impact brand spaces.",
      image: "/assets/image/t6.webp",
      icon: "/assets/icon/z5.png",
      href: "/services/retail-kiosk",
    },
    {
      title: "Signage & Branding",
      desc: "Visually strong brand presence.",
      image: "/assets/image/t5.webp",
      icon: "/assets/icon/z6.png",
      href: "/services/signage",
    },
  ],
};

const ourAchievementsSection: Section = {
  key: "our-achievements",
  name: "Our Achievements (Trust & Numbers)",
  enabled: true,
  eyebrow: "OUR ACHIEVEMENTS",
  title: "Numbers that Reflect",
  highlightedWord: "Your Trust in Us",
  description:
    "<p>Over the years, we have delivered successful interior and exhibition solutions for leading brands across India. Our focus on quality, creativity and timely execution has helped us build long-term relationships.</p>",
  backgroundImage: "/assets/banner/hero2.webp",
  items: [
    {
      id: "experience",
      end: 21,
      suffix: "+",
      label: "Years Experience",
      sublabel: "Industry leadership since 2004",
      image: "/assets/icon/s4.png",
    },
    {
      id: "clients",
      end: 500,
      suffix: "+",
      label: "Happy Clients",
      sublabel: "Trusted partnerships nationwide",
      image: "/assets/icon/s3.png",
    },
    {
      id: "projects",
      end: 5000,
      suffix: "+",
      label: "Projects Completed",
      sublabel: "Delivering excellence every time",
      image: "/assets/icon/s2.png",
    },
    {
      id: "satisfaction",
      end: 98,
      suffix: "%",
      label: "Client Satisfaction",
      sublabel: "Quality, commitment and trust",
      image: "/assets/icon/s1.png",
    },
  ],
};

const ourProjectsSection: Section = {
  key: "our-projects",
  name: "Our Projects (Portfolio Grid)",
  enabled: true,
  eyebrow: "OUR PROJECTS",
  title: "Spaces We Have",
  highlightedWord: "Brought to Life",
  description:
    "<p>From retail and corporate interiors to exhibition stalls and kiosks, explore some of our recently completed projects for leading brands across India.</p>",
  buttonLabel: "VIEW ALL PROJECTS",
  buttonHref: "/projects",
  items: [
    {
      id: "luxury-retail",
      category: "retail",
      title: "Luxury Retail Showroom",
      subtitle: "Retail Interiors",
      image: "/assets/image/b1.webp",
      href: "/services/retail-interior",
    },
    {
      id: "corporate-office",
      category: "corporate",
      title: "Corporate Office Interior",
      subtitle: "Corporate Interiors",
      image: "/assets/image/b2.webp",
      href: "/services/corporate-interior",
    },
    {
      id: "fine-dine",
      category: "restaurant",
      title: "Fine Dine Restaurant",
      subtitle: "Restaurant Interiors",
      image: "/assets/image/b3.webp",
      href: "/services/restaurant-interior",
    },
    {
      id: "exhibition-stall",
      category: "exhibition",
      title: "Exhibition Stall",
      subtitle: "Stall Design & Build",
      image: "/assets/image/b4.webp",
      href: "/services/exhibitions",
    },
    {
      id: "retail-kiosk",
      category: "kiosk",
      title: "Retail Kiosk",
      subtitle: "Retail Kiosk Design & Manufacturing",
      image: "/assets/image/b5.webp",
      href: "/services/retail-kiosk",
    },
    {
      id: "signage-branding",
      category: "signage",
      title: "Signage & Branding",
      subtitle: "Signage Solutions",
      image: "/assets/image/b6.webp",
      href: "/services/signage",
    },
    {
      id: "flagship-store",
      category: "retail",
      title: "Premium Flagship Store",
      subtitle: "Retail Interiors",
      image: "/assets/image/c1.webp",
      href: "/services/retail-interior",
    },
    {
      id: "tech-workspace",
      category: "corporate",
      title: "Tech Innovation Hub",
      subtitle: "Corporate Interiors",
      image: "/assets/image/c2.webp",
      href: "/services/corporate-interior",
    },
  ],
};

const whyChooseUsHomeSection: Section = {
  key: "why-choose-us",
  name: "Why Choose Us (Vision & Expertise)",
  enabled: true,
  eyebrow: "Why Choose Us",
  title: "Your Vision.",
  highlightedWord: "Our Expertise.",
  description:
    "<p>We combine creative design, in-house manufacturing and trusted execution to deliver spaces that are functional, brand-driven and built to last.</p>",
  image: "/assets/image/vision.webp",
  buttonLabel: "Get a Free Consultation",
  buttonHref: "/contact",
  secondaryButtonLabel: "Download Company Profile",
  secondaryButtonHref: "/downloads",
  promise1Title: "Customised\nDesign Approach",
  promise1Desc: "Tailored solutions to match your brand and space.",
  promise1Icon: "/assets/icon/v1.png",
  promise2Title: "Value for\nInvestment",
  promise2Desc: "Optimal design with efficient use of resources.",
  promise2Icon: "/assets/icon/v2.png",
  promise3Title: "Long-Term\nPartnership",
  promise3Desc: "We build lasting relationships with our clients.",
  promise3Icon: "/assets/icon/v3.png",
  items: [
    { title: "End-to-End Solutions", description: "Design, manufacturing and execution under one roof.", icon: "Lightbulb" },
    { title: "In-house Manufacturing", description: "Better quality control, faster turnaround and cost efficiency.", icon: "Settings" },
    { title: "Experienced Team", description: "Skilled designers, engineers and project managers with industry expertise.", icon: "Users" },
    { title: "Quality & Precision", description: "Attention to detail and high-quality finishing in every project.", icon: "BadgeCheck" },
    { title: "On-Time Delivery", description: "Efficient planning and execution to meet your deadlines.", icon: "Clock" },
    { title: "Pan India Presence", description: "Serving clients across India with reliable support and service.", icon: "Handshake" },
  ],
};

const capabilitiesHomeSection: Section = {
  key: "capabilities",
  name: "Capabilities (In-House Manufacturing)",
  enabled: true,
  eyebrow: "Manufacturing & Execution Capabilities",
  title: "Built In-House.",
  highlightedWord: "Delivered with Excellence.",
  description:
    "<p>Our in-house manufacturing facilities, skilled workforce and advanced machinery ensure superior quality, efficient execution and complete control from design to installation.</p>",
  image: "/assets/image/manu.webp",
  buttonLabel: "Explore Our Capabilities",
  buttonHref: "/about/infrastructure",
  stat1Value: "25,000+",
  stat1Label: "Sq. Ft. Facility",
  stat2Value: "100+",
  stat2Label: "Skilled Professionals",
  stat3Value: "Modern",
  stat3Label: "Machinery",
  stat4Value: "Quality",
  stat4Label: "Assurance",
  items: [
    { step: "01", title: "Material Selection", description: "Premium quality materials for lasting durability.", image: "/assets/image/w1.webp" },
    { step: "02", title: "Precision Cutting", description: "Advanced machinery for accurate fabrication.", image: "/assets/image/w2.webp" },
    { step: "03", title: "Custom Fabrication", description: "Skilled craftsmanship and attention to detail.", image: "/assets/image/w3.webp" },
    { step: "04", title: "Finishing & Polishing", description: "Superior finish with modern techniques.", image: "/assets/image/w4.webp" },
    { step: "05", title: "On-Site Installation", description: "Professional execution across India and abroad.", image: "/assets/image/w5.webp" },
  ],
};

const approachHomeSection: Section = {
  key: "our-approach",
  name: "Our Approach (5-Stage Turnkey Process)",
  enabled: true,
  eyebrow: "Our Approach",
  title: "Ideas. Design. Build.",
  highlightedWord: "Deliver.",
  description:
    "<p>A streamlined process that ensures creativity, quality and on-time delivery for spaces that elevate your brand.</p>",
  image: "/assets/image/approach.webp",
  tagline: "Your Vision, Our Expertise, Exceptional Spaces",
  items: [
    { step: "01", title: "Consultation", description: "Understanding your brand, goals and requirements.", image: "/assets/image/a1.webp", icon: "/assets/icon/a11.png" },
    { step: "02", title: "Design & Planning", description: "Creative concepts and detailed planning.", image: "/assets/image/a2.webp", icon: "/assets/icon/a22.png" },
    { step: "03", title: "Manufacturing", description: "Precision and quality production.", image: "/assets/image/a3.webp", icon: "/assets/icon/a33.png" },
    { step: "04", title: "Execution", description: "On-site installation and management.", image: "/assets/image/a4.webp", icon: "/assets/icon/a44.png" },
    { step: "05", title: "Handover & Support", description: "A space ready to perform with ongoing support.", image: "/assets/image/a5.webp", icon: "/assets/icon/a55.png" },
  ],
};

const featuredProjectsHomeSection: Section = {
  key: "featured-projects",
  name: "Featured Projects (Landmark Showcases)",
  enabled: true,
  eyebrow: "FEATURED PROJECTS",
  title: "Spaces That Create",
  highlightedWord: "Real Impact.",
  description:
    "<p>Explore our recent projects across corporate, retail, exhibition and hospitality spaces, designed and executed with creativity, precision and a focus on brand experience.</p>",
  buttonLabel: "View All Projects",
  buttonHref: "/projects",
  backgroundImage: "/assets/banner/bg-featured.webp",
  items: [
    {
      id: "corporate-office",
      category: "corporate",
      title: "Corporate Office Interiors",
      location: "Delhi NCR",
      area: "12,000 sq. ft.",
      scope: "Design & Build",
      image: "/assets/image/b2.webp",
      href: "/services/corporate-interior",
    },
    {
      id: "retail-showroom",
      category: "retail",
      title: "Retail Showroom Interiors",
      location: "Mumbai",
      area: "3,500 sq. ft.",
      scope: "Interior Fit-out",
      image: "/assets/image/b1.webp",
      href: "/services/retail-interior",
    },
    {
      id: "exhibition-stall",
      category: "exhibition",
      title: "Exhibition Stall Design & Build",
      location: "Pragati Maidan",
      area: "36 sq. mtr.",
      scope: "Design, Fabrication & Installation",
      image: "/assets/image/b4.webp",
      href: "/services/exhibitions",
    },
    {
      id: "retail-kiosk",
      category: "kiosk",
      title: "Retail Kiosk",
      location: "Noida",
      area: "9 sq. mtr.",
      scope: "Design & Build",
      image: "/assets/image/b5.webp",
      href: "/services/retail-kiosk",
    },
  ],
};

const ourStrengthsHomeSection: Section = {
  key: "our-strengths",
  name: "Our Strengths (Infrastructure & Track Record)",
  enabled: true,
  eyebrow: "Our Strengths",
  title: "Built on Experience.",
  highlightedWord: "Driven by Excellence.",
  description:
    "<p>Our strength lies in a robust infrastructure, a skilled and passionate team, and measurable capabilities that enable us to deliver world-class interior and exhibition solutions across India.</p>",
  image: "/assets/image/strengths.webp",
  stat1Value: "5000+",
  stat1Label: "Projects Delivered",
  stat2Value: "500+",
  stat2Label: "Happy Clients",
  stat3Value: "21+",
  stat3Label: "Years of Experience",
  stat4Value: "Pan India",
  stat4Label: "Execution & Support",
  items: [
    {
      title: "Company Infrastructure",
      tagline: "A strong foundation for quality and scale.",
      image: "/assets/image/s1.webp",
      points: "State-of-the-art manufacturing facility\nAdvanced woodworking & metal fabrication\nIn-house finishing, printing & signage\nLarge production capacity for pan India projects",
    },
    {
      title: "Our Team",
      tagline: "Experts who turn ideas into impactful spaces.",
      image: "/assets/image/s2.webp",
      points: "Skilled designers, engineers & project managers\nTrained production and installation team\nDedicated quality and safety personnel\nClient-centric approach with on-site support",
    },
    {
      title: "Measurable Capabilities",
      tagline: "Proven processes. Consistent results.",
      image: "/assets/image/s3.webp",
      points: "End-to-end design, manufacturing & execution\nMultiple projects delivered simultaneously\nPan India execution and support\nAdherence to global quality and safety standards",
    },
  ],
};

const getInTouchHomeSection: Section = {
  key: "get-in-touch",
  name: "Get In Touch (Book a Meeting & Form)",
  enabled: true,
  eyebrow: "Get In Touch",
  title: "Let's Discuss",
  highlightedWord: "Your Project",
  description:
    "<p>Whether you're looking for turnkey interior execution, retail kiosks, or exhibition stalls, our team is ready to bring your vision to reality.</p>",
  phoneNumber1: "+91 96549 00525",
  phoneNumber2: "+91 98102 47319",
  contactEmail: "info@designhouse.co.in",
  backgroundImage: "/assets/banner/touch.webp",
  formTitle: "Request a Free Consultation",
  formSubtitle: "Fill out the form below and our team will get in touch within 24 hours.",
  items: [
    { title: "Corporate Office", location: "Delhi-NCR, India", description: "<p>Plot No. 12/29, Site-II Industrial Area, Loni Road, Mohan Nagar, Ghaziabad, UP – 201007</p>" },
    { title: "Regional Office", location: "Kalkaji, Delhi, India", description: "<p>Ground Floor, E-1, Main Market, Opp. KFC, Kalkaji, New Delhi – 110019</p>" },
    { title: "Mumbai Branch Office", location: "Vasai-Virar", description: "<p>U/IT-II SR Compound, Plot No 49/459, Vasai Phata, Vasai East – 401208</p>" },
    { title: "Pan India Execution", location: "PAN India", description: "<p>Dedicated teams delivering projects across 40+ cities in India</p>" },
  ],
};

export const dhHomeSections: Section[] = [
  topbarSection,
  navbarSection,
  {
    key: "hero",
    name: "Hero Carousel Slides",
    enabled: true,
    service1Label: "Retail\nInteriors",
    service1Href: "/services/retail-interior",
    service1Icon: "/assets/icon/icon1.png",
    service2Label: "Display\nSolutions",
    service2Href: "/services/retail-kiosk",
    service2Icon: "/assets/icon/icon2.png",
    service3Label: "Corporate\nInteriors",
    service3Href: "/services/corporate-interior",
    service3Icon: "/assets/icon/icon3.png",
    service4Label: "Exhibition\nStalls",
    service4Href: "/services/exhibitions",
    service4Icon: "/assets/icon/icon4.png",
    service5Label: "Manufacturing\n& Execution",
    service5Href: "/services",
    service5Icon: "/assets/icon/icon5.png",
    slides: HERO_SLIDES,
  },
  whatWeDoSection,
  ourAchievementsSection,
  ourProjectsSection,
  whyChooseUsHomeSection,
  capabilitiesHomeSection,
  approachHomeSection,
  featuredProjectsHomeSection,
  ourStrengthsHomeSection,
  clientsSection,
  testimonialsSection,
  recentArticlesSection,
  faqSection,
  getInTouchHomeSection,
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
];

export const dhTeamSections: Section[] = [pageHero("Our", "Team", "The people behind 5000+ projects.", img.project("team-review.webp")), teamSection, ctaSection()];

export const dhAssociatesSections: Section[] = [
  pageHero("Our", "Associates", "Partners and associate companies that help us deliver end-to-end projects.", img.project("team-planning.webp")),
  { key: "associates", name: "Associate Companies", enabled: true, eyebrow: "OUR ASSOCIATES", title: "Working Together", items: [{ title: "Ensis Panchakarma", description: "Spa and wellness interiors partner.", image: "/images/dh/projects/residential-living-room.jpg" }, { title: "Lumina LED Systems", description: "Architectural and display lighting.", image: "/images/dh/projects/retail-luxury-display.jpg" }] },
];

export const dhBrandApproachSections: Section[] = [
  pageHero("Brand Conscious", "Approach", "Every space we design starts with your brand — its story, customers and goals.", img.project("retail-footwear-store.jpg")),
  { key: "brand-approach", name: "Brand Conscious Approach", enabled: true, eyebrow: "OUR APPROACH", title: "Design That Builds Brands", description: "We translate brand guidelines into materials, lighting, fixtures and customer journeys so every store looks and feels on-brand.", items: [{ title: "Understand the brand", description: "Workshops with your brand and retail teams." }, { title: "Design the journey", description: "Layouts that guide customers to hero products." }, { title: "Build consistently", description: "Master designs and modular fixtures for every rollout." }] },
  ctaSection(),
];

export const dhInfrastructureSections: Section[] = [
  pageHero("Facility &", "Infrastructure", "In-house manufacturing for retail fixtures, kiosks, furniture and exhibition stalls.", img.project("team-3d-modelling.webp")),
  { key: "facility", name: "Facility & Infrastructure", enabled: true, eyebrow: "OUR FACTORY", title: "Built In-House", description: "Our Ghaziabad facility houses woodworking, metal fabrication, acrylic, paint and assembly units with dedicated quality control.", items: [{ title: "Woodworking", description: "CNC panel saws, edge banding and pressing lines." }, { title: "Metal Fabrication", description: "Cutting, bending, welding and powder coating." }, { title: "Acrylic & Signage", description: "Laser cutting, routing and LED assembly." }, { title: "Quality Control", description: "Pre-dispatch checks for every fixture." }] },
  statsSection,
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
  manufacturingPage: servicePage({ title: "Manufacturing &", highlight: "Execution", intro: "In-house manufacturing and professional execution to ensure quality and timely delivery.", image: img.hero1, offerings: ["In-house joinery & metal works", "Fixture & furniture manufacturing", "Quality checks at every stage", "Site installation", "Project management & handover"], gallery: ["office-workstations.jpg", "retail-wooden-shelving.jpg"] }),
  residentialInteriorPage: servicePage({ title: "Residential", highlight: "Interiors", intro: "Beautiful, functional and timeless homes designed to reflect your lifestyle.", image: img.hero1, offerings: ["Space planning", "Modular kitchens & wardrobes", "Living & bedroom interiors", "Lighting & false ceilings", "Turnkey execution"], gallery: ["corporate-office-lounge.jpg"] }),
  ensisPage: servicePage({ title: "Spa & Panchkarma", highlight: "Furniture", intro: "ENSIS — premium spa and panchkarma furniture that blends traditional wellness practices with modern design.", image: img.hero1, offerings: ["Panchkarma droni tables", "Spa & massage beds", "Therapy room furniture", "Custom finishes & sizes", "Delivery & installation"], gallery: [] }),
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
];

export const dhGallerySections: Section[] = [
  pageHero("Project", "Gallery", "Photos from our recent projects — managed in the Media Library.", img.project("restaurant-dining-hall.jpg")),
  { key: "gallery-intro", name: "Gallery Introduction", enabled: true, title: "Our Work in Pictures", description: "Images are picked from the Media Library by category." },
];

export const dhClientsSections: Section[] = [
  pageHero("Trusted By", "Premium Brands", "Leading brands across retail, QSR, FMCG and lifestyle trust Design House.", img.project("brand-store-facade.webp")),
  clientsSection,
  testimonialsSection,
];

export const dhTestimonialsSections: Section[] = [pageHero("Client", "Testimonials", "What our clients say about working with us.", img.project("corporate-office-lounge.jpg")), testimonialsSection, ctaSection()];

export const dhBlogSections: Section[] = [
  pageHero("Our", "Blogs", "Interior design ideas, retail trends and project insights.", img.project("residential-living-room.jpg")),
  { key: "blog-listing", name: "Blog Listing", enabled: true, title: "Latest Articles", description: "Posts are managed in Blog & Insights.", buttonLabel: "Load More", buttonHref: "" },
];

export const dhCareerSections: Section[] = [
  {
    key: "career-hero",
    name: "Career Hero",
    enabled: true,
    eyebrow: "Careers at Design House",
    title: "Be a Part of a Bigger and Brighter Tomorrow",
    highlightedText: "Bigger and Brighter",
    description: "Join Design House and help create innovative, sustainable spaces — retail stores, offices and interiors that make a lasting difference for brands, people and communities.",
    buttonLabel: "Explore Opportunities",
    buttonHref: "#openings",
    image: "/assets/career.webp",
    alt: "Design House office building",
    items: [
      { label: "Innovative Work", icon: "/assets/icon/1.png", alt: "Innovative Work Icon" },
      { label: "Collaborative Team", icon: "/assets/icon/2.png", alt: "Collaborative Team Icon" },
      { label: "Sustainable Impact", icon: "/assets/icon/3.png", alt: "Sustainable Impact Icon" },
      { label: "Growth Opportunities", icon: "/assets/icon/4.png", alt: "Growth Opportunities Icon" },
    ],
  },
  {
    key: "current-openings",
    name: "Current Openings",
    enabled: true,
    eyebrow: "Current Openings",
    title: "Join Our Team",
    description: "Explore exciting career opportunities and be part of a team that is shaping a better, more sustainable tomorrow.",
    quote: "Great spaces are built by great people, together.",
    emptyTitle: "No Open Positions at the Moment",
    emptyDescription: "We appreciate your interest in joining Design House India Pvt. Ltd. Please check back soon for new opportunities.",
  },
  {
    key: "why-work-with-us",
    name: "Why Work With Us",
    enabled: true,
    eyebrow: "Why Work With Design House",
    title: "A Meaningful Career, A Greater Impact",
    highlightedText: "A Greater Impact",
    description: "At Design House, you will be part of a passionate and dedicated team that designs innovative, sustainable and future-ready infrastructure solutions, shaping better communities for tomorrow.",
    items: [
      { title: "Purpose-Driven Work", text: "Contribute to projects that create lasting value for brands and communities.", icon: "/assets/icon/5.png", alt: "Purpose-Driven Work Icon" },
      { title: "Supportive Team Environment", text: "Work with collaborative and diverse teams who inspire growth.", icon: "/assets/icon/2.png", alt: "Supportive Team Environment Icon" },
      { title: "Learning & Growth", text: "Develop your skills with continuous learning and new challenges.", icon: "/assets/icon/3.png", alt: "Learning & Growth Icon" },
      { title: "Real-World Impact", text: "Be part of infrastructure solutions that build better spaces for tomorrow.", icon: "/assets/icon/4.png", alt: "Real-World Impact Icon" },
    ],
  },
  {
    key: "life-at-design-house",
    name: "Life at Design House",
    enabled: true,
    eyebrow: "Life at Design House",
    title: "People. Purpose. A Brighter Tomorrow.",
    highlightedText: "A Brighter Tomorrow.",
    description: "Our team works with creativity, commitment and a shared purpose — to design spaces that improve lives and create long-term value for communities.",
    items: [
      { title: "Team Reviewing Building Design", image: "/assets/image/5.webp", alt: "Design House team reviewing a building design" },
      { title: "Team Member At Work", image: "/assets/image/2.webp", alt: "Design House team member at work" },
      { title: "Team Discussing Project Plans", image: "/assets/image/3.webp", alt: "Design House team discussing project plans" },
      { title: "Office Lounge", image: "/assets/image/6.webp", alt: "Design House office lounge" },
    ],
  },
  {
    key: "career-cta",
    name: "Call to Action Banner",
    enabled: true,
    title: "Be Part of Something Bigger",
    highlightedText: "Bigger",
    description: "Join Design House and help us create innovative, sustainable and people-centric spaces for a better tomorrow.",
    buttonLabel: "Explore Opportunities",
    buttonHref: "#openings",
    image: "/assets/image/7.webp",
    alt: "Design House workspace",
  },
];

export const dhDownloadsSections: Section[] = [
  {
    key: "downloads-hero",
    name: "Downloads Hero Banner",
    enabled: true,
    eyebrow: "Downloads",
    title: "Our Company",
    highlightedWord: "Profiles & Brochures",
    description: "Explore and download our company profiles and brand brochures to know more about our businesses and capabilities.",
    image: "/assets/banner/downloads.webp",
    alt: "Design House India Downloads and Company Brochures Banner",
    heroWords: "Spaces, Brands, Businesses, People",
  },
  {
    key: "downloads",
    name: "Company Profiles & Brochures Grid",
    enabled: true,
    eyebrow: "DOWNLOADS",
    title: "Our Company Profiles & Brochures",
    description: "Explore and download our company profiles and brand brochures to know more about our businesses and capabilities.",
    items: [
      {
        title: "Company Profile",
        coverTitle: "Company\nProfile",
        desc: "Complete overview of our company, capabilities and business verticals.",
        fileUrl: "/downloads/dhipl-profile.pdf",
        size: "13.4 MB",
        cardImage: "/assets/image/vision.webp",
        imageAlt: "Design House India Company Profile",
        action: "Download Profile",
        accent: true,
        category: "Company Profile",
        status: "Active",
      },
      {
        title: "Office Furniture",
        coverTitle: "Office\nFurniture",
        desc: "Workstations, cabins and seating solutions for modern offices.",
        fileUrl: "/downloads/ebrochures/office furniture.pdf",
        size: "15.9 MB",
        cardImage: "/assets/7.jpg",
        imageAlt: "Office Furniture Brochure",
        action: "Download Brochure",
        category: "E-Brochure",
        status: "Active",
      },
      {
        title: "Modular Furniture",
        coverTitle: "Modular\nFurniture",
        desc: "Modular furniture designed for everyday function and style.",
        fileUrl: "/downloads/ebrochures/Modular Furniture.pdf",
        size: "1.4 MB",
        cardImage: "/assets/hero-interior-1.jpg",
        imageAlt: "Modular Furniture Brochure",
        action: "Download Brochure",
        category: "E-Brochure",
        status: "Active",
      },
      {
        title: "Modular Kitchen",
        coverTitle: "Modular\nKitchen",
        desc: "Functional and elegant modular kitchen designs.",
        fileUrl: "/downloads/ebrochures/Modular Kitchen.pdf",
        size: "1.2 MB",
        cardImage: "/assets/cara1.jpg",
        imageAlt: "Modular Kitchen Brochure",
        action: "Download Brochure",
        category: "E-Brochure",
        status: "Active",
      },
      {
        title: "ENSIS Brochure",
        coverTitle: "Spa & Panchkarma\nFurniture",
        desc: "Premium spa and Panchkarma furniture solutions.",
        fileUrl: "/downloads/ebrochures/e-broucher.pdf",
        size: "3.2 MB",
        cardImage: "/assets/about1.webp",
        imageAlt: "ENSIS Spa and Panchkarma Furniture Brochure",
        action: "Download Brochure",
        ensis: true,
        category: "E-Brochure",
        status: "Active",
      },
      {
        title: "Corporate Interior Newsletter",
        coverTitle: "Corporate\nInteriors",
        desc: "Highlights from our corporate interior projects.",
        fileUrl: "/downloads/newsletter/corprate_nov.pdf",
        size: "303 KB",
        cardImage: "/assets/hero-corporate-1.jpg",
        imageAlt: "Corporate Interior Newsletter",
        action: "Download Newsletter",
        category: "Newsletter",
        status: "Active",
      },
      {
        title: "Residential Interior Newsletter",
        coverTitle: "Residential\nInteriors",
        desc: "Highlights from our residential interior projects.",
        fileUrl: "/downloads/newsletter/residential_nov.pdf",
        size: "1.8 MB",
        cardImage: "/assets/about2.webp",
        imageAlt: "Residential Interior Newsletter",
        action: "Download Newsletter",
        category: "Newsletter",
        status: "Active",
      },
      {
        title: "Retail Showroom Interiors",
        coverTitle: "Retail\nShowroom\nInteriors",
        desc: "Design and build solutions for retail stores and showrooms.",
        fileUrl: "",
        size: "",
        cardImage: "/assets/image/b1.webp",
        imageAlt: "Retail Showroom Interiors",
        action: "Coming Soon",
        category: "Coming Soon",
        status: "Coming Soon",
      },
      {
        title: "Restaurant & Hospitality",
        coverTitle: "Restaurant &\nHospitality\nInteriors",
        desc: "Creating memorable dining and hospitality experiences.",
        fileUrl: "",
        size: "",
        cardImage: "/assets/image/b3.webp",
        imageAlt: "Restaurant and Hospitality Interiors",
        action: "Coming Soon",
        category: "Coming Soon",
        status: "Coming Soon",
      },
      {
        title: "Exhibition Stall Design",
        coverTitle: "Exhibition\nStall Design\n& Build",
        desc: "Innovative exhibition stalls and brand environments.",
        fileUrl: "",
        size: "",
        cardImage: "/assets/image/b4.webp",
        imageAlt: "Exhibition Stall Design and Build",
        action: "Coming Soon",
        category: "Coming Soon",
        status: "Coming Soon",
      },
    ],
  },
];

const contactHeroSection: Section = {
  key: "contact-hero",
  name: "Contact Hero Banner",
  enabled: true,
  eyebrow: "Contact Us",
  title: "Let's Build",
  highlightedWord: "Your Next Space",
  description:
    "From concept to completion, our team is here to understand your requirements and create the right solution for your brand.",
  image: "/assets/banner/contact.webp",
  imageAlt: "Design House India reception and office",
  items: [
    { label: "Discuss\nYour Idea", icon: "MapPin" },
    { label: "Expert\nGuidance", icon: "ClipboardPen" },
    { label: "End-to-End\nSupport", icon: "MessageCircleMore" },
  ],
};

const contactInfoSection: Section = {
  key: "contact-info",
  name: "Direct Contact Information",
  enabled: true,
  eyebrow: "Get in Touch",
  title: "We're Here to Help",
  description:
    "Have a project in mind or need expert advice? Our team will be happy to assist you with design, manufacturing and execution tailored to your requirements.",
  phoneNumber1: "+91 9654900525",
  phoneNumber2: "+91 9810247319",
  contactEmail: "info@designhouse.co.in",
  workingHoursWeekday: "Monday – Saturday: 9:00 AM – 6:00 PM",
  workingHoursWeekend: "Sunday: Closed",
};

const contactFormSection: Section = {
  key: "contact-form",
  name: "Contact & Enquiry Form",
  enabled: true,
  eyebrow: "Send Us a Message",
  title: "Enquire Now",
  description:
    "Share your requirements and we will get back to you shortly.",
  submitLabel: "Send Enquiry",
  securityNote:
    "Your information is safe with us. We typically respond during business hours.",
  successTitle: "Enquiry Sent!",
  successMessage:
    "Thank you for contacting us. Our team will get back to you within 24 hours.",
};

const contactOfficesSection: Section = {
  key: "offices",
  name: "Our Regional Offices",
  enabled: true,
  eyebrow: "Our Offices",
  title: "Visit Us",
  description:
    "Meet our team at any of our locations or get in touch to schedule a discussion.",
  items: [
    {
      label: "Head Office",
      city: "Ghaziabad",
      lines: "Plot No. 12/29, Site-II Industrial Area,\nLoni Road, Mohan Nagar, Ghaziabad,\nUttar Pradesh 201007, India",
      query: "Design House India Pvt Ltd, Plot No. 12/29, Site-II Industrial Area, Loni Road, Mohan Nagar, Ghaziabad 201007",
      image: "/assets/image/c1.webp",
      imageAlt: "Design House Ghaziabad office",
      buttonLabel: "Get Directions",
      buttonHref: "https://www.google.com/maps/search/?api=1&query=Design+House+India+Pvt+Ltd%2C+Plot+No.+12%2F29%2C+Site-II+Industrial+Area%2C+Loni+Road%2C+Mohan+Nagar%2C+Ghaziabad+201007",
    },
    {
      label: "Delhi Branch",
      city: "New Delhi",
      lines: "Ground Floor, Main Market, E-1,\nopposite KFC, Kalkaji,\nNew Delhi 110019, India",
      query: "Ground Floor, Main Market, E-1, opposite KFC, Kalkaji, New Delhi 110019",
      image: "/assets/image/c2.webp",
      imageAlt: "Design House Delhi Kalkaji office",
      buttonLabel: "Get Directions",
      buttonHref: "https://www.google.com/maps/search/?api=1&query=Ground+Floor%2C+Main+Market%2C+E-1%2C+opposite+KFC%2C+Kalkaji%2C+New+Delhi+110019",
    },
    {
      label: "Mumbai Branch",
      city: "Vasai East",
      lines: "U/IT-II SR Compound, Plot No. 49/459,\nOpp. Dynamic Flow Company,\nWakanpada Road, Vasai Phata,\nVasai East – 401208, India",
      query: "SR Compound, Wakanpada Road, Vasai Phata, Vasai East 401208",
      image: "/assets/image/c3.webp",
      imageAlt: "Design House Mumbai Vasai office",
      buttonLabel: "Get Directions",
      buttonHref: "https://www.google.com/maps/search/?api=1&query=SR+Compound%2C+Wakanpada+Road%2C+Vasai+Phata%2C+Vasai+East+401208",
    },
  ],
};

const contactMapSection: Section = {
  key: "contact-map",
  name: "Find Us on Map & Directions",
  enabled: true,
  eyebrow: "Our Location",
  title: "Find Us on Map",
  description:
    "Our head office is located in Ghaziabad, with branch offices in New Delhi and Mumbai.",
  buttonLabel: "Open in Google Maps",
  buttonHref: "https://www.google.com/maps/search/?api=1&query=Design+House+India+Pvt+Ltd%2C+Plot+No.+12%2F29%2C+Site-II+Industrial+Area%2C+Loni+Road%2C+Mohan+Nagar%2C+Ghaziabad+201007",
  mapEmbedUrl: "https://maps.google.com/maps?q=Design+House+India+Pvt+Ltd%2C+Mohan+Nagar%2C+Ghaziabad&z=15&output=embed",
};

export const dhContactSections: Section[] = [
  topbarSection,
  navbarSection,
  contactHeroSection,
  contactInfoSection,
  contactFormSection,
  contactOfficesSection,
  contactMapSection,
  footerSection,
];

const legalPage = (title: string, intro: string, points: [string, string][]): Section[] => [
  pageHero("", title, intro, img.project("office-lounge-seating.webp")),
  { key: "legal-content", name: `${title} Content`, enabled: true, title, description: intro, items: points.map(([heading, text]) => ({ title: heading, description: text })) },
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

export const dhDisclaimerSections = legalPage("Disclaimer", "Important information about the use of this website and its content.", [
  ["General Information", "All content on this website is provided in good faith for general information and showcase purposes only."],
  ["Project Images & Intellectual Property", "Project images, designs and creative content belong to Design House India Pvt. Ltd. or their respective owners."],
  ["External Links", "Links to third-party websites are for convenience; we are not responsible for their content or practices."],
  ["No Professional Advice", "The content does not constitute professional, legal or commercial advice. Contact our team for project-specific guidance."],
  ["Limitation of Liability", "Design House India Pvt. Ltd. is not liable for any damages arising from the use of this website."],
  ["Changes to This Disclaimer", "We may update this disclaimer from time to time without prior notice."],
]);

// ---------------------------------------------------------------------------------------------
// Page list and lookup
// ---------------------------------------------------------------------------------------------

/**
 * [configKey, title, slug, type] — the pages of the website, in the order of its menu.
 * Also the "Select Template" choices in the page editor. Saved content is kept per configKey.
 */
export const DH_PAGE_DEFINITIONS = [
  ["landingPage", "Home", "/", "home"],
  ["aboutPage", "About", "/about", "page"],
  ["servicesPage", "Our Services", "/services", "page"],
  ["corporateInteriorPage", "Corporate Interiors", "/services/corporate-interiors", "page"],
  ["retailInteriorPage", "Retail Showroom Interiors", "/services/retail-showrooms", "page"],
  ["restaurantInteriorPage", "Restaurant Interiors", "/services/restaurant-interiors", "page"],
  ["exhibitionsPage", "Exhibition Stall Design & Build", "/services/exhibition-stalls", "page"],
  ["retailKioskPage", "Retail Kiosks", "/services/retail-kiosks", "page"],
  ["retailDisplayPage", "Retail Display Fixtures", "/services/display-fixtures", "page"],
  ["signagePage", "Signage & Branding", "/services/signage-branding", "page"],
  ["manufacturingPage", "Manufacturing & Execution", "/services/manufacturing-execution", "page"],
  ["residentialInteriorPage", "Residential Interiors", "/services/residential-interiors", "page"],
  ["ensisPage", "Spa & Panchkarma Furniture (ENSIS)", "/services/ensis", "page"],
  ["projectsPage", "Projects", "/projects", "page"],
  ["clientsPage", "Clients", "/clients", "page"],
  ["careersPage", "Career", "/career", "page"],
  ["blogPage", "Blogs", "/blogs", "page"],
  ["downloadsPage", "Downloads", "/downloads", "page"],
  ["contactPage", "Contact Us", "/contact", "page"],
  ["privacyPolicyPage", "Privacy Policy", "/privacy-policy", "page"],
  ["termsAndConditionsPage", "Terms & Conditions", "/terms-and-conditions", "page"],
  ["disclaimerPage", "Disclaimer", "/disclaimer", "page"],
] as const;

export const DH_DEFAULT_SECTIONS: Record<string, Section[]> = {
  landingPage: dhHomeSections,
  home: dhHomeSections,
  homepage: dhHomeSections,
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
  contactPage: dhContactSections,
  contact: dhContactSections,
  "contact-us": dhContactSections,
  privacyPolicyPage: dhPrivacySections,
  termsAndConditionsPage: dhTermsSections,
  projectsPage: dhPortfolioSections,
  downloadsPage: dhDownloadsSections,
  disclaimerPage: dhDisclaimerSections,
};
