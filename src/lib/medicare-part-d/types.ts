export type CmsPartDSource = {
  title: string;
  publishedAt: string;
  downloadUrl: string;
  source: "CMS Part D monthly formulary and pharmacy network file";
};

export type PartDPlan = {
  id: string;
  contractId: string;
  planId: string;
  segmentId?: string;
  name: string;
  state?: string;
  countyCode?: string;
  formularyId: string;
  deductible?: number;
};

export type PartDCostShare = {
  phase: "pre-deductible" | "initial" | "catastrophic";
  pharmacy: "preferred-retail" | "standard-retail" | "preferred-mail" | "standard-mail";
  daysSupply: 30 | 60 | 90;
  type: "copay" | "coinsurance";
  amount: number;
  minimum?: number;
  maximum?: number;
};

export type PartDDrugCoverage = {
  therapyId: string;
  rxcui: string;
  ndc: string;
  tier: number;
  priorAuthorizationRequired: boolean;
  stepTherapyRequired: boolean;
  quantityLimit?: { amount: number; days: number };
};

export type PartDPlanRecord = {
  plan: PartDPlan;
  coverages: PartDDrugCoverage[];
  costShares: PartDCostShare[];
};

export type PartDImport = {
  version: 1;
  source: CmsPartDSource;
  importedAt: string;
  plans: PartDPlanRecord[];
};

export type CoverageLookup = {
  status: "available" | "not-imported" | "not-found";
  source?: CmsPartDSource;
  plan?: PartDPlan;
  coverage?: PartDDrugCoverage;
  costShares?: PartDCostShare[];
  alternatives?: Array<{ therapyId: string; tier: number; priorAuthorizationRequired: boolean; stepTherapyRequired: boolean }>;
  message?: string;
};
