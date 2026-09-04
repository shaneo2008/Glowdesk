export type ProductCategory =
  | "lips"
  | "blush"
  | "eyes"
  | "complexion"
  | "skincare";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  rating: number;
  reviews: number;
  shade: string;
  shadeColor: string;
  description: string;
  benefit: string;
  creatorId?: string;
};

export type Creator = {
  id: string;
  name: string;
  handle: string;
  specialty: string;
  followers: string;
  image: string;
  bio: string;
};

export type Look = {
  id: string;
  title: string;
  caption: string;
  image: string;
  creatorId: string;
  productIds: string[];
  mood: string;
  tint: string;
  savedCount: string;
};

export const creators: Creator[] = [
  {
    id: "amara",
    name: "Amara Okafor",
    handle: "@amara.afterdark",
    specialty: "Soft-sculpt and deep-skin colour",
    followers: "284K",
    image: "/images/look-afro.jpg",
    bio: "London artist creating dimensional, light-responsive makeup for every hour after five.",
  },
  {
    id: "mina",
    name: "Mina Park",
    handle: "@minamakes",
    specialty: "Fresh skin and playful colour",
    followers: "176K",
    image: "/images/look-neon.jpg",
    bio: "Seoul-born, New York-based artist mixing clean skin with one beautifully unexpected detail.",
  },
  {
    id: "ines",
    name: "Inés Sol",
    handle: "@inesincolour",
    specialty: "Editorial texture and graphic eyes",
    followers: "391K",
    image: "/images/look-freckled.jpg",
    bio: "A Madrid editorial artist known for lived-in skin, precise colour, and freckles left visible.",
  },
  {
    id: "zara",
    name: "Zara Siddiqui",
    handle: "@zara.edits",
    specialty: "Modern bridal and luminous skin",
    followers: "242K",
    image: "/images/look-indian.jpg",
    bio: "Bridal artist reworking traditional glamour with modern texture and a lighter hand.",
  },
  {
    id: "celeste",
    name: "Celeste Warren",
    handle: "@celesteunfiltered",
    specialty: "Ageless beauty and statement colour",
    followers: "118K",
    image: "/images/look-senior.jpg",
    bio: "Beauty editor and artist making colour, confidence, and great skin feel gloriously ageless.",
  },
];

export const products: Product[] = [
  {
    id: "lip-ember",
    name: "Velvet Signal",
    brand: "Serein",
    category: "lips",
    price: 24,
    rating: 4.8,
    reviews: 328,
    shade: "Ember",
    shadeColor: "#a8353d",
    description: "A blurred, soft-matte lip colour with a diffused editorial finish.",
    benefit: "Comfortable pigment with a petal-soft edge.",
    creatorId: "amara",
  },
  {
    id: "lip-orchid",
    name: "Lip Veil",
    brand: "Morrow",
    category: "lips",
    price: 21,
    rating: 4.7,
    reviews: 191,
    shade: "Orchid Jam",
    shadeColor: "#7f365e",
    description: "A buildable balm-gloss that leaves a translucent berry stain.",
    benefit: "Sheer colour with a cushiony, non-sticky feel.",
    creatorId: "ines",
  },
  {
    id: "lip-nude",
    name: "Second Skin Lip",
    brand: "Onda",
    category: "lips",
    price: 26,
    rating: 4.6,
    reviews: 144,
    shade: "Rosewood",
    shadeColor: "#9c625b",
    description: "A satin lip colour balanced between warm rose and soft brown.",
    benefit: "One-swipe colour that wears down evenly.",
  },
  {
    id: "blush-guava",
    name: "Cloud Flush",
    brand: "Morrow",
    category: "blush",
    price: 28,
    rating: 4.9,
    reviews: 412,
    shade: "Guava Hour",
    shadeColor: "#ee766d",
    description: "A whipped cream blush that melts into skin without masking texture.",
    benefit: "A seamless flush with a skin-like sheen.",
    creatorId: "mina",
  },
  {
    id: "blush-plum",
    name: "Afterglow Stick",
    brand: "Serein",
    category: "blush",
    price: 31,
    rating: 4.8,
    reviews: 256,
    shade: "Night Plum",
    shadeColor: "#743f58",
    description: "A richly toned cheek stick that sheers out to a believable flush.",
    benefit: "Flexible colour designed across skin tones.",
    creatorId: "amara",
  },
  {
    id: "eye-indigo",
    name: "Chromatic Ink",
    brand: "Vela",
    category: "eyes",
    price: 23,
    rating: 4.7,
    reviews: 203,
    shade: "Afterimage",
    shadeColor: "#5450a4",
    description: "A long-wear liquid shadow with a soft metallic shift.",
    benefit: "High-impact colour that blends before setting.",
    creatorId: "ines",
  },
  {
    id: "eye-copper",
    name: "Lightcatcher",
    brand: "Onda",
    category: "eyes",
    price: 29,
    rating: 4.8,
    reviews: 387,
    shade: "Molten Tea",
    shadeColor: "#b56c45",
    description: "A finely milled cream-to-powder shimmer for lids and inner corners.",
    benefit: "Dimension without visible glitter.",
    creatorId: "zara",
  },
  {
    id: "complexion",
    name: "Barely There Tint",
    brand: "Onda",
    category: "complexion",
    price: 38,
    rating: 4.6,
    reviews: 621,
    shade: "Range of 24",
    shadeColor: "#b7795c",
    description: "A flexible skin tint with light coverage and a naturally radiant finish.",
    benefit: "Evens tone while keeping real skin visible.",
    creatorId: "mina",
  },
  {
    id: "highlight",
    name: "Dew Point",
    brand: "Vela",
    category: "complexion",
    price: 33,
    rating: 4.9,
    reviews: 278,
    shade: "Moon Milk",
    shadeColor: "#e8cbbd",
    description: "A translucent highlighting balm with no glitter particles.",
    benefit: "Places a soft-focus gleam on high points.",
    creatorId: "celeste",
  },
  {
    id: "skin-barrier",
    name: "Barrier Cloud",
    brand: "Common Ground",
    category: "skincare",
    price: 34,
    rating: 4.8,
    reviews: 536,
    shade: "Fragrance-free",
    shadeColor: "#d8e3d7",
    description: "A comforting moisturiser for a supple, cushioned-looking finish.",
    benefit: "Supports the skin barrier with ceramides and squalane.",
  },
  {
    id: "skin-radiance",
    name: "Morning Current",
    brand: "Common Ground",
    category: "skincare",
    price: 39,
    rating: 4.7,
    reviews: 318,
    shade: "15% vitamin C",
    shadeColor: "#f2bd69",
    description: "A lightweight antioxidant serum designed for a more radiant appearance.",
    benefit: "Helps skin look brighter and more even over time.",
  },
  {
    id: "skin-calm",
    name: "Quiet Water",
    brand: "Morrow Lab",
    category: "skincare",
    price: 29,
    rating: 4.9,
    reviews: 447,
    shade: "Milky essence",
    shadeColor: "#b9d5db",
    description: "A weightless hydrating essence for skin that feels tight or sensitised.",
    benefit: "Helps reduce the look of temporary dryness.",
  },
  {
    id: "skin-night",
    name: "Night Rhythm",
    brand: "Morrow Lab",
    category: "skincare",
    price: 44,
    rating: 4.6,
    reviews: 229,
    shade: "0.1% retinal",
    shadeColor: "#536174",
    description: "A gradual evening serum for experienced vitamin A users.",
    benefit: "Designed to refine the look of texture with consistent use.",
  },
];

export const looks: Look[] = [
  {
    id: "soft-signal",
    title: "Soft Signal",
    caption: "Diffused berry, brushed brows, and skin that still looks like yours.",
    image: "/images/look-afro.jpg",
    creatorId: "amara",
    productIds: ["lip-ember", "blush-plum", "complexion"],
    mood: "Evening",
    tint: "#9f334b",
    savedCount: "18.4K",
  },
  {
    id: "star-skin",
    title: "Star Skin",
    caption: "Tiny constellations, untouched freckles, and a wash of candlelit gold.",
    image: "/images/look-starlight.jpg",
    creatorId: "ines",
    productIds: ["eye-copper", "lip-nude", "highlight"],
    mood: "Editorial",
    tint: "#d39b63",
    savedCount: "24.1K",
  },
  {
    id: "electric-hour",
    title: "Electric Hour",
    caption: "A neon-night eye made wearable with quiet skin and a rosewood lip.",
    image: "/images/look-neon.jpg",
    creatorId: "mina",
    productIds: ["eye-indigo", "lip-nude", "complexion"],
    mood: "Bold",
    tint: "#5951da",
    savedCount: "31.8K",
  },
  {
    id: "heirloom-light",
    title: "Heirloom Light",
    caption: "Polished copper, ceremonial colour, and luminosity built in fine layers.",
    image: "/images/look-indian.jpg",
    creatorId: "zara",
    productIds: ["eye-copper", "blush-guava", "highlight"],
    mood: "Bridal",
    tint: "#c47b42",
    savedCount: "16.9K",
  },
  {
    id: "bare-focus",
    title: "Bare Focus",
    caption: "Freckles forward. Tonal warmth and the kind of glow that reads as rest.",
    image: "/images/look-freckled.jpg",
    creatorId: "ines",
    productIds: ["complexion", "blush-guava", "lip-nude"],
    mood: "Natural",
    tint: "#b6684f",
    savedCount: "27.2K",
  },
  {
    id: "blue-note",
    title: "Blue Note",
    caption: "A graphic midnight eye softened by luminous cheeks and a glassy nude lip.",
    image: "/images/look-sudan.jpg",
    creatorId: "amara",
    productIds: ["eye-indigo", "highlight", "lip-nude"],
    mood: "Editorial",
    tint: "#4d62b7",
    savedCount: "21.5K",
  },
  {
    id: "new-romantic",
    title: "New Romantic",
    caption: "Petal tones, soft-focus skin, and bridal beauty without the rulebook.",
    image: "/images/look-jewel.jpg",
    creatorId: "zara",
    productIds: ["blush-guava", "eye-copper", "lip-orchid"],
    mood: "Bridal",
    tint: "#d9858f",
    savedCount: "14.7K",
  },
  {
    id: "silver-lining",
    title: "Silver Lining",
    caption: "Statement frames, saturated colour, and absolutely no age limit.",
    image: "/images/look-senior.jpg",
    creatorId: "celeste",
    productIds: ["lip-orchid", "highlight", "eye-indigo"],
    mood: "Bold",
    tint: "#7359a7",
    savedCount: "35.3K",
  },
];

export const productById = (id: string) =>
  products.find((product) => product.id === id);

export const creatorById = (id: string) =>
  creators.find((creator) => creator.id === id);

export const lookById = (id: string) => looks.find((look) => look.id === id);
