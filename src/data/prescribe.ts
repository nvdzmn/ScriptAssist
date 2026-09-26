export const prescription = {
  breadcrumb: "Prescribe / New prescription",
  title: "New prescription",
  draft: "Draft saved 1 min ago",
  patient: {
    initials: "MC",
    name: "Maria Chen",
    meta: "42 F  ·  DOB 03/14/1984  ·  MRN 004821",
    insurance: "Horizon PPO Gold · Member H8847201",
    diagnosis: "Plaque psoriasis, PASI 14",
    allergies: "Penicillin",
    priorTreatments: "Betamethasone, NB-UVB",
  },
  drug: "Stelazio 45 mg / 0.5 mL prefilled syringe",
  ndc: "NDC 12345-678-90",
  route: "Subcutaneous",
  quantity: "1",
  quantityUnit: "syringe",
  daysSupply: "84",
  refills: "0",
  frequency: "Week 0 and 4, then every 12 weeks",
  diagnosis: "Psoriasis vulgaris",
  icd: "ICD-10 L40.0",
  sig: "Inject 45 mg subcutaneously at week 0 and week 4, then every 12 weeks thereafter.",
  pharmacy: "Accredo Specialty Pharmacy · Memphis, TN",
  ncpdp: "NCPDP 4436920",
};

export const coverage = {
  tier: "Tier 4 · Specialty",
  plan: "Horizon PPO Gold · CVS Caremark formulary",
  without: "$1,240 / mo",
  with: "$5 / mo",
  billing: [
    { label: "RxBIN", value: "019283" },
    { label: "PCN", value: "IMP" },
    { label: "Group", value: "IMP2026" },
    { label: "Member ID", value: "SC-55830412" },
  ],
};

export const criteria = [
  {
    id: "topicals",
    title: "Failure of 2 high-potency topicals",
    detail: "Betamethasone 0.05% and clobetasol, Jan–Apr 2025",
    source: "Progress note · 04/12/2025",
  },
  {
    id: "photo",
    title: "Phototherapy trial or contraindication",
    detail: "NB-UVB, 24 sessions, Jun–Aug 2025",
    source: "Procedure log · 08/29/2025",
  },
  {
    id: "tb",
    title: "Negative TB screening within 12 months",
    detail: "No result in the last 12 months. Last test 08/2024 has expired.",
    source: "Lab panels · checked just now",
  },
];
