export const images = {
  hero: "https://images.unsplash.com/photo-1618522755367-bcbb050438b6?auto=format&fit=crop&w=1400&q=85",
  necklace:
    "https://images.unsplash.com/photo-1643300866907-032b3baeeb1f?auto=format&fit=crop&w=900&q=85",
  ring: "https://images.unsplash.com/photo-1611540497578-4cb17aa00718?auto=format&fit=crop&w=900&q=85",
  detail:
    "https://images.unsplash.com/photo-1587636874655-3e2c869b0cf9?auto=format&fit=crop&w=900&q=85",
  bracelet:
    "https://images.unsplash.com/photo-1613759699364-1fe64c4b645f?auto=format&fit=crop&w=900&q=85",
  earrings:
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=85",
  gold: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85",
  craft:
    "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?auto=format&fit=crop&w=900&q=85",
  temple:
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=900&q=85",
  pearlbox:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85",
};

const seeds = [
  ["Aarohi Diamond Solitaire", "Rings", 68500, images.ring, "18K Gold • VS Diamond"],
  ["Maya Temple Pendant", "Necklaces", 124000, images.necklace, "22K Gold • Ruby"],
  ["Kumari Pearl Drops", "Earrings", 42000, images.earrings, "18K Gold • Freshwater Pearl"],
  ["Newa Heritage Cuff", "Bracelets", 79500, images.bracelet, "18K Gold • Hand-finished"],
  ["Saanvi Halo Ring", "Rings", 98000, images.ring, "18K Gold • VS Diamond"],
  ["Lalit Emerald Choker", "Necklaces", 198000, images.necklace, "22K Gold • Colombian Emerald"],
  ["Ritu Jhumka Earrings", "Earrings", 56000, images.earrings, "22K Gold • Pearl"],
  ["Asha Chain Bracelet", "Bracelets", 64000, images.bracelet, "18K Gold • Polished"],
  ["Devika Stack Ring", "Rings", 38500, images.ring, "18K Gold • Champagne Diamond"],
  ["Tara Heritage Collar", "Necklaces", 245000, images.necklace, "22K Gold • Ruby & Pearl"],
  ["Nisha Sunburst Studs", "Earrings", 47500, images.earrings, "18K Gold • Diamond"],
  ["Veda Vine Bangle", "Bracelets", 72000, images.bracelet, "22K Gold • Hand-carved"],
  ["Ishara Sapphire Band", "Rings", 112000, images.gold, "18K Gold • Ceylon Sapphire"],
  ["Pema Lotus Locket", "Necklaces", 89000, images.gold, "22K Gold • Hand-engraved"],
  ["Sarita Chandbali Hoops", "Earrings", 67500, images.earrings, "22K Gold • Temple Work"],
  ["Kiran Rope Bangle", "Bracelets", 54000, images.bracelet, "18K Gold • Rope Twist"],
  ["Anaya Promise Ring", "Rings", 45000, images.ring, "18K Gold • Diamond Accent"],
  ["Gita Bridal Set", "Necklaces", 285000, images.necklace, "22K Gold • Bridal Suite"],
  ["Binita Diamond Tops", "Earrings", 39500, images.earrings, "18K Gold • Diamond Studs"],
  ["Hira Tennis Bracelet", "Bracelets", 135000, images.bracelet, "18K Gold • Diamond Line"],
  ["Yuna Eternity Ring", "Rings", 76000, images.gold, "18K Gold • Pavé Band"],
  ["Sushma Pearl Strand", "Necklaces", 156000, images.necklace, "Freshwater Pearl • Gold Clasp"],
  ["Elina Martini Studs", "Earrings", 33000, images.earrings, "18K Gold • Minimal"],
  ["Ojas Kara Bangle", "Bracelets", 88000, images.bracelet, "22K Gold • Classic Kara"],
];

export const galleryFor = (category, main) => {
  switch (category) {
    case "Rings":
      return [main, images.gold, images.detail];
    case "Necklaces":
      return [main, images.detail, images.gold];
    case "Earrings":
      return [main, images.detail, images.gold];
    case "Bracelets":
      return [main, images.detail, images.gold];
    default:
      return [main, images.detail, images.gold];
  }
};

const descriptionFor = (category, material) => {
  switch (category) {
    case "Rings":
      return `A hand-finished ring in ${material.split("•")[0].trim()}, made to mark promises, milestones and everyday rituals. Balanced for comfort, built to be worn daily.`;
    case "Necklaces":
      return `A considered necklace in ${material.split("•")[0].trim()}, designed to sit beautifully whether worn alone or layered. A quiet heirloom for ceremonies and keepsakes.`;
    case "Earrings":
      return `Light on the ear and precise in the making — earrings in ${material.split("•")[0].trim()} that move from daytime rituals to evening gatherings with ease.`;
    case "Bracelets":
      return `A bracelet in ${material.split("•")[0].trim()} with a soft, hand-polished finish. Stack it, gift it, or wear it as your everyday signature.`;
    default:
      return "A considered heirloom shaped by Siraha craft and a quietly modern sensibility. Designed to be worn, kept and passed on.";
  }
};

export const products = seeds.map((p, i) => ({
  id: `TD-${String(i + 1).padStart(3, "0")}`,
  name: p[0],
  category: p[1],
  price: p[2],
  image: p[3],
  gallery: galleryFor(p[1], p[3]),
  material: p[4],
  badge: i < 4 ? "Signature" : i % 5 === 0 ? "New" : i % 7 === 0 ? "Bestseller" : "",
  description: descriptionFor(p[1], p[4]),
  details: [
    `Purity: ${p[4].includes("22K") ? "22K hallmarked gold" : "18K hallmarked gold"}`,
    "Hand-finished by Tridev artisans in Siraha",
    "Complimentary insured delivery across Nepal",
    "7-day easy exchange · lifetime buyback assurance",
  ],
  weight: `${(4 + (i % 8) * 1.2).toFixed(1)} g approx.`,
  stock: 3 + ((i * 7) % 9),
  rating: 4 + ((i * 3) % 2) * 0.5,
  reviews: 12 + ((i * 13) % 80),
}));

export const formatNpr = (value) => `NPR ${Number(value).toLocaleString("en-IN")}`;

export const categories = ["All pieces", "Rings", "Necklaces", "Earrings", "Bracelets"];

export const collections = [
  {
    id: "heirloom",
    title: "The Heirloom Edit",
    subtitle: "Enduring forms, reimagined",
    image: images.necklace,
    description: "Temple-inspired necklaces, collars and chokers made for ceremonies and keepsakes.",
  },
  {
    id: "new-moon",
    title: "New Moon",
    subtitle: "A study in silver light",
    image: images.ring,
    description: "Solitaires, halos and pavé bands in restrained, modern silhouettes.",
  },
  {
    id: "ceremony",
    title: "The Ceremony",
    subtitle: "For every kind of beginning",
    image: images.detail,
    description: "Bridal suites, jhumkas and bangles chosen for weddings and milestones.",
  },
];

export const journalPosts = [
  {
    id: "anatomy-of-heirloom",
    index: "01",
    tag: "CRAFT",
    title: "The anatomy of an heirloom",
    excerpt: "What makes a jewel worth keeping for a hundred years? Our makers explain.",
    image: images.detail,
    readTime: "6 min read",
    body: [
      "An heirloom is not declared — it is decided, decades later, by the hands that refuse to let it go. In our atelier we design backwards from that moment: will the clasp survive ten thousand openings? Will the stone sit as honestly in fifty years as it does today? If the answer is anything but yes, the sketch goes back to the bench.",
      "We build for longevity in three quiet ways. First, weight: a Tridev band carries enough gold to be resized, repaired and re-polished across generations. Second, setting: stones are seated deep with hand-cut bearings rather than glued or rushed — a slower method that holds through daily wear. Third, finish: high-polish surfaces can always be restored, but texture and engraving must be cut once, correctly.",
      "Ask any of our makers what they are proudest of and they will not point at a showcase. They will tell you about a grandmother's bangle, worn thin at the edges, brought in for its third restoration — and handed back for its next lifetime.",
    ],
  },
  {
    id: "why-gold-remembers",
    index: "02",
    tag: "MATERIALS",
    title: "Why gold remembers",
    excerpt: "On recycled gold, hallmarking, and why purity matters for daily wear.",
    image: images.bracelet,
    readTime: "4 min read",
    body: [
      "Gold has a memory. Alloy it well and it will hold a curve for a century; alloy it poorly and it will work-harden, crack and forget every shape you gave it. That is why purity is not a prestige game for us — it is an engineering decision. 22K for the pieces that should drape and glow, 18K where a setting must grip a stone through decades of wear.",
      "Every gram we use is hallmarked and traceable, and the majority of our gold is recycled — re-refined to the same standard as newly mined metal, with a fraction of the footprint. Old jewellery, melted with respect, becomes new jewellery without losing a karat of integrity.",
      "When you visit the atelier, ask to see the hallmark under the loupe. That tiny stamp is our signature on the metal itself: weight, purity and origin, guaranteed in writing for life.",
    ],
  },
  {
    id: "day-with-setters",
    index: "03",
    tag: "PEOPLE",
    title: "A day with our stone setters",
    excerpt: "Patience, lamplight and ten thousand tiny decisions in Golbazar.",
    image: images.hero,
    readTime: "5 min read",
    body: [
      "The setters arrive before the shutters roll up. By 10am the benches are warm, the lamps are angled, and the first stone of the day is already under the loupe — turned slowly, the way you would turn a thought over before saying it aloud.",
      "Setting is the least visible and most consequential craft in jewellery. A tenth of a millimetre decides whether a diamond throws light or leaks it, whether it survives a knock against a doorway or loosens by Dashain. Our setters cut each bearing by hand and check their work the old way: by feel, by sound, by eye.",
      "They will tell you the stones speak — that a well-cut diamond seats with a soft, certain click. After thirty years at the bench, you learn to listen.",
    ],
  },
];

export const lookbookImages = [
  { src: images.hero, alt: "Editorial gold necklace", label: "The Heirloom Edit" },
  { src: images.ring, alt: "Diamond ring macro", label: "New Moon" },
  { src: images.necklace, alt: "Layered necklaces", label: "Layered traditions" },
  { src: images.detail, alt: "Craft detail", label: "Hand-finishing" },
  { src: images.bracelet, alt: "Gold bracelet", label: "The Ceremony" },
  { src: images.earrings, alt: "Gold earrings", label: "Everyday icons" },
  { src: images.temple, alt: "Temple gold bridal set", label: "Ceremony bridal" },
  { src: images.pearlbox, alt: "Pearl strand in gift box", label: "The gift edit" },
];

export const testimonials = [
  {
    quote: "My mother's bangle, restored to sing again. I cried when I opened the box.",
    name: "Anisha Karki",
    detail: "Heirloom restoration · Kathmandu",
  },
  {
    quote: "They explained every gram and every stone. I have never bought jewellery with such confidence.",
    name: "Sanjay Gurung",
    detail: "Bridal suite · Pokhara",
  },
  {
    quote: "The jhumkas I wore at my wedding are already promised to my daughter.",
    name: "Roshani Shrestha",
    detail: "Ceremony edit · Lalitpur",
  },
];

export const atelierTimeline = [
  ["1988", "A single bench in Siraha", "Tridev opens as a family goldsmith atelier in Golbazar."],
  ["2001", "The bridal atelier", "A dedicated suite for ceremony pieces, temple work and custom commissions."],
  ["2014", "Hallmarked promise", "Every piece traceable — weight, purity and origin guaranteed in writing."],
  ["2025", "The house today", "24 signature pieces, recycled gold and a bench of lifelong artisans."],
];

export const STORE = {
  name: "Tridev Jewellers",
  street: "Golbazar-4, Siraha, Madhesh Pradesh, Nepal",
  town: "Golbazar, Siraha",
  phone: "+977 9829770284",
  phoneHref: "tel:+9779829770284",
  whatsapp: "9779829770284",
  whatsappMessage: "Hello Tridev Jewellers! I would like to know more about your pieces.",
  email: "avaysoni123@gmail.com",
  hours: "Sun – Fri · 10am – 6pm",
  mapQuery: "Golbazar, Siraha, Madhesh Pradesh, Nepal",
};

export const whatsappLink = (message) =>
  `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message || STORE.whatsappMessage)}`;

export const mapEmbedSrc = (query) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query || STORE.mapQuery)}&output=embed`;

export const faqGroups = [
  {
    title: "Orders & Delivery",
    faqs: [
      ["How long does delivery take?", "Standard insured delivery takes 3–5 days across Nepal; express valley delivery takes 1–2 days. Every parcel is gift-wrapped, tracked and fully insured."],
      ["Is delivery really complimentary?", "Yes — on all orders over NPR 25,000, which covers every piece in our collection. Express dispatch is available for NPR 950."],
      ["How can I track my order?", "Your Order History page always shows the live status. For personal updates, message us on WhatsApp with your order number."],
    ],
  },
  {
    title: "Gold, Diamonds & Pricing",
    faqs: [
      ["How is the NPR price calculated?", "Gold weight × purity plus the artisan's making charge — hallmarked, traceable and explained in writing before you decide."],
      ["Is your gold hallmarked?", "Every piece, without exception. Weight, purity and origin are stamped and guaranteed for life."],
      ["Do you use recycled gold?", "Mostly, yes — re-refined to the same standard as newly mined metal, carrying a fraction of the footprint."],
    ],
  },
  {
    title: "Exchange, Buyback & Care",
    faqs: [
      ["What is your exchange policy?", "7-day easy exchange on unworn pieces in original condition — no questions beyond a smile."],
      ["Do you buy back Tridev jewellery?", "Always, at fair transparent value. Bring any Tridev piece home to us, any year."],
      ["How do I care for my jewellery?", "Wipe gently after wear, store pieces separately in the pouch provided, and bring them in once a year for a complimentary polish and check-up."],
    ],
  },
  {
    title: "Appointments & Custom Design",
    faqs: [
      ["Do I need an appointment to visit?", "Walk-ins are welcome during atelier hours. Bridal and custom consultations deserve an appointment — your shortlist will be waiting."],
      ["Can you create a custom piece?", "Happily. Share a sketch, an heirloom, or simply an idea — our designers will draw, quote and craft it with you over 2–4 weeks."],
      ["Can you restore my old jewellery?", "Restoration is a house speciality. Bring heirloom pieces for assessment, resizing, re-setting or a full revival."],
    ],
  },
];

export const DEMO_CREDENTIALS = {
  customer: { email: "customer@example.com", password: "Customer@123" },
  admin: { email: "admin@tridevjewellers.com", password: "Tridev@123" },
};

export const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

export const sampleOrders = [
  {
    id: "TRI-2408",
    customer: "Roshani Shrestha",
    email: "customer@example.com",
    phone: "+977-9841123456",
    address: "Bhanimandal, Lalitpur",
    note: "Please include a hand-written anniversary note.",
    delivery: "standard",
    giftWrap: true,
    total: 124000,
    status: "Delivered",
    date: "2025-08-18",
    items: [
      { id: "TD-002", name: "Maya Temple Pendant", price: 124000, qty: 1, image: images.necklace },
    ],
    history: [
      { status: "Processing", date: "2025-08-18" },
      { status: "Shipped", date: "2025-08-19" },
      { status: "Delivered", date: "2025-08-21" },
    ],
  },
  {
    id: "TRI-2407",
    customer: "Anisha Karki",
    email: "anisha@example.com",
    phone: "+977-9851098765",
    address: "Lakeside, Pokhara",
    note: "",
    delivery: "express",
    giftWrap: true,
    total: 68500,
    status: "Processing",
    date: "2025-09-02",
    items: [
      { id: "TD-001", name: "Aarohi Diamond Solitaire", price: 68500, qty: 1, image: images.ring },
    ],
    history: [{ status: "Processing", date: "2025-09-02" }],
  },
  {
    id: "TRI-2406",
    customer: "Sanjay Gurung",
    email: "sanjay@example.com",
    phone: "+977-9860112233",
    address: "Main Road, Golbazar, Siraha",
    note: "Call on arrival, please.",
    delivery: "standard",
    giftWrap: false,
    total: 56000,
    status: "Processing",
    date: "2025-09-05",
    items: [
      { id: "TD-007", name: "Ritu Jhumka Earrings", price: 56000, qty: 1, image: images.earrings },
    ],
    history: [{ status: "Processing", date: "2025-09-05" }],
  },
];

export const sampleCustomers = [
  { id: "C-001", name: "Roshani Shrestha", email: "customer@example.com", phone: "+977-9841123456", orders: 3, joined: "2025-01-14" },
  { id: "C-002", name: "Anisha Karki", email: "anisha@example.com", phone: "+977-9851098765", orders: 1, joined: "2025-06-02" },
  { id: "C-003", name: "Sanjay Gurung", email: "sanjay@example.com", phone: "+977-9860112233", orders: 2, joined: "2025-03-20" },
];
