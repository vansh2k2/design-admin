export interface ServiceDetailData {
  name: string;
  servicesCrumb?: boolean;
  hero: {
    eyebrow?: string;
    brandLogo?: { src: string; alt: string; width: number; height: number; tagline?: string };
    title: [string, string];
    tagline?: string;
    text: string;
    image: string;
    primaryCta?: { label: string; href: string };
    secondaryCtaLink?: { label: string; href: string };
    photoStyle?: "fade" | "cut";
    photoWords?: string[];
    secondaryCta?: boolean;
    features: { icon: string; label: string; text?: string }[];
  };
  why: {
    eyebrow?: string;
    layout?: "split" | "overview";
    title: [string, string];
    text: string;
    image: string;
    points: { icon: string; title: string; text: string }[];
  };
  process: {
    tone?: "white" | "warm";
    title: string;
    text: string;
    steps: { title: string; text: string }[];
  };
  projects: {
    eyebrow?: string;
    linkLabel?: string;
    title: string;
    text?: string;
    linkStyle?: "button" | "text";
    items: { title: string; place: string; image: string }[];
  };
  idealFor: {
    title: string[];
    text?: string;
    image?: string;
    items?: string[];
    tiles?: { icon: string; label: string }[];
    iconTone?: "gold" | "navy";
  };
  faqs: { q: string; a: string }[];
  faqHeading?: { title: string; text: string };
  faqStyle?: { numbered?: boolean; tone?: "white" | "blue" };
  ctaEyebrow?: string;
  ctaTitle: [string, string];
  ctaSubtitle?: string;
  ctaImage?: string;
  ctaImageAlt?: string;
}

export const DETAIL_SEEDS: Record<string, ServiceDetailData> = {
  "svc-1": {
    name: "Corporate Interiors",
    hero: {
      title: ["Corporate", "Interiors"],
      tagline: "Workspaces Designed for Productivity, Brand Identity and Growth.",
      text: "We create modern, functional and inspiring corporate spaces that reflect your brand culture and enhance team performance. From space planning to final execution, we deliver complete turnkey solutions tailored to your business needs.",
      image: "/services/detail/b2.webp",
      features: [
        { icon: "LayoutPanelTop", label: "Workspace\nPlanning" },
        { icon: "PencilRuler", label: "Modern Design\nSolutions" },
        { icon: "Settings", label: "End-to-End\nExecution" },
        { icon: "Clock", label: "On-Time\nDelivery" },
      ],
    },
    why: {
      title: ["Corporate Spaces", "That Perform"],
      text: "We combine design thinking, technical expertise and industry experience to create workspaces that are efficient, beautiful and future-ready.",
      image: "/services/detail/so1.webp",
      points: [
        { icon: "Gem", title: "Brand Focused\nDesign", text: "Workspaces that reflect your brand identity" },
        { icon: "LayoutGrid", title: "Optimized\nSpace Planning", text: "Better space utilization for higher productivity" },
        { icon: "Armchair", title: "Functional &\nErgonomic Layouts", text: "Comfortable and efficient work environments" },
        { icon: "BadgeCheck", title: "Quality &\nTimely Delivery", text: "Premium materials and on-time execution" },
      ],
    },
    process: {
      title: "From Planning to Possession",
      text: "A streamlined process to ensure a seamless experience.",
      steps: [
        { title: "Consultation", text: "Understand your needs, brand and goals" },
        { title: "Design & Planning", text: "Space planning, 3D visuals and material selection" },
        { title: "Execution", text: "In-house manufacturing and on-site installation" },
        { title: "Handover", text: "Quality check and timely delivery" },
      ],
    },
    projects: {
      title: "Our Corporate Interior Projects",
      text: "Explore some of our recently completed workspaces.",
      items: [
        { title: "IT Company Office", place: "Gurugram, Haryana", image: "/services/detail/hero-corporate-1.jpg" },
        { title: "Corporate Headquarters", place: "Delhi NCR", image: "/services/detail/co1.webp" },
        { title: "Co-working Space", place: "Noida, Uttar Pradesh", image: "/services/detail/co2.webp" },
        { title: "Consulting Firm Office", place: "Bengaluru, Karnataka", image: "/services/detail/co3.webp" },
      ],
    },
    idealFor: {
      title: ["Workspaces for Every", "Business Need"],
      text: "We design and build corporate interiors for:",
      image: "/services/detail/ws1.webp",
      items: [
        "IT & ITES Companies",
        "Consulting Firms",
        "Startups & Co-working Spaces",
        "Financial & Legal Offices",
        "Corporate Headquarters",
        "Educational & Institutional Offices",
        "And More...",
      ],
    },
    faqs: [
      {
        q: "Do you provide end-to-end turnkey solutions?",
        a: "Yes. We handle everything from space planning and design to in-house manufacturing, on-site execution and final handover, so you work with a single team throughout the project.",
      },
      {
        q: "Can you work with our existing office design?",
        a: "Yes. We can refresh or extend your existing interiors, reuse what works and redesign the areas that need improvement, while keeping the look consistent with your brand.",
      },
      {
        q: "How long does a typical project take?",
        a: "It depends on the size of the space, the scope of work and site conditions. After understanding your requirements we share a detailed schedule covering design, production and execution.",
      },
      {
        q: "Do you handle approvals and permissions?",
        a: "We coordinate with building management and prepare the drawings and documents needed for approvals. Specific requirements vary by building and city, and we guide you through each step.",
      },
    ],
    ctaTitle: ["Let's Discuss", "Your Workspace Project"],
  },

  "svc-2": {
    name: "Retail Showrooms",
    servicesCrumb: true,
    hero: {
      eyebrow: "Our Services",
      title: ["Retail", "Showrooms"],
      tagline: "Engaging Spaces for Memorable Customer Experiences",
      text: "We design and build retail showrooms that reflect your brand identity, enhance product display and create a seamless customer journey. From concept to execution, our turnkey solutions help you attract, engage and convert more customers.",
      image: "/services/detail/b1.webp",
      photoStyle: "cut",
      photoWords: ["Brands", "People", "Spaces"],
      secondaryCta: true,
      features: [
        { icon: "LayoutDashboard", label: "Store Design\n& Planning", text: "Layout and customer flow optimization" },
        { icon: "Boxes", label: "Display Fixtures", text: "Custom fixtures and visual merchandising" },
        { icon: "Lightbulb", label: "Lighting Solutions", text: "Product-focused lighting design" },
        { icon: "Gem", label: "Brand Experience", text: "Interiors that reflect your brand identity" },
        { icon: "Settings", label: "Turnkey Execution", text: "Design, manufacture and on-site installation" },
      ],
    },
    why: {
      eyebrow: "Overview",
      layout: "overview",
      title: ["Creating Retail Spaces", "That Drive Sales"],
      text: "From space planning to final execution, we create retail environments that combine functionality, aesthetics and brand storytelling. Our turnkey solutions are tailored to your products, target audience and business goals, ensuring a distinctive and high-performing showroom. With in-house manufacturing, smart display planning and careful attention to lighting and materials, every store we deliver is designed to attract shoppers, showcase products at their best and turn visits into lasting customer relationships.",
      image: "/services/detail/rs1.webp",
      points: [
        { icon: "Gem", title: "Brand Centric Design", text: "Spaces that reflect your brand values" },
        { icon: "LayoutGrid", title: "Optimized Space Planning", text: "Better product display and customer flow" },
        { icon: "Boxes", title: "Custom Display Solutions", text: "Fixtures tailored to your products" },
        { icon: "BadgeCheck", title: "Quality & Timely Delivery", text: "Premium materials and on-time execution" },
      ],
    },
    process: {
      tone: "warm",
      title: "From Concept to Opening",
      text: "A structured process to deliver a seamless retail showroom experience.",
      steps: [
        { title: "Consultation", text: "Understand your brand, products and store requirements" },
        { title: "Design & Planning", text: "Layout, 3D visuals and material selection" },
        { title: "Manufacturing & Execution", text: "In-house manufacturing and on-site installation" },
        { title: "Handover", text: "Final quality check and timely delivery" },
      ],
    },
    projects: {
      title: "Our Retail Showroom Projects",
      linkStyle: "text",
      items: [
        { title: "Fashion Brand Showroom", place: "Delhi NCR", image: "/services/detail/sr1.webp" },
        { title: "Electronics Showroom", place: "Gurugram, Haryana", image: "/services/detail/sr2.webp" },
        { title: "Lifestyle Store", place: "Noida, Uttar Pradesh", image: "/services/detail/sr3.webp" },
        { title: "Home Furnishing Showroom", place: "Bengaluru, Karnataka", image: "/services/detail/sr4.webp" },
      ],
    },
    idealFor: {
      title: ["Retail Spaces for Every Business Need"],
      tiles: [
        { icon: "Shirt", label: "Fashion &\nApparel Brands" },
        { icon: "Monitor", label: "Electronics\nShowrooms" },
        { icon: "Lamp", label: "Lifestyle\n& Home Decor" },
        { icon: "Diamond", label: "Jewellery\nShowrooms" },
        { icon: "Car", label: "Automotive\nShowrooms" },
        { icon: "ShoppingBag", label: "Premium & Luxury\nRetail Brands" },
      ],
    },
    faqHeading: {
      title: "Frequently Asked Questions",
      text: "Quick answers to common questions about our retail showroom services.",
    },
    faqStyle: { numbered: true, tone: "blue" },
    faqs: [
      {
        q: "What is included in a retail showroom turnkey solution?",
        a: "Store layout and space planning, interior design and 3D visuals, custom fixtures and display units, lighting, branding elements, in-house manufacturing, on-site installation and final handover.",
      },
      {
        q: "How much does a retail showroom project cost?",
        a: "The cost depends on the store size, design, materials, fixtures and scope of work. Share your requirements and we will prepare a detailed quotation for your showroom.",
      },
      {
        q: "How long does a typical project take?",
        a: "Timelines depend on the store size, design complexity and site readiness. After finalising the design we share a schedule covering production, installation and handover.",
      },
      {
        q: "Do you provide display fixtures and furniture?",
        a: "Yes. We design and manufacture custom display fixtures, shelving, counters and furniture in-house, tailored to your products and brand.",
      },
      {
        q: "Can you work with our existing space?",
        a: "Yes. We can renovate or reconfigure your existing showroom, reuse what works and upgrade the layout, fixtures and finishes to match your brand.",
      },
      {
        q: "Do you execute projects outside Delhi NCR?",
        a: "Yes. We execute and support retail projects across India, managing production, logistics and on-site installation wherever your store is located.",
      },
    ],
    ctaEyebrow: "Let's Discuss",
    ctaTitle: ["Your Workspace", "Project"],
  },

  "svc-3": {
    name: "Restaurant Interiors",
    hero: {
      eyebrow: "Our Services",
      title: ["Restaurant", "Interiors"],
      tagline: "Creating Dining Spaces That Leave a Lasting Impression",
      text: "We design and build restaurant interiors that combine aesthetics, functionality and brand identity. From concept to execution, our turnkey solutions create dining experiences that attract guests, enhance comfort and drive business growth.",
      image: "/services/detail/b3.webp",
      photoStyle: "cut",
      photoWords: ["Good", "Food", "Great", "Spaces"],
      secondaryCta: true,
      features: [
        { icon: "Palette", label: "Concept & Theme Design", text: "Unique dining experiences" },
        { icon: "LayoutGrid", label: "Space Planning", text: "Optimized layouts and seating" },
        { icon: "Armchair", label: "Custom Furniture", text: "Tables, seating and display elements" },
        { icon: "Lightbulb", label: "Lighting & Ambience", text: "Mood-enhancing design solutions" },
        { icon: "Settings", label: "Turnkey Execution", text: "Design, manufacture and on-site installation" },
      ],
    },
    why: {
      eyebrow: "Overview",
      layout: "overview",
      title: ["Designing Restaurants", "That Bring People Together"],
      text: "From boutique cafés to fine dining and QSRs, we create restaurant interiors that reflect your brand story, enhance customer experience and improve operational efficiency. Our end-to-end solutions are tailored to your concept, target audience and business goals. With in-house manufacturing, thoughtful seating layouts and careful attention to lighting, acoustics and materials, every restaurant we deliver is designed to welcome guests, support smooth service and turn first visits into loyal regulars.",
      image: "/services/detail/ri1.webp",
      points: [
        { icon: "Gem", title: "Brand Focused Design", text: "Spaces that tell your story" },
        { icon: "Users", title: "Efficient Space Planning", text: "Better seating and service flow" },
        { icon: "ShieldCheck", title: "Durable & Functional", text: "Materials for high-traffic restaurant environments" },
        { icon: "Clock", title: "On-Time Delivery", text: "Reliable execution with quality standards" },
      ],
    },
    process: {
      tone: "warm",
      title: "From Concept to Opening",
      text: "A structured process to ensure a seamless restaurant interior experience.",
      steps: [
        { title: "Consultation", text: "Understand your concept, brand and business goals" },
        { title: "Design & Planning", text: "Layout, 3D visuals and material selection" },
        { title: "Execution", text: "On-site manufacturing and installation" },
        { title: "Handover", text: "Final quality check and timely delivery" },
      ],
    },
    projects: {
      title: "Our Restaurant Interior Projects",
      linkStyle: "text",
      items: [
        { title: "Fine Dining Restaurant", place: "Delhi NCR", image: "/services/detail/ir1.webp" },
        { title: "Café & Bistro", place: "Gurugram, Haryana", image: "/services/detail/ir2.webp" },
        { title: "QSR Outlet", place: "Noida, Uttar Pradesh", image: "/services/detail/ir3.webp" },
        { title: "Bar & Lounge", place: "Bengaluru, Karnataka", image: "/services/detail/ir4.webp" },
      ],
    },
    idealFor: {
      title: ["Restaurant Spaces for Every Concept"],
      tiles: [
        { icon: "UtensilsCrossed", label: "Fine Dining\nRestaurants" },
        { icon: "Coffee", label: "Cafés & Bistros" },
        { icon: "Truck", label: "Quick Service\nRestaurants (QSR)" },
        { icon: "Wine", label: "Bars & Lounges" },
        { icon: "ChefHat", label: "Cloud Kitchens" },
        { icon: "Hotel", label: "Hotels & Resorts\nDining Spaces" },
      ],
    },
    faqHeading: {
      title: "Frequently Asked Questions",
      text: "Quick answers to common questions about our restaurant interior services.",
    },
    faqStyle: { numbered: true, tone: "blue" },
    faqs: [
      {
        q: "What is included in a restaurant interior turnkey solution?",
        a: "Concept and theme design, space planning, 3D visuals, custom furniture and fixtures, lighting, branding elements, in-house manufacturing, on-site installation and final handover.",
      },
      {
        q: "How much does a restaurant interior project cost?",
        a: "The cost depends on the size of the restaurant, the concept, materials, furniture and scope of work. Share your requirements and we will prepare a detailed quotation.",
      },
      {
        q: "How long does a typical restaurant project take?",
        a: "Timelines depend on the size, design complexity and site readiness. After finalising the design we share a schedule covering production, installation and handover.",
      },
      {
        q: "Do you provide custom furniture and display fixtures?",
        a: "Yes. We design and manufacture tables, seating, bar counters, display units and other fixtures in-house, tailored to your concept and brand.",
      },
      {
        q: "Can you work with an existing restaurant space?",
        a: "Yes. We can renovate or reconfigure your existing restaurant, reuse what works and upgrade the layout, furniture, lighting and finishes.",
      },
      {
        q: "Do you execute restaurant projects outside Delhi NCR?",
        a: "Yes. We execute and support restaurant projects across India, managing production, logistics and on-site installation wherever your outlet is located.",
      },
    ],
    ctaEyebrow: "Let's Discuss",
    ctaTitle: ["Your Restaurant", "Project"],
  },

  "svc-4": {
    name: "Exhibition Stall Design & Build",
    hero: {
      eyebrow: "Our Services",
      title: ["Exhibition Stall", "Design & Build"],
      tagline: "Creating Impactful Brand Experiences at Every Exhibition",
      text: "We design and build innovative exhibition stalls that attract visitors, showcase your brand and create meaningful business opportunities. From concept to execution, our turnkey solutions help you stand out at industry events across India.",
      image: "/services/detail/os4.webp",
      photoStyle: "cut",
      photoWords: ["Spaces", "Brands", "Experiences"],
      secondaryCta: true,
      features: [
        { icon: "Shapes", label: "Stall Concept Design", text: "Creative and functional designs" },
        { icon: "Box", label: "3D Visualization", text: "Realistic 3D concepts before execution" },
        { icon: "Hammer", label: "Fabrication & Build", text: "High-quality materials and finishing" },
        { icon: "Palette", label: "Graphics & Branding", text: "Eye-catching visuals and displays" },
        { icon: "Truck", label: "On-Site Execution", text: "Timely installation and support" },
      ],
    },
    why: {
      eyebrow: "Overview",
      layout: "overview",
      title: ["Exhibition Stalls", "That Showcase Your Brand"],
      text: "We create custom exhibition stalls that combine design, functionality and brand storytelling. Our end-to-end solutions are tailored to your products, target audience and event objectives, helping you make a strong impression and generate valuable business leads. With in-house fabrication, smart visitor flow and careful attention to lighting, graphics and finishes, every stall we deliver is designed to draw people in and turn conversations into lasting business relationships.",
      image: "/services/detail/es.webp",
      points: [
        { icon: "Gem", title: "Brand Focused Design", text: "Stalls that reflect your brand identity" },
        { icon: "Users", title: "Smart Space Planning", text: "Optimized layouts for better engagement" },
        { icon: "LayoutGrid", title: "Custom Fabrication", text: "Modular and reusable solutions" },
        { icon: "BadgeCheck", title: "Quality & Timely Delivery", text: "Professional execution with on-site support" },
      ],
    },
    process: {
      tone: "warm",
      title: "From Concept to Execution",
      text: "A streamlined process to ensure a successful exhibition experience.",
      steps: [
        { title: "Consultation", text: "Understand your goals, audience and event requirements" },
        { title: "Design & Planning", text: "Creative concept, 3D visuals and material selection" },
        { title: "Fabrication & Execution", text: "In-house manufacturing and on-site installation" },
        { title: "Event Support", text: "On-site supervision and dismantling" },
      ],
    },
    projects: {
      title: "Our Exhibition Stall Projects",
      linkStyle: "text",
      items: [
        { title: "Healthcare Exhibition Stall", place: "Pragati Maidan, New Delhi", image: "/services/detail/b4.webp" },
        { title: "Wellness Brand Stall", place: "India Expo Mart, Greater Noida", image: "/services/detail/exhibition.jpg" },
        { title: "Organic Products Stall", place: "Bharat Organic Expo", image: "/services/detail/os4.webp" },
        { title: "Corporate Brand Stall", place: "Mumbai Exhibition Centre", image: "/services/detail/t4.webp" },
      ],
    },
    idealFor: {
      title: ["Exhibition Stalls for Every Industry"],
      tiles: [
        { icon: "HeartPulse", label: "Healthcare\n& Wellness" },
        { icon: "Leaf", label: "Organic & Food\nProducts" },
        { icon: "Building2", label: "Real Estate\n& Infrastructure" },
        { icon: "ShoppingCart", label: "FMCG\n& Consumer Brands" },
        { icon: "Car", label: "Automotive\n& Mobility" },
        { icon: "GraduationCap", label: "Education\n& Institutions" },
        { icon: "Cpu", label: "Technology\n& Electronics" },
      ],
    },
    faqHeading: {
      title: "Frequently Asked Questions",
      text: "Quick answers to common questions about our exhibition stall services.",
    },
    faqStyle: { numbered: true, tone: "blue" },
    faqs: [
      {
        q: "What is included in an exhibition stall turnkey solution?",
        a: "Stall concept and 3D design, fabrication, graphics and branding, lighting, furniture, transport, on-site installation, event support and dismantling after the show.",
      },
      {
        q: "How much does an exhibition stall project cost?",
        a: "The cost depends on the stall size, design, materials, graphics and the event location. Share your requirements and we will prepare a detailed quotation for your stall.",
      },
      {
        q: "How long does it take to design and build a stall?",
        a: "It depends on the stall size, design complexity and the event date. Once the design is finalised we share a schedule for fabrication, transport and installation so the stall is ready on time.",
      },
      {
        q: "Do you provide 3D design and visualizations?",
        a: "Yes. We create 3D visuals of your stall so you can review the layout, branding and finishes before fabrication begins.",
      },
      {
        q: "Can you execute stalls outside Delhi NCR?",
        a: "Yes. We build and install exhibition stalls at venues across India, managing transport, installation and on-site support.",
      },
      {
        q: "Do you handle on-site installation and dismantling?",
        a: "Yes. Our team installs the stall before the event, supports you during the show and dismantles it once the event is over.",
      },
    ],
    ctaEyebrow: "Let's Discuss",
    ctaTitle: ["Your Exhibition", "Project"],
  },

  "svc-5": {
    name: "Retail Kiosks",
    hero: {
      eyebrow: "Our Services",
      title: ["Retail", "Kiosks"],
      tagline: "Compact Spaces, Big Brand Impact",
      text: "We design and build retail kiosks that create strong brand presence in high footfall locations such as malls, airports, metro stations and commercial complexes. Our turnkey solutions combine smart design, quality materials and efficient execution to help you engage customers and drive sales.",
      image: "/services/detail/os5.webp",
      photoStyle: "cut",
      photoWords: ["Natural", "Beauty", "Everyday"],
      secondaryCta: true,
      features: [
        { icon: "Shapes", label: "Kiosk Concept Design", text: "Creative and functional designs" },
        { icon: "LayoutGrid", label: "Space Optimization", text: "Smart layouts for small spaces" },
        { icon: "Hammer", label: "Custom Fabrication", text: "High-quality materials and finishing" },
        { icon: "Palette", label: "Branding & Graphics", text: "Eye-catching visuals and displays" },
        { icon: "Settings", label: "Turnkey Execution", text: "Design, manufacture and on-site installation" },
      ],
    },
    why: {
      eyebrow: "Overview",
      layout: "overview",
      title: ["Smart Retail Kiosks", "That Attract & Engage"],
      text: "From concept to installation, we create retail kiosks that maximize limited space, reflect your brand identity and deliver a compelling customer experience. Our end-to-end solutions are tailored to your products, location and business goals, ensuring a distinctive and high-performing kiosk. With in-house fabrication, modular construction and careful attention to lighting, graphics and finishes, every kiosk we deliver is designed to stand out in busy locations and turn passing footfall into loyal customers.",
      image: "/services/detail/rk.webp",
      points: [
        { icon: "Gem", title: "Brand Focused Design", text: "Kiosks that reflect your brand identity" },
        { icon: "LayoutGrid", title: "Efficient Layouts", text: "Better product display and customer flow" },
        { icon: "Boxes", title: "Durable & Modular", text: "High-quality and reusable structures" },
        { icon: "Clock", title: "On-Time Delivery", text: "Professional execution with on-site support" },
      ],
    },
    process: {
      tone: "warm",
      title: "From Concept to Installation",
      text: "A streamlined process to ensure a successful retail kiosk experience.",
      steps: [
        { title: "Consultation", text: "Understand your brand, products and location" },
        { title: "Design & Planning", text: "Creative concept, 3D visuals and material selection" },
        { title: "Fabrication & Production", text: "In-house manufacturing and quality checks" },
        { title: "Installation", text: "On-site setup and final handover" },
      ],
    },
    projects: {
      title: "Our Retail Kiosk Projects",
      linkStyle: "text",
      items: [
        { title: "Health & Wellness Kiosk", place: "DLF Mall, Noida", image: "/services/detail/kr1.webp" },
        { title: "Fashion & Accessories Kiosk", place: "Select Citywalk, Delhi", image: "/services/detail/kr2.webp" },
        { title: "Food & Beverage Kiosk", place: "Ambience Mall, Gurugram", image: "/services/detail/kr3.webp" },
        { title: "Electronics Kiosk", place: "Elante Mall, Chandigarh", image: "/services/detail/kr4.webp" },
      ],
    },
    idealFor: {
      title: ["Retail Kiosks for Every Business Need"],
      iconTone: "navy",
      tiles: [
        { icon: "ShoppingBag", label: "Fashion &\nAccessories" },
        { icon: "Coffee", label: "Food & Beverage" },
        { icon: "HeartPulse", label: "Health & Wellness\nProducts" },
        { icon: "Smartphone", label: "Electronics\n& Gadgets" },
        { icon: "Sparkles", label: "Cosmetics\n& Personal Care" },
        { icon: "Diamond", label: "Jewellery\n& Luxury Brands" },
      ],
    },
    faqHeading: {
      title: "Frequently Asked Questions",
      text: "Quick answers to common questions about our retail kiosk services.",
    },
    faqStyle: { numbered: true, tone: "blue" },
    faqs: [
      {
        q: "What is included in a retail kiosk turnkey solution?",
        a: "Kiosk concept and 3D design, fabrication, display units, lighting, graphics and branding, transport, on-site installation and final handover.",
      },
      {
        q: "How much does a retail kiosk project cost?",
        a: "The cost depends on the kiosk size, design, materials, finishes and location. Share your requirements and we will prepare a detailed quotation.",
      },
      {
        q: "How long does it take to design and build a kiosk?",
        a: "It depends on the kiosk size, design complexity and mall approvals. Once the design is finalised we share a schedule for fabrication and installation.",
      },
      {
        q: "Can you help with mall approvals and permissions?",
        a: "We prepare the drawings and details malls usually ask for and coordinate with the mall team. Requirements differ by mall, and we guide you through each step.",
      },
      {
        q: "Can you design a kiosk for my existing space?",
        a: "Yes. We design kiosks to fit the exact footprint, height limits and guidelines of your location, or refresh an existing kiosk with new branding and fixtures.",
      },
      {
        q: "Do you execute kiosks outside Delhi NCR?",
        a: "Yes. We build and install retail kiosks across India, managing transport, installation and on-site support.",
      },
    ],
    ctaEyebrow: "Let's Discuss",
    ctaTitle: ["Your Retail Kiosk", "Project"],
  },

  "svc-6": {
    name: "Display Fixtures",
    hero: {
      eyebrow: "Our Services",
      title: ["Display", "Fixtures"],
      tagline: "Custom Displays for Stronger Brands",
      text: "We design and manufacture high-quality display fixtures that showcase your products, enhance your brand identity and create engaging retail experiences. From concept to installation, our end-to-end solutions are tailored to your space, product range and business goals.",
      image: "/services/detail/os6.webp",
      photoStyle: "cut",
      secondaryCta: true,
      features: [
        { icon: "Shapes", label: "Display Concept Design", text: "Creative and functional display solutions" },
        { icon: "Hammer", label: "Custom Manufacturing", text: "Tailored to product and space requirements" },
        { icon: "Sparkles", label: "Material & Finishes", text: "Wide range of premium materials" },
        { icon: "Palette", label: "Branding Integration", text: "Consistent and impactful brand presentation" },
        { icon: "Truck", label: "Installation Support", text: "Professional execution and on-site installation" },
      ],
    },
    why: {
      eyebrow: "Overview",
      layout: "overview",
      title: ["Display Fixtures", "That Drive Sales"],
      text: "Our display fixtures combine design, functionality and durability to help your products stand out. Whether for retail stores, showrooms, exhibitions or branded environments, we create custom fixtures that enhance visibility, improve customer engagement and support your sales growth. With in-house manufacturing, modular construction and careful attention to lighting, materials and finishes, every fixture we deliver is built to present your products at their best and stay reliable through everyday use.",
      image: "/services/detail/dr.webp",
      points: [
        { icon: "Gem", title: "Product Focused Design", text: "Displays that highlight your products" },
        { icon: "LayoutGrid", title: "Flexible & Modular", text: "Adaptable to different spaces and product ranges" },
        { icon: "ShieldCheck", title: "Durable Construction", text: "High-quality materials and finishes" },
        { icon: "Boxes", title: "Customized Solutions", text: "Tailored to your brand and industry" },
        { icon: "Clock", title: "On-Time Delivery", text: "Efficient production and installation" },
      ],
    },
    process: {
      tone: "warm",
      title: "From Concept to Installation",
      text: "A streamlined process to deliver effective display fixtures.",
      steps: [
        { title: "Requirement Analysis", text: "Understand your products, brand and space" },
        { title: "Design & Visualization", text: "Concept design, 3D visuals and material selection" },
        { title: "Manufacturing", text: "In-house production with quality checks" },
        { title: "Installation", text: "On-site setup and final handover" },
      ],
    },
    projects: {
      title: "Our Display Fixture Projects",
      linkStyle: "text",
      items: [
        { title: "Apparel Store Displays", place: "DLF Mall, Noida", image: "/services/detail/ds1.png" },
        { title: "Cosmetics Display Fixtures", place: "Gurugram, Haryana", image: "/services/detail/ds2.webp" },
        { title: "Electronics Display", place: "Select Citywalk, Delhi", image: "/services/detail/ds3.webp" },
        { title: "Luxury Brand Displays", place: "Mumbai", image: "/services/detail/ds4.webp" },
      ],
    },
    idealFor: {
      title: ["Display Fixtures for Every Industry"],
      tiles: [
        { icon: "Shirt", label: "Fashion &\nApparel" },
        { icon: "Sparkles", label: "Cosmetics &\nPersonal Care" },
        { icon: "Smartphone", label: "Electronics &\nGadgets" },
        { icon: "UtensilsCrossed", label: "Food &\nBeverage" },
        { icon: "Sofa", label: "Home Décor &\nLifestyle" },
        { icon: "Diamond", label: "Jewellery &\nLuxury Brands" },
        { icon: "Pill", label: "Pharma &\nHealthcare" },
      ],
    },
    faqHeading: {
      title: "Frequently Asked Questions",
      text: "Quick answers to common questions about our display fixture services.",
    },
    faqStyle: { numbered: true, tone: "blue" },
    faqs: [
      {
        q: "What types of display fixtures do you manufacture?",
        a: "Wall shelving and gondolas, display tables, counters, showcases, product stands, kiosks and other custom fixtures for retail stores, showrooms and exhibitions.",
      },
      {
        q: "Can you customize fixtures for my brand?",
        a: "Yes. Every fixture is designed around your products, brand colours, logo and space, so it presents your range the way you want it seen.",
      },
      {
        q: "What materials and finishes are available?",
        a: "We work with wood, laminates, veneers, MS, SS, acrylic and glass, with a wide range of finishes. We help you choose what suits your products, usage and budget.",
      },
      {
        q: "Do you provide design and 3D visualization?",
        a: "Yes. We share concept designs and 3D visuals so you can review the fixtures and finishes before production starts.",
      },
      {
        q: "How long does production and installation take?",
        a: "It depends on the number of fixtures, design complexity and site readiness. After approvals we share a schedule for production and installation.",
      },
      {
        q: "Do you execute projects outside Delhi NCR?",
        a: "Yes. We deliver and install display fixtures across India, managing transport and on-site installation.",
      },
    ],
    ctaEyebrow: "Let's Discuss",
    ctaTitle: ["Your Display Fixture", "Project"],
  },

  "svc-7": {
    name: "Signage & Branding",
    hero: {
      eyebrow: "Our Services",
      title: ["Signage &", "Branding"],
      tagline: "Transforming Spaces into Powerful Brand Experiences",
      text: "We design and execute signage and branding solutions that strengthen your brand identity, create visibility and deliver a lasting impression. From indoor and outdoor signage to wayfinding and environmental graphics, our end-to-end solutions help businesses communicate effectively and stand out.",
      image: "/services/detail/vision.webp",
      photoStyle: "cut",
      photoWords: ["Spaces", "Brands", "Experiences"],
      secondaryCta: true,
      features: [
        { icon: "Gem", label: "Brand Identity\nSignage", text: "Building a strong brand presence" },
        { icon: "Layers", label: "Indoor Signage", text: "Reception, wall and directional signage" },
        { icon: "Building2", label: "Outdoor Signage", text: "Facades, pylon and hoarding solutions" },
        { icon: "SignpostBig", label: "Wayfinding Systems", text: "Clear navigation for better experience" },
        { icon: "Palette", label: "Environmental Graphics", text: "Wall graphics and brand storytelling" },
        { icon: "Settings", label: "Turnkey Execution", text: "Design, manufacture and installation" },
      ],
    },
    why: {
      eyebrow: "Overview",
      layout: "overview",
      title: ["Signage & Branding Solutions", "That Make an Impact"],
      text: "From concept to execution, we create custom signage and branding solutions that reflect your brand identity, enhance visibility and improve customer experience. Our integrated approach combines design, materials and technology to deliver high-quality, durable and visually engaging brand environments. With in-house fabrication, careful material selection and precise installation, every sign we deliver is designed to guide people, strengthen recognition and leave a lasting impression on everyone who sees it.",
      image: "/services/detail/sg.webp",
      points: [
        { icon: "Target", title: "Strategic Design", text: "Signage that aligns with your brand" },
        { icon: "Lightbulb", title: "Creative Concepts", text: "Unique and impactful designs" },
        { icon: "BadgeCheck", title: "High-Quality Materials", text: "Durable and premium finishes" },
        { icon: "Shapes", title: "Customized Solutions", text: "Tailored to your space and industry" },
        { icon: "Clock", title: "On-Time Execution", text: "Professional installation with quality standards" },
      ],
    },
    process: {
      tone: "warm",
      title: "From Concept to Completion",
      text: "A streamlined process to deliver effective signage and branding solutions.",
      steps: [
        { title: "Consultation", text: "Understand your brand, space and objectives" },
        { title: "Design & Planning", text: "Concept design, material selection and technical detailing" },
        { title: "Fabrication", text: "In-house production with quality checks" },
        { title: "Installation", text: "On-site execution and final handover" },
      ],
    },
    projects: {
      title: "Our Signage & Branding Projects",
      linkStyle: "text",
      items: [
        { title: "Retail Store Signage", place: "DLF Mall, Noida", image: "/services/detail/gs1.webp" },
        { title: "Office Branding", place: "Gurugram, Haryana", image: "/services/detail/gs2.webp" },
        { title: "Restaurant Signage", place: "Delhi NCR", image: "/services/detail/gs3.webp" },
        { title: "Wayfinding Systems", place: "Commercial Office, Noida", image: "/services/detail/gs4.webp" },
      ],
    },
    idealFor: {
      title: ["Signage & Branding for Every Business Need"],
      tiles: [
        { icon: "Store", label: "Retail Stores\n& Showrooms" },
        { icon: "Building2", label: "Corporate Offices\n& Business Parks" },
        { icon: "UtensilsCrossed", label: "Restaurants\n& Cafés" },
        { icon: "Hotel", label: "Hotels\n& Resorts" },
        { icon: "Hospital", label: "Hospitals\n& Clinics" },
        { icon: "GraduationCap", label: "Educational\nInstitutions" },
        { icon: "Presentation", label: "Exhibition Stalls\n& Events" },
      ],
    },
    faqHeading: {
      title: "Frequently Asked Questions",
      text: "Quick answers to common questions about our signage and branding services.",
    },
    faqStyle: { numbered: true, tone: "blue" },
    faqs: [
      {
        q: "What types of signage do you provide?",
        a: "Brand identity and reception signage, indoor and directional signs, outdoor facade, pylon and hoarding signage, wayfinding systems and environmental graphics.",
      },
      {
        q: "How much does a signage project cost?",
        a: "The cost depends on the type and size of signage, materials, lighting and the number of locations. Share your requirements and we will prepare a detailed quotation.",
      },
      {
        q: "How long does a typical signage project take?",
        a: "It depends on the scope, materials and number of signs. Once the design is approved we share a schedule for fabrication and installation.",
      },
      {
        q: "Do you provide design, fabrication and installation?",
        a: "Yes. We handle concept design, in-house fabrication and on-site installation, so the whole project is managed by one team.",
      },
      {
        q: "Can you work with our existing brand guidelines?",
        a: "Yes. We follow your logos, colours, fonts and brand guidelines so every sign stays consistent with your identity.",
      },
      {
        q: "Do you execute projects outside Delhi NCR?",
        a: "Yes. We fabricate and install signage across India, managing transport, installation and on-site support.",
      },
    ],
    ctaEyebrow: "Let's Discuss",
    ctaTitle: ["Your Signage & Branding", "Project"],
  },

  "svc-8": {
    name: "Manufacturing & Execution",
    hero: {
      eyebrow: "Our Services",
      title: ["Manufacturing &", "Execution"],
      tagline: "Turning Designs into Real Spaces",
      text: "We manufacture and execute high-quality interior solutions with precision, advanced technology and skilled workmanship. From custom furniture and display fixtures to complete turnkey execution, we ensure designs are delivered exactly as planned.",
      image: "/services/detail/os8.webp",
      photoStyle: "cut",
      photoWords: ["Design", "Manufacturing", "Execution", "Quality", "On Time"],
      secondaryCta: true,
      features: [
        { icon: "Armchair", label: "Custom Furniture\nManufacturing", text: "Office, retail & hospitality" },
        { icon: "Boxes", label: "Display Fixtures", text: "Kiosks, showcases and retail displays" },
        { icon: "Hammer", label: "Joinery & Woodwork", text: "Modular furniture and interior elements" },
        { icon: "Wrench", label: "Metal & Fabrication", text: "MS, SS and other fabrication works" },
        { icon: "Sparkles", label: "Quality & Finishing", text: "Premium materials and finish options" },
        { icon: "Settings", label: "Turnkey Execution", text: "Manufacture, deliver and on-site installation" },
      ],
    },
    why: {
      eyebrow: "Overview",
      layout: "overview",
      title: ["In-House Manufacturing", "for Better Results"],
      text: "Our in-house manufacturing and execution capabilities help us maintain quality, ensure timely delivery and offer customized solutions for every project. With modern machinery, experienced teams and strict quality checks, we convert concepts into high-quality, functional and aesthetically refined spaces. Because design, production and installation stay under one roof, we keep tight control over timelines and finishes, respond quickly to changes on site and deliver interiors that look exactly as they were planned.",
      image: "/services/detail/ma.webp",
      points: [
        { icon: "Factory", title: "Design to Production", text: "Seamless coordination from drawings to manufacturing" },
        { icon: "Shapes", title: "Custom & Modular", text: "Tailored to project requirements" },
        { icon: "BadgeCheck", title: "High-Quality Materials", text: "Durable and premium finishes" },
        { icon: "Users", title: "Skilled Execution Team", text: "Experienced craftsmen and technicians" },
        { icon: "Clock", title: "On-Time Delivery", text: "Efficient project management" },
      ],
    },
    process: {
      tone: "warm",
      title: "From Design to Handover",
      text: "A well-defined process to ensure quality manufacturing and flawless execution.",
      steps: [
        { title: "Design Finalization", text: "Approve drawings, materials and specifications" },
        { title: "Manufacturing", text: "In-house production with quality checks" },
        { title: "Site Execution", text: "Delivery, installation and finishing" },
        { title: "Handover", text: "Final inspection and project handover" },
      ],
    },
    projects: {
      title: "Our Manufacturing & Execution Projects",
      linkStyle: "text",
      items: [
        { title: "Office Furniture Manufacturing", place: "Delhi NCR", image: "/services/detail/am1.webp" },
        { title: "Retail Display Fixtures", place: "Gurugram, Haryana", image: "/services/detail/am2.webp" },
        { title: "Restaurant Joinery & Furniture", place: "Noida, Uttar Pradesh", image: "/services/detail/w2.webp" },
        { title: "Turnkey Interior Execution", place: "Bengaluru, Karnataka", image: "/services/detail/am4.webp" },
      ],
    },
    idealFor: {
      title: ["Manufacturing & Execution for Every Sector"],
      tiles: [
        { icon: "Building2", label: "Corporate Offices" },
        { icon: "Store", label: "Retail Stores\n& Showrooms" },
        { icon: "UtensilsCrossed", label: "Restaurants\n& Cafés" },
        { icon: "Hotel", label: "Hotels\n& Resorts" },
        { icon: "Hospital", label: "Hospitals\n& Clinics" },
        { icon: "GraduationCap", label: "Educational\nInstitutions" },
        { icon: "Presentation", label: "Exhibition Stalls\n& Kiosks" },
      ],
    },
    faqHeading: {
      title: "Frequently Asked Questions",
      text: "Quick answers to common questions about our manufacturing and execution services.",
    },
    faqStyle: { numbered: true, tone: "blue" },
    faqs: [
      {
        q: "What types of products do you manufacture?",
        a: "Office and hospitality furniture, retail display fixtures, kiosks and showcases, modular joinery, metal fabrication and other custom interior elements.",
      },
      {
        q: "Do you provide both manufacturing and on-site execution?",
        a: "Yes. We manufacture in-house and our own team handles delivery, installation and finishing on site, through to final handover.",
      },
      {
        q: "What materials and finishes are available?",
        a: "We work with wood, laminates, veneers, MS, SS, acrylic, glass and a wide range of finishes. We help you choose materials that suit your design, usage and budget.",
      },
      {
        q: "How do you ensure quality in manufacturing?",
        a: "Every project follows approved drawings and specifications, with quality checks during production and a final inspection before dispatch and handover.",
      },
      {
        q: "Can you work on customized designs?",
        a: "Yes. We manufacture to your custom drawings and specifications, or develop production drawings from your design concept.",
      },
      {
        q: "Do you execute projects outside Delhi NCR?",
        a: "Yes. We deliver and install projects across India, managing logistics and on-site execution wherever your space is located.",
      },
    ],
    ctaEyebrow: "Let's Discuss",
    ctaTitle: ["Your Manufacturing & Execution", "Project"],
  },

  "svc-9": {
    name: "Residential Interiors",
    hero: {
      eyebrow: "Our Services",
      title: ["Residential", "Interiors"],
      tagline: "Homes Designed Around You",
      text: "We design and execute beautiful, functional and personalized home interiors that reflect your lifestyle. From space planning to custom furniture, we create comfortable, elegant and timeless homes with end-to-end turnkey solutions.",
      image: "/services/detail/os9.webp",
      photoStyle: "cut",
      secondaryCta: true,
      features: [
        { icon: "LayoutGrid", label: "Space Planning", text: "Functional and beautiful layouts" },
        { icon: "Armchair", label: "Modular Furniture", text: "Custom and space-saving designs" },
        { icon: "Sparkles", label: "Premium Materials", text: "Wide range of finishes and textures" },
        { icon: "Lightbulb", label: "Lighting Design", text: "Aesthetic and practical solutions" },
        { icon: "Settings", label: "Turnkey Execution", text: "Design, build and installation" },
        { icon: "Headset", label: "After-Sales Support", text: "Assistance beyond project handover" },
      ],
    },
    why: {
      eyebrow: "Overview",
      layout: "overview",
      title: ["Creating Homes", "That Inspire"],
      text: "Every home has a story. We create residential interiors that combine aesthetics, comfort and smart design. Our team works closely with you to understand your needs and deliver tailored solutions for modern living. With in-house manufacturing, thoughtful storage planning and careful attention to lighting, materials and finishes, every home we deliver is designed to feel warm, work effortlessly for your family and stay beautiful for years to come.",
      image: "/services/detail/res.webp",
      points: [
        { icon: "Gem", title: "Personalized Design", text: "Interiors that match your lifestyle" },
        { icon: "LayoutGrid", title: "Better Space Utilization", text: "Smart storage and modular solutions" },
        { icon: "Sparkles", title: "Quality Craftsmanship", text: "Durable and premium finishes" },
        { icon: "Clock", title: "On-Time Delivery", text: "Professional execution with clear timelines" },
      ],
    },
    process: {
      tone: "warm",
      title: "From Concept to Home",
      text: "A streamlined process to turn your dream home into reality.",
      steps: [
        { title: "Consultation", text: "Understand your needs, style and budget" },
        { title: "Design & Planning", text: "Layouts, 3D visuals and material selection" },
        { title: "Execution", text: "In-house manufacturing and on-site installation" },
        { title: "Handover", text: "Final quality check and timely delivery" },
      ],
    },
    projects: {
      title: "Our Residential Interior Projects",
      linkStyle: "text",
      items: [
        { title: "Luxury Apartment", place: "Gurugram, Haryana", image: "/services/detail/res1.webp" },
        { title: "Independent Villa", place: "Noida, Uttar Pradesh", image: "/services/detail/res2.webp" },
        { title: "Penthouse Residence", place: "Delhi NCR", image: "/services/detail/res3.webp" },
        { title: "Builder Floor", place: "South Delhi", image: "/services/detail/res4.webp" },
      ],
    },
    idealFor: {
      title: ["Residential Spaces for Every Lifestyle"],
      iconTone: "navy",
      tiles: [
        { icon: "Building2", label: "Apartments\n& Flats" },
        { icon: "Home", label: "Independent\nVillas" },
        { icon: "Building", label: "Builder Floors" },
        { icon: "Hotel", label: "Penthouse\nResidences" },
        { icon: "Warehouse", label: "Farmhouses" },
        { icon: "Laptop", label: "Home Offices\n& Studios" },
      ],
    },
    faqHeading: {
      title: "Frequently Asked Questions",
      text: "Quick answers to common questions about our residential interior services.",
    },
    faqStyle: { numbered: true, tone: "blue" },
    faqs: [
      {
        q: "How much does a residential interior project cost?",
        a: "The cost depends on the size of your home, the rooms included, materials, finishes and furniture. Share your requirements and we will prepare a detailed quotation.",
      },
      {
        q: "How long does it take to complete a project?",
        a: "It depends on the scope of work and the size of your home. After finalising the design we share a clear schedule for production, installation and handover.",
      },
      {
        q: "Can you work with my existing furniture or space?",
        a: "Yes. We can plan around furniture you want to keep, refresh existing rooms and redesign only the areas that need it.",
      },
      {
        q: "Do you provide 3D design and material samples?",
        a: "Yes. We share 3D visuals of your rooms and material samples so you can see and feel the finishes before production starts.",
      },
      {
        q: "Do you handle turnkey execution?",
        a: "Yes. We manage everything from design and in-house manufacturing to on-site installation and final handover, so you deal with a single team.",
      },
      {
        q: "Do you execute projects outside Delhi NCR?",
        a: "Yes. We execute residential projects across India, managing production, delivery and installation wherever your home is located.",
      },
    ],
    ctaEyebrow: "Let's Discuss",
    ctaTitle: ["Your Dream Home", "Project"],
    ctaSubtitle: "Share your requirements with our team for a personalized solution.",
  },

  "svc-10": {
    name: "ENSIS",
    servicesCrumb: false,
    hero: {
      eyebrow: "Our Brand",
      brandLogo: {
        src: "/Ensis Panchakarma.png",
        alt: "ENSIS Panchkarma Solutions",
        width: 472,
        height: 193,
        tagline: "Wellness Furniture for Healthier Spaces",
      },
      title: ["Wellness Spaces", "Designed for Healing"],
      text: "Premium spa and panchkarma furniture that blends traditional wellness wisdom with modern design, durability and functionality.",
      image: "/services/detail/os10.webp",
      photoStyle: "cut",
      primaryCta: { label: "Explore Products", href: "#products" },
      secondaryCta: true,
      secondaryCtaLink: { label: "Our Projects", href: "/portfolio" },
      features: [
        { icon: "Flower2", label: "Traditional Design", text: "Modern Functionality" },
        { icon: "Gem", label: "Premium Materials", text: "and Finishes" },
        { icon: "Ruler", label: "Custom Designs", text: "as per Space" },
        { icon: "Leaf", label: "Suitable for Spas,", text: "Wellness Centres & Resorts" },
        { icon: "ShieldCheck", label: "Durable & Long Lasting", text: "Construction" },
        { icon: "Truck", label: "Pan India Delivery", text: "and Installation Support" },
      ],
    },
    why: {
      eyebrow: "Overview",
      layout: "overview",
      title: ["Wellness Furniture", "for Modern Spaces"],
      text: "ENSIS offers a complete range of spa and panchkarma furniture designed to create healing environments. Our products combine traditional therapies with ergonomic designs, premium materials and fine craftsmanship to deliver long-lasting value for wellness businesses. Every piece is made in-house to your layout and treatment needs, finished to suit your interiors and built to stay comfortable, hygienic and reliable through years of daily therapy sessions.",
      image: "/services/detail/os10.webp",
      points: [
        { icon: "Activity", title: "Functional & Ergonomic", text: "Designs" },
        { icon: "Trees", title: "High-Quality Teak Wood", text: "and Premium Finishes" },
        { icon: "Ruler", title: "Customisation for", text: "Your Space" },
        { icon: "Wrench", title: "Easy Maintenance", text: "& Durability" },
        { icon: "BadgeCheck", title: "Trusted by Wellness", text: "Professionals" },
        { icon: "Truck", title: "End-to-End Support", text: "from Design to Installation" },
      ],
    },
    process: {
      tone: "warm",
      title: "From Concept to Completion",
      text: "A streamlined process to deliver the perfect wellness space for your needs.",
      steps: [
        { title: "Consultation", text: "Understand your requirements and space" },
        { title: "Design & Planning", text: "Concept design, 3D visuals and material selection" },
        { title: "Manufacturing", text: "In-house production with quality checks" },
        { title: "Delivery & Installation", text: "Pan India delivery and on-site support" },
      ],
    },
    projects: {
      eyebrow: "Featured Products",
      linkLabel: "View All Products",
      title: "Our Product Range",
      linkStyle: "text",
      items: [
        { title: "Panchkarma Tables", place: "Authentic design for effective therapies", image: "/services/detail/en1.webp" },
        { title: "Massage Tables", place: "Comfortable and ergonomic solutions", image: "/services/detail/en2.webp" },
        { title: "Shirodhara Stands", place: "Durable and elegant structures", image: "/services/detail/en3.webp" },
        { title: "Spa Furniture", place: "Functional and stylish solutions", image: "/services/detail/en4.webp" },
        { title: "Steam & Wellness Units", place: "Customized wellness equipment", image: "/services/detail/en5.webp" },
        { title: "Accessories", place: "Complete range for spa & panchkarma", image: "/services/detail/en6.webp" },
      ],
    },
    idealFor: {
      title: ["Wellness Spaces Across Industries"],
      tiles: [
        { icon: "Sparkles", label: "Spas &\nWellness Centres" },
        { icon: "Flower2", label: "Ayurveda &\nPanchakarma Clinics" },
        { icon: "Hotel", label: "Resorts &\nHotels" },
        { icon: "Hospital", label: "Hospitals &\nHealthcare Centres" },
        { icon: "Dumbbell", label: "Fitness &\nRehabilitation Centres" },
        { icon: "Home", label: "Home Wellness\nSpaces" },
      ],
    },
    faqHeading: {
      title: "Frequently Asked Questions",
      text: "Quick answers to common questions about ENSIS products and services.",
    },
    faqStyle: { numbered: true, tone: "blue" },
    faqs: [
      {
        q: "What materials are used in ENSIS furniture?",
        a: "Our furniture is made with high-quality teak wood and other premium materials, with finishes chosen for durability and easy cleaning in wellness environments.",
      },
      {
        q: "Can the furniture be customised as per our space?",
        a: "Yes. We customise sizes, layouts and finishes to suit your treatment rooms, therapies and interior design.",
      },
      {
        q: "Do you provide installation support?",
        a: "Yes. We deliver and install the furniture on site and make sure everything is set up and ready to use.",
      },
      {
        q: "What is the product warranty?",
        a: "Warranty terms depend on the product. Our team will share the warranty details for each item along with your quotation.",
      },
      {
        q: "Do you supply for international projects?",
        a: "Please share your project location and requirements with our team, and we will confirm supply and delivery options for your project.",
      },
      {
        q: "Can you share product catalogues and pricing?",
        a: "Yes. You can download the ENSIS brochure from our Downloads page, and our team will share pricing based on your requirements.",
      },
    ],
    ctaEyebrow: "Let's Create Together",
    ctaTitle: ["Design Your Wellness Space with", "ENSIS"],
    ctaSubtitle: "Get customised spa and panchkarma furniture for your project.",
  },
};

export const emptyServiceDetail = (name: string): ServiceDetailData => ({
  name,
  hero: {
    title: [name, ""],
    text: "",
    image: "/services/os1.webp",
    features: [],
  },
  why: {
    title: ["", ""],
    text: "",
    image: "/services/os1.webp",
    points: [],
  },
  process: {
    title: "",
    text: "",
    steps: [],
  },
  projects: {
    title: "",
    items: [],
  },
  idealFor: {
    title: [""],
    items: [],
    tiles: [],
  },
  faqs: [],
  ctaTitle: ["", ""],
  ctaImage: "/assets/image/t2.webp",
  ctaImageAlt: "Let's Discuss Your Project Consultation Lounge",
});
