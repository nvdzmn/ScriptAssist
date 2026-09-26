import { promises as fs } from "fs";
import path from "path";
import { dermatologyTherapies } from "@/data/dermatology";
import type { CmsPartDSource, CoverageLookup, PartDImport, PartDPlan, PartDPlanRecord } from "./types";

const DATA_FILE = process.env.CMS_PART_D_DATA_FILE || path.join(process.cwd(), "data", "cms", "part-d-dermatology.json");

async function loadImport(): Promise<PartDImport | null> {
  try {
    return JSON.parse(await fs.readFile(/* turbopackIgnore: true */ DATA_FILE, "utf8")) as PartDImport;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

function findPlan(records: PartDPlanRecord[], planId: string) {
  return records.find((record) => record.plan.id === planId || `${record.plan.contractId}-${record.plan.planId}` === planId);
}

export async function listImportedPartDPlans(): Promise<{ status: "available" | "not-imported"; source?: CmsPartDSource; plans: PartDPlan[] }> {
  const imported = await loadImport();
  if (!imported) return { status: "not-imported", plans: [] };
  return { status: "available", source: imported.source, plans: imported.plans.map((record) => record.plan) };
}

export async function lookupPartDCoverage(therapyId: string, planId?: string): Promise<CoverageLookup> {
  const imported = await loadImport();
  if (!imported) {
    return {
      status: "not-imported",
      message: "No CMS Part D dermatology subset has been imported. Run the scheduled importer before presenting plan coverage.",
    };
  }

  if (!planId) return { status: "not-found", source: imported.source, message: "Select the patient’s Part D contract, plan, and segment before viewing plan coverage." };
  const record = findPlan(imported.plans, planId);
  if (!record) return { status: "not-found", source: imported.source, message: "The selected Part D plan is not in the current imported subset." };

  const coverage = record.coverages.find((entry) => entry.therapyId === therapyId);
  if (!coverage) return { status: "not-found", source: imported.source, plan: record.plan, message: "This product was not found for the selected plan and current import." };

  const alternatives = record.coverages
    .filter((entry) => entry.therapyId !== therapyId)
    .sort((left, right) => left.tier - right.tier || Number(left.priorAuthorizationRequired) - Number(right.priorAuthorizationRequired))
    .slice(0, 4)
    .map((entry) => ({
      therapyId: entry.therapyId,
      tier: entry.tier,
      priorAuthorizationRequired: entry.priorAuthorizationRequired,
      stepTherapyRequired: entry.stepTherapyRequired,
    }));

  return {
    status: "available",
    source: imported.source,
    plan: record.plan,
    coverage,
    costShares: record.costShares.filter((entry) => entry.daysSupply === 30 && entry.phase === "initial"),
    alternatives: alternatives.filter((entry) => dermatologyTherapies.some((therapy) => therapy.id === entry.therapyId)),
  };
}
