"use client";

import { useEffect, useMemo, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { StatusChip } from "@/components/home/StatusChip";
import { defaultDermatologyTherapy, dermatologyPatients, dermatologyTherapies, type DermatologyTherapy } from "@/data/dermatology";

type Tab = "coverage" | "prior" | "fulfillment";
type Plan = { id: string; name: string; contractId: string; planId: string; segmentId?: string; state?: string };
type Coverage = {
  status: "available" | "not-imported" | "not-found";
  message?: string;
  source?: { title: string; publishedAt: string };
  plan?: Plan;
  coverage?: { tier: number; priorAuthorizationRequired: boolean; stepTherapyRequired: boolean; quantityLimit?: { amount: number; days: number } };
  costShares?: Array<{ phase: string; pharmacy: string; daysSupply: number; type: "copay" | "coinsurance"; amount: number }>;
  alternatives?: Array<{ therapyId: string; tier: number; priorAuthorizationRequired: boolean; stepTherapyRequired: boolean }>;
};

function orderFor(therapy: DermatologyTherapy) {
  return { route: therapy.route, quantity: therapy.quantity, daysSupply: therapy.daysSupply, refills: "0", frequency: therapy.frequency, sig: therapy.sig, pharmacy: "Preferred pharmacy — verify NCPDP before transmission" };
}

function costLabel(cost?: NonNullable<Coverage["costShares"]>[number]) {
  if (!cost) return "No initial-coverage cost share in imported plan data";
  return cost.type === "copay" ? `$${cost.amount.toFixed(2)} copay` : `${Math.round(cost.amount * 100)}% coinsurance`;
}

export function PrescribeWorkspace() {
  const [tab, setTab] = useState<Tab>("coverage");
  const [panelWidth, setPanelWidth] = useState(420);
  const [therapyId, setTherapyId] = useState(defaultDermatologyTherapy.id);
  const [patientId, setPatientId] = useState<string>(dermatologyPatients[0].id);
  const [order, setOrder] = useState(() => orderFor(defaultDermatologyTherapy));
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planId, setPlanId] = useState("");
  const [coverage, setCoverage] = useState<Coverage | null>(null);
  const [coverageLoading, setCoverageLoading] = useState(false);
  const [coverageAttached, setCoverageAttached] = useState(false);
  const [labOrdered, setLabOrdered] = useState(false);
  const [bridgeRequested, setBridgeRequested] = useState(false);
  const [kitsRequested, setKitsRequested] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [signed, setSigned] = useState(false);

  const therapy = useMemo(() => dermatologyTherapies.find((entry) => entry.id === therapyId) || defaultDermatologyTherapy, [therapyId]);
  const patient = dermatologyPatients.find((entry) => entry.id === patientId) || dermatologyPatients[0];
  const planCost = coverage?.costShares?.find((entry) => entry.phase === "initial" && entry.pharmacy === "preferred-retail" && entry.daysSupply === 30);
  const paRequired = coverage?.coverage?.priorAuthorizationRequired;

  useEffect(() => {
    let active = true;
    fetch("/api/medicare-part-d/plans")
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result) => active && setPlans(result.plans || []))
      .catch(() => active && setPlans([]));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setOrder(orderFor(therapy));
    setCoverageAttached(false); setLabOrdered(false); setBridgeRequested(false); setKitsRequested(false); setSubmitted(false); setSigned(false);
  }, [therapy]);

  useEffect(() => {
    if (!planId) { setCoverage(null); return; }
    let active = true;
    setCoverageLoading(true);
    fetch(`/api/medicare-part-d/coverage?therapyId=${encodeURIComponent(therapy.id)}&planId=${encodeURIComponent(planId)}`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((result) => active && setCoverage(result))
      .catch(() => active && setCoverage({ status: "not-found", message: "Coverage lookup is unavailable. Retry after verifying the CMS Part D import." }))
      .finally(() => active && setCoverageLoading(false));
    return () => { active = false; };
  }, [planId, therapy.id]);

  function selectTherapy(nextId: string) { if (!signed) setTherapyId(nextId); }
  function updateOrder(field: keyof typeof order, value: string) { setOrder((current) => ({ ...current, [field]: value })); }
  function startResize(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault(); const startX = event.clientX; const startWidth = panelWidth;
    const oldCursor = document.body.style.cursor; const oldSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize"; document.body.style.userSelect = "none";
    const move = (moveEvent: PointerEvent) => setPanelWidth(Math.min(Math.min(720, window.innerWidth - 480), Math.max(300, startWidth - (moveEvent.clientX - startX))));
    const stop = () => { document.body.style.cursor = oldCursor; document.body.style.userSelect = oldSelect; window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", stop);
  }

  return <div className="rx" style={{ "--rx-panel-width": `${panelWidth}px` } as CSSProperties}>
    <div className="rx-main">
      <header className="rx-header"><div><p className="rx-crumb">Dermatology / New prescription</p><h1>{signed ? "Prescription transmitted" : "New dermatology prescription"}</h1></div><StatusChip status={signed ? { tone: "cleared", icon: "✓", label: "Order transmitted — alternatives locked" } : { tone: "info", icon: "•", label: "Draft — clinician review required" }} /></header>

      <section className="card rx-patient" aria-label="Patient"><div className="rx-patient-top"><div className="rx-who"><span className="rx-avatar">{patient.initials}</span><div><p className="rx-name">{patient.name}</p><p className="card-caption rx-meta">{patient.meta}</p></div></div><label className="rx-inline-select"><span className="sr-only">Change patient</span><select value={patientId} onChange={(event) => setPatientId(event.target.value)}>{dermatologyPatients.map((entry) => <option value={entry.id} key={entry.id}>{entry.name}</option>)}</select></label></div><dl className="rx-facts"><Fact label="Coverage" value={planId ? (coverage?.plan?.name || "CMS plan lookup in progress") : patient.insurance} /><Fact label="Diagnosis" value={patient.diagnosis} /><Fact label="Allergies" value={patient.allergies} /><Fact label="Prior therapies" value={patient.priorTreatments} /></dl></section>

      <section className="card rx-form"><header className="card-header"><h2>Medication</h2><p className="card-caption rx-aside-note">Product and dose stay editable; coverage rechecks when the product changes.</p></header>
        <Field label="Drug"><span className="rx-input"><select value={therapyId} onChange={(event) => selectTherapy(event.target.value)} disabled={signed}>{dermatologyTherapies.map((entry) => <option key={entry.id} value={entry.id}>{entry.genericName} — {entry.brandName} · {entry.presentation}</option>)}</select><span className="rx-code">RxCUI {therapy.rxcui}</span></span></Field>
        <div className="rx-grid-4"><InputField label="Route" value={order.route} onChange={(value) => updateOrder("route", value)} /><InputField label="Quantity" value={order.quantity} suffix={therapy.quantityUnit} onChange={(value) => updateOrder("quantity", value)} /><InputField label="Days supply" value={order.daysSupply} suffix="days" onChange={(value) => updateOrder("daysSupply", value)} /><InputField label="Refills" value={order.refills} onChange={(value) => updateOrder("refills", value)} /></div>
        <div className="rx-grid-2"><InputField label="Frequency" value={order.frequency} onChange={(value) => updateOrder("frequency", value)} /><Field label="Indication"><span className="rx-input"><input value={therapy.indication} readOnly aria-label="Indication" /><span className="rx-code">Dermatology</span></span></Field></div>
        <Field label="Directions (SIG)"><span className="rx-input rx-input-tall"><textarea value={order.sig} aria-label="Directions (SIG)" rows={2} onChange={(event) => updateOrder("sig", event.target.value)} /></span></Field>
        <Field label="Part D plan"><span className="rx-input"><select value={planId} onChange={(event) => setPlanId(event.target.value)}><option value="">Select a plan from the CMS import</option>{plans.map((plan) => <option value={plan.id} key={plan.id}>{plan.name} · {plan.contractId}-{plan.planId}-{plan.segmentId || "000"}{plan.state ? ` · ${plan.state}` : ""}</option>)}</select></span></Field>
      </section>

      <footer className="rx-footer"><StatusChip status={signed ? { tone: "cleared", icon: "✓", label: "Order recorded in patient history" } : paRequired ? { tone: "action", icon: "!", label: "Plan-level PA flag requires verification" } : { tone: "info", icon: "•", label: "Select a Part D plan to check coverage" }} /><div className="rx-footer-actions"><button className="button-secondary" type="button" onClick={() => setSubmitted(false)}>Save draft</button><button className="button-primary" type="button" disabled={signed} onClick={() => setSigned(true)}>{signed ? "Order transmitted" : "Review and sign →"}</button></div></footer>
    </div>

    <aside className="rx-panel" aria-label="ScriptAssist access agent"><button type="button" className="rx-resize" aria-label="Resize ScriptAssist panel" onPointerDown={startResize} /><div className="rx-panel-head"><div className="rx-panel-title"><img src="/brand-mark.svg" alt="" width={40} height={24} /><h2>ScriptAssist</h2></div><p className="card-caption rx-synced">Dermatology access review · {therapy.brandName} · {patient.name}</p></div>
      <div className="rx-tabs" role="tablist"><TabButton id="coverage" current={tab} onSelect={setTab}>Coverage</TabButton><TabButton id="prior" current={tab} onSelect={setTab} badge={paRequired ? "!" : undefined} badgeTone="action">Prior auth</TabButton><TabButton id="fulfillment" current={tab} onSelect={setTab}>Fulfillment</TabButton></div>
      {tab === "coverage" && <div className="rx-panel-body" role="tabpanel">
        <article className="rx-block"><p className="rx-kicker">CMS Part D formulary</p><p className="rx-block-title">{coverageLoading ? "Checking plan data…" : coverage?.status === "available" ? `Tier ${coverage.coverage?.tier}` : "Plan selection required"}</p>{coverage?.status === "available" ? <StatusChip status={{ tone: "cleared", icon: "✓", label: "CMS product-family candidate found" }} /> : <StatusChip status={{ tone: "info", icon: "•", label: "No patient-specific coverage claim" }} />}<p className="card-caption">{coverage?.message || coverage?.source?.title || "Import the current CMS Part D subset, then select the patient’s exact contract, plan, and segment."} {coverage?.status === "available" ? "Confirm the prescribed package NDC before relying on this result." : ""}</p></article>
        <article className="rx-block"><p className="rx-kicker">Plan-level cost share</p><div className="rx-compare"><div><p className="card-caption">Initial coverage · preferred retail · 30 days</p><p className="rx-strike">{costLabel(planCost)}</p></div><span className="rx-arrow">→</span><div className="rx-pays"><p>Not a final copay</p><p className="rx-pays-amount">Verify at pharmacy</p></div></div><p className="card-caption">CMS plan data does not account for the beneficiary’s deductible, benefit phase, pharmacy adjudication, or assistance-program eligibility.</p></article>
        <article className="rx-block"><p className="rx-kicker">Coverage attachment</p><p className="card-caption">Attach the imported formulary result to the draft. Manufacturer savings eligibility is intentionally not claimed until an approved program source is connected.</p><button className="button-primary rx-wide" type="button" disabled={coverage?.status !== "available" || coverageAttached} onClick={() => setCoverageAttached(true)}>{coverageAttached ? "Coverage summary attached" : "Attach coverage summary"}</button></article>
        <Alternatives alternatives={coverage?.alternatives} disabled={signed} onSelect={selectTherapy} />
      </div>}
      {tab === "prior" && <div className="rx-panel-body" role="tabpanel"><article className="rx-block"><p className="rx-kicker">Prior authorization signal</p><p className="rx-block-title">{coverage?.status === "available" ? paRequired ? "Plan reports PA required" : "No PA flag in current import" : "Coverage not loaded"}</p><p className="card-caption">CMS formulary files provide a PA and step-therapy flag. They do not provide the plan’s patient-specific decision or full clinical documentation criteria.</p>{coverage?.coverage?.stepTherapyRequired && <StatusChip status={{ tone: "action", icon: "!", label: "Step therapy flag reported" }} />}</article><article className="rx-block"><p className="rx-kicker">Documentation actions</p><p className="card-caption">Record only clinician-reviewed evidence. This demo does not create a real PA request.</p><button className="button-primary rx-wide" type="button" disabled={labOrdered} onClick={() => setLabOrdered(true)}>{labOrdered ? "Lab order recorded" : "Record required lab review"}</button><button className="button-secondary rx-wide" type="button" disabled={!paRequired || submitted} onClick={() => setSubmitted(true)}>{submitted ? "PA packet marked ready" : "Prepare PA packet"}</button></article></div>}
      {tab === "fulfillment" && <div className="rx-panel-body" role="tabpanel"><article className="rx-option"><div className="rx-option-head"><p className="patient-name">Bridge-support review</p><StatusChip status={{ tone: "info", icon: "•", label: "Verification required" }} /></div><p className="rx-option-copy">Record a request for manufacturer or foundation support. Availability and eligibility must be verified outside this demo.</p><button className="button-secondary rx-wide" type="button" disabled={bridgeRequested} onClick={() => setBridgeRequested(true)}>{bridgeRequested ? "Bridge review requested" : "Request bridge review"}</button></article><article className="rx-option"><div className="rx-option-head"><p className="patient-name">Clinic sample inventory</p><StatusChip status={{ tone: "info", icon: "•", label: "Demo workflow" }} /></div><p className="rx-option-copy">Record a clinic inventory request; no supplier order is transmitted.</p><button className="button-secondary rx-wide" type="button" disabled={kitsRequested} onClick={() => setKitsRequested(true)}>{kitsRequested ? "Inventory request recorded" : "Request inventory review"}</button></article></div>}
    </aside>
  </div>;
}

function Fact({ label, value }: { label: string; value: string }) { return <div><dt>{label}</dt><dd>{value}</dd></div>; }
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="rx-field"><span>{label}</span>{children}</label>; }
function InputField({ label, value, suffix, onChange }: { label: string; value: string; suffix?: string; onChange: (value: string) => void }) { return <Field label={label}><span className="rx-input"><input value={value} aria-label={label} onChange={(event) => onChange(event.target.value)} />{suffix && <span className="rx-unit">{suffix}</span>}</span></Field>; }
function TabButton({ id, current, onSelect, badge, badgeTone, children }: { id: Tab; current: Tab; onSelect: (tab: Tab) => void; badge?: string; badgeTone?: "cleared" | "action"; children: string }) { const selected = current === id; return <button type="button" role="tab" aria-selected={selected} className={selected ? "is-selected" : ""} onClick={() => onSelect(id)}>{children}{badge && <span className={`rx-badge rx-badge-${badgeTone}`}>{badge}</span>}</button>; }
function Alternatives({ alternatives, disabled, onSelect }: { alternatives?: Coverage["alternatives"]; disabled: boolean; onSelect: (id: string) => void }) { if (!alternatives?.length) return <article className="rx-block"><p className="rx-kicker">Plan alternatives</p><p className="card-caption">Select an imported plan to see other products from the dermatology catalog that appear on its formulary. Review clinical suitability before changing therapy.</p></article>; return <article className="rx-block"><p className="rx-kicker">Plan alternatives</p>{alternatives.map((alternative) => { const therapy = dermatologyTherapies.find((entry) => entry.id === alternative.therapyId); if (!therapy) return null; return <button className="rx-next" type="button" disabled={disabled} key={alternative.therapyId} onClick={() => onSelect(alternative.therapyId)}><span><span className="patient-name">{therapy.genericName} · {therapy.brandName}</span><span className="card-caption">Tier {alternative.tier}{alternative.priorAuthorizationRequired ? " · PA flag" : ""}{alternative.stepTherapyRequired ? " · Step therapy flag" : ""}</span></span><span aria-hidden="true">→</span></button>; })}</article>; }
