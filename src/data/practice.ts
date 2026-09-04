export type Service = {
  id: string;
  name: string;
  duration: string;
  price: string;
  description: string;
};

export type ProfessionalProfile = {
  id: string;
  name: string;
  studioName: string;
  role: string;
  image: string;
  location: string;
  bio: string;
  handle: string;
  brandColor: string;
  services: Service[];
  enabledBrands: string[];
};

export type ConsultationStatus = "new" | "reviewing" | "recommendation sent";

export type ConsultationBrief = {
  id: string;
  clientName: string;
  initials: string;
  submittedAt: string;
  serviceId: string;
  eventDate: string;
  note: string;
  status: ConsultationStatus;
  lookIds: string[];
  productIds: string[];
  source: string;
};

export const featuredProfessional: ProfessionalProfile = {
  id: "maya-clarke",
  name: "Maya Clarke",
  studioName: "Maya Clarke Skin & Beauty",
  role: "Skin therapist + makeup artist",
  image: "/images/look-sudan.jpg",
  location: "Birmingham · studio + virtual",
  bio: "Thoughtful skin consultations and softly sculpted makeup, shaped around how you want to feel.",
  handle: "@mayaclarkebeauty",
  brandColor: "#a9bea8",
  services: [
    {
      id: "skin-consult",
      name: "Skin consultation",
      duration: "45 min",
      price: "£55",
      description: "A visual skin review, routine audit, and personalised product plan.",
    },
    {
      id: "occasion",
      name: "Occasion makeup",
      duration: "60 min",
      price: "£75",
      description: "A complete look planned around your features, outfit, and occasion.",
    },
    {
      id: "bridal",
      name: "Bridal preview",
      duration: "90 min",
      price: "£120",
      description: "A collaborative trial with a saved look brief for the wedding day.",
    },
  ],
  enabledBrands: [
    "Common Ground",
    "Morrow",
    "Morrow Lab",
    "Onda",
    "Serein",
    "Vela",
  ],
};

export const demoConsultations: ConsultationBrief[] = [
  {
    id: "GD-1042",
    clientName: "Leah Morgan",
    initials: "LM",
    submittedAt: "12 min ago",
    serviceId: "occasion",
    eventDate: "14 September",
    note: "Warm evening look, polished but still like me. I usually avoid a heavy base.",
    status: "new",
    lookIds: ["soft-signal", "electric-hour"],
    productIds: ["lip-ember", "blush-guava", "eye-copper"],
    source: "Instagram bio",
  },
  {
    id: "GD-1041",
    clientName: "Priya Shah",
    initials: "PS",
    submittedAt: "Yesterday",
    serviceId: "bridal",
    eventDate: "28 October",
    note: "Soft luminous skin and defined eyes. The ceremony starts early afternoon.",
    status: "reviewing",
    lookIds: ["heirloom-light", "bare-focus"],
    productIds: ["complexion", "eye-copper", "highlight"],
    source: "Booking confirmation",
  },
  {
    id: "GD-1038",
    clientName: "Amina Cole",
    initials: "AC",
    submittedAt: "2 days ago",
    serviceId: "skin-consult",
    eventDate: "Follow-up due",
    note: "My skin feels tight after cleansing. I want a simple routine I can keep up with.",
    status: "recommendation sent",
    lookIds: ["bare-focus"],
    productIds: ["skin-barrier", "skin-calm"],
    source: "Direct link",
  },
];
