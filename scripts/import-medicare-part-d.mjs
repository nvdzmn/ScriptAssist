#!/usr/bin/env node

/**
 * Builds a small, plan-level CMS Part D subset for the ScriptAssist dermatology catalog.
 *
 * The CMS monthly archive is large (currently multiple GB), so run this in a scheduled
 * worker or CI job—not in the browser or a Next.js request. This script only writes rows
 * for the therapies below and emits no patient data.
 *
 * Examples:
 *   node scripts/import-medicare-part-d.mjs --zip /data/2026_20260916.zip
 *   node scripts/import-medicare-part-d.mjs --download --zip /data/2026_20260916.zip
 *
 * Move the resulting file to Supabase in production, or set CMS_PART_D_DATA_FILE to the
 * output path for local development.
 */

import { createWriteStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import readline from "node:readline";

const CMS_CATALOG_URL = "https://data.cms.gov/data.json";
const DATASET_TITLE = "Monthly Prescription Drug Plan Formulary and Pharmacy Network Information";
const DEFAULT_OUTPUT = "data/cms/part-d-dermatology.json";

const TARGETS = [
  ["tretinoin", "10753"], ["adapalene", "60223"], ["clindamycin", "2582"], ["doxycycline", "3640"],
  ["minocycline", "6980"], ["clobetasol", "2590"], ["triamcinolone", "10759"], ["tacrolimus", "42316"],
  ["pimecrolimus", "321952"], ["ketoconazole", "6135"], ["dupilumab", "1876376"], ["adalimumab", "327361"],
  ["risankizumab", "2166040"],
];

function parseArgs(args) {
  const options = { output: DEFAULT_OUTPUT, zip: "", download: false };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--zip") options.zip = args[index + 1] || "";
    if (args[index] === "--output") options.output = args[index + 1] || DEFAULT_OUTPUT;
    if (args[index] === "--download") options.download = true;
  }
  return options;
}

function run(command, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolvePromise(stdout) : reject(new Error(`${command} failed: ${stderr}`)));
  });
}

function parseLine(line, delimiter) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') { value += '"'; index += 1; } else quoted = !quoted;
    } else if (character === delimiter && !quoted) {
      values.push(value); value = "";
    } else value += character;
  }
  values.push(value);
  return values.map((value) => value.trim());
}

async function* archiveRows(zipPath, entry) {
  // CMS stores each table as a ZIP inside the monthly ZIP. `funzip` streams the
  // single CSV member out of that inner archive without creating a multi-GB copy.
  const outer = spawn("unzip", ["-p", zipPath, entry], { stdio: ["ignore", "pipe", "pipe"] });
  const inner = spawn("funzip", [], { stdio: ["pipe", "pipe", "pipe"] });
  outer.stdout.pipe(inner.stdin);
  const outerFinished = new Promise((resolvePromise) => outer.on("close", resolvePromise));
  const innerFinished = new Promise((resolvePromise) => inner.on("close", resolvePromise));
  let failure = "";
  outer.stderr.on("data", (chunk) => { failure += chunk; });
  inner.stderr.on("data", (chunk) => { failure += chunk; });
  const lineReader = readline.createInterface({ input: inner.stdout, crlfDelay: Infinity });
  let headers;
  let delimiter;
  for await (const line of lineReader) {
    if (!headers) {
      delimiter = line.includes("|") ? "|" : line.includes("\t") ? "\t" : ",";
      headers = parseLine(line.replace(/^\uFEFF/, ""), delimiter);
      continue;
    }
    const values = parseLine(line, delimiter);
    if (values.length !== headers.length) continue;
    yield Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  }
  const [outerCode, innerCode] = await Promise.all([
    outerFinished,
    innerFinished,
  ]);
  if (outerCode !== 0 || innerCode !== 0) throw new Error(`Could not read ${entry}: ${failure}`);
}

function one(value) { return ["1", "Y", "YES", "TRUE"].includes(String(value || "").toUpperCase()); }
function number(value) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : undefined; }
function normalized(value) { return value.toLowerCase().replace(/[^a-z0-9]/g, ""); }

function findEntry(entries, keywords) {
  const match = entries.find((entry) => {
    const searchable = normalized(entry);
    return keywords.every((keyword) => searchable.includes(normalized(keyword)));
  });
  if (!match) throw new Error(`Could not find archive table: ${keywords.join(" + ")}. Use 'unzip -Z1 <archive>' to inspect entries.`);
  return match;
}

async function getCmsSource() {
  const response = await fetch(CMS_CATALOG_URL);
  if (!response.ok) throw new Error(`CMS catalog request failed with ${response.status}`);
  const { dataset } = await response.json();
  const source = dataset?.find((entry) => entry.title === DATASET_TITLE)?.distribution?.find((entry) => entry.mediaType === "application/zip" && entry.downloadURL);
  if (!source?.downloadURL) throw new Error("CMS monthly Part D archive was not found.");
  return { title: source.title || DATASET_TITLE, publishedAt: source.modified || new Date().toISOString(), downloadUrl: source.downloadURL, source: "CMS Part D monthly formulary and pharmacy network file" };
}

async function expandRxCuis() {
  const targetsByRxcui = new Map();
  for (const [therapyId, ingredientRxcui] of TARGETS) {
    const concepts = new Set([ingredientRxcui]);
    const response = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${ingredientRxcui}/related.json?tty=SCD+SBD`);
    if (!response.ok) throw new Error(`RxNav lookup failed for ${therapyId}.`);
    const body = await response.json();
    for (const group of body.relatedGroup?.conceptGroup || []) {
      for (const concept of group.conceptProperties || []) concepts.add(concept.rxcui);
    }
    for (const rxcui of concepts) {
      const existing = targetsByRxcui.get(rxcui) || new Set();
      existing.add(therapyId);
      targetsByRxcui.set(rxcui, existing);
    }
  }
  return targetsByRxcui;
}

function planKey(row) { return `${row.CONTRACT_ID}-${row.PLAN_ID}-${row.SEGMENT_ID || "000"}`; }
function costPhase(value) { return value === "0" ? "pre-deductible" : value === "3" ? "catastrophic" : "initial"; }
function costType(value) { return value === "2" ? "coinsurance" : "copay"; }

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.zip) throw new Error("Pass --zip <local CMS archive path>. Add --download to download the current multi-GB file first.");

  const source = await getCmsSource();
  if (options.download) {
    const response = await fetch(source.downloadUrl);
    if (!response.ok || !response.body) throw new Error(`CMS archive download failed with ${response.status}.`);
    await mkdir(dirname(resolve(options.zip)), { recursive: true });
    await pipeline(Readable.fromWeb(response.body), createWriteStream(resolve(options.zip)));
  }

  const entries = (await run("unzip", ["-Z1", options.zip])).split("\n").filter(Boolean);
  const planInfoEntry = findEntry(entries, ["plan", "information"]);
  const formularyEntry = findEntry(entries, ["basic", "drugs", "formulary"]);
  const beneficiaryCostEntry = findEntry(entries, ["beneficiary", "cost"]);
  console.log("Resolving dermatology product concepts with RxNav…");
  const targetsByRxcui = await expandRxCuis();

  const plansByFormulary = new Map();
  console.log("Reading CMS plan information…");
  for await (const row of archiveRows(options.zip, planInfoEntry)) {
    if (!row.FORMULARY_ID || one(row.PLAN_SUPPRESSED_YN)) continue;
    const plan = {
      id: planKey(row), contractId: row.CONTRACT_ID, planId: row.PLAN_ID, segmentId: row.SEGMENT_ID || "000",
      name: row.PLAN_NAME || row.CONTRACT_NAME || row.CONTRACT_ID, state: row.STATE || undefined,
      countyCode: row.COUNTY_CODE || undefined, formularyId: row.FORMULARY_ID, deductible: number(row.DEDUCTIBLE),
    };
    // CMS repeats a plan once per service county. Retain one row per exact plan
    // contract/plan/segment instead of multiplying every formulary result.
    const current = plansByFormulary.get(row.FORMULARY_ID) || new Map();
    current.set(plan.id, plan); plansByFormulary.set(row.FORMULARY_ID, current);
  }

  const records = new Map();
  console.log("Matching CMS formulary rows for the dermatology catalog…");
  for await (const row of archiveRows(options.zip, formularyEntry)) {
    const therapies = targetsByRxcui.get(row.RXCUI);
    const plans = plansByFormulary.get(row.FORMULARY_ID);
    if (!therapies || !plans) continue;
    for (const plan of plans.values()) {
      const record = records.get(plan.id) || { plan, coverages: [], costShares: [], coverageKeys: new Set(), costKeys: new Set() };
      for (const therapyId of therapies) {
        const coverageKey = `${therapyId}:${row.NDC}`;
        if (record.coverageKeys.has(coverageKey)) continue;
        record.coverageKeys.add(coverageKey);
        record.coverages.push({
          therapyId, rxcui: row.RXCUI, ndc: row.NDC, tier: number(row.TIER_LEVEL_VALUE) || 0,
          priorAuthorizationRequired: one(row.PRIOR_AUTHORIZATION_YN), stepTherapyRequired: one(row.STEP_THERAPY_YN),
          quantityLimit: one(row.QUANTITY_LIMIT_YN) ? { amount: number(row.QUANTITY_LIMIT_AMOUNT) || 0, days: number(row.QUANTITY_LIMIT_DAYS) || 0 } : undefined,
        });
      }
      records.set(plan.id, record);
    }
  }

  console.log("Joining plan-level beneficiary cost sharing…");
  for await (const row of archiveRows(options.zip, beneficiaryCostEntry)) {
    const record = records.get(planKey(row));
    if (!record || !record.coverages.some((coverage) => coverage.tier === (number(row.TIER) || 0))) continue;
    for (const [suffix, pharmacy] of [["PREF", "preferred-retail"], ["NONPREF", "standard-retail"], ["MAIL_PREF", "preferred-mail"], ["MAIL_NONPREF", "standard-mail"]]) {
      const amount = number(row[`COST_AMT_${suffix}`]);
      const type = row[`COST_TYPE_${suffix}`];
      if (!amount || !type) continue;
      const costKey = `${row.COVERAGE_LEVEL}:${row.TIER}:${row.DAYS_SUPPLY}:${suffix}`;
      if (record.costKeys.has(costKey)) continue;
      record.costKeys.add(costKey);
      record.costShares.push({ phase: costPhase(row.COVERAGE_LEVEL), pharmacy, daysSupply: Number(row.DAYS_SUPPLY) === 2 ? 90 : Number(row.DAYS_SUPPLY) === 4 ? 60 : 30, type: costType(type), amount, minimum: number(row[`COST_MIN_AMT_${suffix}`]), maximum: number(row[`COST_MAX_AMT_${suffix}`]) });
    }
  }

  const output = { version: 1, source, importedAt: new Date().toISOString(), plans: [...records.values()].map(({ coverageKeys, costKeys, ...record }) => record) };
  await mkdir(dirname(resolve(options.output)), { recursive: true });
  await writeFile(resolve(options.output), `${JSON.stringify(output)}\n`);
  console.log(`Wrote ${output.plans.length} plan records to ${resolve(options.output)}.`);
}

main().catch((error) => { console.error(error.message); process.exit(1); });
