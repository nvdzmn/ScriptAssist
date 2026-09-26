export type DermatologyTherapy = {
  id: string;
  genericName: string;
  brandName: string;
  presentation: string;
  rxcui: string;
  route: string;
  quantity: string;
  quantityUnit: string;
  daysSupply: string;
  frequency: string;
  sig: string;
  indication: string;
  category: "generic" | "specialty";
};

// These ingredient-level RxCUIs seed the CMS Part D importer. The importer expands
// them to the associated clinical drug concepts before it filters the CMS file.
export const dermatologyTherapies: DermatologyTherapy[] = [
  { id: "tretinoin", genericName: "tretinoin", brandName: "Retin-A", presentation: "0.025% cream", rxcui: "10753", route: "Topical", quantity: "45", quantityUnit: "g", daysSupply: "30", frequency: "Once nightly", sig: "Apply a pea-sized amount to affected skin once nightly as directed.", indication: "Acne vulgaris", category: "generic" },
  { id: "adapalene", genericName: "adapalene", brandName: "Differin", presentation: "0.1% gel", rxcui: "60223", route: "Topical", quantity: "45", quantityUnit: "g", daysSupply: "30", frequency: "Once nightly", sig: "Apply a thin layer to affected skin once nightly as directed.", indication: "Acne vulgaris", category: "generic" },
  { id: "clindamycin", genericName: "clindamycin phosphate", brandName: "Cleocin T", presentation: "1% topical solution", rxcui: "2582", route: "Topical", quantity: "60", quantityUnit: "mL", daysSupply: "30", frequency: "Twice daily", sig: "Apply a thin layer to affected skin twice daily as directed.", indication: "Acne vulgaris", category: "generic" },
  { id: "doxycycline", genericName: "doxycycline", brandName: "Vibramycin", presentation: "100 mg capsule", rxcui: "3640", route: "Oral", quantity: "60", quantityUnit: "capsules", daysSupply: "30", frequency: "Twice daily", sig: "Take one capsule by mouth twice daily as directed.", indication: "Inflammatory acne or rosacea", category: "generic" },
  { id: "minocycline", genericName: "minocycline", brandName: "Minocin", presentation: "100 mg capsule", rxcui: "6980", route: "Oral", quantity: "60", quantityUnit: "capsules", daysSupply: "30", frequency: "Twice daily", sig: "Take one capsule by mouth twice daily as directed.", indication: "Inflammatory acne", category: "generic" },
  { id: "clobetasol", genericName: "clobetasol propionate", brandName: "Temovate", presentation: "0.05% cream", rxcui: "2590", route: "Topical", quantity: "45", quantityUnit: "g", daysSupply: "30", frequency: "Twice daily", sig: "Apply a thin layer to affected skin twice daily for the clinician-directed duration.", indication: "Corticosteroid-responsive dermatoses", category: "generic" },
  { id: "triamcinolone", genericName: "triamcinolone acetonide", brandName: "Kenalog", presentation: "0.1% ointment", rxcui: "10759", route: "Topical", quantity: "80", quantityUnit: "g", daysSupply: "30", frequency: "Twice daily", sig: "Apply a thin layer to affected skin twice daily for the clinician-directed duration.", indication: "Corticosteroid-responsive dermatoses", category: "generic" },
  { id: "tacrolimus", genericName: "tacrolimus", brandName: "Protopic", presentation: "0.1% ointment", rxcui: "42316", route: "Topical", quantity: "60", quantityUnit: "g", daysSupply: "30", frequency: "Twice daily", sig: "Apply a thin layer to affected skin twice daily as directed.", indication: "Atopic dermatitis", category: "generic" },
  { id: "pimecrolimus", genericName: "pimecrolimus", brandName: "Elidel", presentation: "1% cream", rxcui: "321952", route: "Topical", quantity: "60", quantityUnit: "g", daysSupply: "30", frequency: "Twice daily", sig: "Apply a thin layer to affected skin twice daily as directed.", indication: "Atopic dermatitis", category: "generic" },
  { id: "ketoconazole", genericName: "ketoconazole", brandName: "Nizoral", presentation: "2% shampoo", rxcui: "6135", route: "Topical", quantity: "120", quantityUnit: "mL", daysSupply: "30", frequency: "Twice weekly", sig: "Apply to affected scalp, lather, leave on briefly, then rinse as directed.", indication: "Seborrheic dermatitis", category: "generic" },
  { id: "dupilumab", genericName: "dupilumab", brandName: "Dupixent", presentation: "300 mg / 2 mL prefilled pen", rxcui: "1876376", route: "Subcutaneous", quantity: "2", quantityUnit: "pens", daysSupply: "28", frequency: "Every 2 weeks", sig: "Inject subcutaneously according to the clinician-selected indication-specific regimen.", indication: "Atopic dermatitis", category: "specialty" },
  { id: "adalimumab", genericName: "adalimumab", brandName: "Humira", presentation: "40 mg / 0.4 mL prefilled pen", rxcui: "327361", route: "Subcutaneous", quantity: "2", quantityUnit: "pens", daysSupply: "28", frequency: "Every other week", sig: "Inject subcutaneously according to the clinician-selected indication-specific regimen.", indication: "Plaque psoriasis or hidradenitis suppurativa", category: "specialty" },
  { id: "risankizumab", genericName: "risankizumab-rzaa", brandName: "Skyrizi", presentation: "150 mg / mL pen", rxcui: "2166040", route: "Subcutaneous", quantity: "1", quantityUnit: "pen", daysSupply: "84", frequency: "Indication-specific maintenance schedule", sig: "Inject subcutaneously according to the clinician-selected indication-specific regimen.", indication: "Plaque psoriasis", category: "specialty" },
];

export const dermatologyPatients = [
  { id: "maria-chen", initials: "MC", name: "Maria Chen", meta: "42 F  ·  DOB 03/14/1984  ·  MRN 004821", insurance: "Medicare Part D plan — coverage verification required", diagnosis: "Plaque psoriasis", allergies: "Penicillin", priorTreatments: "Betamethasone, NB-UVB" },
  { id: "james-okafor", initials: "JO", name: "James Okafor", meta: "61 M  ·  DOB 08/20/1965  ·  MRN 003377", insurance: "Medicare Part D plan — coverage verification required", diagnosis: "Atopic dermatitis", allergies: "None documented", priorTreatments: "Triamcinolone, tacrolimus" },
  { id: "priya-nair", initials: "PN", name: "Priya Nair", meta: "54 F  ·  DOB 11/02/1971  ·  MRN 005102", insurance: "Medicare Part D plan — coverage verification required", diagnosis: "Acne vulgaris", allergies: "Sulfonamides", priorTreatments: "Adapalene, clindamycin" },
] as const;

export const defaultDermatologyTherapy = dermatologyTherapies.find((therapy) => therapy.id === "risankizumab")!;
