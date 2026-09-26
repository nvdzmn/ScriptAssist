"use client";

import { useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { StatusChip } from "@/components/home/StatusChip";
import { coverage, criteria, prescription } from "@/data/prescribe";

type Tab = "coverage" | "prior" | "fulfillment";

export function PrescribeWorkspace() {
  const [tab, setTab] = useState<Tab>("coverage");
  const [panelWidth, setPanelWidth] = useState(420);
  const [labOrdered, setLabOrdered] = useState(false);
  const [attached, setAttached] = useState(false);
  const [bridgeOn, setBridgeOn] = useState(false);
  const [kitsRequested, setKitsRequested] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [draftLabel, setDraftLabel] = useState(prescription.draft);

  const ready = labOrdered;

  function startResize(event: ReactPointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = panelWidth;
    const previousCursor = document.body.style.cursor;
    const previousSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    function move(moveEvent: PointerEvent) {
      const next = startWidth - (moveEvent.clientX - startX);
      const max = Math.min(720, window.innerWidth - 480);
      setPanelWidth(Math.min(max, Math.max(300, next)));
    }

    function stop() {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousSelect;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  }

  return (
    <div className="rx" style={{ "--rx-panel-width": `${panelWidth}px` } as CSSProperties}>
      <div className="rx-main">
        <header className="rx-header">
          <div>
            <p className="rx-crumb">{prescription.breadcrumb}</p>
            <h1>{prescription.title}</h1>
          </div>
          <StatusChip status={{ tone: "info", icon: "•", label: draftLabel }} />
        </header>

        <section className="card rx-patient" aria-label="Patient">
          <div className="rx-patient-top">
            <div className="rx-who">
              <span className="rx-avatar" aria-hidden="true">
                {prescription.patient.initials}
              </span>
              <div>
                <p className="rx-name">{prescription.patient.name}</p>
                <p className="card-caption rx-meta">{prescription.patient.meta}</p>
              </div>
            </div>
            <button type="button" className="button-secondary">
              Change patient
            </button>
          </div>
          <dl className="rx-facts">
            <div>
              <dt>Insurance</dt>
              <dd>{prescription.patient.insurance}</dd>
            </div>
            <div>
              <dt>Diagnosis</dt>
              <dd>{prescription.patient.diagnosis}</dd>
            </div>
            <div>
              <dt>Allergies</dt>
              <dd>{prescription.patient.allergies}</dd>
            </div>
            <div>
              <dt>Prior treatments</dt>
              <dd>{prescription.patient.priorTreatments}</dd>
            </div>
          </dl>
        </section>

        <section className="card rx-form" aria-labelledby="medication-title">
          <header className="card-header">
            <h2 id="medication-title">Medication</h2>
            <p className="card-caption rx-aside-note">Access agent checks run as you type</p>
          </header>
          <Field label="Drug">
            <span className="rx-input">
              <input defaultValue={prescription.drug} aria-label="Drug" />
              <span className="rx-code">{prescription.ndc}</span>
            </span>
          </Field>
          <div className="rx-grid-4">
            <Field label="Route">
              <span className="rx-input">
                <input defaultValue={prescription.route} aria-label="Route" />
              </span>
            </Field>
            <Field label="Quantity">
              <span className="rx-input">
                <input defaultValue={prescription.quantity} aria-label="Quantity" />
                <span className="rx-unit">{prescription.quantityUnit}</span>
              </span>
            </Field>
            <Field label="Days supply">
              <span className="rx-input">
                <input defaultValue={prescription.daysSupply} aria-label="Days supply" />
                <span className="rx-unit">days</span>
              </span>
            </Field>
            <Field label="Refills">
              <span className="rx-input">
                <input defaultValue={prescription.refills} aria-label="Refills" />
              </span>
            </Field>
          </div>
          <div className="rx-grid-2">
            <Field label="Frequency">
              <span className="rx-input">
                <input defaultValue={prescription.frequency} aria-label="Frequency" />
              </span>
            </Field>
            <Field label="Diagnosis">
              <span className="rx-input">
                <input defaultValue={prescription.diagnosis} aria-label="Diagnosis" />
                <span className="rx-code">{prescription.icd}</span>
              </span>
            </Field>
          </div>
          <Field label="Directions (SIG)">
            <span className="rx-input rx-input-tall">
              <textarea defaultValue={prescription.sig} aria-label="Directions (SIG)" rows={2} />
            </span>
          </Field>
          <Field label="Pharmacy">
            <span className="rx-input">
              <input defaultValue={prescription.pharmacy} aria-label="Pharmacy" />
              <span className="rx-code">{prescription.ncpdp}</span>
            </span>
          </Field>
        </section>

        <footer className="rx-footer">
          <StatusChip
            status={
              ready
                ? { tone: "cleared", icon: "✓", label: "All checks clear · ready to sign" }
                : { tone: "action", icon: "!", label: "1 item in Prior-auth needs attention" }
            }
          />
          <div className="rx-footer-actions">
            <button type="button" className="button-secondary" onClick={() => setDraftLabel("Draft saved just now")}>
              Save draft
            </button>
            <button type="button" className="button-primary">
              Review and sign <span aria-hidden="true">→</span>
            </button>
          </div>
        </footer>
      </div>

      <aside className="rx-panel" aria-label="Access agent">
          <button type="button" className="rx-resize" aria-label="Resize access agent" onPointerDown={startResize} />
          <div className="rx-panel-head">
            <div className="rx-panel-title">
              <img src="/brand-mark.svg" alt="" width={40} height={24} />
              <h2>Access agent</h2>
            </div>
            <p className="card-caption rx-synced">Stelazio 45 mg · Maria Chen · synced just now</p>
          </div>
          <div className="rx-tabs" role="tablist" aria-label="Access agent">
            <TabButton id="coverage" current={tab} onSelect={setTab} badge="✓" badgeTone="cleared">
              Coverage
            </TabButton>
            <TabButton id="prior" current={tab} onSelect={setTab} badge={ready ? "✓" : "1"} badgeTone={ready ? "cleared" : "action"}>
              Prior-auth
            </TabButton>
            <TabButton id="fulfillment" current={tab} onSelect={setTab}>
              Fulfillment
            </TabButton>
          </div>
          {tab === "coverage" && (
            <div className="rx-panel-body" role="tabpanel">
              <article className="rx-block">
                <p className="rx-kicker">Formulary status</p>
                <p className="rx-block-title">{coverage.tier}</p>
                <StatusChip status={{ tone: "action", icon: "!", label: "Prior authorization required" }} />
                <p className="card-caption">{coverage.plan}</p>
              </article>
              <article className="rx-block">
                <p className="rx-kicker">Patient cost</p>
                <div className="rx-compare">
                  <div>
                    <p className="card-caption">Without co-pay card</p>
                    <p className="rx-strike">{coverage.without}</p>
                  </div>
                  <span className="rx-arrow" aria-hidden="true">
                    →
                  </span>
                  <div className="rx-pays">
                    <p>Patient pays</p>
                    <p className="rx-pays-amount">{coverage.with}</p>
                  </div>
                </div>
                <StatusChip status={{ tone: "cleared", icon: "✓", label: "Eligible for manufacturer co-pay card" }} />
              </article>
              <article className="rx-block">
                <p className="rx-kicker">Secondary billing</p>
                <dl className="rx-billing">
                  {coverage.billing.map((row) => (
                    <div key={row.label}>
                      <dt>{row.label}</dt>
                      <dd>{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
              <button type="button" className="button-primary rx-wide" onClick={() => setAttached(true)} disabled={attached}>
                {attached ? "Attached to e-script" : "Attach to e-script"}
              </button>
              <p className="card-caption rx-fine">Real-time benefit check via PBM · NCPDP secondary payer segment</p>
              <button type="button" className="rx-next" onClick={() => setTab("prior")}>
                <span>
                  <span className="patient-name">Next: Prior-auth</span>
                  <span className="card-caption">{ready ? "Criteria met" : "Missing negative TB screening"}</span>
                </span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
          {tab === "prior" && (
            <div className="rx-panel-body" role="tabpanel">
              <article className="rx-block">
                <p className="rx-kicker">Payer criteria</p>
                <div className="rx-criteria-head">
                  <p className="rx-block-title">{ready ? "3 of 3 met" : "2 of 3 met"}</p>
                  <StatusChip
                    status={
                      ready
                        ? { tone: "cleared", icon: "✓", label: "Ready to submit" }
                        : { tone: "action", icon: "!", label: "1 missing" }
                    }
                  />
                </div>
                <div className="rx-progress" aria-hidden="true">
                  <span className="is-filled" />
                  <span className="is-filled" />
                  <span className={ready ? "is-filled" : ""} />
                </div>
                <p className="card-caption">Horizon PPO policy RX-DERM-114 for Stelazio · via Da Vinci CRD</p>
              </article>
              <ul className="rx-checklist">
                {criteria.map((item) => {
                  const met = item.id !== "tb" || labOrdered;
                  return (
                    <li key={item.id} className={met ? "is-met" : "is-missing"}>
                      <span className="rx-check-icon" aria-hidden="true">
                        {met ? "✓" : "!"}
                      </span>
                      <div>
                        <p className="patient-name">{item.title}</p>
                        <p className="card-caption">
                          {item.id === "tb" && labOrdered ? "QuantiFERON-TB Gold ordered just now." : item.detail}
                        </p>
                        <p className="rx-source">
                          <span>{item.id === "tb" && labOrdered ? "Lab order · just now" : item.source}</span>
                          <button type="button">View source</button>
                        </p>
                        {item.id === "tb" && !labOrdered && (
                          <button type="button" className="button-primary rx-order" onClick={() => setLabOrdered(true)}>
                            Order QuantiFERON-TB Gold
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <button type="button" className="button-secondary rx-wide" disabled={!ready || submitted} onClick={() => setSubmitted(true)}>
                {submitted ? "Prior auth submitted" : "Submit prior auth"}
              </button>
              <p className="card-caption rx-fine">Submit once all criteria are met to avoid a denial.</p>
              <div className="rx-denied">
                <span>
                  <span className="patient-name">If the payer denies</span>
                  <span className="card-caption">Build a peer-to-peer defense brief</span>
                </span>
                <button type="button" className="button-ghost">
                  Generate brief →
                </button>
              </div>
            </div>
          )}
          {tab === "fulfillment" && (
            <div className="rx-panel-body" role="tabpanel">
              <div className="rx-intro">
                <h3>Start Maria on therapy today</h3>
                <p>Accredo typically takes 2–3 weeks to fill specialty scripts. Choose how she gets her first doses.</p>
              </div>
              <article className="rx-option">
                <div className="rx-option-head">
                  <div>
                    <StatusChip status={{ tone: "cleared", icon: "✓", label: "Recommended · clinic stock is 0" }} />
                    <p className="patient-name">14-day free bridge supply</p>
                  </div>
                  <button
                    type="button"
                    className={bridgeOn ? "switch is-on" : "switch"}
                    role="switch"
                    aria-checked={bridgeOn}
                    aria-label="14-day free bridge supply"
                    onClick={() => setBridgeOn((on) => !on)}
                  >
                    <span />
                  </button>
                </div>
                <p className="rx-option-copy">Manufacturer ships a starter pack to her home at no cost while insurance processes.</p>
                <dl className="rx-billing">
                  <div>
                    <dt>Ships to</dt>
                    <dd className="rx-plain">Home · Atlanta, GA 30309</dd>
                  </div>
                  <div>
                    <dt>Patient cost</dt>
                    <dd className="rx-plain">$0</dd>
                  </div>
                  <div>
                    <dt>Arrives</dt>
                    <dd className="rx-plain">In 2 days · Mon, Sep 28</dd>
                  </div>
                  <div>
                    <dt>Supply</dt>
                    <dd className="rx-plain">1 syringe · covers week 0 dose</dd>
                  </div>
                </dl>
                <p className="card-caption">Maria gets a text to confirm her address before it ships.</p>
              </article>
              <article className="rx-option">
                <div className="rx-option-head">
                  <p className="patient-name">In-clinic sample restock</p>
                  <StatusChip status={{ tone: "blocked", icon: "×", label: "0 in stock" }} />
                </div>
                <p className="rx-option-copy">Order starter kits to your clinic so future patients can start the same day.</p>
                <dl className="rx-billing">
                  <div>
                    <dt>Supplier</dt>
                    <dd className="rx-plain">McKesson · overnight</dd>
                  </div>
                  <div>
                    <dt>Arrives</dt>
                    <dd className="rx-plain">Tomorrow by 10:30 AM</dd>
                  </div>
                  <div>
                    <dt>Clinic DEA / NPI</dt>
                    <dd className="rx-plain">Verified</dd>
                  </div>
                </dl>
                <button type="button" className="button-secondary rx-wide" disabled={kitsRequested} onClick={() => setKitsRequested(true)}>
                  {kitsRequested ? "Starter kits requested" : "Request 2 starter kits"}
                </button>
                <p className="card-caption">Requires your electronic signature (PDMA sample request).</p>
              </article>
              <p className="card-caption rx-fine">Fulfillment is optional. The e-script still goes to Accredo Specialty Pharmacy.</p>
            </div>
          )}
        </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="rx-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function TabButton({
  id,
  current,
  onSelect,
  badge,
  badgeTone,
  children,
}: {
  id: Tab;
  current: Tab;
  onSelect: (tab: Tab) => void;
  badge?: string;
  badgeTone?: "cleared" | "action";
  children: string;
}) {
  const selected = current === id;
  return (
    <button type="button" role="tab" aria-selected={selected} className={selected ? "is-selected" : ""} onClick={() => onSelect(id)}>
      {children}
      {badge && <span className={`rx-badge rx-badge-${badgeTone}`}>{badge}</span>}
    </button>
  );
}
