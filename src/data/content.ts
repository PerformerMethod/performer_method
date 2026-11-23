export type Practitioner = {
  id: string;
  name: string;
  specialty: string;
  location: string;
  city: string;
  blurb: string;
  initials: string;
  photo?: string;
};

export type RecoveryCentre = {
  id: string;
  name: string;
  state: "NSW" | "VIC" | "QLD" | "WA";
  suburb: string;
  services: string[];
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
};

export type Pillar = {
  id: "mind" | "body" | "fuel" | "purpose";
  title: string;
  summary: string;
  sections: { title: string; body: string }[];
};

export type LifecycleStage = {
  id: string;
  title: string;
  guidance: string;
};

export const specialties = [
  "Physio",
  "Voice",
  "Psychology",
  "Nutrition",
  "Massage",
  "Osteopathy",
  "Career coaching",
] as const;

export const practitioners: Practitioner[] = [
  {
    id: "cristina-dagostino",
    name: "Cristina D’Agostino",
    specialty: "Counselling",
    location: "Telehealth · Worldwide",
    city: "Telehealth",
    blurb:
      "Master’s-qualified Registered Counsellor with more than 20 years of professional performing arts experience.",
    initials: "CD",
    photo: "/brand/people/cristina-dagostino.webp",
  },
  {
    id: "oscar-bridges",
    name: "Oscar Bridges",
    specialty: "Nutrition",
    location: "Touring · Australia",
    city: "Australia",
    blurb:
      "Nutrition Counsellor and performer helping touring artists with gut health, energy and food on the road.",
    initials: "OB",
    photo: "/brand/people/oscar-bridges.webp",
  },
  {
    id: "rosie-harris",
    name: "Rosie Harris",
    specialty: "Vocal health",
    location: "Melbourne · VIC",
    city: "Melbourne",
    blurb:
      "Singing teacher and vocal coach drawing on voice science, somatic work and neurodiversity-affirming practice.",
    initials: "RH",
    photo: "/brand/people/rosie-harris.webp",
  },
  {
    id: "bronwyn-claassen",
    name: "Bronwyn Claassen",
    specialty: "Physiotherapy",
    location: "Australia-wide",
    city: "Australia",
    blurb:
      "More than three decades of performing arts physiotherapy, including major Australian touring productions.",
    initials: "BC",
  },
  {
    id: "p5",
    name: "Elena Vos",
    specialty: "Massage",
    location: "Newtown, NSW",
    city: "Sydney",
    blurb: "Deep tissue that understands turnout, lifts, and overnight resets.",
    initials: "EV",
  },
  {
    id: "p6",
    name: "Tom Asher",
    specialty: "Osteopathy",
    location: "Fitzroy, VIC",
    city: "Melbourne",
    blurb: "Alignment work for dancers and musical theatre athletes.",
    initials: "TA",
  },
];

export const pillars: Pillar[] = [
  {
    id: "mind",
    title: "Mind",
    summary: "Steady attention, softer self-critique, and tools for pressure days.",
    sections: [
      {
        title: "Before the call",
        body: "A two-minute reset: name the worry, lengthen the exhale, then choose one cue you can control.",
      },
      {
        title: "After notes",
        body: "Separate craft feedback from identity. Keep what is useful; leave the rest in the room.",
      },
      {
        title: "Quiet days",
        body: "Rest is part of the job. Protect one hour that is not audition prep or content.",
      },
    ],
  },
  {
    id: "body",
    title: "Body",
    summary: "Strength, recovery, and listening when the schedule gets loud.",
    sections: [
      {
        title: "Show-day mobility",
        body: "Warm joints before call, then a short cool-down so tomorrow is not starting from zero.",
      },
      {
        title: "Pain signals",
        body: "Chest pain or sharp sudden pain is a stop sign — seek medical care. Everything else gets paced.",
      },
      {
        title: "Tour load",
        body: "Travel compresses recovery. Prioritise sleep windows and simple reactivation sets.",
      },
    ],
  },
  {
    id: "fuel",
    title: "Fuel",
    summary: "Eating for voice, energy, and the long run — not just opening night.",
    sections: [
      {
        title: "Matinee rhythm",
        body: "Front-load protein and fluids earlier; keep snacks quiet on the stomach before vocals.",
      },
      {
        title: "Hydration",
        body: "Sip through the day. Dry rooms and flights ask for more than coffee can give.",
      },
      {
        title: "Travel kits",
        body: "Pack familiar options so a new city does not become a fuel crisis.",
      },
    ],
  },
  {
    id: "purpose",
    title: "Purpose",
    summary: "Why you perform, and how to stay connected when the industry feels noisy.",
    sections: [
      {
        title: "Your why",
        body: "Write one sentence that is not about booking. Read it on the days that feel thin.",
      },
      {
        title: "Community",
        body: "Share wins and hard weeks with people who understand the calendar.",
      },
      {
        title: "After closing",
        body: "Grief and relief can arrive together. Give the transition a name and a plan.",
      },
    ],
  },
];

export const lifecycleStages: LifecycleStage[] = [
  {
    id: "audition",
    title: "Audition",
    guidance: "Protect energy between calls. Warm up the material you will actually sing or say today.",
  },
  {
    id: "preparation",
    title: "Preparation",
    guidance: "Build slowly. Sleep and strength matter as much as learning the book.",
  },
  {
    id: "rehearsal",
    title: "Rehearsal",
    guidance: "Stay curious in the room. Track load so tech week does not arrive already depleted.",
  },
  {
    id: "tech",
    title: "Tech",
    guidance: "Long days, short recoveries. Micro-rests, hydration, and voice pacing are non-negotiable.",
  },
  {
    id: "opening",
    title: "Opening",
    guidance: "Nervous energy is normal. Keep rituals small and familiar; celebrate without burning the week.",
  },
  {
    id: "the-run",
    title: "The Run",
    guidance: "Consistency over heroics. Watch the mid-season dip and schedule real days off.",
  },
  {
    id: "tour",
    title: "Tour",
    guidance: "New beds, dry air, travel. Anchor one daily routine that travels with you.",
  },
  {
    id: "closing",
    title: "Closing",
    guidance: "Honour the company and the landing. Plan the first week after so identity has somewhere to go.",
  },
];

export const recoveryCentres: RecoveryCentre[] = [
  {
    id: "r1",
    name: "Contrast House Surry Hills",
    state: "NSW",
    suburb: "Surry Hills",
    services: ["Sauna", "Ice bath", "Contrast"],
    phone: "02 9000 1001",
    website: "https://example.com",
    instagram: "@contrasthousesyd",
  },
  {
    id: "r2",
    name: "Harbour Ice & Heat",
    state: "NSW",
    suburb: "Pyrmont",
    services: ["Ice bath", "Contrast"],
    email: "hello@harbourice.example",
    website: "https://example.com",
  },
  {
    id: "r3",
    name: "Stage Reset Newtown",
    state: "NSW",
    suburb: "Newtown",
    services: ["Sauna", "Contrast"],
    phone: "02 9000 1003",
    instagram: "@stagereset",
  },
  {
    id: "r4",
    name: "Fitzroy Plunge",
    state: "VIC",
    suburb: "Fitzroy",
    services: ["Ice bath", "Sauna"],
    website: "https://example.com",
  },
  {
    id: "r5",
    name: "Southbank Contrast Lab",
    state: "VIC",
    suburb: "Southbank",
    services: ["Contrast", "Sauna", "Ice bath"],
    phone: "03 9000 2002",
  },
  {
    id: "r6",
    name: "Yarra Steam Collective",
    state: "VIC",
    suburb: "Richmond",
    services: ["Sauna"],
    email: "book@yarrasteam.example",
  },
  {
    id: "r7",
    name: "Valley Cold Studio",
    state: "QLD",
    suburb: "Fortitude Valley",
    services: ["Ice bath", "Contrast"],
    website: "https://example.com",
    instagram: "@valleycold",
  },
  {
    id: "r8",
    name: "Riverfire Recovery",
    state: "QLD",
    suburb: "West End",
    services: ["Sauna", "Ice bath", "Contrast"],
    phone: "07 3000 3003",
  },
  {
    id: "r9",
    name: "Northbridge Thermal",
    state: "WA",
    suburb: "Northbridge",
    services: ["Sauna", "Contrast"],
    website: "https://example.com",
  },
  {
    id: "r10",
    name: "Fremantle Ice Dock",
    state: "WA",
    suburb: "Fremantle",
    services: ["Ice bath"],
    email: "dock@fremantleice.example",
    instagram: "@fremantleicedock",
  },
];

export const passOffers = [
  {
    id: "o1",
    partner: "Contrast House",
    perk: "One complimentary contrast session each month",
    redeem: "Show your Pass number at reception before you book in.",
    tier: "Debut" as const,
  },
  {
    id: "o2",
    partner: "Vocal Lab Studios",
    perk: "15% off private voice sessions",
    redeem: "Mention Performer Method when you book online or by phone.",
    tier: "Debut" as const,
  },
  {
    id: "o3",
    partner: "Atlas Gym",
    perk: "Four guest day-passes per month",
    redeem: "Scan your Pass at the front desk; staff will log the visit.",
    tier: "Company" as const,
  },
  {
    id: "o4",
    partner: "Quiet Room Psychology",
    perk: "First consult at member rate",
    redeem: "Email the clinic with your Pass number in the subject line.",
    tier: "Company" as const,
  },
];

export const communityFeed = [
  {
    id: "c1",
    type: "event" as const,
    title: "Sunday company stretch",
    place: "Surry Hills studio",
    city: "Sydney",
    when: "Sun 10:00",
    meta: "12 going",
  },
  {
    id: "c2",
    type: "class" as const,
    title: "Voice maintenance for the run",
    place: "Online + Newtown",
    city: "Sydney",
    when: "Tue 18:30",
    meta: "8 going",
  },
  {
    id: "c3",
    type: "recommendation" as const,
    title: "Quiet physio who gets dancers",
    place: "Amelia Croft · Surry Hills",
    city: "Sydney",
    when: "Member tip",
    meta: "14 recommend",
  },
  {
    id: "c4",
    type: "parking" as const,
    title: "Street parking after 6 near Capitol",
    place: "Haymarket",
    city: "Sydney",
    when: "Tip",
    meta: "9 helpful",
  },
];
