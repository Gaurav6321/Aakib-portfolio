// Single source of content. Projects were extracted from https://www.behance.net/aakibart
// Covers are the full-resolution originals downloaded from Behance into public/projects.

const cover = (file: string) => `/projects/${file}`;

export type Project = {
  id: number;
  title: string; // exact Behance title
  short: string; // oversized display title
  kind: string;
  url: string; // direct Behance project link
  image: string;
  published: number; // unix seconds, from Behance
};

export const projects: Project[] = [
  {
    id: 234531795,
    title: "Social media creative work",
    short: "Social Media",
    kind: "Social Media Creatives",
    url: "https://www.behance.net/gallery/234531795/Social-media-creative-work",
    image: cover("234531795.jpg"),
    published: 1757753182,
  },
  {
    id: 211647317,
    title: "Concept for Adidas Shoe Made by Ocean Waste Plastic",
    short: "Adidas Ocean",
    kind: "Concept + Campaign Visual",
    url: "https://www.behance.net/gallery/211647317/Concept-for-Adidas-Shoe-Made-by-Ocean-Waste-Plastic",
    image: cover("211647317.jpg"),
    published: 1730639136,
  },
  {
    id: 211542147,
    title: "Hyundai Excavators India",
    short: "Hyundai",
    kind: "Brand Creatives",
    url: "https://www.behance.net/gallery/211542147/Hyundai-Excavators-India",
    image: cover("211542147.jpg"),
    published: 1730469429,
  },
  {
    id: 189545963,
    title: "Wagh Bakri Chai (Pitch Work)",
    short: "Wagh Bakri",
    kind: "Pitch Work",
    url: "https://www.behance.net/gallery/189545963/Wagh-Bakri-Chai-%28Pitch-Work%29",
    image: cover("189545963.jpg"),
    published: 1705857161,
  },
  {
    id: 211597791,
    title: "Bank of Maharashtra Ad creatives",
    short: "Bank of Maharashtra",
    kind: "Ad Creatives",
    url: "https://www.behance.net/gallery/211597791/Bank-of-Maharashtra-Ad-creatives",
    image: cover("211597791.png"),
    published: 1730552479,
  },
  {
    id: 189535817,
    title: "Real Estate Design Work",
    short: "Real Estate",
    kind: "Marketing Design",
    url: "https://www.behance.net/gallery/189535817/Real-Estate-Design-Work",
    image: cover("189535817.jpg"),
    published: 1705848293,
  },
  {
    id: 211601321,
    title: "Ad Creatives",
    short: "Ad Creatives",
    kind: "Ad Creatives",
    url: "https://www.behance.net/gallery/211601321/Ad-Creatives",
    image: cover("211601321.jpg"),
    published: 1730556527,
  },
  {
    id: 211541503,
    title: "SID Performance marketing google ads Design work",
    short: "SID Google Ads",
    kind: "Performance Marketing + Google Ads",
    url: "https://www.behance.net/gallery/211541503/SID-Performance-marketing-google-ads-Design-work",
    image: cover("211541503.jpg"),
    published: 1730468809,
  },
  {
    id: 189548639,
    title: "New Product Launch Creatives (Hyundai)",
    short: "Hyundai Launch",
    kind: "Product Launch Creatives",
    url: "https://www.behance.net/gallery/189548639/New-Product-Launch-Creatives-%28Hyundai%29",
    image: cover("189548639.jpg"),
    published: 1705859945,
  },
  {
    id: 189322353,
    title: "Performance marketing ads Design work (SID)",
    short: "SID Ads",
    kind: "Performance Marketing Ads",
    url: "https://www.behance.net/gallery/189322353/Performance-marketing-ads-Design-work-%28SID%29",
    image: cover("189322353.png"),
    published: 1705604200,
  },
  {
    id: 189325033,
    title: "National Army Day (Hyundai)",
    short: "Army Day",
    kind: "Topical Creative",
    url: "https://www.behance.net/gallery/189325033/National-Army-Day-%28Hyundai%29",
    image: cover("189325033.jpg"),
    published: 1705846664,
  },
  {
    id: 132130345,
    title: "Portfolio",
    short: "Portfolio",
    kind: "Selected Artworks",
    url: "https://www.behance.net/gallery/132130345/Portfolio",
    image: cover("132130345.jpg"),
    published: 1638087268,
  },
];

// MM.DD.YYYY, like the reference site
export const fmtDate = (unix: number) => {
  const d = new Date(unix * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())}.${d.getUTCFullYear()}`;
};

export const featured = projects.slice(0, 3);

export const site = {
  name: "Akib Sayyad",
  role: "Multi-Disciplinary Artist & Illustrator",
  behance: "https://www.behance.net/aakibart",
  // Only Behance is a verified link. Add { label, href } entries (email, Instagram…) here.
  socials: [{ label: "Behance", href: "https://www.behance.net/aakibart" }],
  heroDescription: [
    "Artist & illustrator turning",
    "ideas into social creatives,",
    "ad campaigns and brand visuals",
    "that people remember.",
  ],
  homeAbout: [
    "Hello, my name's Akib, senior",
    "graphic designer in Pune, India, where",
    "I create campaigns, ads and artwork.",
  ],
  // Akib's portrait, backdrop widened so the full word PORTFOLIO shows (public/akib.jpg).
  homeAboutImage: "/akib.jpg",
  aboutHeroImage: "/akib.jpg",
  aboutQuote: ["Every visual should earn its place", "and say something worth seeing."],
  bio: [
    "Hello, my name's Akib, I'm a senior graphic",
    "designer and illustrator based in Pune, India,",
    "creating social media creatives, ad campaigns",
    "and brand visuals at SRV Media.",
    "",
    "My work spans performance marketing ads,",
    "product launch creatives, pitch work and concept",
    "art, the kind of visuals built to stop the scroll.",
  ],
  brands: ["Hyundai", "Bank of Maharashtra", "Wagh Bakri Chai", "SID", "Adidas (Concept)", "SRV Media"],
  skills: [
    "Illustration",
    "Social Media Creatives",
    "Ad Campaigns",
    "Performance Marketing Ads",
    "Product Launch Creatives",
    "Pitch Design",
    "Concept Art",
    "Brand Visuals",
  ],
  capabilities: [
    "Illustration",
    "Social Creatives",
    "Ad Campaigns",
    "Performance Ads",
    "Product Launches",
    "Pitch Work",
    "Concept Art",
    "Brand Visuals",
  ],
};
